import React, { useState, useEffect } from "react";

import {
  MessageCircle,
  CreditCard,
  Banknote,
  Settings,
  FileText,
  AlarmClock,
  HelpCircle,
  Upload
} from 'lucide-react';
import { FaRegSave } from "react-icons/fa";
import { FaSearch,  } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaSms } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { FaQuestionCircle } from "react-icons/fa";
// IoLogoWhatsapp , MdEmail , FaQuestionCircle
import SettingsService from "../../api/GeneralSetting.js";
const inputClasses = "bg-[#F6F8FA] px-3 py-2 border border-gray-300 rounded-md text-sm w-full";


const SettingsPage = () => {
  const [isChecked, setIsChecked] = useState(false);
  const toggleCheckbox = () => setIsChecked((prev) => !prev);

  // ---------------- States ----------------
  const [generalSettings, setGeneralSettings] = useState({
    businessName: "",
    timeZone: "",
    currency: "",
    language: "",
  });

  const [paymentSetup, setPaymentSetup] = useState({
    upi_id: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
  });

  const [invoiceSettings, setInvoiceSettings] = useState({
    paperSize: "",
    templateTheme: "",
    businessLogo: "",
    defaultTerms: "",
  });

  // IDs (when already created)
  const [ids, setIds] = useState({
    generalId: null,
    paymentId: null,
    invoiceId: null,
  });

  // ---------------- Fetch Existing Data ----------------
useEffect(() => {
  const fetchData = async () => {
    try {
      // 🔹 Fetch existing General Settings
      const general = await SettingsService.getGeneralSettings();
      if (general?._id) {
        setIds((prev) => ({ ...prev, generalId: general._id }));
        setGeneralSettings({
          businessName: general.businessName || "",
          timeZone: general.timeZone || "",
          currency: general.currency || "",
          language: general.language || "",
        });
      }

      // 🔹 Fetch existing Payment Setup
      const payment = await SettingsService.getPaymentSetup();
      if (payment?._id) {
        setIds((prev) => ({ ...prev, paymentId: payment._id }));
        setPaymentSetup({
          upi_id: payment.upi_id || "",
          accountHolderName: payment.accountHolderName || "",
          accountNumber: payment.accountNumber || "",
          ifscCode: payment.ifscCode || "",
          bankName: payment.bankName || "",
        });
      }

      // 🔹 Fetch existing Invoice Settings
      const invoice = await SettingsService.getInvoiceTemplateSettings();
      if (invoice?._id) {
        setIds((prev) => ({ ...prev, invoiceId: invoice._id }));
        setInvoiceSettings({
          paperSize: invoice.paperSize || "",
          templateTheme: invoice.templateTheme || "",
          businessLogo: invoice.businessLogo || "",
          defaultTerms: invoice.defaultTerms || "",
        });
      }
    } catch (err) {
      console.error("❌ Error fetching previous settings:", err);
    }
  };

  fetchData();
}, []);

  // ---------------- Save Handler ----------------
// ---------------- Save Handler ----------------
const handleSave = async () => {
  try {
    // General
    if (ids.generalId) {
      await SettingsService.updateGeneralSettings(
        ids.generalId,
        generalSettings
      );
      const updated = await SettingsService.getGeneralSettingsById(ids.generalId);
      setGeneralSettings(updated.data);
    } else {
      const res = await SettingsService.createGeneralSettings(generalSettings);
      setIds((prev) => ({ ...prev, generalId: res.data._id }));
      setGeneralSettings(res.data); // ✅ show newly created immediately
    }

    // Payment 
    if (ids.paymentId) {
      await SettingsService.updatePaymentSetup(ids.paymentId, paymentSetup);
      const updated = await SettingsService.getPaymentSetupById(ids.paymentId);
      setPaymentSetup(updated.data);
    } else {
      const res = await SettingsService.createPaymentSetup(paymentSetup);
      setIds((prev) => ({ ...prev, paymentId: res.data._id }));
      setPaymentSetup(res.data);
    }

    // Invoice
    if (ids.invoiceId) {
      await SettingsService.updateInvoiceTemplateSettings(
        ids.invoiceId,
        invoiceSettings
      );
      const updated = await SettingsService.getInvoiceTemplateSettingsById(ids.invoiceId);
      setInvoiceSettings(updated.data);
    } else {
      const res = await SettingsService.createInvoiceTemplateSettings(invoiceSettings);
      setIds((prev) => ({ ...prev, invoiceId: res.data._id }));
      setInvoiceSettings(res.data);
    }

    alert("✅ Settings saved successfully");
  } catch (err) {
    console.error("Save failed:", err);
    alert("❌ Failed to save settings");
  }
};


  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-sm">
      {/* Page Heading */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Settings</h1>

      {/* 1. SMS Credits Section */}
      <div className="bg-white border shadow-sm rounded-lg p-5 space-y-6">
        <div className="flex items-center gap-2 text-[#374151] font-semibold text-base">
          <FaSms className="w-5 h-5 text-blue-600" />
          SMS Credits & Communication Settings
        </div>

        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          {/* Left - SMS Credits */}
          <div className="w-full md:w-1/2">
            <div className="bg-[#EFF6FF] p-4 rounded-md flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Available SMS Credits</p>
                <p className="text-2xl font-bold text-blue-700">250</p>
              </div>
            </div>
            <button className="mt-3 bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 transition">
              + Buy More Credits (₹10)
            </button>
          </div>

          {/* Right - Notification Preferences */}
          <div className="space-y-3 text-gray-800 w-full md:w-1/2">
            <p className="font-medium">Notification Preferences</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="appearance-none h-5 w-5 border-2 border-gray-700 rounded-sm checked:bg-white checked:border-white checked:after:content-['✔'] checked:after:text-blue-500 checked:after:block checked:after:text-center" />
                WhatsApp (Verified)
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="appearance-none h-5 w-5 border-2 border-gray-700 rounded-sm checked:bg-white checked:border-white checked:after:content-['✔'] checked:after:text-blue-500 checked:after:block checked:after:text-center" />
                SMS Reminder
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm">Daily Reminder Limit:</span>
                <select className="border px-2 py-1 rounded text-sm bg-white">
                  {[1, 2, 5, 10, 20, 30, 50].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Payment Setup */}
      {/* 2. Payment Setup */}
      <div className="bg-white border shadow-sm rounded-lg p-5 space-y-5">
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-base">
          <CreditCard className="w-5 h-5" />
          Payment Setup
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm mb-1 block font-semibold">UPI ID</label>
            <input
              placeholder="UPI ID"
              className={inputClasses}
              value={paymentSetup.upi_id}
              onChange={(e) =>
                setPaymentSetup({ ...paymentSetup, upi_id: e.target.value })
              }
            />
          </div>
          <div>
            <h1 className="text-sm mb-1 block font-semibold">Bank Details</h1>
            <div className="flex flex-col gap-5">
              <input
                placeholder="Account Holder Name"
                className={inputClasses}
                value={paymentSetup.accountHolderName}
                onChange={(e) =>
                  setPaymentSetup({
                    ...paymentSetup,
                    accountHolderName: e.target.value,
                  })
                }
              />
              <input
                placeholder="Account Number"
                className={inputClasses}
                value={paymentSetup.accountNumber}
                onChange={(e) =>
                  setPaymentSetup({
                    ...paymentSetup,
                    accountNumber: e.target.value,
                  })
                }
              />
              <input
                placeholder="IFSC Code"
                className={inputClasses}
                value={paymentSetup.ifscCode}
                onChange={(e) =>
                  setPaymentSetup({
                    ...paymentSetup,
                    ifscCode: e.target.value,
                  })
                }
              />
              <input
                placeholder="Bank Name"
                className={inputClasses}
                value={paymentSetup.bankName}
                onChange={(e) =>
                  setPaymentSetup({
                    ...paymentSetup,
                    bankName: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. General Settings */}
     <div className="bg-white border shadow-sm rounded-lg p-5 space-y-5">
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-base">
          <Settings className="w-5 h-5 text-[#374151]" />
          <h1 className="text-[#374151]">General Settings</h1>
        </div>
        <div className="flex flex-row justify-between gap-5 w-full ">
          <div className="flex flex-col gap-3 w-full md:w-1/2">
            <label className="text-sm block font-semibold">Business Name</label>
            <input
              placeholder="Your Business Name"
              className={inputClasses}
              value={generalSettings.businessName}
              onChange={(e) =>
                setGeneralSettings({
                  ...generalSettings,
                  businessName: e.target.value,
                })
              }
            />
            <label className="text-sm block font-semibold">Time Zone</label>
            <select
              className={inputClasses}
              value={generalSettings.timeZone}
              onChange={(e) =>
                setGeneralSettings({
                  ...generalSettings,
                  timeZone: e.target.value,
                })
              }
            >
              <option value="">Time Zone</option>
              <option value="IST">IST</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-1/2">
            <label className="text-sm block font-semibold">
              Currency Format
            </label>
            <select
              className={inputClasses}
              value={generalSettings.currency}
              onChange={(e) =>
                setGeneralSettings({
                  ...generalSettings,
                  currency: e.target.value,
                })
              }
            >
              <option value="">Currency Format</option>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </select>
            <label className="text-sm block font-semibold">Language</label>
            <select
              className={inputClasses}
              value={generalSettings.language}
              onChange={(e) =>
                setGeneralSettings({
                  ...generalSettings,
                  language: e.target.value,
                })
              }
            >
              <option value="">Language</option>
              <option value="EN">English</option>
              <option value="HI">Hindi</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Invoice Customization */}
      <div className="bg-white border shadow-sm rounded-lg p-5 space-y-5">
        <div className="flex items-center gap-2 text-black font-semibold text-base">
          <FileText className="w-5 h-5 text-purple-600" />
          Invoice Customization
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <label className="text-md text-gray-600 ">Paper Size </label>
              <input
                placeholder="Paper Size"
                className={inputClasses}
                value={invoiceSettings.paperSize}
                onChange={(e) =>
                  setInvoiceSettings({
                    ...invoiceSettings,
                    paperSize: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-sm text-gray-600">Template Theme </label>
              <input
                placeholder="Template Theme"
                className={inputClasses}
                value={invoiceSettings.templateTheme}
                onChange={(e) =>
                  setInvoiceSettings({
                    ...invoiceSettings,
                    templateTheme: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col space-y-2">
              <label className="text-md text-gray-600">Business Logo</label>
              <button className="flex items-center gap-2 border bg-white px-3 py-2 rounded shadow-sm text-sm hover:bg-gray-50">
                <Upload className="w-4 h-4" /> Upload Logo
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-md text-gray-600">
                Default Terms/Notes
              </label>
              <input
                placeholder="Default Terms/Notes"
                className={inputClasses}
                value={invoiceSettings.defaultTerms}
                onChange={(e) =>
                  setInvoiceSettings({
                    ...invoiceSettings,
                    defaultTerms: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Payment Reminder Settings */}
      <div className="bg-white border shadow-sm rounded-lg p-5 space-y-5">
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-base">
          <FaClock 
 className="w-5 h-5 text-[#EA580C]" />
          <span className='text-black'>Payment Reminder Settings</span>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-2">
<label className="relative inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    checked={isChecked}
    onChange={toggleCheckbox}
    className="peer sr-only"
  />
  <span className="
    w-5 h-5 flex items-center justify-center 
    border-2 rounded-md text-white text-sm font-bold 
    transition-colors duration-200 
    border-gray-300 bg-white 
    peer-checked:bg-green-500 peer-checked:border-green-500
  ">
    {isChecked ? '✔' : ''}
  </span>
</label>

            Enable Auto Reminders
          </label>
          <div className="flex flex-wrap gap-6">
            {['On Due Date', '3 Days After Due', '7 Days Before Due'].map((label, idx) => (
              <label key={idx} className="flex items-center gap-2">
                <input type="radio" name="reminder" className="appearance-none h-5 w-5 border border-gray-300 rounded-sm checked:bg-white checked:border-white checked:after:content-['✔'] checked:after:text-blue-500 checked:after:block checked:after:text-center" />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Help & Support */}
      <div className="bg-white border shadow-sm rounded-lg p-5 space-y-5 ">
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-base">
          <HelpCircle className="w-5 h-5" />
          Help & Support
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <button className="bg-green-100 text-green-700 px-4 py-1.5 rounded text-sm font-medium flex flex-row gap-5 justify-center items-center">
            <IoLogoWhatsapp/>    
            WhatsApp Support
          </button>
          <button className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded text-sm font-medium flex flex-row gap-5 justify-center items-center">
            <MdEmail/>
            Email Support

          </button>
          <button className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded text-sm font-medium flex flex-row gap-5 justify-center items-center">
            <FaQuestionCircle/>
            
            FAQ
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="text-right pt-2 w-full justify-end align-middle items-end flex">
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium flex justify-end items-end  align-middle  gap-2 flex-row"  onClick={handleSave} >
         <FaRegSave />  Save All Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;