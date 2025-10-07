import { Link } from "react-router-dom";
import { useState, useEffect } from "react"; // ← useEffect ऐड करें
import axios from "axios"; // ← API के लिए
import Cookies from "js-cookie"; // ← Token के लिए
import { NavLink } from "react-router-dom";
import "../../index.css";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBuilding,
  FaInfoCircle,
  FaBoxOpen,
  FaConciergeBell,
  FaUserFriends,
  FaPlusCircle,
  FaFileInvoice,
  FaMoneyBillWave,
  FaStar,
  FaFileAlt,
  FaDownload,
  FaCog,
  FaBell,
  FaCalculator,
  FaGift,
  FaClock,
  FaSync,
  FaHeadphones,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { setActiveBusiness } from "../../reactStore/businessSlice"; // सही path डालो

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
      // { label: "Add Business", icon: <FaBuilding />, path: "/dashboard/information" },
      {
        label: "Bussiness List",
        icon: <FaBuilding />,
        path: "/dashboard/bussinessList",
      },
    ],
  },
  {
    title: "Items",
    items: [
      {
        label: " Add Products",
        icon: <FaBoxOpen />,
        path: "/dashboard/product",
      },
      {
        label: "Product List",
        icon: <FaConciergeBell />,
        path: "/dashboard/product-list",
      },
      // { label: "Stock-list", icon: <FaConciergeBell />, path: "/dashboard/stock-list" },
    ],
  },
  {
    title: "People",
    items: [
      {
        label: "Add Customer",
        icon: <FaPlusCircle />,
        path: "/dashboard/add-customer",
      },
      {
        label: "Customer Details",
        icon: <FaUsers />,
        path: "/dashboard/customer-details",
      },
      {
        label: "Add Staff",
        icon: <FaUserFriends />,
        path: "/dashboard/staff-details",
      },
      {
        label: "Staff Roles",
        icon: <FaUserFriends />,
        path: "/dashboard/staff-role",
      },
    ],
  },
  {
    title: "Transactions",
    items: [
      {
        label: "Create Invoice",
        icon: <FaFileInvoice />,
        path: "/dashboard/create-invoice",
      },
      // { label: "Payment Collection", icon: <FaMoneyBillWave />, path: "/dashboard/payment-collection" },
      {
        label: "Invoice List",
        icon: <FaMoneyBillWave />,
        path: "/dashboard/payment-collectionList",
      },
      {
        label: "Credit Score",
        icon: <FaStar />,
        path: "/dashboard/credit-score",
      },
      { label: "Expenses", icon: <FaFileAlt />, path: "/dashboard/expenses" },
      {
        label: "Expenses List",
        icon: <FaFileAlt />,
        path: "/dashboard/expenses-list",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Statement Download",
        icon: <FaDownload />,
        path: "/dashboard/statement-download",
      },
      { label: "Settings", icon: <FaCog />, path: "/dashboard/setting" },
      {
        label: "Notifications",
        icon: <FaBell />,
        path: "/dashboard/notification",
      },
      {
        label: "GST Calculator",
        icon: <FaCalculator />,
        path: "/dashboard/gst-calculator",
      },
    ],
  },
  {
    title: "More",
    items: [
      {
        label: "Invite Friends",
        icon: <FaGift />,
        path: "/dashboard/invite",
        // disabled: true,
      },
      // {
      //   label: "Coming Soon",
      //   icon: <FaClock />,
      //   path: "/dashboard/commingsoon",
      //   // disabled: true,
      // },
      {
        label: "Updates",
        icon: <FaSync />,
        path: "/dashboard/updates",
        // disabled: true,
      },
      {
        label: "Support",
        icon: <FaHeadphones />,
        path: "/dashboard/supports",
        // disabled: true,
      },
    ],
  },
];

const Sidebar = ({ isOpen, toggleSidebar, isMobile }) => {
  const [businesses, setBusinesses] = useState([]);
  // const [activeBusinessName, setActiveBusinessName] = useState("Select Business");
  const [loading, setLoading] = useState(true);

  const store_id = Cookies.get("store_id");
  const token = Cookies.get("authToken");
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/dashboard/bussinessList");
  };

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

      let data =
        res.data?.businesses ||
        res.data?.data ||
        (Array.isArray(res.data) ? res.data : []);
      setBusinesses(data);

      const storeProfile_id = localStorage.getItem("storeProfile_id");

      if (storeProfile_id && data.length > 0) {
        const activeBusiness = data.find(
          (b) => String(b._id) === String(storeProfile_id)
        );
        if (activeBusiness) {
          // Redux update karo
          dispatch(
            setActiveBusiness({
              id: activeBusiness._id,
              name: activeBusiness.businessName || "Unnamed Business",
            })
          );
        } else {
          localStorage.removeItem("storeProfile_id");
        }
      }
    } catch (err) {
      console.error("❌ Sidebar: Error fetching businesses:", err);
    } finally {
      setLoading(false);
    }
  };

  const dispatch = useDispatch();
  const activeBusinessName = useSelector(
    (state) => state.business.activeBusinessName
  );

  // useEffect: Load businesses on mount और store_id change पर
  useEffect(() => {
    fetchBusinesses();
  }, [store_id, token]); // Dependencies

  // Header render
  const renderHeader = () => {
    if (loading) {
      return <div className="text-white text-sm">Loading...</div>;
    }

    if (isOpen && !isMobile) {
      // Only show name when open and not mobile
      return (
        <div className="text-white font-bold text-sm mb-1 flex gap-2 items-center"  onClick={handleNavigate}>
          <FaBuilding size={20} />
       <h1
  className="text-white font-robotoB text-lg leading-[20px] cursor-pointer tracking-[0] activateanimation truncate"
>
  {activeBusinessName?.length > 15
    ? activeBusinessName.slice(0, 15) + "..."
    : activeBusinessName}
</h1>

        </div>
      );
    } else {
      return <FaBuilding className="text-white text-xl mx-auto" />;
    }
  };

  return (
    <div
      className={`bg-[#3B82F6] h-full transition-all duration-300 py-3 border-l-2   rounded-l-lg ${
        isOpen ? "w-56" : "w-16"
      } flex flex-col`}
    >
      <div className="flex flex-row justify-between items-center justify-center align-middle px-3 py-2" 
      
       onClick={handleNavigate}
      >
        {!isMobile && renderHeader()}

        {isMobile && (
          <div className="text-white font-robotoB leading-[20px] tracking-[0]">
            <span>{activeBusinessName?.split(" ").slice(0, 1).join(" ")}</span>
          </div>
        )}
        <button
          className="text-white focus:outline-none  hidden  "
          onClick={toggleSidebar}
        >
          ☰
        </button>
      </div>
      <div className="w-full border-[1px] bg-white mb-4"></div>

      {/* Scrollable Menu */}
      <div
        className={`flex-1 overflow-y-auto custom-scrollbar  space-y-2  
  ${isOpen ? "space-y-5" : " space-y-2  "}
  
  `}
      >
        {sections.map((section, index) => (
          <div key={index}>
            <h2
              className={`text-xs text-white font-robotoB   px-3 tracking-wide mb-2 ${
                isOpen ? " " : " flex justify-center "
              }`}
            >
              {isOpen ? `${section.title}` : "---"}
              {/* {section.title} */}
            </h2>

            <ul>
              {section.items.map((item, idx) => (
                <li key={idx}>
                  {item.disabled ? (
                    <div className="mb-2 text-white p-2  flex  font-robotoB   items-center gap-3 cursor-not-allowed opacity-60">
                      {item.icon}
                      {isOpen && <span>{item.label}</span>}
                    </div>
                  ) : (
                    <NavLink
                      to={item.path}
                      end
                      className={({ isActive }) =>
                        `mb-1 font-robotoR text-base p-2 flex items-center     gap-3    cursor-pointer block transition-colors ${
                          isActive
                            ? "bg-white text-[#2563EB] "
                            : "text-white hover:bg-white hover:text-[#2563EB]"
                        }
                    ${isOpen ? "px-8" : "px-3 justify-center"}`
                      }
                    >
                      {item.icon}
                      {isOpen && <span>{item.label}</span>}
                    </NavLink>
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
