import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faQuoteLeft,
  faCheckCircle,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Chiamaka Okafor",
      program: "B.Sc. Computer Science",
      university: "University of Lagos (UNILAG)",
      initials: "CO",
      rating: 5,
      jambScore: "284 JAMB",
      comment:
        "I was worried my UTME score wouldn't meet the departmental cutoff. ApplyNow's eligibility match engine showed me exactly where I stood and how my O'Level subjects clustered. I tracked my status live and received my admission notification seamlessly!",
    },
    {
      id: 2,
      name: "Emeka Babatunde",
      program: "Medicine & Surgery (MBBS)",
      university: "University of Ibadan (UI)",
      initials: "EB",
      rating: 5,
      jambScore: "296 JAMB",
      comment:
        "Filling redundant application forms repeatedly for each school was frustrating and costly. ApplyNow allowed me to verify my academic credentials once and submit my complete dossier with a single click. The transparency is unmatched.",
    },
    {
      id: 3,
      name: "Amina Bello",
      program: "B.Eng. Computer Engineering",
      university: "Covenant University (CU)",
      initials: "AB",
      rating: 5,
      jambScore: "272 JAMB",
      comment:
        "The interface is clean and completely stress-free. From checking subject prerequisites to seeing the AI evaluation breakdown, every step gave me confidence. It completely removed the anxiety from university admissions.",
    },
  ];

  return (
    <section className="bg-[#F8FAFC] py-20 px-4 sm:px-6 lg:px-16 border-t border-[#DCE1E7]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5E6D8] text-[#E8792E] text-xs font-bold tracking-wide uppercase">
            <FontAwesomeIcon icon={faStar} />
            <span>Student Success Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2430] tracking-tight">
            Trusted by Ambitious Students
          </h2>
          <p className="text-sm sm:text-base text-[#8B93A1] leading-relaxed">
            Discover how candidates use ApplyNow to benchmark cutoffs, submit verified dossiers, and secure admission into top programs.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white p-7 rounded-2xl border border-[#DCE1E7] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div className="space-y-4">
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#E8792E] text-xs">
                    {[...Array(item.rating)].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} />
                    ))}
                  </div>
                  <FontAwesomeIcon
                    icon={faQuoteLeft}
                    className="text-slate-200 group-hover:text-[#F5E6D8] transition-colors text-2xl"
                  />
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-[#1F2430] leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              {/* Student Footer */}
              <div className="pt-5 mt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1E2432] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {item.initials}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#1F2430]">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-[#8B93A1] flex items-center gap-1">
                      <FontAwesomeIcon icon={faGraduationCap} className="text-[#E8792E]" />
                      <span className="truncate max-w-[130px] sm:max-w-[160px]">
                        {item.program}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Admitted
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {item.jambScore}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

