import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const API_URL = import.meta.env.VITE_API_URL;

export const useProductController = () => {
  const Auth_token = localStorage.getItem("authToken");
  const [mobile, setMobile] = useState("");
  const [storeId, setStoreId] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const token = Auth_token;

  const fetchAllProductsAdmin = async (pageNumber = 1, pageLimit = limit) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/product-list`, {
        params: { page: pageNumber, limit: pageLimit },
        headers: { Authorization: token },
      });
      if (res.data.success) {
        setProducts(res.data.products || []);
        setPage(pageNumber);
        setTotalPages(Math.ceil(res.data.total / pageLimit) || 1);
      }
    } catch (err) {
      console.error("Error fetching admin products:", err);
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

  const fetchProducts = async (
    pageNumber = 1,
    businessId = selectedBusiness,
    pageLimit = limit
  ) => {
    if (!storeId || !businessId) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/admin/product-list/${storeId}/${businessId}`,
        {
          params: { page: pageNumber, limit: pageLimit },
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        setProducts(res.data.products || []);
        setPage(pageNumber);
        setTotalPages(Math.ceil(res.data.total / pageLimit) || 1);
      }
    } catch (err) {
      console.error("Error fetching products:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePagination = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    storeId
      ? fetchProducts(newPage, selectedBusiness, limit)
      : fetchAllProductsAdmin(newPage, limit);
  };

  const handleRowsPerPage = (newLimit) => {
    setLimit(newLimit);
    storeId
      ? fetchProducts(1, selectedBusiness, newLimit)
      : fetchAllProductsAdmin(1, newLimit);
  };

  const handleExportToExcel = () => {
    if (products.length === 0) return;
    const worksheetData = products.map((prod, index) => ({
      "S.No": (page - 1) * limit + index + 1,
      Name: prod.name,
      "Product Image": prod.product_image || "-",
      Quantity: prod.quantity,
      "Min Quantity": prod.min_quantity,
      "Sold Quantity": prod.sold_quantity,
      Unit: prod.unit,
      "Sales Price": prod.sales_price,
      "Purchase Price": prod.purchase_price,
      Category: prod.category || "-",
      "HSN Number": prod.hsn_number || "-",
      Tax: prod.tax || 0,
      "Price Type": prod.price_type || "-",
      "Product Type": prod.product_type || "-",
      "Created At": new Date(prod.createdAt).toLocaleDateString(),
      "Updated At": new Date(prod.updatedAt).toLocaleDateString(),
      "Store Mobile": prod.storeMobile || "-",
      "Business Name": prod.businessName || "-",
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "products.xlsx");
  };

  useEffect(() => {
    fetchAllProductsAdmin();
  }, []);

  return {
    mobile,
    setMobile,
    businesses,
    selectedBusiness,
    setSelectedBusiness,
    products,
    page,
    totalPages,
    limit,
    loading,
    expandedRow,
    setExpandedRow,
    fetchStoreByMobile,
    fetchProducts,
    handlePagination,
    handleRowsPerPage,
    handleExportToExcel,
    API_URL,
  };
};