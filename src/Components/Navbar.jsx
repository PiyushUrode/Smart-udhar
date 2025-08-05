import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import smartlogo from "../assets/logo/logo_hr.png";
import { LiaCalculatorSolid } from "react-icons/lia";
import { useTranslation } from "react-i18next"; // 👈 import

const Navbar = ({ toggleSidebar }) => {
  const { t, i18n } = useTranslation(); // 👈 use hook

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <nav className="w-full h-16 flex items-center justify-between px-4 bg-white shadow-sm border-b-2 border-gray-200">
      <div className="flex items-center md:gap-24 gap-4">
        <button onClick={toggleSidebar} className="md:hidden text-[#00BFFF] text-xl">
          <FaBars />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <img src={smartlogo} alt="logo" className="h-5 md:h-8" />
        </Link>

        <ul className="hidden md:flex gap-8 text-sm   lg:text-base  font-interM ">
          <li><Link to="/dashboard" className="text-[#3B82F6]">{t("Amount Collection")}</Link></li>
          <li><Link to="/transactions" className="text-[#3B82F6]">{t("Avg Credit Score")}</Link></li>
          <li><Link to="/reports" className="text-[#3B82F6]">{t("Remainder")}</Link></li>
          <li><Link to="/budget" className="text-[#3B82F6] ">{t("Support")}</Link></li>
        </ul>
      </div>

      <div className="flex items-center gap-4 text-blue-500 text-xl">

        {/* Language Dropdown */}
        <select
          onChange={handleLanguageChange}
          className="text-sm bg-transparent text-gray-700 px-1"
        >
          <option value="en">EN</option>
          <option value="hi">हिंदी</option>
        </select>

        {/* Tooltip Example using title */}
        <LiaCalculatorSolid className="hover:text-bluecol cursor-pointer" title={t("calculator")} />
        <FaBell className="hover:text-bluecol cursor-pointer" />
        <FaUserCircle className="hover:text-bluecol cursor-pointer" />


      </div>
    </nav>
  );
};

export default Navbar;
