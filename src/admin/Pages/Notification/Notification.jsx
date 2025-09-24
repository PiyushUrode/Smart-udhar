import React, { useState } from "react";
import { useNotification } from "../../controller/Notification/NotificationCTR.jsx";

// 🔹 Component for adding multiple children
function ChildInput({ onChange }) {
  const [child, setChild] = useState("");
  const [children, setChildren] = useState([]);

  const addChild = () => {
    if (child.trim() && !children.includes(child.trim())) {
      const updated = [...children, child.trim()];
      setChildren(updated);
      onChange(updated); // send back to parent
      setChild("");
    }
  };

  const removeChild = (c) => {
    const updated = children.filter((ch) => ch !== c);
    setChildren(updated);
    onChange(updated);
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={child}
          onChange={(e) => setChild(e.target.value)}
          className="flex-1 p-2 border rounded bg-white text-black"
          placeholder="e.g. Discount"
        />
        <button
          type="button"
          onClick={addChild}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {children.map((c, idx) => (
          <span
            key={idx}
            className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center gap-1"
          >
            {c}
            <button
              type="button"
              className="text-red-500"
              onClick={() => removeChild(c)}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SendNotification() {
  const {
    title,
    setTitle,
    message,
    setMessage,
    notificationType,
    setNotificationType,
    types,
    intypes,
    newType,
    setNewType,
    newChildren,
    setNewChildren,
    loading,
    handleAddType,
    handleRemoveType,
    handleSubmit,
  } = useNotification();

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Super Admin Notification Panel
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Notification Form */}
        <div className="md:col-span-2 border rounded shadow p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4">Send Notification</h3>
          <form onSubmit={handleSubmit}>
            {/* Notification Type */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                Notification Type
              </label>
              <select
                value={notificationType}
                onChange={(e) => setNotificationType(e.target.value)}
                className="w-full p-2 border rounded bg-white text-black"
                required
              >
                {intypes.map((name, i) => (
                  <option key={i} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded bg-white text-black"
                placeholder="Enter notification title"
                required
              />
            </div>

            {/* Message */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded bg-white text-black"
                rows={4}
                placeholder="Enter notification message"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Notification"}
            </button>
          </form>
        </div>

        {/* Manage Types */}
        <div className="border rounded shadow p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4">
            Manage Notification Types
          </h3>

          {/* Add new type */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Parent Type Name</label>
            <input
              type="text"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="w-full p-2 border rounded bg-white text-black"
              placeholder="e.g. Offer"
            />
          </div>

          {/* Add children */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Children</label>
            <ChildInput onChange={setNewChildren} />
          </div>

          <button
            type="button"
            onClick={handleAddType}
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            Add Type
          </button>

          {/* Existing types */}
          <div className="space-y-2 max-h-48 overflow-y-auto mt-4">
            {types.map((type) => (
              <div key={type._id} className="border rounded p-3 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{type.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveType(type._id)}
                    className="text-red-500 text-xs"
                  >
                    Remove
                  </button>
                </div>
                {type.children && type.children.length > 0 && (
                  <ul className="ml-4 mt-2 text-sm list-disc">
                    {type.children.map((child, idx) => (
                      <li key={idx}>{child}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}