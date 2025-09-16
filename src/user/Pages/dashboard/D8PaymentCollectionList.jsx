import {
  FaEdit,
  FaSearch,
  FaFilePdf
} from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa6";
import { RiBankCardFill } from "react-icons/ri";
import { FaChartPie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaRegChartBar } from "react-icons/fa6";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // ✅ Added
import { Invoice } from "../../api/Invoice.js"; // ✅ ad

import React, { useState, useEffect } from "react";



const D8PaymentCollectionList = () => {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  
  const [summary, setSummary] = useState({
  today: 0,
  subtotal: 0,
  topCollections: {
    week: 0,
    month: 0,
    year: 0,
  }
});

const calculateSummary = (data) => {
  let today = 0;
  let total = 0;
  let week = 0;
  let month = 0;
  let year = 0;

  const todayDate = new Date().toDateString();
  const now = new Date();

  // Week start (Monday) & end (Sunday)
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  data.forEach((inv) => {
    // 👉 तुम यहां collection किससे log करना चाहते हो?
    // फिलहाल inv.total लिया है
    const collected = Number(inv.total || 0);
    const createdAt = new Date(inv.createdAt);

    total += collected;

    // Today's collection
    if (createdAt.toDateString() === todayDate) {
      today += collected;
    }

    // This week
    if (createdAt >= weekStart && createdAt <= weekEnd) {
      week += collected;
    }

    // This month
    if (
      createdAt.getMonth() === now.getMonth() &&
      createdAt.getFullYear() === now.getFullYear()
    ) {
      month += collected;
    }

    // This year
    if (createdAt.getFullYear() === now.getFullYear()) {
      year += collected;
    }
  });

  setSummary({
    today,
    total,
    topCollections: { week, month, year }
  });
};



useEffect(() => {
  const fetchInvoices = async () => {
    const res = await Invoice.getAllInvoices();
    if (res.success) {
      setInvoices(res.invoices);
      calculateSummary(res.invoices); // ✅ summary calculate
    }
  };
  fetchInvoices();
}, []);


  

    const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const res = await Invoice.deleteInvoice(id);
      if (res.success) {
        setInvoices((prev) => prev.filter((inv) => inv._id !== id));
      }
    } catch (err) {
      console.error("❌ Error deleting:", err);
    }
  };

  // ✅ Edit → go to add-invoice page with data
  const handleEdit = (invoice) => {
    navigate("/dashboard/payment-collection", { state: { invoice } });
  };
  

  // fetch invoices on mount
  useEffect(() => {
    const fetchInvoices = async () => {
      const res = await Invoice.getAllInvoices();
      if (res.success) {
        setInvoices(res.invoices);
      }
    };
    fetchInvoices();
  }, []);

  // filter based on search
  const filteredData = invoices.filter((entry) => {
    const query = search.toLowerCase();
    return (
      entry?.customerName?.toLowerCase().includes(query) ||
      entry?.phone?.toLowerCase().includes(query) ||
      entry?._id?.toLowerCase().includes(query)
    );
  });


  
  return (
    <div className="p-6 md:p-6 mt-5 bg-white min-h-screen">
      <h1 className="text-xl md:text-2xl font-robotoB mb-6">
        Payment Collection List
      </h1>

      {/* Flex container for table and collection section */}
      <div className="flex flex-col lg:flex-row gap-6">
        

        {/* Left side - Table */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 mb-4 gap-4">
            <div className="relative w-full md:max-w-2xl flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by User ID, Name, or phone"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full min-w-[600px] text-left bg-white rounded-md shadow border-separate border-spacing-y-2">
              <thead className="bg-gray-200 text-[#6B7280] text-xs font-robotoM">
                <tr>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Mobile Number</th>
                  <th className="p-3">Pending Amount</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Next Milestone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Edit</th>
                </tr>
              </thead>
<tbody>
  {filteredData.length > 0 ? (
    filteredData.map((entry, index) => {
      // pick the next milestone (if any)
      const nextMilestone =
        entry.milestones?.find(m => m.status !== "Paid") || null;

      return (
        <tr
          key={index}
          className=" border-2 shadow-md rounded-xl font-robotoR text-[12px] sm:text-[14px] md:text-[16px] text-[#111827]"
        >
          {/* Customer Name */}
          <td className="p-3 whitespace-nowrap">
            {entry.name || "-"}
          </td>

          {/* phone Number */}
          <td className="p-3 whitespace-nowrap">
            {entry.phone || "-"}
          </td>

          {/* Pending Amount */}
          <td className="p-3 whitespace-nowrap">
₹{entry.dueBalance ?? entry.balance ?? 0}

          </td>

          {/* Due Date */}
          <td className="p-3 whitespace-nowrap">
            {nextMilestone?.dueDate
              ? new Date(nextMilestone.dueDate).toLocaleDateString("en-IN")
              : "-"}
          </td>

          {/* Next Milestone */}
          <td className="p-3 whitespace-nowrap">
            <div className="flex items-center gap-2">
              {nextMilestone?.milestoneName || "-"}
              {/* <FaEdit color="#EB2525" /> */}
            </div>
          </td>

          {/* Status */}
          <td className="p-3 font-medium whitespace-nowrap">
            {entry.paymentStatus || "Pending"}
          </td>

                    {/* Next Milestone */}
 <td className="p-3 border-y text-center space-x-2">
                    <button
                      className="text-[#2563EB] hover:text-blue-700"
                      onClick={() => handleEdit(entry)}
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button
                      className="text-[#DC2626] hover:text-red-700"
                      onClick={() => handleDelete(entry._id)}
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>

                  </td>
          
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="6" className="text-center p-4 text-gray-500">
        No invoices found
      </td>
    </tr>
  )}
</tbody>
 


            </table>
          </div>
        </div>

        {/* Right side - Collection Summary */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white border rounded-lg shadow p-4">
            <div className="flex flex-row gap-5 items-center py-2  align-middle">  
         < FaChartPie size={20} color="#22C55E" />
            <h2 className="text-lg font-interSb text-[#1F2937] ">Collection</h2>
            </div>
            {/* Today's Collection */}
            <div className=" border border-green-200 rounded-lg p-4 mb-4 flex flex-row  justify-between align-middle items-center">
      <div>
                <p className="text-gray-500 font-robotoM text-sm">Today's Collection</p>
<p className="text-[#16A34A] font-robotoSb text-2xl ">₹{summary.today}</p>


      </div>
              <div className=" p-3 bg-[#DCFCE7] rounded-xl"> 

              <RiBankCardFill  size={20} color="#16A34A" />
</div>
            </div>

            {/* Total Collection */}
            <div className=" border border-blue-200 rounded-lg p-4 mb-4 flex flex-row  justify-between align-middle items-center">
<div>
                <p className="text-gray-500  font-robotoM text-sm">Total Collection</p>
<p className="text-[#2563EB] font-robotoSb text-2xl ">₹{summary.total}</p>

</div>
<div className=" p-3 bg-[#DBEAFE] rounded-xl"> 

              <FaRegChartBar size={20} color="#2563EB" />
</div>
            </div>

            {/* Top Collections */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Top Collections</h3>
<ul className="space-y-2 text-sm">
  <li className="flex items-center justify-between">
    <span className="flex items-center gap-2 font-interR text-[#374151]">
      <span className="w-3 h-3 rounded-full bg-[#3B82F6]"></span> This week
    </span>
    <span className="font-interM text-[#1F2937]">₹{summary.topCollections.week}</span>
  </li>
  <li className="flex items-center justify-between">
    <span className="flex items-center gap-2 font-interR text-[#374151]">
      <span className="w-3 h-3 rounded-full bg-[#22C55E]"></span> This month
    </span>
    <span className="font-interM text-[#1F2937]">₹{summary.topCollections.month}</span>
  </li>
  <li className="flex items-center justify-between">
    <span className="flex items-center gap-2 font-interR text-[#374151]">
      <span className="w-3 h-3 rounded-full bg-[#EAB308]"></span> This year
    </span>
    <span className="font-interM text-[#1F2937]">₹{summary.topCollections.year}</span>
  </li>
</ul>

            </div>

            {/* Download buttons */}
            <div className="flex flex-col mt-5 border-t-2">      
                     <div> 
              <h1 className="text-sm font-interM text-[#374151] py-5 leading-tight tracking-tight"> Downloadable Reports</h1>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-[#FEF2F2] text-[#DC2626] font-interM px-3 py-2 rounded-md shadow hover:bg-red-600">
                <FaFilePdf color="#DC2626" /> PDF
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-[#F0FDF4] text-[#16A34A] font-interM px-3 py-2 rounded-md shadow hover:bg-green-600">
                <FaFileExcel /> Excel
              </button>
            </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default D8PaymentCollectionList;