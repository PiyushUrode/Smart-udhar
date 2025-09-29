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
 <div className="h-screen overflow-y-hidden flex flex-col bg-[linear-gradient(115.57deg,#5BA0F9_3.68%,#77C2FB_24.82%,#6F88FC_45.17%,#BCD4FA_62.05%,#D2E5F4_90.54%)] md:bg-[linear-gradient(115.57deg,#5BA0F9_3.68%,#77C2FB_24.82%,#6F88FC_45.17%,#BCD4FA_62.05%,#D2E5F4_90.54%)] sm:bg-white">
  {/* Header */}
  <header className="flex justify-between items-center bg-white px-5 md:px-12 py-3 gap-3 md:gap-10">
    <Link to="/">
      <img src={logo} alt="Logo" className="w-[149px] md:w-[130px] sm:w-[100px] h-auto" />
    </Link>
    <div className="flex items-center gap-5 md:gap-5 sm:gap-2">
      <span className="hidden sm:inline text-gray-600 text-base">Don't have an account?</span>
      <Link to="/signup">
        <button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-sm md:text-base font-semibold px-4 py-2 rounded-md shadow hover:opacity-90">
          Sign Up
        </button>
      </Link>
    </div>
  </header>

  {/* Main */}
  <main className="flex flex-col md:flex-row items-center justify-center px-5 md:px-12 lg:px-16 py-10 md:py-20 max-w-[1079px] mx-auto w-full ">
    {/* Left Side Image */}
    <div className="hidden md:block flex-1 text-center">
      <img src={lockImage} alt="Illustration" className="w-full h-auto rounded-l-lg" />
    </div>

    {/* Right Form */}
    <div className="flex-1 flex justify-center  ">
      <div className="bg-white rounded-xl shadow-md max-w-[554px] w-full p-4  md:p-14 py-10 flex flex-col gap-6 text-center">
        {/* Icon */}
        <div className="flex justify-center ">
          <img src={icon} alt="icon" className="w-9 h-9" />
        </div>

        {/* Heading */}
        <div>
                    <h2 className="text-[30px] sm:text-2xl  mb-1"> <span className="font-robotoSb navbar-login-text "> Login</span></h2>
          <h2 className="text-[30px] sm:text-2xl font-normal font-interR mb-1">Welcome Back</h2>
          <p className="text-[#525252] text-xs sm:text-sm font-normal font-interR">Please Enter Your Details to Login</p>
        </div>

        {/* Phone Step */}
        {step === "phone" && (
          <>
            <div className="flex flex-row gap-3 mb-4 ">
         <div className="flex flex-row gap-1 w-full">
                  <div className="flex w-[70px] md:w-16">
                <select className="border border-[#E5E5E5] rounded-md px-3 py-2 bg-white ">
                <option value="+91">+91</option>
              </select>
        
        </div>
              <input
                type="tel"
                maxLength={10}
                placeholder="Enter mobile number"
                value={phone}
                onChange={handlePhoneChange}
                onKeyDown={(e) => handleKeyDown(e)}
                ref={phoneRef}
                className="flex-1 border border-[#E5E5E5] rounded-md px-3 py-2 bg-white"
              />
            </div>
            </div>

            <button
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-medium rounded-lg shadow hover:opacity-90 disabled:opacity-50"
              onClick={handleGetOtp}
              disabled={loading}
            >
              {loading ? "Sending..." : "Get OTP"}
            </button>
          </>
        )}

        {/* OTP Step */}
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
                  className="w-12 h-12 md:w-14 md:h-14 rounded-xl text-center text-lg outline-none border bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 border-gray-400 shadow-sm"
                />
              ))}
            </div>
            <button
              className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Confirm"}
            </button>
          </>
        )}

        {/* Terms */}
        <div className="mt-6 text-sm text-gray-600">
          <p>By continuing, you agree to our</p>
          <p>
            <a href="#" className="underline">Terms of Service</a> &{" "}
            <a href="#" className="underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  </main>
</div>
 );
};

export default LoginPage;
