import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";

export default function ProductViewer() {
  const API_URL = import.meta.env.VITE_API_URL;
  const Auth_token = localStorage.getItem("authToken");
  const [mobile, setMobile] = useState("");
  const [storeId, setStoreId] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const token = Auth_token;

  // Fetch all products (Admin)
  const fetchAllProductsAdmin = async (pageNumber = 1, pageLimit = limit) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/product-list`, {
        params: { page: pageNumber, limit: pageLimit },
        headers: { Authorization: token },
      });

      if (res.data.success) {
        setProducts(res.data.products || []);
        setPage(pageNumber);
        setTotalPages(Math.ceil(res.data.total / pageLimit) || 1);
      }
    } catch (err) {
      console.error("Error fetching admin products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProductsAdmin();
  }, []);

  // Fetch store by mobile
  const fetchStoreByMobile = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/store-auth/profileBy-number`,
        { mobile },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
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

  // Fetch businesses
  const fetchBusinessProfiles = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/store-business-profile/find-all/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      setBusinesses(res.data.data || []);
    } catch (err) {
      console.error("Error fetching business profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products
  const fetchProducts = async (
    pageNumber = 1,
    businessId = selectedBusiness,
    pageLimit = limit
  ) => {
    if (!storeId || !businessId) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/admin/product-list/${storeId}/${businessId}`,
        {
          params: { page: pageNumber, limit: pageLimit },
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setProducts(res.data.products || []);
        setPage(pageNumber);
        setTotalPages(Math.ceil(res.data.total / pageLimit) || 1);
      }
    } catch (err) {
      console.error(
        "Error fetching products:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const pagination = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    storeId
      ? fetchProducts(newPage, selectedBusiness, limit)
      : fetchAllProductsAdmin(newPage, limit);
  };

  const RowPerPage = (newLimit) => {
    setLimit(newLimit);
    storeId
      ? fetchProducts(1, selectedBusiness, newLimit)
      : fetchAllProductsAdmin(1, newLimit);
  };

  // Export to Excel
  const exportToExcel = () => {
    if (products.length === 0) return;

    const worksheetData = products.map((prod, index) => ({
      "S.No": (page - 1) * limit + index + 1,
      Name: prod.name,
      "Product Image": prod.product_image || "-",
      Quantity: prod.quantity,
      "Min Quantity": prod.min_quantity,
      "Sold Quantity": prod.sold_quantity,
      Unit: prod.unit,
      "Sales Price": prod.sales_price,
      "Purchase Price": prod.purchase_price,
      Category: prod.category || "-",
      "HSN Number": prod.hsn_number || "-",
      Tax: prod.tax || 0,
      "Price Type": prod.price_type || "-",
      "Product Type": prod.product_type || "-",
      "Created At": new Date(prod.createdAt).toLocaleDateString(),
      "Updated At": new Date(prod.updatedAt).toLocaleDateString(),
      "Store Mobile": prod.storeMobile || "-",
      "Business Name": prod.businessName || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    XLSX.writeFile(workbook, "products.xlsx");
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-2xl space-y-6">
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-white font-medium">Loading...</p>
        </div>
      )}

      {/* Mobile Input */}
      <div className="space-y-2">
        <label className="font-semibold text-gray-700">Enter Vendor Number</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter mobile number"
            className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-[#F6F8FA]"
          />
          <button
            onClick={fetchStoreByMobile}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
          >
            Fetch
          </button>
        </div>
      </div>

      {/* Business Dropdown */}
      {businesses.length > 0 && (
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Select Business</label>
          <select
            value={selectedBusiness || ""}
            onChange={(e) => {
              const newBusinessId = e.target.value;
              setSelectedBusiness(newBusinessId);
              fetchProducts(1, newBusinessId, limit);
            }}
            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none bg-[#F6F8FA]"
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

      {/* Product List */}
      {products.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Products {totalPages > 1 && `(Page ${page})`}
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
              >
                Export Excel
              </button>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600">
                  Rows per page:
                </label>
                <select
                  value={limit}
                  onChange={(e) => RowPerPage(parseInt(e.target.value))}
                  className="border bg-white rounded-lg p-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto text-center">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-2"></th>
                  <th className="border px-2 py-2">S.No</th>
                  <th className="border px-2 py-2">Product Name</th>
                  <th className="border px-2 py-2">Quantity</th>
                  <th className="border px-2 py-2">Unit</th>
                  <th className="border px-2 py-2">Sales Price</th>
                </tr>
              </thead>
              <tbody className="text-nowrap">
                {products.map((prod, index) => {
                  const isExpanded = expandedRow === prod._id;
                  return (
                    <React.Fragment key={prod._id}>
                      <tr className="hover:bg-gray-50">
                        <td className="border px-2 py-2 text-center w-10">
                          <button
                            onClick={() =>
                              setExpandedRow(isExpanded ? null : prod._id)
                            }
                            className="flex items-center justify-center w-5 h-5 bg-blue-100 hover:bg-blue-200 rounded-full transition"
                          >
                            {isExpanded ? "−" : "+"}
                          </button>
                        </td>
                        <td className="border px-4 py-2">
                          {(page - 1) * limit + index + 1}
                        </td>
                        <td className="border px-4 py-2">{prod.name}</td>
                        <td className="border px-4 py-2">{prod.quantity}</td>
                        <td className="border px-4 py-2">{prod.unit}</td>
                        <td className="border px-4 py-2">{prod.sales_price}</td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-gray-50">
                          <td colSpan={7} className="p-4 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <strong>Min Quantity:</strong> {prod.min_quantity}
                              </div>
                              <div>
                                <strong>Sold Quantity:</strong> {prod.sold_quantity}
                              </div>
                              <div>
                                <strong>Purchase Price:</strong> {prod.purchase_price}
                              </div>
                              <div>
                                <strong>Category:</strong> {prod.category || "-"}
                              </div>
                              <div>
                                <strong>HSN Number:</strong> {prod.hsn_number || "-"}
                              </div>
                              <div>
                                <strong>Tax:</strong> {prod.tax || 0}
                              </div>
                              <div>
                                <strong>Price Type:</strong> {prod.price_type || "-"}
                              </div>
                              <div>
                                <strong>Product Type:</strong> {prod.product_type || "-"}
                              </div>
                              <div>
                                <strong>Created At:</strong>{" "}
                                {new Date(prod.createdAt).toLocaleDateString()}
                              </div>
                              <div>
                                <strong>Updated At:</strong>{" "}
                                {new Date(prod.updatedAt).toLocaleDateString()}
                              </div>
                              <div>
                                <strong>Store Mobile:</strong> {prod.storeMobile || "-"}
                              </div>
                              <div>
                                <strong>Business Name:</strong> {prod.businessName || "-"}
                              </div>
                              <div>
                                <strong>Product Image: 
                                  {prod.product_image ?   <Link to={`${API_URL}/assets/uploadsProduct/${prod.product_image}`} target="_blank" className="text-blue-600" rel="noopener noreferrer"> View</Link>: ""}
                                  </strong>{" "}
                                {prod.product_image ? (
                                  <Link to={`${API_URL}/assets/uploadsProduct/${prod.product_image}`} target="_blank" rel="noopener noreferrer">
                                   <img
                                     src={`${API_URL}/assets/uploadsProduct/${prod.product_image}`}
                                     alt={prod.name}
                                     className="w-20 h-20 object-cover rounded"
                                     />                                 
                                     </Link>
                                ) : (
                                  "-"
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end gap-3 mt-4">
              <button
                disabled={page <= 1}
                onClick={() => pagination(page - 1)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => pagination(page + 1)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
