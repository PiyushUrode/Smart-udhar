import { useState } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { FaFileExcel } from "react-icons/fa6";

const expenses = [
  {
    date: "01 Jul 2025",
    category: "Office Supplies",
    item: "Printer Ink",
    amount: "₹1,200",
    gst: "18%",
    mode: "UPI",
  },
  {
    date: "01 Jul 2025",
    category: "Travel",
    item: "Taxi to client site",
    amount: "₹350",
    gst: "–",
    mode: "Cash",
  },
  {
    date: "30 Jun 2025",
    category: "Internet",
    item: "Monthly ISP Bill",
    amount: "₹999",
    gst: "18%",
    mode: "Bank Transfer",
  },
  {
    date: "29 Jun 2025",
    category: "Utilities",
    item: "Electricity Bill",
    amount: "₹2,450",
    gst: "–",
    mode: "UPI",
  },
  {
    date: "28 Jun 2025",
    category: "Marketing",
    item: "Facebook Ads",
    amount: "₹3,000",
    gst: "18%",
    mode: "Credit Card",
  },
  {
    date: "28 Jun 2025",
    category: "Staff Welfare",
    item: "Lunch for team",
    amount: "₹1,100",
    gst: "–",
    mode: "Cash",
  },
  {
    date: "27 Jun 2025",
    category: "Marketing",
    item: "Facebook Ads",
    amount: "₹3,000",
    gst: "18%",
    mode: "Credit Card",
  },
  {
    date: "27 Jun 2025",
    category: "Internet",
    item: "Monthly ISP Bill",
    amount: "₹999",
    gst: "18%",
    mode: "Bank Transfer",
  },
  {
    date: "26 Jun 2025",
    category: "Travel",
    item: "Taxi to client site",
    amount: "₹350",
    gst: "–",
    mode: "Cash",
  },
  {
    date: "26 Jun 2025",
    category: "Utilities",
    item: "Electricity Bill",
    amount: "₹2,450",
    gst: "–",
    mode: "UPI",
  },
];


const D10ExprenseList = () => {
   const [showFilters, setShowFilters] = useState(false);
  return (
      <div className="min-h-screen max-w-5xl mx-auto mt-5 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl  font-robotoB text-gray-900">
            Expense List
          </h1>
<div className="relative">
          <button
            className="text-[#2563EB] text-md font-medium hover:underline flex items-center gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters <span className="text-[10px]">▼</span>
          </button>

          {/* Dropdown */}
          {showFilters && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-3 space-y-2">
              <label className="flex items-center text-sm text-gray-700 gap-2">
                <input type="checkbox"   className="appearance-none h-5 w-5 border border-gray-300 rounded-sm checked:bg-white checked:border-white checked:after:content-['✔'] checked:after:text-blue-500 checked:after:block checked:after:text-center" />
                Date
              </label>
              <label className="flex items-center text-sm text-gray-700 gap-2">
                <input type="checkbox"   className="appearance-none h-5 w-5 border border-gray-300 rounded-sm checked:bg-white checked:border-white checked:after:content-['✔'] checked:after:text-blue-500 checked:after:block checked:after:text-center" />
                Category
              </label>
              <label className="flex items-center text-sm text-gray-700 gap-2">
                <input type="checkbox"   className="appearance-none h-5 w-5 border border-gray-300 rounded-sm checked:bg-white checked:border-white checked:after:content-['✔'] checked:after:text-blue-500 checked:after:block checked:after:text-center" />
                GST
              </label>
              <label className="flex items-center text-sm text-gray-700 gap-2">
                <input type="checkbox"   className="appearance-none h-5 w-5 border border-gray-300 rounded-sm checked:bg-white checked:border-white checked:after:content-['✔'] checked:after:text-blue-500 checked:after:block checked:after:text-center" />
                Payment Mode
              </label>
            </div>
          )}
        </div>
    
        </div>

        {/* Table */}
        <div className="overflow-auto">
          <table className="min-w-full bg-white rounded-md border-separate border-spacing-y-2">
            <thead className="text-gray-500 text-xs bg-gray-100">
              <tr>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Item</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">GST</th>
                <th className="text-left p-3">Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp, index) => (
                <tr
                  key={index}
                  className="bg-white shadow rounded-md font-robotoR text-sm sm:text-md text-[#111827]"
                >
                  <td className="p-3 whitespace-nowrap font-robotoM">
                    {exp.date}
                  </td>
                  <td className="p-3 whitespace-nowrap">{exp.category}</td>
                  <td className="p-3 whitespace-nowrap">{exp.item}</td>
                  <td className="p-3 whitespace-nowrap">{exp.amount}</td>
                  <td className="p-3 whitespace-nowrap">{exp.gst}</td>
                  <td className="p-3 whitespace-nowrap">{exp.mode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap gap-3 justify-end mt-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-md shadow-sm font-robotoR text-sm hover:bg-blue-700">
            <FaFilePdf /> PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#DBEAFE] text-[#2563EB] rounded-md shadow-sm font-robotoR text-sm hover:bg-blue-200">
            <FaFileExcel /> Excel
          </button>
        </div>
      </div>
  );
};


export default D10ExprenseList