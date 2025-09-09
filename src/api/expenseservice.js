import { AuthService } from "./authService";
import { api } from "../api/api.js";

// helper
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

// 🟢 Create Expense
const createExpense = async (expenseData) => {
  try {
    const { token, store_id, storeProfile_id } = getAuthContext();
    const response = await api.post(
      "/store-expense/create",
      { ...expenseData, store_id, storeProfile_id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating expense:", error.response?.data || error.message);
    throw error;
  }
};

// 🟡 Update Expense
const updateExpense = async (id, expenseData) => {
  try {
    const { token } = getAuthContext();
    const response = await api.put(
      `/store-expense/update/${id}`,
      expenseData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating expense:", error.response?.data || error.message);
    throw error;
  }
};

// 🔵 Get All Expenses
const getAllExpenses = async () => {
  try {
    const { token, store_id, storeProfile_id } = getAuthContext();
    const response = await api.get(
      `/store-expense/find-all/${store_id}/${storeProfile_id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error.response?.data || error.message);
    throw error;
  }
};

// 🟠 Filter Expenses
const filterExpenses = async (filters = {}) => {
  try {
    const { token, store_id, storeProfile_id } = getAuthContext();
    const response = await api.post(
      `/store-expense/filter`,
      { store_id, storeProfile_id, ...filters },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error filtering expenses:", error.response?.data || error.message);
    throw error;
  }
};

// 📂 Export Excel
const exportExcel = async (startDate, endDate) => {
  try {
    const { token } = getAuthContext();
    const response = await api.get(
      `/store-expense/export-excel?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // important for file
      }
    );

    // Trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `expenses_${startDate}_to_${endDate}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error exporting Excel:", error.response?.data || error.message);
    throw error;
  }
};

// 📄 Export PDF
const exportPDF = async (startDate, endDate) => {
  try {
    const { token } = getAuthContext();
    const response = await api.get(
      `/store-expense/export-pdf?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );

    // Trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `expenses_${startDate}_to_${endDate}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error exporting PDF:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Export as a single object
const ExpenseService = {
  createExpense,
  updateExpense,
  getAllExpenses,
  filterExpenses,
  exportExcel,
  exportPDF,
};

export default ExpenseService;
