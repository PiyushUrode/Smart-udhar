import React, { useState } from 'react';
import {
  Plus,
  ShieldCheck,
  Pencil,
  Trash2,
  MoreVertical,
  X
} from 'lucide-react';

const dummyRoles = [
  {
    id: 1,
    name: 'Super Admin',
    permissions: ['Read', 'Write', 'Delete'],
    temporary: false
  },
  {
    id: 2,
    name: 'Editor',
    permissions: ['Read', 'Write'],
    temporary: false
  },
  {
    id: 3,
    name: 'Guest Admin',
    permissions: ['Read'],
    temporary: true
  },
  {
    id: 4,
    name: 'HR Manager',
    permissions: ['Read', 'Write'],
    temporary: false
  },
  {
    id: 5,
    name: 'Finance',
    permissions: ['Read'],
    temporary: false
  },
  {
    id: 6,
    name: 'Support',
    permissions: ['Read', 'Write'],
    temporary: false
  },
  {
    id: 7,
    name: 'Intern',
    permissions: ['Read'],
    temporary: true
  },
  {
    id: 8,
    name: 'Product Manager',
    permissions: ['Read', 'Write'],
    temporary: false
  },
  {
    id: 9,
    name: 'Sales Lead',
    permissions: ['Read', 'Write'],
    temporary: false
  },
  {
    id: 10,
    name: 'IT Admin',
    permissions: ['Read', 'Write', 'Delete'],
    temporary: false
  }
];

const A2RolePermissions = () => {
  const [roles, setRoles] = useState(dummyRoles);
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this role?");
    if (confirmed) {
      setRoles((prev) => prev.filter((role) => role.id !== id));
      setOpenDropdown(null);
    }
  };

  const handleEdit = (id) => {
    alert(`Open edit modal for role ID: ${id}`);
    setOpenDropdown(null);
  };

  return (
    <div className="p-4 w-full max-w-7xl mt-5 md:mt-10 mx-auto space-y-6 font-interR">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-interSb text-bluecol flex items-center gap-2">
          <ShieldCheck size={20} /> Role & Permissions
        </h1>
        <button className="flex items-center gap-1 px-4 py-2 bg-bluecol text-white rounded-md shadow-customCard text-sm hover:bg-blue-600 transition">
          <Plus size={16} /> Create Role
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto bg-white rounded-lg shadow-customCard">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-[#F6F8FA] text-gray-600 font-interSb">
            <tr>
              <th className="text-left px-4 py-2">Role</th>
              <th className="text-left px-4 py-2">Permissions</th>
              <th className="text-left px-4 py-2">Temporary</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-black font-interR">
            {roles.map((role) => (
              <tr key={role.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">{role.name}</td>
                <td className="px-4 py-2">
                  {role.permissions.map((perm, i) => (
                    <span
                      key={i}
                      className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs mr-1 mb-1"
                    >
                      {perm}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-2">
                  <span className={`text-xs font-medium ${role.temporary ? 'text-yellow-600' : 'text-gray-500'}`}>
                    {role.temporary ? 'Yes (7 days)' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-2 relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === role.id ? null : role.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {openDropdown === role.id ? <X size={16} /> : <MoreVertical size={16} />}
                  </button>

                  {/* Dropdown */}
                  {openDropdown === role.id && (
                    <div className="absolute z-10 right-2 top-10 w-36 bg-white border border-gray-200 rounded-md shadow-md text-sm">
                      <button
                        onClick={() => handleEdit(role.id)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Pencil size={14} /> Edit Role
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="w-full px-4 py-2 text-left hover:bg-red-100 text-red-600 flex items-center gap-2"
                      >
                        <Trash2 size={14} /> Delete Role
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {roles.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No roles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default A2RolePermissions;
