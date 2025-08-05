import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa";
import star from '../../assets/homepage/testimonial/star.png'
import review1 from '../../assets/homepage/testimonial/review1.png';
import review2 from '../../assets/homepage/testimonial/review1.png';
import review3 from '../../assets/homepage/testimonial/review1.png';
import review4 from '../../assets/homepage/testimonial/review1.png';
import review5 from '../../assets/homepage/testimonial/review1.png';

// import unionShape from '../../assets/homepage/testimonial/Union.png';

const testimonials = [
  {
    name: "Anjali Shah",
    title: "Home Tutor, Ahmedabad",
    message:
      "I now send professional invoices and share my repayment record with clients.",
    image: review1, 
  },

  {
    name: "Raj Mehta",
    title: "Retailer, Surat",
    message:
      "Smart Udhar helped me track credit and reduce collection time significantly.",
    image: review2,
  },
  {
    name: "Neha Batra",
    title: "Salon Owner, Indore",
    message:
      "It’s easy to use and my staff also understands how to send reminders.",
    image: review3,
  },
  {
    name: "Karan Yadav",
    title: "Pharmacy Owner, Lucknow",
    message:
      "No more missed payments. It’s my digital udhar register now!",
    image: review4,
  },
  {
    name: "Pooja Singh",
    title: "Boutique Owner, Bhopal",
    message:
      "My clients appreciate the professional updates. It’s improved my business image.",
    image: review5,
  },

];

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="testimonial-section">
      <div className="testimonial-header">
        <div>
          <p className="tag">Testimonials</p>
          <h2>
            Small Businesses, <span>Big Impact</span>
          </h2>
          <p className="subtext">
            Hear how SMARTUDHAR is transforming small businesses with smarter
            credit tracking, timely reminders, and simplified financial
            management tools.
          </p>
        </div>
        <div className="impact">
          <h3>Our Positive Social Impact</h3>
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={star}
                alt="star"
                className="custom-star"
              />
            ))}
          </div>

          <p className="">5-star favorite for smart udhar management.</p>
        </div>
      </div>

      <div className="testimonial-box">
        <button className="arrow left" onClick={handlePrev}>
          <FaArrowLeft />
        </button>

        <div className="testimonial-card">
          <div className="test-head">
            <h4 className="t-head">Testimonials</h4>
              <p className="desc">See what people are saying…</p>
          </div>
          <div className="review-content">
            <div className="img-circle">
              {/* <div className="img-shape" style={{ backgroundImage: `url(${unionShape})` }}> */}
              <div className="img-shape">
                <img src={testimonials[currentIndex].image} alt="client" />
              </div>
            </div>
            <div className="testimonial-content">
              <p className="quote">“{testimonials[currentIndex].message}”</p>
              <h5>{testimonials[currentIndex].name}</h5>
              <span>{testimonials[currentIndex].title}</span>
            </div>
          </div>
          
        </div>

        <button className="arrow right" onClick={handleNext}>
          <FaArrowRight />
        </button>
      </div>

      <div className="dots">
        {testimonials.map((_, idx) => (
          <div
            key={idx}
            className={`dot ${idx === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonial;
