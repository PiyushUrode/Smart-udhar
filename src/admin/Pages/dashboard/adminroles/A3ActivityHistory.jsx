import React, { useState } from 'react';
import { Download, Search, FileText } from 'lucide-react';

const dummyLogs = [
  {
    id: 1,
    admin: 'John Doe',
    action: 'Login',
    timestamp: '2025-07-30 10:15:23',
    ip: '192.168.1.10',
    device: 'Chrome on Windows'
  },
  {
    id: 2,
    admin: 'Priya Sharma',
    action: 'Deleted Role: Editor',
    timestamp: '2025-07-30 11:05:12',
    ip: '192.168.1.22',
    device: 'Firefox on Mac'
  },
  {
    id: 3,
    admin: 'Arjun Yadav',
    action: 'Updated Permissions for Support',
    timestamp: '2025-07-29 18:42:51',
    ip: '192.168.1.30',
    device: 'Edge on Windows'
  },
  {
    id: 4,
    admin: 'John Doe',
    action: 'Exported Activity Logs',
    timestamp: '2025-07-29 09:33:10',
    ip: '192.168.1.10',
    device: 'Chrome on Windows'
  },
  {
    id: 5,
    admin: 'Sneha Patel',
    action: 'Added Role: HR Manager',
    timestamp: '2025-07-28 15:19:45',
    ip: '192.168.1.14',
    device: 'Safari on iOS'
  }
];

const A3ActivityHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = dummyLogs.filter((log) =>
    log.admin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 w-full max-w-7xl mt-5 md:mt-10 mx-auto space-y-6 font-interR">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-interSb text-bluecol flex items-center gap-2">
          <FileText size={20} /> Activity History
        </h1>

        {/* Export Buttons */}
        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-md font-robotoM bg-bluecol text-white hover:bg-blue-700 transition">
            <Download size={14} /> CSV
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-md font-robotoM bg-bluecol text-white hover:bg-blue-700 transition">
            <Download size={14} /> PDF
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="flex items-center gap-2 w-full md:w-1/3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 text-[#525252]" size={16} />
          <input
            type="text"
            placeholder="Search by admin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-2 border border-gray-300 bg-white rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-bluecol text-[#171717]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto bg-white rounded-xl shadow-customCard">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-[#F6F8FA] text-[#525252] font-interSb border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3">Admin</th>
              <th className="text-left px-4 py-3">Action</th>
              <th className="text-left px-4 py-3">Timestamp</th>
              <th className="text-left px-4 py-3">IP Address</th>
              <th className="text-left px-4 py-3">Device</th>
            </tr>
          </thead>
          <tbody className="text-[#171717] font-interR">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-100 hover:bg-[#F9FAFB] transition">
                  <td className="px-4 py-3">{log.admin}</td>
                  <td className="px-4 py-3">{log.action}</td>
                  <td className="px-4 py-3">{log.timestamp}</td>
                  <td className="px-4 py-3">{log.ip}</td>
                  <td className="px-4 py-3">{log.device}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-[#525252]">
                  No matching activity logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default A3ActivityHistory;
