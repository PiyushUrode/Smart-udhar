import React from 'react';
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

const inputClasses = "bg-[#F6F8FA] px-3 py-2 border border-gray-300 rounded-md text-sm w-full";

import { useState } from 'react';

const SettingsPage = () => {
  const [isChecked, setIsChecked] = useState(false);
  const toggleCheckbox = () => setIsChecked((prev) => !prev);

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
      <div className="bg-white border shadow-sm rounded-lg p-5 space-y-5">
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-base">
          <CreditCard className="w-5 h-5" />
          Payment Setup
        </div>
        <div className="grid md:grid-cols-2 gap-4">
    <div>
    <div>
                           <label className="text-sm mb-1 block font-semibold">
                  UPI ID                 </label>
          <input placeholder="UPI ID" className={inputClasses} />
          </div>
    </div>
    <div>
          <div>
                           <h1 className="text-sm mb-1 block font-semibold">
                 Bank Details                 </h1>
                 <div className='flex flex-col gap-5'>   
          <input placeholder="Account Holder Name" className={inputClasses}  />
          <input placeholder="Account Number" className={inputClasses} />
          <input placeholder="IFSC Code" className={inputClasses} />
          <input placeholder="Bank Name" className={inputClasses} />
          </div>
          </div>
    </div>
      

 
        </div>
      </div>

      {/* 3. General Settings */}
      <div className="bg-white border shadow-sm rounded-lg p-5 space-y-5">
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-base">
          <Settings className="w-5 h-5 text-[#374151]" />
          <h1 className='text-[#374151]'>  General Settings</h1>
        </div>
        <div className="flex flex-row justify-between gap-5 w-full ">
          <div className='flex flex-col gap-3 w-full md:w-1/2'>  
  
                                     <label className="text-sm  block font-semibold">
                  Bussiness Name                 </label>
          <input placeholder="Your Business Name" className={inputClasses} />

                                               <label className="text-sm  block font-semibold">
               Time Zone             </label>
                    <select className={inputClasses}>
            <option>Time Zone</option>
          </select>


          </div>
         <div className='flex flex-col gap-3 w-full md:w-1/2'>  
                                              <label className="text-sm  block font-semibold">
                  Currency Format                </label>
          <select className={inputClasses}>
            <option>Currency Format</option>
          </select>
                                     <label className="text-sm  block font-semibold">
                  Language               </label>
          <select className={inputClasses}>
            <option>Language</option>
          </select>
          </div>
        </div>
      </div>

      {/* 4. Invoice Customization */}
      <div className="bg-white border shadow-sm rounded-lg p-5 space-y-5">
        <div className="flex items-center gap-2  text-black font-semibold text-base">
          <FileText className="w-5 h-5 text-purple-600" />
          Invoice Customization
        </div>
        <div className="grid md:grid-cols-2 gap-4">

<div className='flex flex-col gap-5'>     
  <div className='flex flex-col gap-3'>  
           <label className="text-md text-gray-600 " >Paper Size </label>
          <input placeholder="Paper Size" className={inputClasses} />
          </div>

          <div className='flex flex-col gap-3'> 
              <label className="text-sm text-gray-600">Template theme </label>
          <input placeholder="Template Theme" className={inputClasses} />
       </div>
         </div>
       <div className='flex flex-col gap-5'>  
          <div className="flex flex-col space-y-2">
            <label className="text-md text-gray-600">Business Logo</label>
            <button className="flex items-center gap-2 border bg-white px-3 py-2 rounded shadow-sm text-sm hover:bg-gray-50">
              <Upload className="w-4 h-4" /> Upload Logo
            </button>
          </div>
          <div className='flex flex-col gap-3'>   
            <label className="text-md text-gray-600">Default Terms/Notes</label>
          <input placeholder="Default Terms/Notes" className={inputClasses} />
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
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium flex justify-end items-end  align-middle  gap-2 flex-row">
         <FaRegSave />  Save All Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;

