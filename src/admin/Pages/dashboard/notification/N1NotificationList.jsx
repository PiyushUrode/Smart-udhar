import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Archive,
  AlertTriangle,
  Info,
  XCircle,
} from 'lucide-react';

const dummyNotifications = [
  {
    id: 1,
    title: 'Payment Received',
    message: '₹5,000 received from Akash Kumar.',
    time: 'Just now',
    priority: 'success',
    read: false,
  },
  {
    id: 2,
    title: 'Low Stock Alert',
    message: 'Product "Smartphone A13" stock is below 10 units.',
    time: '5 mins ago',
    priority: 'warning',
    read: false,
  },
  {
    id: 3,
    title: 'New Sale Completed',
    message: 'Invoice #984 has been marked as paid.',
    time: '1 hour ago',
    priority: 'info',
    read: true,
  },
  {
    id: 4,
    title: 'System Error',
    message: 'Background sync failed for Staff module.',
    time: '2 hours ago',
    priority: 'urgent',
    read: false,
  },
  {
    id: 5,
    title: 'Customer Signed Up',
    message: 'New customer Rajeev added.',
    time: 'Yesterday',
    priority: 'info',
    read: true,
  },
];

const priorityMap = {
  urgent: { icon: <XCircle size={16} />, color: 'bg-red-100 text-red-700' },
  warning: { icon: <AlertTriangle size={16} />, color: 'bg-yellow-100 text-yellow-700' },
  info: { icon: <Info size={16} />, color: 'bg-blue-100 text-blue-700' },
  success: { icon: <CheckCircle2 size={16} />, color: 'bg-green-100 text-green-700' },
};

const N1NotificationList = () => {
  const [notifications, setNotifications] = useState(dummyNotifications);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const archiveNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

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
        {notifications.map((noti) => {
          const priority = priorityMap[noti.priority] || priorityMap.info;

          return (
            <div
              key={noti.id}
              className={`flex flex-col md:flex-row md:items-center justify-between bg-white rounded-xl shadow-customCard p-5 transition-all duration-150 ${
                !noti.read ? 'border-l-4 border-bluecol' : ''
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
        })}
      </div>
    </div>
  );
};

export default N1NotificationList;
