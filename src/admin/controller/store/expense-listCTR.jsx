import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const API_URL = import.meta.env.VITE_API_URL;

export const useExpenseController = () => {
  const Auth_token = localStorage.getItem("authToken");
  const [mobile, setMobile] = useState("");
  const [storeId, setStoreId] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const token = Auth_token;

  // Fetch all expenses (Admin)
  const fetchAllExpensesAdmin = async (pageNumber = 1, pageLimit = limit) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/expense-list`, {
        params: { page: pageNumber, limit: pageLimit },
        headers: { Authorization: token },
      });

      if (res.data.success) {
        setExpenses(res.data.expenses || []);
        setPage(pageNumber);
        setTotalPages(Math.ceil(res.data.total / pageLimit) || 1);
      }
    } catch (err) {
      console.error("Error fetching admin expenses:", err);
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

  // Fetch expenses with pagination
  const fetchExpenses = async (
    pageNumber = 1,
    businessId = selectedBusiness,
    pageLimit = limit
  ) => {
    if (!storeId || !businessId) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/admin/expense-list/${storeId}/${businessId}`,
        {
          params: { page: pageNumber, limit: pageLimit },
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setExpenses(res.data.expenses || []);
        setPage(pageNumber);
        setTotalPages(Math.ceil(res.data.total / pageLimit) || 1);
      }
    } catch (err) {
      console.error(
        "Error fetching expenses:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePagination = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    storeId
      ? fetchExpenses(newPage, selectedBusiness, limit)
      : fetchAllExpensesAdmin(newPage, limit);
  };

  const handleRowPerPage = (newLimit) => {
    setLimit(newLimit);
    storeId
      ? fetchExpenses(1, selectedBusiness, newLimit)
      : fetchAllExpensesAdmin(1, newLimit);
  };

  // Export to Excel
  const handleExportToExcel = () => {
    if (expenses.length === 0) return;

    const worksheetData = expenses.map((exp, index) => ({
      "S.No": (page - 1) * limit + index + 1,
      "Expense ID": exp._id,
      Date: new Date(exp.date).toLocaleDateString(),
      Category: exp.expenseCategory,
      "Item Name": exp.itemName,
      Amount: exp.amount,
      "Vendor Name": exp.vendorName || "-",
      "GST Applicable": exp.gstApplicable ? "Yes" : "No",
      "Payment Mode": exp.paymentMode,
      "Notes / Bill": exp.notesOrBill || "-",
      "Created At": new Date(exp.createdAt).toLocaleDateString(),
      "Vendor Number": exp.storeMobile || "-",
      "Vendor Shop": exp.businessName || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    XLSX.writeFile(workbook, "expenses.xlsx");
  };

  // Toggle Row Expand
  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  useEffect(() => {
    fetchAllExpensesAdmin();
  }, []);

  return {
    mobile,
    setMobile,
    storeId,
    businesses,
    selectedBusiness,
    setSelectedBusiness,
    expenses,
    page,
    totalPages,
    limit,
    loading,
    expandedRow,
    toggleExpand,
    fetchStoreByMobile,
    fetchExpenses,
    handlePagination,
    handleRowPerPage,
    handleExportToExcel,
  };
};