// ctr
import { useEffect, useRef, useState } from "react";
import { Invoice } from "./Invoice.js";
import { ProfileService } from "./profileservice.js";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { parse, format, isValid } from "date-fns";

export function useCreateInvoiceController({ onCustomerSelect } = {}) {
  // =========================================================================
  // 1. STATE DECLARATIONS (useState)
  // =========================================================================
  const [selectedFormat, setSelectedFormat] = useState("classic");

  // Customer State
  const [createdDate, setCreatedDate] = useState(Date.now());
  const [invoceId, setInvoiceId] = useState("INV-00000001");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [storeProfile, setStoreProfile] = useState(null);

  // Product and Row State
  const [products, setProducts] = useState([]);
  const [rows, setRows] = useState([
    { id: Date.now(), productId: "", qty: 1, unit: "", price: 0, tax: 0 },
  ]);
  const [taxType, setTaxType] = useState("taxable");

  // Payment State
  const [showStep3, setShowStep3] = useState(true);
  const [showStep4, setShowStep4] = useState(false);
  const [paymentMode, setPaymentMode] = useState("cash");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [partialCashAmount, setPartialCashAmount] = useState(0);

  // Milestones State
  const [milestones, setMilestones] = useState([
    {
      id: Date.now(),
      name: "Promise1",
      amount: "",
      dueDate: format(new Date(), "dd/MM/yyyy"),
      status: "Pending",
    },
  ]);

  // Charges and Notes State
  const [additionalCharges, setAdditionalCharges] = useState({
    deliveryFee: "",
    packingCharges: "",
    discount: "",
    other: "",
  });
  const [note, setNote] = useState("");

  // Summary State
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

  // Preview and Submit State
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Notification State
  const [popupType, setPopupType] = useState(null);
  const [message, setMessage] = useState("");

  // Invoice List State
  const [invoices, setInvoices] = useState([]);
  const [todayCollection, setTodayCollection] = useState(0);
  const [totalCollection, setTotalCollection] = useState(0);

  // =========================================================================
  // 2. REFS (useRef)
  // =========================================================================
  const previewRef = useRef(null);

  // =========================================================================
  // 3. SIDE EFFECTS & DATA FETCHING (useEffect)
  // =========================================================================

  useEffect(() => {
    try {
      const fetchInvoiceId = async () => {
        const res = await Invoice.fetchInvoiceId();
        if (res.success) {
          setInvoiceId(res.invoiceId || "");
        }
      };
      fetchInvoiceId();
    } catch (err) {
      console.error("Error in createdDate effect:", err);
    }
  }, [createdDate]);
  // Effect 1: Fetch Customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        
        const { success, customers } = await Invoice.fetchCustomersForInvoice(
          {
            page: 1,
            limit: 1000,
          }
        );
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

  // Effect 2: Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await Invoice.getProducts( {
            page: 1,
            limit: 1000,
          });
        const productList =
          res?.products || res?.data?.products || res?.data || [];
        const validProducts = productList.filter((p) => p && (p._id || p.id));
        setProducts(validProducts);
      } catch (err) {
        console.error("❌ Failed to fetch products", err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Effect 3: Calculate Invoice Summary (re-runs on rows, charges, cash amount change)
  useEffect(() => {
    calculateInvoiceSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, additionalCharges, partialCashAmount]);

  // Effect 4: Fetch Invoices
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

  // Effect 5: Fetch Store Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storeProfile_id = localStorage.getItem("storeProfile_id");
        if (!storeProfile_id) {
          console.warn("⚠️ No active business found");
          return;
        }
        const res = await ProfileService.getProfile(storeProfile_id);
        setStoreProfile(res?.data || res);
      } catch (err) {
        console.error("❌ Error fetching profile:", err.message);
      }
    };
    fetchProfile();
  }, []);

  // =========================================================================
  // 4. DERIVED VALUES
  // =========================================================================

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

  // =========================================================================
  // 5. HELPER/CALCULATION FUNCTIONS
  // =========================================================================

  const calculateTotal = (row) => {
    const subtotal = (row.qty || 0) * (row.price || 0);
    // Logic from the original code: If price_type is NOT 'without' (meaning it includes tax),
    // the tax is calculated and added.
    const taxable = taxType === "taxable";
    if (row.price_type === "without" || !taxable) {
      return subtotal;
    } else {
      const taxAmount = (subtotal * (row.tax || 0)) / 100;
      return subtotal + taxAmount;
    }
  };

  const calculateInvoiceSummary = () => {
    const subtotal = rows.reduce((sum, row) => sum + row.qty * row.price, 0);
    const totalTax = rows.reduce((sum, row) => {
      // If price includes tax (not 'without' type), tax is not separately added to subtotal for total calculation.
      // The original logic seems to calculate totalTax for display purposes, but only applies it to the 'total' if price_type is 'without'.
      // Reverting to the original logic for consistency:
      // Tax is only calculated for products where 'price_type' is NOT 'fixed'.
      // If 'price_type' is 'without', the tax is calculated and added to get the final total.
      // The original 'calculateTotal' handles the final per-row total.

      const taxable = taxType === "taxable";
      // Let's assume this totalTax calculation is for displaying the *total tax amount*, not just for the final 'total' calculation.
      if (row.price_type === "without" || !taxable) return sum;

      const rowSubtotal = row.qty * row.price;
      return sum + (rowSubtotal * (row.tax || 0)) / 100;
    }, 0);

    const deliveryFee = Number(additionalCharges.deliveryFee) || 0;
    const packingCharges = Number(additionalCharges.packingCharges) || 0;
    const discount = Number(additionalCharges.discount) || 0;
    const other = Number(additionalCharges.other) || 0;

    // The 'subtotal' here is the sum of (qty * price).
    // The 'totalTax' calculated above is only for 'price_type !== fixed' (i.e., 'without').
    // 'total' = Subtotal + TotalTax + Charges - Discount.
    const total =
      subtotal + totalTax + deliveryFee + packingCharges - discount + other;

    const totalReceived = Number(partialCashAmount) || 0;
    const dueBalance = total - totalReceived;

    setInvoiceSummary({
      subtotal,
      totalTax,
      total,
      totalReceived,
      dueBalance,
      deliveryFee,
      packingCharges,
      discount,
      other,
    });
  };

  // =========================================================================
  // 6. EVENT HANDLERS
  // =========================================================================

  const handleSelectCustomer = (cust) => {
    setSelectedCustomer(cust);
    setSearchTerm("");
    setSearchTriggered(false);
    if (onCustomerSelect) onCustomerSelect(cust);
  };

  const handleSelectProduct = (rowId, product) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
            ...row,
            productId: product._id || product.id,
            price: product.sales_price || 0,
            unit: product.unit || "pcs",
            tax: product.tax || 0,
            price_type: product.price_type || "without",
          }
          : row
      )
    );
  };

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
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
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
            ...row,
            [field]:
              field === "qty" || field === "price"
                ? Number(value) || 0
                : value,
          }
          : row
      )
    );
  };

  const handleTaxTypeChange = (value) => {
    setTaxType(value);
    if (value === "non-taxable") {
      setRows((prev) =>
        prev.map((row) => ({
          ...row,
          price_type: "without", // or "fixed" if price is final
        }))
      );
    }

    if (value === "taxable") {
      setRows((prev) =>
        prev.map((row) => ({
          ...row,
          price_type: "fixed", // Assuming default for taxable is 'fixed' (price includes tax)
        }))
      );
    }
  };

  const handlePaymentMode = (mode) => {
    setPaymentMode(mode);
    if (mode === "cash") {
      setShowStep3(true);
      setShowStep4(false);
      // Set partial cash amount to total for 'cash' mode, implying full cash payment initially
      setPartialCashAmount(invoiceSummary.total);
    } else if (mode === "debt") {
      setShowStep4(true);
      setShowStep3(false);
      setPartialCashAmount(0); // Assuming no cash collected for 'debt' initially
    }
  };

  const handleAddMilestone = () => {
    const newId = Date.now();
    const newIndex = milestones.length + 1;
    const newMilestone = {
      id: newId,
      name: `Promise${newIndex}`,
      amount: "",
      dueDate: format(new Date(), "dd/MM/yyyy"),
      status: "Pending",
    };
    setMilestones((prev) => [...prev, newMilestone]);
  };

  const handleMilestoneChange = (id, field, value) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleAdditionalChange = (field, value) => {
    setAdditionalCharges((prev) => ({
      ...prev,
      [field]: Number(value) || 0,
    }));
  };

  const handlePreview = () => {
    console.log(createdDate);

    if (!selectedCustomer?._id) {
      setPopupType("error");
      setMessage("Please select a customer!");
      return;
    }
    if (!paymentMode) {
      setPopupType("error");
      setMessage("Please select a payment mode!");
      return;
    }
    // Check for at least one valid product row
    if (rows.some((r) => !r.productId || r.qty <= 0)) {
      setPopupType("error");
      setMessage("Please add at least one valid product!");
      return;
    }

    const { subtotal, totalTax, total, totalReceived, dueBalance } =
      invoiceSummary;

    // Check if milestones total matches due balance for 'debt' mode
    if (
      paymentMode === "debt" &&
      Math.abs(
        milestones.reduce((sum, m) => sum + Number(m.amount || 0), 0) -
        dueBalance
      ) > 0.01
    ) {
      setMessage(
        `Milestones total must equal Due Balance (${dueBalance.toFixed(2)})!`
      );
      setPopupType("error");
      return;
    }

    let payloadPaymentMethod = paymentMethod;
    let payloadtransactionId = transactionId;

    if (paymentMode === "debt") {
      payloadPaymentMethod = "";
      payloadtransactionId = "";
    } //no details of cash should be sent for debt
    const payload = {
      customerId: selectedCustomer._id,
      name: selectedCustomer.name,
      phone: selectedCustomer.mobile,
      address: selectedCustomer.address,
      balance: selectedCustomer.balance,
      creditScore: selectedCustomer.creditScore,
      paymentMode,
      paymentMethod: payloadPaymentMethod,
      transactionId: payloadtransactionId,
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
        totalReceived === total
          ? "Paid"
          : totalReceived > 0
            ? "Partial"
            : "Unpaid",
      products: rows.map((p) => {
        const prod =
          products.find((x) => x._id === p.productId || x.id === p.productId) ||
          {};
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
      productType: taxType,
      ...(paymentMode === "debt"
        ? {
          milestones: milestones.map((m) => {
            let isoDue = null;
            if (m.dueDate) {
              const parsed = parse(m.dueDate, "dd/MM/yyyy", new Date());
              isoDue = isValid(parsed) ? parsed.toISOString() : null;
            }
            return {
              milestoneName: m.name,
              amount: Number(m.amount) || 0,
              paymentMode: m.paymentMode || paymentMode,
              dueDate: isoDue,
              status: m.status || "Pending",
            };
          }),
        }
        : {}),
      InvoiceCreatedDate: formatDate(new Date(createdDate)),
    };
    console.log(payload);

    setPreviewInvoice(payload);
    setShowPreview(true);
  };


  const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };
  const handleSubmit = async () => {
    try {

      const res = await Invoice.createInvoice(previewInvoice);
      if (res.success) {
        setMessage("✅ Invoice created successfully!");
        setPopupType("success");
        setShowPreview(false);
        setPreviewInvoice(null);

        // Reset State after successful creation
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
        setMilestones([
          {
            id: Date.now(),
            name: "Promise1",
            amount: "",
            dueDate: format(new Date(), "dd/MM/yyyy"),
            status: "Pending",
          },
        ]);
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

        // Refresh Invoices List
        const refreshed = await Invoice.getAllInvoices();
        if (refreshed?.success) {
          setInvoices(refreshed.invoices || []);
          setTodayCollection(refreshed.todayCollection || 0);
          setTotalCollection(refreshed.totalCollection || 0);
        }
      } else {
        setMessage(res.message || "❌ Failed to create invoice");
        setPopupType("error");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setMessage(err.message || "Error creating invoice");
      setPopupType("error");
    }
  };

const downloadPreviewAsPDF = async (fileName = "invoice.pdf") => {
  if (!previewRef.current) {
    setMessage("Preview not ready for PDF.");
    setPopupType("error");
    return;
  }
  
  // --- 1. PRE-PROCESSING: Hide modal UI elements and scrollbars ---
  // You need to add the class/selector '.invoice-controls' to the header and footer buttons/controls in your JSX.
  const nonPrintableElements = document.querySelectorAll(".invoice-controls");
  nonPrintableElements.forEach(el => el.style.display = 'none');
  
  // Target the body and the main modal content to hide scrollbars
  document.body.style.overflow = 'hidden'; 
  const modalContent = document.querySelector('.max-h-[90vh]');
  if (modalContent) modalContent.style.overflow = 'visible'; 
  
  try {
    // A slight delay ensures the browser re-renders before capturing
    await new Promise(resolve => setTimeout(resolve, 50)); 
    
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
    
    // --- 2. Set PDF Metadata Title ---
    pdf.setProperties({
      title: fileName.replace(".pdf", ""), 
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight <= pageHeight - 40) {
      // Single page
      pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
    } else {
      // Multi-page logic
      let heightLeft = imgHeight;
      const pageCanvas = document.createElement("canvas");
      const pageCtx = pageCanvas.getContext("2d");

      let currentY = 0;
      
      // Calculate the height of content that fits on one PDF page, mapped to the source canvas
      const pageContentHeight = (pageHeight - 40) * canvas.width / imgWidth;

      while (heightLeft > 0) {
        // Determine how much canvas content height to crop for the current page
        const contentHeight = Math.min(canvas.height - currentY, pageContentHeight);
        
        if (currentY > 0) {
          pdf.addPage();
        }

        pageCanvas.width = canvas.width;
        pageCanvas.height = contentHeight;

        pageCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
        
        // Draw the cropped section from the original canvas
        pageCtx.drawImage(
          canvas,
          0,
          currentY,
          canvas.width,
          contentHeight,
          0, 0, pageCanvas.width, pageCanvas.height
        );
        
        const pageData = pageCanvas.toDataURL("image/png");

        // Add image to PDF
        pdf.addImage(
          pageData,
          "PNG",
          20,
          20,
          imgWidth,
          (pageCanvas.height * imgWidth) / pageCanvas.width
        );

        // Update remaining height and current position
        heightLeft -= (pageCanvas.height * imgWidth) / canvas.width;
        currentY += contentHeight;
      }
    }

    pdf.save(fileName);
    setMessage(`Invoice saved as ${fileName}`);
    setPopupType("success");
    
  } catch (err) {
    console.error("PDF generation error:", err);
    setPopupType("error");
    setMessage("Failed to create PDF. Check console for details.");
  } finally {
    // --- 3. POST-PROCESSING: Restore modal UI elements and scrollbars ---
    nonPrintableElements.forEach(el => el.style.display = 'flex'); // Restore original display
    document.body.style.overflow = '';
    if (modalContent) modalContent.style.overflow = 'auto';
  }
};

  // =========================================================================
  // 7. RETURN HOOK INTERFACE
  // =========================================================================

  return {
    invoceId,

    createdDate,
    setCreatedDate,
    // View/General State
    selectedFormat,
    setSelectedFormat,
    customers,
    loading,
    searchTerm,
    setSearchTerm,
    setSearchTriggered,
    selectedCustomer,
    searchTriggered,
    filteredCustomers,
    storeProfile,
    handleSelectCustomer,

    // Products and Rows
    products,
    rows,
    taxType,
    handleSelectProduct,
    handleAddRow,
    handleRemoveRow,
    handleChange,
    handleTaxTypeChange,
    calculateTotal, // Helper function for display

    // Payment and Milestones
    showStep3,
    showStep4,
    paymentMode,
    paymentMethod,
    setPaymentMethod,
    transactionId,
    setTransactionId,
    partialCashAmount,
    setPartialCashAmount,
    handlePaymentMode,
    milestones,
    setMilestones,
    handleAddMilestone,
    handleMilestoneChange,
    additionalCharges,
    handleAdditionalChange,
    note,
    setNote,

    // Summary
    invoiceSummary,

    // Preview and Submit
    previewInvoice,
    setPreviewInvoice,
    showPreview,
    setShowPreview,
    handlePreview,
    handleSubmit,

    // Notifications
    popupType,
    setPopupType,
    message,
    setMessage,

    // Previous Invoices
    invoices,
    todayCollection,
    totalCollection,

    // PDF
    previewRef,
    downloadPreviewAsPDF,
  };
}