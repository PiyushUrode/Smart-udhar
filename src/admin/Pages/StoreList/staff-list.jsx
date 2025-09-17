import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BusinessStaffViewer() {
  const API_URL = import.meta.env.VITE_API_URL;
  const Auth_token = localStorage.getItem("authToken");

  const [mobile, setMobile] = useState("");
  const [storeId, setStoreId] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = `Bearer ${Auth_token}`;


    const fetchAllStaffAdmin = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/staff-list`, {
        headers: { Authorization: token },
      });

      if (res.data.success) {
        setStaff(res.data.staff || []);        
      }
    } catch (err) {
      console.error("Error fetching admin staff:", err);
    } finally {
      setLoading(false);
    }
  };

    // Fetch once when component loads
    useEffect(() => {
      fetchAllStaffAdmin();
    }, []);
  

  // Step 1: Fetch store by mobile
  const fetchStoreByMobile = async () => {
    try {
      setLoading(true);
      setBusinesses([]);
      setStaff([]);
      setSelectedBusiness(null);

      const res = await axios.post(
        API_URL + "/store-auth/profileBy-number",
        { mobile },
        { headers: { Authorization: token } }
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

  // Step 2: Fetch businesses
  const fetchBusinessProfiles = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/store-business-profile/find-all/${id}`,
        { headers: { Authorization: token } }
      );
      setBusinesses(res.data.data || []);
    } catch (err) {
      console.error("Error fetching businesses:", err);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Fetch staff
  const fetchStaff = async (businessId) => {
    try {
      if (!storeId || !businessId) return;
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/store-staff/find-all/${storeId}/${businessId}`,
        { headers: { Authorization: token } }
      );
      setStaff(res.data.staff || []);
    } catch (err) {
      console.error("Error fetching staff:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow space-y-6">
      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent animate-spin rounded-full"></div>
        </div>
      )}

      {/* Step 1: Mobile Input */}
      <div>
        <label className="font-semibold text-gray-700">Enter Vendor Number</label>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter mobile number"
            className="flex-1 border rounded-lg p-2 bg-[#F6F8FA]"
          />
          <button
            onClick={fetchStoreByMobile}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Fetch
          </button>
        </div>
      </div>

      {/* Step 2: Business Dropdown */}
      {businesses.length > 0 && (
        <div>
          <label className="font-semibold text-gray-700">Select Business</label>
          <select
            className="border rounded-lg p-2 w-full mt-2 bg-[#F6F8FA]"
            value={selectedBusiness || ""}
            onChange={(e) => {
              setSelectedBusiness(e.target.value);
              fetchStaff(e.target.value);
            }}
          >
            <option value="">Select Business</option>
            {businesses.map((biz) => (
              <option key={biz._id} value={biz._id}>
                {biz.businessName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Step 3: Staff Table */}
      {staff.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Staff Members</h3>
          <div className="overflow-x-auto text-sm text-nowrap">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Vendor Name</th>
                  <th className="border px-4 py-2 text-left">Vendor Shop</th>
                  <th className="border px-4 py-2 text-left">Name</th>
                  <th className="border px-4 py-2">Mobile</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Roles</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Online</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{s.storeMobile?s.storeMobile:'-'}</td>
                    <td className="border px-4 py-2">{s.businessName?s.businessName:'-'}</td>
                    <td className="border px-4 py-2">{s.firstName} {s.lastName}</td>
                    <td className="border px-4 py-2">{s.mobileNumber}</td>
                    <td className="border px-4 py-2">{s.emailId || "-"}</td>
                    <td className="border px-4 py-2">{s.roles.join(", ")}</td>
                    <td className="border px-4 py-2">{s.status}</td>
                    <td className="border px-4 py-2">{s.online ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {staff.length === 0 && selectedBusiness && !loading && (
        <p className="text-gray-500">No staff found for this business.</p>
      )}
    </div>
  );
}
