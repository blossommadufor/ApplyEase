import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSlidersH,
  faCheckCircle,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export default function LiveEvaluation() {
  const navigate = useNavigate();
  const [activeExampleIndex, setActiveExampleIndex] = useState(0);

  const exampleScenarios = [
    {
      id: "unilag-cs",
      studentName: "Jamona Damer",
      targetUni: "University of Lagos (UNILAG)",
      targetProgram: "B.Sc. Computer Science",
      jambScore: 285,
      cutoff: 200,
      olevelStatus: "Verified (5 Credits: Eng, Math, Phys, Chem, Bio)",
      matchScore: 94,
      matchGrade: "High Likelihood",
      reviewNotes:
        "Score is +85 points above departmental cut-off. Prerequisites fully satisfied.",
    },
    {
      id: "ui-med",
      studentName: "Sarah Cole",
      targetUni: "University of Ibadan (UI)",
      targetProgram: "Medicine and Surgery (MBBS)",
      jambScore: 298,
      cutoff: 200,
      olevelStatus: "Verified (5 Credits, single sitting)",
      matchScore: 91,
      matchGrade: "High Likelihood",
      reviewNotes:
        "Single-sitting O'Level requirement met. Exceptional UTME performance.",
    },
    {
      id: "covenant-eng",
      studentName: "Tunde Adeyemi",
      targetUni: "Covenant University (CU)",
      targetProgram: "B.Eng. Computer Engineering",
      jambScore: 260,
      cutoff: 180,
      olevelStatus: "Verified (Further Maths included)",
      matchScore: 88,
      matchGrade: "Strong Match",
      reviewNotes:
        "Solid engineering aptitude profile with verified STEM subject cluster.",
    },
  ];

  const currentExample = exampleScenarios[activeExampleIndex];

  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-[#1E2432] to-[#2A3245] rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-xl">
          {/* Header & Scenario Selector */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 border-b border-slate-700/60 pb-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#E8792E] flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faSlidersH} />
                Live Example & Evaluation
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold">
                See How ApplyEase Evaluates Eligibility
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-4 max-w-xl">
                Select an applicant scenario below to inspect how ApplyEase calculates eligibility, matches departmental criteria, and prepares applications.
              </p>
            </div>

            {/* Scenario Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {exampleScenarios.map((scenario, idx) => (
                <button
                  key={scenario.id}
                  onClick={() => setActiveExampleIndex(idx)}
                  className={`text-xs px-3.5 py-2 rounded-xl font-medium transition cursor-pointer ${
                    activeExampleIndex === idx
                      ? "bg-[#E8792E] text-white shadow-sm"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  Example {idx + 1}: {scenario.targetUni.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Showcase Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Applicant Dossier Snapshot */}
            <div className="lg:col-span-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E8792E] flex items-center justify-center text-white font-bold text-sm">
                    {currentExample.studentName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {currentExample.studentName}
                    </h4>
                    <p className="text-xs text-slate-300">Applicant Dossier</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  Verified Profile
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="text-slate-400 block mb-1">Target University</span>
                  <span className="font-semibold text-white truncate block">
                    {currentExample.targetUni}
                  </span>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="text-slate-400 block mb-1">Selected Program</span>
                  <span className="font-semibold text-white truncate block">
                    {currentExample.targetProgram}
                  </span>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="text-slate-400 block mb-1">JAMB Score / Cutoff</span>
                  <span className="font-semibold text-[#E8792E]">
                    {currentExample.jambScore} pts{" "}
                    <span className="text-slate-400 font-normal">
                      (Min: {currentExample.cutoff})
                    </span>
                  </span>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <span className="text-slate-400 block mb-1">O'Level Status</span>
                  <span className="font-semibold text-emerald-300">Verified</span>
                </div>
              </div>

              <div className="bg-black/20 p-3 rounded-xl border border-white/5 text-xs">
                <span className="text-slate-400 block mb-1">Secondary Credential Check</span>
                <p className="text-slate-200">{currentExample.olevelStatus}</p>
              </div>
            </div>

            {/* Right: AI Prediction & Decision Output */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 text-[#1F2430] shadow-md space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    AI Match Engine
                  </span>
                  <h4 className="text-lg font-bold text-[#1F2430]">
                    Admission Likelihood
                  </h4>
                </div>
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg border-2 border-emerald-500 shadow-xs">
                  {currentExample.matchScore}%
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>Recommendation: {currentExample.matchGrade}</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  {currentExample.reviewNotes}
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span>Prerequisite Subject Mapping</span>
                  <span className="font-semibold text-emerald-600">100% Match</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span>Departmental Quota Benchmark</span>
                  <span className="font-semibold text-slate-800">Top 10% Percentile</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Estimated Processing Time</span>
                  <span className="font-semibold text-slate-800">24 - 48 Hours</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/select-university")}
                className="w-full py-3 bg-[#E8792E] hover:bg-[#C96A28] text-white font-semibold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Calculate My Admission Odds</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

