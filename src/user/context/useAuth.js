import { useContext } from "react";
import { AuthContext } from "../api/AuthContext.js"; // ✅ ab sahi import


export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
