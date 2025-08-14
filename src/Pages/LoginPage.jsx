import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import logo from '../assets/logo/logo_hr.png';
import lockImage from '../assets/login/login side img.webp';
import icon from '../assets/login/icon.webp';

const LoginPage = () => {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleGetOtp = () => {
    if (phone.length === 10) {
      setStep('otp');
      // Normally you'd send OTP to backend here
    } else {
      alert("Please enter valid 10-digit number");
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length === 6) {
      // Normally OTP would be verified here
      navigate('/dashboard');
    } else {
      alert("Enter valid 6-digit OTP");
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/, '');
    if (!value) return;

    const newOtp = otp.split('');
    newOtp[index] = value;
    setOtp(newOtp.join(''));

    if (index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && (!otp[index] || otp[index] === '')) {
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  return (
    <div className="login-wrapper" style={{ minHeight: '100vh' }}>
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

            {step === 'phone' && (
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
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <button className="btn otp" onClick={handleGetOtp}>
                  Get OTP
                </button>
              </>
            )}

            {step === 'otp' && (
              <>
                <div className="flex space-x-3 justify-center mt-4">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={otp[index] || ''}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-10 h-10 rounded-xl text-center  text-lg outline-none
                                 border 
                                 bg-white text-gray-700
                                 focus:ring-2 focus:ring-blue-500 border-blue-500"
                    />
                  ))}
                </div>
                <button className="btn otp mt-5 font" onClick={handleVerifyOtp}>
                  Confirm
                </button>
              </>
            )}

            <div>
              <p className="terms mt-8">
                By continuing, you agree to our
              </p>
              <p className="terms">
                <a href="#">Terms of Service</a> &{' '}
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
