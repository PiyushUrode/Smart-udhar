import React, { useState } from 'react';
import { FileDown, FileUp } from 'lucide-react';
import { ChevronDown } from 'lucide-react'; // make sure this is at the top
import { FaPercentage } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa";
import { FaChartPie } from "react-icons/fa6";
import { FaCloudUploadAlt } from "react-icons/fa";

const D10Expenses = () => {


  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
const [selectedFilter, setSelectedFilter] = useState('Monthly'); // default

const handleFilterChange = (option) => {
  setSelectedFilter(option);
  setShowFilterDropdown(false);
  console.log('Selected Filter:', option);
  // You can call an API or filter logic here
};

  const [formData, setFormData] = useState({
    date: '',
    itemName: '',
    category: '',
    gstCredit: '',
    price: '',
    vendor: '',
    paymentMode: '',
    notes: '',
    file: null,
  });

  const categories = ['Travel', 'Office Supplies', 'Rent', 'Utilities'];
  const paymentModes = ['Cash', 'UPI', 'Bank'];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSelect = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 border rounded-lg shadow-lg bg-white">
        {/* Left - Expense Form */}
        <div className="bg-white rounded-xl shadow-md p-8 lg:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Expense</h2>
          <form onSubmit={handleSubmit} className="space-y-6 text-sm text-gray-700">

            {/* Date & Category */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="font-medium mb-1 block">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                />
              </div>
              <div>
                <label className="font-medium mb-1 block">Expense Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Item Name */}
            <div>
              <label className="font-medium mb-1 block">Item Name</label>
              <input
                type="text"
                name="itemName"
                placeholder="Enter item description"
                value={formData.itemName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
              />
            </div>

            {/* Amount & Vendor */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="font-medium mb-1 block">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="price"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="font-medium mb-1 block">Vendor Name (Optional)</label>
                <input
                  type="text"
                  name="vendor"
                  placeholder="Enter vendor name"
                  value={formData.vendor}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                />
              </div>
            </div>

            {/* GST Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="appearance-none h-5 w-5 border border-gray-300 rounded-sm checked:bg-white checked:border-white checked:after:content-['✔'] checked:after:text-blue-500 checked:after:block checked:after:text-center"
                id="gst"
                checked={formData.gstCredit === 'GST'}
                onChange={() =>
                  handleSelect('gstCredit', formData.gstCredit === 'GST' ? 'Non-GST' : 'GST')
                }
              />
              <label htmlFor="gst" className="text-sm font-medium" >GST Applicable</label>
            </div>

            {/* Payment Mode */}
            <div>
              <label className="font-medium mb-1 block">Payment Mode</label>
              <div className="flex gap-6 mt-1">
                {paymentModes.map((mode) => (
                  <label key={mode} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMode"
                      value={mode}
                      className="appearance-none h-5 w-5 border rounded-full border-gray-300  checked:bg-white checked:border-white checked:after:content-['✔'] checked:after:text-blue-500 checked:after:block checked:after:text-center"
                      checked={formData.paymentMode === mode}
                      onChange={handleChange}
                    />
                    {mode}
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="font-medium mb-1 block">Notes / Attach Bill (Optional)</label>
              <textarea
                name="notes"
                placeholder="Add notes or description"
                value={formData.notes}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white resize-none"
              />
            </div>

            {/* Upload */}
                <div className="border border-dashed border-gray-400 p-6 mt-4 justify-center flex flex-col items-center text-center rounded-md">
                          <FaCloudUploadAlt  size={30} color="#9CA3AF"  />
                        <label htmlFor="upload" className="cursor-pointer">
                          <div className="text-[#4B5563] text-sm">
                            Drop files here or click to upload
                          </div>
                          <input id="upload" type="file" className="hidden" />
                        </label>
                        <p className="mt-2 text-sm font-semibold">Upload Image Here</p>
                      </div>

            {/* Submit */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition"
              >
                + Add Expense
              </button>
            </div>
          </form>
        </div>

        {/* Right - Summary */}
        <div className="bg-white rounded-xl shadow-md p-6  space-y-6">
      <div className="relative flex items-center justify-between">
  <h2 className="text-lg font-semibold text-gray-800 flex flex-row gap-3">
    <FaChartPie color="#22C55E" /> Expense Summary
  </h2>
  <div className="relative">
    <button
      className="text-sm text-[#1E40AF] hover:underline flex items-center gap-1"
      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
    >
      Filters <ChevronDown size={16} />
    </button>
    {showFilterDropdown && (
      <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
        {['Day', 'Week', 'Month'].map((option) => (
          <div
            key={option}
            onClick={() => handleFilterChange(option)}
            className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
              selectedFilter === option ? 'bg-gray-100 font-medium' : ''
            }`}
          >
            {option}
          </div>
        ))}
      </div>
    )}
  </div>
</div>

          <div className='flex flex-row justify-between items-center bg-[#EFF6FF] py-4 px-3 gap-4'>
           <div className='flex flex-col '>   <p className="text-sm text-[#2563EB]">Total Monthly Expense</p>
            <p className="text-2xl font-bold text-[#1E40AF]">₹45,230</p>
</div>
           <div className='p-1 border-dotted border-4 rounded-full border-[#3B82F6] '> <FaQuestion color='#3B82F6'/></div>
          </div>

                    <div className='flex flex-row justify-between items-center bg-[#F0FDF4] border-[#E5E7EB] border py-4 px-3 gap-4'>
           <div className='flex flex-col '>   <p className="text-sm text-[#16A34A]">GST Credit Available</p>
            <p className="text-2xl font-bold text-[#166534]">₹8,142 </p>
</div>
           <div className='p-1  '> <FaPercentage color='#22C55E'/></div>
          </div>



          <div className='border-b-2 pb-5'>
            <p className="text-base font-semibold text-[#374151] mb-2">Top Spending Categories</p>
       <ul className="text-sm space-y-2">
  <li className="text-[#374151] font-interR flex justify-between items-center">
    <div className="flex items-center">
      <span className="inline-block w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
      Travel
    </div>
    <span className='font-interM text-[#1F2937] leading-4'>₹18,500</span>
  </li>
  <li className="text-[#374151] font-interR flex justify-between items-center">
    <div className="flex items-center">
      <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
      Office Supplies
    </div>
    <span className='font-interM text-[#1F2937] leading-4'>₹12,300</span>
  </li>
  <li className="text-[#374151] font-interR flex justify-between items-center">
    <div className="flex items-center">
      <span className="inline-block w-3 h-3 rounded-full bg-gray-500 mr-2"></span>
      Rent
    </div>
    <span className='font-interM text-[#1F2937] leading-4'>₹10,000</span>
  </li>
</ul>

          </div>

            <h1 className='text-[#374151] leading-4'> Downloadable Reports </h1>
          <div className="flex gap-4 ">
            <button className="bg-red-100 text-red-600 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-200 transition">
              <FileDown size={16} /> PDF
            </button>
            <button className="bg-green-100 text-green-700 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-200 transition">
              <FileUp size={16} /> Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default D10Expenses;
