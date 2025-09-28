import { AuthService } from "./authservice.js";
import axiosClient from "./axiosclient.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ correct way
import * as XLSX from "xlsx";

// 🔹 Common Auth Context
function getstoreProfile_id() {
  return (
    AuthService.getstoreProfile_id?.() ||
    localStorage.getItem("storeProfile_id")
  );
}

function getAuthContext() {
  const token = AuthService.getToken?.();
  const store_id = AuthService.getStoreId?.();
  const storeProfile_id = getstoreProfile_id();

  if (!token) throw new Error("❌ Missing auth token");
  if (!store_id) throw new Error("❌ Missing store_id");
  if (!storeProfile_id) throw new Error("❌ Missing storeProfile_id");

  return { token, store_id, storeProfile_id };
}

// 🔹 Helper to format date as dd/mm/yyyy
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// 🔹 Fetch Product Data
async function fetchData({ startDate, endDate }) {
  try {
    const { token, store_id, storeProfile_id } = getAuthContext();
    const res = await axiosClient.get(
      `/store-product/find-all/${store_id}/${storeProfile_id}?page=1&limit=1000&startDate=${startDate}&endDate=${endDate}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.products || [];
  } catch (err) {
    console.error("❌ Error fetching product report data", err);
    return [];
  }
}

// 🔹 Fetch Customer Data
async function fetchCustomerData({ startDate, endDate }) {
  try {
    const { token, store_id, storeProfile_id } = getAuthContext();
    const res = await axiosClient.get(
      `/store-customer/find-all/${store_id}/${storeProfile_id}?page=1&limit=1000&startDate=${startDate}&endDate=${endDate}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.customers || [];
  } catch (err) {
    console.error("❌ Error fetching customer report data", err);
    return [];
  }
}

// 🔹 Export Product PDF
async function exportPDF({ startDate, endDate }) {
  const data = await fetchData({ startDate, endDate });
  if (!data.length) {
    alert("No product data available for the selected range.");
    return;
  }

  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Product Report", 14, 15);

  const tableData = data.map((p, index) => [
    index + 1,
    p.name,
    p.category,
    p.quantity,
    p.min_quantity,
    p.sales_price,
    p.purchase_price,
    p.unit,
    p.tax,
    formatDate(p.created_at),
  ]);

  autoTable(doc, {
    startY: 25,
    head: [
      [
        "S.No",
        "Name",
        "Category",
        "Quantity",
        "Min Quantity",
        "Sales Price",
        "Purchase Price",
        "Unit",
        "Tax %",
        "Created At",
      ],
    ],
    body: tableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 10, right: 10 },
  });

  doc.save("product_report.pdf");
}

// 🔹 Export Product Excel
async function exportExcel({ startDate, endDate }) {
  const data = await fetchData({ startDate, endDate });
  if (!data.length) {
    alert("No product data available for the selected range.");
    return;
  }

  const worksheetData = data.map((p, index) => ({
    "S.No": index + 1,
    Name: p.name,
    Category: p.category,
    Quantity: p.quantity,
    "Min Quantity": p.min_quantity,
    "Sales Price": p.sales_price,
    "Purchase Price": p.purchase_price,
    Unit: p.unit,
    "Tax %": p.tax,
    "Created At": formatDate(p.created_at),
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

  worksheet["!cols"] = [
    { wch: 5 },
    { wch: 20 },
    { wch: 15 },
    { wch: 10 },
    { wch: 12 },
    { wch: 15 },
    { wch: 8 },
    { wch: 8 },
    { wch: 15 },
  ];

  XLSX.writeFile(workbook, "product_report.xlsx");
}

// 🔹 Export Customer PDF
async function exportCustomerPDF({ startDate, endDate }) {
  const data = await fetchCustomerData({ startDate, endDate });
  if (!data.length) {
    alert("No customer data available for the selected range.");
    return;
  }

  // Use landscape for wider tables
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(14);
  doc.text("Customer Report", 14, 15);

  const tableData = data.map((c, index) => [
    index + 1,
    c.customId,
    c.name,
    c.mobile,
    c.email,
    c.address,
    c.city,
    c.state,
    c.companyName,
    c.gstNumber,
    formatDate(c.createdAt),
  ]);

  autoTable(doc, {
    startY: 25,
    head: [
      [
        "S.No",
        "Customer ID",
        "Name",
        "Mobile",
        "Email",
        "Address",
        "City",
        "State",
        "Company",
        "GST Number",
        "Created At",
      ],
    ],
    body: tableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 10, right: 10 },
    columnStyles: {
      0: { cellWidth: 10 },   // S.No
      1: { cellWidth: 20 },   // Customer ID
      2: { cellWidth: 25 },   // Name
      3: { cellWidth: 25 },   // Mobile
      4: { cellWidth: 40 },   // Email
      5: { cellWidth: 40 },   // Address
      6: { cellWidth: 20 },   // City
      7: { cellWidth: 20 },   // State
      8: { cellWidth: 35 },   // Company
      9: { cellWidth: 25 },   // GST Number
      10: { cellWidth: 20 },  // Created At
    },
    tableWidth: 'auto', // let it adjust automatically
  });

  doc.save("customer_report.pdf");
}


// 🔹 Export Customer Excel
async function exportCustomerExcel({ startDate, endDate }) {
  const data = await fetchCustomerData({ startDate, endDate });
  if (!data.length) {
    alert("No customer data available for the selected range.");
    return;
  }

  const worksheetData = data.map((c, index) => ({
    "S.No": index + 1,
    "Customer ID": c.customId,
    Name: c.name,
    Mobile: c.mobile,
    Email: c.email,
    Address: c.address,
    City: c.city,
    State: c.state,
    Company: c.companyName,
    "GST Number": c.gstNumber,
    "Created At": formatDate(c.createdAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

  worksheet["!cols"] = [
    { wch: 5 },
    { wch: 12 },
    { wch: 20 },
    { wch: 15 },
    { wch: 25 },
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
  ];

  XLSX.writeFile(workbook, "customer_report.xlsx");
}


 
// 🔹 Fetch Staff Data
async function fetchStaffData({ startDate, endDate }) {
  try {
    const { token, store_id, storeProfile_id } = getAuthContext();
    const res = await axiosClient.get(
      `/store-staff/find-all/${store_id}/${storeProfile_id}?page=1&limit=1000&startDate=${startDate}&endDate=${endDate}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.staff || [];
  } catch (err) {
    console.error("❌ Error fetching staff report data", err);
    return [];
  }
}

async function exportStaffPDF({ startDate, endDate }) {
  const data = await fetchStaffData({ startDate, endDate });
  if (!data.length) {
    alert("No staff data available for the selected range.");
    return;
  }

  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(14);
  doc.text("Staff Report", 14, 15);

  const tableData = data.map((s, index) => [
    index + 1,
    s.firstName + " " + s.lastName,
    s.mobileNumber,
    s.emailId,
    s.city,
    s.state,
    s.roles?.join(", "),
    s.status,
    s.online ? "Yes" : "No",
    formatDate(s.createdAt),
  ]);

  autoTable(doc, {
    startY: 25,
    head: [["S.No", "Name", "Mobile", "Email", "City", "State", "Roles", "Status", "Online", "Created At"]],
    body: tableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: "bold" },
  });

  doc.save("staff_report.pdf");
}

async function exportStaffExcel({ startDate, endDate }) {
  const data = await fetchStaffData({ startDate, endDate });
  if (!data.length) {
    alert("No staff data available for the selected range.");
    return;
  }

  const worksheetData = data.map((s, index) => ({
    "S.No": index + 1,
    Name: s.firstName + " " + s.lastName,
    Mobile: s.mobileNumber,
    Email: s.emailId,
    City: s.city,
    State: s.state,
    Roles: s.roles?.join(", "),
    Status: s.status,
    Online: s.online ? "Yes" : "No",
    "Created At": formatDate(s.createdAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Staff");
  XLSX.writeFile(workbook, "staff_report.xlsx");
}





// 🔹 Fetch Invoice Data
async function fetchInvoiceData({ startDate, endDate }) {
  try {
    const { token, store_id, storeProfile_id } = getAuthContext();
    const res = await axiosClient.get(
      `/store-invoice/find-all/${store_id}/${storeProfile_id}?page=1&limit=1000&startDate=${startDate}&endDate=${endDate}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.data || [];
  } catch (err) {
    console.error("❌ Error fetching invoice report data", err);
    return [];
  }
}


async function exportInvoicePDF({ startDate, endDate }) {
  const data = await fetchInvoiceData({ startDate, endDate });
  if (!data.length) {
    alert("No invoice data available for the selected range.");
    return;
  }

  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(14);
  doc.text("Invoice Report", 14, 15);

  const tableData = data.map((i, index) => [
    index + 1,
    i.invoiceId,
    i.name,
    i.phone,
    i.paymentStatus,
    i.total,
    i.dueBalance,
    i.paymentMode,
    i.paymentMethod,
    formatDate(i.createdAt),
  ]);

  autoTable(doc, {
    startY: 25,
    head: [["S.No", "Invoice ID", "Customer", "Phone", "Status", "Total", "Due", "Pay Mode", "Method", "Created At"]],
    body: tableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: "bold" },
  });

  doc.save("invoice_report.pdf");
}

async function exportInvoiceExcel({ startDate, endDate }) {
  const data = await fetchInvoiceData({ startDate, endDate });
  if (!data.length) {
    alert("No invoice data available for the selected range.");
    return;
  }

  const worksheetData = data.map((inv, index) => ({
    "S.No": index + 1,
    "Invoice ID": inv.invoiceId,
    "Customer Name": inv.customerName || inv.name || "-",
    "Customer Phone": inv.customerPhone || inv.phone || "-",
    Balance: inv.balance || 0,
    "Credit Score": inv.creditScore || "-",
    Products: inv.products
      .map((p) => `${p.name} (${p.qty} ${p.unit}) - ${p.total}`)
      .join(", "),
    "Payment Mode": inv.paymentMode,
    "Payment Method": inv.paymentMethod,
    "Transaction ID": inv.transactionId || "-",
    "Delivery Fee": inv.deliveryFee || 0,
    "Packing Charges": inv.packingCharges || 0,
    Discount: inv.discount || 0,
    "Other Charges": inv.other || 0,
    Note: inv.note || "-",
    Subtotal: inv.subtotal || 0,
    Tax: inv.tax || 0,
    Total: inv.total || 0,
    "Total Received": inv.totalReceived || 0,
    "Due Balance": inv.dueBalance || 0,
    "Payment Status": inv.paymentStatus || "-",    
    "Created At": formatDate(inv.createdAt),
    "Updated At": formatDate(inv.updatedAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
  XLSX.writeFile(workbook, "invoice_report.xlsx");
}


// 🔹 Fetch Expense Data
async function fetchExpenseData({ startDate, endDate }) {
  try {
    const { token, store_id, storeProfile_id } = getAuthContext();
    const res = await axiosClient.get(
      `/store-expense/find-all/${store_id}/${storeProfile_id}?page=1&limit=1000&startDate=${startDate}&endDate=${endDate}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.data || [];
  } catch (err) {
    console.error("❌ Error fetching expense report data", err);
    return [];
  }
}

async function exportExpensePDF({ startDate, endDate }) {
  const data = await fetchExpenseData({ startDate, endDate });
  if (!data.length) {
    alert("No expense data available for the selected range.");
    return;
  }

  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Expense Report", 14, 15);

  const tableData = data.map((e, index) => [
    index + 1,
    formatDate(e.date),
    e.expenseCategory,
    e.itemName,
    e.amount,
    e.vendorName,
    e.gstApplicable ? "Yes" : "No",
    e.paymentMode,
    e.notesOrBill,
  ]);

  autoTable(doc, {
    startY: 25,
    head: [["S.No", "Date", "Category", "Item", "Amount", "Vendor", "GST", "Payment Mode", "Notes"]],
    body: tableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [139, 92, 246], textColor: 255, fontStyle: "bold" },
  });

  doc.save("expense_report.pdf");
}

async function exportExpenseExcel({ startDate, endDate }) {
  const data = await fetchExpenseData({ startDate, endDate });
  if (!data.length) {
    alert("No expense data available for the selected range.");
    return;
  }

  const worksheetData = data.map((e, index) => ({
    "S.No": index + 1,
    Date: formatDate(e.date),
    Category: e.expenseCategory,
    Item: e.itemName,
    Amount: e.amount,
    Vendor: e.vendorName,
    GST: e.gstApplicable ? "Yes" : "No",
    "Payment Mode": e.paymentMode,
    Notes: e.notesOrBill,
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
  XLSX.writeFile(workbook, "expense_report.xlsx");
}

 

const StatementDownload = {
  fetchData,
  exportPDF,
  exportExcel,
  fetchCustomerData,
  exportCustomerPDF,
  exportCustomerExcel,
  fetchStaffData,
  exportStaffPDF,
  exportStaffExcel,
  fetchInvoiceData,
  exportInvoicePDF,
  exportInvoiceExcel,
  fetchExpenseData,
  exportExpensePDF,
  exportExpenseExcel,
};
 
export default StatementDownload;
 
