import React, { useState , useEffect } from "react";
import axios from "axios";
import { FileDown, FileUp, ChevronDown } from "lucide-react";
import { FaPercentage, FaQuestion } from "react-icons/fa";
import { FaChartPie } from "react-icons/fa6";
import { FaCloudUploadAlt } from "react-icons/fa";
// import ExpenseService from "../../api/expenseservice.js"; // Adjust the path as necessary
import ExpenseService from "../../api/expenseservice.js"; // ✅
import Cookies from "js-cookie"; // to fetch token / storeId from cookie
import DatePicker from "react-datepicker";
import { format, parse } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";


const D10Expenses = () => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Monthly"); // default
const [loading, setLoading] = useState(false);
const [expenses, setExpenses] = useState([]);
  const handleFilterChange = (option) => {
    setSelectedFilter(option);
    setShowFilterDropdown(false);
    console.log("Selected Filter:", option);
  };
  // Define category colors (tailwind classes)
const categoryColors = [
  "bg-blue-600",
  "bg-yellow-400",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-gray-500",
  "bg-orange-500",
];



    const handleExportPDF = async () => {
    try {
      const startDate = "2025-01-01"; // 🔧 replace with filter
      const endDate = "2025-12-31";
      await ExpenseService.exportPDF(startDate, endDate);
    } catch (err) {
      console.error("❌ PDF Export error:", err);
    }
  };

  const handleExportExcel = async () => {
    try {
      const startDate = "2025-01-01";
      const endDate = "2025-12-31";
      await ExpenseService.exportExcel(startDate, endDate);
    } catch (err) {
      console.error("❌ Excel Export error:", err);
    }
  };

const [formData, setFormData] = useState({
  date: "",
  expenseCategory: "",
  itemName: "",
  amount: "",
  vendorName: "",
  gstApplicable: true,
  paymentMode: "",
  notesOrBill: "",
  expenseImage: "",
});



  // const [loading, setLoading] = useState(false);

  const categories = ["Travel", "Office Supplies", "Rent", "Utilities"];
  const paymentModes = ["Cash", "UPI", "Bank"];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSelect = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const result = await ExpenseService.createExpense(formData);
//     if (result.success) {
//       console.log("✅ Expense created:", result.expense);
//     } else {
//       console.error("❌ Error creating expense:", result.error);
//     }
//   } catch (err) {
//     console.error("❌ Unexpected error:", err);
//   }
// };


  const [summary, setSummary] = useState({
    total: 0,
    gstCredit: 0,
    categories: {}
  });

  // Fetch all expenses when component loads
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const result = await ExpenseService.getAllExpenses();
      if (result?.data) {
        setExpenses(result.data);
        calculateSummary(result.data);
      }
    } catch (err) {
      console.error("❌ Fetch expenses error:", err);
    }
  };

  const calculateSummary = (data) => {
    let total = 0;
    let gstCredit = 0;
    let categories = {};

    data.forEach((exp) => {
      const amount = Number(exp.amount) || 0;
      total += amount;

      if (exp.gstApplicable) {
        gstCredit += amount * 0.18; // assuming 18% GST
      }

      categories[exp.expenseCategory] =
        (categories[exp.expenseCategory] || 0) + amount;
    });

    setSummary({ total, gstCredit, categories });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const result = await ExpenseService.createExpense(formData);
    if (result.success) {
      console.log("✅ Expense created:", result.expense);

      // ✅ Reset form fields
      setFormData({
        date: "",
        expenseCategory: "",
        itemName: "",
        amount: "",
        vendorName: "",
        gstApplicable: true,
        paymentMode: "",
        notesOrBill: "",
        expenseImage: "",
      });

      fetchExpenses(); // refresh list + summary
    } else {
      console.error("❌ Error creating expense:", result.error);
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  } finally {
    setLoading(false);
  }
};





  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 border rounded-lg shadow-lg bg-white">
        {/* Left - Expense Form */}
        <div className="bg-white rounded-xl shadow-md p-8 lg:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Add New Expense
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6 text-sm text-gray-700">
            {/* Date & Category */}
            <div className="grid md:grid-cols-2 gap-6">
             <div>
  <label className="font-medium mb-1 block">Date</label>
  <DatePicker
    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
    selected={
      formData.date
        ? parse(formData.date, "dd/MM/yyyy", new Date()) // string → Date
        : null
    }
    onChange={(date) =>
      setFormData({
        ...formData,
        date: date ? format(date, "dd/MM/yyyy") : "", // Date → string
      })
    }
    dateFormat="dd/MM/yyyy"        // ✅ DD/MM/YYYY format force
    placeholderText="DD/MM/YYYY"   // 👈 Placeholder
    isClearable                    // optional: allow clearing
  />
</div>

              <div>
                <label className="font-medium mb-1 block">Expense Category</label>
                <select
                  name="expenseCategory"
                  value={formData.expenseCategory}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Item Name */}
            <div>
              <label className="font-medium mb-1 block">Item Name</label>
              <input
                type="text"
                name="itemName"
                placeholder="Enter item description"
                value={formData.itemName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                required
              />
            </div>

            {/* Amount & Vendor */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="font-medium mb-1 block">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                  <input
                    type="text"
                    name="amount"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 bg-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="font-medium mb-1 block">
                  Vendor Name (Optional)
                </label>
                <input
                  type="text"
                  name="vendorName"
                  placeholder="Enter vendor name"
                  value={formData.vendorName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                />
              </div>
            </div>

         <div className="flex items-center gap-3">
             {/* GST Checkbox */}
<input
  type="checkbox"
className="appearance-none h-5 w-5 border border-gray-300 rounded-sm 
             checked:bg-white  checked:ring-2 checked:ring-blue-500 
             checked:after:content-['✔'] checked:after:text-blue-500 
             checked:after:block checked:after:text-center"
            
  id="gst"
  checked={formData.gstApplicable}   // direct boolean bind
  onChange={(e) =>
    setFormData({ ...formData, gstApplicable: e.target.checked })
  }
/>
<label htmlFor="gst" className="text-sm font-medium">
  GST Applicable
</label>
         </div>

            {/* Payment Mode */}
            <div>
              <label className="font-medium mb-1 block">Payment Mode</label>
              <div className="flex gap-6 mt-1">
                {paymentModes.map((mode) => (
                  <label key={mode} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMode"
                      value={mode}
                      checked={formData.paymentMode === mode}
                      onChange={handleChange}
                      required
                    />
                    {mode}
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="font-medium mb-1 block">
                Notes / Attach Bill (Optional)
              </label>
              <textarea
                name="notesOrBill"
                placeholder="Add notes or description"
                value={formData.notesOrBill}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white resize-none"
              />
            </div>

            {/* Upload */}
            <div className="border border-dashed border-gray-400 p-6 mt-4 justify-center flex flex-col items-center text-center rounded-md">
              <FaCloudUploadAlt size={30} color="#9CA3AF" />
              <label htmlFor="upload" className="cursor-pointer">
                <div className="text-[#4B5563] text-sm">
                  Drop files here or click to upload
                </div>
                <input
 id="upload"
  type="file"
  name="expenseImage"
  onChange={handleChange}
                  className="hidden"
                />
              </label>
              <p className="mt-2 text-sm font-semibold">Upload Image Here</p>
            </div>

            {/* Submit */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {loading ? "Saving..." : "+ Add Expense"}
              </button>
            </div>
          </form>
        </div>

        {/* Right - Summary */}
        <div className="bg-white rounded-xl shadow-md p-6  space-y-6">
      <div className="relative flex items-center justify-between">
  <h2 className="text-lg font-semibold text-gray-800 flex flex-row gap-3">
    <FaChartPie color="#22C55E" /> Expense Summary
  </h2>
  <div className="relative">
    <button
      className="text-sm text-[#1E40AF] hover:underline flex items-center gap-1"
      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
    >
      Filters <ChevronDown size={16} />
    </button>
    {showFilterDropdown && (
      <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
        {['Day', 'Week', 'Month'].map((option) => (
          <div
            key={option}
            onClick={() => handleFilterChange(option)}
            className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
              selectedFilter === option ? 'bg-gray-100 font-medium' : ''
            }`}
          >
            {option}
          </div>
        ))}
      </div>
    )}
  </div>
</div>

          <div className='flex flex-row justify-between items-center bg-[#EFF6FF] py-4 px-3 gap-4'>
           <div className='flex flex-col '>   <p className="text-sm text-[#2563EB]">Total Monthly Expense</p>
            {/* <p className="text-2xl font-bold text-[#1E40AF]">₹45,230</p> */}
            <p className="text-2xl font-bold text-[#1E40AF]">₹{summary.total}</p>
</div>
           <div className='p-1 border-dotted border-4 rounded-full border-[#3B82F6] '> <FaQuestion color='#3B82F6'/></div>
          </div>

                    <div className='flex flex-row justify-between items-center bg-[#F0FDF4] border-[#E5E7EB] border py-4 px-3 gap-4'>
           <div className='flex flex-col '>   <p className="text-sm text-[#16A34A]">GST Credit Available</p>
            {/* <p className="text-2xl font-bold text-[#166534]">₹8,142 </p> */}
            <p className="text-2xl font-bold text-[#166534]">₹{summary.gstCredit.toFixed(2)}</p>
</div>
           <div className='p-1  '> <FaPercentage color='#22C55E'/></div>
          </div>



          <div className='border-b-2 pb-5'>
            <p className="text-base font-semibold text-[#374151] mb-2">Top Spending Categories</p>
     <ul className="text-sm space-y-2">
  {Object.entries(summary.categories).map(([cat, amt], index) => {
    const color = categoryColors[index % categoryColors.length]; 
    return (
      <li key={cat} className="flex justify-between items-center">
        <div className="flex items-center">
          <span
            className={`inline-block w-3 h-3 rounded-full mr-2 ${color}`}
          ></span>
          {cat}
        </div>
        <span className="font-interM text-[#1F2937] leading-4">₹{amt}</span>
      </li>
    );
  })}
</ul>

          </div>

            <h1 className='text-[#374151] leading-4'> Downloadable Reports </h1>
          <div className="flex gap-4 ">
            <button
              onClick={handleExportPDF}
              className="bg-red-100 text-red-600 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-200 transition"
            >
              <FileDown size={16} /> PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="bg-green-100 text-green-700 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-200 transition"
            >
              <FileUp size={16} /> Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default D10Expenses;
