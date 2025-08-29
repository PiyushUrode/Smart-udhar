import React, { useEffect, useState } from "react";
import { FaPlusCircle, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const D2BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const store_id = Cookies.get("store_id");
  const token = Cookies.get("authToken");
  const navigate = useNavigate();

  // ✅ Fetch all businesses
  const fetchBusinesses = async () => {
    try {
      if (!store_id || !token) {
        alert("⚠️ Store ID or Token missing. Please login again.");
        return;
      }

      const res = await axios.get(
        `${API_BASE}/store-business-profile/find-all/${store_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("📌 API Response:", res.data);
      let data = res.data;

      if (Array.isArray(data)) {
        setBusinesses(data);
      } else if (Array.isArray(data.businesses)) {
        setBusinesses(data.businesses);
      } else if (Array.isArray(data.data)) {
        setBusinesses(data.data);
      } else {
        setBusinesses([]);
      }
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
    if (!window.confirm("⚠️ Are you sure you want to delete this business?")) return;

    try {
      await axios.delete(`${API_BASE}/store-business-profile/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Deleted successfully");
      fetchBusinesses(); // refresh list
    } catch (error) {
      console.error("❌ Delete error:", error.response?.data || error.message);
      alert("❌ Failed to delete business");
    }
  };

  // ✅ Edit handler
  const handleEdit = (business) => {
    navigate(`/dashboard/information/${business._id}`); // update route
  };

  // ✅ Add New Business
  const handleAdd = () => {
    navigate("/dashboard/information"); // create route
  };

  return (
    <>
      <div className="mx-auto py-2 px-2 md:mt-5">
        <div className="flex justify-between items-center bg-white px-5 py-5">
          <h1 className="text-xl font-semibold text-[#1F2937] font-robotoB">
            Business List
          </h1>
          <div
            className="text-sm lg:text-base font-semibold text-white p-2 bg-lightbluecol flex gap-3 items-center cursor-pointer rounded"
            onClick={handleAdd}
          >
            <FaPlusCircle /> Add Business
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mx-auto py-2 px-2 md:mt-5">
        <div className="overflow-x-auto p-2 lg:p-5">
          {loading ? (
            <p>Loading businesses...</p>
          ) : businesses.length === 0 ? (
            <p className="text-gray-600">No businesses found</p>
          ) : (
            <table className="w-full bg-white rounded-lg overflow-hidden shadow text-sm border border-gray-200">
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
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">{item.businessName}</td>
                    <td className="p-4">{item.gstNumber}</td>
                    <td className="p-4">{item.address}</td>
                    <td className="p-4">{item.mobile}</td>
                    <td className="p-4">{item.email}</td>
                    <td className="p-4">{item.industry}</td>
                    <td className="p-4">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-4 flex gap-3">
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
