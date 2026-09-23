import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faArrowRight,
  faGraduationCap,
  faMapMarkerAlt,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { NIGERIAN_UNIVERSITIES } from "../universitiesdata";

export default function TopInstitutions() {
  const navigate = useNavigate();
  // Spotlight 4 top Nigerian institutions
  const spotlightInstitutions = NIGERIAN_UNIVERSITIES.slice(0, 4);

  return (
    <section id="institutions" className="bg-white py-16 px-4 sm:px-6 lg:px-16 border-t border-[#DCE1E7] scroll-mt-20">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-5">
              <FontAwesomeIcon icon={faAward} className="text-[#E8792E]" />
              <span>Partner Universities</span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F2430]">
              Featured Top Institutions
            </h3>
            <p className="text-xs sm:text-sm text-[#8B93A1] mt-4 max-w-xl">
              Directly connected to ApplyEase for swift dossier transmission, verified requirements, and automated status updates.
            </p>
          </div>

          <button
            onClick={() => navigate("/select-university")}
            className="text-xs sm:text-sm font-bold text-[#E8792E] hover:text-[#C96A28] transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <span>Explore All {NIGERIAN_UNIVERSITIES.length} Universities</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>

        {/* Institutions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {spotlightInstitutions.map((uni) => (
            <div
              key={uni.id}
              className="bg-white rounded-2xl border border-[#DCE1E7] p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {uni.type} Institution
                  </span>
                  <span className="text-[11px] font-mono text-[#E8792E] bg-[#F5E6D8] px-2 py-0.5 rounded font-bold">
                    Cutoff {uni.courses[0]?.jambCutoff || 200}+
                  </span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#1E2432] group-hover:bg-[#F5E6D8] group-hover:text-[#E8792E] transition-colors flex items-center justify-center text-lg mb-3">
                  <FontAwesomeIcon icon={faGraduationCap} />
                </div>

                <h4 className="text-base font-bold text-[#1F2430] group-hover:text-[#E8792E] transition-colors line-clamp-2">
                  {uni.name}
                </h4>

                <div className="flex items-center gap-1.5 text-xs text-[#8B93A1] mt-2 mb-4">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#E8792E] text-[11px]" />
                  <span>{uni.state} State, Nigeria</span>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faFileAlt} className="text-slate-400" />
                    Programs:
                  </span>
                  <span className="font-bold text-slate-800">
                    {uni.courses.length} Accredited Courses
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/auth?mode=signin`)}
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-[#E8792E] hover:text-white text-slate-800 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Select Courses</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

