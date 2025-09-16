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
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProductService } from "../../api/productservice.js"; // ✅ ProductService
import product1 from "../../assets/dummyimage/product1.png";
const API_URL = import.meta.env.VITE_API_URL;

const D4ProductList = () => {
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


  // ✅ Fetch Products
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const { success, products } = await ProductService.fetchProducts({
        page,
        limit,
      });
      if (!success) throw new Error("Failed to fetch products");

      // ✅ Add full URL for product images
      const processedProducts = products.map((p) => ({
        ...p,
        product_image: p.product_image
          ?`${API_URL}/assets/uploadsProduct/${p.product_image}`
          : null,
      }));

      setItems(processedProducts);
      setTotalPages(Math.ceil(products.length / limit) || 1);
    } catch (err) {
      setError(err.message);
      toast.error(err.message, { position: "top-right" });
      if (err.message.includes("login") || err.message.includes("token")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Stock Update
  const handleUpdateStock = async () => {
    try {
      if (!selectedProduct) return toast.error("No product selected");
      const updatedQty =
        parseInt(selectedProduct.quantity || 0, 10) +
        parseInt(newStock || 0, 10);

      const payload = { quantity: updatedQty };
      const { success } = await ProductService.updateProduct(
        selectedProduct._id,
        payload
      );
      if (!success) throw new Error("Failed to update stock");

      toast.success("Stock updated successfully");
      setShowStockPopup(false);
      fetchItems();
    } catch (err) {
      toast.error(err.message || "Stock update failed");
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab, page]);

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
    if (!query.trim()) {
      fetchItems();
      return;
    }
    setLoading(true);
  };

  // ✅ Edit
  const handleEdit = (product) => {
    navigate(`/dashboard/product/${product._id}`, { state: { product } });
  };

  // ✅ Delete
  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const { success } = await ProductService.deleteProduct(_id);
      if (!success) throw new Error("Failed to delete product");
      toast.success("Product deleted successfully");
      fetchItems();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  // ✅ Excel Export
  const handleExportExcel = async () => {
  try {
    // Get the Excel file as a blob
    const response = await ProductService.exportProductsExcel({
      responseType: "blob", // important!
    });

    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    // Set default file name
    link.setAttribute("download", "products.xlsx");
    document.body.appendChild(link);
    link.click();

    // Cleanup
    link.parentNode.removeChild(link);
    toast.success("Excel exported successfully!");
  } catch (err) {
    toast.error("Export failed");
    console.error(err);
  }
};


  // ✅ PDF Export
  const handleExportPDF = async () => {
    const { success, error } = await ProductService.exportProductsPDF();
    if (success) {
      toast.success("PDF exported successfully!");
    } else {
      toast.error(error || "Export failed");
    }
  };

  // ✅ Render Table
  const renderTable = () => {
    const isProductTab = activeTab === "product";
    return (
      <table className="w-full bg-white rounded-lg shadow-sm text-sm text-nowrap ">
        <thead className="text-left text-gray-600 font-medium">
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
              <td colSpan="9" className="text-center p-3 align-middle align-middle">
                Loading...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="9" className="text-center text-red-500 p-3 align-middle">
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
                  <tr key={item._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 align-middle">
                      
                      <img
                        src={
                          item.product_image ? item.product_image : product1
                        }
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
      onClick={() => handleDelete(item._id)}
      className="text-red-600 hover:text-red-800 flex items-center gap-1"
    >
      <FaTrash />
    </button>
    {/* <button
      onClick={() => setShowStockPopup(true) || setSelectedProduct(item)}
      className="text-black flex items-center gap-1"
    >
      <FaBoxOpen />
    </button> */}

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
  const handleFetchHistory = async (product) => {
  try {
    const { success, history, error } = await ProductService.getProductHistory(product._id);
    if (success) {
      setProductHistory(history);
      setShowHistoryPopup(true);
    } else {
      toast.error(error || "Failed to fetch product history");
    }
  } catch (err) {
    console.error(err);
    toast.error("Error fetching product history");
  }
};


  return (
    <div className="mx-auto mt-5 p-4">
      <ToastContainer />
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b px-6 py-3">
        <h1 className="text-xl font-semibold">Items</h1>
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
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto p-3 align-middle border rounded bg-white shadow">
        {renderTable()}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, filteredItems.length)} of {items.length} items
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* Export */}
      <div className="flex gap-3 align-middle mt-6 p-5 border rounded-md shadow">
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 border px-4 py-2 rounded text-blue-600 hover:bg-gray-100"
        >
          <FaDownload /> Export Inventory
        </button>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 border px-4 py-2 rounded text-blue-600 hover:bg-gray-100"
        >
          <FaFilePdf /> Download PDF
        </button>
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
        <td colSpan="5" className="p-3 text-center text-gray-500">
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
  {Number(h.changes?.after?.quantity || 0) - Number(h.changes?.before?.quantity || 0)}
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

    </div>
  );
};

export default D4ProductList;
