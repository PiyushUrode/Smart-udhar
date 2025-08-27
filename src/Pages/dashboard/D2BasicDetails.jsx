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
import { useParams, useNavigate } from "react-router-dom";
import { ProfileService } from "../../api/profileservice.js";
import { AuthService } from "../../api/authservice.js";
import { toast } from "react-toastify";

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
  bio: "",
  industry: "",
  fbURL: "",
  twitterURL: "",
  linkedInURL: "",
  instagramURL: "",
  websiteURL: "",
  store_id: ""  // ✅ not array
});

  const validateForm = () => {
  const requiredFields = ["businessName", "address", "pincode", "mobile", "email"];
  const newErrors = {};

  requiredFields.forEach((field) => {
    if (!formData[field] || formData[field].trim() === "") {
      newErrors[field] = `${field} is required`;
    }
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      res = await ProfileService.updateProfile(id, formData, signatureImage, logoImage);
    } else {
      res = await ProfileService.createProfile(formData, signatureImage, logoImage);
    }

    console.log("✅ handleSubmit -> Final API Response:", res);

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
                  className="w-full border rounded px-3 py-2 outline-none bg-white"
                />
                 {errors.businessName && (
    <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>
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
                  className="w-full border rounded px-3 py-2 outline-none bg-white"
                />
                 {errors.gstNumber && (
    <p className="text-red-500 text-xs mt-1">{errors.gstNumber}</p>
  )}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm mb-1 block">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                className="w-full border rounded px-3 py-2 outline-none bg-[#FAFAFA]"
              />
               {errors.address && (
    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
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
                  className="w-full border rounded px-3 py-2 outline-none bg-white"
                />
                 {errors.pincode && (
    <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
  )}
              </div>

              <div>
                <label className="text-sm mb-1 block">Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 outline-none bg-white"
                />  {errors.mobile && (
    <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
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
                className="w-full border rounded px-3 py-2 outline-none bg-white"
              />  {errors.email && (
    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
  )}
            </div>

            <div className="mt-4">
              <label className="text-sm mb-1 block">
                Short Bio{" "}
                <span className="text-xs text-gray-500">(160 words max)</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded px-3 py-2 outline-none bg-white"
              />  {errors.bio && (
    <p className="text-red-500 text-xs mt-1">{errors.bio}</p>
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
                    className="input bg-white text-[#B9B9B9] w-full"
                  >
                    <option>Select Industry</option>
                    <option value="Food">Food</option>
                    <option value="Retail">Retail</option>
                    <option value="IT">IT</option>
                  </select>

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