// src/api/staffDetails.js
import axiosClient from "./axiosClient";
import { AuthService } from "./authservice";

export const StaffService = {
  async createStaff(payload, staffImage) {
    const token = AuthService.getToken();
    const storeId = AuthService.getStoreId();
    const storeProfileId = localStorage.getItem("store_profile_id");

    if (!token || !storeId || !storeProfileId) {
      throw new Error("Missing authentication or store details");
    }

    const fd = new FormData();
    fd.append("store_id", storeId);
    fd.append("storeProfile_id", storeProfileId);
    Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
    if (staffImage) fd.append("image", staffImage);

    const { data } = await axiosClient.post("/store-staff/create", fd, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

async getAllStaff() {
  const token = AuthService.getToken();
  const storeId = AuthService.getStoreId();
  const storeProfileId = localStorage.getItem("store_profile_id");

  if (!token || !storeId || !storeProfileId) {
    throw new Error("Missing authentication or store details");
  }

  const { data } = await axiosClient.get(
    `/store-staff/find-all/${storeId}/${storeProfileId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  // ✅ return pure backend response
  return data; 
},


  async findStaffById(id) {
    const token = AuthService.getToken();
    const { data } = await axiosClient.get(`/store-staff/findBy-id/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  async findStaffByName(name) {
    const token = AuthService.getToken();
    const storeId = AuthService.getStoreId();
    const storeProfileId = localStorage.getItem("store_profile_id");

    const { data } = await axiosClient.get(
      `/store-staff/findBy-name/${storeId}/${storeProfileId}?name=${encodeURIComponent(
        name
      )}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  },

  async findStaffDetails(id) {
    const token = AuthService.getToken();
    const { data } = await axiosClient.get(`/store-staff/details/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  async updateStaff(id, payload, staffImage) {
    const token = AuthService.getToken();
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
    if (staffImage) fd.append("image", staffImage);

    const { data } = await axiosClient.put(`/store-staff/update/${id}`, fd, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  async deleteStaff(id) {
    const token = AuthService.getToken();
    const { data } = await axiosClient.post(`/store-staff/delete/${id}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
};
