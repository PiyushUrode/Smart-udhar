import React, { useState, useEffect } from "react";
import axios from "axios";

export default function BusinessCustomerViewer() {
  const API_URL = import.meta.env.VITE_API_URL;
  const Auth_token = localStorage.getItem("authToken");
  const [mobile, setMobile] = useState("");
  const [storeId, setStoreId] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const token = Auth_token;

  // ✅ Step 0: Fetch all customers (Admin)
  const fetchAllCustomersAdmin = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/customer-list`, {
        headers: { Authorization: token },
      });

      if (res.data.success) {
        setCustomers(res.data.customers || []);
        setPage(1);
        setTotalPages(1); // admin API returns all customers, no pagination
      }
    } catch (err) {
      console.error("Error fetching admin customers:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch once when component loads
  useEffect(() => {
    fetchAllCustomersAdmin();
  }, []);

  // Step 1: Fetch store by mobile
  const fetchStoreByMobile = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        API_URL + "/store-auth/profileBy-number",
        { mobile },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.store?.length > 0) {
        const id = res.data.store[0]._id;
        setStoreId(id);
        fetchBusinessProfiles(id);
      }
    } catch (err) {
      console.error("Error fetching store:", err);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Fetch businesses
  const fetchBusinessProfiles = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/store-business-profile/find-all/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      setBusinesses(res.data.data || []);
    } catch (err) {
      console.error("Error fetching business profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Fetch customers for selected business
  const fetchCustomers = async (
    pageNumber = 1,
    businessId = selectedBusiness
  ) => {
    if (!storeId || !businessId) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/store-customer/find-all/${storeId}/${businessId}`,
        {
          params: { page: pageNumber, limit: 2 },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCustomers(res.data.customers || []);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(
        "Error fetching customers:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-2xl space-y-6">
      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-white font-medium">Loading...</p>
        </div>
      )}

      {/* Step 1: Mobile Input */}
      <div className="space-y-2">
        <label className="font-semibold text-gray-700">
          Enter Vendor Number
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter mobile number"
            className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-[#F6F8FA] " 
          />
          <button
            onClick={fetchStoreByMobile}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
          >
            Fetch
          </button>
        </div>
      </div>

      {/* Step 2: Business Dropdown */}
      {businesses.length > 0 && (
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Select Business</label>
          <select
            value={selectedBusiness || ""}
            onChange={(e) => {
              const newBusinessId = e.target.value;
              setSelectedBusiness(newBusinessId);
              fetchCustomers(1, newBusinessId);
            }}
            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none bg-[#F6F8FA] "
          >
            <option value="">Select Business</option>
            {businesses.map((biz) => (
              <option key={biz._id} value={biz._id}>
                {biz.businessName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Step 3: Customers List */}
      {customers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Customers {totalPages > 1 && `(Page ${page})`}
          </h3>

          {/* Customers Table */}
          <div className="overflow-x-auto text-nowrap text-center">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">ID</th>
                  <th className="border px-4 py-2 text-left">Vendor Number</th>
                  <th className="border px-4 py-2 text-left">Vendor Shop</th>
                  <th className="border px-4 py-2 text-left">Name</th>
                  <th className="border px-4 py-2 text-left">Mobile</th>
                  <th className="border px-4 py-2 text-left">Email</th>
                  <th className="border px-4 py-2 text-left">Company</th>
                  <th className="border px-4 py-2 text-left">City</th>
                  <th className="border px-4 py-2 text-left">State</th>
                  <th className="border px-4 py-2 text-left">Credit Score</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((cust) => (
                  <tr key={cust.customId || cust._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{cust.customId}</td>
                    <td className="border px-4 py-2">{cust.storeMobile?cust.storeMobile:'-'}</td>
                    <td className="border px-4 py-2">{cust.businessName?cust.businessName:'-'}</td>
                    <td className="border px-4 py-2">{cust.name}</td>
                    <td className="border px-4 py-2">{cust.mobile}</td>
                    <td className="border px-4 py-2">{cust.email}</td>
                    <td className="border px-4 py-2">{cust.companyName}</td>
                    <td className="border px-4 py-2">{cust.city}</td>
                    <td className="border px-4 py-2">{cust.state}</td>
                    <td className="border px-4 py-2">{cust.creditScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination (only if available) */}
          {totalPages > 1 && (
            <div className="flex justify-end gap-3">
              <button
                disabled={page <= 1}
                onClick={() => fetchCustomers(page - 1)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => fetchCustomers(page + 1)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
