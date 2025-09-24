// src/hooks/useNotifications.js
import { useState, useEffect } from "react";
import axios from "axios";
import { Cpu } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("authToken");

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [availableTypes, setAvailableTypes] = useState([]);

  // Default fallback for unknown types
  const defaultType = {
    icon: <Cpu size={16} />,
    color: "bg-gray-100 text-gray-700",
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL + "/notification/list", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
      });

      if (res.data.success) {
        const mapped = res.data.data.map((n) => {
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
            type: n.type?.toLowerCase() || "system",
            time: formattedDate,
          };
        });

        // Collect unique types
        const uniqueTypes = [
          ...new Set(mapped.map((n) => n.type)),
        ].filter(Boolean); // Filter out any undefined or null values

        setNotifications(mapped);
        setAvailableTypes(["all", ...uniqueTypes]);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Delete notification
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) {
      return;
    }
    try {
      await axios.delete(API_URL + `/notification/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
      });

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
      alert("Something went wrong while deleting.");
    }
  };

  // Filtered notifications logic
  const filteredNotifications =
    filterType === "all"
      ? notifications
      : notifications.filter((n) => n.type === filterType);

  return {
    notifications: filteredNotifications,
    totalNotifications: notifications.length,
    loading,
    filterType,
    setFilterType,
    availableTypes,
    handleDelete,
    defaultType, // Exporting the defaultType for the component to use
  };
};