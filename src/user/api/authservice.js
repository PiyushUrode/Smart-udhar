// src/api/authService.js
import axiosClient from "./axiosclient.js";
import Cookies from "js-cookie";
import { STORAGE_KEYS } from "../config/constant.js";

export const AuthService = {
  async register(mobile) {
    console.log("[AuthService] register called with:", mobile);
    const { data } = await axiosClient.post("/store-auth/register", {
      mobile,
      roles: "Admin",
    });
    console.log("[AuthService] register responsnse:", data);

  if (data?.token) {
      Cookies.set(STORAGE_KEYS.tokenCookie, data.token, { expires: 1 });
    }
    if (data?.refreshToken) {
      Cookies.set(STORAGE_KEYS.refreshTokenCookie, data.refreshToken, { expires: 7 });
    }

    if (data?.store?.id) {
      Cookies.set(STORAGE_KEYS.storeIdCookie, data.store.id, { expires: 7 });
    }
    return data;
  },

  async verify(mobile, otp) {
    console.log("[AuthService] verify called with:", { mobile, otp });
    const { data } = await axiosClient.post("/store-auth/verification", {
      mobile,
      roles: "Admin",
      mobile_otp: otp,
    });
    console.log("[AuthService] verify response:", data);

    if (data?.token) {
      Cookies.set(STORAGE_KEYS.tokenCookie, data.token, { expires: 7 });
    }
     if (data?.refreshToken) {
      Cookies.set(STORAGE_KEYS.refreshTokenCookie, data.refreshToken, { expires: 7 });
    }

    return data;
  },

  async loginSendOtp(mobile) {
    console.log("[AuthService] loginSendOtp called with:", mobile);
    const { data } = await axiosClient.post("/store-auth/login-otp", {
      mobile,
      roles: "Admin",
    });
    console.log("[AuthService] loginSendOtp response:", data);
    return data;
  },

  async loginVerify(mobile, otp) {
    console.log("[AuthService] loginVerify called with:", { mobile, otp });
    const { data } = await axiosClient.post("/store-auth/login-verify", {
      mobile,
      roles: "Admin",
      mobile_otp: otp,
    });
    console.log("[AuthService] loginVerify response:", data);

    if (data?.token) {
      Cookies.set(STORAGE_KEYS.tokenCookie, data.token, { expires: 7 });
    }

     if (data?.refreshToken) {
      Cookies.set(STORAGE_KEYS.refreshTokenCookie, data.refreshToken, { expires: 7 });
    }


    if (data?.store_id) {
      Cookies.set(STORAGE_KEYS.storeIdCookie, data.store_id, { expires: 7 });
    }
    return data;
  },

  getToken() {
    const token = Cookies.get(STORAGE_KEYS.tokenCookie);
    console.log("[AuthService] getToken:", token);
    return token;
  },

  getStoreId() {
    const id = Cookies.get(STORAGE_KEYS.storeIdCookie);
    console.log("[AuthService] getStoreId:", id);
    return id;
  },

  logout() {
    console.log("[AuthService] logout called");
    Cookies.remove(STORAGE_KEYS.tokenCookie);
    Cookies.remove(STORAGE_KEYS.refreshTokenCookie);
    Cookies.remove(STORAGE_KEYS.storeIdCookie);
    localStorage.clear();
  },
};
