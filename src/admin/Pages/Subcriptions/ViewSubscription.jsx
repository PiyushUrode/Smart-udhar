import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function ViewSubscription() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const limit = 6;

  useEffect(() => {
    const fetchPlans = async () => {
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
      } catch (err) {
        setError(err.response?.data?.error || "❌ Failed to fetch plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [API_URL, page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    try {
      const token = localStorage.getItem("authToken"); // or however you store JWT

      const response = await axios.delete(`${API_URL}/plan/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        alert("Plan deleted successfully ✅");
        // Refresh plans list or remove deleted plan from state
        setPlans((prev) => prev.filter((plan) => plan._id !== id));
      } else {
        alert("Failed to delete plan ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting plan ❌");
    }
  };
  if (loading) {
    return <p className="text-center mt-10">Loading plans...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-10">Our Plans</h2>

      {plans.length === 0 ? (
        <p className="text-center">No plans available</p>
      ) : (
        <>
          {/* Plans Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="bg-white border rounded-2xl shadow-lg flex flex-col hover:shadow-2xl transition duration-300"
              >
                {/* Plan Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-2xl p-6 text-center">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="mt-2 text-3xl font-extrabold">
                    ₹{plan.price}
                    <span className="text-sm font-medium ml-1">
                      / {plan.billingCycle}
                    </span>
                  </p>
                </div>

                {/* Features */}
                <div className="p-6 flex-1">
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>📩 SMS: {plan.smsLimit}</li>
                    <li>📧 Email: {plan.emailLimit}</li>
                    <li>📞 Calls: {plan.callLimit}</li>
                    <li>📦 Products: {plan.productLimit}</li>
                    <li>🧾 Invoices: {plan.invoiceLimit}</li>                    
                    <li>💬 Support: {plan.supportLevel}</li>
                    
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="p-6 border-t flex justify-between">
                  <Link to={`/dashboard/subscriptions/create/${plan._id}`}>
                    <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-10 space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1 text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ViewSubscription;
