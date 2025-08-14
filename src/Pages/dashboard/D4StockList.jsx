import React, { useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaBoxOpen,
  FaDownload,
  FaFilePdf,
} from "react-icons/fa";

import product1 from "../../assets/dummyimage/product1.png";
import product2 from "../../assets/dummyimage/product2.png";

const D4StockList = () => {
  const [activeTab, setActiveTab] = useState("product");
  const [editItem, setEditItem] = useState(null);
  const [stockInput, setStockInput] = useState("");
  const [products, setProducts] = useState([
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
    {
      id: 3,
      name: "Wireless Mouse",
      category: "Electronics",
      image: product1,
      unit: "pcs",
      salePrice: 800,
      purchasePrice: 600,
      stock: 40,
    },
    {
      id: 4,
      name: "Mechanical Keyboard",
      category: "Electronics",
      image: product2,
      unit: "pcs",
      salePrice: 2500,
      purchasePrice: 2000,
      stock: 20,
    },
    {
      id: 5,
      name: "HDMI Cable",
      category: "Electronics",
      image: product1,
      unit: "pcs",
      salePrice: 300,
      purchasePrice: 200,
      stock: 100,
    },
    {
      id: 6,
      name: "Laptop Stand",
      category: "Hardware",
      image: product2,
      unit: "nos",
      salePrice: 1200,
      purchasePrice: 900,
      stock: 15,
    },
  ]);

  const services = [
    {
      id: 1,
      name: "Printer Repair",
      category: "Hardware",
      image: product2,
      unit: "job",
      salePrice: 500,
      purchasePrice: 0,
      stock: 0,
    },
    {
      id: 2,
      name: "Data Recovery",
      category: "Electronics",
      image: product1,
      unit: "job",
      salePrice: 3000,
      purchasePrice: 0,
      stock: 0,
    },
  ];

  const openEditModal = (item) => {
    setEditItem(item);
    setStockInput(item.stock);
  };

  const closeModal = () => {
    setEditItem(null);
    setStockInput("");
  };

  const handleUpdateStock = () => {
    const updated = products.map((p) =>
      p.id === editItem.id ? { ...p, stock: Number(stockInput) } : p
    );
    setProducts(updated);
    closeModal();
  };

  const renderTable = () => {
    const data = activeTab === "product" ? products : services;

    return (
      <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm text-sm">
        <thead className="bg-[#F6F8FA] text-left text-gray-600">
          <tr>
            <th className="p-3">Image</th>
            <th className="p-3">Name</th>
            <th className="p-3">Unit</th>
            <th className="p-3">Sale Price</th>
            <th className="p-3">Purchase Price</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const isLow = item.stock < 10;
            return (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-3">
                  <div className="font-medium text-[#1F2937]">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.category}</div>
                </td>
                <td className="p-3 text-gray-700">{item.unit}</td>
                <td className="p-3 font-semibold text-[#1F2937]">
                  ₹{item.salePrice.toLocaleString()}
                </td>
                <td className="p-3 text-gray-700">
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
                <td className="p-3 flex gap-3 text-xl">
                  <button
                    title="Edit"
                    onClick={() => openEditModal(item)}
                    className="text-blue-600 hover:scale-110 transition-transform"
                  >
                    <FaEdit />
                  </button>
                  <button
                    title="Delete"
                    className="text-red-500 hover:scale-110 transition-transform"
                  >
                    <FaTrash />
                  </button>
                  <button
                    title="Stock"
                    className="text-black hover:scale-110 transition-transform"
                  >
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

  const [isChecked, setIsChecked] = useState(false);
  const toggleCheckbox = () => setIsChecked((prev) => !prev);

  return (
    <div className="mx-auto py-2 md:mt-5">
      <div className="flex justify-between items-center bg-white px-5 py-5">
        <h1 className="text-xl font-semibold text-[#1F2937] font-robotoB">
          Stock List
        </h1>
      </div>

      <div className="overflow-x-auto p-2 lg:p-5">{renderTable()}</div>

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
        {/* <div className="flex items-center gap-2 text-sm">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={toggleCheckbox}
              className="sr-only"
            />
            <span
              className={`w-5 h-5 border-2 rounded-md flex items-center justify-center ${
                isChecked ? "bg-green-500 text-white" : "bg-white"
              }`}
            >
              {isChecked ? "✔" : ""}
            </span>
          </label>
          <label htmlFor="gst" className="text-black font-robotoR">
            GST Inclusive Pricing
          </label>
        </div> */}
      </div>

      {/* Stock Update Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Update Stock for "{editItem.name}"
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                New Stock Value
              </label>
              <input
                type="text"
                value={stockInput}
                onChange={(e) => setStockInput(e.target.value)}
                className="w-full border rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStock}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default D4StockList;
