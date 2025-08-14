import {
  FaEdit,
  FaSearch,
  FaFilePdf
} from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa6";
import { RiBankCardFill } from "react-icons/ri";
import { FaChartPie } from "react-icons/fa";
import { FaRegChartBar } from "react-icons/fa6";
import React, { useState } from "react";

const data = [
  {
    customer: "Rahul Traders",
    mobile: "9876543210",
    amount: "₹3,000",
    dueDate: "05 Jul 2025",
    milestone: "₹1,500 by 02 Jul",
    status: "Due Soon",
  },
  {
    customer: "Anaya Enterprises",
    mobile: "9876543210",
    amount: "₹5,500",
    dueDate: "03 Jul 2025",
    milestone: "₹2,000 by 01 Jul",
    status: "Overdue",
  },
  {
    customer: "Jatin Garments",
    mobile: "9876543210",
    amount: "₹1,800",
    dueDate: "06 Jul 2025",
    milestone: "₹1,000 by 04 Jul",
    status: "Upcoming",
  },
  {
    customer: "Singh Electronics",
    mobile: "9876543210",
    amount: "₹7,200",
    dueDate: "30 Jun 2025",
    milestone: "₹3,000 by 01 Jul",
    status: "Overdue",
  },
  {
    customer: "Kiran Agencies",
    mobile: "9876543210",
    amount: "₹2,000",
    dueDate: "04 Jul 2025",
    milestone: "₹2,000 by 03 Jul",
    status: "Due Soon",
  },
];

const D8PaymentCollectionList = () => {
  return (
    <div className="p-6 md:p-6 mt-5 bg-white min-h-screen">
      <h1 className="text-xl md:text-2xl font-robotoB mb-6">
        Payment Collection List
      </h1>

      {/* Flex container for table and collection section */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left side - Table */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 mb-4 gap-4">
            <div className="relative w-full md:max-w-2xl flex-1">
              <input
                type="text"
                placeholder="Search by User ID, Name, or Mobile"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full min-w-[600px] text-left bg-white rounded-md shadow border-separate border-spacing-y-2">
              <thead className="bg-gray-200 text-[#6B7280] text-xs font-robotoM">
                <tr>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Mobile Number</th>
                  <th className="p-3">Pending Amount</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Next Milestone</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {[...data, ...data].map((entry, index) => (
                  <tr
                    key={index}
                    className=" border-2 shadow-md rounded-xl font-robotoR text-[12px] sm:text-[14px] md:text-[16px] text-[#111827]"
                  >
                    <td className="p-3  whitespace-nowrap">{entry.customer}</td>
                    <td className="p-3  whitespace-nowrap">{entry.mobile}</td>
                    <td className="p-3  whitespace-nowrap">{entry.amount}</td>
                    <td className="p-3  whitespace-nowrap">{entry.dueDate}</td>
                    <td className="p-3  whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {entry.milestone} <FaEdit color="#EB2525" />
                      </div>
                    </td>
                    <td className="p-3 font-medium whitespace-nowrap">
                      {entry.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right side - Collection Summary */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white border rounded-lg shadow p-4">
            <div className="flex flex-row gap-5 items-center py-2  align-middle">  
         < FaChartPie size={20} color="#22C55E" />
            <h2 className="text-lg font-interSb text-[#1F2937] ">Collection</h2>
            </div>
            {/* Today's Collection */}
            <div className=" border border-green-200 rounded-lg p-4 mb-4 flex flex-row  justify-between align-middle items-center">
      <div>
                <p className="text-gray-500 font-robotoM text-sm">Today's Collection</p>
              <p className="text-[#16A34A] font-robotoSb text-2xl ">₹45,250</p>

      </div>
              <div className=" p-3 bg-[#DCFCE7] rounded-xl"> 

              <RiBankCardFill  size={20} color="#16A34A" />
</div>
            </div>

            {/* Total Collection */}
            <div className=" border border-blue-200 rounded-lg p-4 mb-4 flex flex-row  justify-between align-middle items-center">
<div>
                <p className="text-gray-500  font-robotoM text-sm">Total Collection</p>
              <p className="text-[#2563EB] font-robotoSb text-2xl ">₹2,45,780</p>  
</div>
<div className=" p-3 bg-[#DBEAFE] rounded-xl"> 

              <FaRegChartBar size={20} color="#2563EB" />
</div>
            </div>

            {/* Top Collections */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Top Collections</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-interR text-[#374151]">
                    <span className="w-3 h-3 rounded-full bg-[#3B82F6]"></span> This week
                  </span>
                  <span className="font-interM text-[#1F2937]">₹18,500</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-interR text-[#374151]">
                    <span className="w-3 h-3 rounded-full  bg-[#22C55E]"></span> This month
                  </span>
                  <span className="font-interM text-[#1F2937]">₹12,300</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-interR text-[#374151]">
                    <span className="w-3 h-3 rounded-full bg-[#EAB308]"></span> This year
                  </span>
                  <span className="font-interM text-[#1F2937]">₹10,000</span>
                </li>
              </ul>
            </div>

            {/* Download buttons */}
            <div className="flex flex-col mt-5 border-t-2">      
                     <div> 
              <h1 className="text-sm font-interM text-[#374151] py-5 leading-tight tracking-tight"> Downloadable Reports</h1>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-[#FEF2F2] text-[#DC2626] font-interM px-3 py-2 rounded-md shadow hover:bg-red-600">
                <FaFilePdf color="#DC2626" /> PDF
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-[#F0FDF4] text-[#16A34A] font-interM px-3 py-2 rounded-md shadow hover:bg-green-600">
                <FaFileExcel /> Excel
              </button>
            </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default D8PaymentCollectionList;
