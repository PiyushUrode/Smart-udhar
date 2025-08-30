// src/api/productService.js
import axiosClient from "./axiosClient";
import { AuthService } from "./authservice";

/**
 * ProductService
 * - centralizes product/service APIs (create, fetch, update)
 * - handles auth & store context
 * - supports optional product image upload
 */
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB safe default

// ---------- Helpers ----------
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

// ---------- ProductService ----------
export const ProductService = {
  /**
   * Create new product/service
   * @param {Object} payload - product fields (excluding product_image)
   * @param {File|null} file - optional image file
   * @param {String} productType - "inventory" | "service"
   */
  async createProduct(payload, file, productType = "inventory") {
    try {
      const { token, store_id, storeProfile_id } = getAuthContext();

      // file size check guard
      if (file && file.size && file.size > MAX_FILE_SIZE_BYTES) {
        const mb = MAX_FILE_SIZE_BYTES / (1024 * 1024);
        throw new Error(`Selected image is too large. Max ${mb} MB allowed.`);
      }

      const fd = new FormData();

      // mandatory relations
      fd.append("store_id", store_id.toString().trim());
      fd.append("storeProfile_id", storeProfile_id.toString().trim());

      // required metadata
      fd.append("product_type", productType); // inventory | service
      fd.append("sold_quantity", "0");

      // append payload fields (skip null/undefined)
      Object.entries(payload || {}).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        const value = typeof v === "boolean" ? (v ? "true" : "false") : v;
        fd.append(k, value);
      });

      // append image or fallback flag
      if (file) {
        fd.append("product_image", file);
      } else {
        fd.append("use_default_image", "true");
      }

      const { data } = await axiosClient.post("/store-product/create", fd, {
        headers: authHeaders(token),
      });

      return { success: data?.success ?? true, product: data?.data || data };
    } catch (err) {
      console.error("❌ ProductService.createProduct error:", err);
      return { success: false, product: null, error: err.message };
    }
  },

  /**
   * Fetch all products/services (paginated)
   */
  async fetchProducts({ page, limit } = {}) {
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

      return { success: data?.success ?? true, products };
    } catch (err) {
      console.error("❌ Fetch products error:", err);
      return { success: false, products: [] };
    }
  },
};
