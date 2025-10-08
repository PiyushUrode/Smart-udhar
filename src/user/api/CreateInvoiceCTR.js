import { useEffect, useRef, useState } from "react";
import { Invoice } from "./Invoice.js";
import { ProfileService } from "./profileservice.js";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { parse, format, isValid } from "date-fns";

export function useCreateInvoiceController({ onCustomerSelect } = {}) {
  const [selectedFormat, setSelectedFormat] = useState("classic");

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [storeProfile, setStoreProfile] = useState(null);

  const [showStep3, setShowStep3] = useState(false);
  const [showStep4, setShowStep4] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const [popupType, setPopupType] = useState(null);
  const [message, setMessage] = useState("");

  const [milestones, setMilestones] = useState([
    {
      id: Date.now(),
      name: "Promise1",
      amount: "",
      dueDate: format(new Date(), "dd/MM/yyyy"),
      status: "Pending",
    },
  ]);

  const [additionalCharges, setAdditionalCharges] = useState({
    deliveryFee: "",
    packingCharges: "",
    discount: "",
    other: "",
  });

  const [note, setNote] = useState("");
  const [partialCashAmount, setPartialCashAmount] = useState(0);

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

  const [products, setProducts] = useState([]);
  const [rows, setRows] = useState([
    { id: Date.now(), productId: "", qty: 1, unit: "", price: 0, tax: 0 },
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await Invoice.getProducts();
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
              [field]: field === "qty" || field === "price" ? Number(value) || 0 : value,
            }
          : row
      )
    );
  };

  const handlePaymentMode = (mode) => {
    setPaymentMode(mode);
    if (mode === "cash") {
      setShowStep3(true);
      setShowStep4(false);
      setPartialCashAmount(invoiceSummary.total);
    } else if (mode === "debt") {
      setShowStep4(true);
      setShowStep3(false);
      setPartialCashAmount(0);
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
    setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleAdditionalChange = (field, value) => {
    setAdditionalCharges((prev) => ({
      ...prev,
      [field]: Number(value) || 0,
    }));
  };

  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const calculateTotal = (row) => {
    const subtotal = (row.qty || 0) * (row.price || 0);
    if (row.price_type === "fixed") {
      return subtotal;
    } else {
      const taxAmount = (subtotal * (row.tax || 0)) / 100;
      return subtotal + taxAmount;
    }
  };

  const handlePreview = () => {
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
    if (rows.some((r) => !r.productId || r.qty <= 0)) {
      setPopupType("error");
      setMessage("Please add at least one valid product!");
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
    };

    if (
      paymentMode === "debt" &&
      Math.abs(milestones.reduce((sum, m) => sum + Number(m.amount || 0), 0) - dueBalance) > 0.01
    ) {
      setMessage(`Milestones total must equal Due Balance (${dueBalance.toFixed(2)})!`);
      setPopupType("error");
      return;
    }

    setPreviewInvoice(payload);
    setShowPreview(true);
  };

  const handleSubmit = async () => {
    try {
      const res = await Invoice.createInvoice(previewInvoice);
      if (res.success) {
        setMessage("✅ Invoice created successfully!");
        setPopupType("success");
        setShowPreview(false);
        setPreviewInvoice(null);

        setSelectedCustomer(null);
        setPaymentMode("");
        setPaymentMethod("");
        setTransactionId("");
        setAdditionalCharges({ deliveryFee: 0, packingCharges: 0, discount: 0, other: 0 });
        setNote("");
        setPartialCashAmount(0);
        setMilestones([]);

        setRows([
          { id: Date.now(), productId: "", qty: 1, unit: "pcs", price: 0, tax: 0 },
        ]);

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

  const calculateInvoiceSummary = () => {
    const subtotal = rows.reduce((sum, row) => sum + row.qty * row.price, 0);
    const totalTax = rows.reduce((sum, row) => {
      if (row.price_type === "fixed") return sum;
      const rowSubtotal = row.qty * row.price;
      return sum + (rowSubtotal * (row.tax || 0)) / 100;
    }, 0);
    const deliveryFee = Number(additionalCharges.deliveryFee) || 0;
    const packingCharges = Number(additionalCharges.packingCharges) || 0;
    const discount = Number(additionalCharges.discount) || 0;
    const other = Number(additionalCharges.other) || 0;
    const total = subtotal + totalTax + deliveryFee + packingCharges - discount + other;
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

  useEffect(() => {
    // intentionally not memoizing calculateInvoiceSummary to keep API simple
    calculateInvoiceSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, additionalCharges, partialCashAmount]);

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

  const previewRef = useRef(null);

  const downloadPreviewAsPDF = async (fileName = "invoice.pdf") => {
    if (!previewRef.current) {
      setMessage("Preview not ready for PDF.");
      setPopupType("error");
      return;
    }
    try {
      const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, allowTaint: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      if (imgHeight <= pageHeight - 40) {
        pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
      } else {
        let heightLeft = imgHeight;
        const pageCanvas = document.createElement("canvas");
        const pageCtx = pageCanvas.getContext("2d");
        while (heightLeft > 0) {
          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(
            canvas.height,
            Math.floor((canvas.width * (pageHeight - 40)) / imgWidth)
          );
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
      setPopupType("error");
      setMessage("Failed to create PDF.");
    }
  };

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

  return {
    // view state
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
    handleSelectCustomer,
    storeProfile,

    // products and rows
    products,
    rows,
    handleSelectProduct,
    handleAddRow,
    handleRemoveRow,
    handleChange,

    // payment and milestones
    showStep3,
    showStep4,
    paymentMode,
    handlePaymentMode,
    paymentMethod,
    setPaymentMethod,
    transactionId,
    setTransactionId,
    milestones,
    setMilestones,
    handleAddMilestone,
    handleMilestoneChange,
    additionalCharges,
    handleAdditionalChange,
    note,
    setNote,
    partialCashAmount,
    setPartialCashAmount,

    // summary
    invoiceSummary,
    calculateTotal,

    // preview and submit
    previewInvoice,
    setPreviewInvoice,
    showPreview,
    setShowPreview,
    handlePreview,
    handleSubmit,

    // notifications
    popupType,
    setPopupType,
    message,
    setMessage,

    // previous invoices
    invoices,
    todayCollection,
    totalCollection,

    // pdf
    previewRef,
    downloadPreviewAsPDF,
  };
}


