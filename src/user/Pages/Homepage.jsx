import { useState } from "react";
import "../Styles/Homepage.css";
import logo from "../assets/logo/logo_hr.png";
import { href, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Testimonial from "../Components/Homepage/Testimonial.jsx";
import FAQSection from "../Components/Homepage/FAQSection.jsx";
import Blogs from "../Components/Homepage/Blogs.jsx";

import womanImage from "../assets/homepage/hero-img.png";
import community from "../assets/homepage/community.png";
import dot from "../assets/homepage/dot.png";

import connectImg from "../assets/homepage/connect.png";
import whyImage from "../assets/homepage/secure/whayimage.webp";
import howImage from "../assets/homepage/secure/how.webp";
import whoImage from "../assets/homepage/secure/who.webp";
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

import Navbar from "../Components/Homepage/Navbar.jsx";
import UseScrollToElement from "../Components/UseScrollToElement.js";
import Footer from "../Components/Homepage/Footer.jsx";


const Homepage = () => {
  UseScrollToElement()
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
    <div className="homepage max-w-[1600px] mx-auto " style={{ backgroundColor: "#FFFFFF" }}>

      <Navbar/>




      {/* hero section start */}
      <section className="relative  md:h-[90vh] h-fit   bg-[#0D0F1F]   px-10 sm:px-20 lg:px-28  pt-14 pb-5   rounded-bl-[40px] sm:rounded-bl-[60px]  md:rounded-bl-[80px] lg:rounded-bl-[100px]">
        <div className="">
          <h1 className=" sm:max-w-[70vw] leading-[1.1] text-4xl  sm:text-[5.4vw]    font-robotoR text-[#F2F0E0] ">
            Generate the{" "}
            <span className="font-extrabold  font-robotoB ]">
              Credit History
            </span>{" "}
            of customers
          </h1>
          <p className="font-roboto text-[#C1C0B7] font-robotoR text-xs lg:text-[1.2vw]   max-w-full md:max-w-[35vw] leading-normal mt-2">
            Empowering India's small businesses to build trust, improve credit
            scores, and manage udhar smartly.
          </p>

          <div className="flex gap-3  pt-3">
            <div className="  hidden md:flex  items-center           ">
              <select className="    rounded-l-full  w-fit  text-black text-xs md:text-sm bg-white outline-none cursor-pointer border-r  ">
                <option value="+91">+91</option>
              </select>
              <input
                type="tel"
                placeholder="Enter mobile number"
                className="   rounded-r-full bg-white w-[15rem] border-0 outline-none p-2 text-black text-sm bg-transparent"
              />
            </div>
            <button className="px-6 py-2 rounded-full text-white font-InriaR font-bold text-[16px] bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-500 hover:to-green-400 shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25),inset_0px_-4px_4px_#ffffff82] transition">
              <Link to="/login"  >
                Get Started
              </Link>
            </button>
          </div>



          <div className=" max-sm:mt-5 md:absolute bottom-0   max-xl:right-20 xl:left-[50%] xl:transform  xl:translate-x-[-50%] flex justify-center lg:justify-start">
            <img
              src={womanImage}
              alt="woman"
              className="h-[100%] w-[15rem]  2xl:w-[19vw]   overflow-hidden object-contain"
            />
            <div className=" xl:hidden   absolute top-1/3 transform -translate-y-1/3  right-[105%] w-full  flex flex-col items-end gap-5  ">
              <div className="text-[#FFFFFFC9]  text-sm   flex items-center   ">
                Easy Invoicing & Billing
                <img src={dot} className="w-4 h-4 aspect-[1 / 1] ml-8 " alt="" />
              </div>
              <div className="text-[#FFFFFFC9] text-sm   flex items-center ">

                Digital Credit Score
                <img src={dot} className="w-4 h-4 aspect-[1 / 1] ml-8 " alt="" />
              </div>
              <div className="text-[#FFFFFFC9] text-sm   flex items-center ">

                Automated Reminders
                <img src={dot} className="w-4 h-4 aspect-[1 / 1] ml-8 " alt="" />
              </div>

            </div>
          </div>


          <div className="     mt-10  md:absolute  max-md:mx-auto  max-w-[23rem]    bottom-5 xl:bottom-5   xl:right-20 max-xl:28 flex xl:flex-col flex-col-reverse">
            <div className="max-md:text-center">
              <h3 className="font-roboto font-bold text-[22px] sm:text-[26px]  text-white mb-2">
                Trust Badges:
              </h3>
              <p className="font-roboto leading-normal text-[#FFFFFFC9]   text-xs  mb-4">
                Trusted by 1000+ merchants | Backed by leading fintech
                advisors | Safe, secure, & verified platform
              </p>

              <div className="relative">
                <div className=" xl:block hidden relative ml-2 w-[18vh] h-[15vmax]">
                  <img
                    src={connectImg}
                    alt="connection path"
                    className="w-full h-full"
                  />
                </div>
                <div className=" max-md:block max-xl:hidden xl:absolute top-0  left-0 flex flex-col   gap-5 ">
                  <div className="text-[#FFFFFFC9] text-[14px] sm:text-[14px] lg:text-[16px] flex items-center max-md:justify-center  max-md:mb-2 ">
                    <img src={dot} className=" max-md:hidden w-4 h-4 aspect-[1 / 1] mr-8 " alt="" />
                    Easy Invoicing & Billing
                  </div>
                  <div className="text-[#FFFFFFC9] text-[14px] sm:text-[14px] lg:text-[16px] flex items-center max-md:justify-center  max-md:mb-2 ">
                    <img src={dot} className=" max-md:hidden w-4 h-4 aspect-[1 / 1] mr-8 " alt="" />
                    Digital Credit Score
                  </div>
                  <div className="text-[#FFFFFFC9] text-[14px] sm:text-[14px] lg:text-[16px] flex items-center max-md:justify-center  max-md:mb-2 ">
                    <img src={dot} className=" max-md:hidden w-4 h-4 aspect-[1 / 1] mr-8 " alt="" />
                    Automated Reminders
                  </div>

                </div>
              </div>

            </div>
            <div className="flex flex-row  max-md:justify-center xl:justify-center items-center     gap-3 mt-2">
              <div className="flex items-center gap-2">
                <img
                  src={community}
                  alt="users"
                  className="  xl:max-w-[188px] max-w-20 h-auto"
                />
              </div>
              <p className="font-roboto max-md:hidden   text-white  text-sm lg:text-lg  m:text-lg leading-tight">
                Community
              </p>
            </div>
          </div>


        </div>


      </section>
      {/* hero section End */}

      

      {/* About section Start */}

      <section id="about_us" className="py-20 px-5 md:px-10 bg-[#f6f6f6] text-center">
        <div className="inline-block">
          <h2 className="flex flex-wrap leading-tight items-center justify-center  text-3xl md:text-5xl  font-robotoM text-black mb-5 gap-[10px]">
            Secure
            <img src={hicon} alt="" className="mx-3 w-14 md:w-24 h-auto" />
            your <span className="text-[#2563EB] font-robotoR">Debts</span> Smartly
          </h2>
        </div>

        <p className="max-w-[950px] mx-auto mb-10 font-robotoR text-base md:text-lg  leading-tight text-[#595959] px-2">
          Manage credit, track payments, send reminders, and grow your business
          effortlessly with SMARTUDHAR's intelligent accounting tools designed for
          smarter, faster, and more reliable repayment management.
        </p>
        
        <div className="flex justify-center flex-wrap gap-5 mb-16 font-robotoM">
          <button
            type="button"
            className={`px-5 py-3 w-[360px] h-[67px] rounded-tr-[26px] rounded-bl-[22px] text-lg leading-tight text-center cursor-pointer transition-colors ${activeTab === "why"
              ? "bg-[#2563EB] text-white font-robotoM"
              : "bg-white text-black font-robotoR border-2 border-gray-400 hover:border-gray-500"
              }`}
            onClick={() => { if (activeTab !== "why") setActiveTab("why")  ; }}
          >
            Why We Built Smart Udhar?
          </button>

          <button
            type="button"
            className={`px-5 py-3 w-[360px] h-[67px] rounded-tr-[26px] rounded-bl-[22px] text-lg leading-tight text-center cursor-pointer transition-colors ${activeTab === "how"
              ? "bg-[#2563EB] text-white font-robotoM"
              : "bg-white text-black font-robotoR border-2 border-gray-400 hover:border-gray-500"
              }`}
            onClick={() => { if (activeTab !== "how") setActiveTab("how"); }}
          >
            How Smart Udhar Works
          </button>

          <button
            type="button"
            className={`px-5 py-3 w-[360px] h-[67px] rounded-tr-[26px] rounded-bl-[22px] text-lg leading-tight text-center cursor-pointer transition-colors ${activeTab === "who"
              ? "bg-[#2563EB] text-white font-robotoM"
              : "bg-white text-black font-robotoR border-2 border-gray-400 hover:border-gray-500"
              }`}
            onClick={() => { if (activeTab !== "who") setActiveTab("who"); }}
          >
            Who It's For
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex lg:flex-row flex-col gap-5 justify-between max-w-[70rem] mx-auto items-center">
          {activeTab === "why" && (
            <>
              <div id="why" className="max-w-[35rem] bg-white p-10 rounded-[20px] text-left border-2 border-gray-400">
                <h3 className="font-robotoM text-[27px] text-[#2D2D2D] mb-5 leading-[120%]">
                  Why We Built Smart Udhar?
                </h3>
                <p className="font-robotoR text-lg text-[#484848] mb-10 leading-[135%]">
                  Small businesses across India run on trust — but there’s no system
                  to prove that trust. Thousands repay on time, but still struggle to
                  get credit, discounts, or partnerships.
                </p>
                <h4 className="font-robotoM text-[27px] text-[#2D2D2D] mb-5 leading-[120%]">
                  Smart Udhar is India's first platform to:
                </h4>
                <ul className="list-none">
                  <li className="flex items-center font-robotoR text-lg text-[#484848] mb-[10px] leading-[135%]">
                    <img
                      src={icon1}
                      alt=""
                      className="w-6 h-6 mr-5"
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                    />
                    Track real udhar (credit) transactions.
                  </li>
                  <li className="flex items-center font-robotoR text-lg text-[#484848] mb-[10px] leading-[135%]">
                    <img
                      src={icon2}
                      alt=""
                      className="w-6 h-6 mr-5"
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                    />
                    Build a verifiable digital credit score
                  </li>
                  <li className="flex items-center font-robotoR text-lg text-[#484848] mb-[10px] leading-[135%]">
                    <img
                      src={icon3}
                      alt=""
                      className="w-6 h-6 mr-5"
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                    />
                    Help small businesses grow with credibility
                  </li>
                </ul>
              </div>

              <div className="max-w-[30rem]">
                <img
                  src={whyImage}
                  alt="Why Smart Udhar"
                  className="w-full rounded-[20px]"
                  fetchpriority="high"
                  decoding="async"
                  draggable="false"
                />
              </div>
            </>
          )}

          {activeTab === "how" && (
            <>
              <div id="how" className="max-w-[35rem] bg-white p-10 rounded-[20px] text-left border-2 border-gray-400">
                <h3 className="font-robotoM text-[27px] text-[#2D2D2D] mb-5">
                  How Smart Udhar Works
                </h3>
                <p className="font-robotoR text-lg text-[#484848] mb-10 leading-[135%]">
                  Smart Udhar enables you to record every credit (udhar) transaction
                  digitally. Whether you're giving credit or receiving it, every entry
                  gets timestamped and securely stored.
                </p>
                <h4 className="font-robotoM text-[27px] text-[#2D2D2D] mb-5">
                  What happens next?
                </h4>
                <ul className="list-none">
                  <li className="font-robotoR text-lg text-[#484848] mb-[10px] leading-[135%]">
                    ⚙️ Your customers are reminded about repayment dates.
                  </li>
                  <li className="font-robotoR text-lg text-[#484848] mb-[10px] leading-[135%]">
                    ⚙️ You build a digital repayment history.
                  </li>
                  <li className="font-robotoR text-lg text-[#484848] mb-[10px] leading-[135%]">
                    ⚙️ A credit score is automatically generated.
                  </li>
                </ul>
              </div>

              <div className="max-w-[30rem]">
                <img
                  src={whoImage}
                  alt="How Smart Udhar works"
                  className="w-full rounded-[20px]"
                  fetchpriority="high"
                  decoding="async"
                  draggable="false"
                />
              </div>
            </>
          )}

          {activeTab === "who" && (
            <>
              <div id="who" className="max-w-[35rem] bg-white p-10 rounded-[20px] text-left border-2 border-gray-400">
                <h3 className="font-robotoM text-[27px] text-[#2D2D2D] mb-5">
                  Who It’s For
                </h3>
                <p className="font-robotoR text-lg text-[#484848] mb-10 leading-[135%]">
                  Smart Udhar is built for India’s small and medium businesses that
                  want to grow but face barriers due to lack of credit history or
                  informal systems.
                </p>
                <h4 className="font-robotoM text-[27px] text-[#2D2D2D] mb-5">
                  Perfect for:
                </h4>
                <ul className="list-none">
                  <li className="font-robotoR text-lg text-[#484848] mb-[10px]">
                    👨‍🍳 Kirana Stores, Retail Shops
                  </li>
                  <li className="font-robotoR text-lg text-[#484848] mb-[10px]">
                    👷‍♂️ Local Service Providers & Distributors
                  </li>
                  <li className="font-robotoR text-lg text-[#484848] mb-[10px]">
                    👩‍💼 Wholesalers & Small Manufacturers
                  </li>
                  <li className="font-robotoR text-lg text-[#484848] mb-[10px]">
                    📱 Digital Lenders & Fintech Companies
                  </li>
                </ul>
              </div>

              <div className="max-w-[30rem]">
                <img
                  src={howImage}
                  alt="Who Smart Udhar is for"
                  className="w-full rounded-[20px]"
                  fetchpriority="high"
                  decoding="async"
                  draggable="false"
                />
              </div>
            </>
          )}
        </div>
      </section>

      {/* About section end */}




      {/* Why Smart Udhar start */}

      <section id="why-smart-udhar" className=" py-20 px-20 max-md:px-10 max-sm:px-5 why-smart-udhar">
        <div className="heading">
          <h2>
            <span className="highlight">Why Smart Udhar?</span> Because India's
            Businessmen deserves a credit history of their clients.
          </h2>
        </div>

        <div className=" mt-20   features-row-one">
          <div className=" relative py-10 max-lg:mb-20 max-md:mb-10 feature-card-one">
            <div className="card-left md:mt-0 mt-52 md:max-w-[60%]">
              <h3>Timely Repayment Alerts</h3>
              <p className="link">Never miss a due date again</p>
              <p>
                Get automatic reminders for money you need to pay or collect —
                straight to your phone. Smart alerts keep your business on track
                and your relationships strong.
              </p>
            </div>
            <div className="card-right  absolute md:right-0 max-md:left-1/2 max-md:transform max-md:-translate-x-1/2  top-[-10%] md:bottom-0 w-[16rem]  ">
              <img src={one} alt="Timely Repayment" className="feature-img" />
            </div>
          </div>

          <div className=" relative max-md:overflow-hidden  md:py-10 feature-card-one">
            <div className="card-left md:mb-0 mb-60 md:max-w-[60%]">
              <div className="fea-head">
                <img src={digiicon} alt="" />
                <h3>Digital Credit Score</h3>
              </div>
              <p className=" text-base">
                SMARTUDHAR's Digital Credit Score builds business trust with
                suppliers, lenders, and platforms using payment behavior.
              </p>
            </div>
            <div className="card-right  absolute   right-0  max-md:bottom-[-30%] md:bottom-0 w-[15rem]  ">
              <img src={two} alt="Timely Repayment" className="feature-img" />
            </div>
          </div>

          
        </div>

        <div className="features-row-two  mt-20 ">

          <div className=" relative md:py-10 max-lg:mt-10 max-md:mt-0 feature-card-one">
            <div className="card-left md:mb-0 mb-80 md:max-w-[60%]">
              <h3>Smart Ledger & Billing</h3>
              <p className="link">
                Track every <span className="bold">rupee</span> with ease
              </p>
              <p>
                Record all udhar transactions, send professional invoices, and
                manage your accounts — all in one simple, easy-to-use dashboard.
              </p>
            </div>
            <div className="card-right  absolute   right-0  max-md:bottom-0  md:bottom-0   w-[19rem]  ">
              <img src={three} alt="Timely Repayment" className="feature-img" />
            </div>
          </div>

          <div className=" relative py-10 max-lg:mt-16 feature-card-one">
            <div className="card-left md:mt-0 mt-52 md:max-w-[60%]">
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
            <div className="card-right  absolute md:right-0 max-md:left-1/2 max-md:transform max-md:-translate-x-1/2  max-md:top-[-10%] md:bottom-0 md:w-[17rem] w-[15rem]  ">
              <img src={four} alt="Timely Repayment" className="feature-img" />
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
      <section id="smart-udhar-app"  className="  py-10 px-20 max-md:px-10 max-sm:px-5  app-section flex lg:flex-row flex-col-reverse  items-center justify-between gap-10">
        <div className="smart-left">
          <h2>
            Smart Credit. Easy Collections. Get{" "}
            <span className="highlight">SmartUdhar</span> Free!
          </h2>
          <p>
            Track payments, send reminders, manage udhar, invoices, and credit
            scores - all-in-one app to grow your business faster.
          </p>
          <div className="store-buttons gap-5 md:gap-7">
            <a href="#" className=" w-36 md:w-60 " >
              <img src={apple} alt="Apple Store" />
            </a>
            <a href="#" className=" w-36 md:w-60 " >
              <img src={playstore} alt="Google Play" />
            </a>
          </div>
        </div>
        <div className="smart-right">
          <img src={app} alt="App Screenshot 1" className="max-h-[65vh] object-contain " />
        </div>
      </section>
      {/* App section end */}

      <FAQSection />

      <Footer/>
 
    </div>
  );
};

export default Homepage;
