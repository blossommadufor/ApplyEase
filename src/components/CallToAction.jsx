import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";

export default function CallToAction() {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-16 border-t border-[#DCE1E7]">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#1E2432] rounded-3xl p-8 sm:p-12 lg:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
          <div className="space-y-4 max-w-xl text-center md:text-left z-10">
            <span className="inline-block text-xs uppercase font-bold tracking-wider text-[#E8792E] bg-white/10 px-3 py-1 rounded-full border border-white/10">
              Fast Track Admission
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
              Ready to Submit Your Application in Minutes?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              No multiple registration scratch cards, no queues, and no tedious paperwork. Choose your target Nigerian university, verify your prerequisites, and launch your application with total clarity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 z-10 w-full sm:w-auto">
            <button
              onClick={() => navigate("/select-university")}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#E8792E] hover:bg-[#C96A28] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer group"
            >
              <FontAwesomeIcon icon={faBolt} className="group-hover:rotate-12 transition-transform" />
              <span>Start Quick Application</span>
            </button>
          </div>

          {/* Decorative background glow accents */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#E8792E]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-10 -top-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}

