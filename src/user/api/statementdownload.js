// src/api/reportService.js
import { AuthService } from "./authservice.js";
import { api } from "./api.js";
import axiosClient from "./axiosclient.js";

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

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

// 🔹 Generic Export
async function exportReport(reportType, format, startDate, endDate, filter) {
  try {
    const { token } = getAuthContext();

    const endpoint = `/${reportType}/export-${format}?startDate=${startDate}&endDate=${endDate}${
      filter ? `&filter=${filter}` : ""
    }`;

    const response = await api.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${reportType}_${startDate}_to_${endDate}.${format === "excel" ? "xlsx" : "pdf"}`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error(`❌ Error exporting ${reportType}:`, error.response?.data || error.message);
    throw error;
  }
}

// 🔹 Product-specific Excel Export
async function exportProductsExcel() {
  try {
    const { token, store_id, storeProfile_id } = getAuthContext();
    const response = await axiosClient.get(
      `/store-product/export-excel/${store_id}/${storeProfile_id}`,
      { headers: authHeaders(token), responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `products_${Date.now()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return { success: true };
  } catch (err) {
    console.error("❌ exportProductsExcel error:", err);
    return { success: false, error: err.message };
  }
}

// 🔹 Product-specific PDF Export
async function exportProductsPDF() {
  try {
    const { token, store_id, storeProfile_id } = getAuthContext();
    const response = await axiosClient.get(
      `/store-product/export-pdf/${store_id}/${storeProfile_id}`,
      { headers: authHeaders(token), responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `products_${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return { success: true };
  } catch (err) {
    console.error("❌ exportProductsPDF error:", err);
    return { success: false, error: err.message };
  }
}


async function exportCustomersToExcel() {
  try {
    const { token, store_id, storeProfile_id } = getAuthContext();
    const res = await axiosClient.get(
      `/store-customer/export-excel/${store_id}/${storeProfile_id}`,
      { headers: authHeaders(token), responseType: "blob" }
    );

    // ⬇ Trigger download
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `customers_${Date.now()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return { success: true };
  } catch (err) {
    console.error("❌ exportCustomersToExcel error:", err);
    return { success: false, error: err.message };
  }
}

async function exportCustomersToPDF() {
  try {
    const { token, store_id, storeProfile_id } = getAuthContext();
    const res = await axiosClient.get(
      `/store-customer/export-pdf/${store_id}/${storeProfile_id}`,
      { headers: authHeaders(token), responseType: "blob" }
    );

    if (!res.data || res.data.size === 0) {
      throw new Error("Empty PDF received — check backend export logic");
    }

    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: "application/pdf" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `customers_${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return { success: true };
  } catch (err) {
    console.error("❌ exportCustomersToPDF error:", err);
    return { success: false, error: err.message };
  }
}




const ReportService = {
  exportReport,
  exportProductsExcel,
  exportProductsPDF,
  exportCustomersToExcel,
  exportCustomersToPDF,

};

export default ReportService;
