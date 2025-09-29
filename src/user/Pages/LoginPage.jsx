import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthService } from "../api/authservice.js";
import logo from "../assets/logo/logo_hr.png";
import lockImage from "../assets/login/login side img.webp";
import icon from "../assets/login/icon.webp";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const phoneRef = useRef(null);
  const otpRefs = useRef([]);

  // ✅ Auto-focus handling
  useEffect(() => {
    if (step === "phone" && phoneRef.current) {
      phoneRef.current.focus();
    }
    if (step === "otp" && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [step]);

  // Step 1: Send OTP
  const handleGetOtp = async () => {
    if (phone.length !== 10) {
      return toast.error("Enter a valid 10-digit number");
    }

    if (loading) return;
    setLoading(true);

    try {
      console.log("[login] Sending OTP to:", phone);
      const res = await AuthService.loginSendOtp(phone);

      toast.success(res.message || "OTP sent!");
      if (res?.mobile_otp) {
        toast.info(`Your OTP is: ${res.mobile_otp}`, { autoClose: 20000 });
      }

      setOtp(""); // clear old OTP
      setStep("otp");
    } catch (err) {
      console.error("[login] OTP error:", err);
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return toast.error("Enter 6-digit OTP");
    if (loading) return;

    setLoading(true);
    try {
      const res = await AuthService.loginVerify(phone, otp);
      toast.success("Login successful!");
      navigate("/dashboard/bussinessList");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Phone input sanitization
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.startsWith("0")) value = value.slice(1);
    if (value.length > 10) value = value.slice(0, 10);
    setPhone(value);
  };

  // OTP input handling
  // OTP change handler
const handleOtpChange = (e, index) => {
  const value = e.target.value.replace(/\D/, ""); // only digits allowed
  const newOtp = otp.split("");

  if (value) {
    // replace current digit with typed value
    newOtp[index] = value;
    setOtp(newOtp.join(""));

    // auto move to next box if not last
    if (index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  } else {
    // if input cleared manually
    newOtp[index] = "";
    setOtp(newOtp.join(""));
  }
};

// OTP keydown handler
const handleKeyDown = (e, index) => {
  if (e.key === "Backspace") {
    if (otp[index]) {
      // clear current box only
      const newOtp = otp.split("");
      newOtp[index] = "";
      setOtp(newOtp.join(""));
    } else if (index > 0) {
      // move left if already empty
      otpRefs.current[index - 1]?.focus();
    }
  } else if (e.key === "Enter") {
    // 🔹 Handle enter without mouse
    step === "phone" ? handleGetOtp() : handleVerifyOtp();
  }
};


  return (
    <div className="login-wrapper" style={{ minHeight: "100vh" }}>
      <header className="login-header">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <div className="login-header-right">
          <span>Don't have an account?</span>
          <Link to="/signup">
            <button className="signup-btn">Sign Up</button>
          </Link>
        </div>
      </header>

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
              <h2 className="l-head">Welcome Back</h2>
              <p className="l-para">Please enter your details to sign in</p>
            </div>

            {/* Step 1: Phone */}
            {step === "phone" && (
              <>
                <div className="phone-input">
                  <select>
                    <option value="+91">+91</option>
                  </select>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Enter mobile number"
                    value={phone}
                    onChange={handlePhoneChange}
                    onKeyDown={(e) => handleKeyDown(e)}
                    ref={phoneRef}
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
                <div
                  className="flex space-x-3 justify-center mt-4"
                  onPaste={(e) => {
                    const pasted = e.clipboardData.getData("Text").trim();
                    if (/^\d{6}$/.test(pasted)) {
                      setOtp(pasted);
                      otpRefs.current[5]?.focus();
                    }
                  }}
                >
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={otp[index] || ""}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      ref={(el) => (otpRefs.current[index] = el)}
                      className="w-12 h-12 md:w-14 md:h-14 rounded-xl text-center text-lg outline-none border bg-white text-gray-700 
                        focus:ring-2 focus:ring-blue-500 border-gray-400 shadow-sm"
                    />
                  ))}
                </div>

                <button
                  className="btn otp mt-6 w-full py-3 font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Confirm"}
                </button>
              </>
            )}

            <div>
              <p className="terms mt-8">By continuing, you agree to our</p>
              <p className="terms">
                <a href="#">Terms of Service</a> &{" "}
                <a href="#">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
