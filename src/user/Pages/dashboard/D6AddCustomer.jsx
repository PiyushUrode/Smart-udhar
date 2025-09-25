// src/pages/D6AddCustomer.jsx
import { FaUpload } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CustomerService } from "../../api/customerService.js";
import Button from "../../common/Button.jsx"; // ✅ Import global button

const D6AddCustomer = () => {
  const location = useLocation();

  const editingCustomer = location.state?.customer || null;

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    countryCode: "+91",
    mobile: "",
    email: "",
    address: "",
    pin: "",
    city: "",
    state: "",
    aadharCardNumber: "",
    panNumber: "",
    companyName: "",
    gstNumber: "",
    product_image: null,
  });

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Global status modal
  const [status, setStatus] = useState(null);

  // Prefill if editing
  useEffect(() => {
    if (editingCustomer) {
      let countryCode = "+91";
      let mobile = editingCustomer.mobile || "";
      const match = mobile.match(/^(\+\d{1,3})(\d{7,12})$/);
      if (match) {
        countryCode = match[1];
        mobile = match[2];
      }

      setFormData({
        _id: editingCustomer._id || editingCustomer.id || "",
        name: editingCustomer.name || "",
        countryCode,
        mobile,
        email: editingCustomer.email || "",
        address: editingCustomer.address || "",
        pin: editingCustomer.pin || "",
        city: editingCustomer.city || "",
        state: editingCustomer.state || "",
        aadharCardNumber: editingCustomer.aadharCardNumber || "",
        panNumber: editingCustomer.panNumber || "",
        companyName: editingCustomer.companyName || "",
        gstNumber: editingCustomer.gstNumber || "",
        product_image: editingCustomer.product_image || null,
      });
      if (editingCustomer.product_image) {
        setPreview(editingCustomer.product_image);
      }
    }
  }, [editingCustomer]);

  // Image preview
  useEffect(() => {
    if (!formData.product_image || typeof formData.product_image === "string") return;
    const objectUrl = URL.createObjectURL(formData.product_image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.product_image]);

  // Input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validation
  // Validation
const validate = () => {
  let newErrors = {};

  // ✅ Required fields only
  if (!formData.name.trim()) newErrors.name = "Name is required";

  if (!formData.mobile.match(/^[6-9]\d{9}$/))
    newErrors.mobile = "Enter a valid 10-digit mobile number";

  if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
    newErrors.email = "Enter a valid email";

  // ✅ Optional fields: only validate if filled
  if (formData.aadharCardNumber && !formData.aadharCardNumber.match(/^\d{12}$/))
    newErrors.aadharCardNumber = "Enter 12-digit Aadhaar";

  if (formData.panNumber && !formData.panNumber.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/))
    newErrors.panNumber = "Enter PAN (ABCDE1234F)";

  if (formData.gstNumber && !formData.gstNumber.match(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/))
    newErrors.gstNumber = "Enter GST (22ABCDE1234F1Z5)";

  return newErrors;
};


  // Clear form
  const clearForm = () => {
    setFormData({
      _id: "",
      name: "",
      countryCode: "+91",
      mobile: "",
      email: "",
      address: "",
      pin: "",
      city: "",
      state: "",
      aadharCardNumber: "",
      panNumber: "",
      companyName: "",
      gstNumber: "",
      product_image: null,
    });
    setPreview(null);
    setErrors({});
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent double click

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setStatus("processing");

    try {
// Inside handleSubmit before API call
const payload = {
  ...formData,
  name: formData.name?.trim() || "Unnamed",  // fallback
  mobile: formData.mobile
    ? `${formData.countryCode}${formData.mobile}`
    : "+910000000000", // fallback
};


      let res;
      if (formData._id) {
        res = await CustomerService.updateCustomer(payload);
      } else {
        res = await CustomerService.createCustomer(payload);
      }

      console.log("Response:", res);
      setStatus("success");
      clearForm(); // ✅ Clear after submit
    } catch (error) {
      console.error("❌ Error:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-5 md:mt-10 pb-10 bg-white rounded-lg shadow-xl">
      {/* Header */}
      <div className="flex justify-between bg-bluecol rounded-t-xl px-4 md:px-10 py-4 items-center mb-8">
        <h1 className="text-lg md:text-2xl font-bold text-white">
          {formData._id ? "Edit Customer" : "Add Customer"}
        </h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 px-10 max-w-5xl"
      >
        {/* Inputs */}
        {/* Name */}
        <div>
          <label className="block text-sm text-gray-600">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Name"
            className={`w-full border rounded-md px-4 py-2 mt-1 text-sm bg-white ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Mobile with code */}
        <div>
          <label className="block text-sm text-gray-600">Mobile *</label>
          <div className="flex mt-1 gap-2">
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              className="border border-gray-300 rounded-l-md px-2 py-2 text-sm bg-white"
            >
              <option value="+91">+91</option>
            </select>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="10-digit number"
              className={`flex-1 border rounded-r-md px-4 py-2 text-sm bg-white ${
                errors.mobile ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
        </div>

        {/* Rest fields */}
        {[
          { key: "email", label: "Email *", type: "email" },
          { key: "address", label: "Address *" },
          { key: "pin", label: "PIN" },
          { key: "city", label: "City *" },
          { key: "state", label: "State *" },
          { key: "aadharCardNumber", label: "Aadhaar *" },
          { key: "panNumber", label: "PAN *" },
          { key: "companyName", label: "Company Name *" },
          { key: "gstNumber", label: "GST *" },
        ].map((field) => (
          <div key={field.key} className="w-full">
            <label className="block text-sm text-gray-600">{field.label}</label>
            <input
              type={field.type || "text"}
              name={field.key}
              value={formData[field.key]}
              onChange={handleChange}
              placeholder={`Enter ${field.label}`}
              className={`w-full border rounded-md px-4 py-2 mt-1 text-sm bg-white ${
                errors[field.key] ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors[field.key] && (
              <p className="text-red-500 text-xs mt-1">{errors[field.key]}</p>
            )}
          </div>
        ))}

        {/* Upload */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Upload Image</label>
          <label
            htmlFor="product_image"
            className={`relative flex flex-col items-center justify-center border-2 border-dashed 
              rounded-xl p-6 cursor-pointer transition-all duration-300 
              hover:shadow-md hover:border-blue-400
              ${preview ? "bg-green-50" : "bg-white"}`}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-lg shadow-sm"
              />
            ) : (
              <>
                <FaUpload size={36} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 font-medium">
                  Click to upload
                </span>
              <span className="text-sm text-gray-600 font-medium"> (PNG, JPG - max 2MB)</span>
              </>
            )}
            <input
              id="product_image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setFormData({ ...formData, product_image: file });
              }}
            />
          </label>
          {preview && (
            <button
              type="button"
              onClick={() => {
                setFormData({ ...formData, product_image: null });
                setPreview(null);
              }}
              className="mt-2 text-sm text-red-500 hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      </form>

      {/* Buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={clearForm}
          disabled={loading}
          className="bg-bluecol text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-60"
        >
          Clear Fields
        </button>

        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Saving..." : formData._id ? "Update" : "Submit"}
        </button>
      </div>

      {/* Status Modal */}
      {status && (
        <Button
          type={status}
          onClose={() => setStatus(null)}
        />
      )}
    </div>
  );
};

export default D6AddCustomer;
