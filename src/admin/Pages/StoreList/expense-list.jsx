import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { ChevronDown, ChevronUp } from "lucide-react"; // ✅ nice icons

export default function BusinessExpenseViewer() {
  const API_URL = import.meta.env.VITE_API_URL;
  const Auth_token = localStorage.getItem("authToken");
  const [mobile, setMobile] = useState("");
  const [storeId, setStoreId] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null); // ✅ track expanded row

  const token = Auth_token;

  // ✅ Step 0: Fetch all expenses (Admin)
  const fetchAllExpensesAdmin = async (pageNumber = 1, pageLimit = limit) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/expense-list`, {
        params: { page: pageNumber, limit: pageLimit },
        headers: { Authorization: token },
      });

      if (res.data.success) {
        setExpenses(res.data.expenses || []);
        setPage(pageNumber);
        setTotalPages(Math.ceil(res.data.total / pageLimit) || 1);
      }
    } catch (err) {
      console.error("Error fetching admin expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllExpensesAdmin();
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

  // ✅ Step 3: Fetch expenses with pagination
  const fetchExpenses = async (
    pageNumber = 1,
    businessId = selectedBusiness,
    pageLimit = limit
  ) => {
    if (!storeId || !businessId) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/admin/expense-list/${storeId}/${businessId}`,
        {
          params: { page: pageNumber, limit: pageLimit },
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setExpenses(res.data.expenses || []);
        setPage(pageNumber);
        setTotalPages(Math.ceil(res.data.total / pageLimit) || 1);
      }
    } catch (err) {
      console.error(
        "Error fetching expenses:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const pagination = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    storeId
      ? fetchExpenses(newPage, selectedBusiness, limit)
      : fetchAllExpensesAdmin(newPage, limit);
  };

  const RowPerPage = (newLimit) => {
    setLimit(newLimit);
    storeId
      ? fetchExpenses(1, selectedBusiness, newLimit)
      : fetchAllExpensesAdmin(1, newLimit);
  };

  // ✅ Export to Excel
  const exportToExcel = () => {
    if (expenses.length === 0) return;

    const worksheetData = expenses.map((exp, index) => ({
      "S.No": (page - 1) * limit + index + 1,
      "Expense ID": exp._id,
      Date: new Date(exp.date).toLocaleDateString(),
      Category: exp.expenseCategory,
      "Item Name": exp.itemName,
      Amount: exp.amount,
      "Vendor Name": exp.vendorName || "-",
      "GST Applicable": exp.gstApplicable ? "Yes" : "No",
      "Payment Mode": exp.paymentMode,
      "Notes / Bill": exp.notesOrBill || "-",
      "Created At": new Date(exp.createdAt).toLocaleDateString(),
      "Vendor Number": exp.storeMobile || "-",
      "Vendor Shop": exp.businessName || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    XLSX.writeFile(workbook, "expenses.xlsx");
  };

  // ✅ Toggle Row Expand
  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
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
              fetchExpenses(1, newBusinessId, limit);
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

      {/* Step 3: Expenses List */}
      {expenses.length > 0 && (
        <div className="space-y-4">
          <div className="flex  flex-wrap justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Expenses {totalPages > 1 && `(Page ${page})`}
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              {/* ✅ Export Button */}
              <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
              >
                Export Excel
              </button>

              {/* ✅ Page Size Selector */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600">
                  Rows per page:
                </label>
                <select
                  value={limit}
                  onChange={(e) => {
                    const newLimit = parseInt(e.target.value);
                    RowPerPage(newLimit);
                  }}
                  className="border bg-white rounded-lg p-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>

          {/* Expenses Table */}
          <div className="overflow-x-auto text-center">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-2"></th>
                  <th className="border px-2 py-2">S.No</th>
                  <th className="border px-2 py-2">Date</th>
                  <th className="border px-2 py-2">Item</th>
                  <th className="border px-2 py-2">Amount</th>
                </tr>
              </thead>
              <tbody className="text-nowrap">
                {expenses.map((exp, index) => {
                  const isExpanded = expandedRow === exp._id;
                  return (
                    <React.Fragment key={exp._id}>
                      {/* Main Row */}
                      <tr className="hover:bg-gray-50">
                        <td className="border px-2 py-2 text-center w-10">
                          <button
                            onClick={() =>
                              setExpandedRow(isExpanded ? null : exp._id)
                            }
                            className="flex items-center justify-center w-5 h-5 bg-blue-100 hover:bg-blue-200 rounded-full transition"
                          >
                            {isExpanded ? (
                              <span className="text-blue-600 text-sm font-bold">
                                −
                              </span>
                            ) : (
                              <span className="text-blue-600 text-sm font-bold">
                                +
                              </span>
                            )}
                          </button>
                        </td>

                        <td className="border px-4 py-2">
                          {(page - 1) * limit + index + 1}
                        </td>
                        <td className="border px-4 py-2">
                          {new Date(exp.date).toLocaleDateString()}
                        </td>

                        <td className="border px-4 py-2">{exp.itemName}</td>
                        <td className="border px-4 py-2">{exp.amount}</td>
                      </tr>

                      {/* Expanded Row (renders only when expanded) */}
                      {isExpanded && (
                        <tr className="bg-gray-50">
                          <td colSpan={7} className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left text-sm">
                              <div>
                                <span className="font-semibold text-gray-700">
                                  Category :
                                </span>{" "}  
                                {exp.expenseCategory}
                              </div>
                              
                              <div>
                                <span className="font-semibold text-gray-700">
                                  Vendor:
                                </span>{" "}
                                {exp.vendorName || "-"}
                              </div>

                              <div>
                                <span className="font-semibold text-gray-700">
                                  GST:
                                </span>{" "}
                                {exp.gstApplicable ? "Yes" : "No"}
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">
                                  Payment Mode:
                                </span>{" "}
                                {exp.paymentMode}
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">
                                  Notes/Bill:
                                </span>{" "}
                                {exp.notesOrBill || "-"}
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">
                                  Created At:
                                </span>{" "}
                                {new Date(exp.createdAt).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">
                                  Vendor Number:
                                </span>{" "}
                                {exp.storeMobile || "-"}
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">
                                  Vendor Shop:
                                </span>{" "}
                                {exp.businessName || "-"}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end gap-3">
              <button
                disabled={page <= 1}
                onClick={() => pagination(page - 1)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => pagination(page + 1)}
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
