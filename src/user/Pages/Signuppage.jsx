// src/pages/SignupPage.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthService } from "../api/authservice.js";
import { useAuth } from "../context/useAuth.js";
import logo from "../assets/logo/logo_hr.png";
import lockImage from "../assets/login/login side img.webp";
import icon from "../assets/login/icon.webp";
import { toast } from "react-toastify";
import whatsapp from "../assets/login/whatsapp_icon.webp";
import callicon from "../assets/login/call_icon.webp";
import "../Styles/login.css";

const SignupPage = () => {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef([]);
  const phoneRef = useRef(null);

  const { login } = useAuth();

  // 🔹 Autofocus phone box initially
  useEffect(() => {
    phoneRef.current?.focus();
  }, []);

  // 🔹 Autofocus first OTP box when step changes to otp
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  // Send OTP
  const handleGetOtp = async () => {
    if (phone.length !== 10) {
      return toast.error("Enter a valid 10-digit number");
    }
    if (loading) return;
    setLoading(true);
    try {
      console.log("[Signup] Sending OTP to:", phone);
      const res = await AuthService.register(phone);
      toast.success(res.message || "OTP sent!");
      if (res?.mobile_otp) {
        toast.info(`Your OTP is: ${res.mobile_otp}`, { autoClose: 5000 });
      }
      setStep("otp");
    } catch (err) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return toast.error("Enter 6-digit OTP");
    if (loading) return;
    setLoading(true);
    try {
      const res = await AuthService.verify(phone, otp);
      toast.success(res.message || "OTP verified successfully!");
      if (res?.stores?.length > 0) {
        navigate("/dashboard/businessList");
      } else {
        navigate("/dashboard/bussinessList");
      }
    } catch (err) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 OTP input change
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ""); // only numbers
    const newOtp = otp.split("");

    if (value) {
      newOtp[index] = value;
      setOtp(newOtp.join(""));
      if (index < 5) otpRefs.current[index + 1]?.focus();
    } else {
      newOtp[index] = "";
      setOtp(newOtp.join(""));
    }
  };

  // 🔹 OTP key handling
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = otp.split("");
        newOtp[index] = "";
        setOtp(newOtp.join(""));
      } else if (index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "Enter") {
      step === "phone" ? handleGetOtp() : handleVerifyOtp();
    }
  };

  return (
    <div className="login-wrapper" style={{ minHeight: "100vh" }}>
      {/* Header */}
      <header className="login-header">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <div className="login-header-right">
          <span>Already have an account?</span>
          <Link to="/login">
            <button className="signup-btn">Login</button>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="login-main flex flex-col md:flex-row">
        <div className="login-left">
          <img src={lockImage} alt="Illustration" className="lock-img" />
        </div>
        <div className="login-form-container">
          <div className="login-card">
            <div className="icon-placeholder">
              <img src={icon} alt="" />
            </div>
            <div>
              <h2 className="l-head">Welcome Signup</h2>
              <p className="l-para">Enter your mobile number to get started</p>
            </div>

            <div>
              <button className="btn whatsapp">
                <img src={whatsapp} alt="" />
                Continue with WhatsApp
              </button>
              <button className="btn truecaller">
                <img src={callicon} alt="" />
                Continue with Truecaller
              </button>
            </div>

            {/* Step 1: Phone */}
            {step === "phone" && (
              <>
                <div className="phone-input">
                  <select>
                    <option value="+91">+91</option>
                  </select>
                  <input
                    ref={phoneRef}
                    type="tel"
                    maxLength={10}
                    placeholder="Enter mobile number"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleGetOtp()}
                  />
                </div>
                <button
                  className="btn otp"
                  onClick={handleGetOtp}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Get OTP"}
                </button>
              </>
            )}

            {/* Step 2: OTP */}
            {step === "otp" && (
              <>
                <div className="flex space-x-3 justify-center mt-4">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      inputMode="numeric"
                      value={otp[index] || ""}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-12 h-12 rounded-xl text-center text-lg outline-none border bg-white text-gray-700 
                        focus:ring-2 focus:ring-blue-500 border-gray-400 shadow-sm"
                    />
                  ))}
                </div>
                <button
                  className="btn otp mt-5 w-full py-3 font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Confirm OTP"}
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
