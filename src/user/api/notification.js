// src/api/notificationService.js
import axiosClient from "./axiosclient.js";
import { AuthService } from "./authservice.js";

// ---------- Helpers ----------
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

// ---------- NotificationService ----------
export const NotificationService = {
  /**
   * Fetch all notifications
   */
 async fetchNotifications({ page = 1, limit = 10 } = {}) {
  try {
    const { token } = getAuthContext();

    const qs = `?${new URLSearchParams({ page, limit })}`;

    console.log("➡️ API Call:", `/notification/list${qs}`);

    const { data } = await axiosClient.get(
      `/notification/list${qs}`,
      { headers: authHeaders(token) }
    );

    console.log("📢 Raw API Response:", data);

    const notifications =
      data?.data || (Array.isArray(data) ? data : []);

    return {
      success: data?.success ?? true,
      notifications,
      count: data?.count || notifications.length,
    };
  } catch (err) {
    console.error("❌ fetchNotifications error:", err);
    return { success: false, notifications: [], count: 0, error: err.message };
  }
}
,

  /**
   * Fetch single notification by ID
   */
  async fetchNotificationById(id) {
    try {
      const { token } = getAuthContext();

      const { data } = await axiosClient.get(
        `/notification/findBy-id/${id}`,
        { headers: authHeaders(token) }
      );

      const notification = data?.data || data;
      return { success: true, notification };
    } catch (err) {
      console.error("❌ fetchNotificationById error:", err);
      return { success: false, notification: null, error: err.message };
    }
  },
};
