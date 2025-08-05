import React, { useState } from 'react';
import { FaFileInvoice } from 'react-icons/fa';

const D14GstCalReceipt = () => {
  const [totalAmount, setTotalAmount] = useState(5000);
  const [gstPercent, setGstPercent] = useState(18);
  const [gstType, setGstType] = useState('Including GST');
  const [roundOff, setRoundOff] = useState(true);

  const gstValue = (totalAmount * gstPercent) / (100 + gstPercent);
  const netPrice = gstType === 'Including GST'
    ? totalAmount - gstValue
    : totalAmount;

  const cgst = (gstPercent / 2 / 100) * netPrice;
  const sgst = (gstPercent / 2 / 100) * netPrice;
  const totalPrice = gstType === 'Including GST'
    ? totalAmount
    : netPrice + cgst + sgst;

  const finalTotal = roundOff ? Math.round(totalPrice) : totalPrice;
  const roundOffAmount = roundOff ? (finalTotal - totalPrice).toFixed(2) : 0;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1)] font-['Roboto']">
      <h3 className="text-lg lg:text-2xl font-semibold text-gray-900 mb-4">GST Calculator</h3>

      <select
        className="w-full px-3 py-2 rounded-md bg-[#3B82F6] text-white text-sm font-medium mb-5 focus:outline-none"
        value={gstType}
        onChange={(e) => setGstType(e.target.value)}
      >
        <option>Including GST</option>
        <option>Excluding GST</option>
      </select>

      <div className="bg-gray-100 rounded-lg p-5 lg:p-10 text-sm text-gray-800 space-y-3 lg:space-y-7 ">
        <div className="flex justify-between">
          <span>Net Price</span>
          <span className="font-medium text-gray-900">{netPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between">
          <span>CGST ({gstPercent / 2}%)</span>
          <span>{cgst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>SGST ({gstPercent / 2}%)</span>
          <span>{sgst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            Round off
            <input
              type="checkbox"
              checked={roundOff}
              onChange={() => setRoundOff(!roundOff)}
              className="accent-blue-600"
            />
          </span>
          <span>{roundOffAmount}</span>
        </div>

        <hr className="my-2 border-gray-300" />

        <div className="flex justify-between text-base font-semibold text-gray-900 pt-2">
          <span>Total price</span>
          <span>{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="flex justify-end mt-5">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2">
          <FaFileInvoice />
          Add to Bill
        </button>
      </div>
    </div>
  );
};




export default D14GstCalReceipt