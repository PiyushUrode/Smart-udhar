import { useState } from "react";
import "../Styles/Homepage.css";
import logo from "../assets/logo/logo_hr.png";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Testimonial from '../Components/Homepage/Testimonial';
import FAQSection from "../Components/Homepage/FAQSection";
import Blogs from "../Components/Homepage/Blogs";

import womanImage from '../assets/homepage/hero-img.png';
import community from '../assets/homepage/community.png';
import connectImg from '../assets/homepage/connect.png';

import whyImage from '../assets/homepage/secure/whywebuild.jpg';
import howImage from '../assets/homepage/secure/whywebuild.jpg';
import whoImage from '../assets/homepage/secure/whywebuild.jpg';
import hicon from '../assets/homepage/secure/icon-head.png';
import icon1 from '../assets/homepage/secure/icon1.png';
import icon2 from '../assets/homepage/secure/icon2.png';
import icon3 from '../assets/homepage/secure/icon3.png';

import one from '../assets/homepage/Why Smart Udhar/1.png';
import digiicon from '../assets/homepage/Why Smart Udhar/icon.png';
import two from '../assets/homepage/Why Smart Udhar/2.png';
import three from '../assets/homepage/Why Smart Udhar/3.png';
import four from '../assets/homepage/Why Smart Udhar/4.png';

import apple from "../assets/homepage/appdowload/apple store.png";
import playstore from "../assets/homepage/appdowload/google play.png";
import app from "../assets/homepage/appdowload/SMART UDHAR.png";

import flogo from '../assets/homepage/Footer/logo_hr.png';
import { FaClock } from "react-icons/fa";
import downloadBtn from "../assets/homepage/app-download.png";
import facebook from '../assets/homepage/Footer/facebook.png';
import twitter from '../assets/homepage/Footer/twitter.png';
import instagram from '../assets/homepage/Footer/instagram.png';
import telegram from '../assets/homepage/Footer/telegram.png';
import call from '../assets/homepage/Footer/call.png';
import whatsapp from '../assets/homepage/Footer/logos_whatsapp-icon.png';
import mail from '../assets/homepage/Footer/logos_google-gmail.png';

const Homepage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('why');
  const { i18n } = useTranslation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className='homepage' style={{ backgroundColor: '#F6F6F6' }}>
      {/* header start */}
      <header>
        <div className="h-logo">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <nav className={`nav-menu ${isMobileMenuOpen ? "open" : ""}`}>
          <ul>
            <li>
              <Link to="/?scrollTo=about">About Us</Link>
            </li>
            <li>
              <Link to="/?scrollTo=pricelist">Price list</Link>
            </li>
            <li>
              <Link to="/?scrollTo=features">Features</Link>
            </li>
            <li>
              <Link to="/?scrollTo=partner">Partner With Us</Link>
            </li>
            <li>
              <Link to="/?scrollTo=more">More</Link>
            </li>
          </ul>

          <div className="nav-buttons mobile-visible">
            <button className="login-btn">
              <a href="/login">Login/Signup</a>
            </button>
            <button className="app-btn">
              <a target='blank' href="/">SmartUdhar App</a>
            </button>
          </div>
        </nav>

        <div className="translator-dropdown" style={{ display: 'flex', alignItems: 'center', flex: '0.050' }}>
          <select onChange={(e) => changeLanguage(e.target.value)}>
            <option value="en">EN </option>
          </select>
        </div>


        <div className="nav-buttons desktop-visible">
          <button className="login-btn">
            <a href="/login">Login/Signup</a>
          </button>
          <button className="app-btn">
            <a target='blank' href="/">SmartUdhar App</a>
          </button>
        </div>


        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span className="hamburger-icon"></span>
          <span className="hamburger-icon"></span>
          <span className="hamburger-icon"></span>
        </div>
      </header>
      {/* header End */}

      {/* hero section start */}
      <section className="hero-section">
        <h2 className="hero-title">Generate The <span>Credit History</span> Of Customers</h2>
        <p className="he-des">Empowering India's small businesses to build trust, improve credit scores, and manage udhar smartly.</p>
            <div className="mobile-container">
              <div className="input-wrapper">
                <select className="country-code">
                  <option value="+91">+91</option>
                </select>
                <input
                  type="tel"
                  className="mobile-input"
                  placeholder="Enter mobile number"
                />
              </div>
              <button className="get-started-btn">Get Started</button>
            </div>
        <div className="hero-content">
          <div className="content-left">
            {/* <p className="he-des">Empowering India's small businesses to build trust, improve credit scores, and manage udhar smartly.</p>
            <div className="mobile-container">
              <div className="input-wrapper">
                <select className="country-code">
                  <option value="+91">+91</option>
                </select>
                <input
                  type="tel"
                  className="mobile-input"
                  placeholder="Enter mobile number"
                />
              </div>
              <button className="get-started-btn">Get Started</button>
            </div> */}
          </div>
          <div className="content-center">
            <img src={womanImage} alt="" />
          </div>
          <div className="content-right">

            <div className="trust-container">
              <h3 className="trust-title">Trust Badges:</h3>
              <p className="trust-subtitle">
                Trusted by 1000+ merchants | Backed by leading fintech advisors | Safe, secure, & verified platform
              </p>

              <div className="trust-section">
                <div className="connect-image">
                  <img src={connectImg} alt="connection path" />
                </div>

                <div className="steps-labels">
                  <div className="step-label">Easy Invoicing & Billing</div>
                  <div className="step-label">Digital Credit Score</div>
                  <div className="step-label">Automated Reminders</div>
                </div>

                <div className="community">
                  <div className="users">
                    <img src={community} alt="" />
                  </div>
                  <p className="community-text">Community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* hero section End */}

      {/* About section Start */}

      <section className="secure-section">
      <div className="secure-h">
        <h2 className="secure-title">
          Secure
          <img src={hicon} alt="" />
          your <span className="highlight">Debts</span> Smartly
        </h2>
      </div>
        <p className="secure-subtext">
          Manage credit, track payments, send reminders, and grow your business effortlessly with SMARTUDHAR's intelligent accounting
          tools designed for smarter, faster, and more reliable repayment management.
        </p>

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'why' ? 'active' : ''}`}
            onClick={() => setActiveTab('why')}
          >
            Why We Built Smart Udhar?
          </button>
          <button
            className={`tab-btn ${activeTab === 'how' ? 'active' : ''}`}
            onClick={() => setActiveTab('how')}
          >
            How Smart Udhar Works
          </button>
          <button
            className={`tab-btn ${activeTab === 'who' ? 'active' : ''}`}
            onClick={() => setActiveTab('who')}
          >
            Who It's For
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'why' && (
            <>
              <div className="content-box">
                <h3>Why We Built Smart Udhar?</h3>
                <p>
                  Small businesses across India run on trust — but there’s no system to prove that trust. Thousands repay on time, but still struggle to get credit, discounts, or partnerships.
                </p>
                <h4>Smart Udhar is India's first platform to:</h4>
                <ul>
                  <li style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={icon1} alt="icon1" style={{ width: '24px', height: '24px', marginRight: '20px' }} />
                    Track real udhar (credit) transactions.
                  </li>

                  <li style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={icon2} alt="icon2" style={{ width: '24px', height: '24px', marginRight: '20px' }} />
                    Build a verifiable digital credit score
                  </li>

                  <li style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={icon3} alt="icon3" style={{ width: '24px', height: '24px', marginRight: '20px' }} />
                    Help small businesses grow with credibility
                  </li>


                </ul>
              </div>
              <div className="image-box">
                <img src={whyImage} alt="Why Smart Udhar" />
              </div>
            </>
          )}

          {activeTab === 'how' && (
            <>
              <div className="content-box">
                <h3>How Smart Udhar Works</h3>
                <p>
                  Smart Udhar enables you to record every credit (udhar) transaction digitally. Whether you're giving credit or receiving it, every entry gets timestamped and securely stored.
                </p>
                <h4>What happens next?</h4>
                <ul>
                  <li>⚙️ Your customers are reminded about repayment dates.</li>
                  <li>⚙️ You build a digital repayment history.</li>
                  <li>⚙️ A credit score is automatically generated.</li>
                </ul>
              </div>
              <div className="image-box">
                <img src={howImage} alt="How Smart Udhar Works" />
              </div>
            </>
          )}

          {activeTab === 'who' && (
            <>
              <div className="content-box">
                <h3>Who It’s For</h3>
                <p>
                  Smart Udhar is built for India’s small and medium businesses that want to grow but face barriers due to lack of credit history or informal systems.
                </p>
                <h4>Perfect for:</h4>
                <ul>
                  <li>👨‍🍳 Kirana Stores, Retail Shops</li>
                  <li>👷‍♂️ Local Service Providers & Distributors</li>
                  <li>👩‍💼 Wholesalers & Small Manufacturers</li>
                  <li>📱 Digital Lenders & Fintech Companies</li>
                </ul>
              </div>
              <div className="image-box">
                <img src={whoImage} alt="Who Smart Udhar Is For" />
              </div>
            </>
          )}
        </div>
      </section>
      {/* About section end */}

      {/* Why Smart Udhar start */}

      <section className="why-smart-udhar">
        <div className="heading">
          <h2>
            <span className="highlight">Why Smart Udhar?</span> Because India's Businessmen
            deserves a credit history of their clients.
          </h2>
        </div>

        <div className="features-row-one">
          <div className="feature-card-one">
            <div className="card-left">
              <h3>Timely Repayment Alerts</h3>
              <p className="link">Never miss a due date again</p>
              <p>Get automatic reminders for money you need to pay or collect — straight to your phone. Smart alerts keep your business on track and your relationships strong.</p>
            </div>
            <div className="card-right">
              <img src={one} alt="Timely Repayment" className="feature-img" />
            </div>
          </div>

          <div className="feature-card-two">
            <div className="two-card-left">
              <div className="fea-head">
                <img src={digiicon} alt="" />
                <h3>Digital Credit Score</h3>
              </div>
              <p>SMARTUDHAR's Digital Credit Score builds business trust with suppliers, lenders, and platforms using payment behavior.</p>
            </div>
            <div className="two-card-right">
              <img src={two} alt="Digital Credit Score" className="feature-img score-img" />
            </div>
          </div>
        </div>

        <div className="features-row-two">
          <div className="feature-card-three">
            <div className="three-card-left">
              <h3>Smart Ledger & Billing</h3>
              <p className="link">Track every <span className="bold">rupee</span> with ease</p>
              <p>Record all udhar transactions, send professional invoices, and manage your accounts — all in one simple, easy-to-use dashboard.</p>
            </div>
            <div className="three-card-right">
              <img src={three} alt="Smart Ledger" className="feature-img icon-img" />
            </div>
          </div>

          <div className="feature-card-four">
            <div className="four-card-left">
              <h3>Your business reputation, now verified</h3>
              <p className="link">Your business reputation, <span className="bold">now verified</span></p>
              <p>Smart Udhar automatically builds a credit score based on your real repayment activity — so you can earn trust and unlock better business opportunities.</p>
            </div>
            <div className="four-card-right">
              <img src={four} alt="Business Reputation" className="feature-img" />
            </div>
          </div>
        </div>
      </section>
      {/* Why Smart Udhar End */}

      {/* Testimonials Start */}

      <Testimonial />

      {/* Testimonials end */}

      <Blogs />

      {/* App section start */}
      <section className="smart-udhar-section">
            <div className="smart-left">
              <h2>
                Smart Credit. Easy Collections. 
                Get <span className="highlight">SmartUdhar</span> Free!
              </h2>
              <p>
                Track payments, send reminders, manage udhar, invoices,
                and credit scores - all-in-one app to grow your business faster.
              </p>
              <div className="store-buttons">
                <a href="#" className="store-btn">
                  <img src={apple} alt="Apple Store" />
                </a>
                <a href="#" className="store-btn">
                  <img src={playstore} alt="Google Play" />
                </a>
              </div>
            </div>
            <div className="smart-right">
              <img src={app} alt="App Screenshot 1" className="phone-img" />
            </div>
          </section>
      {/* App section end */}

      <FAQSection />

      {/* Footer start */}
      <footer className="footer">
        <div className="footer-content">
          {/* Left Section */}
          <div className="footer-section start">
            <h3>Ready to <span className="highlight">Get Started?</span></h3>
            <p>
              Join thousands of businesses using SmartUdhar to manage credit, track payments, and grow smarter—start free today with just your mobile.
            </p>
            <img src={downloadBtn} alt="Download SmartUdhar" className="download-btn" />
          </div>

          {/* Center Section */}
          <div className="footer-section links">
            <h4>Quick Links</h4>
            <ul>
              <li>About Us</li>
              <li>Features</li>
              <li>FAQs</li>
              <li>Privacy Policy</li>
              <li>Support</li>
            </ul>
          </div>

          <div className="footer-section support">
            <h4>Contact & Support</h4>
            <ul>
              <li>
                {/* <FaPhoneAlt /> */}
                <img src={call} style={{ width: '20px', height: 'auto' }} alt="" />
                +91-XXXXXXXXXX
              </li>
              <li>
                {/* <MdEmail />  */}
                <img src={mail} style={{ width: '16px', height: 'auto' }} alt="" />
                support@smartudhar.in
              </li>
              <li>
                <img src={whatsapp} style={{ width: '16px', height: 'auto' }} alt="" />
                {/* <FaWhatsapp />  */}
                WhatsApp Support
              </li>
              <li><FaClock /> Mon-Sat, 10am - 7pm</li>
            </ul>
          </div>

          {/* Right Section */}
          <div className="footer-section brand">
            <img src={flogo} alt="SmartUdhar" className="brand-logo" />
            <div className="social-icons">
              <img src={facebook} alt="" />
              <img src={twitter} alt="" />
              <img src={instagram} alt="" />
              <img src={telegram} alt="" />
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 SmartUdhar. All Rights Reserved.</p>
          <p>Made for India's small businesses</p>
        </div>
      </footer>
      {/* Footer end */}
    </div>
  );
};

export default Homepage;
