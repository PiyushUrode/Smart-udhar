import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaDownload,
  FaFilePdf,
  FaExclamationTriangle, // Added for warning icon
} from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { ProductService } from "../../api/productservice.js";
import product1 from "../../assets/dummyimage/product1.png";
import * as XLSX from "xlsx";
import Button from "../../common/Button.jsx";

const API_URL = import.meta.env.VITE_API_URL;

// =========================================================================
// ✅ NEW: Delete Confirmation Modal Component
// =========================================================================
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
// =========================================================================

const D4ProductList = () => {
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState("product");
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showStockPopup, setShowStockPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStock, setNewStock] = useState("");
  const navigate = useNavigate();
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const [productHistory, setProductHistory] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [excelFile, setExcelFile] = useState(null);

  // ✅ NEW STATE FOR DELETE CONFIRMATION
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [deleteProductName, setDeleteProductName] = useState("");
  // END NEW STATE

  // State for the custom notification/pop-up component
  const [popupType, setPopupType] = useState(null); // 'success', 'error', 'processing'
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setExcelFile(file);
  };

  // ✅ Fetch Products
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const { success, products, total } = await ProductService.fetchProducts({
        page,
        limit,
        search: searchQuery,
      });
      if (!success) throw new Error("Failed to fetch products");

      setTotalItems(total); // ✅ total products from backend
      setTotalPages(Math.ceil(total / limit) || 1);

      // Add full URL for product images
      const processedProducts = products.map((p) => ({
        ...p,
        product_image: p.product_image
          ? `${API_URL}/assets/uploadsProduct/${p.product_image}`
          : null,
      }));

      setItems(processedProducts);
      setTotalPages(Math.ceil(total / limit) || 1); // ✅ pagination
    } catch (err) {
      setError(err.message);
      setPopupType("error"); // Show error pop-up
      setMessage(err.message);
      if (err.message.includes("login") || err.message.includes("token")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab, page, limit, searchQuery]);

  // ✅ Local Filter
  useEffect(() => {
    const filtered = items.filter(
      (item) =>
        (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [items, searchQuery]);

  // ✅ Search API
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setPage(1); // reset pagination

    if (!query) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const { success, products } = await ProductService.searchProductsByName(
        query
      );
      if (success) {
        setSuggestions(products.slice(0, 3)); // top 3 results only
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error(err);
      setPopupType("error");
      setMessage(err.message || "Search failed");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // ✅ Edit
  const handleEdit = (product) => {
    navigate(`/dashboard/product/${product._id}`, { state: { product } });
  };

  // =========================================================================
  // ✅ UPDATED: Delete function to show modal
  // =========================================================================
  const handleDelete = (_id, name) => {
    setDeleteProductId(_id);
    setDeleteProductName(name);
  };

  // ✅ NEW: Function to execute deletion upon confirmation
  const confirmDelete = async () => {
    const _id = deleteProductId;
    if (!_id) return; // Should not happen

    // Clear modal immediately
    setDeleteProductId(null);
    setDeleteProductName("");

    try {
      setPopupType("processing"); // Show processing message
      setMessage(`Deleting product: ${deleteProductName}...`);

      const { success } = await ProductService.deleteProduct(_id);
      if (!success) throw new Error("Failed to delete product");

      setPopupType("success"); // ✅ ADDED
      setMessage("Product deleted successfully"); // ✅ ADDED
      fetchItems();
    } catch (err) {
      setPopupType("error"); // ✅ ADDED
      setMessage(err.message || "Delete failed"); // ✅ ADDED
    }
  };
  // =========================================================================

  // ✅ Render Table
  const renderTable = () => {
    const isProductTab = activeTab === "product";
    return (
      <table className="w-full bg-white rounded-lg shadow-sm  text-nowrap ">
        <thead className="text-left text-gray-600 font-medium text-xs md:text-sm">
          <tr>
            <th className="p-3 align-middle">Image</th>
            <th className="p-3 align-middle">Name</th>
            <th className="p-3 align-middle">Unit</th>
            <th className="p-3 align-middle">Sale Price</th>
            <th className="p-3 align-middle">Purchase Price</th>
            <th className="p-3 align-middle">Stock</th>
            <th className="p-3 align-middle">Status</th>
            <th className="p-3 align-middle">Actions</th>
            <th className="p-3 align-middle">New Stock</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan="9"
                className="text-center  p-3 align-middle align-middle"
              >
                Loading...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td
                colSpan="9"
                className="text-center text-red-500 p-3 align-middle"
              >
                {error}
              </td>
            </tr>
          ) : filteredItems.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center p-3 align-middle">
                No {activeTab}s found.
              </td>
            </tr>
          ) : (
            filteredItems
              .filter(
                (item) =>
                  item.product_type === (isProductTab ? "inventory" : "service")
              )
              .map((item) => {
                const isLow = (item.quantity || 0) < 10;
                return (
                  <tr
                    key={item._id}
                    className="border-t hover:bg-gray-50 text-xs md:text-sm"
                  >
                    <td className="p-3 align-middle">
                      <img
                        src={item.product_image ? item.product_image : product1}
                        alt={item.name || "Product Image"}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null; // prevent infinite loop if product1 also fails
                          e.target.src = product1;
                        }}
                      />
                    </td>
                    <td className="p-3 align-middle">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        {item.category}
                      </div>
                    </td>
                    <td className="p-3 align-middle">{item.unit}</td>
                    <td className="p-3 align-middle">
                      ₹{Number(item.sales_price).toLocaleString()}
                    </td>
                    <td className="p-3 align-middle">
                      ₹{Number(item.purchase_price).toLocaleString()}
                    </td>
                    <td
                      className={`p-3 align-middle font-semibold ${
                        isLow ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {item.quantity}
                    </td>
                    <td className="p-3 align-middle">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          isLow
                            ? "bg-orange-100 text-orange-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {isLow ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                    <td className="p-3 align-middle">
                      <div className="flex gap-3 items-center">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          // ✅ UPDATED: Call handleDelete with ID and Name
                          onClick={() => handleDelete(item._id, item.name)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <FaTrash />
                        </button>
                        <button
                          onClick={() => handleFetchHistory(item)}
                          className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                        >
                          History
                        </button>
                      </div>
                    </td>

                    <td className="p-3 align-middle">
                      <button
                        onClick={() =>
                          setShowStockPopup(true) || setSelectedProduct(item)
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Add Stock
                      </button>
                    </td>
                  </tr>
                );
              })
          )}
        </tbody>
      </table>
    );
  };
  const handleUpdateStock = async () => {
    try {
      if (!selectedProduct) {
        setPopupType("error");
        setMessage("No product selected");
        return;
      }

      const newStockValue = parseInt(newStock || 0, 10);
      if (isNaN(newStockValue) || newStockValue <= 0) {
        setPopupType("error");
        setMessage("New stock must be a positive number.");
        return;
      }

      setPopupType("processing"); // Indicate processing
      setMessage(`Updating stock for ${selectedProduct.name}...`);

      const updatedQty =
        parseInt(selectedProduct.quantity || 0, 10) + newStockValue;

      const payload = { quantity: updatedQty };
      const { success } = await ProductService.updateProduct(
        selectedProduct._id,
        payload
      );
      if (!success) throw new Error("Failed to update stock");

      setPopupType("success"); // ✅ ADDED
      setMessage("Stock updated successfully"); // ✅ ADDED
      setShowStockPopup(false);
      setNewStock(""); // reset
      fetchItems();
    } catch (err) {
      setPopupType("error"); // ✅ ADDED
      setMessage(err.message || "Stock update failed"); // ✅ ADDED
    }
  };

  // ✅ Fetch product history
  const handleFetchHistory = async (product) => {
    try {
      setPopupType("processing"); // Indicate loading
      setMessage(`Fetching history for ${product.name}...`);
      const { success, history, error } =
        await ProductService.getProductHistory(product._id);

      if (success) {
        setSelectedProduct(product);
        setProductHistory(history);
        setShowHistoryPopup(true);
        setPopupType(null); // Clear loading message on success
      } else {
        setPopupType("error"); // ✅ ADDED
        setMessage(error || "Failed to fetch product history"); // ✅ ADDED
      }
    } catch (err) {
      console.error(err);
      setPopupType("error"); // ✅ ADDED
      setMessage("Error fetching product history"); // ✅ ADDED
    }
  };

  const handleImportExcel = async () => {
    if (!excelFile) {
      setPopupType("error"); // ✅ ADDED
      setMessage("Please select an Excel file"); // ✅ ADDED
      return;
    }

    try {
      setPopupType("processing"); // Indicate processing
      setMessage("Importing data, please wait...");

      const {
        success,
        message: responseMessage,
        count,
      } = await ProductService.uploadExcel(excelFile);

      if (success) {
        setPopupType("success"); // ✅ ADDED
        setMessage(`Imported ${count} products successfully!`); // ✅ ADDED
        setExcelFile(null); // reset input
        fetchItems(); // refresh product list
      } else {
        setPopupType("error"); // ✅ ADDED
        setMessage(responseMessage || "Import failed"); // ✅ ADDED
      }
    } catch (err) {
      setPopupType("error"); // ✅ ADDED
      setMessage(err.message || "Import failed"); // ✅ ADDED
    }
  };

  return (
    <div className="mx-auto md:mt-5 border p-1 md:p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b px-6 py-3">
        <h1 className="text-base md:text-xl lg:text-2xl font-semibold">
          Items
        </h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          onClick={() => navigate("/dashboard/product")}
        >
          <FaPlus /> Add New Item
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b mb-4 flex gap-6 text-sm px-6 py-3 ">
        {["product", "service"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 border-b-2 ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}s
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-5 flex-wrap text-nowrap px-6 py-3 items-center mb-4">
        <div className="w-full md:w-60 relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
            <CiSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by name or category"
            className="w-full pl-8 pr-2 py-2 border rounded bg-gray-100 text-sm"
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-50 w-full bg-white border rounded mt-1 shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((item) => (
                <li
                  key={item._id}
                  onClick={() => {
                    setSearchQuery(item.name);
                    setShowSuggestions(false);
                    setPage(1);
                    fetchItems(); // fetch full table based on selection
                  }}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto p-3 align-middle border rounded bg-white shadow">
        {renderTable()}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-xs md:text-sm">
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, totalItems)} of {totalItems} items
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded text-xs md:text-sm "
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded text-xs md:text-sm"
          >
            Next
          </button>
        </div>
      </div>

      {/* Export/Import */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center mt-6 p-5 border rounded-md shadow">
        <div className="flex flex-col md:flex-row items-center gap-3 bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
          {/* File Input */}
          <label className="flex items-center justify-center w-full md:w-60 px-4 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-100 transition">
            <svg
              className="w-5 h-5 mr-2 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M4 3a1 1 0 000 2h12a1 1 0 100-2H4zM3 8a1 1 0 011-1h12a1 1 0 011 1v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm7 2a1 1 0 00-1 1v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1a1 1 0 00-1-1z" />
            </svg>
            <span className="text-gray-700 text-sm truncate">
              {excelFile ? excelFile.name : "Choose Excel/CSV file"}
            </span>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Import Button */}
          <button
            onClick={handleImportExcel}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a1 1 0 000 2h12a1 1 0 100-2H4zM3 8a1 1 0 011-1h12a1 1 0 011 1v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm7 2a1 1 0 00-1 1v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1a1 1 0 00-1-1z" />
            </svg>
            Import Excel
          </button>
        </div>
      </div>

      {/* Stock Popup */}
      {showStockPopup && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative transition-all">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Add New Stock{" "}
              <span className="text-blue-600">– {selectedProduct.name}</span>
            </h2>
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
            <div className="flex justify-end gap-3 align-middle">
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

      {/* History Popup */}
      {showHistoryPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg relative transition-all">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Product History – {selectedProduct?.name}
            </h2>
            <div className="max-h-80 overflow-y-auto">
              {productHistory.length === 0 ? (
                <p className="text-center text-gray-500">No history found.</p>
              ) : (
                <table className="w-full text-sm text-left border">
                  <thead>
                    <tr>
                      <th className="p-2 border-b">Date</th>
                      <th className="p-2 border-b">Action</th>
                      <th className="p-2 border-b">Previous Stock</th>
                      <th className="p-2 border-b">Updated Stock</th>
                      <th className="p-2 border-b">Change</th>

                      <th className="p-2 border-b">Updated By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productHistory.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="p-3 text-center text-gray-500"
                        >
                          No updates found
                        </td>
                      </tr>
                    ) : (
                      productHistory.map((h, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            {new Date(h.updated_at).toLocaleString()}
                          </td>
                          <td className="p-2">{h.action || "Stock Update"}</td>
                          <td className="p-2">
                            {h.changes?.before?.quantity ?? "No Update"}
                          </td>
                          <td className="p-2">
                            {h.changes?.after?.quantity ?? "No Update"}
                          </td>
                          <td className="p-2">
                            {Number(h.changes?.after?.quantity || 0) -
                              Number(h.changes?.before?.quantity || 0)}
                          </td>

                          <td className="p-2">{h.updated_by || "Admin"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowHistoryPopup(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 The requested Button component integration for pop-up messages */}
      {popupType && (
        <Button
          type={popupType}
          message={message}
          onClose={() => setPopupType(null)}
        />
      )}

      {/* ✅ NEW: Render the custom Delete Confirmation Modal */}
      {deleteProductId && (
        <DeleteConfirmationModal
          productName={deleteProductName}
          onConfirm={confirmDelete}
          onCancel={() => {
            setDeleteProductId(null);
            setDeleteProductName("");
          }}
        />
      )}
    </div>
  );
};

export default D4ProductList;
