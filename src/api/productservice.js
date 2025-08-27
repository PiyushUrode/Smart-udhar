// src/api/productService.js
import axiosClient from "./axiosClient";
import { AuthService } from "./authservice";

/**
 * ProductService
 * - centralizes product/service create API calls
 * - expects payload plain object (no product_image file)
 * - file optional: if provided will be sent
 * - if no file is provided, we set a flag "use_default_image" to true
 *
 * NOTE:
 * - Keep MAX_FILE_SIZE in sync with backend multer limits.
 */
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB safe default (adjust to match backend)

export const ProductService = {
  /**
   * createProduct
   * @param {Object} payload - all product fields except product_image (strings/numbers)
   * @param {File|null} file - product image File | null
   * @param {String} productType - "inventory" or "service"
   */
  async createProduct(payload, file, productType = "inventory") {
    const token = AuthService.getToken();
    const storeId = AuthService.getStoreId();
    const storeProfileId = localStorage.getItem("store_profile_id");

    console.log("📌 ProductService.createProduct -> token:", token);
    console.log("📌 ProductService.createProduct -> storeId:", storeId);
    console.log("📌 ProductService.createProduct -> storeProfileId:", storeProfileId);

    if (!token || !storeId || !storeProfileId) {
      throw new Error("Missing authentication or store details");
    }

    // file size check guard (frontend) to avoid backend MullterError
    if (file && file.size && file.size > MAX_FILE_SIZE_BYTES) {
      const mb = MAX_FILE_SIZE_BYTES / (1024 * 1024);
      throw new Error(`Selected image is too large. Max ${mb} MB allowed.`);
    }

    const fd = new FormData();

    // mandatory relations
    fd.append("store_id", storeId.toString().trim());
    fd.append("storeProfile_id", storeProfileId.toString().trim());

    // required metadata
    fd.append("product_type", productType); // inventory | service
    fd.append("sold_quantity", "0");

    // Append payload fields (skip undefined/null & skip product_image if present in payload)
    Object.entries(payload || {}).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      // convert boolean to string because FormData stores strings/files
      const value = typeof v === "boolean" ? (v ? "true" : "false") : v;
      fd.append(k, value);
    });

    // If file present -> append file
    if (file) {
      fd.append("product_image", file);
    } else {
      // Tell backend to use default image (backend must implement this flag)
      // If backend already uses default when no file provided, this is optional.
      fd.append("use_default_image", "true");
    }

    console.log("📤 Sending FormData to backend:");
    for (let [key, val] of fd.entries()) {
      // show file.name for file entries
      if (val instanceof File) {
        console.log(`   ${key}: File { name: ${val.name}, size: ${val.size} }`);
      } else {
        console.log(`   ${key}:`, val);
      }
    }

    const { data } = await axiosClient.post("/store-product/create", fd, {
      headers: { Authorization: `Bearer ${token}` },
      // do NOT set Content-Type manually for multipart/form-data; browser sets boundary.
    });

    console.log("✅ ProductService.createProduct -> response:", data);
    return data;
  },

  // (Optional) you can later add update/get functions here like createProduct but not required now
};
