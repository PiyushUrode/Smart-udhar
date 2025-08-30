// src/api/invoiceService.js
import axiosClient from "./axiosClient";
import { AuthService } from "./authservice.js";

function getStoreProfileId() {
  return (
    (typeof AuthService.getStoreProfileId === "function" &&
      AuthService.getStoreProfileId()) ||
    localStorage.getItem("store_profile_id")
  );
}

function getAuthContext() {
  const token = AuthService.getToken?.() || null;
  const store_id = AuthService.getStoreId?.() || null;
  const storeProfile_id = getStoreProfileId() || null;

  if (!token) throw new Error("Missing auth token");
  if (!store_id) throw new Error("Missing store_id");
  if (!storeProfile_id) throw new Error("Missing storeProfile_id");

  return { token, store_id, storeProfile_id };
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

export const InvoiceService = {
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

      let customers = [];
      if (Array.isArray(data)) customers = data;
      else if (Array.isArray(data?.data)) customers = data.data;
      else if (Array.isArray(data?.customers)) customers = data.customers;
      else if (Array.isArray(data?.data?.customers))
        customers = data.data.customers;

      return { success: data?.success ?? true, customers };
    } catch (err) {
      console.error("❌ Fetch customers for invoice error:", err);
      return { success: false, customers: [] };
    }
  },

  async fetchProductsForInvoice({ page, limit } = {}) {
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
        `/store-product/find-all/${store_id}/${storeProfile_id}${qs}`,
        { headers: authHeaders(token) }
      );

      let products = [];
      if (Array.isArray(data)) products = data;
      else if (Array.isArray(data?.data)) products = data.data;
      else if (Array.isArray(data?.products)) products = data.products;
      else if (Array.isArray(data?.data?.products))
        products = data.data.products;

      // sirf name, unit, sales_price, tax lete hain
      const mappedProducts = products.map((p) => ({
        id: p._id,
        name: p.name,
        unit: p.unit,
        sales_price: p.sales_price,
        tax: p.tax,
        type: p.product_type, // inventory / service
      }));

      return { success: data?.success ?? true, products: mappedProducts };
    } catch (err) {
      console.error("❌ Fetch products for invoice error:", err);
      return { success: false, products: [] };
    }
  },

  async createInvoice(payload) {
    try {
      const { token, store_id, storeProfile_id } = getAuthContext();

      const { data } = await axiosClient.post(
        `/invoices/create`,
        { ...payload, store_id, storeProfile_id },
        { headers: authHeaders(token) }
      );

      return { success: data?.success ?? true, invoice: data?.data || data };
    } catch (err) {
      console.error("❌ Create invoice API error:", err);
      return { success: false };
    }
  },
};
