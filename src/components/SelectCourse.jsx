import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faCheckCircle, faTimes, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { NIGERIAN_UNIVERSITIES } from "../universitiesdata";
import { useApplications } from "../context/ApplicationsContext";

export const SelectCourse = () => {
  const { universityId } = useParams();
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  const { addApplication } = useApplications();

  const university = NIGERIAN_UNIVERSITIES.find((u) => u.id === universityId);

  if (!university) {
    return <div className="p-10 text-center">University not found.</div>;
  }

  const handleContinueToApplication = () => {
    if (!selectedCourse) return;

    addApplication(university.name, selectedCourse.name);

    navigate("/onboarding/personal-info", {
      state: { universityName: university.name, courseName: selectedCourse.name },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#1F2430] p-6 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/select-university")}
          className="text-slate-600 hover:text-[#1E2432] text-sm font-semibold flex items-center gap-2 mb-6 cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Universities
        </button>

        <div className="bg-[#1E2432] text-white rounded-2xl p-6 mb-8">
          <span className="text-xs uppercase font-bold text-[#E8792E]">Selected Institution</span>
          <h1 className="text-2xl font-extrabold">{university.name}</h1>
        </div>

        <h2 className="text-lg font-bold mb-4">Select Offered Program / Course</h2>
        <div className="space-y-3">
          {university.courses.map((course) => (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#E8792E] hover:shadow-sm cursor-pointer transition flex items-center justify-between"
            >
              <div>
                <h3 className="font-bold text-base text-[#1F2430]">{course.name}</h3>
                <span className="text-xs text-slate-500 font-medium">{course.faculty}</span>
              </div>
              <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold">
                JAMB Cut-off: {course.jambCutoff}
              </span>
            </div>
          ))}
        </div>
      </div>

      {selectedCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <div className="border-b border-slate-100 pb-4 mb-4">
              <span className="text-xs font-bold text-[#E8792E] uppercase">Admission Requirements</span>
              <h3 className="text-xl font-extrabold text-[#1F2430]">{selectedCourse.name}</h3>
              <p className="text-xs text-slate-500">{university.name}</p>
            </div>

            <div className="space-y-3 text-sm text-slate-700 mb-6">
              <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl">
                <strong className="block text-xs uppercase text-amber-800">Minimum JAMB Score Target</strong>
                <span className="text-base font-extrabold text-amber-900">{selectedCourse.jambCutoff} Points</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <strong className="block text-xs uppercase text-slate-500 mb-1">O'Level Subject Requirements</strong>
                <p className="text-xs text-slate-700">{selectedCourse.olevelReqs}</p>
              </div>

              {selectedCourse.note && (
                <p className="text-xs text-slate-500 italic">• {selectedCourse.note}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedCourse(null)}
                className="w-1/2 py-2.5 border border-slate-300 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleContinueToApplication}
                className="w-1/2 py-2.5 bg-[#E8792E] hover:bg-[#d06925] text-white font-semibold text-sm rounded-xl transition shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faCheckCircle} /> Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};