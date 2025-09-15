// src/api/profileService.js
import axiosClient from "./axiosClient.js";
import { AuthService } from "./authservice.js";

const authHeader = () => {
  const token = AuthService.getToken();
  if (!token) throw new Error("Missing auth token");
  return { Authorization: `Bearer ${token}` };
};

export const ProfileService = {
  async createProfile(payload, signatureImage, logoImage) {
    const storeId = AuthService.getStoreId();
    if (!storeId) throw new Error("Missing storeId");

    const fd = new FormData();
    fd.append("store_id", storeId);

    Object.entries(payload).forEach(([k, v]) => {
      if (v) fd.append(k, v);
    });

    if (signatureImage) fd.append("signatureImage", signatureImage);
    if (logoImage) fd.append("logoImage", logoImage);

    const { data } = await axiosClient.post(
      "/store-business-profile/create",
      fd,
      { headers: authHeader() }
    );
    return data;
  },

  async updateProfile(id, payload, signatureImage, logoImage) {
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (v && k !== "store_id") fd.append(k, v);
    });

    if (signatureImage) fd.append("signatureImage", signatureImage);
    if (logoImage) fd.append("logoImage", logoImage);

    const { data } = await axiosClient.put(
      `/store-business-profile/update/${id}`,
      fd,
      { headers: authHeader() }
    );
    return data;
  },

  async getProfile(id) {
    const { data } = await axiosClient.get(
      `/store-business-profile/findBy-id/${id}`,
      { headers: authHeader() }
    );
    return data;
  },

  async getAllProfiles(storeId) {
    const { data } = await axiosClient.get(
      `/store-business-profile/find-all/${storeId}`,
      { headers: authHeader() }
    );
    return data;
  },

  async deleteProfile(id) {
    return axiosClient.delete(`/store-business-profile/delete/${id}`, {
      headers: authHeader(),
    });
  },
};
