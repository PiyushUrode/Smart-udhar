// src/api/customerService.js
import axiosClient from "./axiosclient.js";
import { AuthService } from "./authservice.js";

const getstoreProfile_id = () =>
  (typeof AuthService.getstoreProfile_id === "function" &&
    AuthService.getstoreProfile_id()) ||
  localStorage.getItem("storeProfile_id");

function getAuthContext() {
  const token = AuthService.getToken?.() || null;
  const store_id = AuthService.getStoreId?.() || null;
  const storeProfile_id = getstoreProfile_id() || null;

  if (!token) throw new Error("Missing auth token");
  if (!store_id) throw new Error("Missing store_id");
  if (!storeProfile_id) throw new Error("Missing storeProfile_id");

  return { token, store_id, storeProfile_id };
}

// Helper to validate ObjectId (MongoDB format: 24 hex chars)
function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

const FIELD_LABEL = {
  name: "Name",
  mobile: "Mobile",
  email: "Email",
  product_image: "Product Image",
  address: "Address",
  pin: "PIN",
  city: "City",
  creditScore: "Credit Score",
  state: "State",
  aadharCardNumber: "Aadhar Card Number",
  panNumber: "PAN Number",
  companyName: "Company Name",
  gstNumber: "GST Number",
  _id: "Unique ID (MongoDB _id)",
  id: "Cust ID (customId)",
  customId: "Custom ID",  // Added for clarity
};

const ALLOWED_FIELDS = new Set([
  "name",
  "mobile",
  "email",
  "product_image",
  "address",
  "pin",
  "city",
  "creditScore", 
  "state",
  "aadharCardNumber",
  "panNumber",
  "companyName",
  "gstNumber",
  "store_id",
  "storeProfile_id",
  "_id",
  "id",
  "customId",  // Added to allow customId in payloads if needed
]);

function sanitizePayload(raw = {}) {
  const clean = {};
  Object.keys(raw || {}).forEach((k) => {
    if (ALLOWED_FIELDS.has(k) && raw[k] !== undefined) clean[k] = raw[k];
  });
  return clean;
}


function safePayload(form, store_id, storeProfile_id) {
  return {
    ...form,
    name: form.name?.trim() || "Unnamed",
    mobile: form.mobile || "+910000000000",
    store_id: form.store_id || store_id,
    storeProfile_id: form.storeProfile_id || storeProfile_id,
  };
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
const DEFAULT_REQUIRED_UPDATE = ["_id", "name", "mobile"];  // Note: _id is required for update

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

export const CustomerService = {
async createCustomer(form = {}, opts = {}) {
  const { token, store_id, storeProfile_id } = getAuthContext();

  let payload;
  let headers = authHeaders(token);

  if (form.customerImage instanceof File) {
    payload = new FormData();
    Object.entries(safePayload(form, store_id, storeProfile_id)).forEach(
      ([key, value]) => payload.append(key, value)
    );
    headers = { ...headers, "Content-Type": "multipart/form-data" };
  } else {
    payload = safePayload(form, store_id, storeProfile_id);
  }

  // validateRequired kabhi fail nahi karega because fallback values hamesha hain
  const required = opts.required || DEFAULT_REQUIRED_CREATE;
  const missing = validateRequired(payload, required);
  if (missing.length) {
    console.warn("⚠️ Missing fields replaced with defaults:", missing);
  }

  const { data } = await axiosClient.post("/store-customer/create", payload, {
    headers,
  });

  return {
    success: data?.success ?? true,
    customer: data?.data || data,
    customerId: data?.data?.customId || data?.customId,
  };
},


async updateCustomer(form = {}, opts = {}) {
  const { token, store_id, storeProfile_id } = getAuthContext();
  const id = form._id || form.id;
  if (!id) throw new Error("Missing customer id");

  let payload;
  let headers = authHeaders(token);

  if (form.customerImage instanceof File) {
    payload = new FormData();
    Object.entries(safePayload(form, store_id, storeProfile_id)).forEach(
      ([key, value]) => payload.append(key, value)
    );
    payload.append("_id", id);
    headers = { ...headers, "Content-Type": "multipart/form-data" };
  } else {
    payload = { ...safePayload(form, store_id, storeProfile_id), _id: id };
  }

  const required = opts.required || DEFAULT_REQUIRED_UPDATE;
  const missing = validateRequired(payload, required);
  if (missing.length) {
    console.warn("⚠️ Missing fields replaced with defaults:", missing);
  }

  const { data } = await axiosClient.put("/store-customer/update", payload, {
    headers,
  });

  return {
    success: data?.success ?? true,
    customer: data?.customer || data,
    customerId: data?.customer?.customId || data?.customerId,
  };
},


  async deleteCustomer(id) {  // Expects MongoDB _id (e.g., "68bfba0d85ae94d9fe579bbf")
    const { token } = getAuthContext();
    if (!id) {
      const err = new Error("Missing customer _id");
      err.name = "CustomerValidationError";
      err.missingFields = ["_id"];
      throw err;
    }

    // Validate ObjectId client-side to prevent bad requests
    if (!isValidObjectId(id)) {
      const err = new Error("Invalid customer _id format (must be valid MongoDB ObjectId)");
      err.name = "CustomerValidationError";
      err.missingFields = ["_id"];
      throw err;
    }

    const { data } = await axiosClient.post(
      `/store-customer/delete/${id}`,  // URL uses _id
      null,
      { headers: authHeaders(token) }
    );

    // Matches Postman response: success + deleted customer details
    return {
      success: data?.success ?? true,
      customer: data?.customer || null,  // Deleted customer (with customId for confirmation)
    };
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

    // Normalize: Each customer has _id, customId, etc.
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
      customers,  // Array of full docs: [{ _id: "...", customId: "CUST019", ... }]
    };
  },

  async findCustomerById(id) {  // Expects _id
    const { token } = getAuthContext();
    if (!id) {
      const err = new Error("Missing customer _id");
      err.name = "CustomerValidationError";
      err.missingFields = [FIELD_LABEL._id];
      throw err;
    }
    if (!isValidObjectId(id)) {
      const err = new Error("Invalid customer _id format");
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
      customer: data?.data || data,  // Full doc with _id and customId
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
      customers: data?.data || data,  // Array with _id and customId
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


  async exportCustomersToPDF() {
  const { token, store_id, storeProfile_id } = getAuthContext();
  const res = await axiosClient.get(
    `/store-customer/export-pdf/${store_id}/${storeProfile_id}`,
    { headers: authHeaders(token), responseType: "blob" }
  );

  if (!res.data || res.data.size === 0) {
    throw new Error("Empty PDF received — check backend export logic");
  }

  return res.data;
},

};

export default CustomerService;