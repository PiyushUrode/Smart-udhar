import { AuthService } from "./authservice.js";
import { api } from "../api/api.js";

// Auth helpers
function getStoreProfileId() {
  return AuthService.getstoreProfile_id?.() || localStorage.getItem("storeProfile_id");
}

function getAuthContext() {
  const token = AuthService.getToken?.();
  const store_id = AuthService.getStoreId?.();
  const storeProfile_id = getStoreProfileId();

  if (!token) throw new Error("❌ Missing auth token");
  if (!store_id) throw new Error("❌ Missing store_id");
  if (!storeProfile_id) throw new Error("❌ Missing storeProfile_id");

  return { token, store_id, storeProfile_id };
}

// CRUD + Filter + Export
const createExpense = async (expenseData) => {
  const { token, store_id, storeProfile_id } = getAuthContext();
  const response = await api.post("/store-expense/create", { ...expenseData, store_id, storeProfile_id }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const updateExpense = async (id, expenseData) => {
  const { token } = getAuthContext();
  const response = await api.put(`/store-expense/update/${id}`, expenseData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const getAllExpenses = async (page = 1, limit = 10) => {
  const { token, store_id, storeProfile_id } = getAuthContext();
  const response = await api.get(
    `/store-expense/find-all/${store_id}/${storeProfile_id}?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};


const filterExpenses = async (filters = {}) => {
  const { token, store_id, storeProfile_id } = getAuthContext();
  const response = await api.post(`/store-expense/filter`, { store_id, storeProfile_id, ...filters }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Excel/PDF Export
const exportExcel = async (startDate, endDate) => {
  const { token } = getAuthContext();
  const response = await api.get(`/store-expense/export-excel?startDate=${startDate}&endDate=${endDate}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `expenses_${startDate}_to_${endDate}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const exportPDF = async (startDate, endDate) => {
  const { token } = getAuthContext();
  const response = await api.get(`/store-expense/export-pdf?startDate=${startDate}&endDate=${endDate}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `expenses_${startDate}_to_${endDate}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

// Excel Upload
const uploadExcel = async (file) => {
  const { token, store_id, storeProfile_id } = getAuthContext();
  const formData = new FormData();
  formData.append("excelFile", file);
  formData.append("store_id", store_id);
  formData.append("storeProfile_id", storeProfile_id);
  formData.append("schema", "Expense");

  const response = await api.post("/store-expense/upload-excel", formData, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export default {
  createExpense,
  updateExpense,
  getAllExpenses,
  filterExpenses,
  exportExcel,
  exportPDF,
  uploadExcel,
};
