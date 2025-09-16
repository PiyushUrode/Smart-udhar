import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  Archive,
  AlertTriangle,
  Info,
  XCircle,
} from "lucide-react";

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

  // ✅ Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("authToken"); // store your JWT in localStorage
        const res = await fetch("http://localhost:5000/notification/list", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? token : "",
          },
        });

        const data = await res.json();
        if (data.success) {
          // Transform API response into frontend format
          const mapped = data.data.map((n) => ({
            id: n._id,
            title: n.title,
            message: n.message,
            time: n.created_at,
            priority: "info", // default (you can enhance: e.g., error messages → urgent)
            read: false,
          }));
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

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const archiveNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
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
            {notifications.filter((n) => !n.read).length}
          </span>
        </div>
      </div>

      {/* Notification Cards */}
      <div className="grid grid-cols-1 gap-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications found.</p>
        ) : (
          notifications.map((noti) => {
            const priority = priorityMap[noti.priority] || priorityMap.info;

            return (
              <div
                key={noti.id}
                className={`flex flex-col md:flex-row md:items-center justify-between bg-white rounded-xl shadow-customCard p-5 transition-all duration-150 ${
                  !noti.read ? "border-l-4 border-bluecol" : ""
                }`}
              >
                <div className="flex items-start gap-4">
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

                <div className="flex gap-2 mt-4 md:mt-0 md:ml-4">
                  {!noti.read && (
                    <button
                      onClick={() => markAsRead(noti.id)}
                      className="text-xs px-3 py-1.5 bg-bluecol text-white rounded-md hover:bg-blue-700 transition-all font-interSb"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => archiveNotification(noti.id)}
                    className="text-xs px-3 py-1.5 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100 transition-all font-interR flex items-center gap-1"
                  >
                    <Archive size={14} /> Archive
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ShowNotificationList;
