// src/pages/SignupPage.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthService } from "../api/authservice.js"; // 🔹 API service layer
import { useAuth } from "../context/useAuth.js"; // 🔹 to access login & token setter
import logo from "../assets/logo/logo_hr.png";
import lockImage from "../assets/login/login side img.webp";
import icon from "../assets/login/icon.webp";
import { toast } from "react-toastify";

const SignupPage = () => {
  // Local state for step handling
  const [step, setStep] = useState("phone"); // phone | otp
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  // From Auth Context → login() will set token + storeProfileId
  const { login } = useAuth();

  /**
   * Step 1: Request OTP
   */
  // const handleGetOtp = async () => {
  //   if (phone.length !== 10) {
  //     return toast.error("Enter a valid 10-digit number");
  //   }
  //   try {
  //     console.log("[Signup] Sending OTP to:", phone);
  //     const res = await AuthService.register(phone); // 🔹 call API
  //     toast.success(res.message || "OTP sent!");
  //     console.log("[Signup] OTP response:", res);
  //     setStep("otp");
  //   } catch (err) {
  //     console.error("[Signup] OTP error:", err);
  //     toast.error(err.message || "Failed to send OTP");
  //   }
  // };


const handleGetOtp = async () => {
  if (phone.length !== 10) {
    return toast.error("Enter a valid 10-digit number");
  }
  try {
    console.log("[Signup] Sending OTP to:", phone);
    const res = await AuthService.register(phone);

    console.log("[Signup] OTP response:", res);

    // Success message
    toast.success(res.message || "OTP sent!");


    if (res?.mobile_otp) {
      toast.info(`Your OTP is: ${res.mobile_otp}`, { autoClose: 5000 });
    } else {
      console.warn("⚠️ No OTP found in response:", res);
    }

    setStep("otp");
  } catch (err) {
    console.error("[Signup] OTP error:", err);
    toast.error(err.message || "Failed to send OTP");
  }
};




  /**
   * Step 2: Verify OTP
   */
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return toast.error("Enter 6-digit OTP");
    try {
      console.log("[Signup] Verifying OTP:", otp);
      // 🔹 Call API → verify user
      const res = await AuthService.verify(phone, otp);

      // 🔹 Save token + store info in context
      await login(phone, otp); 

      toast.success(res.message || "OTP verified successfully!");
      console.log("[Signup] Verify response:", res);

      // 🔹 If user has businesses → go to business list
      // else → redirect to create-business page
      if (res?.stores?.length > 0) {
        navigate("/dashboard/businessList");
      } else {
        navigate("/dashboard/createBusiness");
      }
    } catch (err) {
      console.error("[Signup] Verify error:", err);
      toast.error(err.message || "Invalid OTP");
    }
  };

  /**
   * OTP input handling
   */
const handleOtpChange = (e, index) => {
  const value = e.target.value.replace(/\D/, ""); // only digits
  if (!value) return;

  const newOtp = otp.split("");
  newOtp[index] = value;
  const updatedOtp = newOtp.join("");
  setOtp(updatedOtp);

  // Auto focus to next input
  if (index < 5 && value) {
    document.getElementById(`otp-${index + 1}`)?.focus();
  }
};

const handleKeyDown = (e, index) => {
  if (e.key === "Backspace") {
    const newOtp = otp.split("");
    newOtp[index] = "";
    setOtp(newOtp.join(""));
    if (index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
  }
};


  return (
    <div className="login-wrapper" style={{ minHeight: "100vh" }}>
      {/* Header */}
      <header className="login-header">
        <Link to="/"><img src={logo} alt="Logo" className="logo" /></Link>
        <div className="login-header-right">
          <span>Already have an account?</span>
          <Link to="/login"><button className="signup-btn">Login</button></Link>
        </div>
      </header>

      {/* Main */}
      <main className="login-main flex flex-col md:flex-row">
        <div className="login-left"><img src={lockImage} alt="Illustration" className="lock-img" /></div>
        <div className="login-form-container">
          <div className="login-card">
            <div className="icon-placeholder"><img src={icon} alt="" /></div>
            <div>
              <h2 className="l-head">Welcome Signup</h2>
              <p className="l-para">Enter your mobile number to get started</p>
            </div>

            {/* Step 1: Phone input */}
            {step === "phone" && (
              <>
                <div className="phone-input">
                  <select><option value="+91">+91</option></select>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Enter mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <button className="btn otp" onClick={handleGetOtp}>Get OTP</button>
              </>
            )}

            {/* Step 2: OTP input */}
            {step === "otp" && (
              <>
                <div className="flex space-x-3 justify-center mt-4">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={otp[index] || ""}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-10 h-10 rounded-xl text-center text-lg outline-none border bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 border-blue-500"
                    />
                  ))}
                </div>
                <button className="btn otp mt-5" onClick={handleVerifyOtp}>
                  Confirm OTP
                </button>
              </>
            )}

            <p className="terms mt-8">
              By continuing, you agree to our{" "}
              <a href="#">Terms of Service</a> &{" "}
              <a href="#">Privacy Policy</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
