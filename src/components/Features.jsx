import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faBuildingColumns,
  faRobot,
  faCheckCircle,
  faClock,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

export default function Features() {
  return (
    <section id="features" className="bg-white py-12 lg:py-20 px-4 sm:px-6 lg:px-16 border-t border-[#DCE1E7] scroll-mt-20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* ==================== SECTION HEADER ==================== */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5E6D8] text-[#E8792E] text-xs font-bold tracking-wide uppercase">
            <FontAwesomeIcon icon={faStar} />
            <span>Platform Highlights & Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2430] tracking-tight">
            Intelligent Admissions, <br className="hidden sm:inline" />
            <span className="text-[#E8792E]">Made Effortless</span>
          </h2>
          <p className="text-sm sm:text-base text-[#8B93A1] leading-relaxed max-w-2xl mx-auto">
            ApplyNow replaces outdated paper trails and confusing portals with a unified,
            AI-assisted platform connecting ambitious students with accredited Nigerian universities.
          </p>
        </div>

        {/* ==================== CORE 4 FEATURE BOXES ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1: Quick 3-Minute Application */}
          <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-[#DCE1E7] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F5E6D8] text-[#E8792E] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faBolt} />
              </div>
              <h3 className="text-lg font-bold text-[#1F2430]">
                Quick 3-Minute Application
              </h3>
              <p className="text-xs sm:text-sm text-[#8B93A1] leading-relaxed">
                Fill in your personal, academic, and sponsor details once. Submit verified dossiers across faculties without re-entering redundant information.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-semibold text-[#E8792E]">
              <span>Fast-track workflow</span>
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500" />
            </div>
          </div>

          {/* Feature 2: AI Eligibility Predictor */}
          <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-[#DCE1E7] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faRobot} />
              </div>
              <h3 className="text-lg font-bold text-[#1F2430]">
                AI Eligibility Predictor
              </h3>
              <p className="text-xs sm:text-sm text-[#8B93A1] leading-relaxed">
                Smart algorithm benchmarks your JAMB score and O'Level credits against official cut-offs, providing an instant probability rating before applying.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-semibold text-indigo-600">
              <span>Predictive analysis</span>
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500" />
            </div>
          </div>

          {/* Feature 3: Top Accredited Institutions */}
          <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-[#DCE1E7] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faBuildingColumns} />
              </div>
              <h3 className="text-lg font-bold text-[#1F2430]">
                Top Accredited Institutions
              </h3>
              <p className="text-xs sm:text-sm text-[#8B93A1] leading-relaxed">
                Browse leading Federal, State, and Private Nigerian universities. Transparent cutoffs, departmental criteria, and verified faculty listings.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-semibold text-amber-600">
              <span>Direct partnerships</span>
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500" />
            </div>
          </div>

          {/* Feature 4: Real-Time Live Tracking */}
          <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-[#DCE1E7] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faClock} />
              </div>
              <h3 className="text-lg font-bold text-[#1F2430]">
                Real-Time Live Tracking
              </h3>
              <p className="text-xs sm:text-sm text-[#8B93A1] leading-relaxed">
                Receive instant status updates as admissions panels review your dossier. Watch your application progress from Pending to Approved directly on your dashboard.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-semibold text-emerald-600">
              <span>Zero guesswork</span>
              <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
