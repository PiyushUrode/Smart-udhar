import { useState, useEffect } from "react";
import { StaffService } from "../../api/staffDetails"; // <-- API service
import {
  FaUserPlus,
  FaUsers,
  FaEllipsisV,
  FaUserSlash,
  FaFilter,
  FaCircle,
  FaClock,
} from "react-icons/fa";
import { FaUserShield } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";

import product1 from "../../assets/dummyimage/product1.png";

// ----------------- STAT CONFIG -----------------
const STAT_TYPE_MAP = {
  staff: {
    icon: <FaUsers size={18} color="#2563EB" />,
    bg: "bg-[#DBEAFE]",
  },
  roles: {
    icon: <FaUserShield size={18} color="#16A34A" />,
    bg: "bg-[#DCFCE7]",
  },
  online: {
    icon: <FaCircle size={18} color="#16A34A" />,
    bg: "bg-[#D1FAE5]",
  },
  invites: {
    icon: <FaClock size={18} color="#EA580C" />,
    bg: "bg-[#FFEDD5]",
  },
};

// ----------------- STAT CARD -----------------
const StatCard = ({ label, value, type }) => {
  const config = STAT_TYPE_MAP[type] || {};
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border flex justify-between items-center min-w-[150px]">
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-lg font-semibold text-[#1F2937]">{value}</div>
      </div>
      <div className={`p-2 rounded-full ${config.bg}`}>{config.icon}</div>
    </div>
  );
};

// ----------------- MAIN COMPONENT -----------------
const D5StaffRole = () => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("Monthly");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);

  // 📌 API: Fetch Staff Members
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const res = await StaffService.getAllStaff(); // backend call

        const formatted = res?.staff?.map((staff) => ({
          id: staff._id,
          name: `${staff.firstName || ""} ${staff.lastName || ""}`.trim(),
          email: staff.emailId,
          role: staff.roles?.[0] || "Staff",
          roleColor: "bg-blue-100 text-blue-600",
          avatar: staff.image ? `/uploads/staff/${staff.image}` : product1,
          online: staff.online || false,
          lastAction: staff.status === "active" ? "Joined the team" : "Updated",
          actionTime: staff.updatedAt || new Date().toISOString(),
        }));

        setMembers(formatted || []);
        setRecentActivity((formatted || []).slice(0, 5));
      } catch (err) {
        console.error("❌ Failed to fetch staff", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // 📌 Dropdown handler
  const toggleDropdown = (index) => {
    setOpenDropdownIndex((prev) => (prev === index ? null : index));
  };

  const handleFilterChange = (option) => {
    setSelectedFilter(option);
    setOpenDropdownIndex(null);
  };

  return (
    <div className="px-4 py-12 md:px-10 max-w-screen-xl mx-auto space-y-6 bg-white">
      {/* Header */}
      <div className="flex flex-col gap-5 ">
        <h1 className=" text-xl md:text-2xl font-semibold text-[#1F2937] font-robotoB">
          Staff Role Management
        </h1>
        <div className="flex gap-3 max-w-5xl flex-wrap">
          <button className="bg-bluecol flex items-center text-white font-robotoR text-sm px-4 py-3 rounded-md gap-2">
            <FaUserPlus /> Add Team Member
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total Staff" value={members.length} type="staff" />
        <StatCard label="Active Roles" value="4" type="roles" />
        <StatCard
          label="Online Now"
          value={members.filter((m) => m.online).length}
          type="online"
        />
      </div>

      {/* Team Members & Role Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md border-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <h2 className="text-base font-semibold text-black">
              Team Members
            </h2>
            <div className="flex gap-3 flex-wrap">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search team members..."
                  className="w-full bg-white border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <button className="bg-gray-100 px-3 py-2 rounded-md text-sm">
                <FaFilter />
              </button>
            </div>
          </div>

          {/* List */}
          {loading ? (
            <div className="text-center py-10">Loading staff...</div>
          ) : (
            <div className="space-y-3">
              {members.map((member, index) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-sm font-medium text-[#1F2937]">
                        {member.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {member.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${member.roleColor}`}
                    >
                      {member.role}
                    </span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        member.online ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></span>

                    {/* Dropdown */}
                    <div className="relative">
                      <button
                        className="text-sm text-[#1E40AF] hover:underline flex items-center gap-1"
                        onClick={() => toggleDropdown(index)}
                      >
                        <FaEllipsisV size={16} />
                      </button>

                      {openDropdownIndex === index && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
                          {["Edit", "Delete"].map((option) => (
                            <div
                              key={option}
                              onClick={() => handleFilterChange(option)}
                              className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                                selectedFilter === option
                                  ? "bg-gray-100 font-medium"
                                  : ""
                              }`}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Role Overview */}
        <div className="bg-white py-4 rounded-lg shadow-md border-2">
          <h2 className="text-lg text-gray-700 mb-4 border-b p-4 font-robotoB">
            Role Overview
          </h2>
          <div className="space-y-4 p-4">
            {/* TODO: fetch roles API also if available */}
            <p className="text-sm text-gray-500">
              Coming soon: roles integration
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md border-2">
        <div className="border-b p-5">
          <h2 className="text-base font-semibold text-gray-700 mb-4">
            Recent Activity
          </h2>
        </div>
        <ul className="text-sm p-4 space-y-4 text-gray-700">
          {recentActivity.map((activity, idx) => (
            <li key={idx} className="flex gap-4 items-start">
              <div className="rounded-full p-2 border-2 bg-[#DBEAFE]">
                <FaUserPlus color="#2563EB" />
              </div>
              <div>
                {activity.name} - {activity.lastAction}
                <div className="text-gray-500 text-xs">
                  {new Date(activity.actionTime).toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default D5StaffRole;
