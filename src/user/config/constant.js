// src/config/constants.js

// 🌍 API Base URL (environment-wise)
export const API_BASE =
  import.meta.env.VITE_API_URL  || "http://localhost:5000";

console.log("[Config] API_BASE:", API_BASE);

// ==============================
// 🔹 Storage Keys (Cookies/LS/SS)
// ==============================
export const STORAGE_KEYS = Object.freeze({
  tokenCookie: "authToken",            // Access Token
  refreshTokenCookie: "refreshToken",  // Refresh Token
  storeIdCookie: "store_id",           // Store ID
  storeProfileIdLS: "storeProfile_id", // Store Profile
  themeMode: "theme_mode",
  language: "language",
});

// ==============================
// 🔹 API Field Keys (Backend Contract)
// ==============================
// ✅ Yeh ensure karega ki frontend me ek hi jagah define ho aur backend ka
// field mapping consistent ho (snake_case vs camelCase confusion avoid hoga).
export const API_FIELDS = Object.freeze({
  store_id: "store_id",
  storeProfile_id: "storeProfile_id",
  product_type: "product_type",
  user_id: "user_id",
  role_id: "role_id",
});

// ==============================
// 🔹 Status Codes (common use)
// ==============================
export const STATUS_CODES = Object.freeze({
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
});

// ==============================
// 🔹 App Config Flags
// ==============================
export const APP_CONFIG = Object.freeze({
  APP_NAME: "MyHighTicketApp",
  VERSION: "1.0.0",
  DEFAULT_LANGUAGE: "en",
  SUPPORTED_LANGUAGES: ["en", "hi"],
  ITEMS_PER_PAGE: 20,
});
