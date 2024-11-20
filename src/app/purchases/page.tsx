'use client';
import React, { useState } from 'react';
import axios from 'axios';
import DefaultLayout from '@/components/Layouts/DefaultLayout';

const Payment = () => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showCryptoOptions, setShowCryptoOptions] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null); // New state for selected card (Ethereum or USDT)
  const [showUSDTCard, setShowUSDTCard] = useState(false);
  const [price, setPrice] = useState<string | null>(null);

  const handleCardSelection = async (type: string) => {
    setSelectedPayment(type);

    if (type === 'Card Payment') {
      try {
        const { data: { url } } = await axios.post("/api/payment", {
          name: 'Sample Product',
          price: 1000,
        });
        window.location.href = url;
      } catch (error) {
        console.error('Error redirecting to Stripe Checkout', error);
      }
    } else if (type === 'Crypto') {
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
    setShowUSDTCard(false); // Reset USDT details when switching to a different crypto
    setSelectedCard(null); // Reset selected card when switching cryptos
  };

  const handleCardClick = (cardType: string) => {
    setSelectedCard(cardType);
    if (cardType === 'USDT') {
      setShowUSDTCard(true);
      setPrice('1000'); // Set USDT price to 1000
    } else {
      setShowUSDTCard(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="p-8 max-w-7xl mx-auto">
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
                  <span className="font-bold text-black">Wallet Address:</span> 0x1234...abcd
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Section */}
        <div className="mb-18">
  <h1 className="text-2xl font-semibold mb-4 text-center text-gray-500   ">Stock</h1>
  <div className="flex flex-wrap justify-center gap-20">
    {[{ name: 'Gold', price: '$1500', img: '/images/logo/Gold.png', tokens: 100 },
      { name: 'AG (Silver)', price: '$2000', img: '/images/logo/sliver.png', tokens: 200 },
      { name: 'Agua', price: '$3000', img: '/images/logo/agua-logo.png', tokens: 50 },
    ].map((stock, index) => (
      <div
        key={index}
        className="w-72 p-10 bg-gray-800 border-2 border-gray-600 rounded-lg text-center shadow-lg hover:shadow-xl hover:bg-gray-700 transition-all duration-300 ease-in-out"
      >
        <div className="w-24 h-24 mx-auto mb-4">
          <img
            src={stock.img}
            alt={`${stock.name} Logo`}
            className="w-full h-full object-cover rounded-full border-4 border-white"
          />
        </div>
        <div className="text-xl font-medium text-gray-200">{stock.name}</div>
        <div className="mt-2 text-lg font-semibold text-gray-400">{stock.tokens} Tokens</div>
      </div>
    ))}
  </div>
</div>


        {/* Token Selection Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-4 text-center">Selection of Token</h1>
          <div className="flex flex-wrap justify-center gap-20">
            {[{ name: 'AU (Gold)', price: '$1000', img: '/images/logo/Gold.png' },
              { name: 'AG (Silver)', price: '$2000', img: '/images/logo/sliver.png' },
              { name: 'Agua', price: '$3000', img: '/images/logo/agua-logo.png' },
            ].map((token, index) => (
              <div
                key={index}
                onClick={() => handleTokenSelection(token.name)}
                className={`w-52 p-8 border border-gray-300 rounded-lg text-center shadow-md cursor-pointer ${
                  selectedToken === token.name ? 'bg-white' : 'bg-gray-300'
                }`}
              >
                <div className="w-16 h-16 mx-auto mb-4">
                  <img
                    src={token.img}
                    alt={`${token.name} Token Logo`}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="text-lg font-semibold text-black">{token.price}</div>
                <div className="text-base font-medium text-gray-600">{token.name}</div>
                {selectedToken === token.name && (
                  <div className="text-sm font-semibold text-blue-500 mt-2">Selected</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment System Section */}
        {selectedToken && (
          <div className="flex mt-12 flex-col items-center">
            <h1 className="text-2xl font-semibold mb-6">Payment System</h1>
            <div className="flex mt-2 gap-12 mb-8">
              <div
                onClick={() => handleCardSelection('Card Payment')}
                className={`flex-2 p-10  border border-gray-300 rounded-lg text-center shadow-sm cursor-pointer ${
                  selectedPayment === 'Card Payment' ? 'bg-white' : 'bg-gray-300'
                }`}
              >
                <h2 className="text-lg font-bold text-gray-800">Card Payment</h2>
                <p className="text-sm text-gray-600 mt-2">Use your credit or debit card</p>
              </div>
              <div
                onClick={() => handleCardSelection('Crypto')}
                className={`flex-2 p-8 border border-gray-300 rounded-lg text-center shadow-sm cursor-pointer ${
                  selectedPayment === 'Crypto' ? 'bg-white' : 'bg-gray-300'
                }`}
              >
                <h2 className="text-lg font-bold text-gray-800">Crypto</h2>
                <p className="text-sm text-gray-600 mt-2">Pay using cryptocurrency</p>
              </div>
            </div>

            {/* Crypto Options */}
            {showCryptoOptions && (
              <div className="flex flex-wrap justify-center gap-20">
                {[{ name: 'Ethereum', img: '/images/logo/etherum.png' },
                  { name: 'Bitcoin', img: '/images/logo/bitcoin.png' },
                  { name: 'Polygon', img: '/images/logo/polygon.png' },
                ].map((crypto, index) => (
                  <div
                    key={index}
                    onClick={() => handleCryptoSelection(crypto.name)}
                    className={`w-52 mt-10 p-8 border border-gray-300 rounded-lg text-center shadow-md cursor-pointer ${
                      selectedCrypto === crypto.name ? 'bg-white' : 'bg-gray-300'
                    }`}
                  >
                    <div className="w-16 h-16 mx-auto mb-4">
                      <img
                        src={crypto.img}
                        alt={`${crypto.name} Logo`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="text-lg font-semibold text-black">{crypto.name}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Ethereum and USDT Cards */}
            {selectedCrypto === 'Ethereum' && (
              <div className="flex flex-wrap justify-center gap-20 mt-8">
                <div
                  onClick={() => handleCardClick('Ethereum')}
                  className={`w-52 mt-10 p-8 border border-gray-300 rounded-lg text-center shadow-md cursor-pointer ${
                    selectedCard === 'Ethereum' ? 'bg-white' : 'bg-gray-300'
                  }`}
                >
                  <div className="w-16 h-16 mx-auto mb-4">
                    <img
                      src="/images/logo/Ether.png"
                      alt="Ethers Logo"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="text-lg font-semibold text-black">Ethers</div>
                </div>

                <div
                  onClick={() => handleCardClick('USDT')}
                  className={`w-52 mt-10 p-8 border border-gray-300 rounded-lg text-center shadow-md cursor-pointer ${
                    selectedCard === 'USDT' ? 'bg-white' : 'bg-gray-300'
                  }`}
                >
                  <div className="w-16 h-16 mx-auto mb-4">
                    <img
                      src="/images/logo/ustd.png"
                      alt="USDT Logo"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="text-lg font-semibold text-black">USDT</div>
                </div>
              </div>
            )}

            {showUSDTCard && (
             <div className="w-180 p-8 bg-gray-900 rounded-lg text-center shadow-md mt-12">
             <h2 className="text-lg font-semibold text-white">USDT Payment</h2>
             <p className="mt-4 text-white">Send the required amount of USDT:</p>
             
             {/* Input and Button Container */}
             <div className="flex flex-col items-center mt-4">
               {/* Smaller Input Field */}
               <input
                 type="number"
                 placeholder="Enter USDT Amount"
                 className="w-64 px-3 py-3 bg-white text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 onChange={(e) => console.log("USDT Value:", e.target.value)} // Replace with actual handler
               />
               
               {/* Buy Button */}
               <button
                 onClick={() => console.log("Proceeding with payment...")} // Add your payment logic here
                 className="mt-4 px-8 py-2 bg-red-700 text-white rounded-lg hover:bg-blue-500 transition duration-300"
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
