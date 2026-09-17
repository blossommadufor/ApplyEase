import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What documents do I need to submit my application?",
      answer: "You typically need your O'-Level results, birth certificate, passport photograph, and any specific institutional prerequisite documents outlined during your application wizard flow.",
    },
    {
      question: "Can I edit my application after submitting?",
      answer: "Once an application is formally submitted, edits are restricted unless unlocked by the institutional admissions officer. However, you can save your progress as a draft anytime before final submission.",
    },
    {
      question: "How do I track my admission status?",
      answer: "Log into your account dashboard to view real-time updates, status changes, and notifications regarding your program evaluation directly.",
    },
    {
      question: "Is my payment and data secure?",
      answer: "Yes, ApplyEase utilizes secure encryption protocols to protect your personal information, academic files, and transaction details at every step.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto px-6 lg:px-16 py-16 border-t border-[#DCE1E7]">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#1F2430]">Frequently Asked Questions</h2>
        <p className="text-[#8B93A1] mt-2 text-sm sm:text-base">
          Got questions? We've got answers to help guide your application process.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-xl border border-[#DCE1E7] overflow-hidden shadow-sm">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between font-semibold text-[#1F2430] hover:bg-slate-50 transition"
            >
              <span>{faq.question}</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-xs text-[#8B93A1] transition-transform duration-200 ${
                  openIndex === index ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-sm text-[#8B93A1] leading-relaxed border-t border-slate-100 pt-3">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;