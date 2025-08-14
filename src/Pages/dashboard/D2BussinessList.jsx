import React, { useState } from "react";
import { FaPlusCircle, FaTrash, FaEdit, FaDownload, FaFilePdf } from "react-icons/fa";

const D2BussinessList = () => {
  const [activeTab, setActiveTab] = useState("business");
  const [editItem, setEditItem] = useState(null);

  const businesses = [
    {
      id: 1,
      name: "Tech Solutions Pvt Ltd",
      gst: "27AAECT1234F1Z5",
      cityState: "Mumbai, Maharashtra",
      mobile: "+91 98765 43210",
      email: "info@techsolutions.com",
      lastActivity: "2025-08-05 14:32",
    },
    {
      id: 2,
      name: "Green Earth Organics",
      gst: "29AACCG1234E1Z3",
      cityState: "Bangalore, Karnataka",
      mobile: "+91 99887 77665",
      email: "support@greenearth.com",
      lastActivity: "2025-08-04 09:15",
    },
    {
      id: 3,
      name: "Urban Fashion Hub",
      gst: "07AACCU1234H1Z1",
      cityState: "Delhi, Delhi NCR",
      mobile: "+91 91234 56789",
      email: "contact@urbanfashion.com",
      lastActivity: "2025-08-03 18:50",
    },
  ];

  const renderTable = () => {
    const data = activeTab === "business" ? businesses : [];

    return (
<table className="w-full bg-white rounded-lg overflow-hidden shadow text-sm border border-gray-200 ">
  <thead className="bg-[#E8E8E8] text-left text-[#111827] font-robotoM text-base border-b border-gray-300">
    <tr>
      <th className="p-4">Business Name</th>
      <th className="p-4">GST Number</th>
      <th className="p-4">City / State</th>
      <th className="p-4">Mobile Number</th>
      <th className="p-4">Email</th>
      <th className="p-4">Last Activity</th>
      <th className="p-4">Actions</th>
    </tr>
  </thead>
  <tbody>
    {data.map((item) => (
      <tr
        key={item.id}
        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <td className="p-4 font-robotoR text-[#111827]">{item.name}</td>
        <td className="p-4  font-robotoR  text-[#111827]">{item.gst}</td>
        <td className="p-4  font-robotoR text-[#111827]">{item.cityState}</td>
        <td className="p-4  font-robotoR text-[#111827]">{item.mobile}</td>
        <td className="p-4  font-robotoR text-[#111827]">{item.email}</td>
        <td className="p-4  font-robotoR text-[#111827]">{item.lastActivity}</td>
        <td className="p-4 flex gap-3 text-lg">
          <button
            title="Edit"
            className="text-white px-5 py-1 font-robotoR rounded-md  bg-lightbluecol text-sm   hover:scale-110 transition-transform"
          >
            {/* <FaEdit /> */}
            Edit
          </button>

        </td>
      </tr>
    ))}
  </tbody>
</table>

    );
  };

  return (
    <>  
    <div className="mx-auto py-2 px-2 md:mt-5">
      {/* Header */}
      <div className="flex justify-between items-center bg-white px-5 py-5">
        <h1 className="text-xl font-semibold text-[#1F2937] font-robotoB">
          Business List
        </h1>
        <div className="text-sm lg:text-base font-semibold text-white p-2 bg-lightbluecol flex gap-3 items-center cursor-pointer rounded">
      <FaPlusCircle />    Add Business 
        </div>
      </div>
        </div>

      {/* Table */}

          <div className="mx-auto py-2 px-2 md:mt-5"> 
      <div className="overflow-x-auto p-2 lg:p-5">{renderTable()}</div>
      </div>

      {/* Bottom Action Bar */}
                <div className="mx-auto py-2 px-2 md:mt-5"> 
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 gap-4 shadow-customCard py-5 px-5 border rounded-md">
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border px-4 py-2 rounded text-sm text-blue-600 hover:bg-gray-100">
            <FaDownload />
            Export List
          </button>
          <button className="flex items-center gap-2 border px-4 py-2 rounded text-sm text-blue-600 hover:bg-gray-100">
            <FaFilePdf />
            Download PDF
          </button>
        </div>
      </div>
        </div>


                <div className="mx-auto py-2 px-2 md:mt-5"> 
      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Edit "{editItem.name}"
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Business Name
              </label>
              <input
                type="text"
                defaultValue={editItem.name}
                className="w-full border rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditItem(null)}
                className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => setEditItem(null)}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
        </>
  );
};

export default D2BussinessList;
