import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import star from "../../assets/homepage/testimonial/star.png";
import review1 from "../../assets/homepage/testimonial/review2.webp";
import review2 from "../../assets/homepage/testimonial/review1.webp";
import review3 from "../../assets/homepage/testimonial/review3.webp";

// ✅ Correct imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";


import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonials = [
  {
    id: 1,
    name: "Anjali Shah",
    role: "Home Tutor, Ahmedabad",
    text: "I now send professional invoices and share my repayment record with clients.",
    desc: "Hear how SMARTUDHAR is transforming small businesses with smarter credit tracking, timely reminders, and simplified financial management tools.",
    img: review1,
  },
  {
    id: 2,
    name: "Rahul Verma",
    role: "Shop Owner, Delhi",
    text: "Managing client payments is now effortless and transparent.",
    desc: "SMARTUDHAR has simplified my finances, improved trust, and saved me hours of manual work.",
    img: review2,
  },
  {
    id: 3,
    name: "Priya Mehta",
    role: "Freelancer, Mumbai",
    text: "With SmartUdhar, I can manage multiple clients easily.",
    desc: "The reminders and repayment tracking keep me stress-free and focused on work instead of chasing payments.",
    img: review3,
  },
];

export default function TestimonialSlider() {
  return (
    <div className="bg-[#0B0C1A] py-20">
      {/* Header */}
      <div className="px-5 sm:px-10 md:px-20 flex flex-col lg:flex-row justify-between gap-6">
        <div className="flex-1 text-center lg:text-left">
          <p className="  text-blue-500 tracking-wide text-sm  ">
            Testimonials
          </p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white">
            Small Businesses, <span className="text-blue-500">Big Impact</span>
          </h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto lg:mx-0">
            Hear how SMARTUDHAR is transforming small businesses with smarter
            credit tracking, timely reminders, and simplified financial
            management tools.
          </p>
        </div>

        <div className="text-center lg:text-left">
          <div className="flex justify-center lg:justify-start gap-1 my-2">
            {[...Array(5)].map((_, i) => (
              <img key={i} src={star} alt="star" className="w-7 h-7" />
            ))}
          </div>
          <h3 className="text-lg md:text-2xl font-semibold text-white">
            Our Positive Social Impact
          </h3>
          <p className="text-sm md:text-base text-gray-400">
            5-star favorite for smart udhar management.
          </p>
        </div>
      </div>

      {/* Slider */}
      <div className="relative px-5 sm:px-10 md:px-20 w-full max-w-6xl mx-auto py-12">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            nextEl: ".prev-btn",
            prevEl: ".next-btn",
          }}
          
          spaceBetween={20}
          pagination={{
            clickable: true,
            
           }}
          loop={true}
          className="w-full rounded-2xl"
        >
          {testimonials.map((item) => (
            <SwiperSlide
              key={item.id}
              className="grid items-stretch " // 👈 ensures equal height
            >
              <div className="bg-white rounded-2xl shadow-lg py-10  px-5  sm:px-10 md:px-12 flex flex-col md:flex-row items-center gap-6 w-full h-full">
                {/* Image */}
                <div className="relative flex-shrink-0">
                  <div className="absolute -top-3 -left-3 w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-blue-600 rounded-full -z-10"></div>
                  <img
                    src={item.img}
                    alt={item.name}
                    className=" w-[14rem] md:w-[18rem]   rounded-full object-cover border-4 border-white"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between text-center md:text-left">
                  <div>
                    <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-3">
                      “{item.text}”
                    </p>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                      {item.desc}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-600 font-semibold">{item.name}</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button className="prev-btn max-md:hidden absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 bg-white/10 border border-white text-white p-2 sm:p-3 rounded-full hover:bg-white/20 transition">
          <FaArrowLeft />
        </button>
        <button className="next-btn max-md:hidden absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 bg-white/10 border border-white text-white p-2 sm:p-3 rounded-full hover:bg-white/20 transition">
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
