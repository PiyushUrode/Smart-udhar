// services/reportService.js
import { AuthService } from "./authService";
import { api } from "../api/api.js";

function getstoreProfileId() {
  return (
    AuthService.getstoreProfileId?.() ||
    localStorage.getItem("storeProfileId")
  );
}
function getAuthContext() {
  const token = AuthService.getToken?.();
  const store_id = AuthService.getStoreId?.();
  const storeProfileId = getstoreProfileId();

  if (!token) throw new Error("❌ Missing auth token");
  if (!store_id) throw new Error("❌ Missing store_id");
  if (!storeProfileId) throw new Error("❌ Missing storeProfileId");

  return { token, store_id, storeProfileId };
}

// 📂 Generic Export (PDF/Excel)
async function exportReport(reportType, format, startDate, endDate, filter) {
  try {
    const { token } = getAuthContext();

    // example: /store-expense/export-pdf?filter=Daily
    const endpoint = `/${reportType}/export-${format}?startDate=${startDate}&endDate=${endDate}${
      filter ? `&filter=${filter}` : ""
    }`;

    const response = await api.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    // ⬇ Trigger download
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

const ReportService = { exportReport };
export default ReportService;
