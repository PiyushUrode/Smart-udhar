import { useState, useEffect } from "react";
import { AuthService } from "../api/authservice.js";
import { apiEvents } from "../api/axiosclient.js";
import { AuthContext } from "../api/AuthContext.js"; // ✅ ab sahi import

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(AuthService.getToken());
  const [storeId, setStoreId] = useState(AuthService.getStoreId());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => logout();
    apiEvents.on("unauthorized", handleUnauthorized);
    return () => apiEvents.off("unauthorized", handleUnauthorized);
  }, []);

  const login = async (mobile, otp) => {
    setLoading(true);
    try {
      const res = await AuthService.loginVerify(mobile, otp);
      setToken(res.token);
      setStoreId(res?.store?.id || null);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setToken(null);
    setStoreId(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, storeId, login, logout, loading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
