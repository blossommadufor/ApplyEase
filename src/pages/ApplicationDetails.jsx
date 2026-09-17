// src/pages/ApplicationDetails.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApplications } from "../context/ApplicationsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheckCircle,
  faClipboardCheck,
  faLink,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";

export const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications } = useApplications();

  const app = applications.find((item) => item.id.toString() === id);

  if (!app) {
    return (
      <div className="min-h-screen bg-[#EFEFEF] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-[#1F2430]">Application Not Found</h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 bg-[#E8792E] text-white text-sm font-semibold px-5 py-2 rounded-lg"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const matchScore = app.progress || 78;

  return (
    <div className="min-h-screen bg-[#EFEFEF] text-[#1F2430] py-8 px-4 sm:px-8 lg:px-16">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-600 hover:text-black text-sm font-medium transition cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
        </button>

        {/* Main Application Status Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200 relative">
          
          {/* Top Row: Institution Info & Status Badge */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                {app.applicationId || "APP-2026-88"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] mt-1">
                {app.university}
              </h1>
              <p className="text-sm text-slate-500 font-medium">{app.course}</p>
            </div>
            
            <span className="bg-[#EAB308]/15 text-[#CA8A04] border border-[#EAB308]/30 px-5 py-1.5 rounded-full text-sm font-semibold tracking-wide self-start sm:self-auto">
              {app.status || "Pending"}
            </span>
          </div>

          {/* Circular Score Indicator */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#0F172A]"
                  strokeDasharray={`${matchScore}, 100`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-3xl font-extrabold text-[#0F172A]">
                {matchScore}%
              </span>
            </div>

            <p className="text-center text-sm sm:text-base font-medium text-slate-600 mt-4 max-w-md">
              Based on your profile, the AI suggests a strong likelihood of admission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-8">
            
            <div 
              className="bg-[#0F172A] text-white p-4 rounded-xl flex flex-col items-center text-center relative"
              style={{
                clipPath: "polygon(0% 0%, 93% 0%, 100% 50%, 93% 100%, 0% 100%)"
              }}
            >
              <span className="font-bold text-sm">1. Submitted</span>
              <span className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                <FontAwesomeIcon icon={faCheckCircle} /> 2026-10-09
              </span>
            </div>

            <div 
              className="bg-[#64748B] text-white p-4 rounded-xl flex flex-col items-center text-center relative"
              style={{
                clipPath: "polygon(0% 0%, 93% 0%, 100% 50%, 93% 100%, 0% 100%, 7% 50%)"
              }}
            >
              <span className="font-bold text-sm">2. Under Review</span>
              <span className="text-xs text-slate-200 mt-1">(Current)</span>
            </div>

            <div 
              className="bg-[#E2E8F0] text-slate-500 p-4 rounded-xl flex flex-col items-center text-center relative"
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 7% 50%)"
              }}
            >
              <span className="font-bold text-sm">3. Decision</span>
              <span className="text-xs text-slate-500 mt-1">(Estimated: Nov 15)</span>
            </div>

          </div>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
        
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-[#111827] mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faLink} className="text-[#E8792E]" /> Application Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#portal" className="text-slate-600 hover:text-[#E8792E] flex items-center justify-between p-2.5 bg-slate-50 rounded-lg transition">
                  <span>University Portal Access</span>
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs" />
                </a>
              </li>
              <li>
                <a href="#receipt" className="text-slate-600 hover:text-[#E8792E] flex items-center justify-between p-2.5 bg-slate-50 rounded-lg transition">
                  <span>Download Application Slip</span>
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs" />
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-[#111827] mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faClipboardCheck} className="text-[#E8792E]" /> Required Documents Status
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-700 font-medium">O'Level Result Sheet</span>
                <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-md font-semibold">Cleared</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-700 font-medium">JAMB Admission Slip</span>
                <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-md font-semibold">Cleared</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};