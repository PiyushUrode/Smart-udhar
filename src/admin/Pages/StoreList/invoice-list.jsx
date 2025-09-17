import React, { useState, useEffect } from "react";
import axios from "axios";

export default function BusinessInvoiceViewer() {
  const API_URL = import.meta.env.VITE_API_URL;
  const Auth_token = localStorage.getItem("authToken");
  const [mobile, setMobile] = useState("");
  const [storeId, setStoreId] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const token = Auth_token;

  // ✅ Step 0: Fetch all invoices (Admin)
  const fetchAllInvoicesAdmin = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/invoice-list`, {
        headers: { Authorization: token },
      });

      if (res.data.success) {
        setInvoices(res.data.invoices || []);
        setPage(1);
        setTotalPages(1); // admin API returns all invoices, no pagination
      }
    } catch (err) {
      console.error("Error fetching admin invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch once when component loads
  useEffect(() => {
    fetchAllInvoicesAdmin();
  }, []);

  // ✅ Step 1: Fetch store by mobile
  const fetchStoreByMobile = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/store-auth/profileBy-number`,
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

  // ✅ Step 2: Fetch businesses
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

  // ✅ Step 3: Fetch invoices
  const fetchInvoices = async (
    pageNumber = 1,
    businessId = selectedBusiness
  ) => {
    if (!storeId || !businessId) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/store-invoice/find-all/${storeId}/${businessId}`,
        {
          params: { page: pageNumber, limit: 5 },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setInvoices(res.data.data || []);
      setPage(res.data.currentPage || 1);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(
        "Error fetching invoices:",
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
            className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-[#F6F8FA]"
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
              fetchInvoices(1, newBusinessId);
            }}
            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none bg-[#F6F8FA]"
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

      {/* Step 3: Invoices List */}
      {invoices.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Invoices {totalPages > 1 && `(Page ${page})`}
          </h3>

          {/* Invoices Table */}
          <div className="overflow-x-auto text-nowrap text-center">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Invoice ID</th>
                  <th className="border px-4 py-2">Customer</th>
                  <th className="border px-4 py-2">Phone</th>
                  <th className="border px-4 py-2">Subtotal</th>
                  <th className="border px-4 py-2">Tax</th>
                  <th className="border px-4 py-2">Total</th>
                  <th className="border px-4 py-2">Payment Status</th>
                  <th className="border px-4 py-2">Created At</th>
                  <th className="border px-4 py-2 text-left">Vendor Number</th>
                  <th className="border px-4 py-2 text-left">Vendor Shop</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{inv.invoiceId}</td>
                    <td className="border px-4 py-2">{inv.name}</td>
                    <td className="border px-4 py-2">{inv.phone}</td>
                    <td className="border px-4 py-2">{inv.subtotal}</td>
                    <td className="border px-4 py-2">{inv.tax}</td>
                    <td className="border px-4 py-2">{inv.total}</td>
                    <td className="border px-4 py-2">{inv.paymentStatus}</td>
                    <td className="border px-4 py-2">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                      <td className="border px-4 py-2">{inv.storeMobile?inv.storeMobile:'-'}</td>
                    <td className="border px-4 py-2">{inv.businessName?inv.businessName:'-'}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end gap-3">
              <button
                disabled={page <= 1}
                onClick={() => fetchInvoices(page - 1)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => fetchInvoices(page + 1)}
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
