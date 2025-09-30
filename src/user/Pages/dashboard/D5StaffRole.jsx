import { useState, useEffect } from "react";
import { StaffService } from "../../api/staffDetails.js"; 
import {
  FaUserPlus,
  FaUsers,
  FaEllipsisV,
  FaFilter,
  FaCircle,
  FaClock,
} from "react-icons/fa";
import { FaUserShield } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import product1 from "../../assets/dummyimage/product1.png";
import { useParams, useNavigate } from "react-router-dom";


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

const roles = [
  { name: "name", description: "Full access to all modules", count: 2, tags: [{ name: "All Access", color: "bg-blue-100 text-bluecol" }] },
  { name: "Accountant", description: "View/edit expenses, create invoices", count: 3, tags: [{ name: "Expense", color: "bg-purple-100 text-purple-600" }, { name: "Invoice", color: "bg-purple-100 text-purple-600" }] },
  { name: "Sales Staff", description: "View customers, send reminders", count: 5, tags: [{ name: "Customer", color: "bg-green-100 text-green-600" }, { name: "Reminder", color: "bg-green-100 text-green-600" }] },
  { name: "Viewer", description: "Read-only access to reports", count: 2, tags: [{ name: "Reports", color: "bg-gray-100 text-gray-600" }, { name: "Dashboard", color: "bg-gray-100 text-gray-600" }] },
];

const D5StaffRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("Monthly");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);
  const [staffImage, setStaffImage] = useState(null);
  const [dynamicRoles, setDynamicRoles] = useState([]);


  const API_URL = import.meta.env.VITE_API_URL;


  // Inside D5StaffRole component, after fetching staff
useEffect(() => {
  if (members.length > 0) {
    const sorted = [...members].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setRecentActivity(sorted.slice(0, 5));

    // ✅ Generate dynamic roles overview
    const roleMap = {};
    sorted.forEach((staff) => {
      const roleName = staff.role || "Staff";
      if (!roleMap[roleName]) {
        roleMap[roleName] = {
          name: roleName,
          count: 1,
          tags: [], // optionally you can fill tags based on role type
        };
      } else {
        roleMap[roleName].count += 1;
      }
    });
    setDynamicRoles(Object.values(roleMap));
  }
}, [members]);


  // ✅ Handle image change with validation
  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (files) {
      const file = files[0];
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        toast.error("❌ Only JPG, JPEG, and PNG formats are allowed");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("❌ Image size must be less than 2MB");
        return;
      }
      setStaffImage(file);
    } else {
      // fallback for text input fields
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await StaffService.getAllStaff();
      const formatted = res?.staff?.map((staff) => {
        const avatarUrl = staff.image
          ? `${API_URL}/assets/uploadStaffImage/${encodeURIComponent(staff.image)}?t=${Date.now()}`
          : product1;
        return {
          id: staff._id,
          name: `${staff.firstName || ""} ${staff.lastName || ""}`.trim(),
          email: staff.emailId,
          role: staff.roles?.[0] || "Staff",
          roleColor: "bg-blue-100 text-blue-600",
          avatar: avatarUrl,
          online: staff.online || false,
          lastAction: staff.status === "active" ? "Joined the team" : "Updated",
          createdAt: staff.createdAt,
          actionTime: staff.updatedAt || new Date().toISOString(),
        };
      });
      setMembers(formatted || []);
    } catch (err) {
      console.error("❌ Failed to fetch staff", err);
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (members.length > 0) {
      const sorted = [...members].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentActivity(sorted.slice(0, 5));
    }
  }, [members]);

  useEffect(() => {
    fetchStaff();
  }, []);

  const toggleDropdown = (index) => {
    setOpenDropdownIndex((prev) => (prev === index ? null : index));
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/staff-details/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    try {
      await StaffService.deleteStaff(id);
      toast.success("✅ Staff deleted successfully");
      fetchStaff();
    } catch (err) {
      console.error("❌ Delete failed:", err);
      toast.error(err.response?.data?.message || "Failed to delete staff");
    }
  };
  return (
    <div className="px-1  sm:px-4  py-6 sm:py-12 md:px-10 max-w-screen-xl mx-auto space-y-6 bg-white">
      {/* Header */}
      <div className="flex flex-col gap-5 ">
        <h1 className=" text-xl md:text-2xl font-semibold text-[#1F2937] font-robotoB">
          Staff Role Management
        </h1>
        <div className="flex gap-3 max-w-5xl flex-wrap">
          <button className="bg-bluecol flex items-center text-white font-robotoR text-sm px-4 py-3 rounded-md gap-2"
                    onClick={() => navigate("/dashboard/staff-details")}
          >
            <FaUserPlus /> Add Team Member
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total Staff" value={members.length} type="staff" />
        <StatCard label="Active Roles" value={"0"} type="roles" />
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
            <div className="flex gap-3 flex-row">
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
                  className="flex flex-col md:flex-row  gap-5 items-start  md:items-center justify-between p-3 border rounded-md"
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
                        <div
                          onClick={() => handleEdit(member.id)}
                          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                          Edit
                        </div>
                        <div
                          onClick={() => handleDelete(member.id)}
                          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer text-red-600"
                        >
                          Delete
                        </div>
                      </div>
                    )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white py-4 rounded-lg shadow-md border-2">
          <h2 className="text-lg text-gray-700 mb-4 border-b p-4 font-robotoB">
            Role Overview
          </h2>
          <div className="space-y-4 p-4">
            {dynamicRoles.map((role, index) => (
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

 {recentActivity.length > 0 ? (
    <ul className="text-sm p-4 space-y-4 text-gray-700">
      {recentActivity.map((activity, index) => (
        <li key={index} className="flex gap-4 items-start">
          <div className="rounded-full p-2 border-2 bg-[#DBEAFE]">
            <FaUserPlus color="#2563EB" />
          </div>
          <div>
            <span className="font-semibold">{activity.name}</span> joined as{" "}
            <span className="text-blue-600">{activity.role}</span>
            <div className="text-gray-500 text-xs">
              {new Date(activity.createdAt).toLocaleString()}
            </div>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <div className="p-4 text-gray-500 text-sm">No recent activity found</div>
  )}
</div>


    </div>
  );
};

export default D5StaffRole;




