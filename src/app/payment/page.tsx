'use client';
import React, { useState } from 'react';
import axios from 'axios';

const Payment = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Function to handle card selection
  const handleCardSelection = async (type: any) => {
    setSelectedPayment(type);

    if (type === 'Card Payment') {
      console.log('Card Payment selected');
      
      // Call the API to create a Stripe checkout session
      try {
        const { data: { url } } = await axios.post("/api/payment", {
          name: 'Sample Product', // You can change this dynamically
          price: 1000, // You can also change this dynamically based on selected token
        });

        // Redirect to Stripe Checkout
        window.location.href = url;
      } catch (error) {
        console.error('Error redirecting to Stripe Checkout', error);
      }
    } else if (type === 'Crypto') {
      console.log('Crypto selected');
      // Add crypto payment logic here if needed
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Token Selection Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-4 text-center">Selection of Token</h1>

        {/* Center the token cards */}
        <div className="flex flex-wrap justify-center gap-6">
          {/* Token Cards */}
          {[
            { name: 'AU (Gold)', price: '$1000', img: '/images/logo/Gold.png' },
            { name: 'AG (Silver)', price: '$2000', img: '/images/logo/sliver.png' },
            { name: 'Agua', price: '$3000', img: '/images/logo/community.png' },
          ].map((token, index) => (
            <div
              key={index}
              className="w-40 p-4 bg-gray-100 border border-gray-300 rounded-lg text-center shadow-md hover:shadow-lg hover:bg-gray-200 transition-shadow duration-200 relative"
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
            </div>
          ))}
        </div>
      </div>

      {/* Center-aligned Payment System Section */}
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-6">Payment System</h1>

        {/* Cards for Payment Options */}
        <div className="flex gap-4 mb-8">
          {/* Card Payment */}
          <div
            onClick={() => handleCardSelection('Card Payment')}
            className={`flex-1 p-4 bg-white border border-gray-300 rounded-lg text-center shadow-sm cursor-pointer ${
              selectedPayment === 'Card Payment' ? 'border-blue-500' : 'hover:bg-gray-100'
            }`}
          >
            <h2 className="text-lg font-bold text-gray-800">Card Payment</h2>
            <p className="text-sm text-gray-600 mt-2">Use your credit or debit card</p>
          </div>

          {/* Crypto Payment */}
          <div
            onClick={() => handleCardSelection('Crypto')}
            className={`flex-1 p-4 bg-white border border-gray-300 rounded-lg text-center shadow-sm cursor-pointer ${
              selectedPayment === 'Crypto' ? 'border-blue-500' : 'hover:bg-gray-100'
            }`}
          >
            <h2 className="text-lg font-bold text-gray-800">Crypto</h2>
            <p className="text-sm text-gray-600 mt-2">Pay using cryptocurrency</p>
          </div>
        </div>

        {/* Center-aligned Buy Button */}
        <button
          onClick={() => console.log(`Proceeding with ${selectedPayment}`)}
          className="w-48 bg-blue-600 text-white py-4 px-4 rounded-lg hover:bg-blue-700"
          disabled={!selectedPayment}
        >
          BUY
        </button>
      </div>
    </div>
  );
};

export default Payment;




