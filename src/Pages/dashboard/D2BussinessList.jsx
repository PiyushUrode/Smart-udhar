// src/components/D2BusinessList.jsx
import React, { useEffect, useState } from "react";
import { FaPlusCircle, FaEdit, FaTrash, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const D2BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBusinessId, setActiveBusinessId] = useState(
    localStorage.getItem("activeBusinessId") || null
  );

  const store_id = Cookies.get("store_id");
  const token = Cookies.get("authToken");
  const navigate = useNavigate();

  // ✅ Fetch all businesses
  const fetchBusinesses = async () => {
    if (!store_id || !token) {
      alert("⚠️ Store ID or Token missing. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${API_BASE}/store-business-profile/find-all/${store_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("📌 API Response:", res.data);

      let data =
        res.data?.businesses ||
        res.data?.data ||
        (Array.isArray(res.data) ? res.data : []);

      setBusinesses(data);
    } catch (err) {
      console.error("❌ Error fetching businesses:", err);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [store_id, token]);

  // ✅ Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this business?"))
      return;

    try {
      await axios.delete(`${API_BASE}/store-business-profile/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Deleted successfully");
      fetchBusinesses();
    } catch (error) {
      console.error("❌ Delete error:", error.response?.data || error.message);
      alert("❌ Failed to delete business");
    }
  };

  // ✅ Edit handler
  const handleEdit = (business) => {
    console.log("✏️ Edit Business ID:", business._id);
    navigate(`/dashboard/information/${business._id}`);
  };

  // ✅ Add New Business
  const handleAdd = () => {
    navigate("/dashboard/information");
  };

  // ✅ Set Active Business
  const handleSetActive = (id) => {
    setActiveBusinessId(id);
    localStorage.setItem("activeBusinessId", id);
    console.log("✅ Active Business ID:", id);
    alert("✔️ Active business set successfully!");
  };

  return (
    <>
      {/* Header */}
      <div className="mx-auto py-2 px-2 md:mt-5">
        <div className="flex justify-between items-center bg-white px-5 py-5 rounded shadow">
          <h1 className="text-xl font-semibold text-[#1F2937] font-robotoB">
            Business List
          </h1>
          <button
            className="text-sm lg:text-base font-semibold text-white px-3 py-2 bg-lightbluecol flex gap-2 items-center cursor-pointer rounded"
            onClick={handleAdd}
          >
            <FaPlusCircle /> Add Business
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mx-auto py-2 px-2 md:mt-5">
        <div className="overflow-x-auto p-2 lg:p-5 bg-white rounded shadow">
          {loading ? (
            <p>Loading businesses...</p>
          ) : businesses.length === 0 ? (
            <p className="text-gray-600">No businesses found</p>
          ) : (
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-[#E8E8E8] text-left text-[#111827] font-robotoM text-base border-b border-gray-300">
                <tr>
                  <th className="p-4">Business Name</th>
                  <th className="p-4">GST Number</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Industry</th>
                  <th className="p-4">Created At</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((item) => (
                  <tr
                    key={item._id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      activeBusinessId === item._id ? "bg-green-50" : ""
                    }`}
                  >
                    <td className="p-4 font-medium">
                      {item.businessName || "-"}{" "}
                      {activeBusinessId === item._id && (
                        <span className="ml-2 text-green-600 font-semibold">
                          (Active)
                        </span>
                      )}
                    </td>
                    <td className="p-4">{item.gstNumber || "-"}</td>
                    <td className="p-4">{item.address || "-"}</td>
                    <td className="p-4">{item.mobile || "-"}</td>
                    <td className="p-4">{item.email || "-"}</td>
                    <td className="p-4">{item.industry || "-"}</td>
                    <td className="p-4">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-4 flex gap-3">
                      <button
                        onClick={() => handleSetActive(item._id)}
                        className={`flex items-center gap-1 ${
                          activeBusinessId === item._id
                            ? "text-green-600"
                            : "text-gray-600 hover:text-green-600"
                        }`}
                      >
                        <FaCheckCircle />{" "}
                        {activeBusinessId === item._id
                          ? "Active"
                          : "Set Active"}
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800"
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default D2BusinessList;
