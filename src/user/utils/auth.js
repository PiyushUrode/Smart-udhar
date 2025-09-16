// src/utils/auth.js
import Cookies from "js-cookie";
import { STORAGE_KEYS } from "../config/constants";

export const Auth = {
  getToken: () => Cookies.get(STORAGE_KEYS.tokenCookie) || null,
  setToken: (token) =>
    Cookies.set(STORAGE_KEYS.tokenCookie, token, {
      sameSite: "Strict",
      secure: window.location.protocol === "https:",
    }),
  clearToken: () => Cookies.remove(STORAGE_KEYS.tokenCookie),

  getStoreId: () => Cookies.get(STORAGE_KEYS.storeIdCookie) || null,
  setStoreId: (id) =>
    Cookies.set(STORAGE_KEYS.storeIdCookie, id, {
      sameSite: "Strict",
      secure: window.location.protocol === "https:",
    }),
  clearStoreId: () => Cookies.remove(STORAGE_KEYS.storeIdCookie),

  getstoreProfile_id: () => localStorage.getItem(STORAGE_KEYS.storeProfile_idLS),
  setstoreProfile_id: (id) =>
    localStorage.setItem(STORAGE_KEYS.storeProfile_idLS, id),
  clearstoreProfile_id: () =>
    localStorage.removeItem(STORAGE_KEYS.storeProfile_idLS),

  clearAll: () => {
    Auth.clearToken();
    Auth.clearStoreId();
    Auth.clearstoreProfile_id();
  },
};
