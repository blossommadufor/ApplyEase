import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faFileArrowUp,
  faCheckCircle,
  faArrowRight,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: faUserPlus,
      tag: "1-Minute Setup",
      title: "Create Your Account",
      text: "Sign up with your personal contact info and select your desired tertiary institution and field of study.",
    },
    {
      step: "02",
      icon: faFileArrowUp,
      tag: "Verified Credentials",
      title: "Submit Academic Dossier",
      text: "Enter your O'Level grades, secondary school records, and UTME scores through our guided step-by-step form.",
    },
    {
      step: "03",
      icon: faCheckCircle,
      tag: "Live Decision",
      title: "Track & Get Admitted",
      text: "Follow your application status live from Under Review to Approval, receiving instant updates directly on your dashboard.",
    },
  ];

  return (
    <section id="howitworks" className="bg-[#F8FAFC] py-20 px-4 sm:px-6 lg:px-16 border-t border-[#DCE1E7] scroll-mt-20">
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5E6D8] text-[#E8792E] text-xs font-bold tracking-wide uppercase">
            <FontAwesomeIcon icon={faListCheck} />
            <span>Simple 3-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2430] tracking-tight">
            How ApplyEase Works
          </h2>
          <p className="text-sm sm:text-base text-[#8B93A1] leading-relaxed">
            Go from candidate to admitted university student in three straightforward, transparent steps.
          </p>
        </div>

        {/* Steps Grid with Visual Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className="bg-white p-8 rounded-2xl border border-[#DCE1E7] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative group hover:-translate-y-1"
            >
              {/* Step indicator header */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#F5E6D8] text-[#E8792E] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-[#E8792E] group-hover:text-white transition-colors">
                    Step {item.step}
                  </span>
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8792E] block mb-1.5">
                  {item.tag}
                </span>
                <h3 className="text-xl font-bold text-[#1F2430] mb-3 group-hover:text-[#E8792E] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-[#8B93A1] leading-relaxed">
                  {item.text}
                </p>
              </div>

              {/* Step progress footer */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Phase {index + 1} of 3</span>
                {index < 2 && (
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-slate-300 group-hover:text-[#E8792E] group-hover:translate-x-1 transition-all"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}