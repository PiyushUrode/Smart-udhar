import { Link } from "react-router-dom";
import { useState, useEffect } from "react";  // ← useEffect ऐड करें
import axios from "axios";  // ← API के लिए
import Cookies from "js-cookie";  // ← Token के लिए
import {
  FaTachometerAlt, FaBuilding, FaInfoCircle, FaBoxOpen, FaConciergeBell,
  FaUserFriends, FaPlusCircle, FaFileInvoice, FaMoneyBillWave, FaStar,
  FaFileAlt, FaDownload, FaCog, FaBell, FaCalculator, FaGift, FaClock,
  FaSync, FaHeadphones, FaUsers, FaChartLine
} from "react-icons/fa";



const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const sections = [
  {
    title: "Main Menu",
    items: [
      { label: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    ],
  },
  {
    title: "Business Profile",
    items: [
      { label: "Add Business", icon: <FaBuilding />, path: "/dashboard/information" },
      { label: "Bussiness List", icon: <FaBuilding />, path: "/dashboard/bussinessList" },
    ],
  },
  {
    title: "Items",
    items: [
      { label: " Add Products", icon: <FaBoxOpen />, path: "/dashboard/product" },
      { label: "Product List", icon: <FaConciergeBell />, path: "/dashboard/product-list" },
      // { label: "Stock-list", icon: <FaConciergeBell />, path: "/dashboard/stock-list" },
    ],
  },
  {
    title: "People",
    items: [
      { label: "Add Staff", icon: <FaUserFriends />, path: "/dashboard/staff-details" },
      { label: "Staff Roles", icon: <FaUserFriends />, path: "/dashboard/staff-role" },
      { label: "Add Customer", icon: <FaPlusCircle />, path: "/dashboard/add-customer" },
      { label: "Customer Details", icon: <FaUsers />, path: "/dashboard/customer-details" },
    ],
  },
  {
    title: "Transactions",
    items: [
      { label: "Create Invoice", icon: <FaFileInvoice />, path: "/dashboard/create-invoice" },
      // { label: "Payment Collection", icon: <FaMoneyBillWave />, path: "/dashboard/payment-collection" },
      { label: "Payment Collection List", icon: <FaMoneyBillWave />, path: "/dashboard/payment-collectionList" },
      { label: "Credit Score", icon: <FaStar />, path: "/dashboard/credit-score" },
      { label: "Expenses", icon: <FaFileAlt />, path: "/dashboard/expenses" },
      { label: "Expenses List", icon: <FaFileAlt />, path: "/dashboard/expenses-list" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Statement Download", icon: <FaDownload />, path: "/dashboard/statement-download" },
      { label: "Settings", icon: <FaCog />, path: "/dashboard/setting" },
      { label: "Notifications", icon: <FaBell />, path: "/dashboard/notification" },
      { label: "GST Calculator", icon: <FaCalculator />, path: "/dashboard/gst-calculator" },
    ],
  },
  {
    title: "More",
    items: [
      { label: "Rewards", icon: <FaGift />, path: "/dashboard/reward" , disabled: true },
      { label: "Coming Soon", icon: <FaClock />, path: "/dashboard/commingsoon", disabled: true  },
      { label: "Updates", icon: <FaSync />, path: "/dashboard/updates" , disabled: true },
      { label: "Support", icon: <FaHeadphones />, path: "/dashboard/supports", disabled: true},
    ],
  },
];

const Sidebar = ({ isOpen, toggleSidebar, isMobile }) => {
 const [businesses, setBusinesses] = useState([]);  
  const [activeBusinessName, setActiveBusinessName] = useState("Select Business");  
  const [loading, setLoading] = useState(true);  

  const store_id = Cookies.get("store_id");  
  const token = Cookies.get("authToken");

  // Fetch businesses function (BusinessList से inspired)
  const fetchBusinesses = async () => {
    if (!store_id || !token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${API_BASE}/store-business-profile/find-all/${store_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("📌 Sidebar API Response:", res.data);

      let data = res.data?.businesses || res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setBusinesses(data);

      // Active ID से name set करें
      const storeProfile_id = localStorage.getItem("storeProfile_id");
      if (storeProfile_id && data.length > 0) {
        const activeBusiness = data.find(b => String(b._id) === String(storeProfile_id));
        if (activeBusiness) {
          setActiveBusinessName(` ${activeBusiness.businessName || "Unnamed Business"}`);
        } else {
          setActiveBusinessName("No Active Business");
          localStorage.removeItem("storeProfile_id");  // Invalid ID clear करें
        }
      }
    } catch (err) {
      console.error("❌ Sidebar: Error fetching businesses:", err);
      setActiveBusinessName("Error Loading");
    } finally {
      setLoading(false);
    }
  };

  // useEffect: Load businesses on mount और store_id change पर
  useEffect(() => {
    fetchBusinesses();
  }, [store_id, token]);  // Dependencies

  // Header render
  const renderHeader = () => {
    if (loading) {
      return <div className="text-white text-sm">Loading...</div>;
    }

    if (isOpen && !isMobile) {  // Only show name when open and not mobile
      return (
        <div className="text-white font-bold text-sm mb-1 flex gap-2 items-center">
          <FaBuilding />
          <h1 className="text-white font-robotoSb activateanimation ">{activeBusinessName}</h1>  
        </div>
      );
    } else {
      return <FaBuilding className="text-white text-xl mx-auto" />;
    }
  };

  return (
    <div
      className={`bg-[#3B82F6] h-full transition-all duration-300 p-3 custom-scrollbar overflow-y-auto hover:overflow-y-scroll ${
        isOpen ? "w-56" : "w-16"
      }`}
    >
      {/* Header */}
<div className="flex items-center justify-between mb-4">
        {!isMobile && (
          <div className="flex flex-col w-full">
            {renderHeader()}  {/* ← Updated header */}
          </div>
          
        )}
        <button
          className="text-white focus:outline-none ml-2 hidden sm:block"
          onClick={toggleSidebar}
        >
          ☰
        </button>
                <div className="text-white font-robotoB sm:hidden "> <span>{activeBusinessName}</span></div>
      </div>

      {/* Menu */}
      <div className="space-y-5">
        {sections.map((section, index) => (
          <div key={index}>
            <h2
              className={`text-xs text-white uppercase tracking-wide mb-2 ${
                isOpen ? "block" : "hidden"
              }`}
            >
              {section.title}
            </h2>
            <ul>
{section.items.map((item, idx) => (
  <li key={idx}>
    {item.disabled ? (
      <div
        className="mb-2 text-gray-300 p-2 rounded-md flex items-center gap-3 cursor-not-allowed opacity-60"
      >
        {item.icon}
        {isOpen && <span>{item.label}</span>}
      </div>
    ) : (
      <Link
        to={item.path}
        className="mb-2 hover:bg-white hover:text-[#2563EB] text-white p-2 rounded-md flex items-center gap-3 cursor-pointer block"
      >
        {item.icon}
        {isOpen && <span>{item.label}</span>}
      </Link>
    )}
  </li>
))}

            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
