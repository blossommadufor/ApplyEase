import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faCircleQuestion,
  faComments,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Eligibility & Requirements", "Applications & Tracking", "Security & Support"];

  const faqs = [
    {
      id: 1,
      category: "Eligibility & Requirements",
      question: "What documents and credentials do I need to submit my application?",
      answer:
        "You typically need your official O'Level statement of results (WAEC, NECO, or NABTEB), your UTME/JAMB score details, a recent passport photograph, and secondary school graduation information. Departmental prerequisites (such as specific science or commercial subject combinations) are validated automatically as you choose your degree course.",
    },
    {
      id: 2,
      category: "Eligibility & Requirements",
      question: "How does the AI Eligibility Predictor calculate my admission odds?",
      answer:
        "Our engine benchmarks your aggregate JAMB score against the official departmental cut-off for your chosen program, while simultaneously validating that your 5 O'Level credits meet the prerequisite cluster. It produces an objective percentage likelihood rating (e.g. 92% High Likelihood) so you can apply with complete clarity.",
    },
    {
      id: 3,
      category: "Applications & Tracking",
      question: "Can I apply to multiple universities with a single profile?",
      answer:
        "Yes! One of the major advantages of ApplyEase is 'One Profile, Multiple Submissions'. Once your personal bio, secondary school transcripts, and guardian information are completed, you can submit verified dossiers to multiple Federal, State, and Private partner institutions without filling out repetitive paperwork.",
    },
    {
      id: 4,
      category: "Applications & Tracking",
      question: "Can I edit my application after formal submission?",
      answer:
        "Once a dossier is formally submitted, edits are temporarily locked to maintain admission review integrity. However, if an admissions board requires further documentation or clarification, they can request an update through your dashboard, allowing you to update specific fields seamlessly.",
    },
    {
      id: 5,
      category: "Applications & Tracking",
      question: "How quickly do partner institutions review my application?",
      answer:
        "Because applicant credentials and prerequisite combinations are pre-validated by ApplyEase, university admissions officers can review complete dossiers much faster than conventional manual queues—typically providing real-time dashboard status updates within 48 to 72 hours.",
    },
    {
      id: 6,
      category: "Security & Support",
      question: "Is my personal data, JAMB score, and payment secure?",
      answer:
        "Yes. ApplyEase utilizes industry-grade end-to-end encryption protocols to protect your personal identity, academic records, and transaction logs. Your data is strictly transmitted to authorized admissions officers at your chosen universities.",
    },
  ];

  const filteredFaqs =
    activeCategory === "All"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-[#F8FAFC] py-20 lg:py-28 px-4 sm:px-6 lg:px-16 border-t border-[#DCE1E7] scroll-mt-20">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* ==================== SECTION HEADER ==================== */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5E6D8] text-[#E8792E] text-xs font-medium tracking-wide uppercase">
            <FontAwesomeIcon icon={faCircleQuestion} />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2430] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-[#8B93A1] leading-relaxed">
            Everything you need to know about eligibility matching, application workflows, and university review cycles.
          </p>
        </div>

        {/* ==================== CATEGORY FILTER PILLS ==================== */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
              className={`text-xs sm:text-sm px-4 py-2 rounded-xl font-medium transition cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#1E2432] text-white shadow-xs"
                  : "bg-white text-slate-600 border border-[#DCE1E7] hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ==================== ACCORDION LIST ==================== */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-[#E8792E]/60 shadow-md ring-1 ring-[#E8792E]/20"
                    : "border-[#DCE1E7] shadow-xs hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className={`text-xs font-mono font-medium px-2 py-0.5 rounded ${
                        isOpen
                          ? "bg-[#F5E6D8] text-[#E8792E]"
                          : "bg-slate-100 text-slate-500 group-hover:bg-[#F5E6D8] group-hover:text-[#E8792E]"
                      } transition-colors shrink-0`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-medium text-sm sm:text-base text-[#1F2430] group-hover:text-[#E8792E] transition-colors leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                      isOpen
                        ? "bg-[#E8792E] text-white rotate-180"
                        : "bg-slate-100 text-slate-500 group-hover:bg-[#F5E6D8] group-hover:text-[#E8792E]"
                    }`}
                  >
                    <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-[#8B93A1] leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                    <div className="mt-3.5 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Category: <strong className="text-slate-600 font-semibold">{faq.category}</strong></span>
                      <span className="text-[#E8792E] font-medium">Verified policy</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ==================== STILL HAVE QUESTIONS CARD ==================== */}
        <div className="bg-white rounded-2xl border border-[#DCE1E7] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-12 h-12 rounded-xl bg-[#F5E6D8] text-[#E8792E] flex items-center justify-center text-xl shrink-0">
              <FontAwesomeIcon icon={faComments} />
            </div>
            <div>
              <h4 className="font-medium text-base text-[#1F2430]">
                Still have questions?
              </h4>
              <p className="text-xs sm:text-sm text-[#8B93A1] mt-0.5">
                Can't find the answer you need? Our admissions advisory team is ready to guide you.
              </p>
            </div>
          </div>

          <a
            href="mailto:support@applyease.ng"
            className="px-5 py-2.5 bg-[#1E2432] hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 shrink-0 cursor-pointer shadow-xs"
          >
            <span>Contact Support</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs text-[#E8792E]" />
          </a>
        </div>
      </div>
    </section>
  );
}