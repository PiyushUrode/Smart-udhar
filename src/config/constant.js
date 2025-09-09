// src/config/constants.js
export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Storage Keys (consistent naming)
export const STORAGE_KEYS = {
  tokenCookie: "authToken",          // cookie
  storeIdCookie: "store_id",         // cookie
  storeProfile_idLS: "storeProfile_id", // localStorage
};

// API Field Keys (server contract)
export const API_FIELDS = {
  store_id: "store_id",
  storeProfile_id: "storeProfile_id", // ✅ use snake_case as backend expects
  product_type: "product_type",
};


// storeProfile_id