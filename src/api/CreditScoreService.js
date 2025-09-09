// src/api/CreditScoreService.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // apne backend ka base URL daalna

// Token middleware ke liye token leke bhejna hoga
function getAuthHeaders() {
  const token = localStorage.getItem("token"); // ya jaha tu token store karta hai
  return { Authorization: `Bearer ${token}` };
}

export const CreditScoreService = {
  create: async (payload) => {
    return axios.post(`${API_BASE}/credit-score/create`, payload, {
      headers: getAuthHeaders(),
    });
  },

  update: async (id, payload) => {
    return axios.put(`${API_BASE}/credit-score/update/${id}`, payload, {
      headers: getAuthHeaders(),
    });
  },

  delete: async (id) => {
    return axios.post(`${API_BASE}/credit-score/delete/${id}`, {}, {
      headers: getAuthHeaders(),
    });
  },

  findById: async (id) => {
    return axios.get(`${API_BASE}/credit-score/findBy-id/${id}`, {
      headers: getAuthHeaders(),
    });
  },

  findAll: async (storeId, storeProfile_id) => {
    return axios.get(
      `${API_BASE}/credit-score/find-all/${storeId}/${storeProfile_id}`,
      { headers: getAuthHeaders() }
    );
  },

  findByName: async (storeId, storeProfile_id, name) => {
    return axios.get(
      `${API_BASE}/credit-score/findBy-name/${storeId}/${storeProfile_id}?name=${name}`,
      { headers: getAuthHeaders() }
    );
  },

  findDetails: async (storeId, storeProfile_id) => {
    return axios.get(
      `${API_BASE}/credit-score/find-details/${storeId}/${storeProfile_id}`,
      { headers: getAuthHeaders() }
    );
  },
};
