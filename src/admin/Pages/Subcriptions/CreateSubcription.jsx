import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function CreateSubscription() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const { id } = useParams(); // get id from url
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    billingCycle: "Monthly",
    smsLimit: 0,
    emailLimit: 0,
    callLimit: 0,
    productLimit: 0,
    invoiceLimit: 0,
    legalObligation: "None",
    supportLevel: "Email",
    customBranding: false,
    extraSmsCharge: 0,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // fetch data if id exists (edit mode)
  useEffect(() => {
    const fetchPlan = async () => {
      if (!id) return; // only fetch when editing
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/plan/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          setFormData(res.data.data);
        }
      } catch (err) {
        setMessage("❌ Failed to fetch plan");
      }
    };
    fetchPlan();
  }, [id, API_URL]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      let res;
      if (id) {
        // UPDATE
        res = await axios.put(`${API_URL}/plan/update/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setMessage(res.data.message || "Plan updated successfully ✅");
        alert("Plan updated successfully");
      } else {
        // CREATE
        res = await axios.post(`${API_URL}/plan/create`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setMessage(res.data.message || "Plan created successfully ✅");
        alert("Plan created successfully");
      }

      // redirect back to list page
      navigate("/dashboard/subscriptions/view");
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
            <option value="Monthly">Weekly</option>
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
