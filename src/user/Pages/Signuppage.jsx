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
  const [error, setError] = useState("");

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

// ✅ Phone validation सिर्फ OTP भेजने के time पर check होगा
const validatePhone = (value) => {
  if (value.length !== 10) {
    setError("Mobile number must be exactly 10 digits");
    return false;
  }
  setError("");
  return true;
};

// Utility: Phone validation

// Step 1: Send OTP (Signup)
const handleGetOtp = async () => {
  if (!validatePhone(phone)) return; // stop if invalid
  if (loading) return;

  setLoading(true);
  try {
    console.log("[Signup] Sending OTP to:", phone);
    const res = await AuthService.register(phone);

    // ✅ Success
    toast.success(res.message || "OTP sent successfully!");
    if (res?.mobile_otp) {
      toast.info(`Your OTP is: ${res.mobile_otp}`, { autoClose: 5000 });
    }

    setOtp("");   // clear old OTP
    setStep("otp");
    setError(""); // clear error if success
  } catch (err) {
    console.error("[Signup] OTP error:", err);

    // ✅ Custom handling if already registered
    if (err?.response?.data?.message?.toLowerCase().includes("already")) {
      setError("This number is already registered. Please Login instead.");
    } else {
      setError(err.message || "Failed to send OTP");
    }
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
    <div className="h-screen overflow-y-hidden flex flex-col bg-[linear-gradient(115.57deg,#5BA0F9_3.68%,#77C2FB_24.82%,#6F88FC_45.17%,#BCD4FA_62.05%,#D2E5F4_90.54%)] md:bg-[linear-gradient(115.57deg,#5BA0F9_3.68%,#77C2FB_24.82%,#6F88FC_45.17%,#BCD4FA_62.05%,#D2E5F4_90.54%)] sm:bg-white">
      {/* Header */}
      <header className="flex justify-between items-center bg-white px-5 md:px-12 py-3 gap-3 md:gap-10">
        <Link to="/">
          <img src={logo} alt="Logo" className="w-[149px] md:w-[130px] sm:w-[100px] h-auto" />
        </Link>
        <div className="flex items-center gap-5 md:gap-5 sm:gap-2">
          <span className="hidden sm:inline text-gray-600 text-base">Already have an account?</span>
          <Link to="/login">
            <button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-sm md:text-base font-semibold px-4 py-2 rounded-md shadow hover:opacity-90">Login</button>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-col md:flex-row items-center justify-center px-5 md:px-12 lg:px-16 py-10  max-w-[1079px] mx-auto w-full">
       
            <div className="hidden md:block flex-1 text-center">
              <img src={lockImage} alt="Illustration" className="w-full h-auto rounded-l-lg" />
            </div>
        
        <div className="flex-1 flex justify-center">
          <div className="bg-white rounded-xl shadow-md max-w-[554px] w-full p-4  md:p-14 py-10 flex flex-col gap-2 text-center">
            <div className="flex justify-center ">
                     <img src={icon} alt="icon" className="w-9 h-9" />
                   </div>
            <div className="flex justify-center align-middle items-center flex-col  ">
           
          <h2 className="text-[30px] sm:text-2xl font-normal font-interR mb-1">Welcome SignUp</h2>
          <p className="text-[#525252] text-xs sm:text-sm font-normal font-interR">Enter your mobile number to get started</p>
            </div>

            <div className="flex flex-col gap-0 mt-2">
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
                          <div className="flex flex-row gap-3 my-3 ">  
                <div className="flex flex-row gap-1 w-full">
                  <div className="flex w-[80px] md:w-20">
                <select className="border border-[#E5E5E5] rounded-md px-3 py-2 bg-white ">
                <option value="+91">+91</option>
              </select>
        
        </div>
      
                  <input
                    ref={phoneRef}
                    type="tel"
                    maxLength={10}
                    placeholder="Enter mobile number"
                    value={phone}
                                    className="flex-1 border border-[#E5E5E5] rounded-md px-3 py-2 bg-white"
                   onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setPhone(val);
                        validatePhone(val);
                      }}
                    onKeyDown={(e) => e.key === "Enter" && handleGetOtp()}
                  />
                </div>
                </div>

                 {error && (
                  <p className="text-indigo-600 text-sm text-left">{error}</p>
                )}


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


                      <div className=" text-sm text-gray-600">
  Didn’t receive the OTP?{" "}
  <button
    type="button"
    onClick={handleGetOtp}
    disabled={loading}
    className="text-blue-600 underline hover:opacity-80"
  >
    Resend OTP
  </button>
</div>
              </>
            )}

        {/* Terms */}
        <div className=" text-sm text-gray-600">
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

export default SignupPage;
