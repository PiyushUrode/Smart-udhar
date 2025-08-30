// src/context/AuthContext.jsx
import { createContext, useState } from "react";
import { AuthService } from "../api/authservice.js";

// 1. Create Context (not default yet, only named)
export const AuthContext = createContext();

// 2. AuthProvider component - Wrap your app with it
export const AuthProvider = ({ children }) => {
  // State for token and storeId
  const [token, setToken] = useState(AuthService.getToken());
  const [storeId, setStoreId] = useState(AuthService.getStoreId());
  const [loading, setLoading] = useState(false);

  // Login function
  const login = async (mobile, otp) => {
    setLoading(true);
    try {
      const res = await AuthService.loginVerify(mobile, otp);
      setToken(res.token);
      setStoreId(res?.store?.id || null);
      console.log("[AuthContext] login success:", res);
      return res;
    } catch (err) {
      console.error("[AuthContext] login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    AuthService.logout();
    setToken(null);
    setStoreId(null);
    console.log("[AuthContext] logout success");
  };

  // Provider must return value
  return (
    <AuthContext.Provider value={{ token, storeId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
