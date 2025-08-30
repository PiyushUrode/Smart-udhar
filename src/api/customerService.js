// src/api/customerService.js
import axiosClient from "./axiosClient";
import { AuthService } from "./authservice.js";

const getStoreProfileId = () =>
  (typeof AuthService.getStoreProfileId === "function" &&
    AuthService.getStoreProfileId()) ||
  localStorage.getItem("store_profile_id");

function getAuthContext() {
  const token = AuthService.getToken?.() || null;
  const store_id = AuthService.getStoreId?.() || null;
  const storeProfile_id = getStoreProfileId() || null;

  if (!token) throw new Error("Missing auth token");
  if (!store_id) throw new Error("Missing store_id");
  if (!storeProfile_id) throw new Error("Missing storeProfile_id");

  return { token, store_id, storeProfile_id };
}

const FIELD_LABEL = {
  name: "Name",
  mobile: "Mobile",
  email: "Email",
  address: "Address",
  pin: "PIN",
  city: "City",
  state: "State",
  aadharCardNumber: "Aadhar Card Number",
  panNumber: "PAN Number",
  companyName: "Company Name",
  gstNumber: "GST Number",
  _id: "Unique ID",
  id: "Unique ID",
};

const ALLOWED_FIELDS = new Set([
  "name",
  "mobile",
  "email",
  "address",
  "pin",
  "city",
  "state",
  "aadharCardNumber",
  "panNumber",
  "companyName",
  "gstNumber",
  "store_id",
  "storeProfile_id",
  "_id",
  "id",
]);

function sanitizePayload(raw = {}) {
  const clean = {};
  Object.keys(raw || {}).forEach((k) => {
    if (ALLOWED_FIELDS.has(k) && raw[k] !== undefined) clean[k] = raw[k];
  });
  return clean;
}

function validateRequired(payload, requiredKeys) {
  const missing = [];
  (requiredKeys || []).forEach((k) => {
    const v = payload?.[k];
    if (
      v === undefined ||
      v === null ||
      (typeof v === "string" && v.trim() === "")
    ) {
      missing.push(FIELD_LABEL[k] || k);
    }
  });
  return missing;
}

const DEFAULT_REQUIRED_CREATE = ["name", "mobile"];
const DEFAULT_REQUIRED_UPDATE = ["_id", "name", "mobile"];

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

export const CustomerService = {
  async createCustomer(form = {}, opts = {}) {
    const { token, store_id, storeProfile_id } = getAuthContext();

    const payload = {
      ...form,
      store_id: form.store_id || store_id,
      storeProfile_id: form.storeProfile_id || storeProfile_id,
    };

    const required = opts.required || DEFAULT_REQUIRED_CREATE;
    const missing = validateRequired(payload, required);
    if (missing.length) {
      const err = new Error(`Missing required fields: ${missing.join(", ")}`);
      err.name = "CustomerValidationError";
      err.missingFields = missing;
      throw err;
    }

    const clean = sanitizePayload(payload);
    const { data } = await axiosClient.post("/store-customer/create", clean, {
      headers: authHeaders(token),
    });

    return {
      success: data?.success ?? true,
      customer: data?.data || data,
      customerId: data?.data?.customerId || data?.customerId,
    };
  },

  async updateCustomer(form = {}, opts = {}) {
    const { token, store_id, storeProfile_id } = getAuthContext();
    const id = form._id || form.id;

    const payload = {
      ...form,
      _id: id,
      id,
      store_id: form.store_id || store_id,
      storeProfile_id: form.storeProfile_id || storeProfile_id,
    };

    const required = opts.required || DEFAULT_REQUIRED_UPDATE;
    const missing = validateRequired(payload, required);
    if (missing.length) {
      const err = new Error(`Missing required fields: ${missing.join(", ")}`);
      err.name = "CustomerValidationError";
      err.missingFields = missing;
      throw err;
    }

    const clean = sanitizePayload(payload);
    const { data } = await axiosClient.put("/store-customer/update", clean, {
      headers: authHeaders(token),
    });

    return {
      success: data?.success ?? true,
      customer: data?.data || data,
      customerId: data?.data?.customerId || data?.customerId,
    };
  },

  async deleteCustomer(id) {
    const { token } = getAuthContext();
    if (!id) {
      const err = new Error("Missing customer id");
      err.name = "CustomerValidationError";
      err.missingFields = [FIELD_LABEL._id];
      throw err;
    }
    const { data } = await axiosClient.post(
      `/store-customer/delete/${id}`,
      null,
      { headers: authHeaders(token) }
    );
    return { success: data?.success ?? true };
  },

async getAllCustomers({ page, limit } = {}) {
  const { token, store_id, storeProfile_id } = getAuthContext();
  const qs =
    page || limit
      ? `?${new URLSearchParams({
          ...(page ? { page: String(page) } : {}),
          ...(limit ? { limit: String(limit) } : {}),
        }).toString()}`
      : "";

  const { data } = await axiosClient.get(
    `/store-customer/find-all/${store_id}/${storeProfile_id}${qs}`,
    { headers: authHeaders(token) }
  );

  let customers = [];

  // normalize
  if (Array.isArray(data)) {
    customers = data;
  } else if (Array.isArray(data?.data)) {
    customers = data.data;
  } else if (Array.isArray(data?.customers)) {
    customers = data.customers;
  } else if (Array.isArray(data?.data?.customers)) {
    customers = data.data.customers;
  }

  return {
    success: data?.success ?? true,
    customers,
  };
}
,

  async findCustomerById(id) {
    const { token } = getAuthContext();
    if (!id) {
      const err = new Error("Missing customer id");
      err.name = "CustomerValidationError";
      err.missingFields = [FIELD_LABEL._id];
      throw err;
    }
    const { data } = await axiosClient.get(
      `/store-customer/findBy-id/${id}`,
      { headers: authHeaders(token) }
    );
    return {
      success: data?.success ?? true,
      customer: data?.data || data,
    };
  },

  async searchCustomers(params = {}) {
    const { token, store_id, storeProfile_id } = getAuthContext();
    const { data } = await axiosClient.get(
      `/store-customer/search/${store_id}/${storeProfile_id}`,
      { headers: authHeaders(token), params }
    );
    return {
      success: data?.success ?? true,
      customers: data?.data || data,
    };
  },

  async uploadExcel(excelFile) {
    const { token, store_id, storeProfile_id } = getAuthContext();
    if (!excelFile) {
      const err = new Error("Please select an Excel file to upload");
      err.name = "CustomerValidationError";
      err.missingFields = ["Excel File"];
      throw err;
    }
    const fd = new FormData();
    fd.append("excelFile", excelFile);
    fd.append("store_id", store_id);
    fd.append("storeProfile_id", storeProfile_id);

    const { data } = await axiosClient.post("/store-customer/upload-excel", fd, {
      headers: { ...authHeaders(token) },
    });
    return { success: data?.success ?? true };
  },

  async exportCustomersToExcel() {
    const { token, store_id, storeProfile_id } = getAuthContext();
    const res = await axiosClient.get(
      `/store-customer/export-excel/${store_id}/${storeProfile_id}`,
      { headers: authHeaders(token), responseType: "blob" }
    );
    return res.data;
  },
};

export default CustomerService;
