import React from "react";
import { useCustomerController } from "../../controller/store/customer-listCTR";
export default function CustomerViewer() {
  const {
    mobile,
    setMobile,
    businesses,
    selectedBusiness,
    setSelectedBusiness,
    customers,
    page,
    totalPages,
    limit,
    loading,
    expandedRow,
    setExpandedRow,
    fetchStoreByMobile,
    fetchCustomers,
    handlePagination,
    handleRowPerPage,
    handleExportToExcel,
  } = useCustomerController();

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
              fetchCustomers(1, newBusinessId, limit);
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

      {/* Customer List */}
      {customers.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Customers {totalPages > 1 && `(Page ${page})`}
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleExportToExcel}
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
                  onChange={(e) => handleRowPerPage(parseInt(e.target.value))}
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

          {/* Customer Table */}
          <div className="overflow-x-auto text-center">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-2"></th>
                  <th className="border px-2 py-2">S.No</th>
                  <th className="border px-2 py-2">Customer ID</th>
                  <th className="border px-2 py-2">Name</th>
                  <th className="border px-2 py-2">Mobile</th>
                  <th className="border px-2 py-2">Email</th>
                </tr>
              </thead>
              <tbody className="text-nowrap">
                {customers.map((cust, index) => {
                  const isExpanded = expandedRow === cust.customId;
                  return (
                    <React.Fragment key={cust.customId}>
                      <tr className="hover:bg-gray-50">
                        <td className="border px-2 py-2 text-center w-10">
                          <button
                            onClick={() =>
                              setExpandedRow(isExpanded ? null : cust.customId)
                            }
                            className="flex items-center justify-center w-5 h-5 bg-blue-100 hover:bg-blue-200 rounded-full transition"
                          >
                            {isExpanded ? "−" : "+"}
                          </button>
                        </td>
                        <td className="border px-4 py-2">
                          {(page - 1) * limit + index + 1}
                        </td>
                        <td className="border px-4 py-2">{cust.customId}</td>
                        <td className="border px-4 py-2">{cust.name}</td>
                        <td className="border px-4 py-2">{cust.mobile}</td>
                        <td className="border px-4 py-2">{cust.email}</td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-gray-50">
                          <td colSpan={7} className="p-4 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <strong>Address:</strong> {cust.address || "-"}
                              </div>
                              <div>
                                <strong>Pin Code:</strong> {cust.pin || "-"}
                              </div>
                              <div>
                                <strong>City:</strong> {cust.city || "-"}
                              </div>
                              <div>
                                <strong>State:</strong> {cust.state || "-"}
                              </div>
                              <div>
                                <strong>Aadhar Card:</strong>{" "}
                                {cust.aadharCardNumber || "-"}
                              </div>
                              <div>
                                <strong>PAN Number:</strong> {cust.panNumber || "-"}
                              </div>
                              <div>
                                <strong>Company Name:</strong>{" "}
                                {cust.companyName || "-"}
                              </div>
                              <div>
                                <strong>GST Number:</strong> {cust.gstNumber || "-"}
                              </div>
                              <div>
                                <strong>Credit Score:</strong>{" "}
                                {cust.creditScore || "-"}
                              </div>
                              <div>
                                <strong>Created At:</strong>{" "}
                                {new Date(cust.createdAt).toLocaleDateString()}
                              </div>
                              <div>
                                <strong>Updated At:</strong>{" "}
                                {new Date(cust.updatedAt).toLocaleDateString()}
                              </div>
                              <div>
                                <strong>Store Mobile:</strong>{" "}
                                {cust.storeMobile || "-"}
                              </div>
                              <div>
                                <strong>Business Name:</strong>{" "}
                                {cust.businessName || "-"}
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
                onClick={() => handlePagination(page - 1)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => handlePagination(page + 1)}
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