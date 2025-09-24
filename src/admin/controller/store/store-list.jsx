import { useState, useEffect } from "react";
import axios from "axios";

const useStoreController = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const Auth_token = localStorage.getItem("authToken");

  const [storeList, setStoreList] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Business Profile state
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [showProfiles, setShowProfiles] = useState(false);

  // Fetch store list
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/admin/store-list?page=${page}&limit=${limit}`,
          {
            headers: { Authorization: Auth_token },
          }
        );
        setStoreList(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching store list:", error);
      }
    };
    fetchStores();
  }, [page, limit]);

  // Fetch business profiles by store_id
  const fetchBusinessProfiles = async (store_id) => {
    try {
      const response = await axios.get(
        `${API_URL}/store-business-profile/find-all/${store_id}?page=1&limit=5`,
        {
          headers: { Authorization: Auth_token },
        }
      );
      setBusinessProfiles(response.data.data || []);
      setSelectedStoreId(store_id);
      setShowProfiles(true);
    } catch (error) {
      console.error("Error fetching business profiles:", error);
    }
  };

  // Date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filtered List
  const filteredList = storeList.filter(
    (store) =>
      store.mobile?.toLowerCase().includes(search.toLowerCase()) ||
      store.roles?.toLowerCase().includes(search.toLowerCase())
  );

  return {
    storeList,
    search,
    setSearch,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    businessProfiles,
    selectedStoreId,
    showProfiles,
    setShowProfiles,
    fetchBusinessProfiles,
    formatDate,
    filteredList,
  };
};

export default useStoreController;
