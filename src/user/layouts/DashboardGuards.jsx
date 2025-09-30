import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardGuards({ children }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
    try {
      const storeId = Cookies.get("store_id");
      const profileId = localStorage.getItem("storeProfile_id");

      if (!storeId || !profileId) {
        setError("⚠️ No active business profile found. Please select one.");
        setChecking(false);

        setTimeout(() => {
          navigate("/dashboard/bussinessList");
        }, 1000);
        return;
      }

      setChecking(false);
    } catch (err) {
      setError("Unexpected error. Please login again.");
      setChecking(false);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  }, [navigate]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">🔍 Checking access...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return <>{children}</>;
}

export default DashboardGuards;
