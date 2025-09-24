import React from "react";
import { Link } from "react-router-dom";
import useSubscriptionPlans  from "../../controller/Subcriptions/ViewSubscriptionCTR.jsx";

function ViewSubscription() {
  const {
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
  } = useSubscriptionPlans();

  if (loading) {
    return <p className="text-center mt-10">Loading plans...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-10">Our Plans</h2>

      {message && (
        <div
          className={`px-4 py-2 rounded-md mb-4 text-center ${
            message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {error && (
        <p className="text-center mt-10 text-red-500">{error}</p>
      )}

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
                  <Link to={`/admin/dashboard/subscriptions/create/${plan._id}`}>
                    <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(plan._id)}
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

      {/* Custom Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative p-8 bg-white w-96 max-w-md m-auto flex-col flex rounded-lg shadow-2xl">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this plan? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Confirm
                </button>
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewSubscription;
