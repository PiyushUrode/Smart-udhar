// src/hooks/useNotificationTypes.js
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("authToken") || "";

export const useNotificationTypes = () => {
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [newChildren, setNewChildren] = useState([]);
  const [editingType, setEditingType] = useState(null);

  useEffect(() => {
    fetchAllTypes();
  }, []);

  // Fetch all types
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

  // Add new type
  const handleAddType = async () => {
    if (!newType.trim()) return alert("Type name required");
    try {
      const res = await axios.post(
        `${API_URL}/notification-type/add`,
        { name: newType, children: newChildren },
        { headers: { Authorization: token } }
      );
      if (res.data.success) {
        fetchAllTypes();
        setNewType("");
        setNewChildren([]);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add type");
    }
  };

  // Delete type
  const handleRemoveType = async (id) => {
    if (!window.confirm("Remove this notification type?")) return;
    try {
      const res = await axios.delete(`${API_URL}/notification-type/delete/${id}`, {
        headers: { Authorization: token },
      });
      if (res.data.success) {
        fetchAllTypes();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete type");
    }
  };

  // Update type
  const handleUpdateType = async () => {
    if (!editingType) return;
    try {
      const res = await axios.put(
        `${API_URL}/notification-type/update/${editingType._id}`,
        { name: editingType.name, children: editingType.children },
        { headers: { Authorization: token } }
      );
      if (res.data.success) {
        fetchAllTypes();
        setEditingType(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update type");
    }
  };

  return {
    types,
    newType,
    setNewType,
    newChildren,
    setNewChildren,
    editingType,
    setEditingType,
    handleAddType,
    handleRemoveType,
    handleUpdateType,
  };
};