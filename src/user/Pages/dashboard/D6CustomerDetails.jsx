import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { CustomerService } from "../../api/customerService.js";
import { useCustomerForm } from "../../api/addCustomerService.js";
import Button from "../../common/Button.jsx";
import CustomerDummy from "../../../../public/Download/customer_report.xlsx"

const CustomerDetailsForm = () => {

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [popupType, setPopupType] = useState(null);

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleImportExcel = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    try {
      setPopupType("processing");

      const res = await CustomerService.uploadExcel(file);

      setMessage(`${res.message}. Total rows inserted: ${res.count}`);
      setPopupType("success");
      setFile(null);

      fetchCustomers(page, limit);
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Error uploading file.");
      setPopupType("error");
      setFile(null);
    }
  };

  const fetchCustomers = async (page, limit) => {
    try {
      setLoading(true);
      const res = await CustomerService.getAllCustomers({ page, limit });

      const formatted = res.customers.map((cust) => ({
        mongoId: cust._id,
        displayId: cust.customId,
        name: cust.name,
        mobile: cust.mobile,
        email: cust.email,
        city: cust.city,
        state: cust.state,
        score: cust.creditScore ?? 100,
      }));

      setCustomers(formatted);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error("❌ Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(page, limit);
  }, [page, limit]);

  const handleDelete = async (mongoId, displayId) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;

    try {
      const deleteRes = await CustomerService.deleteCustomer(mongoId);
      if (deleteRes.success) {
        setCustomers((prev) =>
          prev.filter((cust) => cust.displayId !== displayId)
        );
      }
    } catch (err) {
      console.error("❌ Error deleting customer:", err);
    }
  };

  const handleEdit = (customer) => {
    navigate(`/dashboard/add-customer/${customer.mongoId}`);
  };

  const getScoreColor = (score) => {
    if (score < 40) return "text-red-600";
    if (score <= 70) return "text-yellow-500";
    return "text-green-600";
  };

    const handeluploadexceldummy = ()=>{
      const link = document.createElement("a");
      link.href = CustomerDummy;
      link.download = "customer-template.xlsx";
      link.click(); 
    }

  return (
    <div className="p-4 w-full max-w-7xl mt-5 md:mt-10 mx-auto bg-white">
      <div className="flex justify-between items-center mb-4 px-3">
        <h2 className="font-robotoSb  text-base md:text-xl lg:text-2xl">Customer Details</h2>
        <button
          className="bg-lightbluecol text-white px-4 py-2 text-xs md:text-base rounded-lg hover:bg-blue-600"
          onClick={() => navigate("/dashboard/add-customer")}
        >
          Add Customer
        </button>
      </div>

      {/* Limit Selector */}
      <div className="flex justify-start items-center mb-4 px-3">
        <div className="flex items-center mb-3 gap-2 w-full md:w-[30%] text-nowrap">
          <span>Show per page:</span>
          <select
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(Number(e.target.value));
            }}
            className="border rounded px-2 py-1"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center py-5">Loading customers...</p>
        ) : (
          <table className="min-w-full text-sm border-separate border-spacing-0 border-[#E5E7EB] border-y border-x-2 rounded-lg shadow-customSoft">
            <thead>
              <tr className="bg-[#F9FAFB] text-left text-lightblack text-nowrap">
                <th className="p-3 font-semibold py-5">S.No</th>
                <th className="p-3 font-semibold py-5">Unique ID</th>
                <th className="p-3 font-semibold py-5">Name</th>
                <th className="p-3 font-semibold py-5">Mobile</th>
                <th className="p-3 font-semibold py-5">Email</th>
                <th className="p-3 font-semibold py-5">Score Card</th>
                <th className="p-3 font-semibold py-5">City</th>
                <th className="p-3 font-semibold py-5">State</th>
                <th className="p-3 font-semibold py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust, index) => (
                <tr
                  key={cust.displayId}
                  className="bg-white text-left shadow-customSoft"
                >
                  {/* Serial Number */}
                  <td className="p-3">{(page - 1) * limit + index + 1}</td>
                  <td className="p-3">{cust.displayId || "--"}</td>
                  <td className="p-3">{cust.name || "--"}</td>
                  <td className="p-3">{cust.mobile || "--"}</td>
                  <td className="p-3 text-blue-600 hover:underline cursor-pointer">
                    {cust.email || "--"}
                  </td>
                  <td className={`p-3 ${getScoreColor(cust.score)}`}>
                    {cust.score}
                  </td>
                  <td className="p-3">{cust.city || "--"}</td>
                  <td className="p-3">{cust.state || "--" }</td>
                  <td className="p-3 text-center space-x-2">
                    <button onClick={() => handleEdit(cust)}>
                      <FiEdit className="w-5 h-5 text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(cust.mongoId, cust.displayId)}
                    >
                      <FiTrash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-5 gap-3">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="px-3 py-1 border rounded">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>


  <div className="w-full max-w-6xl">
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-md border border-gray-200 mt-4 sm:mt-6">
      
      {/* Action Area */}
      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6">
        
        {/* Download Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200 w-full">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 11-2 0V4H5v11h3a1 1 0 110 2H4a1 1 0 01-1-1V3zm7 5a1 1 0 00-1 1v3.586l-.293-.293a1 1 0 10-1.414 1.414l2.707 2.707a1 1 0 001.414 0l2.707-2.707a1 1 0 10-1.414-1.414L11 12.586V9a1 1 0 00-1-1z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-medium text-gray-800">Bulk Upload</h4>
              <p className="text-xs sm:text-sm text-gray-500">Get the Excel format file</p>
            </div>
          </div>

          <button
            onClick={handeluploadexceldummy}
            className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-green-600 text-white text-sm rounded-lg shadow hover:bg-green-700 transition-all w-full sm:w-auto"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 11-2 0V4H5v11h3a1 1 0 110 2H4a1 1 0 01-1-1V3zm7 5a1 1 0 00-1 1v3.586l-.293-.293a1 1 0 10-1.414 1.414l2.707 2.707a1 1 0 001.414 0l2.707-2.707a1 1 0 10-1.414-1.414L11 12.586V9a1 1 0 00-1-1z" />
            </svg>
            Download Excel
          </button>
        </div>

        {/* Upload Section */}
       <div className=" w-full flex flex-col md:flex-row items-center gap-3 bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
          {/* File Input */}
          <label className="flex items-center justify-center w-full md:w-60 px-4 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-100 transition">
            <span className="text-gray-700 text-sm">
              {file?.name || "Choose Excel/CSV file"}
            </span>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {/* Import Button */}
          <button
            onClick={handleImportExcel}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
          >
            Import Excel
          </button>
          {popupType && (
            <Button
              type={popupType}
              message={message}
              onClose={() => setPopupType(null)}
            />
          )}
        </div>
      </div>
    </div>

    {popupType && (
      <Button
        type={popupType}
        message={message}
        onClose={() => setPopupType(null)}
      />
    )}
  </div>
</div>
  );
};

export default CustomerDetailsForm;
