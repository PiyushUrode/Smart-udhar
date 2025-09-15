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

// ✅ Normalize Array Utils (safe response handling)
function normalizeArray(data, keys = []) {
  if (Array.isArray(data)) return data;
  for (let key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
}

// ----------------- Invoice Service -----------------
export const Invoice = {
  // ----------------- Customers -----------------
  async fetchCustomersForInvoice({ page, limit } = {}) {
    try {
      const { token, store_id, storeProfile_id } = getAuthContext();

      const qs =
        page || limit
          ? `?${new URLSearchParams({
              ...(page ? { page: String(page) } : {}),
              ...(limit ? { limit: String(limit) } : {}),
            }).toString()}`
          : "";

      const { data } = await axiosClient.get(
        `/store-customer/find-all/${store_id}/${storeProfile_id}${qs}`,
        { headers: authHeaders(token) }
      );

      const customers = normalizeArray(data, [
        "data",
        "customers",
        "data.customers",
      ]);

      console.log("✅ [InvoiceService] Customers:", customers);

      return { success: true, customers };
    } catch (err) {
      console.error("❌ Fetch customers error:", err);
      return { success: false, customers: [] };
    }
  },

  // ----------------- Products -----------------
 async getProducts() {
  try {
    const { token, store_id, storeProfile_id } = getAuthContext();

    const { data } = await axios.get(
      `${API_BASE}/store-product/find-all/${store_id}/${storeProfile_id}`,
      { headers: authHeaders(token) }
    );

    const products = normalizeArray(data, ["products", "data", "items"]);

    console.log("✅ [InvoiceService] Products:", products);
    return { success: true, products };
  } catch (err) {
    console.error("❌ Product fetch error:", err.message);
    return { success: false, products: [] };
  }
},


 // ----------------- Invoice Create -----------------
async createInvoice(payload) {
  try {
    const { token, store_id, storeProfile_id } = getAuthContext();

    // Base structure
    const invoiceData = {
      ...payload,
      store_id,
      storeProfile_id,

      customerId: payload.customerId || null,
      products: payload.products || [],

      // ✅ Additional charges fallback
      additionalCharges: payload.additionalCharges || {
        deliveryFee: 0,
        packingCharges: 0,
        discount: 0,
        other: 0,
      },
    };

    // ✅ Only include milestones if paymentMode is "credit"
    if (payload.paymentMode === "credit" && Array.isArray(payload.milestones)) {
      invoiceData.milestones = payload.milestones;
    }

    const { data } = await axiosClient.post(
      `/store-invoice/create`,
      invoiceData,
      { headers: authHeaders(token) }
    );

    console.log("✅ [InvoiceService] Created invoice:", data);
    return { success: true, invoice: data?.data || data };
  } catch (err) {
    console.error("❌ Create invoice API error:", err.response?.data || err);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to create invoice",
    };
  }
}
,

  // ----------------- Cash / Credit (Debt) Logic -----------------
  async createPayment({ invoiceId, amount, mode = "cash", customerId }) {
    try {
      const { token, store_id, storeProfile_id } = getAuthContext();

      const payload = {
        invoiceId,
        amount,
        mode, // "cash" | "credit" | "upi" | "card"
        customerId,
        store_id,
        storeProfile_id,
      };

      const { data } = await axiosClient.post(
        `/payments/create`,
        payload,
        { headers: authHeaders(token) }
      );

      console.log("✅ [InvoiceService] Payment success:", data);

      return { success: true, payment: data?.data || data };
    } catch (err) {
      console.error("❌ Payment error:", err.response?.data || err);
      return {
        success: false,
        message: err.response?.data?.message || "Payment failed",
      };
    }
  },

  // ----------------- Get Pending Dues (Debt Tracking) -----------------
  async getCustomerDue(customerId) {
    try {
      const { token, store_id, storeProfile_id } = getAuthContext();

      const { data } = await axiosClient.get(
        `/payments/due/${store_id}/${storeProfile_id}/${customerId}`,
        { headers: authHeaders(token) }
      );

      console.log("✅ [InvoiceService] Customer Due:", data);
      return { success: true, due: data?.due || 0 };
    } catch (err) {
      console.error("❌ Get customer due error:", err.response?.data || err);
      return { success: false, due: 0 };
    }
  },

  // ----------------- Get Invoice by ID -----------------
async getInvoiceById(invoiceId) {
  try {
    const { token, store_id, storeProfile_id } = getAuthContext();

    const { data } = await axiosClient.get(
      `/store-invoice/find-one/${store_id}/${storeProfile_id}/${invoiceId}`,
      { headers: authHeaders(token) }
    );

    console.log("✅ [InvoiceService] Invoice details:", data);
    return { success: true, invoice: data?.data || data };
  } catch (err) {
    console.error("❌ Get invoice error:", err.response?.data || err);
    return { success: false, invoice: null };
  }
} ,

  async updateInvoice(invoiceId, payload) {
    try {
      const { token, store_id, storeProfile_id } = getAuthContext();

      // merge mandatory fields
      const updateData = { ...payload, store_id, storeProfile_id };

      const { data } = await axiosClient.put(
        `/store-invoice/update/${invoiceId}`,
        updateData,
        { headers: authHeaders(token) }
      );

      console.log("✅ [InvoiceService] Invoice updated:", data);
      return { success: true, invoice: data?.data || data };
    } catch (err) {
      console.error("❌ Update invoice error:", err.response?.data || err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update invoice",
      };
    }
  },

  // ✅ 2. Delete invoice
  async deleteInvoice(invoiceId) {
    try {
      const { token } = getAuthContext();

      const { data } = await axiosClient.post(
        `/store-invoice/delete/${invoiceId}`,
        {},
        { headers: authHeaders(token) }
      );

      console.log("✅ [InvoiceService] Invoice deleted:", data);
      return { success: true, deleted: true };
    } catch (err) {
      console.error("❌ Delete invoice error:", err.response?.data || err);
      return { success: false, deleted: false };
    }
  },

  // ✅ 3. Get all invoices (for a store)
// ----------------- Get all invoices (for a store) -----------------
async getAllInvoices() {
  try {
    const { token, store_id, storeProfile_id } = getAuthContext();

    const { data } = await axiosClient.get(
      `/store-invoice/find-all/${store_id}/${storeProfile_id}`,
      { headers: authHeaders(token) }
    );

    const invoices = normalizeArray(data, ["data", "invoices", "items"]);

    // ✅ Calculate today and total collection
    let todayCollection = 0;
    let totalCollection = 0;

    const today = new Date().toISOString().split("T")[0]; // e.g. 2025-09-05

    invoices.forEach((inv) => {
      const createdDate = new Date(inv.createdAt).toISOString().split("T")[0];

      // total collection = sum of invoice.total
      totalCollection += inv.total || 0;

      // today’s collection = only invoices created today
      if (createdDate === today) {
        todayCollection += inv.total || 0;
      }
    });

    console.log("✅ [InvoiceService] All invoices:", invoices);
    console.log("📌 Today Collection:", todayCollection);
    console.log("📌 Total Collection:", totalCollection);

    return { success: true, invoices, todayCollection, totalCollection };
  } catch (err) {
    console.error("❌ Get all invoices error:", err.response?.data || err);
    return { success: false, invoices: [], todayCollection: 0, totalCollection: 0 };
  }
}
,

  async updateLowStock({ productId, leftProductQty, markAsRead = false }) {
  const { token, store_id, storeProfile_id } = getAuthContext();

  const payload = {
    store_id,
    storeProfile_id,
    productId,
    updateData: { markAsRead, leftProductQty },
  };

  const { data } = await axiosClient.post(
    `/store-invoice/update-low-stock-alert`,
    payload,
    { headers: authHeaders(token) }
  );

  return { success: true, lowStock: data?.data || data };
}
,

  // ✅ 6. Filter invoices by type (due, overdue, thisWeek, etc.)
 async filterInvoices(filterType = "overdue") {
  const { token } = getAuthContext();
  const { data } = await axiosClient.get(
    `/store-invoice/filter?filterType=${filterType}`,
    { headers: authHeaders(token) }
  );
  return { success: true, invoices: normalizeArray(data, ["data", "invoices"]) };
},


  // ✅ 7. Update milestone payments (mark paid/unpaid, counted)
  // ✅ FIXED updateMilestones
async updateMilestones(invoiceId, milestones = []) {
  try {
    const { token } = getAuthContext();
    const payload = { milestones };

    const { data } = await axiosClient.put(
      `/store-customer-invoice/paid-milestone/${invoiceId}`,
      payload,
      { headers: authHeaders(token) }
    );

    return {
      success: true,
      invoice: data?.data || null,          // 🔥 Full invoice object return
      milestones: data?.data?.milestones || [] // Safe milestone access
    };
  } catch (err) {
    console.error("❌ Update milestones error:", err.response?.data || err);
    return { success: false, invoice: null, milestones: [] };
  }
}
,


  // ✅ 8. Export invoice data (PDF/Excel) based on filter
  async exportFilteredPDF(filterType = "thisWeek") {
  const { token } = getAuthContext();
  const res = await axios.get(
    `${API_BASE}/store-invoice/export-filter-data?filterType=${filterType}`,
    { headers: authHeaders(token), responseType: "blob" }
  );

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `invoice-${filterType}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();

  return { success: true };
}
,



};