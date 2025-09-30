// src/api/addCustomerService.js
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "./axiosclient.js";
import { AuthService } from "../api/authservice.js";

const getStoreProfileId = () =>
  (typeof AuthService.getstoreProfile_id === "function" &&
    AuthService.getstoreProfile_id()) ||
  localStorage.getItem("storeProfile_id");

function getAuthContext() {
  const token = AuthService.getToken?.() || null;
  const store_id = AuthService.getStoreId?.() || null;
  const storeProfile_id = getStoreProfileId() || null;

  if (!token) throw new Error("Missing auth token");
  if (!store_id) throw new Error("Missing store_id");
  if (!storeProfile_id) throw new Error("Missing storeProfile_id");

  return { token, store_id, storeProfile_id };
}

const initialFormState = {
  name: "",
  mobile: "",
  email: "",
  address: "",
  pin: "",
  city: "",
  state: "",
  aadharCardNumber: "",
  panNumber: "",
  companyName: "",
  gstNumber: "",
  image: null,
};

const initialErrorState = {
  name: "",
  mobile: "",
  email: "",
};

export const useCustomerForm = () => {
  const { id: customerId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormState);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(initialErrorState);

  // 🔔 Popup state
  const [popupType, setPopupType] = useState(null); // 'success' | 'error' | 'processing'
  const [message, setMessage] = useState("");

  // Fetch customer if editing
  useEffect(() => {
    if (customerId) {
      const fetchCustomer = async () => {
        try {
          const { token } = getAuthContext();
          const res = await axiosClient.get(
            `/store-customer/findBy-id/${customerId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (res.data?.success) {
            setFormData({ ...res.data.customer, image: null });
            if (res.data.customer.image) {
              const baseURL = axiosClient.defaults.baseURL;
              setPreview(
                `${baseURL}/assets/uploadCustomerImage/${res.data.customer.image}`
              );
            }
          }
        } catch (err) {
          console.error("Error fetching customer:", err);
        }
      };

      fetchCustomer();
    }
  }, [customerId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      if (file.size > 2 * 1024 * 1024) {
        setPopupType("error");
        setMessage("Image size cannot exceed 2MB!");
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleClear = () => {
    setFormData(initialFormState);
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(null);
    setErrors(initialErrorState);
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = { ...initialErrorState };
    const { name, mobile, email } = formData;

    if (!name.trim()) {
      newErrors.name = "Name is required.";
      valid = false;
    } else if (name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
      valid = false;
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobile.trim()) {
      newErrors.mobile = "Mobile is required.";
      valid = false;
    } else if (!mobileRegex.test(mobile.trim())) {
      newErrors.mobile = "Invalid mobile number (Must be 10 digits).";
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Invalid email address.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setPopupType("error");
      setMessage("Please correct the highlighted errors.");
      return;
    }

    setLoading(true);
    setPopupType("processing");
    setMessage(customerId ? "Updating customer..." : "Creating customer...");

    try {
      const { token, store_id, storeProfile_id } = getAuthContext();
      const payload = new FormData();

      for (const key in formData) {
        if (key === "store_id" || key === "storeProfile_id") continue;
        if (formData[key]) payload.append(key, formData[key]);
      }

      payload.append("store_id", store_id);
      payload.append("storeProfile_id", storeProfile_id);

      let res;
      if (customerId) {
        payload.append("id", customerId);
        res = await axiosClient.put("/store-customer/update", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        res = await axiosClient.post("/store-customer/create", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setPopupType("success");
      setMessage(res.data.message || "Success!");
      setTimeout(() => {
        navigate("/dashboard/customer-details");
      }, 1200);
    } catch (err) {
      console.error(err);
      setPopupType("error");
      setMessage(
        err.response?.data?.message || err.message || "Error saving customer!"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    preview,
    loading,
    errors,
    customerId,
    popupType,
    message,
    setPopupType,
    setMessage,
    handleChange,
    handleClear,
    handleSubmit,
  };
};
