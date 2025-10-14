// src/user/Controllers/invoiceController.js
import axiosClient from "./axiosclient.js";
import { AuthService } from "./authservice.js";

export const fetchInvoiceById = async (id) => {
  try {
    const token = AuthService.getToken();
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await axiosClient.get(`/store-invoice/findBy-id/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return res.data.data;
  } catch (err) {
    console.error("Error fetching invoice:", err);
    throw err;
  }
};


