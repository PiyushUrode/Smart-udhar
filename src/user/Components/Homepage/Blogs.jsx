import React from "react";
import img1 from "../../assets/homepage/blog/blog1.png";
import img2 from "../../assets/homepage/blog/blog2.png";
import img3 from "../../assets/homepage/blog/blog3.png";
import { FiArrowUpRight } from "react-icons/fi";

const cards = [
  {
    tag: "Modern Udhar",
    title: "Modern Udhar for Local Shops",
    desc: "Empower your local shop with modern digital udhar—track credit, send reminders, and get paid faster, all from your phone.",
    img: img1,
  },
  {
    tag: "Grow Faster",
    title: "Grow Faster with Smart Udhar",
    desc: "Empower your local shop with modern digital udhar—track credit, send reminders, and get paid faster, all from your phone.",
    img: img2,
  },
  {
    tag: "Modern Udhar",
    title: "Your Business, Smarter with Udhar",
    desc: "Empower your local shop with modern digital udhar—track credit, send reminders, and get paid faster, all from your phone.",
    img: img3,
  },
];

const Blogs = () => {
  return (
    <div className="cards-section">
      {cards.map((card, index) => (
        <div className="card" key={index}>
          <img src={card.img} alt={card.title} className="card-image" />
          <p className="card-tag">{card.tag}</p>
          <h3 className="card-title">{card.title}</h3>
          <p className="card-desc">{card.desc}</p>
          <button className="card-btn">
            <FiArrowUpRight />
          </button>
        </div>
      ))}
    </div>
  );
};

export default  Blogs;
