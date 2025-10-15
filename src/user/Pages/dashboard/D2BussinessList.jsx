// src/components/D2BusinessList.jsx
import React, { useEffect, useState } from "react";
import {
  FaPlusCircle,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft, // New Icon for Pagination
  FaArrowRight, // New Icon for Pagination
} from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setActiveBusiness } from "../../../reactStore/businessSlice.js";
import NoData from "../../assets/common/no_data_1.webp";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";  

// --- Modals (Unchanged, omitted for brevity) ---
const DeleteConfirmationModal = ({ productName, onConfirm, onCancel }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm relative transform transition-all scale-100 opacity-100">
      <div className="text-center">
        <FaExclamationTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          Confirm Deletion
        </h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete the product:
            <br />
            <strong className="text-red-600">{productName}</strong>? This action
            cannot be undone.
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 transition sm:text-sm"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 transition sm:text-sm"
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

const InfoModal = ({ title, message, onClose, icon }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm relative transform transition-all scale-100 opacity-100">
      <div className="text-center">
        {icon || (
          <FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-500" />
        )}
        <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500">{message}</p>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={onClose}
          className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 transition sm:text-sm"
        >
          OK
        </button>
      </div>
    </div>
  </div>
);
// --- Modals End ---

const D2BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [infoModal, setInfoModal] = useState({
    show: false,
    title: "",
    message: "",
    icon: null,
  });

  // 🆕 PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10; // Fixed limit for the page size

  // State for Delete Confirmation
  const [deleteBusinessId, setDeleteBusinessId] = useState(null);
  const [deleteBusinessName, setDeleteBusinessName] = useState("");

  const [storeProfile_id, setstoreProfile_id] = useState(
    localStorage.getItem("storeProfile_id") || ""
  );

  const { activeBusinessId } = useSelector((state) => state.business);

  const store_id = Cookies.get("store_id");
  const token = Cookies.get("authToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Fetch all businesses (modified to accept pagination params)
  const fetchBusinesses = async (page = currentPage) => {
    if (!store_id || !token) {
      setInfoModal({
        show: true,
        title: "⚠️ No Business Profile Found",
        message: "Please login first.",
        icon: (
          <FaExclamationTriangle className="mx-auto h-12 w-12 text-red-500" />
        ),
      });
      setLoading(false);
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      // 🆕 Added page and limit query parameters
      const res = await axios.get(
        `${API_BASE}/store-business-profile/find-all/${store_id}?page=${page}&limit=${itemsPerPage}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Assuming the API response structure is like the one provided
      const data = res.data?.data || [];
      const total = res.data?.total || 0;
      const pages = res.data?.totalPages || 1;

      setBusinesses(data);
      setCurrentPage(res.data?.page || 1); // Ensure current page is updated based on response
      setTotalPages(pages);
      setTotalItems(total);

      // Persist last active business logic remains similar, but only runs on the first page load or data refresh
      if (page === 1) {
        const lastActiveId = localStorage.getItem("storeProfile_id");

        if (
          lastActiveId &&
          data.some((b) => String(b._id) === String(lastActiveId))
        ) {
          setstoreProfile_id(lastActiveId);
        } else if (data.length > 0 && !activeBusinessId) {
          // Set first business as active only if none is globally active
          setstoreProfile_id(data[0]._id);
          localStorage.setItem("storeProfile_id", data[0]._id);
        }
      }
    } catch (err) {
      console.error("❌ Error fetching businesses:", err);
      setBusinesses([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch of the first page
    fetchBusinesses(currentPage);
  }, [store_id, token, currentPage]); // Re-fetch when currentPage changes

  // 🆕 PAGINATION HANDLERS
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // ✅ Delete handler
  const handleDelete = (id, name) => {
    setDeleteBusinessId(id);
    setDeleteBusinessName(name);
  };

  // Actual deletion after confirmation
  const confirmDelete = async () => {
    if (!deleteBusinessId) return;

    try {
      await axios.delete(
        `${API_BASE}/store-business-profile/delete/${deleteBusinessId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // After successful deletion, re-fetch the current page to update the list
      // This is important because deleting an item might pull a new item onto the page
      setInfoModal({
        show: true,
        title: "✔️ Success",
        message: `${deleteBusinessName} deleted successfully!`,
        icon: <FaCheckCircle className="mx-auto h-12 w-12 text-green-500" />,
      });
      fetchBusinesses(currentPage);

    } catch (error) {
      console.error("❌ Delete error:", error.response?.data || error.message);
      setInfoModal({
        show: true,
        title: "❌ Failure",
        message: "Failed to delete business.",
        icon: <FaExclamationTriangle className="mx-auto h-12 w-12 text-red-500" />,
      });
    } finally {
      setDeleteBusinessId(null);
      setDeleteBusinessName("");
    }
  };

  // ✅ Edit handler
  const handleEdit = (business) => {
    navigate(`/dashboard/information/${business._id}`);
  };

  // ✅ Add New Business
  const handleAdd = () => {
    navigate("/dashboard/information");
  };

  // ✅ Set Active Business
  const handleSetActive = (id, name) => {
    dispatch(setActiveBusiness({ id, name }));
    setstoreProfile_id(id);
    localStorage.setItem("storeProfile_id", id);
    setInfoModal({
      show: true,
      title: "Success",
      message: "Active business set successfully!",
      icon: <FaCheckCircle className="mx-auto h-12 w-12 text-green-500" />,
    });
  };

  return (
    <>
      {/* Header (Unchanged) */}
      <div className="border px-2 md:px-10 py-10">
        <div className="mx-auto py-2  md:mt-5">
          <div className="flex justify-between items-center bg-white px-5 py-5 rounded shadow">
            <h1 className="text-base md:text-xl lg:text-2xl font-semibold text-[#1F2937] font-robotoB">
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

        {/* Status Indicators (Unchanged) */}
        <div className="flex text-xs mx-auto py-2 px-2 pl-3  items-center gap-3">
          <div className=" p-1 h-0 w-1 aspect-[1/1] rounded-full bg-green-600 font-semibold">
            {/* dot */}
          </div>{" "}
          Active
          <div className=" p-1 h-0 w-1 aspect-[1/1] rounded-full bg-red-500 font-semibold">
            {/* dot */}
          </div>{" "}
          Deactivate
        </div>

        {/* Table/Content Area */}
        <div className="mx-auto py-2 px-2 ">
          <div className="overflow-x-auto p-2 lg:p-5 bg-white rounded shadow ">
            {loading ? (
              <p>Loading businesses...</p>
            ) : businesses.length === 0 && totalItems === 0 ? (
              <div
                className="flex flex-col items-center gap-4 text-center text-gray-600 p-6"
                onClick={handleAdd}
              >
                <p
                  className="text-lg font-medium cursor-pointer underline text-blue-500 "
                  onClick={handleAdd}
                >
                  Create your first Business Profile
                </p>

                <img
                  src={NoData}
                  onClick={handleAdd}
                  alt="No data illustration"
                  className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 object-contain"
                  aria-hidden="false"
                />
              </div>
            ) : (
              <>
                <table className="w-full text-sm border border-gray-200">
                  <thead className="bg-[#E8E8E8] text-left text-[#111827] font-robotoM text-base border-b border-gray-300 text-nowrap">
                    <tr>
                      <th className="p-4">Business Name</th>
                      <th className="p-4">GST Number</th>
                      <th className="p-4">Mobile</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {businesses.map((item) => {
                      const isActive =
                        String(activeBusinessId) === String(item._id);

                      return (
                        <tr
                          key={item._id}
                          className={`border-b border-gray-200 hover:bg-gray-50 text-nowrap transition-colors
                            ${isActive ? "bg-green-50" : ""}`}
                        >
                          <td className="p-4 font-medium flex items-center">
                            {isActive ? (
                              <div className="mr-2 p-1 h-0 w-1 aspect-[1/1] rounded-full bg-green-600 font-semibold">
                                {/* dot */}
                              </div>
                            ) : (
                              <div className="mr-2 p-1 h-0 w-1 aspect-[1/1] rounded-full bg-red-500 font-semibold">
                                {/* dot */}
                              </div>
                            )}
                            {item.businessName || "-"}
                          </td>
                          <td className="p-4">{item.gstNumber || "-"}</td>
                          <td className="p-4">{item.mobile || "-"}</td>
                          <td className="p-4">{item.email || "-"}</td>
                          <td className="p-4 flex justify-between gap-3">
                            <button
                              onClick={() =>
                                handleSetActive(item._id, item.businessName)
                              }
                              className={`flex items-center gap-1 ${isActive
                                  ? "text-green-600"
                                  : "text-gray-600 hover:text-green-600"
                                }`}
                            >
                              <FaCheckCircle /> {isActive ? "Active" : "Set Active"}
                            </button>

                            <button
                              onClick={() => handleEdit(item)}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                            >
                              <FaEdit /> Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(item._id, item.businessName)
                              }
                              className="flex items-center gap-1 text-red-600 hover:text-red-800"
                            >
                              <FaTrash /> Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table >
              </>
            )}

            {/* 🆕 PAGINATION CONTROLS */}
            {!loading && businesses.length > 0 && totalPages > 1 && (
              <div className="flex justify-between items-center mt-5 p-4 border-t border-gray-200">
                <p className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                  <span className="font-semibold">{totalItems}</span> results
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 text-sm font-medium rounded-md flex items-center gap-1 transition
                      ${currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                  >
                    <FaArrowLeft className="w-3 h-3" /> Previous
                  </button>

                  <span className="px-3 py-1 text-sm font-semibold text-gray-700 border rounded-md">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 text-sm font-medium rounded-md flex items-center gap-1 transition
                      ${currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                  >
                    Next <FaArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Modals */}
            {deleteBusinessId && (
              <DeleteConfirmationModal
                productName={deleteBusinessName}
                onConfirm={confirmDelete}
                onCancel={() => {
                  setDeleteBusinessId(null);
                  setDeleteBusinessName("");
                }}
              />
            )}
          </div>
        </div>

        {infoModal.show && (
          <InfoModal
            title={infoModal.title}
            message={infoModal.message}
            icon={infoModal.icon}
            onClose={() =>
              setInfoModal({ show: false, title: "", message: "", icon: null })
            }
          />
        )}
      </div>
    </>
  );
};

export default D2BusinessList;