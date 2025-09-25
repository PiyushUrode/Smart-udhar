import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const API_URL = import.meta.env.VITE_API_URL;

export const useBusinessStaffController = () => {
  const Auth_token = localStorage.getItem("authToken");
  const [mobile, setMobile] = useState("");
  const [storeId, setStoreId] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const token = Auth_token;

  const fetchAllStaffAdmin = async (pageNumber = 1, pageLimit = limit) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/staff-list`, {
        params: { page: pageNumber, limit: pageLimit },
        headers: { Authorization: token },
      });
      if (res.data.success) {
        setStaffList(res.data.staff || []);
        setPage(pageNumber);
        setTotalPages(Math.ceil(res.data.total / pageLimit) || 1);
      }
    } catch (err) {
      console.error("Error fetching admin staff:", err);
    } finally {
      setLoading(false);
    }
  };

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

  const fetchStaff = async (
    pageNumber = 1,
    businessId = selectedBusiness,
    pageLimit = limit
  ) => {
    if (!storeId || !businessId) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/admin/staff-list/${storeId}/${businessId}`,
        {
          params: { page: pageNumber, limit: pageLimit },
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        setStaffList(res.data.staff || []);
        setPage(pageNumber);
        setTotalPages(Math.ceil(res.data.total / pageLimit) || 1);
      }
    } catch (err) {
      console.error("Error fetching staff:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePagination = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    storeId
      ? fetchStaff(newPage, selectedBusiness, limit)
      : fetchAllStaffAdmin(newPage, limit);
  };

  const handleRowsPerPage = (newLimit) => {
    setLimit(newLimit);
    storeId
      ? fetchStaff(1, selectedBusiness, newLimit)
      : fetchAllStaffAdmin(1, newLimit);
  };

  const handleExportToExcel = () => {
    if (staffList.length === 0) return;
    const worksheetData = staffList.map((staff, index) => ({
      "S.No": (page - 1) * limit + index + 1,
      "First Name": staff.firstName,
      "Last Name": staff.lastName,
      "Mobile Number": staff.mobileNumber,
      "Email ID": staff.emailId,
      "Address": staff.address || "-",
      "Pin Number": staff.pinNumber || "-",
      "City": staff.city || "-",
      "State": staff.state || "-",
      "Roles": staff.roles?.join(", ") || "-",
      "Status": staff.status || "-",
      "Online": staff.online ? "Yes" : "No",
      "Created At": new Date(staff.createdAt).toLocaleDateString(),
      "Updated At": new Date(staff.updatedAt).toLocaleDateString(),
      "Store Mobile": staff.storeMobile || "-",
      "Business Name": staff.businessName || "-",
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Staff");
    XLSX.writeFile(workbook, "staff.xlsx");
  };

  useEffect(() => {
    fetchAllStaffAdmin();
  }, []);

  return {
    mobile,
    setMobile,
    storeId,
    businesses,
    selectedBusiness,
    setSelectedBusiness,
    staffList,
    page,
    totalPages,
    limit,
    loading,
    expandedRow,
    setExpandedRow,
    fetchStoreByMobile,
    fetchStaff,
    handlePagination,
    handleRowsPerPage,
    handleExportToExcel,
    API_URL,
  };
};