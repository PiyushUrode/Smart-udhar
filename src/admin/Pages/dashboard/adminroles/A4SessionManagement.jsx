import React from 'react';
import {
  LogOut,
  MonitorSmartphone,
  ShieldCheck,
  Shield,
} from 'lucide-react';

const dummySessions = [
  {
    id: 1,
    admin: 'John Doe',
    role: 'Super Admin',
    device: 'Chrome on Windows',
    ip: '192.168.1.10',
    location: 'Delhi, India',
    lastActive: '2025-07-31 10:20 AM',
    color: 'bg-green-100 text-green-700',
  },
  {
    id: 2,
    admin: 'Priya Sharma',
    role: 'Support',
    device: 'Safari on iOS',
    ip: '192.168.1.12',
    location: 'Mumbai, India',
    lastActive: '2025-07-31 09:40 AM',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 3,
    admin: 'Arjun Yadav',
    role: 'Finance',
    device: 'Firefox on Mac',
    ip: '192.168.1.15',
    location: 'Bangalore, India',
    lastActive: '2025-07-30 11:55 PM',
    color: 'bg-yellow-100 text-yellow-700',
  },
  {
    id: 4,
    admin: 'Meera Kaur',
    role: 'Manager',
    device: 'Edge on Windows',
    ip: '192.168.1.18',
    location: 'Chandigarh, India',
    lastActive: '2025-07-30 02:12 PM',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    id: 5,
    admin: 'Rahul Singh',
    role: 'Guest',
    device: 'Chrome on Android',
    ip: '192.168.1.22',
    location: 'Hyderabad, India',
    lastActive: '2025-07-29 06:30 PM',
    color: 'bg-red-100 text-red-600',
  },
];

const A4SessionManagement = () => {
  const handleTerminate = (id) => {
    alert(`Terminate session ID: ${id}`);
  };

  return (
    <div className="p-4 w-full max-w-7xl mt-5 md:mt-10 mx-auto space-y-6 font-interR">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-interSb text-bluecol flex items-center gap-2">
          <MonitorSmartphone size={20} /> Session Management
        </h1>
      </div>

      {/* Session Table */}
      <div className="overflow-auto bg-white rounded-lg shadow-customCard">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-[#F6F8FA] text-gray-700 font-interSb">
            <tr>
              <th className="text-left px-4 py-2">Admin</th>
              <th className="text-left px-4 py-2">Role</th>
              <th className="text-left px-4 py-2">Device</th>
              <th className="text-left px-4 py-2">IP</th>
              <th className="text-left px-4 py-2">Location</th>
              <th className="text-left px-4 py-2">Last Active</th>
              <th className="text-left px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 font-interR">
            {dummySessions.map((session) => (
              <tr
                key={session.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-2">{session.admin}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-robotoM rounded-full ${session.color}`}
                  >
                    {session.role}
                  </span>
                </td>
                <td className="px-4 py-2">{session.device}</td>
                <td className="px-4 py-2">{session.ip}</td>
                <td className="px-4 py-2">{session.location}</td>
                <td className="px-4 py-2">{session.lastActive}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleTerminate(session.id)}
                    className="text-sm text-white bg-red-500 px-3 py-1.5 rounded-md hover:bg-red-600 font-robotoM flex items-center gap-1"
                  >
                    <LogOut size={14} /> Terminate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Extra Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Audit Trail */}
        <div className="bg-white p-4 rounded-lg shadow-customCard">
          <h2 className="text-lg font-interSb text-bluecol flex items-center gap-2 mb-2">
            <ShieldCheck size={18} /> Audit Trails
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Maintain detailed logs of data changes with full audit history. Includes timestamp, IP address, and change preview with diff view.
            <span className="text-blue-600 font-interSb"> (Coming Soon)</span>
          </p>
        </div>

        {/* Role Templates */}
        <div className="bg-white p-4 rounded-lg shadow-customCard">
          <h2 className="text-lg font-interSb text-bluecol flex items-center gap-2 mb-2">
            <Shield size={18} /> Role Templates
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Use predefined templates like “Manager”, “Support”, or “Finance” for quick permission setup.
            <span className="text-blue-600 font-interSb"> (Coming Soon)</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default A4SessionManagement;
