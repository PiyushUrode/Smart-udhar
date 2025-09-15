// src/api/settingService.js
import axiosClient from "./axiosClient";
import { AuthService } from "./authservice.js";
import Cookies from "js-cookie";
import { API_BASE } from "../config/constant.js";
import axios from "axios";

// ----------------- Helpers -----------------
function getstoreProfile_id() {
  return (
    (typeof AuthService.getstoreProfile_id === "function" &&
      AuthService.getstoreProfile_id()) ||
    localStorage.getItem("storeProfile_id")
  );
}

export function getAuthContext() {
  const token = AuthService.getToken?.() || Cookies.get("authToken") || null;
  const store_id = AuthService.getStoreId?.() || Cookies.get("store_id") || null;
  const storeProfile_id = getstoreProfile_id() || null;

  if (!token) throw new Error("Missing auth token");
  if (!store_id) throw new Error("Missing store_id");
  if (!storeProfile_id) throw new Error("Missing storeProfile_id");

  return { token, store_id, storeProfile_id };
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}


// ================= Service ==================
const SettingsService = {









  
  // ---------------- General Settings ----------------
  async createGeneralSettings(payload) {
    const { token, store_id, storeProfile_id } = getAuthContext();
    const res = await axios.post(
      `${API_BASE}/general-settings/create`,
      { ...payload, store_id, storeProfile_id },
      { headers: authHeaders(token) }
    );
    return res.data;
  },

  async updateGeneralSettings(id, payload) {
    const { token } = getAuthContext();
    const res = await axios.put(
      `${API_BASE}/general-settings/update/${id}`,
      payload,
      { headers: authHeaders(token) }
    );
    return res.data;
  },

  async getGeneralSettingsById(id) {
    const { token } = getAuthContext();
    const res = await axios.get(
      `${API_BASE}/general-settings/findBy-id/${id}`,
      { headers: authHeaders(token) }
    );
    return res.data;
  },


 async createInvoiceTemplateSettings(payload) {
    const { token, store_id, storeProfile_id } = getAuthContext();
    

  const res = await axios.post(
    `${API_BASE}/invoice-template-settings/create`,
    { ...payload, store_id, storeProfile_id }, 
    { headers: authHeaders(token) }
  );
  return res.data;
}
,
 async updateInvoiceTemplateSettings(id, payload) {
  const { token, store_id, storeProfile_id } = getAuthContext();
  const res = await axios.put(
    `${API_BASE}/invoice-template-settings/update/${id}`,
    { ...payload, store_id, storeProfile_id }, 
    { headers: authHeaders(token) }
  );
  return res.data;
}
,

  async getInvoiceTemplateSettingsById(id) {
    const { token } = getAuthContext();
    const res = await axios.get(
      `${API_BASE}/invoice-template-settings/findBy-id/${id}`,
      { headers: authHeaders(token) }
    );
    return res.data;
  },

  // ---------------- Payment Setup ----------------
  async createPaymentSetup(payload) {
    const { token, store_id, storeProfile_id } = getAuthContext();
    const res = await axios.post(
      `${API_BASE}/payment-setup/create`,
      { ...payload, store_id, storeProfile_id },
      { headers: authHeaders(token) }
    );
    return res.data;
  },

  async updatePaymentSetup(id, payload) {
    const { token } = getAuthContext();
    const res = await axios.put(
      `${API_BASE}/payment-setup/update/${id}`,
      payload,
      { headers: authHeaders(token) }
    );
    return res.data;
  },

  async getPaymentSetupById(id) {
    const { token } = getAuthContext();
    const res = await axios.get(
      `${API_BASE}/payment-setup/findBy-id/${id}`,
      { headers: authHeaders(token) }
    );
    return res.data;
  },
};

export default SettingsService;
