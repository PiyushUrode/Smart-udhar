import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo/logo_hr.png';
import lockImage from '../assets/login/login side img.webp';
import icon from '../assets/login/icon.webp';
import toast, { Toaster } from 'react-hot-toast';

const inputClass = "bg-white text-gray-700 border border-blue-500 rounded-md shadow-sm px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-300";

const SignupPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Registered successfully!");
    // toast.error("Something went wrong!");
  };

  return (
    <div className="min-h-screen bg-[#F6F8FA] flex flex-col">
      




        <header className="login-header">
              <Link to="/">
                <img src={logo} alt="Logo" className="logo" />
              </Link>
              <div className="login-header-right">
                <span>Don't have an account?</span>
                <Link to="/login">
                  <button className="signup-btn">Login </button>
                </Link>
              </div>
            </header>

      {/* Main */}
      <main className="flex flex-col md:flex-row flex-1">
        {/* Left Illustration */}
        <div className="hidden md:flex w-1/2 justify-center items-center p-8">
          <img src={lockImage} alt="Illustration" className="max-w-full h-auto" />
        </div>

        {/* Signup Form */}
        <div className="w-full md:w-1/2 flex justify-center items-center px-4 py-10">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <img src={icon} alt="icon" className="h-10" />
            </div>
            <h2 className="text-2xl font-semibold text-center text-black mb-1">Create Account</h2>
            <p className="text-sm text-center text-gray-600 mb-6">Please fill in the details to sign up</p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <input type="text" required placeholder="John" className={inputClass}  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <input type="text" required placeholder="Doe" className={inputClass} />
                </div>
              </div> */}


{/* email */}
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input type="email" required placeholder="example@mail.com" className={inputClass} />
              </div>

{/* mobile number */}
              <div>
                <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                <div className="flex ">
                  <div className='flex bg-white border text-black border-blue-500 rounded-md shadow-sm items-center border border-blue-500  mr-2'>  
                  <select className="  bg-white text-sm px-2 py-2 rounded-md">
                    <option value="+91">+91</option>
                  </select>
                  </div>
                  <input type="tel" placeholder="1234567890" className={`${inputClass} w-3/4`} required />
                </div>
              </div>
{/* password */}
              <div className="grid grid-cols-1  gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <input type="password" required placeholder="********" className={inputClass} />
                </div>
                {/* <div>
                  <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                  <input type="password" required placeholder="********" className={inputClass} />
                </div> */}
              </div>



              <div className="flex items-start gap-2">
                <input type="checkbox" required className="mt-1" />
                <label className="text-sm text-gray-600">
                  I agree to the <a href="#" className="text-blue-600 underline">Terms</a> & <a href="#" className="text-blue-600 underline">Privacy Policy</a>
                </label>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                Register
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
