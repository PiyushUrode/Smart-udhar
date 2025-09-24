// src/hooks/useSubscriptionController.js

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const useSubscriptionController = () => {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchPlan = async () => {
      if (!id) return;
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
  }, [id]);

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
        res = await axios.put(`${API_URL}/plan/update/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setMessage(res.data.message || "Plan updated successfully ✅");
        alert("Plan updated successfully");
      } else {
        res = await axios.post(`${API_URL}/plan/create`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setMessage(res.data.message || "Plan created successfully ✅");
        alert("Plan created successfully");
      }

      navigate("/admin/dashboard/subscriptions/view");
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { id, formData, loading, message, handleChange, handleSubmit };
};

export default useSubscriptionController;