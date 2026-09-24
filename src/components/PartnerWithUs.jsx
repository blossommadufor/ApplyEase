import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandshake,
  faBuildingColumns,
  faBolt,
  faShieldHalved,
  faUsersLine,
  faArrowRight,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

export default function PartnerWithUs() {
  const benefits = [
    {
      icon: faBolt,
      title: "Automated Prerequisite Verification",
      description:
        "Instantly validate JAMB UTME scores, O'Level subject clustering, and candidate identity with zero manual data entry.",
    },
    {
      icon: faShieldHalved,
      title: "Centralized Digital Dossiers",
      description:
        "Access verified academic transcripts, WAEC/NECO result slips, and NIN identification documents securely in the cloud.",
    },
    {
      icon: faChartLine,
      title: "Calibrated Quota Management",
      description:
        "Configure departmental cutoffs and AI applicant rankings aligned with your faculty capacity and accreditation limits.",
    },
    {
      icon: faUsersLine,
      title: "Direct Candidate Engagement",
      description:
        "Publish provisional offer lists, notify candidates of missing requirements, and manage enrollment clearances in real-time.",
    },
  ];

  return (
    <section id="partner-with-us" className="py-20 lg:py-28 bg-[#1E2432] text-white relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#E8792E]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8792E]/15 text-[#E8792E] text-xs font-semibold uppercase tracking-wider border border-[#E8792E]/25">
              <FontAwesomeIcon icon={faHandshake} />
              <span>Institutional Partnerships</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Transform Your University's Admissions Process
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Join leading Nigerian tertiary institutions using ApplyNow to automate candidate screening, 
              eliminate fraudulent credentials, and streamline departmental admissions with speed and precision.
            </p>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-y border-slate-800 py-5">
              <div>
                <span className="block text-2xl sm:text-3xl font-bold text-[#E8792E]">99.8%</span>
                <span className="text-xs text-slate-400 font-medium">Verification Accuracy</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-bold text-white">4x</span>
                <span className="text-xs text-slate-400 font-medium">Faster Processing</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-bold text-emerald-400">100%</span>
                <span className="text-xs text-slate-400 font-medium">Digital & Paperless</span>
              </div>
            </div>

            {/* CTA Link Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/contact?type=partner"
                className="px-6 py-3.5 bg-[#E8792E] hover:bg-[#C96A28] text-white font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2.5 shadow-sm group cursor-pointer"
              >
                <FontAwesomeIcon icon={faBuildingColumns} />
                <span>Partner With ApplyNow</span>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-xs group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                to="/contact?type=partner"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-medium text-sm rounded-xl transition text-center border border-white/10 cursor-pointer"
              >
                Schedule an Institutional Demo
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Feature Grid Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-5 hover:border-[#E8792E]/50 hover:bg-slate-800/90 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E8792E]/20 text-[#E8792E] flex items-center justify-center text-sm mb-3.5 group-hover:scale-105 transition-transform">
                  <FontAwesomeIcon icon={benefit.icon} />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                  <span>{benefit.title}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
