import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBuildingColumns, faMapMarkerAlt, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { NIGERIAN_UNIVERSITIES } from "../universitiesdata";
import { useOnboarding } from "../context/OnboardingContext";

export const SelectUniversity = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { updateFormData } = useOnboarding();

  const filteredUniversities = NIGERIAN_UNIVERSITIES.filter(
    (uni) =>
      uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUniversity = (uni) => {
    // 1. Save chosen university into OnboardingContext
    updateFormData({
      university: uni.name,
      selectedUniversity: uni.name,
      universityId: uni.id,
    });

    // 2. Persist to localStorage as a backup against page refreshes
    localStorage.setItem("selectedUniversity", uni.name);
    localStorage.setItem("selectedUniversityId", uni.id);

    // 3. Navigate to course selection step
    navigate(`/select-course/${uni.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#1F2430]">
      <div className="bg-[#1E2432] text-white py-12 md:py-20 px-6 text-center">
        <h1 className="text-4xl font-extrabold mb-5 uppercase">Select a Tertiary Institution</h1>
        <p className="text-slate-300 text-sm max-w-lg mx-auto mb-6">
          Choose from partner Nigerian universities using ApplyEase to process admissions.
        </p>

        <div className="max-w-xl mx-auto relative flex items-center">
          <FontAwesomeIcon icon={faSearch} className="absolute left-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search university by name or state (e.g. UNILAG, Lagos)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-[#1F2430] placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8792E] shadow-lg"
          />
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-xl font-bold mb-7 text-[#1F2430]">Available Partner Universities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUniversities.map((uni) => (
            <div
              key={uni.id}
              onClick={() => handleSelectUniversity(uni)}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-[#E8792E] hover:shadow-md transition cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-[#1E2432] text-xl font-bold">
                  <FontAwesomeIcon icon={faBuildingColumns} />
                </div>
                <div>
                  <h3 className="font-bold text-base group-hover:text-[#E8792E] transition">{uni.name}</h3>
                  <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-slate-400" /> {uni.state}
                  </span>
                </div>
              </div>
              <FontAwesomeIcon icon={faChevronRight} className="text-slate-400 group-hover:text-[#E8792E] group-hover:translate-x-1 transition" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};