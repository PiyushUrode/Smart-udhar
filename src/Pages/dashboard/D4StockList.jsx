import React, { useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaBoxOpen,
  FaDownload ,
  FaFilePdf,
} from "react-icons/fa";

import product1 from "../../assets/dummyimage/product1.png"
import product2 from "../../assets/dummyimage/product2.png"


const D4StockList = () => {
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
  {
    id: 7,
    name: "Webcam HD",
    category: "Electronics",
    image: product2,
    unit: "pcs",
    salePrice: 2200,
    purchasePrice: 1800,
    stock: 25,
  },
  {
    id: 8,
    name: "External Hard Drive 1TB",
    category: "Electronics",
    image: product1,
    unit: "pcs",
    salePrice: 4500,
    purchasePrice: 3900,
    stock: 10,
  },
  {
    id: 9,
    name: "UPS Battery Backup",
    category: "Hardware",
    image: product1,
    unit: "nos",
    salePrice: 3500,
    purchasePrice: 3000,
    stock: 8,
  },
  {
    id: 10,
    name: "Monitor 24 Inch",
    category: "Electronics",
    image: product2,
    unit: "nos",
    salePrice: 12000,
    purchasePrice: 10500,
    stock: 7,
  }
];


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
  {
    id: 3,
    name: "Laptop Cleaning",
    category: "Hardware",
    image: product2,
    unit: "job",
    salePrice: 400,
    purchasePrice: 0,
    stock: 0,
  },
  {
    id: 4,
    name: "Software Installation",
    category: "Software",
    image: product1,
    unit: "job",
    salePrice: 700,
    purchasePrice: 0,
    stock: 0,
  },
  {
    id: 5,
    name: "OS Installation",
    category: "Software",
    image: product2,
    unit: "job",
    salePrice: 800,
    purchasePrice: 0,
    stock: 0,
  },
  {
    id: 6,
    name: "Network Setup",
    category: "Networking",
    image: product1,
    unit: "job",
    salePrice: 1500,
    purchasePrice: 0,
    stock: 0,
  },
  {
    id: 7,
    name: "CCTV Installation",
    category: "Security",
    image: product1,
    unit: "job",
    salePrice: 5000,
    purchasePrice: 0,
    stock: 0,
  },
  {
    id: 8,
    name: "Website Design",
    category: "Software",
    image: product2,
    unit: "project",
    salePrice: 15000,
    purchasePrice: 0,
    stock: 0,
  },
  {
    id: 9,
    name: "Mobile App Development",
    category: "Software",
    image: product1,
    unit: "project",
    salePrice: 25000,
    purchasePrice: 0,
    stock: 0,
  },
  {
    id: 10,
    name: "Annual Maintenance Contract",
    category: "Hardware",
    image: product1,
    unit: "contract",
    salePrice: 10000,
    purchasePrice: 0,
    stock: 0,
  }
];


  const renderTable = () => {
    if (activeTab === "product") {
      return (
        <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm text-sm">
          <thead className="bg-[#F6F8FA] text-left text-gray-600 text-nowrap">
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
            {products.map((item) => {
              const isLow = item.stock < 10;
              return (
                <tr key={item.id} className="border-t hover:bg-gray-50 text-nowrap">
                  <td className="p-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-[#1F2937] ">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.category}
                    </div>
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
                    <div className="font-medium text-[#1F2937]">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.category}
                    </div>
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
    <div className=" mx-auto  py-2 md:mt-5">
      {/* Header */}
      <div className="flex justify-between items-center  bg-white px-5 py-5">
        <h1 className="text-xl font-semibold text-[#1F2937] font-robotoB">Stock List </h1>

      </div>

      {/* Table */}
      <div className="overflow-x-auto p-2 lg:p-5 ">{renderTable()}</div>

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
        <div className="flex items-center gap-2 text-sm">

   <label style={{ display: "inline-block", position: "relative", cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={toggleCheckbox}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
        }}
      />
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "20px",
          height: "20px",
          border: "2px solid #ccc",
          borderRadius: "6px",
          backgroundColor: isChecked ? "#22c55e" : "#fff",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
          transition: "background-color 0.2s ease",
        }}
      >
        {isChecked ? "✔" : ""}
      </span>
    </label>

  <label htmlFor="gst" className="text-black font-robotoR">
    GST Inclusive Pricing
  </label>
</div>

      </div>
    </div>
  );
};


export default D4StockList