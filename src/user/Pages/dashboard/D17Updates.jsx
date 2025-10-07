import React from "react";
import { CheckCircle2, AlertCircle, Rocket } from "lucide-react";

const D17Updates = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 mt-6">
      {/* Header */}
      <div className="text-center mb-8">
        <Rocket size={40} className="mx-auto text-indigo-600 mb-3" />
        <h1 className="text-3xl font-semibold mb-2">Smart Udhar — MVP Release 🚀</h1>
        <p className="text-gray-500 text-sm">
          Our <span className="font-medium">first version</span> is live with the core features needed to enter the market!
        </p>
      </div>

      {/* Version Details */}
      <div className="bg-white shadow-md rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Version Info</h2>
          <span className="text-sm text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-full">
            v1.0.0 — MVP Build
          </span>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">
          We are entering the market with a <strong>Minimum Viable Product (MVP)</strong> that focuses on basic but
          powerful tools for small businesses: <span className="font-medium">Inventory Management, Billing,</span> and
          <span className="font-medium"> Credit Score generation.</span>  
          This release will help us test the core system before expanding into automation and advanced features.
        </p>
      </div>

      {/* Features Section */}
      <div className="bg-white shadow-md rounded-2xl border border-gray-100 p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">✅ Core Features (Ready & Tested)</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-gray-700">
          <li className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-600" /> User Registration
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-600" /> Product Creation
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-600" /> Customer Creation
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-600" /> Invoice Creation
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-600" /> Credit Score Generation
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-600" /> Report Generate
          </li>
        </ul>
      </div>

      {/* Upcoming Features */}
      <div className="bg-white shadow-md rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">🕓 Upcoming</h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-center gap-2">
            <AlertCircle size={18} className="text-yellow-500" /> Notification System (Automatic)
          </li>
          <li className="flex items-center gap-2">
            <AlertCircle size={18} className="text-yellow-500" /> Multi-language Website (local launch only)
          </li>
        </ul>
      </div>

      {/* Footer */}
      <p className="text-center text-gray-400 text-xs mt-8">
        Smart Udhar © {new Date().getFullYear()} — Building simple tools for smarter business 💼
      </p>
    </div>
  );
};

export default D17Updates;
