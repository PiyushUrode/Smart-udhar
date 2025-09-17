import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

import logo from "../assets/logo/logo_hr.png";
import lockImage from "../assets/login/login side img.webp";
import icon from "../assets/login/icon.webp";
import "../Styles/login.css";

const API_URL = import.meta.env.VITE_API_URL;


const LoginPage = () => {
  const [form, setForm] = useState({ mobile: "", otp: "" });
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  // 🔑 Replace with your actual token (from login/session storage etc.)
 
  const handleSendOtp = async () => {
    if (!form.mobile.trim()) {
      toast.error("Please enter your Mobile Number");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/admin-auth/login-otp`,
        {
          mobile: form.mobile,
          roles: "admin",
        }
      );
       setForm({ ...form, otp: res.data.mobile_otp })
      toast.success(res.data.message || "OTP sent successfully!");
      setOtpSent(true);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to send OTP. Try again."
      );
    }
  };

  const handleVerifyOtp = async () => {
    if (!form.otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/admin-auth/login-verify`,
        {
          mobile: form.mobile,
          mobile_otp: form.otp,
          roles: "admin",
        }
      );

      toast.success(res.data.message || "Login successful!");
      // Save token if backend returns one
      if (res.data.store_id) {
        localStorage.setItem("store_id", res.data.store_id);
      }
       if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
      }

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "OTP verification failed. Try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <header className="login-header">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <div className="login-header-right">
          <span>Don't have an account?</span>
        </div>
      </header>

      <main className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        <div className="hidden md:flex md:w-1/2 justify-center items-center bg-gray-50">
          <img src={lockImage} alt="Illustration" className="w-3/4 max-w-md" />
        </div>

        <div className="flex flex-1 justify-center items-center px-4 py-12">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <img src={icon} alt="icon" className="h-12" />
            </div>

            <h2 className="text-xl font-robotoM text-center mb-1">
              Welcome Back
            </h2>
            <p className="text-md font-robotoM text-center mb-6">
              Please enter your mobile number to login
            </p>

            {/* Mobile Number Field */}
            <input
              type="tel"
              placeholder="Enter Mobile Number"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              className="w-full mb-4 px-4 py-2 border-2 border-blue-200 rounded-lg text-black bg-white"
            />

            {/* OTP Section */}
            {otpSent && (
              <input
                type="text"
                placeholder="Enter OTP"
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value })}
                className="w-full mb-4 px-4 py-2 border-2 border-blue-200 rounded-lg text-black bg-white"
              />
            )}

            {/* Buttons */}
            {!otpSent ? (
              <button
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleSendOtp}
              >
                Send OTP
              </button>
            ) : (
              <button
                className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={handleVerifyOtp}
              >
                Verify & Login
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
