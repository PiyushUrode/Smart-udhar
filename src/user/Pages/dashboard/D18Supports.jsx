import React from "react";
import { Mail, Phone, LifeBuoy, MessageCircle } from "lucide-react";

const D18Supports = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 mt-6">
      {/* Header */}
      <div className="text-center mb-8">
        <LifeBuoy size={40} className="mx-auto text-indigo-600 mb-3" />
        <h1 className="text-3xl font-semibold mb-2">Support & Help</h1>
        <p className="text-gray-500 text-sm">
          We're here to help you! Reach out to us with any questions, issues, or feedback.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center border border-gray-100">
          <Mail size={24} className="text-indigo-600 mb-2" />
          <h3 className="font-semibold mb-1">Email Support</h3>
          <p className="text-gray-600 text-sm">support@smartudhar.com</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center border border-gray-100">
          <Phone size={24} className="text-indigo-600 mb-2" />
          <h3 className="font-semibold mb-1">Call Us</h3>
          <p className="text-gray-600 text-sm">+91 98765 43210</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center border border-gray-100">
          <MessageCircle size={24} className="text-indigo-600 mb-2" />
          <h3 className="font-semibold mb-1">Live Chat</h3>
          <p className="text-gray-600 text-sm">Chat with our support team directly</p>
        </div>
      </div>

      {/* FAQ Section */}
      {/* <div className="bg-white shadow-md rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <ul className="space-y-3 text-gray-700">
          <li>
            <strong>Q:</strong> How do I reset my password? <br />
            <strong>A:</strong> Go to the login page and click “Forgot Password” to reset it.
          </li>
          <li>
            <strong>Q:</strong> Can I track my invoice history? <br />
            <strong>A:</strong> Yes! Go to the Reports section to view past invoices and summaries.
          </li>
          <li>
            <strong>Q:</strong> How do I update my profile information? <br />
            <strong>A:</strong> Visit your Profile page and click “Edit” to make changes.
          </li>
        </ul>
      </div> */}

      {/* Submit Ticket */}
      <div className="bg-white shadow-md rounded-2xl border border-gray-100 p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Need More Help?</h2>
        <p className="text-gray-600 mb-4">Submit a support ticket and we’ll get back to you ASAP.</p>
        <button title="Working in" disabled="true" className="bg-indigo-600 text-white px-6 py-2.5 rounded-md hover:bg-indigo-700 transition flex items-center gap-2 mx-auto">
          <LifeBuoy size={18}  /> Submit Ticket
        </button>
      </div>

      <p className="text-center text-gray-400 text-xs mt-8">
        Smart Udhar © {new Date().getFullYear()} — We are committed to helping you succeed 💙
      </p>
    </div>
  );
};

export default D18Supports;
