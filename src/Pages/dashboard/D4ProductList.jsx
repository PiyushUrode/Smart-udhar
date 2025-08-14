import React, { useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaBoxOpen,
  FaDownload,
  FaFilePdf,
} from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

import product1 from "../../assets/dummyimage/product1.png";
import product2 from "../../assets/dummyimage/product2.png";

const D4ProductList = () => {
  const [activeTab, setActiveTab] = useState("product");

  const products = [
    {
      id: 1,
      name: "Pen Drive 32GB",
      category: "Electronics",
      image: product1,
      unit: "pcs",
      salePrice: 400,
      purchasePrice: 320,
      stock: 50,
    },
    {
      id: 2,
      name: "HP Printer",
      category: "Hardware",
      image: product2,
      unit: "nos",
      salePrice: 15000,
      purchasePrice: 13500,
      stock: 5,
    },
  ];

  const services = [
    {
      id: 1,
      name: "HP Printer",
      category: "Hardware",
      image: product2,
      unit: "nos",
      salePrice: 15000,
      purchasePrice: 13500,
      stock: 5,
    },
    {
      id: 2,
      name: "Pen Drive 32GB",
      category: "Electronics",
      image: product1,
      unit: "pcs",
      salePrice: 400,
      purchasePrice: 320,
      stock: 50,
    },
  ];

  const renderTable = () => {
    if (activeTab === "product") {
      return (
        <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm text-sm">
          <thead className=" text-left text-[#6B7280] font-robotoM text-nowrap">
            <tr>
              <th className="p-3 font-medium">Image</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Unit</th>
              <th className="p-3 font-medium">Sale Price</th>
              <th className="p-3 font-medium">Purchase Price</th>
              <th className="p-3 font-medium">Stock</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Actions</th>
              <th className="p-3 font-medium">New Stock </th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => {
              const isLow = item.stock < 10;
              return (
                <tr
                  key={item.id}
                  className="border-t hover:bg-gray-50 text-nowrap"
                >
                  <td className="p-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-[#111827] ">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500">{item.category}</div>
                  </td>
                  <td className="p-3 text-[#111827]">{item.unit}</td>
                  <td className="p-3 font-semibold text-[#111827]">
                    ₹{item.salePrice.toLocaleString()}
                  </td>
                  <td className="p-3 text-[#111827]">
                    ₹{item.purchasePrice.toLocaleString()}
                  </td>
                  <td
                    className={`p-3 font-semibold ${
                      isLow ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {item.stock}
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
                        title="Edit"
                        className="text-blue-600 text-xl hover:scale-110 transition-transform"
                      >
                        <FaEdit />
                      </button>
                      <button
                        title="Delete"
                        className="text-red-500 text-xl hover:scale-110 transition-transform"
                      >
                        <FaTrash />
                      </button>
                      <button
                        title="Stock"
                        className="text-black text-xl hover:scale-110 transition-transform"
                      >
                        <FaBoxOpen />
                      </button>
                    </div>
                  </td>
                                    <td className="p-3 align-middle text-center">
                                      <div className="text-white px-3 py-2 bg-lightbluecol font-robotoR text-sm rounded-lg">

                   Stock
                                      </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }

    // Service Table
    return (
      <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm text-sm">
        <thead className="bg-[#F6F8FA] text-left text-gray-600">
          <tr>
            <th className="p-3 font-medium">Image</th>
            <th className="p-3 font-medium">Name</th>
            <th className="p-3 font-medium">Unit</th>
            <th className="p-3 font-medium">Sale Price</th>
            <th className="p-3 font-medium">Purchase Price</th>
            <th className="p-3 font-medium">Stock</th>
            <th className="p-3 font-medium">Status</th>
            <th className="p-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((item) => {
            const isLow = item.stock < 10;
            return (
              <tr key={item.id} className="border-t hover:bg-gray-50 ">
                <td className="p-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-3">
                  <div className="font-medium text-[#111827]">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.category}</div>
                </td>
                <td className="p-3 text-[#111827]">{item.unit}</td>
                <td className="p-3 font-semibold text-[#111827]">
                  ₹{item.salePrice.toLocaleString()}
                </td>
                <td className="p-3 text-[#111827]">
                  ₹{item.purchasePrice.toLocaleString()}
                </td>
                <td
                  className={`p-3 font-semibold ${
                    isLow ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {item.stock}
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
                <td className="p-3 flex gap-3 text-blue-600">
                  <button title="Edit">
                    <FaEdit />
                  </button>
                  <button title="Delete" className="text-red-500">
                    <FaTrash />
                  </button>
                  <button title="Stock">
                    <FaBoxOpen />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  // Checkbox state for GST Inclusive Pricing
  const [isChecked, setIsChecked] = useState(false);
  const toggleCheckbox = () => setIsChecked((prev) => !prev);

  return (
    <div className=" mx-auto mt-5  p-4 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b px-6 py-3">
        <h1 className="text-xl font-semibold text-[#111827]">Items</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm flex items-center gap-2">
          <FaPlus />
          Add New Item
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b mb-4 flex gap-6 text-sm border-b   md:px-6 py-3">
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

      {/* Filters */}
      <div className="flex flex-row gap-5 flex-wrap  border-b md:px-6 py-3  items-center mb-4">
        <div className="w-full md:w-60 relative">
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
            <CiSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by name or category"
            className="w-full pl-8 pr-2 py-2 border rounded bg-[#F6F8FA] text-sm placeholder:text-gray-500"
          />
        </div>


      </div>

      {/* Table */}
      <div className="overflow-x-auto  p-3 border-2 shadow-customSoft rounded-lg bg-[#00000000] ">
        {renderTable()}
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 gap-4 shadow-customCard py-5 px-5 border rounded-md">
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border px-4 py-2 rounded text-sm text-blue-600 hover:bg-gray-100">
            <FaDownload />
            Export Inventory
          </button>
          <button className="flex items-center gap-2 border px-4 py-2 rounded text-sm text-blue-600 hover:bg-gray-100">
            <FaFilePdf />
            Download PDF
          </button>
        </div>

      </div>
    </div>
  );
};

export default D4ProductList;
