import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaCog,
  FaClock,
  FaSync,
  FaBell,
  FaGift,
  FaChartLine,
  FaMoneyBillWave,
  FaBuilding,
  FaFileInvoice,
  FaBoxOpen,
  FaHeadphones,
  FaInfoCircle,
  FaUserFriends,
  FaFileAlt,
  FaMoneyBillWaveAlt,
} from "react-icons/fa";
import { MdCategory, MdSubscriptions, MdVisibility } from "react-icons/md";

// ✅ Direct menus
const directMenus = [
  { label: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboard" },
];

// ✅ Section-based menus
const sections = [
  {
    title: "User Management",
    items: [
      { label: "User List", icon: <FaUsers />, path: "/admin/dashboard/store-list" },
      { label: "Product List", icon: <FaBoxOpen />, path: "/admin/dashboard/product-list" },
      { label: "Staff List", icon: <FaUsers />, path: "/admin/dashboard/staff-list" },
      { label: "Customer List", icon: <FaUsers />, path: "/admin/dashboard/customer-list" },
      { label: "Invoice List", icon: <FaFileInvoice />, path: "/admin/dashboard/invoice-list" },
      { label: "Expense List", icon: <FaMoneyBillWaveAlt />, path: "/admin/dashboard/expense-list" },
    ],
  },
  {
    title: "Notifications",
    items: [
      { label: "Custome Dropdown", icon: <FaBell />, path: "/admin/dashboard/cust-dropdown" },
      { label: "Send Notification", icon: <FaBell />, path: "/admin/dashboard/send-notification" },
      { label: "Notification List", icon: <FaBell />, path: "/admin/dashboard/show-notification" },
    ],
  },
  {
    title: "Subscription Plans",
    items: [
      { label: "Create Subscription", icon: <MdSubscriptions />, path: "/admin/dashboard/subscriptions/create" },
      { label: "View Subscriptions", icon: <MdVisibility />, path: "/admin/dashboard/subscriptions/view" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Support Tickets", icon: <FaHeadphones />, path: "/admin/dashboard/supportTickets" },
    ],
  },
  {
    title: "Admin Settings",
    items: [
      { label: "Profile", icon: <FaUserFriends />, path: "/admin/dashboard/profile" },
    ],
  },
];

const Sidebar = ({ isOpen }) => {
  const location = useLocation(); // ✅ current route path

  return (
    <div
      className={`bg-[#3B82F6] h-full transition-all duration-300 p-3 custom-scrollbar overflow-y-auto hover:overflow-y-scroll ${
        isOpen ? "w-56" : "w-16"
      }`}
    >
      <div className="space-y-5">
        {/* ✅ Direct Menus */}
        <ul>
          {directMenus.map((menu, idx) => {
            const isActive = location.pathname === menu.path;
            return (
              <li key={idx}>
                <Link
                  to={menu.path}
                  className={`mb-2 text-md p-2 font-robotoM rounded-md flex items-center gap-3 cursor-pointer block
                    ${
                      isActive
                        ? "bg-white text-[#2563EB]" // active
                        : "text-white hover:bg-white hover:text-[#2563EB]"
                    }`}
                >
                  {menu.icon}
                  {isOpen && <span>{menu.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ✅ Sections */}
        {sections.map((section, index) => (
          <div key={index}>
            {isOpen && (
              <div className="text-md font-robotoM text-white uppercase tracking-wide mb-2 px-1">
                {section.title}
              </div>
            )}

            <ul>
              {section.items.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={idx}>
                    <Link
                      to={item.path}
                      className={`mb-2 text-sm p-2 font-robotoM rounded-md flex items-center gap-3 cursor-pointer block
                        ${
                          isActive
                            ? "bg-white text-[#2563EB]" // active
                            : "text-white hover:bg-white hover:text-[#2563EB]"
                        }`}
                    >
                      {item.icon}
                      {isOpen && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
