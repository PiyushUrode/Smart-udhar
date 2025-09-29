// src/api/axiosClient.js
import axios from "axios";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import mitt from "mitt";
import { STORAGE_KEYS, API_BASE } from "../config/constant.js";

// Global API Events (logout, session expire, etc.)
export const apiEvents = mitt();

// Custom Axios Instance
const axiosClient = axios.create({
  baseURL: API_BASE || "http://localhost:5000",
  withCredentials: true,
  // timeout: 10000, 
});

// ======================
// 🔹 REQUEST INTERCEPTOR
// ======================
axiosClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get(STORAGE_KEYS.tokenCookie);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Unique request ID for tracing/debugging
    config.headers["X-Request-ID"] = uuidv4();

    console.log(
      `[axiosClient] Request: ${config.method?.toUpperCase()} ${config.url}`,
      config.data || {}
    );

    return config;
  },
  (error) => Promise.reject(error)
);

// ======================
// 🔹 REFRESH TOKEN HANDLER
// ======================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (res) => {
    console.log("[axiosClient] Response:", res.data);
    return res;
  },
  async (err) => {
    const originalRequest = err.config;

    // Token expired -> Handle Refresh Token
    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Agar refresh chal raha hai -> queue me daal do
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosClient(originalRequest);
          })
          .catch((error) => Promise.reject(error));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = Cookies.get(STORAGE_KEYS.refreshTokenCookie);

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // 🔹 Call Refresh API
        const { data } = await axios.post(
          `${API_BASE}/auth/refresh`,
          { refreshToken }, // body me bhej rahe hai
          { withCredentials: true }
        );

        const newToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        // ✅ Save new tokens
        if (newToken) {
          Cookies.set(STORAGE_KEYS.tokenCookie, newToken, { expires: 1 });
          axiosClient.defaults.headers["Authorization"] = "Bearer " + newToken;
        }

        if (newRefreshToken) {
          Cookies.set(STORAGE_KEYS.refreshTokenCookie, newRefreshToken, {
            expires: 7,
            secure: true,
          });
        }

        processQueue(null, newToken);

        // 🔹 Retry failed request
        originalRequest.headers["Authorization"] = "Bearer " + newToken;
        return axiosClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        apiEvents.emit("unauthorized"); // 🔔 Fire logout event
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // Standardized Error Response
    const errorResponse = {
      status: err?.response?.status || 500,
      code: err?.response?.data?.code || "UNKNOWN_ERROR",
      message:
        err?.response?.data?.message ||
        err.message ||
        "Something went wrong!",
    };

    console.error("[axiosClient] Error:", errorResponse);

    return Promise.reject(errorResponse);
  }
);

export default axiosClient;
