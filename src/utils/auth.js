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

  getstoreProfileId: () => localStorage.getItem(STORAGE_KEYS.storeProfileIdLS),
  setstoreProfileId: (id) =>
    localStorage.setItem(STORAGE_KEYS.storeProfileIdLS, id),
  clearstoreProfileId: () =>
    localStorage.removeItem(STORAGE_KEYS.storeProfileIdLS),

  clearAll: () => {
    Auth.clearToken();
    Auth.clearStoreId();
    Auth.clearstoreProfileId();
  },
};
