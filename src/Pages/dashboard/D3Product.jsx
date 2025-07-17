import { useState } from "react";

import { ImagePlus } from "lucide-react";
const D3Product = () => {
  const [activeTab, setActiveTab] = useState("product");
  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    salePrice: "",
    purchasePrice: "",
    gstInclusive: false,
    image: null,
    hsn: "",
    tax: "",
    priceType: "",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="max-w-4xl mx-auto mt-5 md:mt-10 p-4 bg-white rounded-lg shadow-customCard">
      {/* Blue Header */}
      <div className="bg-bluecol text-white px-4 py-2 rounded-t-md text-lg font-semibold">
        Items
      </div>

      {/* Tabs */}
      <div className="border-b flex space-x-6 px-4 pt-4">
        {["product", "service"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium border-b-2 ${
              activeTab === tab
                ? "border-bluecol text-bluecol"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}s
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 px-4 pt-6">
        {/* Name & Image Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter item name"
              required
              className="input w-full bg-[#F6F8FA] p-2 rounded border"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <div className="flex flex-row justify-start items-center gap-3  ">
              <label className="w-full md:w-[60%] bg-[#F6F8FA] p-2 rounded border cursor-pointer flex justify-between items-center">
                <span className="flex items-center gap-2 text-sm text-gray-700">
                  <ImagePlus color="#2563EB" />
                  <span className="text-[#2563EB]">Add Product Image</span>
                </span>
                <input
                  type="file"
                  name="image"
                  className="hidden"
                  onChange={handleChange}
                />
                <span className="text-xs text-gray-400">{formData.image}</span>
              </label>
              <span className="font-robotoR"> "No file chosen"</span>
            </div>
          </div>
        </div>

        {/* Unit & Sale Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit<span className="text-red-500">*</span>
            </label>
            <select
              name="unit"
              required
              className="input w-full bg-[#F6F8FA] font-robotoR  text-gray-500 p-2 rounded border"
              value={formData.unit}
              onChange={handleChange}
            >
              <option value="">e.g. pcs, kg, ltr</option>
              <option value="pcs">pcs</option>
              <option value="kg">kg</option>
              <option value="ltr">ltr</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sale Price<span className="text-red-500">*</span>
            </label>
            <div className="flex  gap-10">
              <div className="w-full ">
                <input
                  name="salePrice"
                  required
                  placeholder="₹ 0.00"
                  className="input w-full bg-[#F6F8FA]  rounded border"
                  value={formData.salePrice}
                  onChange={handleChange}
                />
              </div>
              <button
                type="button"
                className="bg-bluecol text-white w-[50%]  rounded"
              >
                + Add
              </button>
            </div>
            <span className="text-xs text-gray-500 mt-1 block">
              Custom Sale Price
            </span>
          </div>
        </div>

        {/* Purchase Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Price<span className="text-red-500">*</span>
          </label>
          <input
            name="purchasePrice"
            required
            placeholder="0.00"
            className="input w-full bg-white p-2 rounded border"
            value={formData.purchasePrice}
            onChange={handleChange}
          />
        </div>

        {/* Advanced Fields Toggle */}
        <div
          className="bg-[#F6F8FA] p-3 rounded-md text-blue-600 font-semibold text-sm cursor-pointer"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? "▴ Advanced Fields" : "▾ Advanced Fields"}
        </div>

        {showAdvanced && (
          <div className="bg-[#F9FBFC] p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4 border">
            {/* HSN/SCN Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HSN/SCN Code
              </label>
              <input
                type="text"
                name="hsn"
                placeholder="Enter code"
                className="input w-full bg-[#F6F8FA] p-2 rounded border"
                value={formData.hsn || ""}
                onChange={handleChange}
              />
            </div>

            {/* Tax Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax
              </label>
              <select
                name="tax"
                className="input w-full bg-[#F6F8FA] p-2 rounded border"
                value={formData.tax || ""}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="0%">0%</option>
                <option value="5%">5%</option>
                <option value="10%">10%</option>
                <option value="18%">18%</option>
                <option value="28%">28%</option>
              </select>
            </div>

            {/* Price Type Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <select
                name="priceType"
                className="input w-full bg-[#F6F8FA] p-2 rounded border"
                value={formData.priceType || ""}
                onChange={handleChange}
              >
                <option value="">With tax</option>
                <option value="without">Without tax</option>
              </select>
            </div>
          </div>
        )}

        {/* CSV & GST */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-2 text-bluecol text-sm border px-4 py-2 rounded shadow-sm hover:bg-gray-100"
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

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-bluecol text-white rounded hover:bg-blue-700"
          >
            Save Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default D3Product;
