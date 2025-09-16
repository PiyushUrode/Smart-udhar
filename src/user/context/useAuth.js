// src/context/useAuth.js
import { useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";  // ✅ named import

// Custom hook for cleaner usage
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
