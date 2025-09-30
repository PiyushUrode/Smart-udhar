// src/components/D6AddCustomer.jsx
import React from "react";
import { FaUpload } from "react-icons/fa6";
import { useCustomerForm } from "../../api/addCustomerService";

const D6AddCustomer = () => {
  const {
    formData,
    preview,
    loading,
    errors,
    customerId,
    handleChange,
    handleClear,
    handleSubmit,
  } = useCustomerForm();

  const inputFields = [
    ["name", "Name", true],
    ["mobile", "Mobile", true],
    ["email", "Email", true],
    ["address", "Address", false],
    ["pin", "PIN", false],
    ["city", "City", false],
    ["state", "State", false],
    ["aadharCardNumber", "Aadhaar", false],
    ["panNumber", "PAN", false],
    ["companyName", "Company Name", false],
    ["gstNumber", "GST", false],
  ];

  return (
    <div className="max-w-5xl mx-auto mt-5 md:mt-10 pb-10 bg-white rounded-lg shadow-xl">
      <div className="flex justify-between bg-bluecol rounded-t-xl px-4 md:px-10 py-4 items-center mb-8">
        <h1 className="text-lg md:text-2xl font-bold text-white">
          {customerId ? "Update Customer" : "Add Customer"}
        </h1>
      </div>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6 px-10 max-w-5xl"
        onSubmit={handleSubmit}
      >
        {inputFields.map(([name, label, required]) => (
          <div key={name}>
            <label className="block text-sm text-gray-600">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={name === "mobile" ? "number" : name === "email" ? "email" : "text"}
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              placeholder={`Enter ${label}`}
              required={required}
              className={`w-full border rounded-md px-4 py-2 mt-1 text-sm bg-white ${
                errors[name] ? "border-red-500" : "border-gray-300"
              }`}
              maxLength={name === "mobile" ? 10 : undefined}
            />
            {errors[name] && (
              <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
            )}
          </div>
        ))}

        {/* Image Upload */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Upload Image (Optional)
          </label>
          <label
            htmlFor="image"
            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-md hover:border-blue-400 ${
              preview ? "bg-green-50" : "bg-white"
            }`}
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
                  Click to upload (PNG, JPG - max 2MB)
                </span>
              </>
            )}
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
          </label>
          {preview && (
            <></>
            // <button
            //   type="button"
            //   onClick={() => handleClear()}
            //   className="mt-2 text-sm text-red-500 hover:underline"
            // >
            //   Remove
            // </button>
          )}
        </div>

        <div className="md:col-span-2 mt-8 flex flex-wrap justify-center gap-4">
          {!customerId && (
            <button
              type="button"
              onClick={handleClear}
              className="bg-bluecol text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Clear Fields
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`text-white px-4 py-2 rounded-md text-sm font-medium ${
              loading ? "bg-gray-400" : "bg-green-600"
            }`}
          >
            {loading
              ? "Submitting..."
              : customerId
              ? "Update Customer"
              : "Create Customer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default D6AddCustomer;
