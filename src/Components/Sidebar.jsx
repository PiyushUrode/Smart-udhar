import { Link } from "react-router-dom";
import { useState } from "react";
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
      { label: "Information", icon: <FaBuilding />, path: "/dashboard/information" },
      { label: "Bussiness-details", icon: <FaBuilding />, path: "/dashboard/bussinessList" },
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
  const [selectedPanel, setSelectedPanel] = useState("Business Panel 1");

  const businessPanels = [
    "Business Panel 1",
    "Business Panel 2",
    "Business Panel 3",
    "Business Panel 4",
    "Business Panel 5",
  ];

  const handlePanelChange = (e) => {
    setSelectedPanel(e.target.value);
    // Optionally trigger logic for switching context
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
            {isOpen ? (
              <>
                <div className="text-white font-bold text-sm mb-1 flex gap-2 items-center">
                  <FaBuilding />
                <select
                  value={selectedPanel}
                  onChange={handlePanelChange}
                  className="text-sm bg-[#3B82F6]  rounded px-2 py-1"
                >
                  {businessPanels.map((panel, idx) => (
                    <option key={idx} value={panel}>
                      {panel}
                    </option>
                  ))}
                </select>
                </div>

              </>
            ) : (
              <FaBuilding className="text-white text-xl mx-auto" />
            )}
          </div>
        )}
        <button
          className="text-white focus:outline-none ml-2"
          onClick={toggleSidebar}
        >
          ☰
        </button>
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
