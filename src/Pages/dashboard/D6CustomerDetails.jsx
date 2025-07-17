import React from "react";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import {

  FaBoxOpen,

} from "react-icons/fa";

const customers = [
  {
    id: "CUST001",
    name: "Rahul Verma",
    mobile: "9876543210",
    email: "rahul@mail.com",
    city: "Delhi",
    state: "Delhi",
  },
  {
    id: "CUST002",
    name: "Priya Sharma",
    mobile: "9012345678",
    email: "priya@company.com",
    city: "Mumbai",
    state: "Maharashtra",
  },
  {
    id: "CUST003",
    name: "Aman Khurana",
    mobile: "9012345678",
    email: "rahul@mail.com",
    city: "Delhi",
    state: "Delhi",
  },
  {
    id: "CUST004",
    name: "Sneha Reddy",
    mobile: "9876543210",
    email: "rahul@mail.com",
    city: "Balaghat",
    state: "Madhyapradesh",
  },
  {
    id: "CUST005",
    name: "Vikram Singh",
    mobile: "9012345678",
    email: "rahul@mail.com",
    city: "Pune",
    state: "Maharashtra",
  },
  {
    id: "CUST006",
    name: "Meena Patel",
    mobile: "9876543210",
    email: "rahul@mail.com",
    city: "Delhi",
    state: "Delhi",
  },
  {
    id: "CUST007",
    name: "Arjun Mehta",
    mobile: "9876543210",
    email: "meena@shopkart.com",
    city: "Delhi",
    state: "Delhi",
  },
  {
    id: "CUST008",
    name: "Neha Kapoor",
    mobile: "9876543210",
    email: "rahul@mail.com",
    city: "Mumbai",
    state: "Maharashtra",
  },
  {
    id: "CUST009",
    name: "Ramesh Iyer",
    mobile: "9012345678",
    email: "rahul@mail.com",
    city: "Pune",
    state: "Maharashtra",
  },
  {
    id: "CUST0010",
    name: "Rahul Verma",
    mobile: "9012345678",
    email: "meena@shopkart.com",
    city: "Pune",
    state: "Maharashtra",
  },
];

const CustomerDetailsForm = () => {
  return (
    <div className="p-4 w-full max-w-7xl mt-5 md:mt-10 mx-auto">
      <div className="flex justify-between items-center mb-4 px-3">
        <h2 className=" text-base md:text-2xl font-bold">Customer Details</h2>
       <div className="flex flex-row gap-3 justify-center align-middle items-center">  

        <button className="bg-bluecol text-white px-4 py-2 text-xs md:text-base rounded-lg hover:bg-blue-600">
          Add Customer
        </button>

        <div className="flex flex-row gap-2 justify-center items-center text-bluecol">   <h1> Filter</h1>   <IoIosArrowDown color="bluecol"/>   </div>
      </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Unique ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Mobile</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">City</th>
              <th className="p-3 border">State</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust, index) => (
              <tr key={index} className="hover:bg-gray-50  ">
                <td className="p-3 border text-[#111827] font-robotoM">{cust.id}</td>
                <td className="p-3 border text-[#111827] font-robotoM">{cust.name}</td>
                <td className="p-3 border text-[#111827] font-robotoM">{cust.mobile}</td>
                <td className="p-3 border text-blue-600 hover:underline cursor-pointer">
                  {cust.email}
                </td>
                <td className="p-3 border text-[#111827] font-robotoMc">{cust.city}</td>
                <td className="p-3 border text-[#111827] font-robotoMc">{cust.state}</td>
                <td className="p-3 border text-center space-x-2">
                  <button className="text-[#2563EB] hover:text-blue-700 ">
                    <FiEdit className="w-5 h-5 " />
                  </button>
                  <button className="text-[#DC2626] hover:text-red-700">
                    <FiTrash2 className="w-5 h-5 " />
                  </button>
                  <button className="text-[#4B5563] hover:text-gray-700">
                    <FaBoxOpen className="w-5 h-5 " />
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

export default CustomerDetailsForm