import axiosClient from "./axiosClient";
import { AuthService } from "./authservice.js";

const getStoreProfileId = () =>
  (typeof AuthService.getstoreProfile_id === "function" &&
    AuthService.getstoreProfile_id()) ||
  localStorage.getItem("storeProfile_id");

function getAuthContext() {
  const token = AuthService.getToken?.();
  const store_id = AuthService.getStoreId?.();
  const storeProfile_id = getStoreProfileId();

  if (!token) throw new Error("❌ Missing auth token");
  if (!store_id) throw new Error("❌ Missing store_id");
  if (!storeProfile_id) throw new Error("❌ Missing storeProfile_id");

  return { token, store_id, storeProfile_id };
}

export const dashboard = {
  async getDashboardData(forceRefresh = false) {
    const cacheKey = "dashboardDataCache";
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          localStorage.removeItem(cacheKey);
        }
      }
    }

    const { token, store_id, storeProfile_id } = getAuthContext();

    const res = await axiosClient.get("/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
      params: { store_id, storeProfile_id },
    });

    if (res?.data?.status !== "success") {
      throw new Error(res?.data?.message || "Failed to fetch dashboard data");
    }

    // cache 10 min
    localStorage.setItem(cacheKey, JSON.stringify(res.data));
    setTimeout(() => localStorage.removeItem(cacheKey), 10 * 60 * 1000);

    return res.data;
  },
};
