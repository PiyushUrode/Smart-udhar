import { useState, useEffect } from "react";
// Removed FaChevronLeft, FaChevronRight as the new design uses text buttons
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import ExpenseService from "../../api/expenseservice.js";
import Button from "../../common/Button.jsx";
import ExpenseDummy from "../../../../public/Download/expense_report.xlsx"

const D10ExpenseList = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState(null);   
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalExpenses, setTotalExpenses] = useState(0); 
  const [limit, setLimit] = useState(10);
  const LIMIT_OPTIONS = [5, 10, 25, 50]; 
  
  const [filters, setFilters] = useState({
    date: false,
    category: false,
    gst: false,
    paymentMode: false,
  });

  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  }); // Update useEffect to use currentPage AND limit


// --- Add these at the top ---
const categories = ["Travel", "Office Supplies", "Rent", "Utilities"];
const paymentModes = ["Cash", "UPI", "Bank"];

// --- Add new state ---
const [selectedCategories, setSelectedCategories] = useState([]);
const [selectedPayment, setSelectedPayment] = useState("");
const [customDate, setCustomDate] = useState({
  startDate: "",
  endDate: "",
});

// --- Update toggleFilter to reset dependent filters ---
const toggleFilter = (selectedFilter) => {
  setFilters({
    date: selectedFilter === "date",
    category: selectedFilter === "category",
    paymentMode: selectedFilter === "paymentMode",
  });

  // Reset irrelevant selections when switching filters
  if (selectedFilter !== "category") setSelectedCategories([]);
  if (selectedFilter !== "paymentMode") setSelectedPayment("");
  if (selectedFilter !== "date") setCustomDate({ startDate: "", endDate: "" });
};


// --- Update applyFilters function ---
const applyFilters = async () => {
  setCurrentPage(1);
  try {
    setLoading(true);
    const payload = {};

    // Add date range if active
    if (filters.date && customDate.startDate && customDate.endDate) {
      payload.startDate = customDate.startDate;
      payload.endDate = customDate.endDate;
    }

    // Add category array if selected
    if (filters.category && selectedCategories.length > 0) {
      // You can either send one or loop multiple, depending on backend
      payload.expenseCategory = selectedCategories;
    }

    // Add payment mode if selected
    if (filters.paymentMode && selectedPayment) {
      payload.paymentMode = selectedPayment;
    }

    const res = await ExpenseService.filterExpenses(payload);
    setExpenses(res?.expenses || res?.data || []);
    setTotalExpenses(res.total || (res.expenses?.length ?? 0));
    setTotalPages(Math.ceil((res.total || (res.expenses?.length ?? 0)) / limit));
  } catch (error) {
    console.error("Error applying filters:", error.message);
    setExpenses([]);
  } finally {
    setLoading(false);
  }
};

// --- Add clear filters ---
const clearFilters = () => {
  setFilters({ date: false, category: false, paymentMode: false });
  setSelectedCategories([]);
  setSelectedPayment("");
  setCustomDate({ startDate: "", endDate: "" });
  fetchAllExpenses(1, limit);
};



  useEffect(() => {
    fetchAllExpenses(currentPage, limit);
  }, [currentPage, limit]); // Re-run when currentPage or limit changes // Modified fetchAllExpenses to accept page and limit

  const fetchAllExpenses = async (page, limit) => {
    const pageToFetch = page;
    try {
      setLoading(true); // Pass page and limit to the service function
      const res = await ExpenseService.getAllExpenses(pageToFetch, limit);
      const newTotalPages = Math.ceil(res.total / limit);

      setExpenses(res?.data || []); // API response uses 'data'
      setTotalPages(newTotalPages); // Calculate total pages
      setTotalExpenses(res.total); // Set total number of items // If the current page is now greater than the new total pages, reset to the last page or 1.
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



  const handleFileChange = (e) => setFile(e.target.files[0] || null);

  const handleImportExcel = async () => {
    if (!file) return alert("Please select a file first!");
    try {
      setPopupType("processing");
      const res = await ExpenseService.uploadExcel(file);
      setMessage(`${res.message}. Total rows inserted: ${res.count}`);
      setPopupType("success");
      setFile(null); // Reload the first page of expenses after successful import
      setCurrentPage(1); // Fetch data using the current limit state
      fetchAllExpenses(1, limit);
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Error uploading file.");
      setPopupType("error");
      setFile(null);
    }
  }; // Handlers for pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }; // Handler for changing the limit/rows per page

  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit); // Reset to page 1 whenever the limit changes
    setCurrentPage(1);
  };



      const handeluploadexceldummy = ()=>{
        const link = document.createElement("a");
        link.href = ExpenseDummy;
        link.download = "expense-template.xlsx";
        link.click(); 
      }
  return (
    <div className="min-h-screen max-w-5xl mx-auto mt-5 p-6">
         {/* Header */}  {" "}
      <div className="flex justify-between items-center mb-6">
           {" "}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Expense List
        </h1>
           {" "}
        <div className="relative">
              {" "}
          <button
            className="text-blue-600 text-md font-medium hover:underline flex items-center gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
                  Filters <span className="text-[10px]">▼</span>    {" "}
          </button>
              {" "}
          {showFilters && (
  <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-4 space-y-3">
    
    {/* Date Filter */}
    <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
      <input
        type="checkbox"
        checked={filters.date}
        onChange={() => toggleFilter("date")}
        className="h-4 w-4 border-gray-300 rounded checked:bg-blue-500 checked:text-white appearance-none h-5 w-5 border-2 rounded-full border-gray-700 rounded-sm checked:bg-white checked:border-black checked:after:content-['✔'] checked:after:text-blue-500 checked:after:block checked:after:text-center"
      />
      Date Range
    </label>
    {filters.date && (
      <div className="flex flex-col gap-2 mt-2">
        <input
          type="date"
          value={customDate.startDate}
          onChange={(e) =>
            setCustomDate((p) => ({ ...p, startDate: e.target.value }))
          }
          className="border border-gray-300 rounded-md p-1 text-sm"
        />
        <input
          type="date"
          value={customDate.endDate}
          onChange={(e) =>
            setCustomDate((p) => ({ ...p, endDate: e.target.value }))
          }
          className="border border-gray-300 rounded-md p-1 text-sm"
        />
      </div>
    )}

    {/* Category Filter */}
    <label className="flex items-center text-sm font-medium text-gray-700 gap-2 mt-2">
      <input
        type="checkbox"
        checked={filters.category}
        onChange={() => toggleFilter("category")}
        className="h-4 w-4 border-gray-300 rounded checked:bg-blue-500 checked:text-white appearance-none h-5 w-5 border-2 rounded-full border-gray-700 rounded-sm checked:bg-white checked:border-black checked:after:content-['✔'] checked:after:text-blue-500 checked:after:block checked:after:text-center"
      />
      Category
    </label>
    {filters.category && (
      <div className="flex flex-col gap-1 ml-4">
        {categories.map((cat) => (
          <label key={cat} className="text-sm text-gray-600 flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat)}
              onChange={(e) => {
                if (e.target.checked)
                  setSelectedCategories((prev) => [...prev, cat]);
                else
                  setSelectedCategories((prev) =>
                    prev.filter((c) => c !== cat)
                  );
              }}
              className="h-4 w-4 border-gray-300 rounded checked:bg-blue-500 checked:text-white appearance-none h-5 w-5 border-2 rounded-full border-gray-700 rounded-sm checked:bg-white checked:border-black checked:after:content-['✔'] checked:after:text-blue-500 checked:after:block checked:after:text-center"
            />
            {cat}
          </label>
        ))}
      </div>
    )}

    {/* Payment Mode Filter */}
    <label className="flex items-center text-sm font-medium text-gray-700 gap-2 mt-2">
      <input
        type="checkbox"
        checked={filters.paymentMode}
        onChange={() => toggleFilter("paymentMode")}
        className="h-4 w-4 border-gray-300 rounded checked:bg-blue-500 checked:text-white appearance-none h-5 w-5 border-2 rounded-full border-gray-700 rounded-sm checked:bg-white checked:border-black checked:after:content-['✔'] checked:after:text-blue-500 checked:after:block checked:after:text-center"
      />
      Payment Mode
    </label>
    {filters.paymentMode && (
      <select
        value={selectedPayment}
        onChange={(e) => setSelectedPayment(e.target.value)}
        className="w-full mt-1 border border-gray-300 rounded-md p-1 text-sm"
      >
        <option value="">Select Mode</option>
        {paymentModes.map((mode) => (
          <option key={mode} value={mode}>
            {mode}
          </option>
        ))}
      </select>
    )}

    {/* Buttons */}
    <div className="flex justify-between mt-3">
      <button
        onClick={applyFilters}
        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
      >
        Apply
      </button>
      <button
        onClick={clearFilters}
        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200"
      >
        Clear
      </button>
    </div>
  </div>
)}

             {" "}
        </div>
          {" "}
      </div>
            {/* Date Range Display (Optional) */}  {" "}
      {dateRange.startDate && dateRange.endDate && filters.date && (
        <p className="text-sm text-gray-600 mb-4">
                Showing results for: **Last 30 days** (
          {dateRange.startDate} to {dateRange.endDate})    {" "}
        </p>
      )}
           {" "}
      {/* Limit Selector (Moved outside the table for better flow) */}  {" "}
      {totalExpenses > 0 && (
        <div className="flex justify-end items-center space-x-2 text-sm text-gray-700 mb-4 w-w-[50%] md:w-[30%] text-nowrap">
                <label htmlFor="limit-selector">Rows per page:</label> 
             {" "}
          <select
            id="limit-selector"
            value={limit}
            onChange={handleLimitChange}
            className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          >
                   {" "}
            {LIMIT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
                 {" "}
          </select>
             {" "}
        </div>
      )}
           {/* Table */}  {" "}
      <div className="overflow-auto">
           {" "}
        <table className="min-w-full bg-white rounded-md border-separate border-spacing-y-2">
              {" "}
          <thead className="text-gray-500 text-xs bg-gray-100">
                 {" "}
            <tr>
                     {/* NEW: Serial Number Header */}      {" "}
              <th className="text-left p-3">S. No.</th>      {" "}
              <th className="text-left p-3">Date</th>      {" "}
              <th className="text-left p-3">Category</th>      {" "}
              <th className="text-left p-3">Item</th>      {" "}
              <th className="text-left p-3">Amount</th>      {" "}
              <th className="text-left p-3">GST</th>      {" "}
              <th className="text-left p-3">Payment Mode</th>     {" "}
            </tr>
                {" "}
          </thead>
              {" "}
          <tbody>
                 {" "}
            {loading ? (
              <tr>
                       {" "}
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  Loading...
                </td>
                      {" "}
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                       {" "}
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No expenses found
                </td>
                      {" "}
              </tr>
            ) : (
              expenses.map((exp, idx) => {
                // Serial number calculation:
                // (Current Page - 1) * Limit + Index of current item + 1
                const serialNumber = (currentPage - 1) * limit + idx + 1;
                return (
                  <tr
                    key={exp._id || idx}
                    className="bg-white shadow rounded-md text-sm text-gray-900"
                  >
                             {/* NEW: Serial Number Data */}     
                       <td className="p-3 font-semibold">{serialNumber}</td>
                           {" "}
                    <td className="p-3">
                      {exp.date ? new Date(exp.date).toLocaleDateString() : "—"}
                    </td>
                            {" "}
                    <td className="p-3">{exp.expenseCategory || "—"}</td>   
                         <td className="p-3">{exp.itemName || "—"}</td> 
                           <td className="p-3">₹{exp.amount || 0}</td> 
                          {" "}
                    <td className="p-3">{exp.gstApplicable ? "18%" : "–"}</td>
                           {" "}
                    <td className="p-3">{exp.paymentMode || "—"}</td>     
                     {" "}
                  </tr>
                );
              })
            )}
                {" "}
          </tbody>
             {" "}
        </table>
          {" "}
      </div>
            {/* Pagination Controls (Simplified as per image) */}  {" "}
      {!loading && totalExpenses > 0 && (
        <div className="flex justify-center items-center mt-6 space-x-3">
                {/* Previous Button */}     {" "}
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-2 py-2 rounded-sm font-semibold transition border 
          ${
              currentPage === 1
                ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
            }`}
          >
                    Prev      {" "}
          </button>
                      {/* Page Indicator */}     {" "}
          <div className="px-2 py-2 rounded-sm font-bold bg-white text-gray-900 border border-gray-300">
                    Page {currentPage} of {totalPages}     {" "}
          </div>
                {/* Next Button */}     {" "}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-2 py-2 rounded-sm font-semibold transition border 
          ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
            }`}
          >
                    Next      {" "}
          </button>
             {" "}
        </div>
      )}
         {/* Footer (Import/Export) */}  {" "}
  <div className="w-full max-w-6xl">
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-md border border-gray-200 mt-4 sm:mt-6">
      
      {/* Action Area */}
      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6">
        

  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200 w-full">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 11-2 0V4H5v11h3a1 1 0 110 2H4a1 1 0 01-1-1V3zm7 5a1 1 0 00-1 1v3.586l-.293-.293a1 1 0 10-1.414 1.414l2.707 2.707a1 1 0 001.414 0l2.707-2.707a1 1 0 10-1.414-1.414L11 12.586V9a1 1 0 00-1-1z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-medium text-gray-800">Download Template</h4>
              <p className="text-xs sm:text-sm text-gray-500">Get the Excel format file</p>
            </div>
          </div>

          <button
            onClick={handeluploadexceldummy}
            className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-green-600 text-white text-xs rounded-lg shadow hover:bg-green-700 transition-all w-full sm:w-auto"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 11-2 0V4H5v11h3a1 1 0 110 2H4a1 1 0 01-1-1V3zm7 5a1 1 0 00-1 1v3.586l-.293-.293a1 1 0 10-1.414 1.414l2.707 2.707a1 1 0 001.414 0l2.707-2.707a1 1 0 10-1.414-1.414L11 12.586V9a1 1 0 00-1-1z" />
            </svg>
            Download Excel
          </button>
        </div>


        <div className="flex flex-col md:flex-row items-center gap-3 bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
              {" "}
          <label className="flex items-center justify-center w-full md:w-60 px-4 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-100 transition">
                 {" "}
            <span className="text-gray-700 text-sm truncate">
              {file?.name || "Choose Excel/CSV file"}
            </span>
                 {" "}
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFileChange}
            />
                {" "}
          </label>
              {" "}
          <button
            onClick={handleImportExcel}
            className="flex items-center text-xs gap-2 px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
          >
            Import Excel
          </button>
              {" "}
          {popupType && (
            <Button
              type={popupType}
              message={message}
              onClose={() => setPopupType(null)}
            />
          )}
             {" "}
        </div>
          {" "}
      </div>
      </div>
      </div>
       {" "}
    </div>
  );
};

export default D10ExpenseList;
