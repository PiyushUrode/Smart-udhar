import React, { useState } from "react";
import { FaSearch, FaDownload, FaCheck } from "react-icons/fa";
import { MdUpdate } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { BsPersonCircle } from "react-icons/bs";
import { FaWallet } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";

const D8PaymentCollection = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleMarkAsPaid = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <section className="w-full min-h-screen bg-[#f9f9ff] mt-5 px-4 md:px-10 py-6">
      {/* Top Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white flex flex-row justify-between shadow-md  border-green-500 p-4 rounded-xl min-h-[100px]">
          <div className="flex flex-col">
            <p className="text-sm text-[#4B5563] font-robotoM leading-5 ">Today’s Collection</p>
            <h2 className="text-xl font-bold text-green-600">₹45,250</h2>
          </div>
          <div className="px-3 py-3 rounded-xl h-fit bg-[#DCFCE7]">
            <FaWallet className="text-[#16A34A]" />
          </div>
        </div>
        <div className="bg-white flex flex-row justify-between shadow-md  border-red-500 p-4 rounded-xl min-h-[100px]">
          <div className="flex flex-col">
            <p className="text-sm text-[#4B5563] font-robotoM leading-5">Overdue by Days</p>
            <h2 className="text-xl font-bold text-red-600">12 Days</h2>
          </div>
          <div className="px-3 py-3 rounded-xl h-fit bg-[#FEE2E2]">
            <FaClock className="text-[#DC2626]" />
          </div>
        </div>
        <div className="bg-white flex flex-row justify-between shadow-md  border-blue-500 p-4 rounded-xl min-h-[100px]">
          <div className="flex flex-col ">
            <p className="text-sm text-[#4B5563] font-robotoM leading-5">Total Collection</p>
            <h2 className="text-xl font-bold text-blue-600">₹2,45,780</h2>
          </div>
          <div className="px-3 py-3 rounded-xl h-fit bg-[#DBEAFE]">
            <RxHamburgerMenu className="text-[#2563EB] " />
          </div>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto flex-1">
          <input
            type="text"
            placeholder="Search by User ID, Name, or Mobile"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
            <MdUpdate /> Update Milestone
          </button>
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow">
            <IoMdAddCircle /> Generate Receipt
          </button>
        </div>
      </div>

      {/* Customer Payment Details */}
      <div className="bg-white rounded-xl shadow-md pb-10 mb-6 border border-gray-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 mb-6 border-b border-gray-300">
          <h1>Custom Payment Details</h1>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-10">
          <div className="flex flex-col gap-4 ">
            <div className="flex flex-row items-start gap-4">
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="Rajesh Kumar"
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <h3 className="text-lg font-semibold">Rajesh Kumar</h3>
                <p className="text-sm text-[#4B5563] font-robotoM leading-5">Customer ID: MN0101</p>
                <p className="text-sm text-[#4B5563] font-robotoM leading-5">Mobile: +91 9876543210</p>
              </div>
            </div>

            <div className="text-[#4B5563] font-robotoM leading-5 font-robotoR">
              <p className="text-sm mt-2 font-robotoR"><span className="font-robotoM">Product:</span> Milestone Premium Plan</p>
              <p className="text-sm font-robotoR"> <span className="font-robotoM"> Address: </span> 123 MG Road, Bangalore, Karnataka 560001</p>
              <p className="text-sm font-robotoR"><span className="font-robotoM">Payment Mode:</span> UPI</p>
              <p className="text-sm font-medium font-robotoR" ><span className="font-robotoM">Next Payment:</span> 2025-07-15</p>
            </div>
          </div>

          <div className="w-full md:w-1/2 mt-4 md:mt-0 ">
            <h4 className=" font-robotoM text-black mb-2">Payment Milestones</h4>
            <ul className="space-y-2">
              <li className="bg-[#F0FDF4] border border-green-400 rounded p-5 flex justify-between">
                <div className="flex flex-col">
                  <span>Milestone 1</span>
                  <span className="text-[#16A34A] font-medium">₹25000 - Due 2025-07-15</span>
                </div>
                <div className="px-3 py-3 rounded-xl h-fit bg-[#DCFCE7]">
                  <span className=" font-medium  text-[#166534] "> Paid</span>
                </div>
              </li>
              <li className="bg-yellow-100 border border-yellow-400 rounded p-5 flex justify-between items-center">
                <div className="flex flex-col">
                  <span>Milestone 2</span>
                  <span className="text-yellow-800 font-medium">₹25000 - Due 2025-07-15</span>
                </div>
                <button
                  onClick={handleMarkAsPaid}
                  className="ml-3 px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center gap-1"
                >
                  <FaCheck /> Mark as Paid
                </button>
              </li>
              <li className="bg-[#F9FAFB] border border-[#E5E7EB] rounded p-5 flex justify-between">
                <div className="flex flex-col">
                  <span>Milestone 1</span>
                  <span className="text-[#4B5563] font-robotoM leading-5 font-medium">₹25000 - Due 2025-07-15</span>
                </div>
                <div className="px-3 py-3 rounded-xl h-fit bg-[#F3F4F6] border-[#E5E7EB border-2]">
                  <span className=" font-medium  text-[#1F2937] "> Paid</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

{/* Payment Details Table */}
<div className="bg-white rounded-xl shadow-md border border-gray-300 p-6 mt-5 overflow-x-auto">
  <h4 className="text-base font-semibold text-gray-700 mb-5">Payment Details</h4>
  <table className="min-w-full table-auto text-sm text-left text-gray-600">
    <thead className="bg-gray-50 text-gray-400 font-semibold">
      <tr>
        <th className="px-4 py-3">Date</th>
        <th className="px-4 py-3">Payment</th>
        <th className="px-4 py-3">Milestone</th>
        <th className="px-4 py-3">Payment Mode</th>
        <th className="px-4 py-3">Next Payment</th>
        <th className="px-4 py-3">Status</th>
        <th className="px-4 py-3">Action</th>
      </tr>
    </thead>
    <tbody className="text-gray-700">
      {/* Row 1 */}
      <tr className="border-t border-gray-200">
        <td className="px-4 py-3">2024-01-15</td>
        <td className="px-4 py-3 font-bold">₹5,000</td>
        <td className="px-4 py-3">Milestone 1</td>
        <td className="px-4 py-3">UPI</td>
        <td className="px-4 py-3">2024-02-15</td>
        <td className="px-4 py-3">
          <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Paid</span>
        </td>
        <td className="px-4 py-3">
          <button className="text-xs bg-gray-200 text-gray-500 px-3 py-1 rounded-full cursor-default" disabled>Paid</button>
        </td>
      </tr>
      {/* Row 2 */}
      <tr className="border-t border-gray-200">
        <td className="px-4 py-3">2024-02-15</td>
        <td className="px-4 py-3 font-bold">₹5,000</td>
        <td className="px-4 py-3">Milestone 2</td>
        <td className="px-4 py-3">Cash</td>
        <td className="px-4 py-3">2024-03-15</td>
        <td className="px-4 py-3">
          <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full">Pending</span>
        </td>
        <td className="px-4 py-3">
          <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-all duration-200">
            Mark as Paid
          </button>
        </td>
      </tr>
      {/* Row 3 */}
      <tr className="border-t border-gray-200">
        <td className="px-4 py-3">2024-03-15</td>
        <td className="px-4 py-3 font-bold">₹5,000</td>
        <td className="px-4 py-3">Milestone 3</td>
        <td className="px-4 py-3">Bank Transfer</td>
        <td className="px-4 py-3">2024-04-15</td>
        <td className="px-4 py-3">
          <span className="bg-red-100 text-red-700 text-xs font-medium px-3 py-1 rounded-full">Overdue</span>
        </td>
        <td className="px-4 py-3">
          <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-all duration-200">
            Mark as Paid
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>


      {/* Receipt Preview Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-300 p-6  mx-auto mt-5">
        <h4 className="text-base font-semibold text-gray-700 mb-5 border-b pb-2">Receipt Preview</h4>
        <div className="bg-[#F9FAFB] border  border-gray-300 rounded-md p-6 max-w-md mx-auto">
          <h5 className="text-center font-bold text-gray-800 text-lg">PAYMENT RECEIPT</h5>
          <p className="text-center text-sm text-[#4B5563] font-robotoM leading-5 mb-4">Receipt #: RCP-001-2025</p>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between"><span className="font-medium">Date:</span><span>2025-01-10</span></div>
            <div className="flex justify-between"><span className="font-medium">Customer ID:</span><span>MIN001</span></div>
            <div className="flex justify-between"><span className="font-medium">Name:</span><span>Rajesh Kumar</span></div>
            <div className="flex justify-between"><span className="font-medium">Product:</span><span>Minestrone Premium</span></div>
            <div className="flex justify-between"><span className="font-medium">Payment:</span><span>₹5,000</span></div>
            <div className="flex justify-between"><span className="font-medium">Milestone:</span><span>2 of 3</span></div>
            <div className="flex justify-between"><span className="font-medium">Payment Mode:</span><span>UPI</span></div>
            <div className="flex justify-between"><span className="font-medium">Next Payment:</span><span>2025-02-15</span></div>
          </div>
          <div className="text-center mt-6">
            <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2 mx-auto">
              <FaDownload className="text-white" />
              Download Receipt
            </button>
          </div>
        </div>
      </div>

      {/* Popup Modal for Receipt Confirmation */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-md border border-gray-300 w-[90%] max-w-md p-6 relative">
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-3 text-[#4B5563] font-robotoM leading-5 hover:text-gray-800"
            >✕</button>
            <h4 className="text-base font-semibold text-gray-700 mb-5 border-b pb-2 text-center">Payment Collection</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Enter Paid Amount</label>
                <input type="text" placeholder="₹ 5000" className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-700 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm mb-1">Enter Remaining Amount</label>
                <input type="text" placeholder="₹ 0.00" className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-700 focus:outline-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="confirmAmount"                 className="appearance-none h-5 w-5 border border-gray-300 rounded-sm checked:bg-white checked:border-white checked:after:content-['✔'] checked:after:text-blue-500 checked:after:block checked:after:text-center" />
                <label htmlFor="confirmAmount" className="text-sm text-blue-600">Please Confirm Your Amount</label>
              </div>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded flex items-center justify-center gap-2">
                <FaDownload /> Generate Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default D8PaymentCollection;
