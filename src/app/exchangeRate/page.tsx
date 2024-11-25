'use client';

import React, { useState } from 'react';

const Payment = () => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const handleCardSelection = (type: string) => {
    setSelectedPayment(type);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Token Selection Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-4 text-center">Selection of Token</h1>
        <div className="flex flex-wrap justify-center gap-6">
          {[{ name: 'AU (Gold)', price: '$1000', img: '/images/logo/Gold.png' }].map(
            (token, index) => (
              <div
                key={index}
                className="w-40 p-4 bg-gray-100 border border-gray-300 rounded-lg text-center shadow-md"
              >
                <img
                  src={token.img}
                  alt={token.name}
                  className="w-16 h-16 mx-auto mb-4"
                />
                <div className="text-lg font-semibold text-black">{token.price}</div>
                <div className="text-base font-medium text-gray-600">{token.name}</div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Payment System Section */}
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-6">Payment System</h1>
        <div className="flex gap-4 mb-8">
          {/* Card Payment Option */}
          <div
            onClick={() => handleCardSelection('Card Payment')}
            className={`flex-1 p-4 bg-white border border-gray-300 rounded-lg text-center shadow-sm cursor-pointer ${
              selectedPayment === 'Card Payment' ? 'border-blue-500' : 'hover:bg-gray-100'
            }`}
          >
            <h2 className="text-lg font-bold text-gray-800">Card Payment</h2>
            <p className="text-sm text-gray-600 mt-2">Use your credit or debit card</p>
          </div>

          {/* Crypto Payment Option */}
          <div
            onClick={() => setSelectedPayment('Crypto')}
            className={`flex-1 p-4 bg-white border border-gray-300 rounded-lg text-center shadow-sm cursor-pointer ${
              selectedPayment === 'Crypto' ? 'border-blue-500' : 'hover:bg-gray-100'
            }`}
          >
            <h2 className="text-lg font-bold text-gray-800">Crypto</h2>
            <p className="text-sm text-gray-600 mt-2">Pay using cryptocurrency</p>
          </div>
        </div>

        {/* Render Stripe Checkout in an iframe */}
        {selectedPayment === 'Card Payment' && (
          <div className="mt-6 w-full border p-6 rounded-lg shadow-sm bg-white">
            <h2 className="text-xl font-bold mb-4">Complete Your Payment</h2>
            <iframe
              src="https://buy.stripe.com/test_28o02tgHN55AacMbII"
              className="w-full h-[600px] border rounded"
              frameBorder="0"
              allow="payment"
            ></iframe>
          </div>
        )}

        {/* Render Crypto Payment Section */}
        {selectedPayment === 'Crypto' && (
          <div className="mt-6 w-full border p-6 rounded-lg shadow-sm bg-white">
            <h2 className="text-xl font-bold mb-4">Crypto Payment Options</h2>
            <p>Crypto payment form or wallet options will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
