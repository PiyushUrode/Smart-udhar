// src/api/staffDetails.js
import axiosClient from "./axiosClient";
import { AuthService } from "./authservice";

export const StaffService = {
  async createStaff(payload, staffImage) {
    const token = AuthService.getToken();
    const storeId = AuthService.getStoreId();
    const storeProfile_id = localStorage.getItem("storeProfile_id");

    if (!token || !storeId || !storeProfile_id) {
      throw new Error("Missing authentication or store details");
    }

    const fd = new FormData();
    fd.append("store_id", storeId);
    fd.append("storeProfile_id", storeProfile_id);
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
  const storeProfile_id = localStorage.getItem("storeProfile_id");

  if (!token || !storeId || !storeProfile_id) {
    throw new Error("Missing authentication or store details");
  }

  const { data } = await axiosClient.get(
    `/store-staff/find-all/${storeId}/${storeProfile_id}`,
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
    const storeProfile_id = localStorage.getItem("storeProfile_id");

    const { data } = await axiosClient.get(
      `/store-staff/findBy-name/${storeId}/${storeProfile_id}?name=${encodeURIComponent(
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
