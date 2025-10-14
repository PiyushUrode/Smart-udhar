import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { FiLoader, FiDownload } from "react-icons/fi";
import { fetchInvoiceById } from "../../api/invoiceViewController";
import { ProfileService } from "../../api/profileservice";
import { CustomerService } from "../../api/customerService";
import { AuthService } from "../../api/authservice";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
const getstoreProfileIdLS = () => {
  const getstoreProfileIdLS = AuthService.getstoreProfileIdLS();
  if (!getstoreProfileIdLS) throw new Error("Missing auth getstoreProfileIdLS");
  return getstoreProfileIdLS;
};

const D8_1ViewInvoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef(null);
  const token = localStorage.getItem("token");
  const [businessProfile, setBusinessProfile] = useState(null);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [totalQty, setTotalQty] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

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

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await ProfileService.getProfile(
          getstoreProfileIdLS()
        );
        if (profileData) {
          console.log("Fetched profile data:", profileData.data);
          setBusinessProfile(profileData.data);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };
    loadProfile();
  }, []);

  useEffect(() => {
    if (invoice?.products?.length > 0) {
      const qtySum = invoice.products.reduce(
        (acc, item) => acc + Number(item.qty || 0),
        0
      );
      const totalsum = invoice.products.reduce(
        (acc, item) => acc + Number(item.total || 0),
        0
      );
      setTotalPrice(totalsum);
      setTotalQty(qtySum);
    }
  }, [invoice]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const customerData = await CustomerService.getCustomerById(
          invoice?.customerId
        );
        if (customerData) {
          console.log("Fetched customer data:", customerData.customer);
          setCustomerProfile(customerData.customer);
        }
      } catch (error) {
        console.error("Error loading customer:", error);
      }
    };
    if (invoice?.customerId) {
      loadProfile();
    }
  }, [invoice?.customerId]);

  const formatDate = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "₹0.00";
    return `₹${Number(amount).toFixed(2)}`;
  };

  // 💾 Download Invoice as PDF
  const handleDownloadPDF = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      scrollY: -window.scrollY,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    pdf.save(`Invoice-${invoice.invoiceId || id}.pdf`);
  };

  function convertAmountToWords(amount) {
    if (isNaN(amount)) return "";

    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const numToWords = (num) => {
      if (num < 20) return ones[num];
      if (num < 100)
        return (
          tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "")
        );
      if (num < 1000)
        return (
          ones[Math.floor(num / 100)] +
          " Hundred" +
          (num % 100 ? " " + numToWords(num % 100) : "")
        );
      return "";
    };

    const number = Math.floor(amount);
    const paise = Math.round((amount - number) * 100);

    const crore = Math.floor(number / 10000000);
    const lakh = Math.floor((number % 10000000) / 100000);
    const thousand = Math.floor((number % 100000) / 1000);
    const hundred = Math.floor((number % 1000) / 100);
    const remainder = number % 100;

    let words = "";
    if (crore) words += numToWords(crore) + " Crore ";
    if (lakh) words += numToWords(lakh) + " Lakh ";
    if (thousand) words += numToWords(thousand) + " Thousand ";
    if (hundred) words += numToWords(hundred) + " Hundred ";
    if (remainder) words += numToWords(remainder) + " ";

    words = words.trim() + " Rupees";
    if (paise > 0) words += " and " + numToWords(paise) + " Paise";
    words += " Only";

    return words.replace(/\s+/g, " ");
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-[70vh] text-blue-600">
        <FiLoader className="animate-spin w-6 h-6 mr-2" />
        Loading Invoice...
      </div>
    );

  if (!invoice)
    return (
      <div className="text-center mt-10 text-gray-700 font-medium">
        Invoice not found 😔
      </div>
    );

  return (
    <div className="max-w-screen-xl mx-auto p-2 sm:p-4 overflow-x-auto">
      <div className="min-w-[900px] mx-auto">
        {/* Download Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-all"
          >
            <FiDownload className="text-lg" /> Download PDF
          </button>
        </div>

        {/* Invoice Content */}
        <div
          ref={invoiceRef}
          className="bg-white border border-gray-300 p-8 pt-6 shadow-xl rounded-lg text-gray-800"
        >
          <div className="border-b-2 border-gray-400 pb-4 mb-6">
            <h1 className="text-center text-[40px]">Invoice</h1>
          </div>
          {/* ---------- Header ---------- */}
          <div className="flex flex-row justify-between items-start border-b-2 border-gray-400 pb-4 mb-6">
            <div className="text-left mb-0 max-w-[50%]">
              <h3 className="font-bold text-base  pb-2 uppercase text-gray-700">
                <span className="">Bill From</span>
              </h3>
              <div className="word-break leading-relaxed  text-sm">
                {businessProfile?.businessName && (
                  <p className="font-bold text-lg">
                    {businessProfile.businessName}
                  </p>
                )}

                {businessProfile?.address && (
                  <p>
                    <strong>Address:</strong> {businessProfile.address}
                  </p>
                )}

                {/* {businessProfile?.city}, {businessProfile?.state} - {businessProfile?.zipCode} */}

                {businessProfile?.mobile && (
                  <p>
                    <strong>Mobile:</strong> {businessProfile.mobile}
                  </p>
                )}

                {businessProfile?.email && (
                  <p>
                    <strong>Email:</strong> {businessProfile.email}
                  </p>
                )}

                {businessProfile?.gstNumber && (
                  <p>
                    <strong>GSTIN:</strong> {businessProfile.gstNumber}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right text-sm">
              <p className="mb-1">
                <strong>Invoice ID:</strong>{" "}
                <span className="text-blue-600 font-bold">
                  {invoice.invoiceId}
                </span>
              </p>
              <p className="mb-1">
                <strong>Invoice Date:</strong>{" "}
                {invoice.InvoiceCreatedDate || formatDate(invoice.createdAt)}
              </p>
              <p className="mb-1">
                <strong>Status:</strong>{" "}
                <span
                  className={`font-bold ${
                    invoice.paymentStatus === "Paid"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {invoice.paymentStatus}
                </span>
              </p>
            </div>
          </div>

          {/* ---------- Customer & Payment Info ---------- */}
          <div className="grid grid-cols-3 gap-6 text-sm mb-8 pb-4 border-b border-gray-300">
            <div className="col-span-2">
              <h3 className="font-bold text-base pb-2 uppercase text-gray-700">
                <span className="">Bill To</span>
              </h3>
              <p className="font-bold text-lg text-gray-800">
                {customerProfile?.name && (
                  <>
                    {customerProfile.name}
                    <br />
                  </>
                )}
              </p>
              <p>
                {customerProfile?.companyName && (
                  <>
                    {customerProfile.companyName}
                    <br />
                  </>
                )}
              </p>
              <p>
                {customerProfile?.address && (
                  <>
                    <strong>Address</strong>: {customerProfile.address}
                    <br />
                  </>
                )}
              </p>
              <p>
                {customerProfile?.mobile && (
                  <>
                    <strong>Phone</strong>: {customerProfile.mobile}
                    <br />
                  </>
                )}
              </p>

              <p>
                {customerProfile?.gstNumber && (
                  <>
                    <strong>GSTIN</strong>: {customerProfile.gstNumber}
                    <br />
                  </>
                )}
              </p>
            </div>
            <div className="text-right">
              <h3 className="font-bold text-base mb-2 uppercase text-gray-700 pb-1">
                <span className=""> Payment Details</span>
              </h3>
              <p>
                <strong>Mode:</strong>{" "}
                <span className="capitalize">{invoice.paymentMode}</span>
              </p>
              {invoice.paymentMethod && (
                <p>
                  <strong>Method:</strong>{" "}
                  <span className="capitalize"> {invoice.paymentMethod}</span>
                </p>
              )}
              {/* <p>
                <strong>Current Balance:</strong>{" "}
                {formatCurrency(invoice.balance)}
              </p> */}
            </div>
          </div>

          {/* ---------- Products Table ---------- */}
          <div className="mb-8 overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-700 mb-3">
              Itemized Charges
            </h3>
            <table className="w-full border-collapse min-w-[600px]">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr className="text-left text-xs font-semibold uppercase text-gray-600">
                  <th className="p-3">#</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-center">Unit</th>
                  <th className="p-3 text-right">Price/Unit</th>
                  {invoice.productType === "taxable" && (
                    <th className="p-3 text-right">Tax</th>
                  )}
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.products.map((item, index) => (
                  <tr
                    key={item._id}
                    className="text-gray-700 even:bg-white odd:bg-gray-50 text-sm"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3 text-center">{item.qty}</td>
                    <td className="p-3 text-center">{item.unit}</td>
                    <td className="p-3 text-right">
                      {formatCurrency(item.price)}
                    </td>
                    {invoice.productType === "taxable" && (
                      <td className="p-3 text-right">{item.tax}%</td>
                    )}
                    <td className="p-3 text-right font-medium">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}

                <tr className="text-sm border-b-2 font-medium">
                  <td className="p-3"></td>
                  <td className="p-3 font-medium">Total</td>
                  <td className="p-3 text-center">{totalQty}</td>
                  <td className="p-3"></td>
                  <td className="p-3"></td>
                  {invoice.productType === "taxable" && (
                    <td className="p-3"></td>
                  )}
                  <td className="p-3 text-right font-medium">
                    {formatCurrency(totalPrice)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ---------- Summary & Notes ---------- */}
          <div className="flex flex-row justify-between pt-4 border-t-[3px] border-gray-400">
            <div className="w-1/2 text-sm">
              {/* ---------- Milestones ---------- */}
              {invoice.paymentMode === "debt" &&
                invoice.milestones?.length > 0 && (
                  <div className="mb-8 overflow-x-auto">
                    <h3 className="text-lg font-bold text-gray-700 mb-3">
                      Payment Schedule / Milestones
                    </h3>
                    <table className="w-full border-collapse min-w-[500px]">
                      <thead className="bg-blue-50 border-b border-blue-200">
                        <tr className="text-left text-xs font-semibold uppercase text-gray-600">
                          <th className="p-3">Milestone</th>
                          <th className="p-3 text-right">Amount Due</th>
                          <th className="p-3 text-center">Due Date</th>
                          <th className="p-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.milestones.map((m) => (
                          <tr
                            key={m._id}
                            className="text-gray-700 text-sm even:bg-white odd:bg-gray-50"
                          >
                            <td className="p-3">{m.milestoneName}</td>
                            <td className="p-3 text-right">
                              {formatCurrency(m.amount)}
                            </td>
                            <td className="p-3 text-center">
                              {new Date(m.dueDate).toLocaleDateString()}
                            </td>
                            <td
                              className={`p-3 text-center font-bold ${
                                m.status === "Paid"
                                  ? "text-green-600"
                                  : "text-yellow-600"
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
              <h3 className="font-bold text-base mb-1 text-gray-700">Notes:</h3>
              <p className="text-gray-600 italic border p-2 bg-gray-50 rounded min-h-[50px]">
                {invoice.note || "No additional notes provided."}
              </p>
            </div>
            <div className="w-1/3 mt-0">
              <div className="space-y-1 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">
                    {formatCurrency(invoice.subtotal)}
                  </span>
                </div>
                {invoice.productType === "taxable" && (
                  <>
                    <div className="flex justify-between">
                      <span>CGST:</span>
                      <span className="font-medium">
                        {formatCurrency(invoice.tax / 2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>SGST:</span>
                      <span className="font-medium">
                        {formatCurrency(invoice.tax / 2)}
                      </span>
                    </div>
                  </>
                )}
                {invoice.deliveryFee ? (
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span className="font-medium">
                      {formatCurrency(invoice.deliveryFee)}
                    </span>
                  </div>
                ) : (
                  ""
                )}

                {invoice.packingCharges ? (
                  <div className="flex justify-between">
                    <span>Packing Charges:</span>
                    <span className="font-medium">
                      {formatCurrency(invoice.packingCharges)}
                    </span>
                  </div>
                ) : (
                  ""
                )}
                {invoice.discount ? (
                  <div className="flex justify-between border-b pb-2">
                    <span>Discount:</span>
                    <span className="font-medium text-red-600">
                      -{formatCurrency(invoice.discount)}
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-400 bg-blue-50 p-2 rounded">
                <span className="text-xl font-bold text-blue-800">
                  TOTAL DUE:
                </span>
                <span className="text-xl font-bold text-blue-800">
                  {formatCurrency(invoice.total)}
                </span>
              </div>
              <div className="mt-0">
                <span>
                  <br />
                  {convertAmountToWords(invoice.total)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 mt-6">
            Generated By SmartUdhar - Computer Generated Invoice.
          </div>
        </div>
      </div>
    </div>
  );
};

export default D8_1ViewInvoice;
