import { useState, useEffect } from "react";
import { FaFilePdf, FaFileExcel } from "react-icons/fa6";
import ExpenseService from "../../api/expenseservice"; // ✅ correct import

const D10ExprenseList = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // filter state
  const [filters, setFilters] = useState({
    date: false,
    category: false,
    gst: false,
    paymentMode: false,
  });


  useEffect(() => {
    fetchAllExpenses();
  }, []);

  const fetchAllExpenses = async () => {
    try {
      setLoading(true);
      const res = await ExpenseService.getAllExpenses();
      setExpenses(res?.data || res?.expenses || []);
    } catch (error) {
      console.error("Error loading expenses:", error.message);
    } finally {
      setLoading(false);
    }
  };


  // toggle checkbox
  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };


  // save date range (needed for download)
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });


  // 🔍 Apply filter
  const applyFilters = async () => {
    try {
      setLoading(true);

      const payload = {};
      if (filters.category) payload.expenseCategory = "Office Supplies"; // example
      if (filters.paymentMode) payload.paymentMode = "UPI"; // example

      if (filters.date) {
        const today = new Date();
        const endDate = today.toISOString().split("T")[0]; // yyyy-mm-dd
        const last30 = new Date();
        last30.setDate(today.getDate() - 30);
        const startDate = last30.toISOString().split("T")[0];

        Object.assign(payload, { startDate, endDate });
        setDateRange({ startDate, endDate });
      } else {
        setDateRange({ startDate: null, endDate: null });
      }

      const res = await ExpenseService.filterExpenses(payload);
      setExpenses(res?.expenses || []);
    } catch (error) {
      console.error("Error applying filters:", error.message);
    } finally {
      setLoading(false);
    }
  };


  // 📄 Download PDF
  const handleDownloadPDF = async () => {
    const { startDate, endDate } = dateRange;
    await ExpenseService.exportPDF(
      startDate || "2025-01-01",
      endDate || new Date().toISOString().split("T")[0]
    );
  };

  // 📊 Download Excel
  const handleDownloadExcel = async () => {
    const { startDate, endDate } = dateRange;
    await ExpenseService.exportExcel(
      startDate || "2025-01-01",
      endDate || new Date().toISOString().split("T")[0]
    );
  };

  return (
    <div className="min-h-screen max-w-5xl mx-auto mt-5 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-robotoB text-gray-900">
          Expense List
        </h1>
        <div className="relative">
          <button
            className="text-[#2563EB] text-md font-medium hover:underline flex items-center gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters <span className="text-[10px]">▼</span>
          </button>

          {/* Dropdown */}
          {showFilters && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-3 space-y-2">
              <label className="flex items-center text-sm text-gray-700 gap-2">
                <input
                  type="checkbox"
                  checked={filters.date}
                  onChange={() => toggleFilter("date")}
                  className="appearance-none h-5 w-5 border border-gray-300 rounded-sm checked:bg-white checked:border-white checked:after:content-['✔'] checked:after:text-blue-500 checked:after:block checked:after:text-center"
                />
                Date
              </label>
              <label className="flex items-center text-sm text-gray-700 gap-2">
                <input
                  type="checkbox"
                  checked={filters.category}
                  onChange={() => toggleFilter("category")}
                  className="appearance-none h-5 w-5 border border-gray-300 rounded-sm checked:bg-white checked:border-white checked:after:content-['✔'] checked:after:text-blue-500 checked:after:block checked:after:text-center"
                />
                Category
              </label>
              <label className="flex items-center text-sm text-gray-700 gap-2">
                <input
                  type="checkbox"
                  checked={filters.gst}
                  onChange={() => toggleFilter("gst")}
                  className="appearance-none h-5 w-5 border border-gray-300 rounded-sm checked:bg-white checked:border-white checked:after:content-['✔'] checked:after:text-blue-500 checked:after:block checked:after:text-center"
                />
                GST
              </label>
              <label className="flex items-center text-sm text-gray-700 gap-2">
                <input
                  type="checkbox"
                  checked={filters.paymentMode}
                  onChange={() => toggleFilter("paymentMode")}
                  className="appearance-none h-5 w-5 border border-gray-300 rounded-sm checked:bg-white checked:border-white checked:after:content-['✔'] checked:after:text-blue-500 checked:after:block checked:after:text-center"
                />
                Payment Mode
              </label>
              <button
                onClick={applyFilters}
                className="w-full mt-2 px-2 py-1 bg-[#2563EB] text-white text-xs rounded"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-full bg-white rounded-md border-separate border-spacing-y-2">
          <thead className="text-gray-500 text-xs bg-gray-100">
            <tr>
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
                <td colSpan="8" className="text-center p-4 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">
                  No expenses found
                </td>
              </tr>
            ) : (
              expenses.map((exp, index) => (
                <tr
                  key={exp._id || index}
                  className="bg-white shadow rounded-md font-robotoR text-sm sm:text-md text-[#111827]"
                >
                  <td className="p-3 whitespace-nowrap font-robotoM">
                    {exp.date ? new Date(exp.date).toLocaleDateString() : "—"}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {exp.expenseCategory || "—"}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {exp.itemName || "—"}
                  </td>
                  <td className="p-3 whitespace-nowrap">₹{exp.amount || 0}</td>
                  <td className="p-3 whitespace-nowrap">
                    {exp.gstApplicable ? "18%" : "–"}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {exp.paymentMode || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap gap-3 justify-end mt-6">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-md shadow-sm font-robotoR text-sm hover:bg-blue-700"
        >
          <FaFilePdf /> PDF
        </button>
        <button
          onClick={handleDownloadExcel}
          className="flex items-center gap-2 px-4 py-2 bg-[#DBEAFE] text-[#2563EB] rounded-md shadow-sm font-robotoR text-sm hover:bg-blue-200"
        >
          <FaFileExcel /> Excel
        </button>
      </div>
    </div>
  );
};

export default D10ExprenseList;
