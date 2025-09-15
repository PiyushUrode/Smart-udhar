import React, { useState } from "react";
import { FaSearch, FaDownload, FaCheck } from "react-icons/fa";
import { MdUpdate } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { BsPersonCircle } from "react-icons/bs";
import { FaWallet } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { useLocation } from "react-router-dom";
import {Invoice} from "../../api/Invoice"; // ya jaha tumne Invoice.js rakha hai
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";


const D8PaymentCollection = () => {
const [showPopup, setShowPopup] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const location = useLocation();
  const { invoice: initialInvoice } = location.state || {};

const [invoiceData, setInvoiceData] = useState(initialInvoice);

const handleDownloadPDF = async () => {
  const input = document.getElementById("receiptDiv");
  if (!input) return;

  const canvas = await html2canvas(input, { scale: 2 }); // scale se quality better hogi
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`Receipt_${invoiceData?.invoiceDataId || "Invoice"}.pdf`);
};





  // ---------- helpers ----------
  const fmtINR = (n) => `₹${Number(n ?? 0).toLocaleString("en-IN")}`;
  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN") : "-");
 console.log("🔎 Invoice Data Received:", invoiceData);


  const milestones = invoiceData?.milestones || [];
  const nextMilestone =
    milestones.find(m => (m.status || "").toLowerCase() === "pending") ||
    milestones.find(m => (m.status || "").toLowerCase() !== "paid") ||
    null;

  const productsLabel = invoiceData?.products?.length
    ? invoiceData.products.map(p => `${p.name} x${p.qty}`).join(", ")
    : "-";

 // 🔹 milestone select karne ka handler
  const handleMarkAsPaid = (milestone) => {
    setSelectedMilestone(milestone);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedMilestone(null);
  };

  const totalPaid = milestones
  .filter(m => (m.status || "").toLowerCase() === "paid")
  .reduce((sum, m) => sum + (m.amount || 0), 0);

const totalAmount = milestones.reduce((sum, m) => sum + (m.amount || 0), 0);
const remainingAmount = totalAmount - totalPaid;

  // 🔹 "Generate Receipt" click
  const handleGenerateReceipt = async () => {
  if (!selectedMilestone) return;

  try {
    // 🔹 Milestones ki updated list banao
    const updatedMilestones = milestones.map(m =>
      m._id === selectedMilestone._id
        ? { ...m, status: "Paid" }
        : m
    );

const res = await Invoice.updateMilestones(invoiceData._id, updatedMilestones);

if (res.success) {
  const updatedInvoice = res.invoice;
  setInvoiceData(updatedInvoice); // ✅ yahi line lagani hai
  setShowPopup(false);
  alert(`Receipt generated for ${fmtINR(selectedMilestone.amount)}`);
}
 else {
      alert("❌ Failed to update milestone. Please try again.");
    }
  } catch (err) {
    console.error("Update milestone error:", err);
    alert("❌ Error updating milestone");
  }
};




  return (
    <section className="w-full min-h-screen bg-[#f9f9ff] mt-5 px-4 md:px-10 py-6">
      {/* Search & Actions */}
      <div className="flex flex-col hidden md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto flex-1">
          <input
            type="text"
            placeholder="Search by User ID, Name, or Mobile"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex gap-3">
          {/* <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
            <MdUpdate /> Update Milestone
          </button> */}
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow">
            <IoMdAddCircle /> Generate Receipt
          </button>
        </div>
      </div>

      {/* Customer Payment Details */}
      <div className="bg-white rounded-xl shadow-md pb-10 mb-6 border border-gray-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 mb-6 border-b border-gray-300">
          <h1>Custom Payment Details</h1>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-10">
          <div className="flex flex-col gap-4 ">
            <div className="flex flex-row items-start gap-4">
              <img
                src={invoiceData?.profilePic || "https://randomuser.me/api/portraits/men/75.jpg"}
                alt={invoiceData?.name}
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <h3 className="text-lg font-semibold">{invoiceData?.name || "-"}</h3>
                <p className="text-sm text-[#4B5563]">Customer ID: {invoiceData?.customerId || "-"}</p>
                <p className="text-sm text-[#4B5563]">Mobile: {invoiceData?.phone || "-"}</p>
              </div>
            </div>

            <div className="text-[#4B5563] font-robotoM leading-5 font-robotoR">
              <p className="text-sm mt-2 font-robotoR">
                <span className="font-robotoM">Product:</span> {productsLabel}
              </p>
              <p className="text-sm font-robotoR">
                <span className="font-robotoM"> Address: </span> 123 MG Road, Bangalore, Karnataka 560001
              </p>
              <p className="text-sm font-robotoR">
                <span className="font-robotoM">Payment Mode:</span> {invoiceData?.paymentMode || "-"}
              </p>
              <p className="text-sm font-medium font-robotoR">
                <span className="font-robotoM">Next Payment:</span> {fmtDate(nextMilestone?.dueDate)}
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2 mt-4 md:mt-0 ">
            <h4 className=" font-robotoM text-black mb-2">Payment Milestones</h4>
          <ul className="space-y-2">
        {milestones.map((m, idx) => {
          const status = (m.status || "").toLowerCase();
          const isPending = status === "pending";
          const isPaid = status === "paid";

          return (
            <li
              key={m._id || idx}
              className={`rounded p-5 flex justify-between items-center ${
                isPaid
                  ? "bg-[#F0FDF4] border border-green-400"
                  : "bg-[#FEFCE8] border border-yellow-400"
              }`}
            >
              <div className="flex flex-col">
                <span>{m.milestoneName}</span>
                <span className={isPaid ? "text-green-600" : "text-yellow-800"}>
                  Due: {fmtDate(m.dueDate)} • Amount: {fmtINR(m.amount)}
                </span>
              </div>

              {isPending ? (
                <button
                  onClick={() => handleMarkAsPaid(m)}
                  className="ml-3 px-3 py-1 text-sm bg-yellow-200 text-yellow-800 hover:bg-yellow-300 rounded flex items-center gap-1"
                >
                  <FaCheck /> View Milestone
                </button>
              ) : (
                <div className="px-3 py-3 rounded-xl h-fit bg-green-100">
                  <span className="font-medium text-green-700">Paid</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>

          </div>
        </div>
      </div>

      {/* Payment Details Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-300 p-6 mt-5 overflow-x-auto">
        <h4 className="text-base font-semibold text-gray-700 mb-5">Payment Details</h4>
        <table className="min-w-full table-auto text-sm text-left text-gray-600">
          <thead className="bg-gray-50 text-gray-400 font-semibold">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Milestone</th>
              <th className="px-4 py-3">Payment Mode</th>
              <th className="px-4 py-3">Next Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {milestones.map((m, idx) => {
              const status = (m.status || "").toLowerCase();
              const nextRow = milestones[idx + 1];
              return (
                <tr key={m._id || idx} className="border-t border-gray-200">
                  <td className="px-4 py-3">{fmtDate(m.dueDate)}</td>
                  <td className="px-4 py-3 font-bold">{fmtINR(m.amount)}</td>
                  <td className="px-4 py-3">{m.milestoneName || `Milestone ${idx + 1}`}</td>
                  <td className="px-4 py-3">{m.paymentMode || invoiceData?.paymentMode || "-"}</td>
                  <td className="px-4 py-3">{fmtDate(nextRow?.dueDate)}</td>
                  <td className="px-4 py-3">
                    {status === "pending" ? (
                      <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full">Pending</span>
                    ) : (
                      <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Paid</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {status === "pending" ? (
                      <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-all duration-200"  onClick={() => handleMarkAsPaid(m)}>
                        Mark as Paid
                      </button>
                    ) : (
                      <button className="text-xs bg-gray-200 text-gray-500 px-3 py-1 rounded-full cursor-default" disabled>
                        Paid
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Receipt Preview Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-300 p-6  mx-auto mt-5">
        <h4 className="text-base font-semibold text-gray-700 mb-5 border-b pb-2">Receipt Preview</h4>
      <div id="receiptDiv" className="bg-[#F9FAFB] border border-gray-300 rounded-md p-6 max-w-md mx-auto">
  <h5 className="text-center font-bold text-gray-800 text-lg">PAYMENT RECEIPT</h5>
  <p className="text-center text-sm text-[#4B5563] font-robotoM leading-5 mb-4">
    Receipt #: {invoiceData?.invoiceDataId || "—"}
  </p>

  <div className="space-y-2 text-sm text-gray-700">
    <div className="flex justify-between"><span className="font-medium">Date:</span><span>{fmtDate(invoiceData?.createdAt)}</span></div>
    <div className="flex justify-between"><span className="font-medium">Customer ID:</span><span>{invoiceData?.customerId || "—"}</span></div>
    <div className="flex justify-between"><span className="font-medium">Name:</span><span>{invoiceData?.name || "—"}</span></div>
    <div className="flex justify-between"><span className="font-medium">Product:</span><span>{productsLabel}</span></div>
    
    {/* Paid vs Remaining */}
    <div className="flex justify-between font-medium">
      <span>Total Paid:</span><span className="text-green-700">{fmtINR(totalPaid)}</span>
    </div>
    <div className="flex justify-between font-medium">
      <span>Remaining:</span><span className="text-yellow-800">{fmtINR(remainingAmount)}</span>
    </div>

    {/* Next Milestone */}
    <div className="flex justify-between">
      <span className="font-medium">Next Payment:</span>
      <span className="text-blue-600">{nextMilestone ? `${nextMilestone.milestoneName} - ${fmtINR(nextMilestone.amount)} on ${fmtDate(nextMilestone.dueDate)}` : "All Paid"}</span>
    </div>

    <div className="flex justify-between"><span className="font-medium">Payment Mode:</span><span>{invoiceData?.paymentMode || "—"}</span></div>
  </div>

  <div className="text-center mt-6">
    <button
      onClick={handleDownloadPDF}
      className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2 mx-auto"
    >
      <FaDownload className="text-white" />
      Download Receipt
    </button>
  </div>
</div>

      </div>

      {/* Popup Modal for Receipt Confirmation */}
       {showPopup && selectedMilestone && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-md border border-gray-300 w-[90%] max-w-md p-6 relative">
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-3 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <h4 className="text-base font-semibold text-gray-700 mb-5 border-b pb-2 text-center">
              Payment Collection
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Milestone</label>
                <input
                  type="text"
                  value={selectedMilestone.milestoneName}
                  readOnly
                  className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Amount to Pay</label>
                <input
                  type="text"
                  value={fmtINR(selectedMilestone.amount)}
                  readOnly
                  className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="confirmAmount"
                  className="h-5 w-5 border border-gray-300 rounded"
                />
                <label
                  htmlFor="confirmAmount"
                  className="text-sm text-blue-600"
                >
                  Please Confirm Your Amount
                </label>
              </div>
              <button
                onClick={handleGenerateReceipt}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded flex items-center justify-center gap-2"
              >
                <FaDownload /> Generate Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default D8PaymentCollection;

