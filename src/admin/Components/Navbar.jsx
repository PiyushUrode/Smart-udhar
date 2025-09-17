import { FaBell, FaUserCircle, FaBars, FaEnvelope, FaCog, FaSignOutAlt, FaChartBar, FaUser, FaWrench } from "react-icons/fa";
import { Link } from "react-router-dom";
import smartlogo from "../assets/logo/logo_hr.png";
import { LiaCalculatorSolid } from "react-icons/lia";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const Navbar = ({ toggleSidebar }) => {
  const { t, i18n } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <nav className="w-full h-20 flex items-center justify-between px-4 bg-white shadow-sm border-b-2 border-gray-200">
      {/* Left section: Logo + Nav */}
      <div className="flex items-center md:gap-4 gap-4">
        <button onClick={toggleSidebar} className="md:hidden text-[#00BFFF] text-xl">
          <FaBars />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <img src={smartlogo} alt="logo" className="h-5 md:h-8" />
        </Link>

        {/* <ul className=" md:flex gap-8 text-sm lg:text-base font-interM ">
          <li><Link to="/dashboard" className="text-[#3B82F6]">{t("Amount Collection")}</Link></li>
          <li><Link to="/transactions" className="text-[#3B82F6]">{t("Avg Credit Score")}</Link></li>
          <li><Link to="/reports" className="text-[#3B82F6]">{t("Remainder")}</Link></li>
          <li><Link to="/budget" className="text-[#3B82F6]">{t("Support")}</Link></li>
        </ul> */}
      </div>

<div className="flex items-center gap-5 text-blue-500 text-xl">

  {/* Search Input */}
  <div className="bg-white hidden md:block rounded-md shadow-sm border-2 flex items-center pr-12 h-10 ">
    <input
      type="text"
      placeholder="Search"
      className="text-sm px-1 py-1 focus:outline-none w-32 bg-white"
    />
  </div>

  {/* Language Selectsadsador */}

  <div className="bg-white rounded-md p-1 shadow-sm border">
    <select
      onChange={handleLanguageChange}
      className="text-sm bg-transparent text-gray-700 focus:outline-none"
    >
      <option value="en">🇺🇸</option>
      <option value="hi">🇮🇳</option>
    </select>
  </div>

  {/* Calculasdasdtor */}
  <div className="bg-white rounded-md p-2 hidden md:block shadow-sm border hover:bg-gray-100 cursor-pointer">
    <LiaCalculatorSolid title={t("calculator")} />
  </div>

  {/* Message Iasdsadcon */}
  <div className="relative bg-white rounded-md p-2 shadow-sm border hover:bg-gray-100 cursor-pointer">
    <FaEnvelope />
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5">+3</span>
  </div>

  {/* Notification Icon */}
  <div className="relative bg-white rounded-md p-2 shadow-sm border hover:bg-gray-100 cursor-pointer">
    <FaBell />
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5">+5</span>
  </div>

  {/* Settings Icon */}
  <div className="bg-white rounded-md p-2 hidden md:block shadow-sm border hover:bg-gray-100 cursor-pointer">
    <FaCog />
  </div>



  {/* Admin Image & Dropdown */}
  <div className="relative hidden md:block">
    <img
      src="https://i.pravatar.cc/300"
      onClick={() => setShowDropdown(!showDropdown)}
      className="w-10 h-10 rounded-full cursor-pointer border shadow-sm"
      alt="Admin"
    />
    {showDropdown && (
      <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg z-50 text-sm overflow-hidden">
        <div className="p-4 border-b flex items-center gap-3">
          <img src="https://i.pravatar.cc/300" className="w-10 h-10 rounded-full" alt="Admin" />
          <div>
            <p className="font-semibold text-gray-800">Admin</p>
            <p className="text-gray-500 text-xs">Administrator</p>
          </div>
        </div>
        <Link to="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
          <FaUser /> My Profile
        </Link>
        <Link to="/settings" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
          <FaWrench /> Settings
        </Link>
        <Link to="/reports" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
          <FaChartBar /> Reports
        </Link>
        <button className="flex items-center gap-2 w-full text-red-600 px-4 py-2 hover:bg-red-100">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    )}
  </div>
</div>

    </nav>
  );
};

export default Navbar;
