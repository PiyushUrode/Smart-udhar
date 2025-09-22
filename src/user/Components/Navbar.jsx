import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import smartlogo from "../assets/logo/logo_hr.png";
import { LiaCalculatorSolid } from "react-icons/lia";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { AuthService } from "../api/authservice.js";

const API_URL = import.meta.env.VITE_API_URL;

const Navbar = ({ toggleSidebar }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  // 🔹 Notification State
  const [notifications, setNotifications] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);

  // 🔹 User Dropdown State
  const [openUserMenu, setOpenUserMenu] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${ API_URL}/dashboard/notification`);
        const data = await res.json();

        if (data.success && data.data) {
          setNotifications(data.data);
          if (data.data.length > 0) {
            const latest = data.data[0].createdAt;
            setLastUpdate(new Date(latest));
          }
        }
      } catch (err) {
        console.error("❌ Error fetching notifications:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Logout Handler
  const handleLogout = () => {
    AuthService.logout();
    navigate("/login"); // ✅ redirect to login
  };

  return (
    <nav className="w-full h-16 flex items-center justify-between px-4 bg-white shadow-sm border-b-2 border-gray-200">
      <div className="flex items-center md:gap-24 gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-[#00BFFF] text-xl"
        >
          <FaBars />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <img src={smartlogo} alt="logo" className="h-5 md:h-8" />
        </Link>

        <ul className="hidden md:flex gap-8 text-sm lg:text-base font-interM">
          <li>
            <Link
              to="/dashboard/payment-collectionList"
              className="text-[#3B82F6]"
            >
              {t("Amount Collection")}
            </Link>
          </li>
          <li>
            <Link to="/dashboard/credit-score" className="text-[#3B82F6]">
              {t("Avg Credit Score")}
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="text-[#3B82F6]">
              {t("Remainder")}
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="text-[#3B82F6]">
              {t("Support")}
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 text-blue-500 text-xl relative">
        {/* Language Dropdown */}
        <select
          onChange={handleLanguageChange}
          className="w-40 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition"
        >
          <option value="en">English (EN)</option>
          <option value="hi">हिंदी (HI)</option>
        </select>

        {/* Calculator */}
        <LiaCalculatorSolid
          onClick={() => navigate("/dashboard/gst-calculator")}
          className="hover:text-bluecol cursor-pointer"
          title={t("calculator")}
        />

        <div className="relative">
          <FaBell
            onClick={() => navigate("/dashboard/notification")}
            className="hover:text-bluecol cursor-pointer"
            title="Notifications"
          />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
              {notifications.length}
            </span>
          )}
        </div>

        {/* Last Update Time */}
        {lastUpdate && (
          <span className="hidden md:block text-xs text-gray-500">
            Updated {lastUpdate.toLocaleTimeString()}
          </span>
        )}

        {/* User Dropdown */}
        <div className="relative">
          <FaUserCircle
            onClick={() => setOpenUserMenu((prev) => !prev)}
            className="hover:text-bluecol cursor-pointer"
            title="User Menu"
          />
          {openUserMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 text-sm">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
