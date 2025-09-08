import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaBoxOpen,
  FaDownload,
  FaFilePdf,
} from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import product1 from "../../assets/dummyimage/product1.png";
// D4ProductList.jsx (upar me import add karna)
// import { Dialog } from "@headlessui/react"; // simple popup ke liye
import { ProductService } from "../../api/productservice";


const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const D4ProductList = () => {
  const [activeTab, setActiveTab] = useState("product");
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(2);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetch items from API
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const store_id = Cookies.get("store_id") || "68ad40eddafa4b0b7080b486"; // Match creation response
      const storeProfileId = localStorage.getItem("storeProfileId") || "68ad4720dafa4b0b7080b4d1";
      const token = Cookies.get("authToken");

      console.log("🔍 Fetching with:", { store_id, storeProfileId, token });

      if (!store_id || !storeProfileId || !token) {
        throw new Error("Missing store information or auth. Please login again.");
      }

      const response = await axios.get(
        `${API_BASE}/store-product/find-all/${store_id}/${storeProfileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: { page, limit },
        }
      );

      console.log("✅ API Response:", JSON.stringify(response.data, null, 2));

      // Handle various response formats
      let fetchedItems = [];
      if (Array.isArray(response.data)) {
        fetchedItems = response.data;
      } else if (response.data.products) {
        fetchedItems = response.data.products;
      } else if (response.data.data) {
        fetchedItems = response.data.data;
      } else if (response.data.items) {
        fetchedItems = response.data.items;
      } else {
        console.warn("⚠️ Unexpected response format:", response.data);
      }

      setItems(fetchedItems);
      console.log("🔍 Fetched Items:", fetchedItems);

      setTotalPages(
        response.data.totalPages ||
          Math.ceil((response.data.totalItems || fetchedItems.length) / limit) ||
          1
      );
    } catch (err) {
      console.error("❌ Fetch Error:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || "Failed to fetch items.";
      setError(errorMsg);
      toast.error(errorMsg, { position: "top-right" });
      if (err.message.includes("login") || err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // D4ProductList component ke andar
const [showStockPopup, setShowStockPopup] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);
const [newStock, setNewStock] = useState("");

// popup open karna
const handleStockClick = (product) => {
  setSelectedProduct(product);
  setNewStock(""); // reset
  setShowStockPopup(true);
};

// stock update
const handleUpdateStock = async () => {
  try {
    if (!selectedProduct) return;

    const updatedQty =
      (parseInt(selectedProduct.quantity || 0, 10)) +
      (parseInt(newStock || 0, 10));

    const payload = { quantity: updatedQty };

    await ProductService.updateProduct(selectedProduct._id, payload);

    toast.success("Stock updated successfully");
    setShowStockPopup(false);
    fetchItems(); // refresh list
  } catch (err) {
    toast.error("Failed to update stock");
    console.error("❌ Stock Update Error:", err);
  }
};


  // Fetch items on mount and when tab or page changes
  useEffect(() => {
    fetchItems();
  }, [activeTab, page]);

  // Filter items by search query
  useEffect(() => {
    const filtered = items.filter(
      (item) =>
        (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
    console.log("🔍 Filtered Items:", filtered);
  }, [items, searchQuery]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter items based on active tab
  const displayedItems = filteredItems.filter(
    (item) => item.product_type === (activeTab === "product" ? "inventory" : "service")
  );

  console.log("🔍 Displayed Items:", displayedItems);

  // Pagination controls
  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const renderTable = () => {
    const isProductTab = activeTab === "product";
    return (
      <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm text-sm">
        <thead className="text-left text-[#6B7280] font-robotoM text-nowrap">
          <tr>
            <th className="p-3 font-medium">Image</th>
            <th className="p-3 font-medium">Name</th>
            <th className="p-3 font-medium">Unit</th>
            <th className="p-3 font-medium">Sale Price</th>
            <th className="p-3 font-medium">Purchase Price</th>
            <th className="p-3 font-medium">Stock</th>
            <th className="p-3 font-medium">Status</th>
            <th className="p-3 font-medium">Actions</th>
            {isProductTab && <th className="p-3 font-medium">New Stock</th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={isProductTab ? 9 : 8} className="p-3 text-center">
                Loading...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={isProductTab ? 9 : 8} className="p-3 text-center text-red-500">
                {error}
              </td>
            </tr>
          ) : displayedItems.length === 0 ? (
            <tr>
              <td colSpan={isProductTab ? 9 : 8} className="p-3 text-center">
                No {activeTab}s found.
              </td>
            </tr>
          ) : (
            displayedItems.map((item) => {
              const isLow = (item.quantity || 0) < 10;
              return (
                <tr
                  key={item._id || item.name}
                  className="border-t hover:bg-gray-50 text-nowrap"
                >
                  <td className="p-3">
                    <img
                      src={item.product_image || item.service_image || product1}
                      alt={item.name || "Product"}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => (e.target.src = product1)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-[#111827]">{item.name || "N/A"}</div>
                    <div className="text-xs text-gray-500">{item.category || "N/A"}</div>
                  </td>
                  <td className="p-3 text-[#111827]">{item.unit || "N/A"}</td>
                  <td className="p-3 font-semibold text-[#111827]">
                    ₹{Number(item.sales_price || 0).toLocaleString()}
                  </td>
                  <td className="p-3 text-[#111827]">
                    ₹{Number(item.purchase_price || 0).toLocaleString()}
                  </td>
                  <td
                    className={`p-3 font-semibold ${
                      isLow ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {item.quantity || 0}
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isLow
                          ? "bg-orange-100 text-orange-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {isLow ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-start items-center gap-4">
 <button
  onClick={() => handleEdit(item)}
  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
>
  <FaEdit /> Edit
</button>
                      <button
                        title="Delete"
                        className="text-red-500 text-xl hover:scale-110 transition-transform"
                        onClick={() => handleDelete(item._id)}
                      >
                        <FaTrash />
                      </button>
<button
  title="Stock"
  className="text-black text-xl hover:scale-110 transition-transform"
  onClick={() => handleStockClick(item)} // ✅ popup open
>
  <FaBoxOpen />
</button>

                    </div>
                  </td>
                  {isProductTab && (
                    <td className="p-3 align-middle text-center">
                    <button
    onClick={() => handleStockClick(item)}
    className="text-white px-3 py-2 bg-blue-500 font-robotoR text-sm rounded-lg hover:bg-blue-600"
  >
    Add Stock
  </button>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    );
  };
const handleEdit = (product) => {
  console.log("✏️ Edit Product ID:", product._id);
  navigate(`/dashboard/product/${product._id}`);
};

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = Cookies.get("authToken");
      await axios.post(
        `${API_BASE}/store-product/delete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Product deleted successfully", { position: "top-right" });
      fetchItems(); // Refresh the list
    } catch (err) {
      console.error("❌ Delete Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to delete product", {
        position: "top-right",
      });
    }
  };





  return (
    <div className="mx-auto mt-5 p-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6 border-b px-6 py-3">
        <h1 className="text-xl font-semibold text-[#111827]">Items</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm flex items-center gap-2"
          onClick={() => navigate("/dashboard/product")}
        >
          <FaPlus />
          Add New Item
        </button>
      </div>
      <div className="border-b mb-4 flex gap-6 text-sm border-b md:px-6 py-3">
        {["product", "service"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-medium border-b-2 ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}s
          </button>
        ))}
      </div>
      <div className="flex flex-row gap-5 flex-wrap border-b md:px-6 py-3 items-center mb-4">
        <div className="w-full md:w-60 relative">
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
            <CiSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by name or category"
            className="w-full pl-8 pr-2 py-2 border rounded bg-[#F6F8FA] text-sm placeholder:text-gray-500"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="overflow-x-auto p-3 border-2 shadow-customSoft rounded-lg bg-[#00000000]">
        {renderTable()}
      </div>
      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, displayedItems.length)} of {items.length} items
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className="px-4 py-2 border rounded text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 gap-4 shadow-customCard py-5 px-5 border rounded-md">
        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 border px-4 py-2 rounded text-sm text-blue-600 hover:bg-gray-100"
            onClick={() =>
              window.location.href = `${API_BASE}/store-product/export-excel/68ad40eddafa4b0b7080b486/68ad4720dafa4b0b7080b4d1`
            }
          >
            <FaDownload />
            Export Inventory
          </button>
          <button
            className="flex items-center gap-2 border px-4 py-2 rounded text-sm text-blue-600 hover:bg-gray-100"
            onClick={() =>
              window.location.href = `${API_BASE}/store-product/export-pdf/68ad40eddafa4b0b7080b486/68ad4720dafa4b0b7080b4d1`
            }
          >
            <FaFilePdf />
            Download PDF
          </button>
        </div>
      </div>
      {showStockPopup && selectedProduct && (
<div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
  <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative transition-all">
    {/* Title */}
    <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
      Add New Stock <span className="text-blue-600">– {selectedProduct.name}</span>
    </h2>

    {/* Previous Stock */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Previous Stock
      </label>
      <input
        type="number"
        value={selectedProduct.quantity || 0}
        readOnly
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>

    {/* New Stock */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        New Stock
      </label>
      <input
        type="number"
        value={newStock}
        onChange={(e) => setNewStock(e.target.value)}
        placeholder="Enter quantity to add"
        className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    {/* Actions */}
    <div className="flex justify-end gap-3">
      <button
        onClick={() => setShowStockPopup(false)}
        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
      >
        Cancel
      </button>
      <button
        onClick={handleUpdateStock}
        className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition"
      >
        Update Stock
      </button>
    </div>
  </div>
</div>

)}
    </div>
  );
};

export default D4ProductList;