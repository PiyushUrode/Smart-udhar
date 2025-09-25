// src/hooks/useNotification.js
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("authToken") || "";

export const useNotification = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [types, setTypes] = useState([]);
  const [intypes, setInTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [newChildren, setNewChildren] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all types for the 'manage' section
  const fetchAllTypes = async () => {
    try {
      const res = await axios.get(`${API_URL}/notification-type/list`, {
        headers: { Authorization: token },
      });
      if (res.data.success) {
        setTypes(res.data.data);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load notification types");
    }
  };

  // Fetch 'admin' children types for the 'send' form
  const fetchInTypes = async () => {
    try {
      const res = await axios.get(`${API_URL}/notification-type/list?name=admin`, {
        headers: { Authorization: token },
      });
      if (res.data.success) {
        const children = res.data.data[0]?.children || [];
        setInTypes(children);
        if (children.length > 0) {
          setNotificationType(children[0]);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load notification types");
    }
  };

  useEffect(() => {
    fetchInTypes();
    fetchAllTypes();
  }, []);

  // Add new type with children
  const handleAddType = async () => {
    if (!newType.trim()) return;
    try {
      const res = await axios.post(
        `${API_URL}/notification-type/add`,
        { name: newType, children: newChildren },
        { headers: { Authorization: token } }
      );
      if (res.data.success) {
        fetchInTypes();
        fetchAllTypes();
        setNewType("");
        setNewChildren([]);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add type");
    }
  };

  // Delete type from backend
  const handleRemoveType = async (id) => {
    if (!window.confirm("Remove this notification type?")) return;
    try {
      const res = await axios.delete(
        `${API_URL}/notification-type/delete/${id}`,
        { headers: { Authorization: token } }
      );
      if (res.data.success) {
        fetchInTypes();
        fetchAllTypes();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete type");
    }
  };

  // Send notification
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/notification/send`,
        {
          title,
          message,
          type: notificationType,
        },
        { headers: { Authorization: token } }
      );
      alert(res.data.message || "Notification sent!");
      setTitle("");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return {
    title,
    setTitle,
    message,
    setMessage,
    notificationType,
    setNotificationType,
    types,
    intypes,
    newType,
    setNewType,
    newChildren,
    setNewChildren,
    loading,
    handleAddType,
    handleRemoveType,
    handleSubmit,
  };
};