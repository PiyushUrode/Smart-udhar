
import {
  FaUserPlus,
  FaUsers,
  FaKey,
  FaUserCheck,
  FaUserClock,
  FaPlus,
  FaEllipsisV,
  FaUserSlash,
} from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { FaCircle } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa6";
import { useState } from "react";

// ----------------- DATA -----------------

const members = [
  {
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    role: "Admin",
    roleColor: "bg-blue-100 text-bluecol",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    online: true,
  },
  {
    name: "Priya Sharma",
    email: "priya@example.com",
    role: "Accountant",
    roleColor: "bg-purple-100 text-purple-600",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    online: false,
  },
  {
    name: "Amit Singh",
    email: "amit@example.com",
    role: "Sales Staff",
    roleColor: "bg-green-100 text-green-600",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    online: true,
  },
  {
    name: "Sunita Patel",
    email: "sunita@example.com",
    role: "Viewer",
    roleColor: "bg-gray-100 text-gray-600",
    avatar: "https://randomuser.me/api/portraits/women/67.jpg",
    online: false,
  },
];

const roles = [
  {
    name: "Admin",
    description: "Full access to all modules",
    count: 2,
    tags: [{ name: "All Access", color: "bg-blue-100 text-bluecol" }],
  },
  {
    name: "Accountant",
    description: "View/edit expenses, create invoices",
    count: 3,
    tags: [
      { name: "Expense", color: "bg-purple-100 text-purple-600" },
      { name: "Invoice", color: "bg-purple-100 text-purple-600" },
    ],
  },
  {
    name: "Sales Staff",
    description: "View customers, send reminders",
    count: 5,
    tags: [
      { name: "Customer", color: "bg-green-100 text-green-600" },
      { name: "Reminder", color: "bg-green-100 text-green-600" },
    ],
  },
  {
    name: "Viewer",
    description: "Read-only access to reports",
    count: 2,
    tags: [
      { name: "Reports", color: "bg-gray-100 text-gray-600" },
      { name: "Dashboard", color: "bg-gray-100 text-gray-600" },
    ],
  },
];

// ----------------- STAT CONFIG -----------------

const STAT_TYPE_MAP = {
  staff: {
    icon: <FaUsers size={18} color="#2563EB" />,
    bg: "bg-[#DBEAFE]",
  },
  roles: {
    icon: <FaUserShield  size={18} color="#16A34A" />,
    bg: "bg-[#DCFCE7]",
  },
  online: {
    icon: <FaCircle  size={18} color="#16A34A" />,
    bg: "bg-[#D1FAE5]",
  },
  invites: {
    icon: <FaClock  size={18} color="#EA580C" />,
    bg: "bg-[#FFEDD5]",
  },
};

// ----------------- STAT CARD -----------------

const StatCard = ({ label, value, type }) => {
  const config = STAT_TYPE_MAP[type] || {};
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border flex justify-between items-center min-w-[150px]">
      {/* Left Text */}
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-lg font-semibold text-[#1F2937]">{value}</div>
      </div>

      {/* Right Icon */}
      <div className={`p-2 rounded-full ${config.bg}`}>
        {config.icon}
      </div>
    </div>
  );
};

// ----------------- MAIN COMPONENT -----------------

const D5StaffRole = () => {

const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("Monthly");

  const handleFilterChange = (option) => {
    setSelectedFilter(option);
    setOpenDropdownIndex(null); // close after selecting
    console.log("Selected Filter:", option);
  };

  const toggleDropdown = (index) => {
    setOpenDropdownIndex((prev) => (prev === index ? null : index));
  
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
            <FaPlus /> Add Team Member
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total Staff" value="12" type="staff" />
        <StatCard label="Active Roles" value="4" type="roles" />
        <StatCard label="Online Now" value="8" type="online" />

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
                <FaFilter/>
              </button>
            </div>
          </div>

 <div className=" mx-auto space-y-6 bg-white">
      {/* Team Members */}
      <div className="space-y-3">
        {members.map((member, index) => (
          <div
            key={index}
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
                <div className="text-xs text-gray-500">{member.email}</div>
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

              {/* Dropdown Button */}
              <div className="relative">
                <button
                  className="text-sm text-[#1E40AF] hover:underline flex items-center gap-1"
                  onClick={() => toggleDropdown(index)}
                >
                  <FaEllipsisV size={16} />
                </button>

                {openDropdownIndex === index && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
                    {[
                      "Sales",
                      "Expense",
                      "Invoice",
                      "Customer",
                      "Reminder",
                      "Report",
                      "Dashboard",
                      "All Access",
                    ].map((option) => (
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
    </div>

        </div>

        {/* Role Overview */}
        <div className="bg-white py-4 rounded-lg shadow-md border-2">
          <h2 className="text-lg text-gray-700 mb-4 border-b p-4 font-robotoB">
            Role Overview
          </h2>
          <div className="space-y-4 p-4">
            {roles.map((role, index) => (
              <div
                key={index}
                className="border p-4 gap-3 flex justify-start flex-col rounded-md"
              >
                <div className="flex justify-between text-sm font-medium text-gray-700">
                  <span>{role.name}</span>
                  <span>{role.count} members</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  {role.description}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {role.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`${tag.color} text-xs px-3 py-2 rounded-md`}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
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
          <li className="flex gap-4 items-start">
            <div className="rounded-full p-2 border-2 bg-[#DBEAFE]">
              <FaUserPlus color="#2563EB" />
            </div>
            <div>
              Rajesh Kumar added new team member
              <div className="text-gray-500 text-xs">2 hours ago</div>
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <div className="rounded-full p-2 border-2 bg-[#F3E8FF]">
              <FaUserShield color="#9333EA" />
            </div>
            <div>
              Priya Sharma role updated to Accountant
              <div className="text-gray-500 text-xs">5 hours ago</div>
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <div className="rounded-full p-2 border-2 bg-[#FEE2E2]">
              <FaUserSlash color="#DC2626" />
            </div>
            <div>
              Vikash Singh access revoked
              <div className="text-gray-500 text-xs">1 day ago</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default D5StaffRole;
