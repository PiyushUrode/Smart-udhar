import { useState, useEffect } from "react";
import { FaCommentSms } from "react-icons/fa6";
import Select from "react-select";
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
import { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";



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
  { id: Date.now(), name: "Promise1", amount: "", dueDate: "", status: "Pending" },
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

// ----------------- PARTIAL CASH FOR MIXED PAYMENT -----------------
  const [partialCashAmount, setPartialCashAmount] = useState(0);

  // ----------------- INVOICE SUMMARY STATE -----------------
  const [invoiceSummary, setInvoiceSummary] = useState({
    subtotal: 0,
    totalTax: 0,
    totalReceived: 0,
    dueBalance: 0,
    paidNotPaid: 0,
    deliveryFee: 0,
    discount: 0,
    total: 0,
  });

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

  // ----------------- FETCH PRODUCTS start -----------------
  // Products
  const [products, setProducts] = useState([]);
  const [rows, setRows] = useState([
    { id: Date.now(), productId: "", qty: 1, unit: "", price: 0, tax: 0 },
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await Invoice.getProducts();
        const productList = res?.products || res?.data?.products || res?.data || [];
        const validProducts = productList.filter(p => p && (p._id || p.id));
        setProducts(validProducts);
      } catch (err) {
        console.error("❌ Failed to fetch products", err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  const handleSelectProduct = (rowId, product) => {
    console.log("🔍 Selected Product Full:", product);

    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
              ...row,
              productId: product._id || product.id,
              price: product.sales_price || 0,
              unit: product.unit || "pcs",
              tax: product.tax || 0,
            }
          : row
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
        tax: 0,
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
              [field]: field === "qty" || field === "price" ? Number(value) || 0 : value,
            }
          : row
      )
    );
  };



  // --------------fetch product end ------------------
  // ----------------- PAYMENT LOGIC -----------------
  const handlePaymentMode = (mode) => {
    setPaymentMode(mode);
    if (mode === "cash") {
      setShowStep3(true);
      setShowStep4(false);
      setPartialCashAmount(invoiceSummary.total); // Full amount as cash
    } else if (mode === "debt") {
      setShowStep4(true);
      setShowStep3(false);
      setPartialCashAmount(0); // Reset for partial cash input
    }
  };

  const handleAddMilestone = () => {
  const newId = Date.now();
  const newIndex = milestones.length + 1; // 1 se start hoga
  const newMilestone = {
    id: newId,
    name: `Promise${newIndex}`, // Auto name
    amount: "",
    dueDate: new Date().toISOString().split("T")[0], // 
    status: "Pending", // Always Pending
  };

  setMilestones([...milestones, newMilestone]);
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

// STEP 1: Preview kholne ke liye
const handlePreview = () => {
  if (!selectedCustomer?._id) {
    alert("Please select a customer!");
    return;
  }
  if (!paymentMode) {
    alert("Please select a payment mode!");
    return;
  }
  if (rows.some((r) => !r.productId || r.qty <= 0)) {
    alert("Please add at least one valid product!");
    return;
  }

  const { subtotal, totalTax, total, totalReceived, dueBalance } = invoiceSummary;

  const payload = {
    customerId: selectedCustomer._id,
    name: selectedCustomer.name,
    phone: selectedCustomer.mobile,
    address: selectedCustomer.address,
    balance: selectedCustomer.balance,
    creditScore: selectedCustomer.creditScore,
    paymentMode,
    paymentMethod,
    transactionId,
    deliveryFee: Number(additionalCharges.deliveryFee) || 0,
    packingCharges: Number(additionalCharges.packingCharges) || 0,
    discount: Number(additionalCharges.discount) || 0,
    other: Number(additionalCharges.other) || 0,
    note,
    subtotal,
    tax: totalTax,
    total,
    totalReceived,
    dueBalance,
    paymentStatus:
      totalReceived === total ? "Paid" : totalReceived > 0 ? "Partial" : "Unpaid",
    products: rows.map((p) => {
      const prod = products.find((x) => x._id === p.productId || x.id === p.productId) || {};
      return {
        productId: p.productId,
        name: prod?.name || prod?.product_name || "Unnamed",
        qty: Number(p.qty),
        unit: p.unit,
        price: Number(p.price),
        tax: Number(p.tax),
        total: calculateTotal(p),
      };
    }),
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

  if (
    paymentMode === "debt" &&
    Math.abs(
      milestones.reduce((sum, m) => sum + Number(m.amount || 0), 0) - dueBalance
    ) > 0.01
  ) {
    alert(`Milestones total must equal Due Balance (${dueBalance.toFixed(2)})!`);
    return;
  }

  // Sirf preview ke liye state set karna
  setPreviewInvoice(payload);
  setShowPreview(true);
};

// STEP 2: API call sirf preview ke andar submit pe
const handleSubmit = async () => {
  try {
    const res = await Invoice.createInvoice(previewInvoice);

    if (res.success) {
      alert("✅ Invoice created successfully!");
      setShowPreview(false);
      setPreviewInvoice(null);

      // 🟢 Reset form (fresh state ke liye)
      setSelectedCustomer(null);
      setPaymentMode("");
      setPaymentMethod("");
      setTransactionId("");
      setAdditionalCharges({
        deliveryFee: 0,
        packingCharges: 0,
        discount: 0,
        other: 0,
      });
      setNote("");
      setPartialCashAmount(0);
      setMilestones([]);

      // default ek khali row new invoice ke liye
      setRows([
        {
          id: Date.now(),
          productId: "",
          qty: 1,
          unit: "pcs",
          price: 0,
          tax: 0,
        },
      ]);

      // 🟢 Invoice list refresh
      const refreshed = await Invoice.getAllInvoices();
      if (refreshed?.success) {
        setInvoices(refreshed.invoices || []);
        setTodayCollection(refreshed.todayCollection || 0);
        setTotalCollection(refreshed.totalCollection || 0);
      }
    } else {
      alert("❌ Failed to create invoice");
    }
  } catch (err) {
    console.error("❌ Error:", err);
    alert("Error creating invoice");
  }
};

// ----------------- Row-level Calculation Function -----------------
// This function calculates the total for a single row (used for displaying per-row totals in the table)
const calculateTotal = (row) => {
  const subtotal = (row.qty || 0) * (row.price || 0);
  const taxAmount = (subtotal * (row.tax || 0)) / 100;
  return subtotal + taxAmount;  // Returns row total including tax
};

// ----------------- Main Invoice Summary Calculation -----------------
// This function calculates the overall invoice summary
const calculateInvoiceSummary = () => {
  // Calculate subtotal WITHOUT tax (base amount from products only)
  const subtotal = rows.reduce((sum, row) => sum + (row.qty * row.price), 0);

  // Calculate total tax from all rows
  const totalTax = rows.reduce((sum, row) => {
    const rowSubtotal = row.qty * row.price;
    return sum + (rowSubtotal * (row.tax || 0)) / 100;
  }, 0);

  // Additional charges
  const deliveryFee = Number(additionalCharges.deliveryFee) || 0;
  const packingCharges = Number(additionalCharges.packingCharges) || 0;
  const discount = Number(additionalCharges.discount) || 0;
  const other = Number(additionalCharges.other) || 0;

  // Calculate grand total: subtotal + tax + delivery + packing - discount + other
  const total = subtotal + totalTax + deliveryFee + packingCharges - discount + other;

  // Calculate received amount and due balance
  const totalReceived = Number(partialCashAmount) || 0;
  const dueBalance = total - totalReceived;

  // Update invoice summary state with all values
  setInvoiceSummary({
    subtotal,        // Base product amount (without tax)
    totalTax,        // Total tax amount
    total,           // Grand total (subtotal + tax + charges - discount)
    totalReceived,   // Amount already paid
    dueBalance,      // Remaining amount to pay
    deliveryFee,
    packingCharges,
    discount,
    other,
  });
};

  // ----------------- NEW: useEffect for Real-Time Update -----------------
  useEffect(() => {
    calculateInvoiceSummary();
  }, [rows, additionalCharges, partialCashAmount]);

// previous invoices
  const [invoices, setInvoices] = useState([]);
const [todayCollection, setTodayCollection] = useState(0);
const [totalCollection, setTotalCollection] = useState(0);

useEffect(() => {
  const fetchInvoices = async () => {
    try {
      const res = await Invoice.getAllInvoices();
      if (res.success) {
        setInvoices(res.invoices);
        setTodayCollection(res.todayCollection);
        setTotalCollection(res.totalCollection);
      }
    } catch (err) {
      console.error("❌ Error fetching invoices:", err);
    }
  };

  fetchInvoices();
}, []);


const [previewInvoice, setPreviewInvoice] = useState(null); // invoice object returned from API
const [showPreview, setShowPreview] = useState(false); // whether preview modal is visible
const previewRef = useRef(null); // ref to preview DOM for PDF capture

const downloadPreviewAsPDF = async (fileName = "invoice.pdf") => {
  if (!previewRef.current) {
    alert("Preview not ready for PDF.");
    return;
  }

  try {
    // capture element to canvas
    const canvas = await html2canvas(previewRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // calculate image dimensions to fit A4 width with aspect ratio
    const imgWidth = pageWidth - 40; // margin
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 20;

    // if content longer than a single page, split into pages
    if (imgHeight <= pageHeight - 40) {
      pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
    } else {
      // multiple pages
      let heightLeft = imgHeight;
      let y = 20;
      const pageCanvas = document.createElement("canvas");
      const pageCtx = pageCanvas.getContext("2d");

      // draw and add pages in chunks
      while (heightLeft > 0) {
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(canvas.height, Math.floor((canvas.width * (pageHeight - 40)) / imgWidth));
        pageCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
        pageCtx.drawImage(
          canvas,
          0,
          canvas.height - heightLeft,
          canvas.width,
          pageCanvas.height,
          0,
          0,
          pageCanvas.width,
          pageCanvas.height
        );
        const pageData = pageCanvas.toDataURL("image/png");
        if (pdf.internal.getNumberOfPages() > 0) pdf.addPage();
        pdf.addImage(pageData, "PNG", 20, 20, imgWidth, (pageCanvas.height * imgWidth) / pageCanvas.width);
        heightLeft -= pageCanvas.height;
      }
    }

    pdf.save(fileName);
  } catch (err) {
    console.error("PDF generation error:", err);
    alert("Failed to create PDF.");
  }
};




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
                   <p className="font-robotoR">
                    <strong className="text-black font-robotoM">Address:</strong>{" "}
                    {selectedCustomer.address || "N/A"}
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
          className="grid grid-cols-7 gap-2 sm:gap-4 items-center py-3 h-auto text-sm px-2"
        >
          {/* Product dropdown */}


<div className="col-span-2">
 <Select
  className="text-sm"
  placeholder="Select Product..."
  isClearable
  options={
    Array.isArray(products)
      ? products
          .filter((p) => p && (p._id || p.id)) // ✅ null / undefined / empty hata do
          .map((p) => ({
            value: p._id || p.id,
            label: p.name || p.product_name || "Unnamed",
          }))
      : []
  }
  value={
    row.productId
      ? (() => {
          const selected = products?.find(
            (p) => p && (p._id === row.productId || p.id === row.productId)
          );
          return selected
            ? {
                value: row.productId,
                label: selected.name || selected.product_name || "Unnamed",
              }
            : null;
        })()
      : null
  }
  onChange={(selectedOption) => {
    if (selectedOption) {
      const selectedProduct = products?.find(
        (p) => p && (p._id === selectedOption.value || p.id === selectedOption.value)
      );
      if (selectedProduct) {
        handleSelectProduct(row.id, selectedProduct);
      }
    } else {
      handleSelectProduct(row.id, null); // clear
    }
  }}
  menuPortalTarget={document.body}
  styles={{
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    control: (base) => ({
      ...base,
      minHeight: "42px", // ✅ thoda height bada diya
      borderColor: "#d1d5db", // Tailwind gray-300
      boxShadow: "none",
      "&:hover": { borderColor: "#2563eb" }, // Tailwind blue-600 hover
    }),
    singleValue: (base) => ({
      ...base,
      color: "#000", // ✅ selected value black
    }),
    input: (base) => ({
      ...base,
      color: "#000", // ✅ typing text black
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6b7280", // Tailwind gray-500
    }),
    option: (base, state) => ({
      ...base,
      color: "#000", // ✅ dropdown text black
      backgroundColor: state.isSelected
        ? "#2563eb"
        : state.isFocused
        ? "#e5e7eb"
        : "#fff",
    }),
  }}
/>


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
              <div className="bg-[#2563EB] p-2.5 rounded-full">
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
                <div>Transaction ID / UTR</div>
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

          {/* Step 4: Milestones (if Debt) with Partial Cash */}
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
  <input
  className="border px-2 py-1 rounded bg-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
  placeholder="0"
  type="number"
  inputMode="numeric"
  pattern="[0-9]*"
  value={ms.amount}
  onChange={(e) => {
    const newMilestones = [...milestones];
    // ✅ Sirf integer store karega
    const onlyDigits = e.target.value.replace(/\D/g, "");
    newMilestones[index].amount = onlyDigits ? parseInt(onlyDigits, 10) : "";
    setMilestones(newMilestones);
  }}
/>


<input
  className="border px-2 py-1 font-interR text-sm sm:text-md rounded bg-white"
  type="date"
  min={new Date().toISOString().split("T")[0]} // past date disable
  value={ms.dueDate}
  onChange={(e) => {
    const newMilestones = [...milestones];
    newMilestones[index].dueDate = e.target.value;
    setMilestones(newMilestones);
  }}
/>

                  <input
                    className="w-full h-10 border border-gray-300 pl-4 pr-10 py-2 rounded text-sm font-robotoR bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Status"
                    value={ms.status}
                    readOnly
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

              {/* Partial Cash Input for Debt/Mixed */}
              <div className="mt-4 border-t pt-4">
                <label className="block text-sm mb-1 font-robotoM">Partial Cash Paid (Mixed Payment)</label>
                <input
                  type="number"
                  value={partialCashAmount}
                  onChange={(e) => setPartialCashAmount(e.target.value)}
                  className="border px-2 py-1 rounded bg-white w-full"
                  placeholder="Enter cash amount (optional, rest in debt)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Remaining Due: ₹{invoiceSummary.dueBalance.toFixed(2)}
                </p>
              </div>
            </div>
          )}




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
          <button     onClick={handlePreview}  className="flex justify-center items-center gap-2 bg-bluecol text-white font-robotoM text-md px-4 py-2 rounded">
            <LuNewspaper size={24} />
            Generate Invoice
          </button>
          {/* <button className="flex justify-center items-center gap-2 text-bluecol bg-white border-bluecol border-2 font-robotoM text-md px-4 py-2 rounded">
            <LuNewspaper size={24} />
            Generate Quotation
          </button> */}
        </div>
      </div>
      </div>
      </div>

      {/* ---------- Invoice Preview Modal ---------- */}
{showPreview && previewInvoice && (
  <div className="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/40">
    <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-auto max-h-[90vh]">
      {/* header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-robotoSb">Invoice Preview</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadPreviewAsPDF(`invoice-${previewInvoice._id || Date.now()}.pdf`)}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Download PDF
          </button>
          <button
            onClick={() => {
              setShowPreview(false);
              // Optional: clear previewInvoice and reset form after closing
              setPreviewInvoice(null);
            }}
            className="px-3 py-1 border rounded"
          >
            Close
          </button>
        </div>
      </div>

      {/* body: the printable invoice area */}
      <div ref={previewRef} className="p-6 bg-white text-black">
        {/* ---- Top: company + customer ---- */}
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-2xl font-robotoB">Your Company Name</h2>
            <div className="text-sm">Address line 1</div>
            <div className="text-sm">Phone / Email</div>
          </div>
          <div className="text-right">
            <div><strong>Invoice ID:</strong> {previewInvoice._id || previewInvoice.id}</div>
            <div><strong>Date:</strong> {new Date(previewInvoice.createdAt || Date.now()).toLocaleDateString()}</div>
            <div><strong>Status:</strong> {previewInvoice.paymentStatus || invoiceSummary.paymentStatus}</div>
          </div>
        </div>

        {/* Customer details */}
        <div className="mb-4 border p-3 rounded">
          <div className="text-sm"><strong>Customer:</strong> {previewInvoice.name || selectedCustomer?.name}</div>
          <div className="text-sm"><strong>Mobile:</strong> {previewInvoice.phone || selectedCustomer?.mobile}</div>
          <div className="text-sm"><strong>Address:</strong> {previewInvoice.address || selectedCustomer?.address}</div>
        </div>

        {/* Products table */}
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">#</th>
              <th className="text-left py-2">Product</th>
              <th className="text-right py-2">Qty</th>
              <th className="text-right py-2">Unit Price</th>
              <th className="text-right py-2">Tax</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {(previewInvoice.products || []).map((p, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{i + 1}</td>
                <td className="py-2">{p.name}</td>
                <td className="py-2 text-right">{p.qty}</td>
                <td className="py-2 text-right">₹{Number(p.price).toFixed(2)}</td>
                <td className="py-2 text-right">{p.tax}%</td>
                <td className="py-2 text-right">₹{Number(p.total || (p.qty * p.price + ((p.qty * p.price * p.tax) / 100))).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* totals */}
        <div className="mt-4 flex justify-end">
          <div className="w-full max-w-xs">
            <div className="flex justify-between"><span>Subtotal:</span><span>₹{Number(previewInvoice.subtotal || invoiceSummary.subtotal).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax:</span><span>₹{Number(previewInvoice.tax || invoiceSummary.totalTax).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Delivery:</span><span>₹{Number(previewInvoice.deliveryFee || invoiceSummary.deliveryFee).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Discount:</span><span>-₹{Number(previewInvoice.discount || invoiceSummary.discount).toFixed(2)}</span></div>
            <div className="flex justify-between font-robotoB text-lg border-t pt-1 mt-1"><span>Total:</span><span>₹{Number(previewInvoice.total || invoiceSummary.total).toFixed(2)}</span></div>
            <div className="flex justify-between mt-2"><span>Paid:</span><span>₹{Number(previewInvoice.totalReceived || invoiceSummary.totalReceived).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Due:</span><span>₹{Number(previewInvoice.dueBalance || invoiceSummary.dueBalance).toFixed(2)}</span></div>
          </div>
        </div>

        {/* notes & payment details */}
        <div className="mt-4">
          <div><strong>Payment Mode:</strong> {previewInvoice.paymentMode || paymentMode}</div>
          <div><strong>Payment Method / Txn:</strong> {previewInvoice.paymentMethod || paymentMethod} {previewInvoice.transactionId ? ` / ${previewInvoice.transactionId}` : ""}</div>
          {previewInvoice.milestones && previewInvoice.milestones.length > 0 && (
            <div className="mt-2">
              <strong>Milestones:</strong>
              <ul className="list-disc ml-5">
                {previewInvoice.milestones.map((m, idx) => (
                  <li key={idx}>{m.milestoneName} — ₹{Number(m.amount || 0).toFixed(2)} {m.dueDate ? ` (Due: ${new Date(m.dueDate).toLocaleDateString()})` : ""} — {m.status}</li>
                ))}
              </ul>
            </div>
          )}
          {previewInvoice.note && <div className="mt-3"><strong>Note:</strong><div>{previewInvoice.note}</div></div>}
        </div>
        <div className="flex justify-end gap-3 mt-4">
  <button
    onClick={() => setShowPreview(false)}
    className="px-4 py-2 border rounded"
  >
    Cancel
  </button>
  <button
    onClick={handleSubmit}
    className="px-4 py-2 bg-blue-600 text-white rounded"
  >
    Submit Invoice
  </button>
</div>

      </div>
    </div>
  </div>
)}


      {/* Sidebar */}
      <div className="bg-white shadow-customCard rounded-lg p-4">
        <h2 className="text-lg font-robotoSb mb-4">Invoice Summary</h2>
<ul className="text-sm font-robotoR text-black space-y-3">
          <li className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{invoiceSummary.subtotal.toFixed(2)}</span>  {/* Dynamic */}
          </li>
          <li className="flex justify-between hidden">
            <span>Tax :</span>
            <span>₹{invoiceSummary.totalTax.toFixed(2)}</span>  {/* Unhidden if needed */}
          </li>
          <li className="flex justify-between">
            <span>Total Received:</span>
            <span>₹{invoiceSummary.totalReceived.toFixed(2)}</span>
          </li>
          <li className="flex justify-between">
            <span>Due Balance:</span>
            <span>₹{invoiceSummary.dueBalance.toFixed(2)}</span>
          </li>
          {/* <li className="flex justify-between">
            <span>Paid / Not Paid:</span>
            <span>₹{invoiceSummary.paidNotPaid.toFixed(2)}</span>
          </li> */}
          <li className="flex justify-between">
            <span>Delivery Fee:</span>
            <span>₹{invoiceSummary.deliveryFee.toFixed(2)}</span>
          </li>
          <li className="flex justify-between text-red-500">
            <span>Discount:</span>
            <span>-₹{invoiceSummary.discount.toFixed(2)}</span>
          </li>
          <li className="flex justify-between font-robotoB text-lg border-t pt-1 mt-1">
            <span>Total:</span>
            <span>₹{invoiceSummary.total.toFixed(2)}</span>
          </li>
        </ul>
        {/* <div className="mt-6 space-y-2">
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
        </div> */}


{/* Previous Invoices Section */}
<div className="mt-6">
  <h3 className="text-[22px] font-robotoSb mb-2">Previous Invoices</h3>

  {invoices.length === 0 ? (
    <p className="text-gray-500 text-sm">No invoices found.</p>
  ) : (
    invoices.map((inv, index) => (
      <div
        key={index}
        className="flex justify-between items-center shadow-customCard border-2 rounded-lg border-[#E5E7EB] text-sm p-2 mb-2"
      >
        <div>
          {/* Customer Name */}
          <p className="font-robotoSb text-[16px]">{inv.name}</p>

          {/* Last Paid / Created Date */}
          <p className="text-gray-500 font-robotoR text-sm">
            Last Paid:{" "}
            {inv.updatedAt
              ? new Date(inv.updatedAt).toLocaleDateString()
              : new Date(inv.createdAt).toLocaleDateString()}
          </p>

          {/* Due Amount */}
          <p className="text-red-500 font-robotoM text-xs">
            Due: ₹{inv.dueBalance?.toFixed(2) || 0}
          </p>
        </div>

        {/* View Invoice Button */}
        <button
          onClick={() => console.log("View Invoice:", inv._id)}
          className="bg-[#E6FEE2] text-[#16A34A] px-2 py-1 rounded-full font-robotoM text-xs"
        >
          View Invoice
        </button>
      </div>
    ))
  )}
</div>

      </div>
    </div>

  );
}