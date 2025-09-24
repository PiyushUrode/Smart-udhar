// src/components/CreateSubscription.jsx

import React from "react";
import useSubscriptionController  from "../../controller/Subcriptions/CreateSubcriptionCTR.jsx";

function CreateSubscription() {
  const { id, formData, loading, message, handleChange, handleSubmit } =
    useSubscriptionController();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 bg-white shadow-lg rounded-2xl mt-10">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        {id ? "Update Subscription Plan" : "Create Subscription Plan"}
      </h2>
      {message && (
        <div className="mb-4 p-3 text-sm text-white bg-blue-500 rounded-lg text-center">
          {message}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
      >
        {/* Basic Info */}
        <label className="flex flex-col">
          <span className="mb-1 text-sm font-medium">Plan Name</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-400"
            required
          />
        </label>
        <label className="flex flex-col">
          <span className="mb-1 text-sm font-medium">Price</span>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-400"
            required
          />
        </label>
        <label className="flex flex-col">
          <span className="mb-1 text-sm font-medium">Billing Cycle</span>
          <select
            name="billingCycle"
            value={formData.billingCycle}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-400"
          >
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </label>
        {/* Limits */}
        {[
          { label: "SMS Limit", name: "smsLimit" },
          { label: "Email Limit", name: "emailLimit" },
          { label: "Call Limit", name: "callLimit" },
          { label: "Product Limit", name: "productLimit" },
          { label: "Invoice Limit", name: "invoiceLimit" },
        ].map((item) => (
          <label key={item.name} className="flex flex-col">
            <span className="mb-1 text-sm font-medium">{item.label}</span>
            <input
              type="text"
              name={item.name}
              value={formData[item.name]}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-400"
            />
          </label>
        ))}
        <label className="flex flex-col">
          <span className="mb-1 text-sm font-medium">Support Level</span>
          <select
            name="supportLevel"
            value={formData.supportLevel}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-400"
          >
            <option value="Email">Email</option>
            <option value="Chat">Chat</option>
            <option value="Call">Call</option>
          </select>
        </label>
        {/* Submit */}
        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading
              ? id
                ? "Updating..."
                : "Creating..."
              : id
                ? "Update Plan"
                : "Create Plan"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateSubscription;