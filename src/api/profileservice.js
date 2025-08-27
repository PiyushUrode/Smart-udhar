// src/api/profileService.js
import axiosClient from "./axiosClient";
import { AuthService } from "./authservice";

export const ProfileService = {
  async createProfile(payload, signatureImage, logoImage) {
    const token = AuthService.getToken();
    const storeId = AuthService.getStoreId();

    console.log("📌 ProfileService.createProfile -> token:", token);
    console.log("📌 ProfileService.createProfile -> storeId:", storeId);

    if (!token || !storeId) throw new Error("Missing auth token or store ID");

    const fd = new FormData();

    // ✅ store_id only once
    fd.append("store_id", storeId.toString().trim());

    // ✅ append other fields except store_id
    Object.entries(payload).forEach(([k, v]) => {
      if (k !== "store_id" && v !== null && v !== undefined) {
        fd.append(k, v);
      }
    });

    if (signatureImage) fd.append("signatureImage", signatureImage);
    if (logoImage) fd.append("logoImage", logoImage);

    console.log("📤 Sending FormData:");
    for (let [key, val] of fd.entries()) {
      console.log(`   ${key}:`, val);
    }

    const { data } = await axiosClient.post(
      "/store-business-profile/create",
      fd,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (data?.id) {
      localStorage.setItem("store_profile_id", data.id);
      console.log("✅ Saved store_profile_id to localStorage:", data.id);
    } else {
      console.warn("⚠️ No store_profile_id returned in API response");
    }

    console.log("✅ ProfileService.createProfile -> response:", data);
    return data;
  },

  async updateProfile(id, payload, signatureImage, logoImage) {
    const token = AuthService.getToken();
    console.log("📌 ProfileService.updateProfile -> token:", token);
    if (!token) throw new Error("Missing auth token");

    const fd = new FormData();

    // ✅ don't send store_id again here (update is by profile_id)
    Object.entries(payload).forEach(([k, v]) => {
      if (k !== "store_id" && v !== null && v !== undefined) {
        fd.append(k, v);
      }
    });

    if (signatureImage) fd.append("signatureImage", signatureImage);
    if (logoImage) fd.append("logoImage", logoImage);

    console.log("📤 Updating FormData:");
    for (let [key, val] of fd.entries()) {
      console.log(`   ${key}:`, val);
    }

    const { data } = await axiosClient.put(
      `/store-business-profile/update/${id}`,
      fd,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    localStorage.setItem("store_profile_id", id);
    console.log("✅ Updated store_profile_id in localStorage:", id);
    console.log("✅ ProfileService.updateProfile -> response:", data);

    return data;
  },

  async getProfile(id) {
    const token = AuthService.getToken();
    console.log("📌 ProfileService.getProfile -> token:", token);
    if (!token) throw new Error("Missing auth token");

    const { data } = await axiosClient.get(
      `/store-business-profile/findBy-id/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    localStorage.setItem("store_profile_id", id);
    console.log("✅ Saved store_profile_id to localStorage:", id);
    console.log("✅ ProfileService.getProfile -> response:", data);

    return data;
  },
};
