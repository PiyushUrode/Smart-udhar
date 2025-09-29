import { useState, useEffect } from "react";
// Removed FaChevronLeft, FaChevronRight as the new design uses text buttons
import { FaFilePdf, FaFileExcel } from "react-icons/fa"; 
import ExpenseService from "../../api/expenseservice.js";
import Button from "../../common/Button.jsx";

const D10ExpenseList = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalExpenses, setTotalExpenses] = useState(0);
  // State for items per page, defaulted to 10
  const [limit, setLimit] = useState(10); 
  const LIMIT_OPTIONS = [5, 10, 25, 50]; // Options for the user to select

  const [filters, setFilters] = useState({
    date: false,
    category: false,
    gst: false,
    paymentMode: false,
  });

  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  // Update useEffect to use currentPage AND limit
  useEffect(() => {
    fetchAllExpenses(currentPage, limit);
  }, [currentPage, limit]); // Re-run when currentPage or limit changes

  // Modified fetchAllExpenses to accept page and limit
  const fetchAllExpenses = async (page, limit) => {
    const pageToFetch = page; 
    
    try {
      setLoading(true);
      // Pass page and limit to the service function
      const res = await ExpenseService.getAllExpenses(pageToFetch, limit); 
      const newTotalPages = Math.ceil(res.total / limit);

      setExpenses(res?.data || []); // API response uses 'data'
      setTotalPages(newTotalPages); // Calculate total pages
      setTotalExpenses(res.total); // Set total number of items
      
      // If the current page is now greater than the new total pages, reset to the last page or 1.
      if (pageToFetch > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
      } else if (pageToFetch > newTotalPages && newTotalPages === 0) {
          setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error loading expenses:", error.message);
      setExpenses([]);
      setTotalPages(1);
      setTotalExpenses(0);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (key) => setFilters(prev => ({ ...prev, [key]: !prev[key] }));

  const applyFilters = async () => {
    // Reset to first page when applying new filters
    setCurrentPage(1); 
    
    try {
      setLoading(true);
      const payload = {};
      if (filters.category) payload.expenseCategory = "Office Supplies";
      if (filters.paymentMode) payload.paymentMode = "UPI";

      if (filters.date) {
        const today = new Date();
        const last30 = new Date();
        last30.setDate(today.getDate() - 30);

        const startDate = last30.toISOString().split("T")[0];
        const endDate = today.toISOString().split("T")[0];
        Object.assign(payload, { startDate, endDate });
        setDateRange({ startDate, endDate });
      } else {
        setDateRange({ startDate: null, endDate: null });
      }

      // NOTE: Filter endpoint must also handle pagination (page and limit)
      // Assuming filterExpenses can accept payload, page=1, and current limit
      const res = await ExpenseService.filterExpenses(payload, 1, limit); 
      setExpenses(res?.expenses || res?.data || []);
      setTotalPages(Math.ceil((res.total || 0) / limit)); 
      setTotalExpenses(res.total || 0);

    } catch (error) {
      console.error("Error applying filters:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0] || null);

  const handleImportExcel = async () => {
    if (!file) return alert("Please select a file first!");
    try {
      setPopupType("processing");
      const res = await ExpenseService.uploadExcel(file);
      setMessage(`${res.message}. Total rows inserted: ${res.count}`);
      setPopupType("success");
      setFile(null);
      // Reload the first page of expenses after successful import
      setCurrentPage(1);
      // Fetch data using the current limit state
      fetchAllExpenses(1, limit); 
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Error uploading file.");
      setPopupType("error");
      setFile(null);
    }
  };
  
  // Handlers for pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handler for changing the limit/rows per page
  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    // Reset to page 1 whenever the limit changes
    setCurrentPage(1); 
  };
  

  return (
    <div className="min-h-screen max-w-5xl mx-auto mt-5 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Expense List</h1>
        <div className="relative">
          <button
            className="text-blue-600 text-md font-medium hover:underline flex items-center gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters <span className="text-[10px]">▼</span>
          </button>

          {showFilters && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-3 space-y-2">
              {["date", "category", "gst", "paymentMode"].map((key) => (
                <label key={key} className="flex items-center text-sm text-gray-700 gap-2">
                  <input
                    type="checkbox"
                    checked={filters[key]}
                    onChange={() => toggleFilter(key)}
                    className="h-5 w-5 border border-gray-300 rounded-sm checked:bg-blue-500 checked:text-white"
                  />
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
              ))}
              <button
                onClick={applyFilters}
                className="w-full mt-2 px-2 py-1 bg-blue-600 text-white text-xs rounded"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Date Range Display (Optional) */}
      {dateRange.startDate && dateRange.endDate && filters.date && (
        <p className="text-sm text-gray-600 mb-4">
            Showing results for: **Last 30 days** ({dateRange.startDate} to {dateRange.endDate})
        </p>
      )}
      
      {/* Limit Selector (Moved outside the table for better flow) */}
      {totalExpenses > 0 && (
        <div className="flex justify-end items-center space-x-2 text-sm text-gray-700 mb-4 w-w-[50%] md:w-[30%] text-nowrap">
            <label htmlFor="limit-selector">Rows per page:</label>
            <select
                id="limit-selector"
                value={limit}
                onChange={handleLimitChange}
                className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            >
                {LIMIT_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
      )}
    
      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-full bg-white rounded-md border-separate border-spacing-y-2">
          <thead className="text-gray-500 text-xs bg-gray-100">
            <tr>
              {/* NEW: Serial Number Header */}
              <th className="text-left p-3">S. No.</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Item</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">GST</th>
              <th className="text-left p-3">Payment Mode</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">Loading...</td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">No expenses found</td>
              </tr>
            ) : (
              expenses.map((exp, idx) => {
                // Serial number calculation: 
                // (Current Page - 1) * Limit + Index of current item + 1
                const serialNumber = (currentPage - 1) * limit + idx + 1;
                
                return (
                <tr key={exp._id || idx} className="bg-white shadow rounded-md text-sm text-gray-900">
                  {/* NEW: Serial Number Data */}
                  <td className="p-3 font-semibold">{serialNumber}</td> 
                  <td className="p-3">{exp.date ? new Date(exp.date).toLocaleDateString() : "—"}</td>
                  <td className="p-3">{exp.expenseCategory || "—"}</td>
                  <td className="p-3">{exp.itemName || "—"}</td>
                  <td className="p-3">₹{exp.amount || 0}</td>
                  <td className="p-3">{exp.gstApplicable ? "18%" : "–"}</td> 
                  <td className="p-3">{exp.paymentMode || "—"}</td>
                </tr>
              )})
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls (Simplified as per image) */}
      {!loading && totalExpenses > 0 && (
        <div className="flex justify-center items-center mt-6 space-x-3">
            {/* Previous Button */}
            <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-2 py-2 rounded-sm font-semibold transition border 
                    ${currentPage === 1 
                        ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200" 
                        : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                    }`}
            >
                Prev
            </button>
            
            {/* Page Indicator */}
            <div className="px-2 py-2 rounded-sm font-bold bg-white text-gray-900 border border-gray-300">
                Page {currentPage} of {totalPages}
            </div>

            {/* Next Button */}
            <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-2 py-2 rounded-sm font-semibold transition border 
                    ${currentPage === totalPages || totalPages === 0
                        ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200" 
                        : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                    }`}
            >
                Next
            </button>
        </div>
      )}

      {/* Footer (Import/Export) */}
      <div className="flex flex-wrap gap-3 justify-start mt-6">
        {/* File Input + Import */}
        <div className="flex flex-col md:flex-row items-center gap-3 bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
          <label className="flex items-center justify-center w-full md:w-60 px-4 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-100 transition">
            <span className="text-gray-700 text-sm truncate">{file?.name || "Choose Excel/CSV file"}</span>
            <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileChange} />
          </label>
          <button onClick={handleImportExcel} className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition">Import Excel</button>
          {popupType && <Button type={popupType} message={message} onClose={() => setPopupType(null)} />}
        </div>
      </div>
    </div>
  );
};

export default D10ExpenseList;