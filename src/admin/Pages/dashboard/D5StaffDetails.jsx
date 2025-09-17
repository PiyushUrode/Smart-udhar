

import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { FaCloudUploadAlt } from "react-icons/fa";

const D5StaffDetails = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="max-w-4xl mx-auto my-5 p-4 sm:p-6 bg-white rounded-lg shadow-xl">
      {/* Header */}
      <div
        className="flex justify-between items-center bg-[#3B82F6] text-white p-4 rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-robotoM">Add Details</h2>
        <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
      </div>

      {isOpen && (
        <form className="mt-6 p-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-[#374151] mb-1"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="First Name"
                className="p-2 border rounded-md focus:outline-none focus:ring w-full bg-[#F6F8FA]"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-[#374151] mb-1"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Last Name"
                className="p-2 border rounded-md focus:outline-none focus:ring w-full bg-[#F6F8FA]"
              />
            </div>

            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-medium text-[#374151] mb-1"
              >
                Mobile Number
              </label>
              <input
                id="mobileNumber"
                type="text"
                placeholder="Mobile Number"
                className="p-2 border rounded-md focus:outline-none focus:ring w-full bg-[#F6F8FA]"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#374151] mb-1"
              >
                Email ID
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email ID"
                className="p-2 border rounded-md focus:outline-none focus:ring w-full bg-[#F6F8FA]"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-[#374151] mb-1"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                placeholder="Address"
                className="p-2 border rounded-md focus:outline-none focus:ring w-full bg-[#F6F8FA]"
              />
            </div>

            <div>
              <label
                htmlFor="pin"
                className="block text-sm font-medium text-[#374151] mb-1"
              >
                Pin Number
              </label>
              <input
                id="pin"
                type="text"
                placeholder="Pin Number"
                className="p-2 border rounded-md focus:outline-none focus:ring w-full  bg-[#F6F8FA]"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-[#374151] mb-1"
              >
                City
              </label>
              <input
                id="city"
                type="text"
                placeholder="City"
                className="p-2 border rounded-md focus:outline-none focus:ring w-full  bg-[#F6F8FA]"
              />
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-[#374151] mb-1"
              >
                State
              </label>
              <input
                id="state"
                type="text"
                placeholder="State"
                className="p-2 border rounded-md focus:outline-none focus:ring w-full  bg-[#F6F8FA]"
              />
            </div>
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
          <div className="text-right">
            <button
              type="submit"
              className="bg-[#2176FF] hover:bg-blue-600 text-white font-robotoSb px-6 py-2 rounded-md"
            >
              Add Member
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default D5StaffDetails;
