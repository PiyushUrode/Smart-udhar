import React, { useState } from "react";
import {
  Plus,
  MoreVertical,
  ShieldCheck,
  BadgeCheck,
  XCircle,
  UserCog,
  ToggleRight,
  ToggleLeft,
} from "lucide-react";

const dummyRoles = [
  {
    id: 1,
    name: "Manager",
    parent: "None",
    mfa: true,
    createdAt: "2024-06-01",
    users: 5,
  },
  {
    id: 2,
    name: "Support",
    parent: "Manager",
    mfa: false,
    createdAt: "2024-07-15",
    users: 2,
  },
  {
    id: 3,
    name: "Developer",
    parent: "Admin",
    mfa: true,
    createdAt: "2024-05-22",
    users: 3,
  },
];

const S3RoleSettings = () => {
  const [roles, setRoles] = useState(dummyRoles);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const toggleMFA = (id) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.id === id ? { ...role, mfa: !role.mfa } : role
      )
    );
  };

  const deleteRole = (id) => {
    setRoles((prev) => prev.filter((role) => role.id !== id));
  };

  return (
    <div className="p-4 w-full max-w-7xl mt-5 md:mt-10 mx-auto space-y-6 font-interR">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Admin Role Settings</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-bluecol text-white px-4 py-2 rounded-md shadow-customCard hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          Add Role
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-customCard">
        <table className="min-w-full bg-white">
          <thead className="bg-[#F9FAFB] text-[#374151] text-sm font-medium">
            <tr>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Parent Role</th>
              <th className="text-left px-4 py-3">MFA</th>
              <th className="text-left px-4 py-3">Created Date</th>
              <th className="text-left px-4 py-3">Users</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {roles.map((role) => (
              <tr key={role.id} className="border-t">
                <td className="px-4 py-3 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-bluecol" />
                  {role.name}
                </td>
                <td className="px-4 py-3">{role.parent}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleMFA(role.id)}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      role.mfa
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {role.mfa ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                    {role.mfa ? "Enabled" : "Disabled"}
                  </button>
                </td>
                <td className="px-4 py-3">{role.createdAt}</td>
                <td className="px-4 py-3">{role.users}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedRole(role);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRole(role.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {roles.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No roles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">
                {selectedRole ? "Edit Role" : "Add Role"}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <XCircle size={20} className="text-gray-500 hover:text-red-500" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Role Name"
                defaultValue={selectedRole?.name || ""}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <select
                defaultValue={selectedRole?.parent || ""}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="">Select Parent Role</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
              </select>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked={selectedRole?.mfa} />
                <span className="text-sm">Enable Multi-Factor Authentication</span>
              </div>
              <button className="w-full bg-bluecol text-white py-2 rounded hover:bg-blue-700 transition text-sm">
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default S3RoleSettings;
