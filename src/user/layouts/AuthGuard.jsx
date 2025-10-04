import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

function AuthGuard({ children }) {
  const token = Cookies.get("auth_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AuthGuard;
