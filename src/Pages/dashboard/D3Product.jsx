import { useState, useEffect } from "react";
import { ImagePlus } from "lucide-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import { ProductService } from "../../api/productservice"; // ✅ new service i




const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // must match backend multer limit

// ProductForm and ServiceForm - unchanged (omitted here for brevity in message).
// ... assume they are identical to your current UI components
const ProductForm = ({ formData, handleChange, handleSubmit, showAdvanced, setShowAdvanced, errors }) => (
  <form onSubmit={handleSubmit} className="space-y-4 px-4 pt-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          placeholder="Enter item name"
          required
          className={`w-full bg-[#F6F8FA] p-2 rounded border ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">Name is required</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Image</label>
        <label className="bg-[#F6F8FA] p-2 rounded border cursor-pointer flex justify-between items-center">
          <span className="flex items-center gap-2 text-sm text-gray-700">
            <ImagePlus color="#2563EB" />
            <span className="text-[#2563EB]">Add Product Image</span>
          </span>
          <input type="file" name="product_image"  accept="image/*" className="hidden" onChange={handleChange} />
          {formData.product_image && <span className="text-xs text-gray-400 ml-2">{formData.product_image.name}</span>}
        </label>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Unit<span className="text-red-500">*</span>
        </label>
        <div className="flex flex-row gap-4 pb-2 w-full max-w-full">
          <input
            name="quantity"
            type="number"
            min="1"
            required
            placeholder="Qty"
            className={`input w-[30%] bg-[#F6F8FA] rounded border ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.quantity}
            onChange={handleChange}
          />
          {errors.quantity && <p className="text-red-500 text-xs mt-1">Quantity is required</p>}
          <select
            name="unit"
            required
            className={`input w-[70%] bg-[#F6F8FA] font-robotoR text-gray-500 p-2 rounded border ${errors.unit ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.unit}
            onChange={handleChange}
          >
            <option value="">e.g. pcs, kg, ltr</option>
            <option value="pcs">pcs</option>
            <option value="kg">kg</option>
            <option value="ltr">ltr</option>
          </select>
          {errors.unit && <p className="text-red-500 text-xs mt-1">Unit is required</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Minimum Quantity <span className="text-red-500">*</span>
        </label>
        <div className="w-full">
          <input
            name="min_quantity"
            type="number"
            min="1"
            required
            placeholder="0"
            className={`input w-full bg-[#F6F8FA] rounded border ${errors.min_quantity ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.min_quantity}
            onChange={handleChange}
          />
          {errors.min_quantity && <p className="text-red-500 text-xs mt-1">Minimum Quantity is required</p>}
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Sale Price *</label>
        <input
          name="sales_price"
          type="number"
          min="0"
          step="0.01"
          required
          placeholder="₹ 0.00"
          className={`w-full bg-[#F6F8FA] p-2 rounded border ${errors.sales_price ? 'border-red-500' : 'border-gray-300'}`}
          value={formData.sales_price}
          onChange={handleChange}
        />
        {errors.sales_price && <p className="text-red-500 text-xs mt-1">Sale Price is required</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Purchase Price *</label>
        <input
          name="purchase_price"
          type="number"
          min="0"
          step="0.01"
          required
          placeholder="₹ 0.00"
          className={`w-full bg-[#F6F8FA] p-2 rounded border ${errors.purchase_price ? 'border-red-500' : 'border-gray-300'}`}
          value={formData.purchase_price}
          onChange={handleChange}
        />
        {errors.purchase_price && <p className="text-red-500 text-xs mt-1">Purchase Price is required</p>}
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Categories<span className="text-red-500">*</span>
      </label>
      <select
        name="category"
        required
        className={`w-full bg-[#F6F8FA] p-2 rounded border text-lightblack ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
        value={formData.category || ""}
        onChange={handleChange}
      > 
        <option value="">Select Category</option>
        <option value="Food">Cakes </option>
        <option value="Bakery">Cakes </option>
        <option value="Grociers">Cakes </option>
        <option value="Electronics">Electronics</option>
        <option value="Pendrive">Pendrive</option>
        <option value="Hardisk">Hardisk</option>
        <option value="Storage">Storage</option>
      </select>
      {errors.category && <p className="text-red-500 text-xs mt-1">Category is required</p>}
    </div>

    <div
      className="bg-[#F6F8FA] p-3 rounded-md text-blue-600 font-semibold text-sm cursor-pointer"
      onClick={() => setShowAdvanced(!showAdvanced)}
    >
      {showAdvanced ? "▴ Advanced Fields" : "▾ Advanced Fields"}
    </div>

    {showAdvanced && (
      <div className="bg-[#F9FBFC] p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4 pb-2 border">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            HSN/SCN Code
          </label>
          <input
            type="text"
            name="hsn_number"
            placeholder="Enter code"
            className="input w-full bg-[#F6F8FA] p-2 rounded border border-gray-300"
            value={formData.hsn_number || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tax
          </label>
          <select
            name="tax"
            className="input w-full bg-[#F6F8FA] p-2 rounded border border-gray-300"
            value={formData.tax || ""}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="0">0%</option>
            <option value="5">5%</option>
            <option value="10">10%</option>
            <option value="18">18%</option>
            <option value="28">28%</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Price
          </label>
          <select
            name="price_type"
            className="input w-full bg-[#F6F8FA] p-2 rounded border border-gray-300"
            value={formData.price_type || ""}
            onChange={handleChange}
          >
            <option value="fixed">With tax</option>
            <option value="without">Without tax</option>
          </select>
        </div>
      </div>
    )}

    <div className="flex justify-end gap-4 pb-2">
      <button type="button" className="px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">
        Cancel
      </button>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Save Product
      </button>
    </div>
  </form>
);

const ServiceForm = ({ formData, handleChange, handleSubmit, showAdvanced, setShowAdvanced, errors }) => (
  <form onSubmit={handleSubmit} className="space-y-4 px-4 pt-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          placeholder="Enter service name"
          required
          className={`input w-full bg-[#F6F8FA] p-2 rounded border ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">Name is required</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Image</label>
        <div className="flex flex-row justify-start items-center gap-3">
          <label className="w-full md:w-[60%] bg-[#F6F8FA] p-2 rounded border cursor-pointer flex justify-between items-center">
            <span className="flex items-center gap-2 text-sm text-gray-700">
              <ImagePlus color="#2563EB" />
              <span className="text-[#2563EB]">Add Service Image</span>
            </span>
            <input
              type="file"
              name="product_image"
              className="hidden"
              accept="image/*"
              onChange={handleChange}
            />
            {formData.product_image && <span className="text-xs text-gray-400 ml-2">{formData.product_image.name}</span>}
          </label>
          <span className="font-robotoR">No file chosen</span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Unit<span className="text-red-500">*</span>
        </label>
        <div className="flex flex-row gap-4 pb-2 w-full max-w-full">
          <input
            name="quantity"
            type="number"
            min="1"
            required
            placeholder="Qty"
            className={`input w-[30%] bg-[#F6F8FA] rounded border ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.quantity}
            onChange={handleChange}
          />
          {errors.quantity && <p className="text-red-500 text-xs mt-1">Quantity is required</p>}
          <select
            name="unit"
            required
            className={`input w-[70%] bg-[#F6F8FA] font-robotoR text-gray-500 p-2 rounded border ${errors.unit ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.unit}
            onChange={handleChange}
          >
            <option value="">e.g. hrs, pcs, sessions</option>
            <option value="hrs">Hours</option>
            <option value="pcs">Pieces</option>
            <option value="session">Session</option>
          </select>
          {errors.unit && <p className="text-red-500 text-xs mt-1">Unit is required</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Sale Price <span className="text-red-500">*</span>
        </label>
        <div className="w-full">
          <input
            name="sales_price"
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="₹ 0.00"
            className={`input w-full bg-[#F6F8FA] p-2 rounded border ${errors.sales_price ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.sales_price}
            onChange={handleChange}
          />
          {errors.sales_price && <p className="text-red-500 text-xs mt-1">Sale Price is required</p>}
        </div>
      </div>
    </div>

    <div
      className="bg-[#F6F8FA] p-3 rounded-md text-blue-600 font-semibold text-sm cursor-pointer"
      onClick={() => setShowAdvanced(!showAdvanced)}
    >
      {showAdvanced ? "▴ Advanced Fields" : "▾ Advanced Fields"}
    </div>

    {showAdvanced && (
      <div className="bg-[#F9FBFC] p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4 pb-2 border">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">HSN/SCN Code</label>
          <input
            type="text"
            name="hsn_number"
            placeholder="Enter code"
            className="w-full bg-[#F6F8FA] p-2 rounded border border-gray-300"
            value={formData.hsn_number || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Tax</label>
          <select
            name="tax"
            className="w-full bg-[#F6F8FA] p-2 rounded border border-gray-300"
            value={formData.tax || ""}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="0">0%</option>
            <option value="5">5%</option>
            <option value="10">10%</option>
            <option value="18">18%</option>
            <option value="28">28%</option>
          </select>
        </div>
      </div>
    )}

    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2">
      <button
        type="button"
        className="flex items-center gap-2 text-blue-600 text-sm border px-4 py-2 rounded shadow-sm hover:bg-gray-100"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 3a1 1 0 000 2h12a1 1 0 100-2H4zM3 8a1 1 0 011-1h12a1 1 0 011 1v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm7 2a1 1 0 00-1 1v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1a1 1 0 00-1-1z" />
        </svg>
        Import CSV
      </button>

      <div className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="appearance-none h-5 w-5 border border-gray-300 rounded-sm checked:bg-white checked:border-white checked:after:content-['✔'] checked:after:text-blue-500 checked:after:block checked:after:text-center"
          name="gstInclusive"
          checked={formData.gstInclusive}
          onChange={handleChange}
        />
        <label htmlFor="gstInclusive">GST Inclusive Pricing</label>
      </div>
    </div>

    <div className="flex justify-end gap-4 pb-2">
      <button
        type="button"
        className="px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Service
      </button>
    </div>
  </form>
);

export default function D3Product() {

 const initialFormData = {
    name: "",
    product_image: null,
    quantity: "",
    unit: "",
    min_quantity: "",
    sales_price: "",
    purchase_price: "",
    category: "",
    gstInclusive: false,
    hsn_number: "",
    tax: "",
    price_type: "",
  };

  const { id } = useParams(); // Get product ID from URL for edit mode
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("product");
  const [formData, setFormData] = useState(initialFormData);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(!!id); // Check if in edit mode

  // Fetch product data for edit mode
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const { product, success, error } = await ProductService.fetchProductById(id);
           setActiveTab("product"); // Default to product tab
          
          if (success && product) {
            // Map API data to formData, ensuring all fields are strings or appropriate types
            setFormData({
              name: product.name || "",
              product_image: null, // Image is not fetched as a file; handle separately if needed
              quantity: String(product.quantity || ""),
              unit: product.unit || "",
              min_quantity: String(product.min_quantity || ""),
              sales_price: String(product.sales_price || ""),
              purchase_price: String(product.purchase_price || ""),
              category: product.category || "",
              gstInclusive: product.gstInclusive === "true" || product.gstInclusive === true,
              hsn_number: product.hsn_number || "",
              tax: String(product.tax || ""),
              price_type: product.price_type || "",
            });
            setActiveTab(product.product_type === "service" ? "service" : "product");
          } else {
            toast.error(error || "Failed to fetch product", { position: "top-right", autoClose: 4000 });
            navigate("/dashboard/product"); // Redirect if product not found
          }
        } catch (err) {
          console.error("Error fetching product:", err);
          toast.error("Failed to fetch product", { position: "top-right", autoClose: 4000 });
          navigate("/dashboard/product");
        }
      };
      fetchProduct();
    }
  }, [id, navigate]);

  const friendlyFieldName = (field) => {
    const map = {
      name: "Name",
      quantity: "Quantity",
      unit: "Unit",
      min_quantity: "Minimum Quantity",
      sales_price: "Sale Price",
      purchase_price: "Purchase Price",
      category: "Category",
      hsn_number: "HSN/SCN Code",
      tax: "Tax",
      price_type: "Price Type",
    };
    return map[field] || field;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > MAX_FILE_SIZE_BYTES) {
        const mb = MAX_FILE_SIZE_BYTES / (1024 * 1024);
        toast.error(`Image too large. Max ${mb} MB allowed.`, { position: "top-right", autoClose: 4000 });
        setErrors((prev) => ({ ...prev, product_image: `Max ${mb}MB` }));
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
      setErrors((prev) => ({ ...prev, [name]: false }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields =
      activeTab === "product"
        ? ["name", "quantity", "unit", "min_quantity", "sales_price", "purchase_price", "category"]
        : ["name", "quantity", "unit", "sales_price"];

    const missingFields = [];

    requiredFields.forEach((field) => {
      const val = formData[field];
      if (val === "" || val === null || val === undefined) {
        newErrors[field] = true;
        missingFields.push(friendlyFieldName(field));
      }
    });

    setErrors(newErrors);

    if (missingFields.length > 0) {
      toast.error(`Please fill required fields: ${missingFields.join(", ")}`, {
        position: "top-right",
        autoClose: 4000,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const payload = { ...formData };
      const file = formData.product_image || null;
      delete payload.product_image;

      if (!payload.hsn_number) payload.hsn_number = "DEFAULT_HSN";
      if (!payload.tax) payload.tax = "0";
      if (!payload.price_type) payload.price_type = "fixed";

      if (activeTab === "service") {
        if (!payload.purchase_price || payload.purchase_price === "") payload.purchase_price = "0";
        if (!payload.category || payload.category === "") payload.category = "General";
        if (!payload.min_quantity || payload.min_quantity === "") payload.min_quantity = "0";
      } else {
        payload.min_quantity = payload.min_quantity || "0";
      }

      payload.gstInclusive = String(payload.gstInclusive);

      const productType = activeTab === "product" ? "inventory" : "service";

      let res;
      if (isEditMode) {
        // Update product
        res = await ProductService.updateProduct(id, payload, file, productType);
      } else {
        // Create product
        res = await ProductService.createProduct(payload, file, productType);
      }

      if (res.success) {
        toast.success(
          `${activeTab === "product" ? "Product" : "Service"} ${isEditMode ? "updated" : "saved"} successfully!`,
          { position: "top-right", autoClose: 3000 }
        );
        setFormData(initialFormData);
        setErrors({});
        setShowAdvanced(false);
        if (isEditMode) navigate("/dashboard/product-list"); // Redirect to product list after update
      } else {
        throw new Error(res.error || "Operation failed");
      }
    } catch (err) {
      console.error(`❌ Error ${isEditMode ? "updating" : "saving"} product:`, err);

      if (err?.message && err.message.includes("too large")) {
        toast.error(err.message, { position: "top-right", autoClose: 5000 });
        return;
      }

      const backendMessage = err?.response?.data?.message || err?.response?.data?.error;
      const status = err?.response?.status;

      if (backendMessage && backendMessage.toLowerCase().includes("file too large")) {
        const mb = MAX_FILE_SIZE_BYTES / (1024 * 1024);
        toast.error(`Uploaded image is too large. Max ${mb} MB allowed.`, { position: "top-right", autoClose: 6000 });
        return;
      }

      if (backendMessage) {
        toast.error(backendMessage, { position: "top-right", autoClose: 5000 });
        return;
      }

      if (status === 413) {
        const mb = MAX_FILE_SIZE_BYTES / (1024 * 1024);
        toast.error(`Uploaded image is too large. Max ${mb} MB allowed.`, { position: "top-right", autoClose: 6000 });
        return;
      }

      toast.error(
        `Failed to ${isEditMode ? "update" : "save"} ${activeTab === "product" ? "product" : "service"}. Please try again.`,
        { position: "top-right", autoClose: 5000 }
      );
    }
  };


  return (
    <div className="max-w-4xl mx-auto mt-5 md:mt-10 pb-7 bg-white rounded-lg shadow-customCard">
      <div className="bg-blue-600 text-white px-6 py-3 rounded-t-md text-lg font-semibold">
        Items
      </div>

      <div className="flex space-x-24 px-10 py-4">
        {["product", "service"].map((tab) => (
     
           <button
            key={tab}
            onClick={() => {
              if (!isEditMode) {
                setActiveTab(tab);
                setFormData(initialFormData);
                setErrors({});
              }
            }}
            className={`pb-2 text-lg font-medium border-b-2 ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500"
            } ${isEditMode ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={isEditMode}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>

        ))}
      </div>

      {activeTab === "product" && (
        <ProductForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          showAdvanced={showAdvanced}
          setShowAdvanced={setShowAdvanced}
          errors={errors}
        />
      )}
      {activeTab !== "product" && (
        <ServiceForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          showAdvanced={showAdvanced}
          setShowAdvanced={setShowAdvanced}
          errors={errors}
        />
      )}
    </div>
  );
}