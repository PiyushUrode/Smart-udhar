import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// A custom hook to handle all logic related to fetching, managing, and deleting plans.
const useSubscriptionPlans = () => {
  // Removed import.meta.env since it is not supported in the target environment
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [message, setMessage] = useState("");

  const limit = 6;

  // Function to fetch the plans from the API
  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await axios.get(
        `${API_URL}/plan/list?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPlans(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "❌ Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  }, [API_URL, page]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Handler for the delete button click
  const handleDeleteClick = (id) => {
    setPlanToDelete(id);
    setShowConfirm(true);
    setMessage("");
  };

  // Handler for confirming the deletion
  const confirmDelete = async () => {
    setShowConfirm(false);
    if (!planToDelete) return;

    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.delete(
        `${API_URL}/plan/delete/${planToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setMessage("Plan deleted successfully ✅");
        // Remove the deleted plan from the state
        setPlans((prev) => prev.filter((plan) => plan._id !== planToDelete));
      } else {
        setMessage("Failed to delete plan ❌");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error deleting plan ❌");
    } finally {
      setPlanToDelete(null);
    }
  };

  // Handler for canceling the deletion
  const cancelDelete = () => {
    setShowConfirm(false);
    setPlanToDelete(null);
  };

  return {
    plans,
    loading,
    error,
    page,
    totalPages,
    setPage,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    showConfirm,
    message,
  };
};

export default useSubscriptionPlans;
