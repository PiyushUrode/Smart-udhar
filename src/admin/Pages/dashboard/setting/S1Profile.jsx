


 /* import React, { useState } from "react";
import {
  Settings,
  UserCog,
  Globe,
  ShieldCheck,
  Upload,
} from "lucide-react";

const S1Profile = () => {
  const [activeTab, setActiveTab] = useState("Admin Profile");

  return (
    <div className="p-4 w-full max-w-6xl mx-auto mt-8 space-y-6 font-interR">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-interSb text-bluecol flex items-center gap-2">
          <Settings size={20} /> Platform Settings
        </h1>
      </div>

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


export default S1Profile  */

import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Upload, User } from 'lucide-react';

const S1Profile = () => {
  const [avatar, setAvatar] = useState(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [enable2FA, setEnable2FA] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const passwordStrength = (pwd) => {
    if (pwd.length > 10) return 'Strong';
    if (pwd.length > 5) return 'Medium';
    return 'Weak';
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-customCard space-y-6">
      <h2 className="text-xl font-semibold text-bluecol flex items-center gap-2">
        <User size={20} /> Admin Profile
      </h2>

      {/* Avatar Upload */}
      <div className="flex items-center gap-4">
        <img
          src={avatar || 'https://via.placeholder.com/80'}
          alt="Avatar"
          className="w-20 h-20 rounded-full border shadow"
        />
        <label className="cursor-pointer text-bluecol font-medium flex items-center gap-2">
          <Upload size={16} /> Change Avatar
          <input type="file" className="hidden" onChange={handleAvatarChange} />
        </label>
      </div>

      {/* Email Input */}
      <div>
        <label className="text-sm text-gray-600">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          className="w-full mt-1 p-2 border rounded text-sm"
        />
      </div>

      {/* Phone Input */}
      <div>
        <label className="text-sm text-gray-600">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 9876543210"
          className="w-full mt-1 p-2 border rounded text-sm"
        />
      </div>

      {/* Password Input */}
      <div>
        <label className="text-sm text-gray-600">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-2 border rounded text-sm pr-10"
            placeholder="••••••••"
          />
          <span
            className="absolute right-3 top-[38%] cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </span>
        </div>
        <p className={`text-xs mt-1 ${
          passwordStrength(password) === 'Strong'
            ? 'text-green-600'
            : passwordStrength(password) === 'Medium'
            ? 'text-yellow-600'
            : 'text-red-600'
        }`}>
          Strength: {passwordStrength(password)}
        </p>
      </div>

      {/* 2FA Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={enable2FA}
          onChange={() => setEnable2FA(!enable2FA)}
          className="accent-bluecol"
        />
        <label className="text-sm text-gray-700 flex items-center gap-2">
          <ShieldCheck size={16} /> Enable 2-Factor Authentication
        </label>
      </div>

      {/* 2FA Section */}
      {enable2FA && (
        <div className="bg-[#F0F9FF] p-3 rounded border border-bluecol text-sm">
          <p className="mb-2">Scan the QR code using your authenticator app.</p>
          <img
            src="https://via.placeholder.com/150"
            alt="QR Code"
            className="w-32 h-32"
          />
          <p className="mt-2 text-gray-500">Once scanned, enter the OTP to verify.</p>
          <input
            type="text"
            placeholder="Enter OTP"
            className="mt-2 w-full border p-2 rounded"
          />
        </div>
      )}

      {/* Save Button (Optional for now) */}
      <div className="pt-4">
        <button className="bg-bluecol text-white px-4 py-2 rounded hover:opacity-90">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default S1Profile;
