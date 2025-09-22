import React, { useState, useEffect } from "react";
import { Bell, Trash2, Cpu } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Default fallback icon/color for unknown types
const defaultType = {
  icon: <Cpu size={16} />,
  color: "bg-gray-100 text-gray-700",
};

const ShowNotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [availableTypes, setAvailableTypes] = useState(["system"]); // 👈 always start with system

  // ✅ Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(API_URL + "/notification/list", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? token : "",
          },
        });

        const data = await res.json();
        if (data.success) {
          const mapped = data.data.map((n) => {
            const date = new Date(n.created_at);
            const formattedDate = date.toLocaleString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return {
              id: n._id,
              title: n.title,
              message: n.message,
              type: n.type?.toLowerCase() || "system", // 👈 always fallback to system
              time: formattedDate,
            };
          });

          // collect unique types dynamically + system
          const uniqueTypes = [
            
            ...new Set(mapped.map((n) => n.type?.toLowerCase())),
          ];

          setNotifications(mapped);
          setAvailableTypes(uniqueTypes);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // ✅ Delete notification
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(API_URL + `/notification/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? token : "",
        },
      });

      const data = await res.json();
      if (data.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      } else {
        alert("Failed to delete notification");
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
      alert("Something went wrong while deleting.");
    }
  };

  // ✅ Apply filter
  const filteredNotifications =
    filterType === "all"
      ? notifications
      : notifications.filter((n) => n.type === filterType);

  if (loading) {
    return <p className="p-4 text-gray-500">Loading notifications...</p>;
  }

  return (
    <div className="p-4 w-full max-w-7xl mt-5 md:mt-10 mx-auto space-y-6 font-interR">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-700 flex items-center gap-2">
          <Bell size={22} /> Notification Center
        </h1>

        {/* Bell with count */}
        <div className="relative hidden md:inline">
          <Bell className="text-gray-600" size={22} />
          <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full font-bold">
            {notifications.length}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterType("all")}
          className={`px-4 py-1.5 text-sm rounded-full border transition ${
            filterType === "all"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
          }`}
        >
          All
        </button>
        {availableTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-1.5 text-sm rounded-full border capitalize transition ${
              filterType === type
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Notification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotifications.length === 0 ? (
          <p className="text-gray-500">No notifications found.</p>
        ) : (
          filteredNotifications.map((noti) => {
            return (
              <div
                key={noti.id}
                className="flex items-start justify-between bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 p-5 transition-all duration-150"
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${defaultType.color}`}
                  >
                    {defaultType.icon}
                  </div>

                  {/* Content */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {noti.title}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-200 text-gray-800 capitalize">
                        {noti.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{noti.message}</p>
                    <span className="text-xs text-gray-400">{noti.time}</span>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(noti.id)}
                  className="text-red-500 hover:text-red-700 transition"
                  title="Delete Notification"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ShowNotificationList;
