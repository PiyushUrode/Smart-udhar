// src/api/authService.js
import axiosClient from "./axiosClient";
import Cookies from "js-cookie";

const TOKEN_KEY = "authToken";
const STORE_ID_KEY = "store_id";

export const AuthService = {
  async register(mobile) {
    const { data } = await axiosClient.post("/store-auth/register", {
      mobile,
      roles: "Admin",
    });

    if (data?.store?.id) {
      Cookies.set(STORE_ID_KEY, data.store.id, { expires: 7 });
    }
    return data;
  },

  async verify(mobile, otp) {
    const { data } = await axiosClient.post("/store-auth/verification", {
      mobile,
      roles: "Admin",
      mobile_otp: otp,
    });

    if (data?.token) {
      Cookies.set(TOKEN_KEY, data.token, { expires: 7 });
    }
    return data;
  },

  getToken() {
    return Cookies.get(TOKEN_KEY);
  },

  getStoreId() {
    return Cookies.get(STORE_ID_KEY);
  },

  async loginSendOtp(mobile) {
    const { data } = await axiosClient.post("/store-auth/login-otp", {
      mobile,
      roles: "Admin",
    });
    return data;
  },

  async loginVerify(mobile, otp) {
    const { data } = await axiosClient.post("/store-auth/login-verify", {
      mobile,
      roles: "Admin",
      mobile_otp: otp,
    });

    if (data?.token) {
      Cookies.set(TOKEN_KEY, data.token, { expires: 7 });
    }
    if (data?.store?.id) {
      Cookies.set(STORE_ID_KEY, data.store.id, { expires: 7 });
    }

    return data;
  },

};
