// src/components/D2BusinessList.jsx
import React, { useEffect, useState } from "react";
import { FaPlusCircle, FaEdit, FaTrash, FaCheckCircle , FaExclamationTriangle  } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setActiveBusiness } from "../../../reactStore/businessSlice.js"; 



const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
        {icon || <FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-500" />}
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

const D2BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [infoModal, setInfoModal] = useState({ show: false, title: "", message: "", icon: null });

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

  // ✅ Fetch all businesses
 // ✅ Fetch all businesses
  const fetchBusinesses = async () => {
  if (!store_id || !token) {
if (!store_id || !token) {
  setInfoModal({
    show: true,
    title: "⚠️ No Business Profile Found",
    message: "Please login first.",
    icon: <FaExclamationTriangle className="mx-auto h-12 w-12 text-red-500" />
  });
  setLoading(false);
  return;
}

    setLoading(false);

    // Immediate redirect
    navigate("/login");
    return; // Stop further execution
  }

  try {
    const res = await axios.get(
      `${API_BASE}/store-business-profile/find-all/${store_id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    let data =
      res.data?.businesses ||
      res.data?.data ||
      (Array.isArray(res.data) ? res.data : []);

    setBusinesses(data);

    // ✅ Persist last active business
    const lastActiveId = localStorage.getItem("storeProfile_id");

    if (lastActiveId && data.some(b => String(b._id) === String(lastActiveId))) {
      // Last active exists in current data → use it
      setstoreProfile_id(lastActiveId);
    } else if (data.length > 0) {
      // Only set first business if there was no previous active business
      setstoreProfile_id(data[0]._id);
      localStorage.setItem("storeProfile_id", data[0]._id);
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
  // Called when trash button clicked
const handleDelete = (id, name) => {
  setDeleteBusinessId(id);
  setDeleteBusinessName(name);
};

// Actual deletion after confirmation
const confirmDelete = async () => {
  if (!deleteBusinessId) return;

  try {
    await axios.delete(`${API_BASE}/store-business-profile/delete/${deleteBusinessId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // alert("✅ Deleted successfully");
    fetchBusinesses();
  } catch (error) {
    console.error("❌ Delete error:", error.response?.data || error.message);
    // alert("❌ Failed to delete business");
  } finally {
    setDeleteBusinessId(null);
    setDeleteBusinessName("");
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
  const dispatch = useDispatch();


  // ✅ Set Active Business
  // const handleSetActive = (id) => {
  //   setstoreProfile_id(id);
  //   localStorage.setItem("storeProfile_id", id);
  //   console.log("✅ Active Business ID:", id);
  //   alert("✔️ Active business set successfully!");
  // };

  const handleSetActive = (id, name) => {
  // 1️⃣ Redux update
  dispatch(setActiveBusiness({ id, name }));

  // 2️⃣ Local state update
  setstoreProfile_id(id);

  // 3️⃣ LocalStorage update
  localStorage.setItem("storeProfile_id", id);

  // 4️⃣ Notification
setInfoModal({
  show: true,
  title: "✔️ Success",
  message: "Active business set successfully!",
  icon: <FaCheckCircle className="mx-auto h-12 w-12 text-green-500" />
});

};




  return (
    <>
      {/* Header */}
      <div className="border px-5 md:px-10 py-10">  
      <div className="mx-auto py-2 px-2 md:mt-5">
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

      {/* Table */}
      <div className="flex text-xs mx-auto py-2 px-2 pl-3  items-center gap-3">
        <div className="  p-1 h-0 w-1 aspect-[1/1] rounded-full bg-green-600 font-semibold">
              {/* dot */}
            </div> Active
         
            <div className=" p-1 h-0 w-1 aspect-[1/1] rounded-full bg-red-500 font-semibold">
              {/* dot */}
            </div> Deactivate
         
         </div>

      <div className="mx-auto py-2 px-2 ">
        <div className="overflow-x-auto p-2 lg:p-5 bg-white rounded shadow ">
          {loading ? (
            <p>Loading businesses...</p>
          ) : businesses.length === 0 ? (
            <p className="text-gray-600"> Create your first Business Profile </p>
          ) : (
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-[#E8E8E8] text-left text-[#111827] font-robotoM text-base border-b border-gray-300 text-nowrap">
                <tr>
                  <th className="p-4">Business Name</th>
                  <th className="p-4">GST Number</th>
                  {/* <th className="p-4">Address</th> */}
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Email</th>
                  {/* <th className="p-4">Industry</th> */}
                  {/* <th className="p-4">Created At</th> */}
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
<tbody>
  {businesses.map((item) => {
 const isActive = String(activeBusinessId) === String(item._id);

    return (
      <tr
        key={item._id}
        className={`border-b border-gray-200 hover:bg-gray-50 text-nowrap transition-colors
           ${isActive ? "bg-green-50" : ""
        }`}
      >
        <td className="p-4 font-medium flex items-center">
         
          {isActive ? 
            <div className="mr-2 p-1 h-0 w-1 aspect-[1/1] rounded-full bg-green-600 font-semibold">
              {/* dot */}
            </div>
          :
            <div className="mr-2 p-1 h-0 w-1 aspect-[1/1] rounded-full bg-red-500 font-semibold">
              {/* dot */}
            </div>


        }
           {item.businessName || "-"}{" "}
        </td>
        <td className="p-4">{item.gstNumber || "-"}</td>
        {/* <td className="p-4">{item.address || "-"}</td> */}
        <td className="p-4">{item.mobile || "-"}</td>
        <td className="p-4">{item.email || "-"}</td>
        {/* <td className="p-4">{item.industry || "-"}</td> */}
        {/* <td className="p-4">
          {item.created_at
            ? new Date(item.created_at).toLocaleDateString()
            : "-"}
        </td> */}

 <td className="p-4 flex gap-3">
   <button
            onClick={() => handleSetActive(item._id, item.businessName)}
            className={`flex items-center gap-1 ${
              isActive ? "text-green-600" : "text-gray-600 hover:text-green-600"
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
  onClick={() => handleDelete(item._id, item.businessName)}
  className="flex items-center gap-1 text-red-600 hover:text-red-800"
>
  <FaTrash /> Delete
</button>

        </td>

      </tr>
    );
  })}
</tbody>

            </table>
          )}
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
    onClose={() => setInfoModal({ show: false, title: "", message: "", icon: null })}
  />
)}

      </div>
    </>
  );
};

export default D2BusinessList;
