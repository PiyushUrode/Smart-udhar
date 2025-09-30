import { FaChevronDown, FaChevronUp, FaCloudUploadAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { StaffService } from "../../api/staffDetails.js";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../common/Button.jsx";

const D5StaffDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [popupType, setPopupType] = useState(null); // success | error
  const [popupMessage, setPopupMessage] = useState("");
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
  const [formErrors, setFormErrors] = useState({});

  const requiredFields = ["firstName", "lastName", "emailId", "roles", "mobileNumber"];

  // 🔹 Fetch staff if editing
  useEffect(() => {
    const fetchStaff = async () => {
      if (!id) return;

      try {
        const res = await StaffService.findStaffById(id);
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

  // Auto-close popup & redirect after success
  useEffect(() => {
    if (popupType === "success") {
      const timer = setTimeout(() => {
        setPopupType(null);
      }, 5000); // 5 sec delay
      
      navigate("/dashboard/staff-role");
      return () => clearTimeout(timer);
    }
  }, [popupType, navigate]);

  // Input change
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
      setFormErrors((prev) => ({ ...prev, [id]: "" })); // Clear field error on change
    }
  };

  // Validation
  const validateForm = () => {
    const errors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        errors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
      }
    });

    // Email check
    if (formData.emailId && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.emailId)) {
      errors.emailId = "Enter a valid email";
    }

    // Mobile check
    if (
      formData.mobileNumber &&
      !/^[6-9]\d{9}$/.test(String(formData.mobileNumber).trim())
    ) {
      errors.mobileNumber = "Enter a valid 10-digit mobile number";
    }

    return errors;
  };



const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ Run validation before API call
  const errors = validateForm();
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);   // Show field errors
    toast.error("Please fix the highlighted errors before submitting.");
    return; // ⛔ Stop execution
  }

  try {
    setLoading(true);
    let res;

    if (id) {
      console.log("🟢 Update Member clicked, calling updateStaff API...");
      res = await StaffService.updateStaff(id, formData, staffImage);
      console.log("✅ Update API Response:", res);
      setPopupType("success");
      setPopupMessage("Staff updated successfully!");
    } else {
      console.log("🟡 Add Member clicked, calling createStaff API...");
      res = await StaffService.createStaff(formData, staffImage);
      console.log("✅ Create API Response:", res);
      setPopupType("success");
      setPopupMessage("Staff member added successfully!");
    }
  } catch (error) {
    console.error("❌ Error during staff submit:", error);
    setPopupType("error");
    setPopupMessage("Failed to process request!");
  } finally {
    setLoading(false);
  }
};


  const fields = [
    { id: "firstName", label: "First Name", placeholder: "Enter first name" },
    { id: "lastName", label: "Last Name", placeholder: "Enter last name" },
    { id: "mobileNumber", label: "Mobile Number", placeholder: "Enter mobile number" },
    { id: "emailId", label: "Email Id", placeholder: "Enter email address" },
    { id: "address", label: "Address", placeholder: "Enter full address" },
    { id: "pinNumber", label: "Pin Number", placeholder: "Enter pin code" },
    { id: "city", label: "City", placeholder: "Enter city" },
    { id: "state", label: "State", placeholder: "Enter state" },
    { id: "roles", label: "Roles", placeholder: "Enter staff role" },
  ];

  return (
    <div className="max-w-4xl mx-auto my-5 p-4 sm:p-6 bg-white rounded-lg shadow-xl">
      {/* Header */}
      <div
        className="flex justify-between items-center bg-bluecol text-white p-4 rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-base md:text-xl lg:text-2xl">
          {id ? "Edit Staff Details" : "Add Staff Details"}
        </h2>
        <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
      </div>

      {isOpen && (
        <form className="mt-6 p-2 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ id, label, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-medium mb-1 capitalize">
                  {label} {requiredFields.includes(id) && "*"}
                </label>
                <input
                  id={id}
                  type="text"
                  placeholder={placeholder}
                  value={formData[id] || ""}
                  onChange={handleChange}
                  className={`p-2 border rounded-md focus:outline-none focus:ring w-full ${
                    formErrors[id] ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors[id] && (
                  <p className="text-red-500 text-sm mt-1">{formErrors[id]}</p>
                )}
              </div>
            ))}

            {/* Upload Section */}
            <div className="border border-dashed border-gray-400 p-6 mt-4 flex flex-col items-center text-center rounded-md">
              <FaCloudUploadAlt size={30} color="#9CA3AF" />
              <label htmlFor="upload" className="cursor-pointer">
                <div className="text-[#4B5563] text-sm">Drop files here or click to upload</div>
                <input
                  id="upload"
                  type="file"
                  className="hidden"
                  onChange={handleChange}
                />
              </label>
              <p className="mt-2 text-sm font-semibold">{staffImage ? staffImage.name : ""}</p>
            </div>
          </div>

          {/* Image error */}
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#2176FF] hover:bg-blue-600 text-white font-robotoSb px-6 py-2 rounded-md"
            >
              {loading ? "Processing..." : id ? "Update Member" : "Add Member"}
            </button>
          </div>

          {/* Popup */}
          {popupType && (
            <Button
              type={popupType}       // success | error
              message={popupMessage} // "Staff updated successfully!" etc.
              onClose={() => setPopupType(null)} // manual close (optional)
            />
          )}
        </form>
      )}
    </div>
  );
};

export default D5StaffDetails;
