import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { FiLoader, FiDownload } from "react-icons/fi"; // Added FiDownload for the button
import { fetchInvoiceById } from "../../api/invoiceViewController";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// ----------------------------------------------------------------------
// 💡 Optimized CSS for PDF Output
// ----------------------------------------------------------------------
const D8_1ViewInvoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef(null); // 👈 for capturing the invoice section
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const data = await fetchInvoiceById(id, token);
        setInvoice(data);
      } catch (error) {
        console.error("Error loading invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [id, token]);

  const formatDate = (date) => {
    // Ensuring it handles date strings/objects correctly
    const d = date instanceof Date ? date : new Date(date);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  // 💰 Utility for currency formatting
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "₹0.00";
    return `₹${Number(amount).toFixed(2)}`;
  };

  // 🧾 PDF Download Function (Kept your existing logic for multi-page handling)
  const handleDownloadPDF = async () => {
    const element = invoiceRef.current;
    if (!element) return;

    // Temporary padding (crucial for preventing bottom cutoff)
    element.style.paddingBottom = "50px"; 

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      scrollY: 0,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 10;
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;

    while (heightLeft > 0) {
      // Adjust position for the next page to continue from where the last one cut off
      position = -(imgHeight - (pageHeight - margin * 2) * (Math.floor(imgHeight / (pageHeight - margin * 2)) + 1 - (heightLeft / (pageHeight - margin * 2))));
      pdf.addPage();
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;
    }

    pdf.save(`Invoice_${invoice.invoiceId || id}.pdf`);

    // Remove the temporary padding after saving
    element.style.paddingBottom = "0px";
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[70vh] text-blue-600">
        <FiLoader className="animate-spin w-6 h-6 mr-2" />
        Loading Invoice...
      </div>
    );

  if (!invoice)
    return <div className="text-center mt-10 text-gray-700 font-medium">Invoice not found 😔</div>;

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* ---------- Download Button (Outside of PDF Capture) ---------- */}
      <div className="flex justify-end mb-6 sticky top-4 z-10">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center bg-blue-600 text-white px-5 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all text-sm font-medium"
        >
          <FiDownload className="w-4 h-4 mr-2" />
          Download Invoice
        </button>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* ---------- Invoice Content (The section to be captured) ---------- */}
      {/* ---------------------------------------------------------------------- */}
      <div ref={invoiceRef} className="bg-white border border-gray-300 p-8 pt-6 shadow-xl rounded-lg text-gray-800">
        
        {/* ---------- Header / Title & Invoice Details ---------- */}
        <div className="flex justify-between items-start border-b-2 border-gray-400 pb-4 mb-6">
          <div className="text-left">
            <h1 className="text-3xl font-bold uppercase text-blue-800 tracking-wider">
              INVOICE
            </h1>
            {/* You can add your company logo/name here */}
            {/* <p className="text-sm mt-1 text-gray-500">Your Company Name / Address</p> */}
          </div>
          <div className="text-right text-sm">
            <p className="mb-1">
              <strong className="font-semibold text-gray-700">Invoice ID:</strong>{" "}
              <span className="text-blue-600 font-bold">{invoice.invoiceId}</span>
            </p>
            <p className="mb-1">
              <strong className="font-semibold text-gray-700">Invoice Date:</strong>{" "}
              {invoice.InvoiceCreatedDate || formatDate(invoice.createdAt)}
            </p>
            <p className="mb-1">
              <strong className="font-semibold text-gray-700">Status:</strong>{" "}
              <span className={`font-bold ${invoice.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                  {invoice.paymentStatus}
              </span>
            </p>
          </div>
        </div>

        {/* ---------- Customer and Payment Info ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-8 pb-4 border-b border-gray-300">
            {/* Billed To */}
            <div className="md:col-span-2">
                <h3 className="font-bold text-base mb-2 uppercase text-gray-700 border-b border-blue-200 pb-1">Billed To</h3>
                <p className="font-bold text-lg text-gray-800">{invoice.name}</p>
                <p>Phone: {invoice.phone}</p>
                <p>Credit Score: {invoice.creditScore}</p>
            </div>
            {/* Payment Details */}
            <div className="text-right">
                <h3 className="font-bold text-base mb-2 uppercase text-gray-700 border-b border-blue-200 pb-1">Payment Details</h3>
                <p><strong>Mode:</strong> {invoice.paymentMode}</p>
                {invoice.paymentMethod && <p><strong>Method:</strong> {invoice.paymentMethod}</p>}
                <p><strong>Current Balance:</strong> {formatCurrency(invoice.balance)}</p>
            </div>
        </div>

        {/* ---------- Products Table ---------- */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-700 mb-3">Itemized Charges</h3>
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr className="text-left text-xs font-semibold uppercase text-gray-600">
                <th className="p-3 border-b border-gray-300 w-10">#</th>
                <th className="p-3 border-b border-gray-300">Description</th>
                <th className="p-3 border-b border-gray-300 text-center w-20">Qty</th>
                <th className="p-3 border-b border-gray-300 text-center w-20">Unit</th>
                <th className="p-3 border-b border-gray-300 text-right w-24">Price</th>
                {invoice.productType === "taxable" && (
                  <th className="p-3 border-b border-gray-300 text-right w-16">Tax</th>
                )}
                <th className="p-3 border-b border-gray-300 text-right w-32">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.products.map((item, index) => (
                <tr key={item._id} className="text-gray-700 even:bg-white odd:bg-gray-50 text-sm">
                  <td className="p-3 border-b border-gray-200">{index + 1}</td>
                  <td className="p-3 border-b border-gray-200">{item.name}</td>
                  <td className="p-3 border-b border-gray-200 text-center">{item.qty}</td>
                  <td className="p-3 border-b border-gray-200 text-center">{item.unit}</td>
                  <td className="p-3 border-b border-gray-200 text-right">{formatCurrency(item.price)}</td>
                  {invoice.productType === "taxable" && (
                    <td className="p-3 border-b border-gray-200 text-right">{item.tax}%</td>
                  )}
                  <td className="p-3 border-b border-gray-200 text-right font-medium">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ---------- Milestones Table (for debt mode) ---------- */}
        {invoice.paymentMode === "debt" && invoice.milestones?.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-700 mb-3">Payment Schedule / Milestones</h3>
            <table className="w-full border-collapse">
              <thead className="bg-blue-50 border-b border-blue-200">
                <tr className="text-left text-xs font-semibold uppercase text-gray-600">
                  <th className="p-3 border-b border-blue-200 w-1/3">Milestone</th>
                  <th className="p-3 border-b border-blue-200 text-right">Amount Due</th>
                  <th className="p-3 border-b border-blue-200 text-center">Due Date</th>
                  <th className="p-3 border-b border-blue-200 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoice.milestones.map((m) => (
                  <tr key={m._id} className="text-gray-700 text-sm even:bg-white odd:bg-gray-50">
                    <td className="p-3 border-b border-gray-200">{m.milestoneName}</td>
                    <td className="p-3 border-b border-gray-200 text-right">{formatCurrency(m.amount)}</td>
                    <td className="p-3 border-b border-gray-200 text-center">
                      {new Date(m.dueDate).toLocaleDateString()}
                    </td>
                    <td
                      className={`p-3 border-b border-gray-200 text-center font-bold ${
                        m.status === "Paid" ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {m.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ---------- Summary & Notes ---------- */}
        <div className="flex flex-col sm:flex-row justify-between pt-4 border-t-2 border-gray-400">
          
          {/* Notes Section */}
          <div className="sm:w-1/2 text-sm">
            <h3 className="font-bold text-base mb-1 text-gray-700">Notes:</h3>
            <p className="text-gray-600 italic border p-2 bg-gray-50 rounded min-h-[50px]">
              {invoice.note || "No additional notes provided."}
            </p>
          </div>
          
          {/* Summary Totals */}
          <div className="sm:w-1/3 mt-6 sm:mt-0">
            <div className="space-y-1 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              
              {invoice.productType === "taxable" && (
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="font-medium">{formatCurrency(invoice.tax)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Discount:</span>
                <span className="font-medium text-red-600">-{formatCurrency(invoice.discount)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span className="font-medium">{formatCurrency(invoice.deliveryFee)}</span>
              </div>
              
              <div className="flex justify-between border-b pb-2">
                <span>Packing Charges:</span>
                <span className="font-medium">{formatCurrency(invoice.packingCharges)}</span>
              </div>
            </div>

            {/* GRAND TOTAL */}
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-400 bg-blue-50 p-2 rounded">
              <span className="text-xl font-bold text-blue-800">TOTAL DUE:</span>
              <span className="text-xl font-bold text-blue-800">
                {formatCurrency(invoice.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default D8_1ViewInvoice;