import { FaUpload } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CustomerService } from "../../api/customerService.js";
import Button from "../../common/Button.jsx";

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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // Validation
  const validate = () => {
    let newErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.email = "Enter a valid email (e.g., example@domain.com)";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!formData.mobile.match(/^[6-9]\d{9}$/)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number starting with 6-9";
    }

    // Optional fields: validate only if filled
    if (formData.address && !formData.address.trim()) {
      newErrors.address = "Address cannot be empty if provided";
    }

    if (formData.pin && !formData.pin.match(/^\d{6}$/)) {
      newErrors.pin = "Enter a valid 6-digit PIN code";
    }

    if (formData.city && !formData.city.trim()) {
      newErrors.city = "City cannot be empty if provided";
    }

    if (formData.state && !formData.state.trim()) {
      newErrors.state = "State cannot be empty if provided";
    }

    if (formData.aadharCardNumber && !formData.aadharCardNumber.match(/^\d{12}$/)) {
      newErrors.aadharCardNumber = "Enter a valid 12-digit Aadhaar number";
    }

    if (formData.panNumber && !formData.panNumber.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) {
      newErrors.panNumber = "Enter a valid PAN (e.g., ABCDE1234F)";
    }

    if (formData.companyName && !formData.companyName.trim()) {
      newErrors.companyName = "Company name cannot be empty if provided";
    }

    if (
      formData.gstNumber &&
      !formData.gstNumber.match(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    ) {
      newErrors.gstNumber = "Enter a valid GST number (e.g., 22ABCDE1234F1Z5)";
    }

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
    if (loading) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setStatus("processing");

    try {
      const payload = {
  name: formData.name.trim(),
  mobile: `${formData.countryCode}${formData.mobile}`,
  email: formData.email.trim(),
  address: formData.address.trim() || "N/A",
  pin: formData.pin.trim() || "000000",
  city: formData.city.trim() || "N/A",
  state: formData.state.trim() || "N/A",
  aadharCardNumber: formData.aadharCardNumber.trim() || "000000000000",
  panNumber: formData.panNumber.trim() || "AAAAA1111A",
  companyName: formData.companyName.trim() || "N/A",
  gstNumber: formData.gstNumber.trim() || "22AAAAA0000A1Z5",
  product_image: formData.product_image || "",

};


      let res;
      if (formData._id) {
        res = await CustomerService.updateCustomer(payload);
      } else {
        res = await CustomerService.createCustomer(payload);
      }

      console.log("Response:", res);
      setStatus("success");
      clearForm();
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

<div className="w-full ">
  <label className="block text-sm text-gray-600 mb-1">Mobile *</label>
  <div className="flex gap-5">
    {/* Country Code */}
    <div className="flex w-20 ">
      <select
        name="countryCode"
        value={formData.countryCode}
        onChange={handleChange}
        className="border border-gray-300 rounded-l-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="+91">+91</option>
        <option value="+1">+1</option>
        <option value="+44">+44</option>
      </select>
    </div>

    {/* Mobile Number */}
    <input
      type="text"
      name="mobile"
      value={formData.mobile}
      onChange={handleChange}
      placeholder="Enter 10-digit number"
      className={`flex-1 border border-gray-300 rounded-r-md px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        errors.mobile ? "border-red-500" : ""
      }`}
    />
  </div>

  {/* Error Message */}
  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
</div>


        {/* Email */}
        <div>
          <label className="block text-sm text-gray-600">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email"
            className={`w-full border rounded-md px-4 py-2 mt-1 text-sm bg-white ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Optional Fields */}
        {[
          { key: "address", label: "Address", type: "text" },
          { key: "pin", label: "PIN", type: "text" },
          { key: "city", label: "City", type: "text" },
          { key: "state", label: "State", type: "text" },
          { key: "aadharCardNumber", label: "Aadhaar", type: "text" },
          { key: "panNumber", label: "PAN", type: "text" },
          { key: "companyName", label: "Company Name", type: "text" },
          { key: "gstNumber", label: "GST", type: "text" },

        ].map((field) => (
          <div key={field.key} className="w-full">
            <label className="block text-sm text-gray-600">{field.label}</label>
            <input
              type={field.type}
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
                <span className="text-sm text-gray-600 font-medium">Click to upload</span>
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

        {/* Buttons */}
        <div className="md:col-span-2 mt-8 flex flex-wrap justify-center gap-4">
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
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Saving..." : formData._id ? "Update" : "Submit"}
          </button>
        </div>
      </form>

      {/* Status Modal */}
      {status && <Button type={status} onClose={() => setStatus(null)} />}
    </div>
  );
};

export default D6AddCustomer;