import React from "react";
import { FaUpload } from "react-icons/fa6";

const D6AddCustomer = () => {
  return (
    <div className="max-w-5xl mx-auto mt-5 md:mt-10 pb-10 bg-white rounded-lg shadow-xl">
      <div className="flex justify-between bg-bluecol rounded-t-xl px-4  md:px-10 py-4 items-center mb-8">
        <h1 className=" text-lg md:text-2xl font-bold text-white">Customer Details </h1>
        <button className="bg-[#F6F8FA] text-[#636878] px-5 py-2 rounded-md text-sm font-medium">Add Customer</button>
      </div>

      <form className="grid   grid-cols-1 md:grid-cols-2 gap-6 px-10 max-w-5xl">
        <div>
          <label className="block text-sm text-gray-600">Unique ID</label>
          <input
            type="text"
            placeholder="Auto Generated"
            disabled
            className="w-full border rounded-md px-4 py-2 mt-1 bg-gray-100 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Name</label>
          <input
            type="text"
            placeholder="Enter Customer Name"
            className="w-full border rounded-md px-4 py-2 mt-1 text-sm bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Mobile</label>
          <input
            type="text"
            placeholder="Enter Mobile Number"
            className="w-full border rounded-md px-4 py-2 mt-1 text-sm bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Email</label>
          <input
            type="email"
            placeholder="Enter Email Address"
            className="w-full border rounded-md px-4 py-2 mt-1 text-sm bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Address</label>
          <input
            type="text"
            placeholder="Enter Address"
            className="w-full border rounded-md px-4 py-2 mt-1 text-sm bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">PIN</label>
          <input
            type="text"
            placeholder="Enter PIN Code"
            className="w-full border rounded-md px-4 py-2 mt-1 text-sm bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">City</label>
          <input
            type="text"
            placeholder="Enter City"
            className="w-full border rounded-md px-4 py-2 mt-1 text-sm bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">State</label>
          <input
            type="text"
            placeholder="Enter State"
            className="w-full border rounded-md px-4 py-2 mt-1 text-sm bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Aadhar Card Number</label>
          <input
            type="text"
            placeholder="Enter Aadhar Card Number"
            className="w-full border rounded-md px-4 py-2 mt-1 text-sm bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">PAN Number</label>
          <input
            type="text"
            placeholder="Enter PAN Number"
            className="w-full border rounded-md px-4 py-2 mt-1 text-sm bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Company Name</label>
          <input
            type="text"
            placeholder="Enter Company Name"
            className="w-full border rounded-md px-4 py-2 mt-1 text-sm bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">GST Number</label>
          <input
            type="text"
            placeholder="Enter GST Number"
            className="w-full border rounded-md px-4 py-2 mt-1 text-sm bg-gray-100"
          />
        </div>
      </form>

      <div className="mt-8 flex flex-wrap justify-center items-center align-middle gap-4">
        <button className="bg-bluecol text-white px-4 py-2 rounded-md text-sm font-medium">Clear Fields</button>
        <button className="border border-gray-300 bg-white text-black px-4 py-2 rounded-md text-sm font-medium flex flex-row gap-3"> <FaUpload color="bluecol"/>Import CSV</button>
        <button className="text-sm text-gray-700">Add Customer</button>
      </div>
    </div>
  );
};




export default D6AddCustomer