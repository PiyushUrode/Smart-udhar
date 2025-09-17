import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqs = [
  {
    question: "What is Smart Udhar?",
    answer:
      "Smart Udhar is a repayment tracker and credit score builder for small businesses.",
  },
  {
    question: "Is this free to use?",
    answer: "Yes, Smart Udhar is completely free to use for all users.",
  },
  {
    question: "Is this like CIBIL?",
    answer:
      "No, CIBIL is a credit bureau for individuals. Smart Udhar helps build credit scores for small businesses through repayment tracking.",
  },
  {
    question: "Is it secure?",
    answer:
      "Yes, we use encrypted connections and secure servers to ensure your data is safe and confidential.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0); // Default first one open

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-left">
        <h2>
          Frequently Asked <span>Questions</span>
        </h2>
        <p>
          Got questions? We’ve got answers—everything you need to know about
          SmartUdhar, its features, security, and how it works.
        </p>
      </div>

      <div className="faq-right">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${openIndex === index ? "open" : ""}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              <h4>{faq.question}</h4>
              <span>{openIndex === index ? <FaMinus /> : <FaPlus />}</span>
            </div>
            {openIndex === index && <p className="faq-answer">{faq.answer}</p>}
            <hr />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
