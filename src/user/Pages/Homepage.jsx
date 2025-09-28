import { useState } from "react";
import "../Styles/Homepage.css";
import logo from "../assets/logo/logo_hr.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Testimonial from "../Components/Homepage/Testimonial.jsx";
import FAQSection from "../Components/Homepage/FAQSection.jsx";
import Blogs from "../Components/Homepage/Blogs.jsx";

import womanImage from "../assets/homepage/hero-img.png";
import community from "../assets/homepage/community.png";
import connectImg from "../assets/homepage/connect.png";

import whyImage from "../assets/homepage/secure/whywebuild.jpg";
import howImage from "../assets/homepage/secure/whywebuild.jpg";
import whoImage from "../assets/homepage/secure/whywebuild.jpg";
import hicon from "../assets/homepage/secure/icon-head.png";
import icon1 from "../assets/homepage/secure/icon1.png";
import icon2 from "../assets/homepage/secure/icon2.png";
import icon3 from "../assets/homepage/secure/icon3.png";

import one from "../assets/homepage/Why Smart Udhar/1.png";
import digiicon from "../assets/homepage/Why Smart Udhar/icon.png";
import two from "../assets/homepage/Why Smart Udhar/2.png";
import three from "../assets/homepage/Why Smart Udhar/3.png";
import four from "../assets/homepage/Why Smart Udhar/4.png";

import apple from "../assets/homepage/appdowload/apple store.png";
import playstore from "../assets/homepage/appdowload/google play.png";
import app from "../assets/homepage/appdowload/SMART UDHAR.png";

import flogo from "../assets/logo/logo_hr.png";
import { FaClock } from "react-icons/fa";
import downloadBtn from "../assets/homepage/app-download.png";
import facebook from "../assets/homepage/Footer/facebook.png";
import twitter from "../assets/homepage/Footer/twitter.png";
import instagram from "../assets/homepage/Footer/instagram.png";
import telegram from "../assets/homepage/Footer/telegram.png";
import call from "../assets/homepage/Footer/call.png";
import whatsapp from "../assets/homepage/Footer/logos_whatsapp-icon.png";
import mail from "../assets/homepage/Footer/logos_google-gmail.png";

const Homepage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("why");
  const { i18n } = useTranslation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="homepage" style={{ backgroundColor: "#FFFFFF" }}>
      {/* header start */}
      <header className="flex items-center h-[10vh] justify-between px-4 md:px-8 py-3 bg-white relative z-[100]">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="w-[120px] sm:w-[150px] h-auto"
            />
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav
          className={`${
            isMobileMenuOpen ? "flex" : "hidden"
          } absolute lg:static top-full left-0 right-0 flex-col lg:flex lg:flex-row lg:items-center bg-white lg:bg-transparent p-5 lg:p-0 gap-6 lg:gap-10 flex-1 justify-center`}
        >
          <ul
            className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 
             font-robotoM text-base text-[#595959] w-full lg:w-auto"
          >
            <li>
              <Link
                to="/?scrollTo=about"
                className="block w-full text-center hover:text-[#2563EB] transition"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/?scrollTo=pricelist"
                className="block w-full text-center hover:text-[#2563EB] transition"
              >
                Price List
              </Link>
            </li>
            <li>
              <Link
                to="/?scrollTo=features"
                className="block w-full text-center hover:text-[#2563EB] transition"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to="/?scrollTo=partner"
                className="block w-full text-center hover:text-[#2563EB] transition"
              >
                Partner With Us
              </Link>
            </li>
            <li>
              <Link
                to="/?scrollTo=more"
                className="block w-full text-center hover:text-[#2563EB] transition"
              >
                More
              </Link>
            </li>
          </ul>

          {/* Mobile Buttons (inside toggle menu) */}
          <div className="flex flex-col md:hidden w-full mt-6 gap-3 items-center">
            <button className="w-full px-4 py-2 rounded-md border border-black/20 shadow-md font-InriaR text-base sm:text-lg bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-green-500 hover:text-white transition">
              <a
                href="/login"
                className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent hover:text-white"
              >
                Login/Signup
              </a>
            </button>
            <button className="w-full px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-green-500 text-white font-InriaR text-base sm:text-lg shadow-md hover:shadow-lg transition">
              <a target="_blank" href="/">
                SmartUdhar App
              </a>
            </button>
          </div>
        </nav>

        {/* Buttons Section */}
        <div
          className="
      hidden 
      md:flex lg:hidden  /* Show only on tablet (>=768px and <1024px) */
      flex-1 justify-center gap-4
    "
        >
          {/* Login Button */}
          <button className="px-6 py-2 rounded-full border border-black/10 bg-[#F1F1F1] font-InriaR font-bold text-[16px] shadow-[inset_0px_3px_2.6px_rgba(0,0,0,0.09),inset_0px_-4px_3.6px_#ffffff] transition">
            <a
              href="/login"
              className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent"
            >
              Login
            </a>
          </button>

          {/* SmartUdhar App Button */}
          <button className="px-6 py-2 rounded-full text-white font-InriaR font-bold text-[16px] bg-gradient-to-r from-blue-600 to-green-500 shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25),inset_0px_-4px_4px_#ffffff82] transition">
            <a target="_blank" href="/">
              SmartUdhar App
            </a>
          </button>
        </div>

        {/* Desktop Buttons (aligned right) */}
        <div className="hidden lg:flex flex-shrink-0 gap-4">
          {/* Login Button */}
          <button className="px-6 py-2 rounded-full border border-black/10 bg-[#F1F1F1] font-InriaR font-bold text-[16px] shadow-[inset_0px_3px_2.6px_rgba(0,0,0,0.09),inset_0px_-4px_3.6px_#ffffff] transition">
            <a
              href="/login"
              className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent"
            >
              Login
            </a>
          </button>

          {/* SmartUdhar App Button */}
          <button className="px-6 py-2 rounded-full text-white font-InriaR font-bold text-[16px] bg-gradient-to-r from-blue-600 to-green-500 shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25),inset_0px_-4px_4px_#ffffff82] transition">
            <a target="_blank" href="/">
              SmartUdhar App
            </a>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div
          className="flex lg:hidden flex-col gap-1 cursor-pointer ml-3"
          onClick={toggleMobileMenu}
        >
          <span className="w-6 h-[3px] navbar-login"></span>
          <span className="w-6 h-[3px] navbar-login"></span>
          <span className="w-6 h-[3px] navbar-login"></span>
        </div>
      </header>

      {/* header End */}

      {/* hero section start */}
      <section className="hero-section h-[90vh]   bg-[#0D0F1F] pt-20 px-5 sm:px-10 lg:px-16 rounded-bl-[40px] sm:rounded-bl-[60px] md:rounded-bl-[80px] lg:rounded-bl-[100px]">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center lg:items-start">
          <div className="text-center lg:text-left ">
            <h2 className="font-roboto text-[#F2F0E0] text-[34px] sm:text-[40px] md:text-[45px] lg:text-[50px] leading-[100%] tracking-[0.02em] font-normal max-w-[700px] font-robotoR text-[#F2F0E0] ">
              Generate the{" "}
              <span className="font-extrabold  font-robotoB ]">
                Credit History
              </span>{" "}
              of customers
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start align-top  w-full gap-10">
            <div className="flex flex-col items-start gap-3  ">
              <div>
                <p className="font-roboto text-[#C1C0B7] font-robotoR text-[16px] md:text-[18px] leading-[115%] max-w-[515px] leading-normal mt-4">
                  Empowering India's small businesses to build trust, improve
                  credit scores, and manage udhar smartly.
                </p>
              </div>
              <div className="flex gap-3 w-full pt-3">
                <div className="flex items-center rounded-md overflow-hidden bg-white border border-gray-300 rounded-l-full">
                  <select className="p-2 text-black text-sm bg-white outline-none cursor-pointer border-r px-2">
                    <option value="+91">+91</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    className="flex-1 border-0 outline-none p-2 text-black text-sm bg-transparent"
                  />
                </div>
                <button className="px-5 py-2 navbar-login rounded-full font-InriaR font-bold text-[16px]  text-white  hover:opacity-90 transition shadow-[inset_0px_3px_2.6px_rgba(0,0,0,0.09),inset_0px_-1px_3.6px_#ffffff]">
                  Get Started
                </button>
              </div>
            </div>

            <div className=" flex justify-center lg:justify-start">
              <img
                src={womanImage}
                alt="woman"
                className="h-[100%] w-fit overflow-hidden object-contain"
              />
            </div>

            <div className=" max-w-[400px]  py-10">
              <div className="">
                <h3 className="font-roboto font-bold text-[22px] sm:text-[26px]  text-white mb-2">
                  Trust Badges:
                </h3>
                <p className="font-roboto text-[#FFFFFFC9] text-sm  mb-4">
                  Trusted by 1000+ merchants | Backed by leading fintech
                  advisors | Safe, secure, & verified platform
                </p>

                <div className="relative">
                  <div className="relative w-[18vh]">
                    <img
                      src={connectImg}
                      alt="connection path"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="absolute top-0 left-[40px] sm:left-[45px] lg:left-[70px] flex flex-col gap-5 ">
                    <div className="text-[#FFFFFFC9] text-[14px] sm:text-[14px] lg:text-[16px]">
                      Easy Invoicing & Billing
                    </div>
                    <div className="text-[#FFFFFFC9] text-[14px] sm:text-[14px] lg:text-[16px]">
                      Digital Credit Score
                    </div>
                    <div className="text-[#FFFFFFC9] text-[14px] sm:text-[14px] lg:text-[16px]">
                      Automated Reminders
                    </div>
                  </div>
                </div>

                <div className="flex flex-row justify-center items-center gap-3 mt-6">
                  <div className="flex items-center gap-2">
                    <img
                      src={community}
                      alt="users"
                      className="w-full max-w-[188px] h-auto"
                    />
                  </div>
                  <p className="font-roboto text-white text-[16px] sm:text-[18px]">
                    Community
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* hero section End */}

      {/* About section Start */}

<section className="py-[70px] px-[30px] bg-[#f6f6f6] text-center">
  <div className="inline-block">
    <h2 className="flex items-center justify-center text-[50px] leading-[90px] font-robotoM text-black mb-5 gap-[10px]">
      Secure
      <img src={hicon} alt="" className="mx-3 w-[100px] h-auto" />
      your <span className="text-[#2563EB] font-robotoR">Debts</span> Smartly
    </h2>
  </div>

  <p className="max-w-[950px] mx-auto mb-[30px] font-robotoR text-[18px] leading-[130%] text-[#595959] px-2">
    Manage credit, track payments, send reminders, and grow your business
    effortlessly with SMARTUDHAR's intelligent accounting tools designed for
    smarter, faster, and more reliable repayment management.
  </p>

  {/* Tabs */}
  <div className="flex justify-center flex-wrap gap-5 mb-[30px] font-robotoM">
    <button
      className={`px-5 py-3 w-[360px] h-[67px] rounded-tr-[26px] rounded-bl-[22px] text-[18px] text-center cursor-pointer ${
        activeTab === "why"
          ? "bg-[#2563EB] text-white shadow-[0_0_18px_2px_#49B4F654] font-robotoM"
          : "bg-white text-black font-robotoR"
      }`}
      onClick={() => setActiveTab("why")}
    >
      Why We Built Smart Udhar?
    </button>
    <button
      className={`px-5 py-3 w-[360px] h-[67px] rounded-tr-[26px] rounded-bl-[22px] text-[18px] text-center cursor-pointer ${
        activeTab === "how"
          ? "bg-[#2563EB] text-white shadow-[0_0_18px_2px_#49B4F654] font-robotoM"
          : "bg-white text-black font-robotoR"
      }`}
      onClick={() => setActiveTab("how")}
    >
      How Smart Udhar Works
    </button>
    <button
      className={`px-5 py-3 w-[360px] h-[67px] rounded-tr-[26px] rounded-bl-[22px] text-[18px] text-center cursor-pointer ${
        activeTab === "who"
          ? "bg-[#2563EB] text-white shadow-[0_0_18px_2px_#49B4F654] font-robotoM"
          : "bg-white text-black font-robotoR"
      }`}
      onClick={() => setActiveTab("who")}
    >
      Who It's For
    </button>
  </div>

  {/* Tab Content */}
  <div className="flex flex-wrap gap-5 justify-center items-start">
    {activeTab === "why" && (
      <>
        <div className="max-w-[556px] bg-white p-[30px] rounded-[20px] text-left shadow-[0_0_18px_2px_#49B4F654]">
          <h3 className="font-robotoM text-[27px] text-[#2D2D2D] mb-[15px] leading-[120%]">
            Why We Built Smart Udhar?
          </h3>
          <p className="font-robotoR text-[18px] text-[#484848] mb-[30px] leading-[135%]">
            Small businesses across India run on trust — but there’s no system
            to prove that trust. Thousands repay on time, but still struggle to
            get credit, discounts, or partnerships.
          </p>
          <h4 className="font-robotoM text-[27px] text-[#2D2D2D] mb-[15px] leading-[120%]">
            Smart Udhar is India's first platform to:
          </h4>
          <ul className="list-none">
            <li className="flex items-center font-robotoR text-[18px] text-[#484848] mb-[10px] leading-[135%]">
              <img
                src={icon1}
                alt="icon1"
                className="w-6 h-6 mr-5"
              />
              Track real udhar (credit) transactions.
            </li>
            <li className="flex items-center font-robotoR text-[18px] text-[#484848] mb-[10px] leading-[135%]">
              <img
                src={icon2}
                alt="icon2"
                className="w-6 h-6 mr-5"
              />
              Build a verifiable digital credit score
            </li>
            <li className="flex items-center font-robotoR text-[18px] text-[#484848] mb-[10px] leading-[135%]">
              <img
                src={icon3}
                alt="icon3"
                className="w-6 h-6 mr-5"
              />
              Help small businesses grow with credibility
            </li>
          </ul>
        </div>
        <div className="max-w-[556px]">
          <img
            src={whyImage}
            alt="Why Smart Udhar"
            className="w-full rounded-[20px]"
          />
        </div>
      </>
    )}

    {activeTab === "how" && (
      <>
        <div className="max-w-[556px] bg-white p-[30px] rounded-[20px] text-left shadow-[0_0_18px_2px_#49B4F654]">
          <h3 className="font-robotoM text-[27px] text-[#2D2D2D] mb-[15px]">
            How Smart Udhar Works
          </h3>
          <p className="font-robotoR text-[18px] text-[#484848] mb-[30px]">
            Smart Udhar enables you to record every credit (udhar) transaction
            digitally. Whether you're giving credit or receiving it, every entry
            gets timestamped and securely stored.
          </p>
          <h4 className="font-robotoM text-[27px] text-[#2D2D2D] mb-[15px]">
            What happens next?
          </h4>
          <ul className="list-none">
            <li className="font-robotoR text-[18px] text-[#484848] mb-[10px] leading-[135%]">
              ⚙️ Your customers are reminded about repayment dates.
            </li>
            <li className="font-robotoR text-[18px] text-[#484848] mb-[10px] leading-[135%]">
              ⚙️ You build a digital repayment history.
            </li>
            <li className="font-robotoR text-[18px] text-[#484848] mb-[10px] leading-[135%]">
              ⚙️ A credit score is automatically generated.
            </li>
          </ul>
        </div>
        <div className="max-w-[556px]">
          <img
            src={howImage}
            alt="How Smart Udhar Works"
            className="w-full rounded-[20px]"
          />
        </div>
      </>
    )}

    {activeTab === "who" && (
      <>
        <div className="max-w-[556px] bg-white p-[30px] rounded-[20px] text-left shadow-[0_0_18px_2px_#49B4F654]">
          <h3 className="font-robotoM text-[27px] text-[#2D2D2D] mb-[15px]">
            Who It’s For
          </h3>
          <p className="font-robotoR text-[18px] text-[#484848] mb-[30px]">
            Smart Udhar is built for India’s small and medium businesses that
            want to grow but face barriers due to lack of credit history or
            informal systems.
          </p>
          <h4 className="font-robotoM text-[27px] text-[#2D2D2D] mb-[15px]">
            Perfect for:
          </h4>
          <ul className="list-none">
            <li className="font-robotoR text-[18px] text-[#484848] mb-[10px]">
              👨‍🍳 Kirana Stores, Retail Shops
            </li>
            <li className="font-robotoR text-[18px] text-[#484848] mb-[10px]">
              👷‍♂️ Local Service Providers & Distributors
            </li>
            <li className="font-robotoR text-[18px] text-[#484848] mb-[10px]">
              👩‍💼 Wholesalers & Small Manufacturers
            </li>
            <li className="font-robotoR text-[18px] text-[#484848] mb-[10px]">
              📱 Digital Lenders & Fintech Companies
            </li>
          </ul>
        </div>
        <div className="max-w-[556px]">
          <img
            src={whoImage}
            alt="Who Smart Udhar Is For"
            className="w-full rounded-[20px]"
          />
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
            <span className="highlight">Why Smart Udhar?</span> Because India's
            Businessmen deserves a credit history of their clients.
          </h2>
        </div>

        <div className="features-row-one">
          <div className="feature-card-one">
            <div className="card-left">
              <h3>Timely Repayment Alerts</h3>
              <p className="link">Never miss a due date again</p>
              <p>
                Get automatic reminders for money you need to pay or collect —
                straight to your phone. Smart alerts keep your business on track
                and your relationships strong.
              </p>
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
              <p>
                SMARTUDHAR's Digital Credit Score builds business trust with
                suppliers, lenders, and platforms using payment behavior.
              </p>
            </div>
            <div className="two-card-right">
              <img
                src={two}
                alt="Digital Credit Score"
                className="feature-img score-img"
              />
            </div>
          </div>
        </div>

        <div className="features-row-two">
          <div className="feature-card-three">
            <div className="three-card-left">
              <h3>Smart Ledger & Billing</h3>
              <p className="link">
                Track every <span className="bold">rupee</span> with ease
              </p>
              <p>
                Record all udhar transactions, send professional invoices, and
                manage your accounts — all in one simple, easy-to-use dashboard.
              </p>
            </div>
            <div className="three-card-right">
              <img
                src={three}
                alt="Smart Ledger"
                className="feature-img icon-img"
              />
            </div>
          </div>

          <div className="feature-card-four">
            <div className="four-card-left">
              <h3>Your business reputation, now verified</h3>
              <p className="link">
                Your business reputation,{" "}
                <span className="bold">now verified</span>
              </p>
              <p>
                Smart Udhar automatically builds a credit score based on your
                real repayment activity — so you can earn trust and unlock
                better business opportunities.
              </p>
            </div>
            <div className="four-card-right">
              <img
                src={four}
                alt="Business Reputation"
                className="feature-img"
              />
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
            Smart Credit. Easy Collections. Get{" "}
            <span className="highlight">SmartUdhar</span> Free!
          </h2>
          <p>
            Track payments, send reminders, manage udhar, invoices, and credit
            scores - all-in-one app to grow your business faster.
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
            <h3>
              Ready to <span className="highlight">Get Started?</span>
            </h3>
            <p>
              Join thousands of businesses using SmartUdhar to manage credit,
              track payments, and grow smarter—start free today with just your
              mobile.
            </p>
            <img
              src={downloadBtn}
              alt="Download SmartUdhar"
              className="download-btn"
            />
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
                <img
                  src={call}
                  style={{ width: "16px", height: "auto" }}
                  alt=""
                />
                +91-XXXXXXXXXX
              </li>
              <li>
                {/* <MdEmail />  */}
                <img
                  src={mail}
                  style={{ width: "16px", height: "auto" }}
                  alt=""
                />
                support@smartudhar.in
              </li>
              <li>
                <img
                  src={whatsapp}
                  style={{ width: "16px", height: "auto" }}
                  alt=""
                />
                {/* <FaWhatsapp />  */}
                WhatsApp Support
              </li>
              <li>
                <FaClock size={16} /> Mon-Sat, 10am - 7pm
              </li>
            </ul>
          </div>

          {/* Right Section */}
          <div className="footer-section brand">
            <img src={flogo} alt="SmartUdhar" className="brand-logo" />
            <div className="social-icons">
              <img src={facebook} alt="" className="w-14" />
              <img src={twitter} alt="" className="w-14" />
              <img src={instagram} alt="" className="w-14" />
              <img src={telegram} alt="" className="w-14" />
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
