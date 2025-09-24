import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const API_URL = import.meta.env.VITE_API_URL;

export const useInvoiceController = () => {
  const Auth_token = localStorage.getItem("authToken");
  const [mobile, setMobile] = useState("");
  const [storeId, setStoreId] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const token = Auth_token;

  // Fetch all invoices (Admin)
  const fetchAllInvoicesAdmin = async (pageNumber = 1, pageLimit = limit) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/invoice-list`, {
        params: { page: pageNumber, limit: pageLimit },
        headers: { Authorization: token },
      });

      if (res.data.success) {
        setInvoices(res.data.invoices || []);
        setPage(pageNumber);
        setTotalPages(Math.ceil(res.data.total / pageLimit) || 1);
      }
    } catch (err) {
      console.error("Error fetching admin invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch store by mobile
  const fetchStoreByMobile = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/store-auth/profileBy-number`,
        { mobile },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.store?.length > 0) {
        const id = res.data.store[0]._id;
        setStoreId(id);
        fetchBusinessProfiles(id);
      }
    } catch (err) {
      console.error("Error fetching store:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch businesses
  const fetchBusinessProfiles = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/store-business-profile/find-all/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      setBusinesses(res.data.data || []);
    } catch (err) {
      console.error("Error fetching business profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch invoices
  const fetchInvoices = async (
    pageNumber = 1,
    businessId = selectedBusiness,
    pageLimit = limit
  ) => {
    if (!storeId || !businessId) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/admin/invoice-list/${storeId}/${businessId}`,
        {
          params: { page: pageNumber, limit: pageLimit },
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setInvoices(res.data.invoices || []);
        setPage(pageNumber);
        setTotalPages(Math.ceil(res.data.total / pageLimit) || 1);
      }
    } catch (err) {
      console.error(
        "Error fetching invoices:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePagination = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    storeId
      ? fetchInvoices(newPage, selectedBusiness, limit)
      : fetchAllInvoicesAdmin(newPage, limit);
  };

  const handleRowPerPage = (newLimit) => {
    setLimit(newLimit);
    storeId
      ? fetchInvoices(1, selectedBusiness, newLimit)
      : fetchAllInvoicesAdmin(1, newLimit);
  };

  // Export to Excel
  const handleExportToExcel = () => {
    if (invoices.length === 0) return;

    const worksheetData = invoices.map((inv, index) => ({
      "S.No": (page - 1) * limit + index + 1,
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
      "Store Mobile": inv.storeMobile || "-",
      "Business Name": inv.businessName || "-",
      "Created At": new Date(inv.createdAt).toLocaleDateString(),
      "Updated At": new Date(inv.updatedAt).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");

    XLSX.writeFile(workbook, "invoices.xlsx");
  };

  useEffect(() => {
    fetchAllInvoicesAdmin();
  }, []);

  return {
    mobile,
    setMobile,
    storeId,
    businesses,
    selectedBusiness,
    setSelectedBusiness,
    invoices,
    page,
    totalPages,
    limit,
    loading,
    expandedRow,
    setExpandedRow,
    fetchStoreByMobile,
    fetchInvoices,
    handlePagination,
    handleRowPerPage,
    handleExportToExcel,
  };
};