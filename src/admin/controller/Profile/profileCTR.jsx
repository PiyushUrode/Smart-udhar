// src/hooks/useProfile.js
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const Auth_token = localStorage.getItem("authToken");

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", mobile: "", roles: "" });
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch profile on component mount
  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin-auth/profile`, {
        headers: { Authorization: Auth_token },
      });
      const store = response.data?.store || null;
      setProfile(store);
      setFormData({
        name: store?.name || "",
        mobile: store?.mobile || "",
        roles: store?.roles || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("mobile", formData.mobile);
      data.append("roles", formData.roles);
      if (selectedImage) data.append("img_url", selectedImage);

      const response = await axios.put(
        `${API_URL}/admin-auth/update-profile`,
        data,
        {
          headers: {
            Authorization: Auth_token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfile(response.data.store);
      setEditing(false);
      setSelectedImage(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: profile.name,
      mobile: profile.mobile,
      roles: profile.roles,
    });
    setSelectedImage(null);
  };

  return {
    profile,
    loading,
    editing,
    setEditing,
    formData,
    handleInputChange,
    handleImageChange,
    handleSave,
    handleCancel,
    saving,
    selectedImage,
    API_URL,
  };
};