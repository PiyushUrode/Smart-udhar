import { FaChevronDown, FaChevronUp, FaCloudUploadAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { StaffService } from "../../api/staffDetails.js";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const D5StaffDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    emailId: "",
    address: "",
    pinNumber: "",
    city: "",
    state: "",
    roles: ""
  });
  const [staffImage, setStaffImage] = useState(null);
  const [error, setError] = useState("");

  // 🔹 Fetch staff if editing
  useEffect(() => {
    const fetchStaff = async () => {
      if (!id) return; // add mode

      try {
        const res = await StaffService.findStaffById(id);
        console.log("Fetched Staff:", res);

        // ⚠️ adjust if API response is wrapped
        const staff = res?.staff || res?.data || res;

        setFormData({
          firstName: staff.firstName || "",
          lastName: staff.lastName || "",
          mobileNumber: staff.mobileNumber || "",
          emailId: staff.emailId || "",
          address: staff.address || "",
          pinNumber: staff.pinNumber || "",
          city: staff.city || "",
          state: staff.state || "",
          roles: staff.roles || ""
        });
      } catch (err) {
        console.error("❌ Failed to fetch staff:", err);
        toast.error("Failed to load staff details");
      }
    };

    fetchStaff();
  }, [id]);

  const handleChange = (e) => {
    const { id, value, files } = e.target;

    if (files) {
      const file = files[0];
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB");
        setStaffImage(null);
        return;
      }
      setError("");
      setStaffImage(file);
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (id) {
        // 🔹 Edit staff
        res = await StaffService.updateStaff(id, formData, staffImage);
        toast.success("✅ Staff updated successfully!");
      } else {
        // 🔹 Add staff
        res = await StaffService.createStaff(formData, staffImage);
        toast.success("✅ Staff member added successfully!");
      }

      console.log("API Response:", res);
      navigate("/dashboard/staff-list"); // redirect if needed
    } catch (err) {
      console.error("❌ Error saving staff:", err);
      toast.error(err.response?.data?.message || "Failed to save staff");
    }
  };
  const dummyPlaceholders = {
  "First Name": "Amit",
  "Last Name": "Sharma",
  "Mobile Number": "9876543210",
  "Email ID": "amit.sharma@example.com",
  "Address": "221B, MG Road",
  "Pin Number": "400001",
  "City": "Mumbai",
  "State": "Maharashtra",
  "Roles": "Sales Executive",
};


  return (
    <div className="max-w-4xl mx-auto my-5 p-4 sm:p-6 bg-white rounded-lg shadow-xl">
      {/* Header */}
      <div
        className="flex justify-between items-center bg-[#3B82F6] text-white p-4 rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-robotoM">
          {id ? "Edit Staff Details" : "Add Staff Details"}
        </h2>
        <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
      </div>

      {isOpen && (
        <form className="mt-6 p-2 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "First Name",
              "Last Name",
              "Mobile Number",
              "Email ID",
              "Address",
              "Pin Number",
              "City",
              "State",
              "Roles"
            ].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-[#374151] mb-1 capitalize">
                  {field}
                </label>
               {field === "Mobile Number" ? (
  <div className="flex">
    <select
      className="border rounded-l-md bg-gray-100 text-sm px-2 py-2"
      value={formData.countryCode || "+91"}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, countryCode: e.target.value }))
      }
    >
      <option value="+91">+91 (IN)</option>
      <option value="+58">+58 (VE)</option>
    </select>
    <input
      id={field}
      type="text"
      placeholder={dummyPlaceholders[field]}
      value={formData[field]}
      onChange={handleChange}
      className="flex-1 border rounded-r-md px-4 py-2 text-sm bg-[#F6F8FA]"
    />
  </div>
) : (
  <input
    id={field}
    type="text"
    placeholder={dummyPlaceholders[field]}
    value={formData[field]}
    onChange={handleChange}
    className="p-2 border rounded-md focus:outline-none focus:ring w-full bg-[#F6F8FA]"
  />
)}

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

          {/* Error */}
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

          {/* Submit */}
          <div className="text-right">
            <button
              type="submit"
              className="bg-[#2176FF] hover:bg-blue-600 text-white font-robotoSb px-6 py-2 rounded-md"
            >
              {id ? "Update Member" : "Add Member"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default D5StaffDetails;
