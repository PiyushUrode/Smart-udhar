import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaCloudUploadAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { StaffService } from "../../api/staffDetails";

const D5StaffDetails = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    address: "",
    pin: "",
    city: "",
    state: "",
    role: ""
  });
  const [staffImage, setStaffImage] = useState(null);

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (files) {
      setStaffImage(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await StaffService.createStaff(formData, staffImage);
      toast.success("✅ Staff member added successfully!");
      console.log("API Response:", res);

      setFormData({
        firstName: "",
        lastName: "",
        mobileNumber: "",
        email: "",
        address: "",
        pin: "",
        city: "",
        state: "",
        role: ""
      });
      setStaffImage(null);
    } catch (err) {
      console.error("❌ Error creating staff:", err);
      toast.error(err.response?.data?.message || "Failed to add staff");
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-5 p-4 sm:p-6 bg-white rounded-lg shadow-xl">
      {/* Header */}
      <div
        className="flex justify-between items-center bg-[#3B82F6] text-white p-4 rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-robotoM">Add Staff Details</h2>
        <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
      </div>

      {isOpen && (
        <form className="mt-6 p-2 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["firstName","lastName","mobileNumber","email","address","pin","city","state","role"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-[#374151] mb-1 capitalize">
                  {field}
                </label>
                <input
                  id={field}
                  type="text"
                  placeholder={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="p-2 border rounded-md focus:outline-none focus:ring w-full bg-[#F6F8FA]"
                />
              </div>
            ))}

            {/* Upload */}
            <div className="border border-dashed border-gray-400 p-6 mt-4 flex flex-col items-center text-center rounded-md">
              <FaCloudUploadAlt size={30} color="#9CA3AF" />
              <label htmlFor="upload" className="cursor-pointer">
                <div className="text-[#4B5563] text-sm">
                  Drop files here or click to upload
                </div>
                <input
                  id="upload"
                  type="file"
                  className="hidden"
                  onChange={handleChange}
                />
              </label>
              <p className="mt-2 text-sm font-semibold">
                {staffImage ? staffImage.name : "Upload Image Here"}
              </p>
            </div>
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
