import React, { useState } from 'react';
import { Search, Download, MoreVertical, UserCheck, UserX, KeyRound } from 'lucide-react';
import { CSVLink } from 'react-csv';

const dummyAdmins = [
  {
    id: 1,
    name: 'Piyush Urode',
    email: 'piyush@company.com',
    role: 'Super Admin',
    lastLogin: '2025-07-30 14:32',
    status: 'Active',
    ip: '192.168.1.1'
  },
  {
    id: 2,
    name: 'Aman Verma',
    email: 'aman@company.com',
    role: 'Editor',
    lastLogin: '2025-07-29 09:50',
    status: 'Inactive',
    ip: '192.168.1.5'
  }
];

const A1AdminList = () => {
  const [search, setSearch] = useState('');

  const filteredAdmins = dummyAdmins.filter(admin =>
    admin.name.toLowerCase().includes(search.toLowerCase()) ||
    admin.email.toLowerCase().includes(search.toLowerCase()) ||
    admin.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 w-full max-w-7xl mt-5 md:mt-10 mx-auto space-y-6 font-interR">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-interSb text-bluecol">Admin List</h1>

        <div className="flex items-center gap-2">
          <CSVLink
            data={filteredAdmins}
            filename="admin-list.csv"
            className="px-3 py-1.5 border border-bluecol text-bluecol rounded-md text-sm hover:bg-bluecol hover:text-white transition"
          >
            <Download size={16} className="inline mr-1" /> Export CSV
          </CSVLink>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email or role..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300  bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-bluecol text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Filters (Extend as needed) */}
        <select className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-bluecol">
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Bulk Actions */}
      <div className="flex flex-wrap gap-2 text-sm">
        <button className="flex items-center gap-1 px-3 py-1.5 bg-bluecol text-white rounded-md shadow-customCard">
          <UserCheck size={16} /> Activate
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-black rounded-md shadow">
          <UserX size={16} /> Deactivate
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-md shadow">
          <KeyRound size={16} /> Reset Password
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto bg-white rounded-lg shadow-customCard">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-[#F6F8FA] text-gray-600 font-interSb">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Role</th>
              <th className="text-left px-4 py-2">Last Login</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">IP Address</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-black font-interR">
            {filteredAdmins.map((admin) => (
              <tr key={admin.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">{admin.name}</td>
                <td className="px-4 py-2">{admin.email}</td>
                <td className="px-4 py-2">{admin.role}</td>
                <td className="px-4 py-2">{admin.lastLogin}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${admin.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {admin.status}
                  </span>
                </td>
                <td className="px-4 py-2">{admin.ip}</td>
                <td className="px-4 py-2">
                  <button className="p-1 hover:bg-gray-200 rounded-full">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredAdmins.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">No admins found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default A1AdminList;
