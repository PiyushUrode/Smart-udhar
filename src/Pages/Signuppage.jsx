import logo from '../assets/logo/logo_hr.png'; 
import lockImage from '../assets/login/login side img.png'; 
// import icon from '../assets/login/icon.png';
import whatsapp from '../assets/login/whatsapp_icon.png';
import callicon from '../assets/login/call_icon.png';

import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="login-wrapper">
      <header className="login-header">
        <Link to="/">
                  <img src={logo} alt="Logo" className="logo" />
                </Link>
        <div className='login-header-right'>
          <span>Already have an account?</span>
          <Link to="/login">
            <button className="signup-btn">Login</button>
          </Link>
        </div>
      </header>

      <main className="login-main">
        <div className="login-left">
          <img src={lockImage} alt="Illustration" className="lock-img" />
        </div>

        <div className="login-form-container">
          <div className="login-card">
            <h2 className='l-head'>              
              Welcome to 
                <img style={{ marginLeft: '15px',  }} src={logo} alt="" className='max-w-[10vw]' />
            </h2>
            <p className='l-para'>Please enter your details to sign up</p>

            <button className="btn whatsapp">
              <img src={whatsapp} alt="" />
              Continue with WhatsApp
            </button>
            <button className="btn truecaller">
              <img src={callicon} alt="" />
              Continue with Truecaller
            </button>

            <div className="divider">OR</div>

            <div className="phone-input">
              <select>
                <option value="+91">+91</option>
              </select>
              <input type="tel" placeholder="Enter mobile number" />
            </div>
     <Link to="/dashboard">  
            <button className="btn otp">Get OTP</button>
</Link>
            <p className="terms">
              By continuing, you agree to our </p>
            <p className="terms"><a href="#">Terms of Service</a> & <a href="#">Privacy Policy</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;