import { useState, useEffect } from "react";
import { FaCommentSms } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { FaPrint } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa6";
import { FaClock } from "react-icons/fa6";
import { GiCash } from "react-icons/gi";
import { FaCalculator } from "react-icons/fa";
import { LuNewspaper } from "react-icons/lu";
import { FaEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaBox } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
import { Invoice  } from "../../api/Invoice.js"


export default function D7CreateInvoice({ onCustomerSelect  }) {
// ----------------- STATES -----------------
const [customers, setCustomers] = useState([]);
const [loading, setLoading] = useState(true);
const [searchTerm, setSearchTerm] = useState("");
const [selectedCustomer, setSelectedCustomer] = useState(null);
const [searchTriggered, setSearchTriggered] = useState(false);


// Payment
const [showStep3, setShowStep3] = useState(false);
const [showStep4, setShowStep4] = useState(false);
const [paymentMode, setPaymentMode] = useState("");
const [paymentMethod, setPaymentMethod] = useState("");
const [transactionId, setTransactionId] = useState("");
const [milestones, setMilestones] = useState([
  { id: Date.now(), name: "Advance", amount: "", dueDate: "", status: "" },
]);

// Additional Charges
const [additionalCharges, setAdditionalCharges] = useState({
  deliveryFee: 0,
  packingCharges: 0,
  discount: 0,
  other: 0,
});

// Notes
const [note, setNote] = useState("");

// ----------------- FETCH CUSTOMERS -----------------
useEffect(() => {
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { success, customers } = await Invoice.fetchCustomersForInvoice();
      if (success && Array.isArray(customers)) {
        setCustomers(customers);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      console.error("❌ Error fetching customers:", err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };
  fetchCustomers();
}, []);

const filteredCustomers = searchTerm
  ? customers.filter((cust) => {
      const name = cust?.name?.toLowerCase() || "";
      const mobile = cust?.mobile?.toLowerCase() || "";
      return (
        name.includes(searchTerm.toLowerCase()) ||
        mobile.includes(searchTerm.toLowerCase())
      );
    })
  : [];

const handleSelectCustomer = (cust) => {
  setSelectedCustomer(cust);
  setSearchTerm("");
  setSearchTriggered(false);
  if (onCustomerSelect) onCustomerSelect(cust);
};

// ----------------- FETCH PRODUCTS -----------------

// Products
const [products, setProducts] = useState([]);
const [rows, setRows] = useState([
  { id: Date.now(), productId: "", qty: 1, unit: "", price: "", tax: "" },
]);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await Invoice.getProducts();
      const productList =
        res?.products || res?.data?.products || res?.data || [];
      setProducts(productList);
    } catch (err) {
      console.error("❌ Failed to fetch products", err);
      setProducts([]);
    }
  };
  fetchProducts();
}, []);

// ----------------- PRODUCT LOGIC -----------------
const handleSelectProduct = (rowId, product) => {
  setRows((prev) =>
    prev.map((row) =>
      row.id === rowId
        ? {
            ...row,
            productId: product._id || product.id,
            price: product.price || 0,
            unit: product.unit || "pcs",
            search: product.name || product.product_name || "Unnamed",
            showDropdown: false,
          }
        : row
    )
  );
};

const toggleDropdown = (id, value) => {
  setRows((prev) =>
    prev.map((row) =>
      row.id === id ? { ...row, search: value, showDropdown: true } : row
    )
  );
};

const handleAddRow = () => {
  setRows([
    ...rows,
    {
      id: Date.now() + Math.random(),
      productId: "",
      qty: 1,
      unit: "",
      price: 0,
      tax: 18,
    },
  ]);
};

const handleRemoveRow = (id) => {
  setRows(rows.filter((row) => row.id !== id));
};

const handleChange = (id, field, value) => {
  setRows((prev) =>
    prev.map((row) =>
      row.id === id
        ? {
            ...row,
            [field]:
              field === "qty" || field === "price" ? Number(value) : value,
          }
        : row
    )
  );
};

const calculateTotal = (row) => {
  const subtotal = row.qty * row.price;
  const taxAmount = (subtotal * row.tax) / 100;
  return subtotal + taxAmount;
};

// ----------------- PAYMENT LOGIC -----------------
const handlePaymentMode = (mode) => {
  setPaymentMode(mode);
  if (mode === "cash") {
    setShowStep3(true);
    setShowStep4(false);
  } else if (mode === "debt") {
    setShowStep4(true);
    setShowStep3(false);
  }
};

const handleAddMilestone = () => {
  setMilestones([
    ...milestones,
    { id: Date.now(), name: "", amount: "", dueDate: "", status: "" },
  ]);
};

const handleMilestoneChange = (id, field, value) => {
  setMilestones((prev) =>
    prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
  );
};

// ----------------- ADDITIONAL CHARGES -----------------
const handleAdditionalChange = (field, value) => {
  setAdditionalCharges((prev) => ({
    ...prev,
    [field]: Number(value) || 0,
  }));
};

const handleSubmit = async () => {
  if (!selectedCustomer?._id) {
    alert("Please select a customer!");
    return;
  }
  if (!paymentMode) {
    alert("Please select a payment mode!");
    return;
  }

  const subtotal = rows.reduce((sum, p) => sum + p.qty * p.price, 0);
  const totalTax = rows.reduce((sum, p) => sum + ((p.qty * p.price * (p.tax || 0)) / 100), 0);
  const total = subtotal + totalTax
    + (Number(additionalCharges.deliveryFee) || 0)
    + (Number(additionalCharges.packingCharges) || 0)
    - (Number(additionalCharges.discount) || 0)
    + (Number(additionalCharges.other) || 0);

const payload = {
  customerId: selectedCustomer._id,
  name: selectedCustomer.name,
  mobile: selectedCustomer.mobile ,
  address: selectedCustomer.address ,

  balance: selectedCustomer.balance ,
  creditScore: selectedCustomer.creditScore ,

  paymentMode,
  paymentMethod,
  transactionId,

  // charges
  deliveryFee: Number(additionalCharges.deliveryFee) || 0,
  packingCharges: Number(additionalCharges.packingCharges) || 0,
  discount: Number(additionalCharges.discount) || 0,
  other: Number(additionalCharges.other) || 0,

  note,

  subtotal,
  tax: totalTax,
  total,
  totalReceived: 0,
  dueBalance: total,
  paymentStatus: "Unpaid",

  // products array
  products: rows.map((p) => ({
    productId: p.productId,
    name: p.search,
    qty: Number(p.qty),
    unit: p.unit,
    price: Number(p.price),
    tax: Number(p.tax),
    total: calculateTotal(p),
  })),

  // ✅ milestones only if debt
  ...(paymentMode === "debt"
    ? {
        milestones: milestones.map((m) => ({
          milestoneName: m.name,
          amount: Number(m.amount) || 0,
          paymentMode: m.paymentMode || paymentMode,
          dueDate: m.dueDate ? new Date(m.dueDate).toISOString() : null,
          status: m.status || "Pending",
        })),
      }
    : {}),
};





  console.log("🚀 Final Invoice Payload:", JSON.stringify(payload, null, 2));

  try {
    const res = await Invoice.createInvoice(payload);
    if (res.success) {
      alert("✅ Invoice saved successfully!");
    } else {
      alert("❌ Failed: " + res.message);
    }
  } catch (err) {
    console.error("❌ Error:", err);
    alert("Error while saving invoice");
  }
};

const previousInvoices = [ { name: "Anamika Traders", lastPaid: "16/06/2025", due: "10/06/2025" }, { name: "Anamika Traders", lastPaid: "16/06/2025", due: "16/06/2025" }, { name: "Anamika Traders", lastPaid: "16/06/2025", due: "10/06/2025" }, { name: "Anamika Traders", lastPaid: "16/06/2025", due: "16/06/2025" }, { name: "Anamika Traders", lastPaid: "16/06/2025", due: "10/06/2025" }, { name: "Anamika Traders", lastPaid: "16/06/2025", due: "16/06/2025" }, ];


  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-6 mt-5 md:mt-10   grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-robotoB text-[#1F2937] mb-4">Create New Invoice</h1>

        {/* Steps 1 to 6 (same as before) */}
        <div className="space-y-6">
          {/* Step 1: Select Customer */}
          <div className="bg-white shadow-customCard rounded-lg p-5">
            <h2 className="flex items-center gap-2 text-lg font-robotoSb mb-4">
              <div className="bg-[#2563EB] p-2.5 rounded-full">
                <FaSearch color="white" size={14} />
              </div>
              Step 1: Select Customer
            </h2>

            {/* Search Input & Button */}
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Search Customer
            </label>
            <div className="w-full md:w-3/4 flex flex-col sm:flex-row items-center gap-4 mb-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search by name or mobile number"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSearchTriggered(true);
                  }}
                  className="w-full h-10 border border-gray-300 pl-4 pr-10 py-2 rounded text-sm font-robotoR bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <IoIosSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-60" />
              </div>
              <button className="bg-green-600 font-robotoR hover:bg-green-700 text-white px-5 py-3 rounded-lg text-md whitespace-nowrap">
                + Add New Customer
              </button>
            </div>

            {/* Customers List (Search Results) */}
            {loading ? (
              <p className="text-gray-500 text-sm">Loading customers...</p>
            ) : searchTriggered && filteredCustomers.length === 0 ? (
              <p className="text-red-500 text-sm">No customer found.</p>
            ) : (
              searchTerm && (
                <ul className="border bg-white rounded mt-2 shadow max-h-40 overflow-y-auto">
                  {filteredCustomers.map((cust) => (
                    <li
                      key={cust._id}
                      onClick={() => handleSelectCustomer(cust)}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                    >
                      {cust.name} ({cust.mobile})
                    </li>
                  ))}
                </ul>
              )
            )}

            {/* Selected Customer Details */}
            {selectedCustomer && (
              <div className="text-sm text-gray-700 bg-white p-3 rounded mt-3">
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <p className="font-robotoR">
                    <strong className="text-black font-robotoM">Name:</strong>{" "}
                    {selectedCustomer.name}
                  </p>
                  <p className="font-robotoR">
                    <strong className="text-black font-robotoM">ID:</strong>{" "}
                    {selectedCustomer._id}
                  </p>
                  <p className="font-robotoR">
                    <strong className="text-black font-robotoM">mobile:</strong>{" "}
                    {selectedCustomer.mobile}
                  </p>
                  <p className="font-robotoR">
                    <strong className="text-black font-robotoM">Balance:</strong>{" "}
                    ₹{selectedCustomer.balance || 0}
                  </p>
                  <p className="font-robotoR">
                    <strong className="text-black font-robotoM">Credit Score:</strong>{" "}
                    {selectedCustomer.creditScore || "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>


          {/* Step 2: Add Products/Services */}
          <div className="max-w-7xl mx-auto  my-5 md:mt-10 bg-white  gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Step 2: Add Products */}
              

          {/* Step 2: Add Products */}

<div className="bg-white rounded-lg font-robotoB shadow-customCard p-4 sm:p-6 w-full max-w-6xl space-y-4">
  <h2 className="flex items-center gap-3 text-base sm:text-lg font-robotoSb text-gray-800">
    <div className="bg-[#2563EB] p-2 sm:p-3 rounded-full flex items-center justify-center">
      <FaBox color="white" size={16} />
    </div>
    Step 2: Add Products/Services
  </h2>

  <div className="w-full overflow-x-auto">
    <div className="min-w-[700px] flex flex-col space-y-5 px-2">
      {/* Header */}
      <div className="grid grid-cols-7 gap-2 sm:gap-4 text-sm font-semibold text-gray-700 border-b py-3">
        <div className="col-span-2 text-black">Product/Service</div>
        <div className="text-black">Qty</div>
        <div className="text-black">Unit</div>
        <div className="text-black">Price</div>
        <div className="text-black">Tax</div>
        <div className="text-black">Total</div>
      </div>

      {/* Rows */}
      {rows.map((row) => (
        <div
          key={row.id}
          className="grid grid-cols-7 gap-2 sm:gap-4 items-center py-3 h-full text-sm px-2"
        >
          {/* Product dropdown */}
         <div className="col-span-2">
  <select
    value={row.productId}
    onChange={(e) => {
      const selectedProduct = products.find(
        (p) => p._id === e.target.value || p.id === e.target.value
      );
      if (selectedProduct) {
        handleSelectProduct(row.id, selectedProduct);
      }
    }}
    className="border px-1 py-2 rounded w-full bg-white text-sm"
  >
    <option value=""> Select Product --</option>
    {products.map((p) => (
      <option key={p._id || p.id} value={p._id || p.id}>
        {p.name || p.product_name || "Unnamed"}
      </option>
    ))}
  </select>
</div>

          {/* Qty */}
          <input
            type="number"
            min="1"
            value={row.qty}
            onChange={(e) => handleChange(row.id, "qty", e.target.value)}
            className="border px-2 py-1 rounded bg-white"
          />

          {/* Unit */}
          <input
            placeholder="Unit"
            value={row.unit}
            onChange={(e) => handleChange(row.id, "unit", e.target.value)}
            className="border px-2 py-1 rounded bg-white"
          />

          {/* Price */}
          <input
            type="number"
            placeholder="0.00"
            value={row.price}
            onChange={(e) => handleChange(row.id, "price", e.target.value)}
            className="border px-2 py-1 rounded bg-white"
          />

          {/* Tax fixed */}
          <input
            type="text"
            value={`${row.tax}%`}
            readOnly
            className="border px-2 py-1 rounded bg-white"
          />

          {/* Total */}
          <div className="flex items-center gap-2">
            ₹{calculateTotal(row).toFixed(2)}
            <button
              onClick={() => handleRemoveRow(row.id)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Add Row button */}
  <button
    onClick={handleAddRow}
    className="text-bluecol font-robotoM text-sm sm:text-md mt-2"
  >
    + Add Row
  </button>
</div>







              {/* Step 3: Payment Mode */}
    <div className="bg-white rounded-lg shadow-customCard p-4">
        <h2 className="flex items-center gap-2 text-lg font-robotoSb mb-6">
          <div className=" bg-[#2563EB] p-2.5 rounded-full">
            <FaRegCreditCard color="white" size={14} />
          </div>
          Step 3: Payment Mode
        </h2>
        <div className="flex flex-col sm:flex-row space-x-3">
          <button
            onClick={() => handlePaymentMode("cash")}
            className="flex justify-center items-center gap-2 border border-bluecol hover:bg-bluecol hover:text-white text-bluecol ml-3 my-1 px-4 py-1 rounded font-robotoM text-md"
          >
            <GiCash size={18} /> Cash
          </button>
          <button
            onClick={() => handlePaymentMode("debt")}
            className="flex justify-center items-center gap-2 border border-bluecol hover:bg-bluecol hover:text-white text-bluecol my-1 px-4 py-1 rounded font-robotoM text-md"
          >
            <FaCalculator size={18} /> Debt
          </button>
        </div>
      </div>

      {/* Step 4: Payment Method (if Cash) */}
      {showStep3 && (
        <div className="bg-white rounded-lg shadow-customCard p-4">
          <h2 className="flex items-center gap-2 text-lg font-robotoSb mb-3">
            <div className="bg-[#2563EB] p-2.5 rounded-full">
              <FaCalculator color="white" size={14} />
            </div>
            Step 4: Payment Method
          </h2>

          <div className="grid grid-cols-2 gap-2 items-center text-sm font-robotoM text-black mb-1 px-1">
            <div>Payment Method</div>
            <div>Transaction ID / UTR </div>
          </div>

          <div className="grid grid-cols-2 gap-2 items-center font-robotoR text-md p-3">
            <input
              className="border px-2 py-1 rounded bg-white"
              placeholder="Cash/UPI/Cheque/DD"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <input
              className="border px-2 py-1 rounded bg-white"
              placeholder="Enter Transaction reference"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Step 4: Milestones (if Debt) */}
      {showStep4 && (
        <div className="bg-white rounded-lg shadow-customCard p-4 sm:p-6">
          <h2 className="flex items-center gap-2 text-base sm:text-lg font-robotoSb mb-3">
            <div className="bg-[#2563EB] p-2.5 rounded-full">
              <FaCalculator color="white" size={14} />
            </div>
            Step 4: Promise Date
          </h2>

          <div className="hidden sm:grid grid-cols-4 gap-2 items-center text-sm font-robotoM text-black mb-1 px-1">
            <div>Milestone Name</div>
            <div>Amount (₹)</div>
            <div>Due Date</div>
            <div>Status</div>
          </div>

{milestones.map((ms, index) => (
  <div
    key={ms.id}
    className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-robotoR text-sm sm:text-md border border-gray-200 p-3 rounded"
  >
    {/* Milestone Name */}
    <input
      className="border px-2 py-1 rounded bg-white"
      placeholder="Milestone Name"
      value={ms.name}
      onChange={(e) => {
        const newMilestones = [...milestones];
        newMilestones[index].name = e.target.value;
        setMilestones(newMilestones);
      }}
    />

    {/* Amount */}
    <input
      className="border px-2 py-1 rounded bg-white"
      placeholder="0.00"
      type="number"
      value={ms.amount}
      onChange={(e) => {
        const newMilestones = [...milestones];
        newMilestones[index].amount = e.target.value;
        setMilestones(newMilestones);
      }}
    />

    {/* Due Date */}
    <input
      className="border px-2 py-1 font-interR text-sm sm:text-md rounded bg-white"
      type="date"
      value={ms.dueDate}
      onChange={(e) => {
        const newMilestones = [...milestones];
        newMilestones[index].dueDate = e.target.value;
        setMilestones(newMilestones);
      }}
    />

    {/* Status */}
    <input
      className="w-full h-10 border border-gray-300 pl-4 pr-10 py-2 rounded text-sm font-robotoR bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
      placeholder="Status"
      value={ms.status}
      onChange={(e) => {
        const newMilestones = [...milestones];
        newMilestones[index].status = e.target.value;
        setMilestones(newMilestones);
      }}
    />
  </div>
))}

          <button
            onClick={handleAddMilestone}
            className="text-bluecol font-robotoR text-sm sm:text-md mt-2"
          >
            + Add Milestone
          </button>
        </div>
      )}

      {/* Submit button (common for both) */}
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="bg-bluecol text-white px-6 py-2 rounded font-robotoM"
        >
          Submit Payment
        </button>
      </div>


            </div>
          </div>

          {/* Step 5: Additional Charges */}
       {/* Step 5: Additional Charges */}
<div className="bg-white rounded-lg shadow-customCard p-4">
  <h2 className="flex items-center gap-2 text-lg font-robotoSb mb-3">
    <div className="bg-[#2563EB] p-2.5 rounded-full">
      <FaPlus color="white" size={14} />
    </div>
    Step 5: Additional Charges
  </h2>
  <div className="grid grid-cols-2 gap-3 font-robotoR text-md">
    <div>
      <label className="block text-sm mb-1 font-robotoM">Delivery Fee</label>
      <input
        className="w-full border px-2 py-1 rounded bg-white"
        placeholder="0.00"
        type="number"
        value={additionalCharges.deliveryFee}
        onChange={(e) => handleAdditionalChange("deliveryFee", e.target.value)}
      />
    </div>
    <div>
      <label className="block text-sm mb-1 font-robotoM">Packing Charges</label>
      <input
        className="w-full border px-2 py-1 rounded bg-white"
        placeholder="0.00"
        type="number"
        value={additionalCharges.packingCharges}
        onChange={(e) => handleAdditionalChange("packingCharges", e.target.value)}
      />
    </div>
    <div>
      <label className="block text-sm mb-1 font-robotoM">Discount</label>
      <input
        className="w-full border px-2 py-1 rounded bg-white"
        placeholder="0.00"
        type="number"
        value={additionalCharges.discount}
        onChange={(e) => handleAdditionalChange("discount", e.target.value)}
      />
    </div>
    <div>
      <label className="block text-sm mb-1 font-robotoM">Other</label>
      <input
        className="w-full border px-2 py-1 rounded bg-white"
        placeholder="0.00"
        type="number"
        value={additionalCharges.other}
        onChange={(e) => handleAdditionalChange("other", e.target.value)}
      />
    </div>
  </div>
</div>




          {/* Step 6: Add Note */}
          {/* box-shadow: 0px 4px 6px 0px #0000001A;

box-shadow: 0px 2px 4px 0px #0000001A;
 */}
<div className="bg-white rounded-lg shadow-lg shadow-[#0000001A] p-4 shadow-customCard">
  <h2 className="flex items-center gap-2 text-lg font-robotoSb mb-3">
    <div className="bg-[#2563EB] p-2.5 rounded-full">
      <FaEdit color="white" size={14} />
    </div>
    Step 6: Add Note (Optional)
  </h2>
  <textarea
    value={note}
    onChange={(e) => setNote(e.target.value)}
    className="border w-full px-3 py-2 rounded font-robotoR text-md bg-white"
    rows="3"
    placeholder="Terms & Conditions, Special instructions, Internal notes..."
  ></textarea>
</div>

          
        </div>

        <div className="flex flex-col sm:flex-row justify-start gap-4 p-4">
          <button className="bg-gray-600 text-white font-robotoR text-md px-4 py-2 rounded">
            Save as Draft
          </button>
          <button     onClick={handleSubmit}  className="flex justify-center items-center gap-2 bg-bluecol text-white font-robotoM text-md px-4 py-2 rounded">
            <LuNewspaper size={24} />
            Generate Invoice
          </button>
          <button className="flex justify-center items-center gap-2 text-bluecol bg-white border-bluecol border-2 font-robotoM text-md px-4 py-2 rounded">
            <LuNewspaper size={24} />
            Generate Quotation
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="bg-white shadow-customCard rounded-lg p-4">
        <h2 className="text-lg font-robotoSb mb-4">Invoice Summary</h2>
        <ul className="text-sm font-robotoR text-black space-y-3">
          <li className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹0.00</span>
          </li>
          <li className="flex justify-between hidden">
            <span>Tax :</span>
            <span>₹0.00</span>
          </li>
          <li className="flex justify-between">
            <span>Total Received:</span>
            <span>₹0.00</span>
          </li>
          <li className="flex justify-between">
            <span>Due Balance:</span>
            <span>₹0.00</span>
          </li>
          <li className="flex justify-between">
            <span>Paid / Not Paid:</span>
            <span>₹0.00</span>
          </li>
          <li className="flex justify-between">
            <span>Delivery Fee:</span>
            <span>₹0.00</span>
          </li>
          <li className="flex justify-between text-red-500">
            <span>Discount:</span>
            <span>-₹0.00</span>
          </li>
          <li className="flex justify-between font-robotoB text-lg border-t pt-1 mt-1">
            <span>Total:</span>
            <span>₹0.00</span>
          </li>
        </ul>

        <div className="mt-6 space-y-2">
          <h3 className="text-md font-robotoM">Quick Actions</h3>
          <button className="flex items-center gap-2 text-black font-robotoR text-md">
            <FaPrint color="#4B5563" />
            Print Invoice
          </button>
          <br />
          <button className="flex items-center gap-2 text-black font-robotoR text-md">
            <FaWhatsapp color="#16A34A" />
            Share via WhatsApp
          </button>
          <br />
          <button className="flex items-center gap-2 text-black font-robotoR text-md">
            <FaCommentSms color="#2563EB" />
            Send via SMS
          </button>
        </div>


        <div className="mt-6">
          <h3 className="text-[22px] font-robotoSb mb-2">Previous Invoices</h3>
          {previousInvoices.map((inv, index) => (
            <div
              key={index}
              className="flex justify-between items-center shadow-customCard border-2 rounded-lg border-[#E5E7EB] text-sm p-2 mb-2"
            >
              <div>
                <p className="font-robotoSb text-[16px]">{inv.name}</p>
                <p className="text-gray-500 font-robotoR text-sm">
                  Last Paid: {inv.lastPaid}
                </p>
                <p className="text-red-500 font-robotoM text-xs">
                  Due: {inv.due}
                </p>
              </div>
              <button className="bg-[#E6FEE2] text-[#16A34A] px-2 py-1 rounded-full font-robotoM text-xs">
                View Invoice
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}