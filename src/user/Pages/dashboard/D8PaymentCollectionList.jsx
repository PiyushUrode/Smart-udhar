import { FaEdit, FaSearch, FaFilePdf } from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa6";
import { RiBankCardFill } from "react-icons/ri";
import { FaChartPie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaRegChartBar } from "react-icons/fa6";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { Invoice } from "../../api/Invoice.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import React, { useState, useEffect } from "react";

const D8PaymentCollectionList = () => {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [summary, setSummary] = useState({
    today: 0,
    total: 0,
    topCollections: { week: 0, month: 0, year: 0 },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  const calculateSummary = (data) => {
    let today = 0;
    let total = 0;
    let week = 0;
    let month = 0;
    let year = 0;

    const todayDate = new Date().toDateString();
    const now = new Date();

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    data.forEach((inv) => {
      const collected = Number(inv.total || 0);
      const createdAt = new Date(inv.createdAt);

      total += collected;
      if (createdAt.toDateString() === todayDate) today += collected;
      if (createdAt >= weekStart && createdAt <= weekEnd) week += collected;
      if (
        createdAt.getMonth() === now.getMonth() &&
        createdAt.getFullYear() === now.getFullYear()
      )
        month += collected;
      if (createdAt.getFullYear() === now.getFullYear()) year += collected;
    });

    setSummary({ today, total, topCollections: { week, month, year } });
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      const res = await Invoice.getAllInvoices();
      if (res.success) {
        setInvoices(res.invoices);
        calculateSummary(res.invoices);
      }
    };
    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;
    try {
      const res = await Invoice.deleteInvoice(id);
      if (res.success) {
        setInvoices((prev) => prev.filter((inv) => inv._id !== id));
      }
    } catch (err) {
      console.error("❌ Error deleting:", err);
    }
  };
  const handleView = (id) => {
    navigate(`/dashboard/invoice-view/${id}`);
  }

  const handleEdit = (invoice) => {
    navigate("/dashboard/payment-collection", { state: { invoice } });
  };

  // ✅ Search filter
  const filteredData = invoices.filter((entry) => {
    const query = search.toLowerCase();
    return (
      entry?.name?.toLowerCase().includes(query) ||
      entry?.phone?.toLowerCase().includes(query)
    );
  });

  // ✅ Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // ✅ Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Payment Collection List", 14, 10);

    autoTable(doc, {
      head: [
        ["Customer Name", "Mobile", "Amount", "Due Date", "Promise", "Status"],
      ],
      body: filteredData.map((entry) => [
        entry.name || "-",
        entry.phone || "-",
        entry.dueBalance ?? entry.balance ?? 0,
        entry.milestones?.[0]?.dueDate
          ? new Date(entry.milestones[0].dueDate).toLocaleDateString("en-IN")
          : "-",
        entry.milestones?.[0]?.amount || "-",
        entry.paymentStatus || "Pending",
      ]),
    });

    doc.save("PaymentCollectionList.pdf");
  };

  // ✅ Export Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((entry) => ({
        Name: entry.name || "-",
        Phone: entry.phone || "-",
        Amount: entry.dueBalance ?? entry.balance ?? 0,
        DueDate: entry.milestones?.[0]?.dueDate
          ? new Date(entry.milestones[0].dueDate).toLocaleDateString("en-IN")
          : "-",
        Promise: entry.milestones?.[0]?.amount || "-",
        Status: entry.paymentStatus || "Pending",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
    XLSX.writeFile(workbook, "PaymentCollectionList.xlsx");
  };

  return (
    <div className="p-6 md:p-6 mt-5 bg-white min-h-screen">
      <h1 className="text-xl md:text-2xl font-robotoB mb-6">
        Payment Collection List
      </h1>

      {/* ✅ Collection Summary at the top */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Today's Collection */}
        <div className="border border-green-200 rounded-lg p-4 flex flex-row justify-between items-center">
          <div>
            <p className="text-gray-500 font-robotoM text-sm">
              Today's Collection
            </p>
            <p className="text-[#16A34A] font-robotoSb text-2xl">
              ₹{(summary.today).toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-[#DCFCE7] rounded-xl">
            <RiBankCardFill size={20} color="#16A34A" />
          </div>
        </div>

        {/* Total Collection */}
        <div className="border border-blue-200 rounded-lg p-4 flex flex-row justify-between items-center">
          <div>
            <p className="text-gray-500 font-robotoM text-sm">
              Total Collection
            </p>
            <p className="text-[#2563EB] font-robotoSb text-2xl">
              ₹{(summary.total).toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-[#DBEAFE] rounded-xl">
            <FaRegChartBar size={20} color="#2563EB" />
          </div>
        </div>

        {/* Top Collections */}
        <div className="border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Top Collections
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#374151]">
                <span className="w-3 h-3 rounded-full bg-[#3B82F6]"></span> This
                week
              </span>
              <span className="font-interM text-[#1F2937]">
                ₹{(summary.topCollections.week).toFixed(2)}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#374151]">
                <span className="w-3 h-3 rounded-full bg-[#22C55E]"></span> This
                month
              </span>
              <span className="font-interM text-[#1F2937]">
                ₹{(summary.topCollections.month).toFixed(2)}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#374151]">
                <span className="w-3 h-3 rounded-full bg-[#EAB308]"></span> This
                year
              </span>
              <span className="font-interM text-[#1F2937]">
                ₹{(summary.topCollections.year).toFixed(2)}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ✅ Search */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 mb-4 gap-4 hidden">
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

      {/* ✅ Full Width Table */}
      <div className="overflow-auto">
        <table className="w-full min-w-[600px] text-left bg-white rounded-md shadow border-separate border-spacing-y-2 text-nowrap overflow-hidden">
          <thead className="bg-gray-200 text-[#6B7280] text-xs font-robotoM">
            <tr>
              <th className="p-3">Customer Name</th>
              <th className="p-3">Mobile Number</th>
              <th className="p-3">Total Amount</th>
              <th className="p-3">Due Date</th>
              <th className="p-3">Promise Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              currentData.map((entry, index) => {
                const nextMilestone =
                  entry.milestones?.find((m) => m.status !== "Paid") || null;

                return (
                  <tr
                    key={index}
                    className="border-2 shadow-md rounded-xl font-robotoR text-[12px] sm:text-[14px] md:text-[16px] text-[#111827]"
                  >
                    <td className="p-3 whitespace-nowrap">
                      {entry.name || "-"}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {entry.phone || "-"}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      ₹{entry.total ?? entry.total ?? 0}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {nextMilestone?.dueDate
                        ? new Date(nextMilestone.dueDate).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {nextMilestone?.amount || "-"}
                    </td>
                    <td className="p-3 font-medium whitespace-nowrap">
                      {entry.paymentStatus || "Pending"}
                    </td>
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
                      <button
                        className="text-bluecol hover:text-blue-700"
                        onClick={() => handleView(entry._id)}
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages || 1}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default D8PaymentCollectionList;
