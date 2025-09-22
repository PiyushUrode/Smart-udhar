import React, { useState, useEffect } from "react";
import { CircleChevronDown } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { FaUpload } from "react-icons/fa6";
import Button from "../../common/Button.jsx";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { ProfileService } from "../../api/profileservice.js";
import { AuthService } from "../../api/authservice.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const D2BasicDetails = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const [popupType, setPopupType] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [signatureImage, setSignatureImage] = useState(null);
  const [logoImage, setLogoImage] = useState(null);

const [formData, setFormData] = useState({
  businessName: "",
  gstNumber: "",
  address: "",
  pincode: "",
  mobile: "",
  email: "",
  shortBio: "",
  industry: "",
  fbURL: "",
  twitterURL: "",
  linkedInURL: "",
  instagramURL: "",
  websiteURL: "",
  store_id: ""  // ✅ not array
});

 const validateForm = () => {
  const requiredFields = [
    "businessName",
    "address",
    "pincode",
    "mobile",
    "email",
    "industry",
    "fbURL",
    "twitterURL",
    "linkedInURL",
    "instagramURL",
  ];
  const newErrors = {};
  

  // Required fields
  requiredFields.forEach((field) => {
    if (!formData[field] || formData[field].trim() === "") {
      newErrors[field] = `${field} is required`;
    }
  });

  // Business Name
  if (formData.businessName && !/^[a-zA-Z0-9\s&.-]{3,50}$/.test(formData.businessName)) {
    newErrors.businessName = "Business name must be 3-50 chars (letters, numbers, . - & allowed)";
  }

  // GST → 15 char alphanumeric
  if (formData.gstNumber && !/^[0-9A-Z]{15}$/.test(formData.gstNumber.toUpperCase())) {
    newErrors.gstNumber = "Invalid GST number format (15 digits, letters & numbers)";
  }

  // Pincode
  if (formData.pincode && !/^[1-9][0-9]{5}$/.test(formData.pincode)) {
    newErrors.pincode = "Pincode must be 6 digits";
  }

  // Mobile


// Now validate
if (mobile && !/^[6-9]\d{9}$/.test(mobile)) {
  newErrors.mobile = "Mobile number must be 10 digits & start with 6-9";
}


  // Email
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.toLowerCase())) {
    newErrors.email = "Invalid Email format";
  }

  // Validation for industry
if (!formData.industry || formData.industry === "Select Industry") {
  newErrors.industry = "Please select an Industry type";
} else if (!/^[a-zA-Z\s]{2,30}$/.test(formData.industry)) {
  newErrors.industry = "Industry must be 2-30 letters only";
}


  // Social Media Links → must be valid URLs now
  const urlPattern = /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/\S*)?$/;
  ["fbURL", "twitterURL", "linkedInURL", "instagramURL"].forEach((field) => {
    if (formData[field] && !urlPattern.test(formData[field])) {
      newErrors[field] = `Enter a valid ${field} URL`;
    }
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


// Clean mobile before validating
let mobile = formData.mobile?.trim() || "";

// Remove +91 or 91 from start
mobile = mobile.replace(/^(\+91|91)/, "");

// Remove leading 0 if present
mobile = mobile.replace(/^0+/, "");



const handleBlur = (e) => {
  validateForm(); // validate on leaving field
};



  const handleChange = (e) => {
    let { name, value } = e.target;

    // Auto-format rules
    if (name === "gstNumber") {
      value = value.toUpperCase(); // GST always uppercase
    }
    if (name === "email") {
      value = value.toLowerCase(); // email always lowercase
    }

    setFormData({ ...formData, [name]: value });
  };


  const handleFileChange = (e, type) => {
    if (type === "signature") setSignatureImage(e.target.files[0]);
    if (type === "logo") setLogoImage(e.target.files[0]);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ Step 1: Run validateForm function
  if (!validateForm()) {
    console.warn("⚠️ Validation Failed:", errors);
    setPopupType("error");
    return;
  }

  // ✅ Step 2: API Call
  try {
    setPopupType("processing");

    let res;
    if (id) {
      // 🔄 UPDATE profile
      res = await ProfileService.updateProfile(id, formData, signatureImage, logoImage);
      console.log("✅ Profile Updated Successfully!");
    } else {
      // 🆕 CREATE profile
      res = await ProfileService.createProfile(formData, signatureImage, logoImage);
      console.log("✅ Profile Created Successfully!");
    }

    // 🕵️‍♂️ Debugging Console Logs
    console.log("📌 Store ID:", res?.data?.store_id || res?.store_id || "Not Found");
    console.log("📌 Profile ID:", res?.data?.id || res?.id || "Not Found");

    // ✅ Step 3: Success
    setPopupType("success");
    navigate("/dashboard/bussinessList");
  } catch (err) {
    console.error("❌ handleSubmit Error:", err.message);
    setPopupType("error");
  }
};



useEffect(() => {
  const fetchData = async () => {
    if (id) {
      try {
        const res = await ProfileService.getProfile(id);
        console.log("📌 Prefill profile data:", res);

        setFormData((prev) => ({
          ...prev,
          ...(res.data || res),
        }));
      } catch (err) {
        console.error("❌ Error fetching details:", err.message);
      }
    }
  };
  fetchData();
}, [id]);

  return (
    <div className="bg-[#FAFAFA] py-10 px-4">
      <div className="max-w-3xl mx-auto bg-[#FFFFFF] rounded-xl shadow-[0px_10px_15px_0px_#0000001A] p-0 md:p-4">
        <div className="flex flex-row justify-center items-center align-middle justify-between max-w-3xl p-2 md:pr-10 w-full">
          <div className="text-[#374151] text-sm lg:text-xl font-robotoB py-3 px-1 rounded-t-xl">
            Business Profile
          </div>
        </div>

        <div className="flex flex-row justify-center items-center align-middle justify-between max-w-3xl p-2 pr-10 bg-lightbluecol w-full rounded-xl">
          <div className="text-white text-base md:text-lg font-semibold py-3 px-6 rounded-t-xl">
            Basic Information
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-1 block">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                                  autoComplete="off"
                onBlur={handleBlur}
                  className="w-full border rounded px-3 py-2 outline-none bg-white"
                />
                 {errors.businessName && (
    <p className="text-red-500 text-xs mt-1 capitalize ">{errors.businessName}</p>
  )}
              </div>

              <div>
                <label className="text-sm mb-1 block">
                  GST Number{" "}
                  <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                                    autoComplete="off"
                                  
                onBlur={handleBlur}
                  className="w-full border rounded px-3 py-2 outline-none bg-white"
                />
                 {errors.gstNumber && (
    <p className="text-red-500 text-xs mt-1 capitalize">{errors.gstNumber}</p>
  )}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm mb-1 block">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                                  autoComplete="off"
                onBlur={handleBlur}
                rows="2"
                className="w-full border rounded px-3 py-2 outline-none bg-[#FAFAFA]"
              />
               {errors.address && (
    <p className="text-red-500 text-xs mt-1 capitalize">{errors.address}</p>
  )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm mb-1 block">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                                    autoComplete="off"
                onBlur={handleBlur}
                  className="w-full border rounded px-3 py-2 outline-none bg-white"
                />
                 {errors.pincode && (
    <p className="text-red-500 text-xs mt-1 capitalize">{errors.pincode}</p>
  )}
              </div>

              <div>
                <label className="text-sm mb-1 block">Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                                    autoComplete="off"
                onBlur={handleBlur}
                  className="w-full border rounded px-3 py-2 outline-none bg-white"
                />  {errors.mobile && (
    <p className="text-red-500 text-xs mt-1 capitalize">{errors.mobile}</p>
  )}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                  autoComplete="off"
                onBlur={handleBlur}
                className="w-full border rounded px-3 py-2 outline-none bg-white"
              />  {errors.email && (
    <p className="text-red-500 text-xs mt-1 capitalize">{errors.email}</p>
  )}
            </div>

            <div className="mt-4">
              <label className="text-sm mb-1 block">
                Short shortBio{" "}
                <span className="text-xs text-gray-500">(160 words max)</span>
              </label>
              <textarea
                name="shortBio"
                value={formData.shortBio}
                onChange={handleChange}
                                  autoComplete="off"
                onBlur={handleBlur}
                rows="3"
                className="w-full border rounded px-3 py-2 outline-none bg-white"
              />  {errors.shortBio && (
    <p className="text-red-500 text-xs mt-1 capitalize">{errors.shortBio}</p>
  )}
            </div>
          </section>

          <section>
            <div className="flex flex-row justify-between items-center max-w-3xl p-4 align-middle rounded-lg bg-bluecol">
              <h2 className="font-semibold text-sm text-white mb-2">
                Detailed Information
              </h2>
              <div
                className="cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                <CircleChevronDown
                  className={`transition-transform duration-300 text-white ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            </div>
          </section>

          {isOpen && (
            <section>
              <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg space-y-6">
                <div className="space-y-4">
                  <label className="text-sm mb-1 block">Industries Type</label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                                      autoComplete="off"
                onBlur={handleBlur}
                    className="input bg-white text-black w-full"
                  >
                    <option>Select Industry</option>
                    <option value="Food">Food</option>
                    <option value="Retail">Retail</option>
                    <option value="IT">IT</option>
                  </select>
                  {errors.industry && <p className="text-red-500 text-xs">{errors.industry}</p>}

                  <label className="text-sm mb-1 block">
                    Social Media Links
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center bg-white border p-2 rounded-md px-3">
                      <FaFacebookF
                        className="text-gray-500 mr-3"
                        color="#2563EB"
                      />
                      <input
                        type="text"
                        name="fbURL"
                        value={formData.fbURL}
                        onChange={handleChange}
                                          autoComplete="off"
                onBlur={handleBlur}
                        placeholder="Facebook URL"
                        className="bg-transparent outline-none w-full"
                      />
                    </div>
                    <div className="flex items-center bg-white border p-2 rounded-md px-3">
                      <FaTwitter
                        className="text-gray-500 mr-3"
                        color="#2563EB"
                      />
                      <input
                        type="text"
                        name="twitterURL"
                        value={formData.twitterURL}
                        onChange={handleChange}
                                          autoComplete="off"
                onBlur={handleBlur}
                        placeholder="Twitter URL"
                        className="bg-transparent outline-none w-full"
                      />
                    </div>
                    <div className="flex items-center bg-white border p-2 rounded-md px-3">
                      <FaLinkedinIn
                        className="text-gray-500 mr-3"
                        color="#2563EB"
                      />
                      <input
                        type="text"
                        name="linkedInURL"
                        value={formData.linkedInURL}
                        onChange={handleChange}
                                          autoComplete="off"
                onBlur={handleBlur}
                        placeholder="LinkedIn URL"
                        className="bg-transparent outline-none w-full"
                      />
                    </div>
                    <div className="flex items-center bg-white border p-2 rounded-md px-3">
                      <FaInstagram
                        className="text-gray-500 mr-3"
                        color="#DB2777"
                      />
                      <input
                        type="text"
                        name="instagramURL"
                        value={formData.instagramURL}
                        onChange={handleChange}
                                          autoComplete="off"
                onBlur={handleBlur}
                        placeholder="Instagram URL"
                        className="bg-transparent outline-none w-full"
                      />
                    </div>
                  </div>

                  <label className="text-sm mb-1 block">Website</label>
                  <input
                    type="text"
                    name="websiteURL"
                    value={formData.websiteURL}
                    onChange={handleChange}
                                      autoComplete="off"
                onBlur={handleBlur}
                    placeholder="https://example.com"
                    className="input bg-white w-full"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm mb-1 block">
                        Signature Upload
                      </label>
                      <div className="border border-dashed p-6 rounded-md text-center text-gray-500 bg-white">
                        <div className="w-full justify-center flex">
                          <FaUpload color="#6B7280" className="w-5 h-5" />
                        </div>
                        <p>
                          Drag and drop your <br /> signature image here or
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "signature")}
                          className="mt-2 px-4 py-2 text-xs md:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm mb-1 block">
                        Business Logo Upload
                      </label>
                      <div className="border border-dashed p-6 rounded-md text-center text-gray-500 bg-white">
                        <div className="w-full justify-center flex">
                          <FaUpload color="#6B7280" className="w-5 h-5" />
                        </div>
                        <p>Drag and drop your <br /> logo here or</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "logo")}
                          className="mt-2 px-4 py-2 text-xs md:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-bluecol text-white rounded hover:bg-blue-700 transition"
            >
              {id ? "Update Changes" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {popupType && (
        <Button type={popupType} onClose={() => setPopupType(null)} />
      )}
    </div>
  );
};

export default D2BasicDetails;