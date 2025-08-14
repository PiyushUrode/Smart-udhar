import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { FaBoxOpen } from "react-icons/fa";

const generateScore = () => Math.floor(Math.random() * 101);

const customers = [
  { id: "CUST001", name: "Rahul Verma", mobile: "9876543210", email: "rahul@mail.com", city: "Delhi", state: "Delhi", score: generateScore() },
  { id: "CUST002", name: "Priya Sharma", mobile: "9012345678", email: "priya@company.com", city: "Mumbai", state: "Maharashtra", score: generateScore() },
  { id: "CUST003", name: "Aman Khurana", mobile: "9012345678", email: "rahul@mail.com", city: "Delhi", state: "Delhi", score: generateScore() },
  { id: "CUST004", name: "Sneha Reddy", mobile: "9876543210", email: "rahul@mail.com", city: "Balaghat", state: "Madhyapradesh", score: generateScore() },
  { id: "CUST005", name: "Vikram Singh", mobile: "9012345678", email: "rahul@mail.com", city: "Pune", state: "Maharashtra", score: generateScore() },
  { id: "CUST006", name: "Meena Patel", mobile: "9876543210", email: "rahul@mail.com", city: "Delhi", state: "Delhi", score: generateScore() },
  { id: "CUST007", name: "Arjun Mehta", mobile: "9876543210", email: "meena@shopkart.com", city: "Delhi", state: "Delhi", score: generateScore() },
  { id: "CUST008", name: "Neha Kapoor", mobile: "9876543210", email: "rahul@mail.com", city: "Mumbai", state: "Maharashtra", score: generateScore() },
  { id: "CUST009", name: "Ramesh Iyer", mobile: "9012345678", email: "rahul@mail.com", city: "Pune", state: "Maharashtra", score: generateScore() },
  { id: "CUST010", name: "Rahul Verma", mobile: "9012345678", email: "meena@shopkart.com", city: "Pune", state: "Maharashtra", score: generateScore() },
];

const CustomerDetailsForm = () => {
  const getScoreColor = (score) => {
    if (score < 40) return "text-red-600";
    if (score <= 70) return "text-yellow-500";
    return "text-green-600";
  };

  return (
    <div className="p-4 w-full max-w-7xl mt-5 md:mt-10 mx-auto bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-3">
        <h2 className="text-base md:text-2xl font-bold">Customer Details</h2>
        <div className="flex flex-row gap-3 items-center">
          <button className="bg-lightbluecol text-white px-4 py-2 text-xs md:text-base rounded-lg hover:bg-blue-600">
            Add Customer
          </button>
          <div className="flex flex-row gap-2 items-center text-bluecol cursor-pointer">
            <h1>Filters</h1>
            <IoIosArrowDown />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-separate border-spacing-0  border-[#E5E7EB] border-y border-x-2  rounded-lg shadow-customSoft ">
          <thead >
            <tr className="bg-[#F9FAFB]  text-left  text-lightblack">
              <th className="p-3 font-semibold py-5 
">Unique ID</th>
              <th className="p-3 font-semibold py-5">Name</th>
              <th className="p-3 font-semibold py-5">Mobile</th>
              <th className="p-3 font-semibold py-5">Email</th>
              <th className="p-3 font-semibold py-5">Score Card</th>
              <th className="p-3 font-semibold py-5">City</th>
              <th className="p-3 font-semibold py-5">State</th>
              <th className="p-3 font-semibold py-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust, index) => (
              <tr
                key={index}
                className="bg-white text-left  shadow-customSoft"
              >
                <td className="p-3  text-black font-robotoM border-y">{cust.id}</td>
                <td className="p-3 text-[#111827] font-robotoR border-y">{cust.name}</td>
                <td className="p-3 text-[#111827] font-robotoR  border-y">{cust.mobile}</td>
                <td className="p-3 border-y font-robotoR text-blue-600 hover:underline cursor-pointer">
                  {cust.email}
                </td>
                <td
                  className={`p-3 border-y  font-robotoR  ${getScoreColor(
                    cust.score
                  )}`}
                >
                  {cust.score}
                </td>
                <td className="p-3 border-y font-robotoR">{cust.city}</td>
                <td className="p-3 border-y font-robotoR ">{cust.state}</td>
                <td className="p-3 border-y text-center space-x-2">
                  <button className="text-[#2563EB] hover:text-blue-700">
                    <FiEdit className="w-5 h-5" />
                  </button>
                  <button className="text-[#DC2626] hover:text-red-700">
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                  <button className="text-[#4B5563] hover:text-gray-700">
                    <FaBoxOpen className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerDetailsForm;
