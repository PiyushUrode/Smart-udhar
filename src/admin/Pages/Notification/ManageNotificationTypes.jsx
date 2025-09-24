// src/components/CustomDropdown.jsx
import React, { useState, useEffect } from "react";
import { useNotificationTypes } from "../../controller/Notification/ManageNotificationTypesCTR"; 

// ChildInput remains the same as it's a presentational component
function ChildInput({ onChange, initialChildren = [] }) {
  const [child, setChild] = useState("");
  const [children, setChildren] = useState(initialChildren);

  useEffect(() => {
    setChildren(initialChildren || []);
  }, [initialChildren?.join(",")]);

  const addChild = () => {
    if (child.trim() && !children.includes(child.trim())) {
      const updated = [...children, child.trim()];
      setChildren(updated);
      onChange(updated);
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
          className="flex-1 p-2 border rounded bg-white"
          placeholder="Child name"
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

export default function CustomDropdown() {
  const {
    types,
    newType,
    setNewType,
    newChildren,
    setNewChildren,
    editingType,
    setEditingType,
    handleAddType,
    handleRemoveType,
    handleUpdateType,
  } = useNotificationTypes();

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Manage Dropdown</h2>

      {/* Add new type form */}
      <div className="border rounded shadow p-6 bg-white mb-6">
        <h3 className="text-lg font-semibold mb-4">Add New Type</h3>
        <input
          type="text"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="w-full p-2 border rounded mb-3 bg-white"
          placeholder="Parent type name (e.g. Offer)"
        />
        <ChildInput onChange={setNewChildren} />
        <button
          type="button"
          onClick={handleAddType}
          className="bg-green-500 text-white px-4 py-2 rounded mt-3 w-full"
        >
          Add Type
        </button>
      </div>

      {/* Existing types list */}
      <div className="space-y-3">
        {types.map((type) => (
          <div
            key={type._id}
            className="border rounded p-4 bg-gray-50 flex flex-col"
          >
            {editingType?._id === type._id ? (
              <>
                <input
                  type="text"
                  value={editingType.name}
                  onChange={(e) =>
                    setEditingType({ ...editingType, name: e.target.value })
                  }
                  className="p-2 border rounded mb-2 w-full bg-white"
                />
                <ChildInput
                  initialChildren={editingType.children}
                  onChange={(children) =>
                    setEditingType({ ...editingType, children })
                  }
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleUpdateType}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingType(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{type.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setEditingType({
                          ...type,
                          children: [...(type.children || [])],
                        })
                      }
                      className="text-blue-500 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemoveType(type._id)}
                      className="text-red-500 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {type.children?.length > 0 && (
                  <ul className="ml-4 mt-2 text-sm list-disc">
                    {type.children.map((child, idx) => (
                      <li key={idx}>{child}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}