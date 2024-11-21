"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const Payment = () => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showCryptoOptions, setShowCryptoOptions] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [changeInPrice, SetChangeInPrice] = useState<number | null>(0);
  // New state for selected card (Ethereum or USDT)
  const [showUSDTCard, setShowUSDTCard] = useState(false);
  const [showCryptoPaymentCard, setShowCryptoPaymentCard] = useState(false); // For Bitcoin and Polygon
  const [cryptoAmount, setCryptoAmount] = useState<string>("");
  const [price, setPrice] = useState<string | null>(null);
  const [bitcoinPrice, setBitcoinPrice] = useState<number | number>();
  const [polygonPrice, setPolygonPrice] = useState<number | null>(null);
  const [ethereumPrice, setEthereumPrice] = useState<number | null>(null);
  const [usdtToBitcoin, setUsdtToBitcoin] = useState<number | null>(null);
  const [usdtToPolygon, setUsdtToPolygon] = useState<number | null>(null);
  const [usdtToEthereum, setUsdtToEthereum] = useState<number | null>(null);

  const [usdtAmount, setUsdtAmount] = useState<number>(0); // Value entered in USD
  const [btcRate, setBtcRate] = useState<number>(0); // BTC to USD rate
  const [ethRate, setEthRate] = useState<number>(0); // ETH to USD rate
  const [maticRate, setMaticRate] = useState<number>(0); // MATIC to USD rate

  // Fetch the exchange rates when the component mounts
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get('http://api.coinlayer.com/live', {
          params: {
            access_key: 'e229d2ea5f8c7ed68f40f080a9d5f8d6', // Replace with your access key
          },
        });

        // Extract exchange rates for Bitcoin, Ethereum, and Polygon from the response
        const rates = response.data.rates;
        setBtcRate(rates.BTC);
        setEthRate(rates.ETH);
        setMaticRate(rates.MATIC);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  // Calculate the cryptocurrency amounts based on the entered USDT value
  const calculateCryptoAmount = (usdt: number, rate: number) => {
    return (usdt / rate).toFixed(6); // Convert USD to crypto with 6 decimal precision
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsdtAmount(Number(e.target.value));
  };





 

  const handleCardSelection = async (type: string) => {
    setSelectedPayment(type);

    if (type === "Card Payment") {
      try {
        const {
          data: { url },
        } = await axios.post("/api/payment", {
          name: "Sample Product",
          price: 1000,
        });
        window.location.href = url;
      } catch (error) {
        console.error("Error redirecting to Stripe Checkout", error);
      }
    } else if (type === "Crypto") {
      setShowCryptoOptions(true);
    }
  };

  const handleTokenSelection = (tokenName: string) => {
    setSelectedToken(tokenName);
    setSelectedCrypto(null);
    setShowCryptoOptions(false);
  };

  

  const handleCryptoSelection = (crypto: string) => {
    setSelectedCrypto(crypto);
    if (crypto === "Ethereum") {
      setShowCryptoPaymentCard(false); // Ethereum has additional sub-options
    } else {
      setShowCryptoPaymentCard(true); // For Bitcoin and Polygon
    }
  };

  const handleCardClick = (cardType: string) => {
    setSelectedCard(cardType);
    setShowCryptoPaymentCard(true); // Show payment card for any sub-selection
    if (cardType === "USDT") {
      setPrice("1000"); // Example: Price logic for USDT
    }
  };

 
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl p-8">
        {/* Profile Section */}
        <div className="gap-6">
          <div className="font-sans p-6">
            <div className="mb-8 flex items-center gap-6 rounded-lg border border-gray-300 bg-gray-100 p-4">
              <div className="h-24 w-24">
                <img
                  src="images/user/user-02.png"
                  alt="Profile Avatar"
                  className="h-full w-full rounded-full border-4 border-gray-500 object-cover shadow-9"
                />
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-bold text-black">Name:</span> Alice
                </p>
                <p>
                  <span className="font-bold text-black">Wallet Address:</span>{" "}
                  0x1234...abcd
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Section */}
        <div className="mb-18">
          <h1 className="mb-4 text-center text-2xl font-semibold text-gray-500   ">
            Stock
          </h1>
          <div className="flex flex-wrap justify-center gap-20">
            {[
              {
                name: "Gold",
                price: "$1500",
                img: "/images/logo/Gold.png",
                tokens: 100,
              },
              {
                name: "AG (Silver)",
                price: "$2000",
                img: "/images/logo/sliver.png",
                tokens: 200,
              },
              {
                name: "Agua",
                price: "$3000",
                img: "/images/logo/agua-logo.png",
                tokens: 50,
              },
            ].map((stock, index) => (
              <div
                key={index}
                className="w-72 rounded-lg border-2 border-gray-600 bg-gray-800 p-10 text-center shadow-lg transition-all duration-300 ease-in-out hover:bg-gray-700 hover:shadow-xl"
              >
                <div className="mx-auto mb-4 h-24 w-24">
                  <img
                    src={stock.img}
                    alt={`${stock.name} Logo`}
                    className="h-full w-full rounded-full border-4 border-white object-cover"
                  />
                </div>
                <div className="text-xl font-medium text-gray-200">
                  {stock.name}
                </div>
                <div className="mt-2 text-lg font-semibold text-gray-400">
                  {stock.tokens} Tokens
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Token Selection Section */}
        <div className="mb-8">
          <h1 className="mb-4 text-center text-2xl font-semibold">
            Selection of Token
          </h1>
          <div className="flex flex-wrap justify-center gap-20">
            {[
              {
                name: "AU (Gold)",
                price: "$1000",
                img: "/images/logo/Gold.png",
              },
              {
                name: "AG (Silver)",
                price: "$2000",
                img: "/images/logo/sliver.png",
              },
              {
                name: "Agua",
                price: "$3000",
                img: "/images/logo/agua-logo.png",
              },
            ].map((token, index) => (
              <div
                key={index}
                onClick={() => handleTokenSelection(token.name)}
                className={`w-52 cursor-pointer rounded-lg border border-gray-300 p-8 text-center shadow-md ${
                  selectedToken === token.name ? "bg-white" : "bg-gray-300"
                }`}
              >
                <div className="mx-auto mb-4 h-16 w-16">
                  <img
                    src={token.img}
                    alt={`${token.name} Token Logo`}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                <div className="text-lg font-semibold text-black">
                  {token.price}
                </div>
                <div className="text-base font-medium text-gray-600">
                  {token.name}
                </div>
                {selectedToken === token.name && (
                  <div className="mt-2 text-sm font-semibold text-blue-500">
                    Selected
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment System Section */}
        {selectedToken && (
          <div className="mt-12 flex flex-col items-center">
            <h1 className="mb-6 text-2xl font-semibold">Payment System</h1>
            <div className="mb-8 mt-2 flex gap-12">
              <div
                onClick={() => handleCardSelection("Card Payment")}
                className={`flex-2 cursor-pointer  rounded-lg border border-gray-300 p-10 text-center shadow-sm ${
                  selectedPayment === "Card Payment"
                    ? "bg-white"
                    : "bg-gray-300"
                }`}
              >
                <h2 className="text-lg font-bold text-gray-800">
                  Card Payment
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Use your credit or debit card
                </p>
              </div>
              <div
                onClick={() => handleCardSelection("Crypto")}
                className={`flex-2 cursor-pointer rounded-lg border border-gray-300 p-8 text-center shadow-sm ${
                  selectedPayment === "Crypto" ? "bg-white" : "bg-gray-300"
                }`}
              >
                <h2 className="text-lg font-bold text-gray-800">Crypto</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Pay using cryptocurrency
                </p>
              </div>
            </div>

            {/* Crypto Options */}
            {showCryptoOptions && (
              <div className="flex flex-wrap justify-center gap-20">
                {[
                  { name: "Ethereum", img: "/images/logo/etherum.png" },
                  { name: "Bitcoin", img: "/images/logo/bitcoin.png" },
                  { name: "Polygon", img: "/images/logo/polygon.png" },
                ].map((crypto, index) => (
                  <div
                    key={index}
                    onClick={() => handleCryptoSelection(crypto.name)}
                    className={`mt-10 w-52 cursor-pointer rounded-lg border border-gray-300 p-8 text-center shadow-md ${
                      selectedCrypto === crypto.name
                        ? "bg-white"
                        : "bg-gray-300"
                    }`}
                  >
                    <div className="mx-auto mb-4 h-16 w-16">
                      <img
                        src={crypto.img}
                        alt={`${crypto.name} Logo`}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    <div className="text-lg font-semibold text-black">
                      {crypto.name}
                    </div>
                  </div>
                ))}
              </div>
            )}


            {selectedCrypto === "Ethereum" && (
                
              <div className="mt-8 flex flex-wrap justify-center gap-20">
                <div
                  onClick={() => handleCardClick("Ethereum")}
                  className={`mt-10 w-52 cursor-pointer rounded-lg border border-gray-300 p-8 text-center shadow-md ${
                    selectedCard === "Ethereum" ? "bg-white" : "bg-gray-300"
                  }`}
                >
                  <div className="mx-auto mb-4 h-16 w-16">
                    <img
                      src="/images/logo/Ether.png"
                      alt="Ethers Logo"
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <div className="text-lg font-semibold text-black">Ethers</div>
                </div>

                <div
                  onClick={() => handleCardClick("USDT")}
                  className={`mt-10 w-52 cursor-pointer rounded-lg border border-gray-300 p-8 text-center shadow-md ${
                    selectedCard === "USDT" ? "bg-white" : "bg-gray-300"
                  }`}
                >
                  <div className="mx-auto mb-4 h-16 w-16">
                    <img
                      src="/images/logo/ustd.png"
                      alt="USDT Logo"
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <div className="text-lg font-semibold text-black">USDT</div>
                </div>
              </div>
            )}

            {showUSDTCard && (
              <div className="mt-12 w-180 rounded-lg bg-gray-900 p-8 text-center shadow-md">
                <h2 className="text-lg font-semibold text-white">
                  USDT Payment
                </h2>
                <p className="mt-4 text-white">
                  Send the required amount of USDT:
                </p>

                <div className="mt-4 flex flex-col items-center">
                  <input
                    type="number"
                    placeholder="Enter USDT Amount"
                    className="w-64 rounded-lg border border-gray-300 bg-white px-3 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={changeInPrice !== null ? changeInPrice : ""}
                    onChange={async (e) => {
                      console.log("change in Pirce", bitcoinPrice);
                      const response = await axios.get(
                        "https://api.coinlayer.com/live?access_key=374fbb63dfff515ce8c6c1001f17e1d3",
                      );
                      let change: number =
                        (1 / Number(response.data.rates.BTC)) *
                        Number(e.target.value);
                      SetChangeInPrice(change);
                      console.log("USDT Value:", response.data.rates.BTC);
                      console.log(
                        "change in Pirce",
                        response.data.rates.BTC,
                        change,
                      );
                    }}
                  />

                  <button
                    // onClick={() =>
                    //   console.log("Proceeding with payment...", changeInPrice)
                    // }
                    className="mt-4 rounded-lg bg-red-700 px-8 py-2 text-white transition duration-300 hover:bg-blue-500"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}

            {/* Crypto Payment Card */}
            {showCryptoPaymentCard && selectedCrypto && (
              <div className="mt-12 w-full rounded-lg bg-gray-900 p-8 text-center shadow-md">
                {/* Payment Card Header */}
                <h2 className="text-lg font-semibold text-white">
                  {selectedCrypto} Payment
                </h2>

                {/* Wallet Address */}
                <div className="mt-2 text-sm text-gray-400">
                  {selectedCrypto === "USDT" && (
                    <p className="text-lg font-semibold text-white">
                      Wallet Address: 0xUSDT...abcd
                    </p>
                  )}
                  {selectedCrypto === "Bitcoin" && (
                    <p className="text-lg font-semibold text-white">
                      Wallet Address: 0xBTC...abcd
                    </p>
                  )}
                  {selectedCrypto === "Polygon" && (
                    <p className="text-lg font-semibold text-white">
                      Wallet Address: 0xPOLY...abcd
                    </p>
                  )}
                  {selectedCrypto === "Ethereum" && (
                    <p className="text-lg font-semibold text-white">
                      Wallet Address: 0xETH...abcd
                    </p>
                  )}
                </div>

                {/* Token Details */}
                <div className="mt-4 text-white">
                  {selectedToken === "AU (Gold)" && (
                    <>
                      <p>
                        Bitcoin:
                        {changeInPrice
                          ? changeInPrice.toFixed(2)
                          : "Loading..."}
                        BTC
                      </p>
                      <p>Tokens You Will Receive: 100</p>
                    </>
                  )}
                  {selectedToken === "AG (Silver)" && (
                    <>
                      <p>
                        Bitcoin:
                        {changeInPrice
                          ? changeInPrice.toFixed(18)
                          : "Loading..."}
                        BTC
                      </p>
                      <p>Tokens You Will Receive: 200</p>
                    </>
                  )}
                  {selectedToken === "Agua" && (
                    <>
                      <p>
                        Bitcoin Price: $
                        {bitcoinPrice ? bitcoinPrice.toFixed(2) : "Loading..."}
                      </p>
                      <p>Tokens You Will Receive: 50</p>
                    </>
                  )}
                </div>

                {/* Input for Crypto Amount */}
                <div className="mt-4 flex flex-col items-center">
                  <input
                    type="number"
                    placeholder={`Enter ${selectedCrypto} Amount`}
                    // value={changeInPrice !== null ? changeInPrice : ""}
                    onChange={async (e) => {
                      console.log("change in Pirce", bitcoinPrice);
                      const response = await axios.get(
                        "https://api.coinlayer.com/live?access_key=374fbb63dfff515ce8c6c1001f17e1d3",
                      );
                      let price: number = 1 / response.data.rates.BTC;
                      let change: number = price * Number(e.target.value);
                      SetChangeInPrice(change);
                      // console.log("USDT Value:", response.data.rates.BTC);
                      console.log("change in Pirce", changeInPrice);
                    }}
                    // value={cryptoAmount}
                    // onChange={(e) => setCryptoAmount(e.target.value)}
                    className="w-64 rounded-lg border border-gray-300 bg-white px-3 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    
                    className="mt-4 rounded-lg bg-red-700 px-8 py-2 text-white transition duration-300 hover:bg-blue-500"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default Payment;
