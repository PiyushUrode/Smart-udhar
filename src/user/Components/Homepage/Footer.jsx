
// import logo1 from "../assets/logo/logo2.png"
// import youtube from "../assets/socialmedia/YouTube.png"
// import twiter from "../assets/socialmedia/Twitter.png"
// import Telegram from "../assets/socialmedia/Telegram App.png"
// import Instagram from "../assets/socialmedia/Instagram.png"
// import Medium from "../assets/socialmedia/Medium.png"
import facebook from "../../assets/homepage/Footer/facebook.png";
import twitter from "../../assets/homepage/Footer/twitter.png";
import instagram from "../../assets/homepage/Footer/instagram.png";
import telegram from "../../assets/homepage/Footer/telegram.png";

import call from "../../assets/homepage/Footer/call.png";
import whatsapp from "../../assets/homepage/Footer/logos_whatsapp-icon.png";
import mail from "../../assets/homepage/Footer/logos_google-gmail.png";
import downloadBtn from "../../assets/homepage/app-download.png";

import logo1 from "../../assets/logo/logo_hr.png"

import { useState } from "react"
import { useEffect } from "react"
import { FaClock } from "react-icons/fa";
// import {Link} from "react-router-dom"

const Footer = () => {
    const [CurrentYear, setCurrentYear] = useState()

    useEffect(() => {
        setCurrentYear(new Date().getFullYear())
    }, [])
    return (
        <>
            <footer className="  bg-[#101010] z-9999  rounded-t-2xl ">
                <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8 z-10">
                    <div className="md:flex gap-5 md:justify-between max-md:justify-center z-10">

                        <div className=" flex  flex-col gap-5 mb-6 max-w-[40%] max-md:max-w-[100%] max-md:items-center  md:mb-0">
                            <a href="" className="flex items-center">
                                <img src={logo1} className="h-[50px] me-3" alt="FlowBite Logo" />
                                {/* <span className="self-center text-primary-gradient text-4xl font-bold whitespace-nowrap  text-white">Logo  </span> */}
                            </a>
                            <p className=" max-md:text-center text-white " > Join thousands of businesses using SmartUdhar to manage credit, track payments, and grow smarter—start free today with just your mobile.</p>
                            <div className="flex gap-5" >
                                <a target="blank" href=" "> <img className="w-10 hover:scale-[1.1] transition-all ease-in-out duration-200 " src={facebook} alt="" /> </a>
                                <a target="blank" href=" "> <img className="w-10 hover:scale-[1.1] transition-all ease-in-out duration-200 " src={twitter} alt="" /> </a>
                                <a target="blank" href=" "> <img className="w-10 hover:scale-[1.1] transition-all ease-in-out duration-200 " src={instagram} alt="" /> </a>
                                <a target="blank" href=" "> <img className="w-10 hover:scale-[1.1] transition-all ease-in-out duration-200 " src={telegram} alt="" /> </a>
                                
                            </div>
                        </div>
                        <div className=" mt-16 mt- flex gap-[5vmax] max-md:justify-evenly max-md:flex-wrap z-10">
                            <div className=" flex flex-col max-md:items-center " >
                                <h2 className=" underline underline-offset-4 mb-6 text-sm font-semibold   uppercase text-white">Quick Links</h2>
                                <ul className="  text-gray-400 font-medium">
                                    <li className="mb-4 max-md:text-center  ">
                                        <a href="#Hero" className="unline  hover:underline hover:text-white " >About</a>
                                    </li>
                                    <li className="mb-4  max-md:text-center  " >
                                        <a href="#About-us" className="hover:underline hover:text-white">Whay choose</a>
                                    </li>
                                    <li className="  max-md:text-center  " >
                                        <a href="#About-us" className="hover:underline hover:text-white">Testimonials</a>
                                    </li>
                                </ul>
                            </div>
                            <div className=" flex flex-col max-md:items-center ">
                                <h2 className=" underline underline-offset-4 mb-6 text-sm font-semibold  uppercase text-white">Legal</h2>
                                <ul className="  text-gray-400 font-medium">
                                    <li className="mb-4 max-md:text-center">
                                        <a href="#" className="hover:underline hover:text-white">Privacy Policy</a>
                                    </li>
                                    <li className="  max-md:text-center  ">
                                        <a href="#" className="hover:underline hover:text-white">Terms &amp; Conditions</a>
                                    </li>
                                </ul>
                            </div>
                            <div className=" flex flex-col max-md:items-center ">
                                <h2 className=" underline underline-offset-4 mb-6 text-sm font-semibold   uppercase text-white">Contact</h2>
                                <ul className="  flex flex-col justify-center  text-gray-400 font-medium">
                                    <li className=" flex items-center gap-2 mb-3 max-md:text-center">
                                        <img
                                            src={call}
                                            alt=""
                                            className=" aspect-[1/1] w-3 h-3 "
                                        />
                                        <a href="#" className="hover:underline hover:text-white"> +91-XXXXXXXXXX</a>
                                    </li>
                                    <li className=" flex items-center gap-2 mb-3 max-md:text-center  ">
                                        <img
                                            src={whatsapp}
                                            alt=""
                                            className=" aspect-[1/1] w-3 h-3 "
                                        />
                                        <a href="#" className="hover:underline hover:text-white">support@smartudhar.in</a>
                                    </li>
                                    <li className=" flex items-center gap-2 mb-3 max-md:text-center  ">
                                        <img
                                            src={mail}
                                            alt=""
                                            className=" aspect-[1/1] w-3 h-3 "
                                        />
                                        <a href="#" className="hover:underline hover:text-white">WhatsApp Support</a>
                                    </li>
                                    <li className=" flex items-center gap-2  max-md:text-center  ">
                                        <FaClock className="w-3 h-3" />
                                        <a href="#" className="hover:underline hover:text-white">Mon-Sat, 10am - 7pm</a>
                                    </li>





                                </ul>
                            </div>
                        </div>
                    </div>
                    <hr className="my-6  border-gradient   border-gray-700 lg:my-8" />
                    <div className=" flex md:flex-row  flex-col gap-6 justify-between  items-center   ">
                        <div className="text-sm      text-gray-400">© {CurrentYear} <a href="" className="hover:underline hover:text-white">Smart Udhar</a>. All Rights Reserved.
                        </div>
                        <div className="   ">
                            <img
                                src={downloadBtn}
                                alt="Download SmartUdhar"
                                className=" w-48  "
                            />
                        </div>
                    </div>
                </div>
            </footer>

        </>
    )
}

export default Footer