import logo from '../assets/logo/logo_hr.png'; 
import lockImage from '../assets/login/login side img.png'; 
import icon from '../assets/logo/icon3.png';

import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="login-wrapper" style={{ minHeight: '100vh' }}>
      <header className="login-header">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <div className='login-header-right'>
          <span>Don't have an account?</span>
          <Link to="/signup">
            <button className="signup-btn">Sign Up</button>
          </Link>
        </div>
      </header>

      <main className="login-main">
        <div className="login-left">
          <img src={lockImage} alt="Illustration" className="lock-img" />
        </div>

        <div className="login-form-container">
          <div className="login-card">
            <div className="icon-placeholder">
              <img src={icon} alt="" />
            </div>
            <h2 className='l-head' >Welcome Back</h2>
            <p className='l-para' >Please enter your details to sign in</p>

            <div className="phone-input">
              <select>
                <option value="+91">+91</option>
              </select>
              <input type="tel" placeholder="Enter mobile number" />
            </div>
     <Link to="/dashboard">   
            <button className="btn otp">Get OTP</button>
</Link>
            <p className="terms" style={{ margintop: '30px' }}>
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