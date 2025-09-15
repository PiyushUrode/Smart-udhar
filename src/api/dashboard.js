// src/api/dashboardService.js
import axiosClient from "./axiosClient";
import { AuthService } from "./authservice";

// ----------------- Helpers -----------------
function getAuthContext() {
  const token = AuthService.getToken?.();
  const store_id =
    typeof AuthService.getStoreId === "function" && AuthService.getStoreId();
  const storeProfile_id =
    typeof AuthService.getstoreProfile_id === "function" &&
    AuthService.getstoreProfile_id();

  // fallback to localStorage if missing
  const finalStoreProfileId = storeProfile_id || localStorage.getItem("storeProfile_id");

  if (!token) throw new Error("❌ Missing auth token");
  if (!store_id) throw new Error("❌ Missing store_id");
  if (!finalStoreProfileId) throw new Error("❌ Missing storeProfile_id");

  return { token, store_id, storeProfile_id: finalStoreProfileId };
}

// ----------------- Dashboard Service -----------------
export const DashboardService = {
  /**
   * Get Dashboard Export Data (Purchase, Collection, Invoices etc.)
   * @param {number} year - Year (ex: 2025)
   * @param {number} month - Month (1-12)
   * @returns {Promise<Object>} Dashboard Data
   */
  async getDashboardExport(year, month) {
    try {
      const { token, store_id, storeProfile_id } = getAuthContext();

      const res = await axiosClient.get(
        `/store-invoice/dashboard-export/${store_id}/${storeProfile_id}?year=${year}&month=${month}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Dashboard Export Response:", res.data);
      return res.data;
    } catch (err) {
      console.error(
        "❌ getDashboardExport error:",
        err.response?.data || err.message
      );
      throw err;
    }
  },
};
