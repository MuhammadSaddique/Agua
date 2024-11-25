"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Moralis from "moralis";

const Payment = () => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const [showCryptoOptions, setShowCryptoOptions] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [changeInPrice, SetChangeInPrice] = useState<number | null>(0);
  const [showUSDTCard, setShowUSDTCard] = useState(false);
  const [showCryptoPaymentCard, setShowCryptoPaymentCard] = useState(false); 
  const [price, setPrice] = useState<string | null>(null);
  const [bitcoinPrice, setBitcoinPrice] = useState<number | number>();
  const [usdtAmount, setUsdtAmount] = useState<number>(0); // Value in USD
  const [btcRate, setBtcRate] = useState<number | null>(null); // BTC rate
  const [ethRate, setEthRate] = useState<number | null>(null); // ETH rate
  const [maticRate, setMaticRate] = useState<number | null>(null); // MATIC rate
  const [goldRate, setGoldRate] = useState<number | null>(null); // Gold rate (XAU)
  const [silverRate, setSilverRate] = useState<number | null>(null); // Silver rate (XAG)
  const [selectedCrypto, setSelectedCrypto] = useState<string>("Bitcoin"); // Default selected crypto
  const [tokens, setTokens] = useState<string>("0"); // Token amount

  const API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImJiNDZjNGIxLWQxMGEtNDc2Ni05NGZjLTNmZTA0ZjI4MDViOCIsIm9yZ0lkIjoiNDE3MzE2IiwidXNlcklkIjoiNDI5MDQ5IiwidHlwZUlkIjoiYWU4NTg2OTQtOTlmNy00ZDI3LThmYmYtOGRmNmIxOGVhYzJhIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MzIyOTI1NzQsImV4cCI6NDg4ODA1MjU3NH0.n5cen_zNhhWRHDbTbdEbaqtdAHQJJ37xzN2axVjlbxs";
  const GOLD_API_KEY = "goldapi-15hojrsm3uczxap-io"; // GoldAPI key

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        await Moralis.start({ apiKey: API_KEY });

        // Fetch Bitcoin (BTC) price
        const btcResponse = await Moralis.EvmApi.token.getTokenPrice({
          chain: "0x1",
          address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        });
        const btcPrice = btcResponse.raw.usdPrice;
        console.log("BTC Price:", btcPrice); // Log BTC price
        setBtcRate(btcPrice);

        // Fetch Ethereum (ETH) price
        const ethResponse = await Moralis.EvmApi.token.getTokenPrice({
          chain: "0x1",
          address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", 
        });
        const ethPrice = ethResponse.raw.usdPrice;
        console.log("ETH Price:", ethPrice); // Log ETH price
        setEthRate(ethPrice);

        // Fetch Polygon (MATIC) price
        const maticResponse = await Moralis.EvmApi.token.getTokenPrice({
          address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", 
          chain: "0x89", 
        });
        const maticPrice = maticResponse.raw.usdPrice;
        console.log("MATIC Price:", maticPrice); // Log MATIC price
        setMaticRate(maticPrice);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchExchangeRates();
  }, []);

  // Fetch Gold and Silver rates using GoldAPI
useEffect(() => {
  const fetchMetalRates = async () => {
    try {

      const troyOunceToGram = 31.1035;

      // Fetch Gold (XAU) price
      const goldResponse = await axios.get(
        `https://www.goldapi.io/api/XAU/USD`,
        {
          headers: {
            "x-access-token": GOLD_API_KEY,
          },
        }
      );
      const goldPricePerOunce = goldResponse.data.price; 
      const goldPricePerGram = goldPricePerOunce / troyOunceToGram; 
      console.log("Gold Price (per gram):", goldPricePerGram); 
      setGoldRate(goldPricePerGram);

      // Fetch Silver (XAG) price
      const silverResponse = await axios.get(
        `https://www.goldapi.io/api/XAG/USD`,
        {
          headers: {
            "x-access-token": GOLD_API_KEY,
          },
        }
      );
      const silverPricePerOunce = silverResponse.data.price; 
      const silverPricePerGram = silverPricePerOunce / troyOunceToGram; 
      console.log("Silver Price (per gram):", silverPricePerGram); 
      setSilverRate(silverPricePerGram);
    } catch (error) {
      console.error("Error fetching metal data:", error);
    }
  };

  fetchMetalRates();
}, []);

  // Calculate asset amount
  const calculateAmount = (usdt: number, rate: number | null) => {
    if (!rate) return "Loading...";
    return (usdt / rate).toFixed(
      selectedCrypto === "Gold" || selectedCrypto === "Silver" ? 2 : 18
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const usdValue = Number(e.target.value);
    setUsdtAmount(usdValue);

    switch (selectedCrypto) {
      case "Bitcoin":
        setTokens(calculateAmount(usdValue, btcRate));
        break;
      case "Ethereum":
        setTokens(calculateAmount(usdValue, ethRate));
        break;
      case "Polygon":
        setTokens(calculateAmount(usdValue, maticRate));
        break;
      case "Gold":
        setTokens(calculateAmount(usdValue, goldRate));
        break;
      case "Silver":
        setTokens(calculateAmount(usdValue, silverRate));
        break;
      default:
        setTokens("0");
    }
  };

  const handleBuyClick = () => {
    console.log(`Buying ${tokens} of ${selectedCrypto} for $${usdtAmount}`);
    setUsdtAmount(0);
    setTokens("0");
  };
  
 const handleCardSelection = async (type: string) => {
  setSelectedPayment(type);

  if (type === "Card Payment") {
    try {
      // Static Stripe Payment Link
      const url = "https://buy.stripe.com/test_28o02tgHN55AacMbII";
      window.open(url, "_blank"); 
    } catch (error) {
      console.error("Error redirecting to Stripe Checkout", error);
    }
  } else if (type === "Crypto") {
    // Show crypto options or initiate crypto logic
    setShowCryptoOptions(true); // Ensure `setShowCryptoOptions` is defined in your state.
  }
};

  const handleTokenSelection = (tokenName: string) => {
    setSelectedToken(tokenName);
    // setSelectedCrypto(null);
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
  {/* Card Payment Option */}
  <div
    onClick={() => handleCardSelection("Card Payment")}
    className={`flex-2 cursor-pointer rounded-lg border border-gray-300 p-10 text-center shadow-sm ${
      selectedPayment === "Card Payment" ? "bg-white" : "bg-gray-300"
    }`}
  >
    <h2 className="text-lg font-bold text-gray-800">Card Payment</h2>
    <p className="mt-2 text-sm text-gray-600">Use your credit or debit card</p>
  </div>

  {/* Crypto Payment Option */}
  <div
    onClick={() => handleCardSelection("Crypto")}
    className={`flex-2 cursor-pointer rounded-lg border border-gray-300 p-8 text-center shadow-sm ${
      selectedPayment === "Crypto" ? "bg-white" : "bg-gray-300"
    }`}
  >
    <h2 className="text-lg font-bold text-gray-800">Crypto</h2>
    <p className="mt-2 text-sm text-gray-600">Pay using cryptocurrency</p>
  </div>
</div>

{/* Display Crypto Options */}
{selectedPayment === "Crypto" && (
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
          selectedCrypto === crypto.name ? "bg-white" : "bg-gray-300"
        }`}
      >
        <div className="mx-auto mb-4 h-16 w-16">
          <img
            src={crypto.img}
            alt={`${crypto.name} Logo`}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="text-lg font-semibold text-black">{crypto.name}</div>
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
                    className="mt-4 rounded-lg bg-red-700 px-8 py-2 text-white transition duration-300 hover:bg-blue-500"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}

            {/* Crypto Payment Card */}



            

            <div className="mx-auto max-w-7xl p-8">
     




      {selectedCrypto && (
        <div className="mt-12 w-180 rounded-lg bg-gray-900 p-8 text-center shadow-md">
        <h2 className="text-lg font-semibold text-white">
    {selectedCrypto === "Bitcoin"
      ? "Bitcoin (BTC)"
      : selectedCrypto === "Ethereum"
      ? "Ethereum (ETH)"
      : selectedCrypto === "Polygon"
      ? "Polygon (MATIC)"
      : selectedCrypto === "Gold"
      ? "Gold (XAU)"
      : selectedCrypto === "Silver"
      ? "Silver (XAG)"
      : "Select an Asset"}
  </h2>
    
        {/* Display the Rate in USD */}
        <div className="mt-4 text-white">
        <p>
      {selectedCrypto} Rate in USD:{" "}
      {selectedCrypto === "Bitcoin"
        ? btcRate || "Loading..."
        : selectedCrypto === "Ethereum"
        ? ethRate || "Loading..."
        : selectedCrypto === "Polygon"
        ? maticRate || "Loading..."
        : selectedCrypto === "Gold"
        ? goldRate || "Loading..."
        : selectedCrypto === "Silver"
        ? silverRate || "Loading..."
        : "Loading..."}
    </p>
       </div>
        <div className="mt-4 text-white">
          <p>
            {selectedCrypto} :{" "}
            {calculateAmount(usdtAmount, selectedCrypto === "Bitcoin" ? btcRate : selectedCrypto === "Ethereum" ? ethRate : maticRate)}
           
          </p>
        </div>
    
        {/* Display the static number of tokens */}
        <div className="mt-4 text-white">
          <p>Tokens You Will Receive: 200</p>
        </div>
    
        {/* Input field for USD amount */}
        <div className="mt-4 text-white">
          <input
            type="number"
            value={usdtAmount === 0 ? "" : usdtAmount}
            onChange={handleInputChange}
            placeholder="Enter USD amount"
            className="w-64 rounded-lg border border-gray-300 bg-white px-3 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="ml-2 text-white">$</span>
        </div>
    
        {/* Button to handle buy */}
        <button
          onClick={handleBuyClick}
          className="mt-6 rounded-lg bg-red-700 px-8 py-2 text-white transition duration-300 hover:bg-blue-500"
        >
          Buy Now
        </button>
      </div>
    
      )}
    </div>

            
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default Payment;
