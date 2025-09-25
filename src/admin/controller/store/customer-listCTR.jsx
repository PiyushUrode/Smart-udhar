import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const API_URL = import.meta.env.VITE_API_URL;

export const useCustomerController = () => {
  const Auth_token = localStorage.getItem("authToken");
  const [mobile, setMobile] = useState("");
  const [storeId, setStoreId] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const token = Auth_token;

  // Fetch all customers (Admin)
  const fetchAllCustomersAdmin = async (pageNumber = 1, pageLimit = limit) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/customer-list`, {
        params: { page: pageNumber, limit: pageLimit },
        headers: { Authorization: token },
      });
      if (res.data.success) {
        setCustomers(res.data.customers || []);
        setPage(pageNumber);
        setTotalPages(Math.ceil(res.data.total / pageLimit) || 1);
      }
    } catch (err) {
      console.error("Error fetching admin customers:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch store by mobile
  const fetchStoreByMobile = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/store-auth/profileBy-number`,
        { mobile },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.store?.length > 0) {
        const id = res.data.store[0]._id;
        setStoreId(id);
        fetchBusinessProfiles(id);
      }
    } catch (err) {
      console.error("Error fetching store:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch businesses
  const fetchBusinessProfiles = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/store-business-profile/find-all/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      setBusinesses(res.data.data || []);
    } catch (err) {
      console.error("Error fetching business profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers by store and business
  const fetchCustomers = async (
    pageNumber = 1,
    businessId = selectedBusiness,
    pageLimit = limit
  ) => {
    if (!storeId || !businessId) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/admin/customer-list/${storeId}/${businessId}`,
        {
          params: { page: pageNumber, limit: pageLimit },
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setCustomers(res.data.customers || []);
        setPage(pageNumber);
        setTotalPages(Math.ceil(res.data.total / pageLimit) || 1);
      }
    } catch (err) {
      console.error(
        "Error fetching customers:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePagination = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    storeId
      ? fetchCustomers(newPage, selectedBusiness, limit)
      : fetchAllCustomersAdmin(newPage, limit);
  };

  const handleRowPerPage = (newLimit) => {
    setLimit(newLimit);
    storeId
      ? fetchCustomers(1, selectedBusiness, newLimit)
      : fetchAllCustomersAdmin(1, newLimit);
  };

  // Export to Excel
  const handleExportToExcel = () => {
    if (customers.length === 0) return;

    const worksheetData = customers.map((cust, index) => ({
      "S.No": (page - 1) * limit + index + 1,
      "Customer ID": cust.customId,
      Name: cust.name,
      Mobile: cust.mobile,
      Email: cust.email,
      Address: cust.address || "-",
      "Pin Code": cust.pin || "-",
      City: cust.city || "-",
      State: cust.state || "-",
      "Aadhar Card": cust.aadharCardNumber || "-",
      "PAN Number": cust.panNumber || "-",
      "Company Name": cust.companyName || "-",
      "GST Number": cust.gstNumber || "-",
      "Credit Score": cust.creditScore || "-",
      "Created At": new Date(cust.createdAt).toLocaleDateString(),
      "Updated At": new Date(cust.updatedAt).toLocaleDateString(),
      "Store Mobile": cust.storeMobile || "-",
      "Business Name": cust.businessName || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    XLSX.writeFile(workbook, "customers.xlsx");
  };

  useEffect(() => {
    fetchAllCustomersAdmin();
  }, []);

  return {
    mobile,
    setMobile,
    storeId,
    businesses,
    selectedBusiness,
    setSelectedBusiness,
    customers,
    page,
    totalPages,
    limit,
    loading,
    expandedRow,
    setExpandedRow,
    fetchStoreByMobile,
    fetchCustomers,
    handlePagination,
    handleRowPerPage,
    handleExportToExcel,
    API_URL,
  };
};