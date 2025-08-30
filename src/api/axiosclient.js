// src/api/axiosClient.js
import axios from "axios";
import Cookies from "js-cookie";
import { STORAGE_KEYS, API_BASE } from "../config/constant.js";

const axiosClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const token = Cookies.get(STORAGE_KEYS.tokenCookie);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("[axiosClient] Request:", config.url, config.data || {});
  return config;
});

axiosClient.interceptors.response.use(
  (res) => {
    console.log("[axiosClient] Response:", res.data);
    return res;
  },
  (err) => {
    const message =
      err?.response?.data?.message || err.message || "Something went wrong!";
    console.error("[axiosClient] Error:", message);
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
