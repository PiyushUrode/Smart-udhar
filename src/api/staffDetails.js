// src/api/staffDetails.js
import axiosClient from "./axiosClient";
import { AuthService } from "./authservice";

export const StaffService = {
  // ✅ Create new staff
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

  // ✅ Get all staff
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

    return data;
  },

  // ✅ Get staff by ID
  async findStaffById(id) {
    const token = AuthService.getToken();
    if (!token) throw new Error("Missing token");

    const { data } = await axiosClient.get(`/store-staff/findBy-id/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  // ✅ Get staff by name
  async findStaffByName(name) {
    const token = AuthService.getToken();
    const storeId = AuthService.getStoreId();
    const storeProfile_id = localStorage.getItem("storeProfile_id");

    if (!token || !storeId || !storeProfile_id) {
      throw new Error("Missing authentication or store details");
    }

    const { data } = await axiosClient.get(
      `/store-staff/findBy-name/${storeId}/${storeProfile_id}?name=${encodeURIComponent(
        name
      )}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  },

  // ✅ Get staff details (optional)
  async findStaffDetails(id) {
    const token = AuthService.getToken();
    if (!token) throw new Error("Missing token");

    const { data } = await axiosClient.get(`/store-staff/details/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  // ✅ Update staff
// ✅ Update staff
async updateStaff(id, payload, staffImage) {
  const token = AuthService.getToken();
  const storeId = AuthService.getStoreId();
  const storeProfile_id = localStorage.getItem("storeProfile_id");

  if (!token || !storeId || !storeProfile_id) {
    throw new Error("Missing authentication or store details");
  }

  const fd = new FormData();
  fd.append("store_id", storeId);
  fd.append("storeProfile_id", storeProfile_id);

  // 👇 Keep roles same as createStaff (comma separated string)
  if (payload.roles) {
    if (Array.isArray(payload.roles)) {
      payload.roles.forEach(role => fd.append("roles", role)); 
      // each role added separately
    } else {
      fd.append("roles", payload.roles);
    }
  }

  // Append other fields
  Object.entries(payload).forEach(([key, value]) => {
    if (key !== "roles") fd.append(key, value ?? "");
  });

  if (staffImage) {
    fd.append("image", staffImage);
  }

  const { data } = await axiosClient.put(`/store-staff/update/${id}`, fd, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
}
,
  // ✅ Delete staff
  async deleteStaff(id) {
    const token = AuthService.getToken();
    if (!token) throw new Error("Missing token");

    const { data } = await axiosClient.post(`/store-staff/delete/${id}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
};
