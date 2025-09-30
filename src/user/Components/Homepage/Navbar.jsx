import { useEffect, useState } from 'react';
// import logo from "../assets/logo/logo2.png"
import { Link } from 'react-router-dom';
import logo from "../../assets/logo/logo_hr.png"
// import logo from "../assets/voip_logo (1)/voip_logo.webp"
// import { Link } from "react-router-dom"

const Navbar = () => {

    const [isScrolled, setisScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setisScrolled(window.scrollY > 0);
        }
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [])


    const [isNavVisible, setIsNavVisible] = useState(false);

    const toggleNav = () => {
        setIsNavVisible(!isNavVisible);
    };

    const closeMenu = () => {
        setIsNavVisible(false);
        window.scrollTo({
            top: 0,
            behavior: "smooth" // Optional: Smooth scrolling animation
        });

    };


    return (

        <>

            <nav
                className={` 
                     w-full z-10     top-0 start-0 border-b border-none  `}
            >
                <div className=" relative max-w-full   flex flex-wrap items-center justify-between mx-auto p-4 px-4 md:p-4 md:px-8">


                    <a href="/" onClick={closeMenu}>
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <img loading="lazy" src={logo}  className=' w-[9rem] h-auto '  alt="VOIP" />
                            {/* <h1 className=' text-4xl font-bold font-outfit  text-primary-gradient phone:text-xl ' >Logo</h1> */}
                        </div>
                    </a>


                    <div className="flex   md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <div className=" max-sm:hidden space-x-3">
                            {/* Login Button */}
                            <button className="px-6 py-3 rounded-full border border-black/10 bg-[#F1F1F1] font-InriaR font-bold text-[16px] shadow-[inset_0px_3px_2.6px_rgba(0,0,0,0.09),inset_0px_-4px_3.6px_#ffffff] transition hover:bg-gray-200">
                                <Link to= "/login" 
                                    
                                    className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent"
                                >
                                    Login
                                </Link>
                            </button>

                            {/* SmartUdhar App Button */}
                            <button   className="px-6 py-3 rounded-full text-white font-InriaR font-bold text-[16px] bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-500 hover:to-green-400 shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25),inset_0px_-4px_4px_#ffffff82] transition">
                                <Link to= "/?=smart-udhar-app" >
                                    SmartUdhar App
                                </Link>
                            </button>
                        </div>

                        



                        <button
                            onClick={toggleNav}
                            type="button"
                            className="  inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-black    rounded-lg md:hidden   focus:outline-none focus:ring-2         "
                            aria-controls="navbar-sticky1"
                            aria-expanded={isNavVisible}
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                xmlns=" "
                                fill="none"
                                viewBox="0 0 17 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 1h15M1 7h15M1 13h15"
                                />
                            </svg>
                        </button>
                    </div>


                    <div
                        id="navbar-sticky1"
                        className={`items-center  justify-between  w-full md:flex md:w-auto max-md:absolute max-md:left-0  rounded-b-xl  max-md:top-full z-[999] bg-white md:order-1 ${isNavVisible ? 'block  ' : 'hidden'
                            }`}
                    >
                        <ul className="   navcar  flex    flex-col p-4   md:py-1.5     font-medium border border-[--primary-color]  md:rounded-[50px] rounded-lg   md:space-x-[3vmax] rtl:space-x-reverse md:flex-row md:mt-0 md:border-0   text-[#595959] tablet:bg-gray-900    ">

                            <li className='md:border-none border-b-[1px]  border-gradient '>
                                <Link to="/?=about_us" onClick={closeMenu}>
                                    <div className=" font-light block py-2 px-3 text-[#595959] rounded hover:bg-gray-300 md:hover:bg-transparent md:p-0  dark:border-gray-700 hover:text-black font-outfit   "> About Us</div>
                                </Link>
                            </li>

                            <li className='md:border-none border-b-[1px] border-gradient '>
                                <Link to="/?=why-smart-udhar" onClick={closeMenu}  >
                                    <div className=" font-light block py-2 px-3 text-[#595959] rounded hover:bg-gray-300 md:hover:bg-transparent md:p-0       dark:border-gray-700 hover:text-black font-outfit ">Why Smart Udhar ?</div>
                                </Link>
                            </li>
                            {/* <li className='md:border-none border-b-[1px] border-gradient '>
                                <a to="/How-to-buy" onClick={closeMenu}>
                                    <div className=" font-light block py-2 px-3 text-[#595959] rounded hover:bg-gray-300 md:hover:bg-transparent md:p-0       dark:border-gray-700 hover:text-black font-outfit ">How to buy</div>
                                </a>
                            </li> */}
                            <li className='md:border-none border-b-[1px] border-gradient '>
                                <Link to="/?=our-impace" onClick={closeMenu}>
                                    <div className=" font-light block py-2 px-3 text-[#595959] rounded hover:bg-gray-300 md:hover:bg-transparent md:p-0       dark:border-gray-700 hover:text-black font-outfit ">Our Impace </div>
                                </Link>
                            </li>
                            <li className='md:border-none border-b-[1px] border-gradient '>
                                <Link to="/?=FAQ" onClick={closeMenu}>
                                    <div className=" font-light block py-2 px-3 text-[#595959] rounded hover:bg-gray-300 md:hover:bg-transparent md:p-0       dark:border-gray-700 hover:text-black font-outfit ">FAQ's</div>
                                </Link>
                            </li>
                            <li className=' md:hidden md:border-none border-b-[1px] border-gradient py-2 '>
                                 
                                <Link to="/login" onClick={closeMenu}>
                                    <div className=" px-6 py-3 rounded-full border border-black/10 bg-[#F1F1F1] hover:bg-gray-300 font-InriaR font-bold text-[16px] shadow-[inset_0px_3px_2.6px_rgba(0,0,0,0.09),inset_0px_-4px_3.6px_#ffffff] transition ">
                                        <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">

                                    Login
                                        </span>
                                    </div>
                                </Link>
                            </li>
                            <li className=' md:hidden md:border-none border-b-[1px] border-gradient py-2 '>
                                 
                                <Link to="/?=Roadmap" onClick={closeMenu}>
                                    <div className=" px-6 py-3 rounded-full text-white font-InriaR font-bold text-[16px] bg-gradient-to-r from-blue-600 to-green-500 shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25),inset_0px_-4px_4px_#ffffff82] transition ">
                                        <span className=" ">

                                            SmartUdhar App
                                        </span>
                                    </div>

                                     
                                </Link>
                            </li>



                        </ul>

                    </div>


                </div>
            </nav>









        </>
    )
}

export default Navbar