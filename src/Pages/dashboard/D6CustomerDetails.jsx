import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { FaBoxOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CustomerService } from "../../api/customerService";

// const generateScore = () => Math.floor(Math.random() * 101);

const CustomerDetailsForm = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
  try {
    setLoading(true);
    const res = await CustomerService.getAllCustomers();
    if (res?.customers) {
      const formatted = res.customers.map((cust) => ({
        mongoId: cust._id,  // For API ops
        displayId: cust.customId,  // For display
        name: cust.name,
        mobile: cust.mobile,
        email: cust.email,
        address: cust.address || '',
        pin: cust.pin || '',
        city: cust.city,
        state: cust.state,
        aadharCardNumber: cust.aadharCardNumber || '',
        panNumber: cust.panNumber || '',
        companyName: cust.companyName || '',
        gstNumber: cust.gstNumber || '',
        score: cust.creditScore ?? 0,  // ✅ Use backend value instead of random
      }));
      setCustomers(formatted);
    }
  } catch (err) {
    console.error("❌ Error fetching customers:", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (mongoId, displayId) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      const deleteRes = await CustomerService.deleteCustomer(mongoId);  // ✅ Pass _id
      if (deleteRes.success) {
        setCustomers((prev) => prev.filter((cust) => cust.displayId !== displayId));  // Filter by displayId
        console.log("✅ Deleted:", deleteRes.customer?.customId || displayId);  // Matches Postman
      }
    } catch (err) {
      console.error("❌ Error deleting:", err);
      // Add toast: "Failed to delete customer. Invalid ID or server error."
    }
  };

const handleEdit = (customer) => {
  navigate("/dashboard/add-customer", { 
    state: { customer }  // Full object with all fields + _id
  });
};

  const getScoreColor = (score) => {
    if (score < 40) return "text-red-600";
    if (score <= 70) return "text-yellow-500";
    return "text-green-600";
  };

  return (
    <div className="p-4 w-full max-w-7xl mt-5 md:mt-10 mx-auto bg-white">
      <div className="flex justify-between items-center mb-4 px-3">
        <h2 className="text-base md:text-2xl font-bold">Customer Details</h2>
        <div className="flex flex-row gap-3 items-center">
          <button
            className="bg-lightbluecol text-white px-4 py-2 text-xs md:text-base rounded-lg hover:bg-blue-600"
            onClick={() => navigate("/dashboard/add-customer")}
          >
            Add Customer
          </button>
          {/* <div className="flex flex-row gap-2 items-center text-bluecol cursor-pointer">
            <h1>Filters</h1>
            <IoIosArrowDown />
          </div> */}
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center py-5">Loading customers...</p>
        ) : (
          <table className="min-w-full text-sm border-separate border-spacing-0 border-[#E5E7EB] border-y border-x-2 rounded-lg shadow-customSoft">
            <thead>
              <tr className="bg-[#F9FAFB] text-left text-lightblack">
                <th className="p-3 font-semibold py-5">Unique ID (Custom)</th>  {/* Changed label for clarity */}
                <th className="p-3 font-semibold py-5">Name</th>
                <th className="p-3 font-semibold py-5">Mobile</th>
                <th className="p-3 font-semibold py-5">Email</th>
                <th className="p-3 font-semibold py-5">Score Card</th>
                <th className="p-3 font-semibold py-5">City</th>
                <th className="p-3 font-semibold py-5">State</th>
                <th className="p-3 font-semibold py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr
                  key={cust.displayId}  // Use displayId as key (stable)
                  className="bg-white text-left shadow-customSoft"
                >
                  <td className="p-3 text-black font-robotoM border-y">
                    {cust.displayId}  {/* Show customId */}
                  </td>
                  <td className="p-3 text-[#111827] font-robotoR border-y">
                    {cust.name}
                  </td>
                  <td className="p-3 text-[#111827] font-robotoR border-y">
                    {cust.mobile}
                  </td>
                  <td className="p-3 border-y font-robotoR text-blue-600 hover:underline cursor-pointer">
                    {cust.email}
                  </td>

                  
                  <td
                    className={`p-3 border-y font-robotoR ${getScoreColor(
                      cust.score
                    )}`}
                  >
                    {cust.score}
                  </td>
                  <td className="p-3 border-y font-robotoR">{cust.city}</td>
                  <td className="p-3 border-y font-robotoR">{cust.state}</td>
                  <td className="p-3 border-y text-center space-x-2">
                    <button
                      className="text-[#2563EB] hover:text-blue-700"
                      onClick={() => handleEdit(cust)}
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button
                      className="text-[#DC2626] hover:text-red-700"
                      onClick={() => handleDelete(cust.mongoId, cust.displayId)}  // ✅ Pass _id and displayId
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                    <button className="text-[#4B5563] hover:text-gray-700">
                      <FaBoxOpen className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomerDetailsForm;