// src/api/productService.js
import axiosClient from "./axiosClient";
import { AuthService } from "./authservice";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// ---------- Helpers ----------
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

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

function buildFormData(payload, file, extra = {}) {
  const fd = new FormData();

  // add extra fields
  Object.entries(extra).forEach(([k, v]) => fd.append(k, v));

  // add payload
  Object.entries(payload || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    fd.append(k, typeof v === "boolean" ? String(v) : v);
  });

  // add file
  if (file) {
    if (file.size && file.size > MAX_FILE_SIZE_BYTES) {
      const mb = MAX_FILE_SIZE_BYTES / (1024 * 1024);
      throw new Error(`❌ Image too large. Max ${mb} MB allowed`);
    }
    fd.append("product_image", file);
  }

  return fd;
}

// ---------- ProductService ----------
export const ProductService = {
  /**
   * Create product/service
   */
  async createProduct(payload, file, productType = "inventory") {
    try {
      const { token, store_id, storeProfileId } = getAuthContext();

      const fd = buildFormData(payload, file, {
        store_id: store_id.toString(),
        storeProfileId: storeProfileId.toString(),
        product_type: productType,
        sold_quantity: "0",
        ...(file ? {} : { use_default_image: "true" }),
      });

      const { data } = await axiosClient.post("/store-product/create", fd, {
        headers: authHeaders(token),
      });

      return { success: data?.success ?? true, product: data?.data || data };
    } catch (err) {
      console.error("❌ createProduct error:", err);
      return { success: false, product: null, error: err.message };
    }
  },

  /**
   * Fetch all products/services
   */
  async fetchProducts({ page, limit } = {}) {
    try {
      const { token, store_id, storeProfileId } = getAuthContext();

      const qs = page || limit
        ? `?${new URLSearchParams({ ...(page && { page }), ...(limit && { limit }) })}`
        : "";

      const { data } = await axiosClient.get(
        `/store-product/find-all/${store_id}/${storeProfileId}${qs}`,
        { headers: authHeaders(token) }
      );

      const products =
        data?.data?.products ||
        data?.products ||
        data?.data ||
        (Array.isArray(data) ? data : []);

      return { success: data?.success ?? true, products };
    } catch (err) {
      console.error("❌ fetchProducts error:", err);
      return { success: false, products: [] };
    }
  },

  /**
   * Fetch product by ID
   */
  async fetchProductById(id) {
    try {
      const { token } = getAuthContext();

      const { data } = await axiosClient.get(
        `/store-product/findBy-id/${id}`,
        { headers: authHeaders(token) }
      );

      const product = data?.data || data?.product || data;
      return { success: true, product };
    } catch (err) {
      console.error("❌ fetchProductById error:", err);
      return { success: false, product: null, error: err.message };
    }
  },


async getProduct(id) {
  const { token } = getAuthContext();
  const { data } = await axiosClient.get(
    `/store-product/findBy-id/${id}`,
    { headers: authHeaders(token) }
  );
  return data;
}
,

 // src/api/productService.js
// ... (Existing code unchanged until updateProduct)

/**
 * Update product
 */
async updateProduct(id, payload, file = null, productType = "inventory") {
  try {
    const { token, store_id, storeProfileId } = getAuthContext();

    const fd = buildFormData(payload, file, {
      store_id: store_id.toString(),
      storeProfileId: storeProfileId.toString(),
      product_type: productType,
      // Only include use_default_image if no file is provided and no existing image is retained
      ...(file ? {} : { use_default_image: payload.product_image ? "false" : "true" }),
    });

    const { data } = await axiosClient.put(
      `/store-product/update/${id}`,
      fd,
      { headers: authHeaders(token) }
    );

    return { success: data?.success ?? true, product: data?.data || data };
  } catch (err) {
    console.error("❌ updateProduct error:", err);
    throw err; // Throw the error to be handled by the caller
  }
}

};
