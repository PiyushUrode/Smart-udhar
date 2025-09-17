import React, { useState } from "react";
import {
  Settings,
  UserCog,
  Globe,
  ShieldCheck,
  Upload,
} from "lucide-react";

const Setting = () => {
  const [activeTab, setActiveTab] = useState("Admin Profile");

  return (
    <div className="p-4 w-full max-w-6xl mx-auto mt-8 space-y-6 font-interR">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-interSb text-bluecol flex items-center gap-2">
          <Settings size={20} /> Platform Settings
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b gap-6 text-sm font-interSb">
        {["Admin Profile", "Platform Config", "Admin Roles"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 ${
              activeTab === tab
                ? "border-b-2 border-bluecol text-bluecol"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Admin Profile" && (
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white shadow-customCard rounded-xl p-5 space-y-4">
            <h2 className="font-interSb text-gray-700 flex items-center gap-1">
              <UserCog size={16} /> Update Profile Info
            </h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full border p-2 rounded-md text-sm"
            />
            <input
              type="tel"
              placeholder="Mobile"
              className="w-full border p-2 rounded-md text-sm"
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full border p-2 rounded-md text-sm"
            />
            <button className="bg-bluecol text-white px-4 py-2 rounded-md text-sm">
              Update Profile
            </button>
          </div>

          <div className="bg-white shadow-customCard rounded-xl p-5 space-y-4">
            <h2 className="font-interSb text-gray-700">Security Settings</h2>
            <label className="block text-sm text-gray-600">Enable 2FA</label>
            <select className="w-full border p-2 rounded-md text-sm">
              <option>Disabled</option>
              <option>Enabled</option>
            </select>
            <button className="bg-bluecol text-white px-4 py-2 rounded-md text-sm">
              Save Security Settings
            </button>
          </div>
        </div>
      )}

      {activeTab === "Platform Config" && (
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white shadow-customCard rounded-xl p-5 space-y-4">
            <h2 className="font-interSb text-gray-700 flex items-center gap-1">
              <Globe size={16} /> Branding
            </h2>
            <label className="text-sm text-gray-600">Upload Logo</label>
            <div className="flex items-center gap-4">
              <input type="file" className="text-sm" />
              <Upload size={16} className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Meta Title"
              className="w-full border p-2 rounded-md text-sm"
            />
            <textarea
              placeholder="Meta Description"
              className="w-full border p-2 rounded-md text-sm"
              rows={3}
            ></textarea>
            <button className="bg-bluecol text-white px-4 py-2 rounded-md text-sm">
              Save Branding
            </button>
          </div>

          <div className="bg-white shadow-customCard rounded-xl p-5 space-y-4">
            <h2 className="font-interSb text-gray-700">Notification Settings</h2>
            <input
              type="text"
              placeholder="Email Gateway API"
              className="w-full border p-2 rounded-md text-sm"
            />
            <input
              type="text"
              placeholder="SMS Gateway API"
              className="w-full border p-2 rounded-md text-sm"
            />
            <input
              type="text"
              placeholder="Webhook URL"
              className="w-full border p-2 rounded-md text-sm"
            />
            <button className="bg-bluecol text-white px-4 py-2 rounded-md text-sm">
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {activeTab === "Admin Roles" && (
        <div className="mt-6 space-y-4">
          <div className="bg-white shadow-customCard p-5 rounded-xl">
            <h2 className="font-interSb text-gray-700 flex items-center gap-2">
              <ShieldCheck size={18} /> Manage Roles & Permissions
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Assign/edit permissions, manage role inheritance, and enforce MFA.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                placeholder="Role Name"
                className="border p-2 rounded-md text-sm"
              />
              <select className="border p-2 rounded-md text-sm">
                <option>Permission Level</option>
                <option>Read Only</option>
                <option>Read + Write</option>
                <option>Full Access</option>
              </select>
              <select className="border p-2 rounded-md text-sm">
                <option>Enforce MFA?</option>
                <option>Yes</option>
                <option>No</option>
              </select>
              <button className="bg-bluecol text-white px-4 py-2 rounded-md text-sm col-span-2">
                Create/Update Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Setting;
