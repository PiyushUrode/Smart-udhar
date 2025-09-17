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
  { label: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboard" },   
];

// ✅ Section-based menus (always visible)
const sections = [
  // {
  //   title: "Admin Roles",
  //   items: [
  //     { label: "Admin List", icon: <FaUsers />, path: "/admin/dashboard/admin-list" },
  //     { label: "Role Permissions", icon: <FaCog />, path: "/admin/dashboard/role-permisson" },
  //     { label: "Activity History", icon: <FaClock />, path: "/admin/dashboard/activity-history" },
  //     { label: "Session Management", icon: <FaSync />, path: "/admin/dashboard/session-management" },
  //   ],
  // },

   {
    title: "User Management",
    items: [
      { label: "User List", icon: <FaUsers />, path: "/admin/dashboard/store-list" },
      { label: "Product List", icon: <FaBoxOpen />, path: "/admin/dashboard/product-list" },
      { label: "Staff List", icon: <FaUsers />, path: "/admin/dashboard/staff-list" },
      { label: "Customer List", icon: <FaUsers />, path: "/admin/dashboard/customer-list" },
      { label: "Invoice List", icon: <FaFileInvoice />, path: "/admin/dashboard/invoice-list" },
      // { label: "Session Management", icon: <FaSync />, path: "/admin/dashboard/session-management" },
    ],
  },
  {
    title: "Notifications",
    items: [
      {
        label: "Send Notification",
        icon: <FaBell />,
        path: "/admin/dashboard/send-notification",
      },
      {
        label: "Notification List",
        icon: <FaBell />,
        path: "/admin/dashboard/show-notification",
      },
      // { label: "Notification Settings", icon: <FaCog />, path: "/admin/dashboard/notification-settings" },
    ],
  },
  // {
  //   title: "Rewards",
  //   items: [
  //     { label: "Manage Rewards", icon: <FaGift />, path: "/admin/dashboard/manage-reward" },
  //     { label: "Reward Analytics", icon: <FaChartLine />, path: "/admin/dashboard/rewards-analytics" },
  //   ],
  // },
  {
    title: "Subscription Plans",
    items: [
      // {
      //   label: "Create Category",
      //   icon: <MdCategory />,
      //   path: "/admin/dashboard/subscriptions/category/create",
      // },
      {
        label: "Create Subscription",
        icon: <MdSubscriptions />,
        path: "/admin/dashboard/subscriptions/create",
      },
      {
        label: "View Subscriptions",
        icon: <MdVisibility />,
        path: "/admin/dashboard/subscriptions/view",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        label: "Support Tickets",
        icon: <FaHeadphones />,
        path: "/admin/dashboard/supportTickets",
      },
      // { label: "Live Chat", icon: <FaSync />, path: "/admin/dashboard/live-Chat" },
      // { label: "Knowledge Base", icon: <FaInfoCircle />, path: "/admin/dashboard/knowledge-Base" },
    ],
  },
  {
    title: "Admin Settings",
    items: [
      { label: "Profile", icon: <FaUserFriends />, path: "/admin/dashboard/profile" },
      // { label: "Platform Settings", icon: <FaCog />, path: "/admin/dashboard/platform-Setting" },
      // { label: "Role Settings", icon: <FaUsers />, path: "/admin/dashboard/role-Setting" },
      // { label: "Security Settings", icon: <FaUsers />, path: "/admin/dashboard/security-Setting" },
      // { label: "Custom Branding", icon: <FaFileAlt />, path: "/admin/dashboard/custom-Branding" },
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
