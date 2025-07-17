import { Link } from "react-router-dom";
import {
  FaTachometerAlt, FaBuilding, FaInfoCircle, FaBoxOpen, FaConciergeBell,
  FaUserFriends, FaPlusCircle, FaFileInvoice, FaMoneyBillWave, FaStar,
  FaFileAlt, FaDownload, FaCog, FaBell, FaCalculator, FaGift, FaClock,
  FaSync, FaHeadphones, FaUsers, FaChartLine
} from "react-icons/fa";

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
      { label: "Basic Details", icon: <FaBuilding />, path: "/dashboard/basic-details" },

    ],
  },
  {
    title: "Items",
    items: [
      { label: "Products", icon: <FaBoxOpen />, path: "/dashboard/product" },
      { label: "Product List", icon: <FaConciergeBell />, path: "/dashboard/product-list" },
      { label: "Stock-list", icon: <FaConciergeBell />, path: "/dashboard/stock-list" },
    ],
  },
  {
    title: "People",
    items: [
      { label: "Staff Roles", icon: <FaUserFriends />, path: "/dashboard/staff-role" },
      { label: "Staff Details", icon: <FaUserFriends />, path: "/dashboard/staff-details" },
      { label: "Add Customer", icon: <FaPlusCircle />, path: "/dashboard/add-customer" },
       { label: "Customer Details", icon: <FaUsers />, path: "/dashboard/customer-details" },
    ],
  },
  {
    title: "Transactions",
    items: [
      { label: "Create Invoice", icon: <FaFileInvoice />, path: "/dashboard/create-invoice" },
      { label: "Payment Collection", icon: <FaMoneyBillWave />, path: "/dashboard/payment-collection" },
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
      { label: "Rewards", icon: <FaGift />, path: "/dashboard/reward" },
      { label: "Coming Soon", icon: <FaClock />, path: "/dashboard/commingsoon" },
      { label: "Updates", icon: <FaSync />, path: "/dashboard/updates" },
      { label: "Support", icon: <FaHeadphones />, path: "/dashboard/supports" },
    ],
  },
];


const Sidebar = ({ isOpen, toggleSidebar, isMobile }) => {
  return (
    <div
      className={`bg-[#3B82F6]  h-full transition-all duration-300 p-3 custom-scrollbar overflow-y-auto hover:overflow-y-scroll ${
        isOpen ? "w-56" : "w-16"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {!isMobile && (
          <h1 className={`text-lg font-bold flex  text-white items-center gap-2 ${isOpen ? "block" : "hidden"}`}>
            <FaBuilding />
            Business Panel
          </h1>
        )}
        <button
          className="text-white focus:outline-none"
          onClick={toggleSidebar}
        >
          ☰
        </button>
      </div>

      {/* Menu */}
      <div className="space-y-5">
        {sections.map((section, index) => (
          <div key={index}>
            <h2 className={`text-xs text-white uppercase tracking-wide mb-2 ${isOpen ? "block" : "hidden"}`}>
              {section.title}
            </h2>
            <ul>
              {section.items.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.path}
                    className="mb-2 hover:bg-white hover:text-[#2563EB] text-white p-2 rounded-md flex items-center gap-3 cursor-pointer block"
                  >
                    {item.icon}
                    {isOpen && <span>{item.label}</span>}
                  </Link>
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
