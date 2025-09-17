import { Link } from "react-router-dom";
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
} from "react-icons/fa";

import { MdCategory, MdSubscriptions, MdVisibility } from "react-icons/md";
// ✅ Direct menus (no dropdown, just link)
const directMenus = [
  { label: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },   
];

// ✅ Section-based menus (always visible)
const sections = [
  // {
  //   title: "Admin Roles",
  //   items: [
  //     { label: "Admin List", icon: <FaUsers />, path: "/dashboard/admin-list" },
  //     { label: "Role Permissions", icon: <FaCog />, path: "/dashboard/role-permisson" },
  //     { label: "Activity History", icon: <FaClock />, path: "/dashboard/activity-history" },
  //     { label: "Session Management", icon: <FaSync />, path: "/dashboard/session-management" },
  //   ],
  // },

   {
    title: "User Management",
    items: [
      { label: "User List", icon: <FaUsers />, path: "/dashboard/store-list" },
      { label: "Product List", icon: <FaBoxOpen />, path: "/dashboard/product-list" },
      { label: "Staff List", icon: <FaUsers />, path: "/dashboard/staff-list" },
      { label: "Customer List", icon: <FaUsers />, path: "/dashboard/customer-list" },
      { label: "Invoice List", icon: <FaFileInvoice />, path: "/dashboard/invoice-list" },
      // { label: "Session Management", icon: <FaSync />, path: "/dashboard/session-management" },
    ],
  },
  {
    title: "Notifications",
    items: [
      {
        label: "Send Notification",
        icon: <FaBell />,
        path: "/dashboard/send-notification",
      },
      {
        label: "Notification List",
        icon: <FaBell />,
        path: "/dashboard/show-notification",
      },
      // { label: "Notification Settings", icon: <FaCog />, path: "/dashboard/notification-settings" },
    ],
  },
  // {
  //   title: "Rewards",
  //   items: [
  //     { label: "Manage Rewards", icon: <FaGift />, path: "/dashboard/manage-reward" },
  //     { label: "Reward Analytics", icon: <FaChartLine />, path: "/dashboard/rewards-analytics" },
  //   ],
  // },
  {
    title: "Subscription Plans",
    items: [
      // {
      //   label: "Create Category",
      //   icon: <MdCategory />,
      //   path: "/dashboard/subscriptions/category/create",
      // },
      {
        label: "Create Subscription",
        icon: <MdSubscriptions />,
        path: "/dashboard/subscriptions/create",
      },
      {
        label: "View Subscriptions",
        icon: <MdVisibility />,
        path: "/dashboard/subscriptions/view",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        label: "Support Tickets",
        icon: <FaHeadphones />,
        path: "/dashboard/supportTickets",
      },
      // { label: "Live Chat", icon: <FaSync />, path: "/dashboard/live-Chat" },
      // { label: "Knowledge Base", icon: <FaInfoCircle />, path: "/dashboard/knowledge-Base" },
    ],
  },
  {
    title: "Admin Settings",
    items: [
      { label: "Profile", icon: <FaUserFriends />, path: "/dashboard/profile" },
      // { label: "Platform Settings", icon: <FaCog />, path: "/dashboard/platform-Setting" },
      // { label: "Role Settings", icon: <FaUsers />, path: "/dashboard/role-Setting" },
      // { label: "Security Settings", icon: <FaUsers />, path: "/dashboard/security-Setting" },
      // { label: "Custom Branding", icon: <FaFileAlt />, path: "/dashboard/custom-Branding" },
    ],
  },
];

const Sidebar = ({ isOpen }) => {
  return (
    <div
      className={`bg-[#3B82F6] h-full transition-all duration-300 p-3 custom-scrollbar overflow-y-auto hover:overflow-y-scroll ${
        isOpen ? "w-56" : "w-16"
      }`}
    >
      <div className="space-y-5">
        {/* ✅ Direct Menus */}
        <ul>
          {directMenus.map((menu, idx) => (
            <li key={idx}>
              <Link
                to={menu.path}
                className="mb-2 text-md hover:bg-white hover:text-[#2563EB] text-white p-2 font-robotoM rounded-md flex items-center gap-3 cursor-pointer block"
              >
                {menu.icon}
                {isOpen && <span>{menu.label}</span>}
              </Link>
            </li>
          ))}
        </ul>

        {/* ✅ Sections (always expanded) */}
        {sections.map((section, index) => (
          <div key={index}>
            {isOpen && (
              <div className=" text-md font-robotoM text-white uppercase tracking-wide mb-2 px-1">
                {section.title}
              </div>
            )}

            <ul>
              {section.items.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.path}
                    className="mb-2 text-sm hover:bg-white hover:text-[#2563EB] text-white p-2 font-robotoM rounded-md flex items-center gap-3 cursor-pointer block"
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
