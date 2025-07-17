import {
  FaEdit,
  FaClock,
  FaWallet
} from "react-icons/fa";
import React, { useState } from "react";
import { MdCollectionsBookmark } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa6";
import { FaSearch,  } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { ChevronDown } from 'lucide-react'; // make sure this is at the top

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

const statusColors = {
  "Due Soon": "text-yellow-600",
  Overdue: "text-red-600",
  Upcoming: "text-blue-600",
};

const D8PaymentCollectionList = () => {
const [showFilter, setShowFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");

  const handleFilterSelect = (value) => {
    setSelectedFilter(value);
    setShowFilter(false);
    // 👉 You can trigger your data filter logic here
  };
  
  return (
    <div className="p-6  md:p-6  mt-5 bg-white min-h-screen">
      <h1 className="text-xl md:text-2xl  font-robotoB mb-6">
        Payment Collection List
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center justify-between p-4 bg-white shadow border border-[#E5E7EB] rounded-md">
          <div>
            <p className="text-[#4B5563] font-robotoM text-sm">
              Today's Collection
            </p>
            <h2 className="text-[#16A34A] font-robotoB text-xl md:text-2xl">₹45,250</h2>
          </div>
          <div className="bg-[#DCFCE7] h-14 w-12 rounded-lg flex justify-center items-center">
            <FaWallet size={14} color="#16A34A" className="w-[20px] h-[22px]" />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-white shadow border border-[#E5E7EB] rounded-md">
          <div>
            <p className="text-[#4B5563] font-robotoM text-sm">
              Overdues by Days
            </p>
            <h2 className="text-[#DC2626] font-robotoB text-xl md:text-2xl">12 Days</h2>
          </div>
          <div className="bg-[#FEE2E2] h-14 w-12 rounded-lg flex justify-center items-center">
            <FaClock className="text-red-600 text-xl" />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-white shadow border border-[#E5E7EB] rounded-md">
          <div>
            <p className="text-[#4B5563] font-robotoM text-sm">
              Total Collection
            </p>
            <h2 className="text-[#2563EB] font-robotoB text-xl md:text-2xl">₹2,45,780</h2>
          </div>
          <div className="bg-[#DBEAFE] h-14 w-12 rounded-lg flex justify-center items-center">
            <MdCollectionsBookmark color="#2563EB" className="w-[20px] h-[22px]" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center border p-4 mb-4 gap-4">
         <div className="relative w-full md:w-auto flex-1">
                 <input
                   type="text"
                   placeholder="Search by User ID, Name, or Mobile"
                   className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                 />
                 <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
               </div>

        <div className="flex gap-2 items-center">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-base font-robotoR">
            <FaFilePdf color="blue" /> Download PDF
          </button>

<div className="relative inline-block text-left">
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-base text-[#2563EB] font-robotoM"
      >
        Filters <IoIosArrowDown className="ml-2" />
      </button>

      {showFilter && (
        <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-md z-50">
          {["Overdue", "Due Soon", "Paid", "This Week"].map((filter) => (
            <li
              key={filter}
              onClick={() => handleFilterSelect(filter)}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              {filter}
            </li>
          ))}
        </ul>
      )}
    </div>







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
                className="border shadow-md rounded-xl font-robotoR text-[12px] sm:text-[14px] md:text-[16px] text-[#111827]"
              >
                <td className="p-3 whitespace-nowrap">{entry.customer}</td>
                <td className="p-3 whitespace-nowrap">{entry.mobile}</td>
                <td className="p-3 whitespace-nowrap">{entry.amount}</td>
                <td className="p-3 whitespace-nowrap">{entry.dueDate}</td>
                <td className="p-3 whitespace-nowrap"><div className="flex items-center gap-2">{entry.milestone} <FaEdit color="#EB2525" /></div> </td>
                <td className={`p-3 font-medium whitespace-nowrap`}>
                  {entry.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};



export default D8PaymentCollectionList