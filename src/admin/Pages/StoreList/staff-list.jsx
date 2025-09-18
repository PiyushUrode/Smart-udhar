import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export default function BusinessStaffViewer() {
  const API_URL = import.meta.env.VITE_API_URL;
  const Auth_token = localStorage.getItem("authToken");
  const [mobile, setMobile] = useState("");
  const [storeId, setStoreId] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const token = Auth_token;

  // Fetch all staff (Admin)
  const fetchAllStaffAdmin = async (pageNumber = 1, pageLimit = limit) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/staff-list`, {
        params: { page: pageNumber, limit: pageLimit },
        headers: { Authorization: token },
      });

      if (res.data.success) {
         
        setStaffList(res.data.staff || []);
        setPage(pageNumber);
        setTotalPages(Math.ceil(res.data.total / pageLimit) || 1);
      }
    } catch (err) {
      console.error("Error fetching admin staff:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStaffAdmin();
  }, []);

  // Fetch store by mobile
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

  // Fetch businesses
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

  // Fetch staff by store and business
  const fetchStaff = async (
    pageNumber = 1,
    businessId = selectedBusiness,
    pageLimit = limit
  ) => {
    if (!storeId || !businessId) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/admin/staff-list/${storeId}/${businessId}`,
        {
          params: { page: pageNumber, limit: pageLimit },
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        
        setStaffList(res.data.staff || []);
        setPage(pageNumber);
        setTotalPages(Math.ceil(res.data.total / pageLimit) || 1);
      }
    } catch (err) {
      console.error(
        "Error fetching staff:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const pagination = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    storeId
      ? fetchStaff(newPage, selectedBusiness, limit)
      : fetchAllStaffAdmin(newPage, limit);
  };

  const RowPerPage = (newLimit) => {
    setLimit(newLimit);
    storeId
      ? fetchStaff(1, selectedBusiness, newLimit)
      : fetchAllStaffAdmin(1, newLimit);
  };

  // Export to Excel
  const exportToExcel = () => {
    if (staffList.length === 0) return;

    const worksheetData = staffList.map((staff, index) => ({
      "S.No": (page - 1) * limit + index + 1,
      "First Name": staff.firstName,
      "Last Name": staff.lastName,
      "Mobile Number": staff.mobileNumber,
      "Email ID": staff.emailId,
      "Address": staff.address || "-",
      "Pin Number": staff.pinNumber || "-",
      "City": staff.city || "-",
      "State": staff.state || "-",
      "Roles": staff.roles?.join(", ") || "-",
      "Status": staff.status || "-",
      "Online": staff.online ? "Yes" : "No",
      "Created At": new Date(staff.createdAt).toLocaleDateString(),
      "Updated At": new Date(staff.updatedAt).toLocaleDateString(),
      "Store Mobile": staff.storeMobile || "-",
      "Business Name": staff.businessName || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Staff");

    XLSX.writeFile(workbook, "staff.xlsx");
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-2xl space-y-6">
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-white font-medium">Loading...</p>
        </div>
      )}

      {/* Mobile Input */}
      <div className="space-y-2">
        <label className="font-semibold text-gray-700">Enter Vendor Number</label>
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

      {/* Business Dropdown */}
      {businesses.length > 0 && (
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Select Business</label>
          <select
            value={selectedBusiness || ""}
            onChange={(e) => {
              const newBusinessId = e.target.value;
              setSelectedBusiness(newBusinessId);
              fetchStaff(1, newBusinessId, limit);
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

      {/* Staff List */}
      {staffList.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Staff List {totalPages > 1 && `(Page ${page})`}
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
              >
                Export Excel
              </button>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600">
                  Rows per page:
                </label>
                <select
                  value={limit}
                  onChange={(e) => RowPerPage(parseInt(e.target.value))}
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

          {/* Staff Table */}
          <div className="overflow-x-auto text-center">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-2"></th>
                  <th className="border px-2 py-2">S.No</th>
                  <th className="border px-2 py-2">Name</th>
                  <th className="border px-2 py-2">Mobile Number</th>
                  <th className="border px-2 py-2">Email</th>
                  <th className="border px-2 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="text-nowrap">
                {staffList.map((staff, index) => {
                  const isExpanded = expandedRow === staff.id;
                  return (
                    <React.Fragment key={staff.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="border px-2 py-2 text-center w-10">
                          <button
                            onClick={() =>
                              setExpandedRow(isExpanded ? null : staff.id)
                            }
                            className="flex items-center justify-center w-5 h-5 bg-blue-100 hover:bg-blue-200 rounded-full transition"
                          >
                            {isExpanded ? "−" : "+"}
                          </button>
                        </td>
                        <td className="border px-4 py-2">
                          {(page - 1) * limit + index + 1}
                        </td>
                        <td className="border px-4 py-2">{`${staff.firstName} ${staff.lastName}`}</td>
                        <td className="border px-4 py-2">{staff.mobileNumber}</td>
                        <td className="border px-4 py-2">{staff.emailId}</td>
                        <td className="border px-4 py-2">{staff.status}</td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-gray-50">
                          <td colSpan={7} className="p-4 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <strong>Address:</strong> {staff.address || "-"}
                              </div>
                              <div>
                                <strong>Pin Number:</strong> {staff.pinNumber || "-"}
                              </div>
                              <div>
                                <strong>City:</strong> {staff.city || "-"}
                              </div>
                              <div>
                                <strong>State:</strong> {staff.state || "-"}
                              </div>
                              <div>
                                <strong>Roles:</strong>{" "}
                                {staff.roles?.join(", ") || "-"}
                              </div>
                              <div>
                                <strong>Online:</strong> {staff.online ? "Yes" : "No"}
                              </div>
                              <div>
                                <strong>Created At:</strong>{" "}
                                {new Date(staff.createdAt).toLocaleDateString()}
                              </div>
                              <div>
                                <strong>Updated At:</strong>{" "}
                                {new Date(staff.updatedAt).toLocaleDateString()}
                              </div>
                              <div>
                                <strong>Store Mobile:</strong> {staff.storeMobile || "-"}
                              </div>
                              <div>
                                <strong>Business Name:</strong> {staff.businessName || "-"}
                              </div>
                              <div>
                                <strong>Image:</strong>{" "}
                                {staff.image ? (
                                  <img
                                    src={staff.image}
                                    alt={`${staff.firstName} ${staff.lastName}`}
                                    className="w-20 h-20 object-cover rounded"
                                  />
                                ) : (
                                  "-"
                                )}
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
            <div className="flex justify-end gap-3 mt-4">
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