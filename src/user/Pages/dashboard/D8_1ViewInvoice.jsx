import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import { fetchInvoiceById } from "../../api/invoiceViewController";

const D8_1ViewInvoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (loading)
    return (
      <div className="flex items-center justify-center h-[70vh] text-bluecol">
        <FiLoader className="animate-spin w-6 h-6 mr-2" />
        Loading Invoice...
      </div>
    );

  if (!invoice) return <div className="text-center mt-10">Invoice not found</div>;
 const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
      {/* ---------- Header ---------- */}
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Invoice Details</h2>
        <span className="text-sm text-gray-500">
          Date: {invoice.InvoiceCreatedDate ||  formatDate(new Date(invoice.createdAt))}
        </span>
      </div>

      {/* ---------- Customer Info ---------- */}
      <div className="mb-6">
        <b className="text-lg">Invoice Id : {invoice.invoiceId} </b> 
        <h3 className="text-lg font-medium text-gray-700 mb-2 mt-4">
          Customer Details
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1 text-gray-600">
          <p><strong>Name:</strong> {invoice.name}</p>
          <p><strong>Phone:</strong> {invoice.phone}</p>
          <p><strong>Balance:</strong> ₹{invoice.balance}</p>
          <p><strong>Credit Score:</strong> {invoice.creditScore}</p>
          <p><strong>Payment Mode:</strong> {invoice.paymentMode}</p>
          {invoice.paymentMethod && (
            <p><strong>Payment Method:</strong> {invoice.paymentMethod}</p>
          )}
        </div>
      </div>

      {/* ---------- Products ---------- */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Products</h3>
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Unit</th>
              <th className="p-2 border">Price</th>
              {invoice.productType === "taxable" && (
                <th className="p-2 border">Tax</th>
              )}
              <th className="p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.products.map((item, index) => (
              <tr key={item._id} className="text-gray-700">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.qty}</td>
                <td className="p-2 border">{item.unit}</td>
                <td className="p-2 border">₹{item.price}</td>
                {invoice.productType === "taxable" && (
                  <td className="p-2 border">{item.tax}%</td>
                )}
                <td className="p-2 border font-medium">₹{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- Milestones ---------- */}
      {invoice.paymentMode === "debt" && invoice.milestones?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Milestones</h3>
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-2 border">Milestone</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Due Date</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoice.milestones.map((m) => (
                <tr key={m._id} className="text-gray-700">
                  <td className="p-2 border">{m.milestoneName}</td>
                  <td className="p-2 border">₹{m.amount}</td>
                  <td className="p-2 border">
                    {new Date(m.dueDate).toLocaleDateString()}
                  </td>
                  <td
                    className={`p-2 border font-medium ${
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

      {/* ---------- Summary ---------- */}
      <div className="border-t pt-3">
        <div className="flex flex-col sm:flex-row justify-between text-gray-700">
          <div>
            <p><strong>Note:</strong> {invoice.note}</p>
          </div>
          <div className="text-right mt-3 sm:mt-0">
            <p>Subtotal: ₹{invoice.subtotal}</p>
            {invoice.productType === "taxable" && (
              <p>Tax: ₹{invoice.tax}</p>
            )}
            <p>Discount: ₹{invoice.discount}</p>
            <p>Delivery Fee: ₹{invoice.deliveryFee}</p>
            <p>Packing Charges: ₹{invoice.packingCharges}</p>
            <p className="font-semibold text-lg mt-2">
              Total: ₹{invoice.total}
            </p>
            <p className="text-sm text-gray-500">
              Payment Status: {invoice.paymentStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default D8_1ViewInvoice;
