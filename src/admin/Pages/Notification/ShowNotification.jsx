import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  Archive,
  AlertTriangle,
  Info,
  XCircle,
  Trash2,
} from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

const priorityMap = {
  urgent: { icon: <XCircle size={16} />, color: "bg-red-100 text-red-700" },
  warning: {
    icon: <AlertTriangle size={16} />,
    color: "bg-yellow-100 text-yellow-700",
  },
  info: { icon: <Info size={16} />, color: "bg-blue-100 text-blue-700" },
  success: {
    icon: <CheckCircle2 size={16} />,
    color: "bg-green-100 text-green-700",
  },
};

const ShowNotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(API_URL+"/notification/list", {
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
              time: formattedDate,
              priority: "info", // default for now
            };
          });
          setNotifications(mapped);
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
      const res = await fetch(
        API_URL+`/notification/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? token : "",
          },
        }
      );

      const data = await res.json();
      if (data.success) {
        // Remove from state without refetch
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      } else {
        alert("Failed to delete notification");
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
      alert("Something went wrong while deleting.");
    }
  };

  if (loading) {
    return <p className="p-4 text-gray-500">Loading notifications...</p>;
  }

  return (
    <div className="p-4 w-full max-w-7xl mt-5 md:mt-10 mx-auto space-y-6 font-interR">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-interSb text-bluecol flex items-center gap-2">
          <Bell size={20} /> Notification Center
        </h1>
        {/* Bell with count */}
        <div className="relative hidden md:inline">
          <Bell className="text-gray-600" size={22} />
          <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full font-interSb">
            {notifications.length}
          </span>
        </div>
      </div>

      {/* Notification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications found.</p>
        ) : (
          notifications.map((noti) => {
            const priority = priorityMap[noti.priority] || priorityMap.info;

            return (
              <div
                key={noti.id}
                className="flex items-start justify-between bg-white rounded-xl shadow-customCard p-5 transition-all duration-150"
              >
                <div className="flex gap-4">
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-full ${priority.color}`}
                  >
                    {priority.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-robotoM text-base text-gray-900">
                      {noti.title}
                    </h3>
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
