import React, { useState } from 'react';
import { CircleChevronDown } from 'lucide-react';
import { CirclePlus } from 'lucide-react';
import { FaPlusCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import Button from "../../common/Button.jsx"
   import { FaUpload } from "react-icons/fa6";
const D2BasicDetails = () => {

const [isOpen, setIsOpen] = useState(false); // Default is closed

const [popupType, setPopupType] = useState(null); 
// null = no popup, "success", "error", "processing", "complete"


  const [formData, setFormData] = useState({
    businessName: '',
    gstNumber: '',
    address: '',
    pincode: '', 
    mobile: '',
    email: '',
    bio: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = (e) => {
  e.preventDefault();

  // List of required fields (you can add/remove as needed)
  const requiredFields = ["businessName", "address", "pincode", "mobile", "email", "bio"];

  // Check for empty fields
  const hasEmptyField = requiredFields.some((field) => formData[field].trim() === "");

  if (hasEmptyField) {
    setPopupType("error"); // show error popup
    return;
  }

  // Show processing first
  setPopupType("processing");

  // Simulate API call delay
  setTimeout(() => {
    // Simulate success (true) or fail (false)
    const isOk = true;
    if (isOk) {
      setPopupType("success");
    } else {
      setPopupType("error");
    }
  }, 1500);
};


  return (
    <div className=" bg-[#FAFAFA] py-10 px-4">
      <div className="max-w-3xl mx-auto bg-[#FFFFFF] rounded-xl  shadow-[0px_10px_15px_0px_#0000001A] p-0 md:p-4">
       <div className='flex flex-row justify-center items-center align-middle justify-between max-w-3xl p-2 md:pr-10  w-full'>  
        <div className=" text-[#374151] text-sm lg:text-xl font-robotoB  py-3 px-1 rounded-t-xl">
          Business Profile
        </div>
        {/* <div className='text-sm  lg:text-base font-semibold text-[#374151] flex flex-row  gap-3 justify-center items-center '> Add Bussiness <FaPlusCircle color='blue' /> </div> */}
</div>

 <div className='flex flex-row justify-center items-center align-middle justify-between max-w-3xl p-2 pr-10 bg-lightbluecol  w-full rounded-xl'>  
        <div className=" text-white text-base md:text-lg font-semibold py-3 px-6 rounded-t-xl">
          Basic Information
        </div>
         {/* <div className='text-base font-semibold text-white flex flex-row  gap-3 justify-center items-center '>  <IoIosArrowDown color='white' className='w-10 h-7'  /> </div> */}
</div>


        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <section>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-1 block">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2  outline-none  bg-white"
                />
              </div>

              <div>
                <label className="text-sm mb-1 block">
                  GST Number <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2  outline-none bg-white"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm mb-1 block">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                className="w-full border rounded px-3 py-2  outline-none bg-[#FAFAFA]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm mb-1 block">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2  outline-none bg-white"
                />
              </div>

              <div>
                <label className="text-sm mb-1 block">Mobile 1</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2  outline-none bg-white"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2  outline-none bg-white"
              />
            </div>

            <div className="mt-4">
              <label className="text-sm mb-1 block ">
                Short Bio <span className="text-xs text-gray-500">(160 words max)</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded px-3 py-2  outline-none bg-white"
              />
            </div>

          </section>


          {/* dropdown start*/}

 <section>
        <div className="flex flex-row justify-between items-center max-w-3xl p-4 align-middle  rounded-lg bg-bluecol">
          <h2 className="font-semibold text-sm text-white mb-2">Detailed Information</h2>
          <div
            className="cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <CircleChevronDown
              className={`transition-transform duration-300 text-white ${
                isOpen ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </div>
        </div>
      </section>


{isOpen && (
  <section>
    <div className="max-w-4xl mx-auto    bg-white rounded-xl   rounded-t-md shadow-lg space-y-6">
      


      {/* Section 2: Extended Details */}
      <div>
        

        <div className="   space-y-4">
  <label className="text-sm mb-1 block">
Industries Type
              </label>
          <select className="input bg-white text-[#B9B9B9]  w-full">
            <option>Select Industry</option>
          </select>


<label className="text-sm mb-1 block">
Social Media Link
              </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Facebook */}
  <div className="flex items-center bg-white border p-2 rounded-md px-3">
    <FaFacebookF className="text-gray-500 mr-3" color='#2563EB' />
    <input
      type="text"
      placeholder="Facebook URL"
      className="bg-transparent outline-none w-full"
    />
  </div>

  {/* Twitter */}
  <div className="flex items-center bg-white border p-2 rounded-md px-3">
    <FaTwitter className="text-gray-500 mr-3" color='#2563EB' />
    <input
      type="text"
      placeholder="Twitter URL"
      className="bg-transparent outline-none w-full"
    />
  </div>

  {/* LinkedIn */}
  <div className="flex items-center bg-white border p-2 rounded-md px-3">
    <FaLinkedinIn className="text-gray-500 mr-3" color='#2563EB' />
    <input
      type="text"
      placeholder="LinkedIn URL"
      className="bg-transparent outline-none w-full"
    />
  </div>

  {/* Instagram */}
  <div className="flex items-center bg-white border p-2 rounded-md px-3">
    <FaInstagram className="text-gray-500 mr-3" color='#DB2777' />
    <input
      type="text"
      placeholder="Instagram URL"
      className="bg-transparent outline-none w-full"
    />
  </div>
</div>
 
 <label className="text-sm mb-1 block">
Website              </label>
          <input type="text" placeholder="" className="input bg-white w-full" />

          {/* File Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>  
             <label className="text-sm mb-1 block">
Signature Upload       </label>
            <div className="border border-dashed p-6 rounded-md text-center text-gray-500 bg-white ">
           
<div className='w-full justify-center flex'>             <FaUpload color="#6B7280" className='w-5 h-5' /></div>
              <p>Drag and drop your <br/> signature image here or</p>
              <button className="mt-2 px-4 py-2 text-xs md:text-sm bg-gray-200 rounded">Browse Files</button>
            </div>
            </div>
 

 <div>  
               <label className="text-sm mb-1 block">
Bussiness logo Upload       </label>

            <div className="border border-dashed p-6 rounded-md text-center text-gray-500 bg-white ">
<div className='w-full justify-center flex'>             <FaUpload color="#6B7280" className='w-5 h-5' /></div>
              <p >Drag and drop your <br/> logo here or</p>
              <button className="mt-2 px-4 py-2 text-xs md:text-sm bg-gray-200 rounded">Browse Files</button>
            </div>
          </div>
          </div>


        </div>
      </div>
    </div>
  </section>
)}


          {/* dropdown end */}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded  hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-bluecol text-white rounded hover:bg-blue-700 transition"
            >
              Save Changed
            </button>
          </div>
        </form>
      </div>
  
{popupType && (
  <Button
    type={popupType}
    onClose={() => setPopupType(null)}
  />
)}
    </div>

);
};



export default D2BasicDetails