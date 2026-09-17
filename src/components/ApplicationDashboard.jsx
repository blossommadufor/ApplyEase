// src/components/ApplicationDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApplications } from "../context/ApplicationsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faGraduationCap,
  faClock,
  faCheckCircle,
  faReceipt,
  faFolderOpen,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export const ApplicationDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("applications");
  const [userName, setUserName] = useState("Applicant");

  const { applications } = useApplications();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const fullName = parsedUser.fullName || parsedUser.name || parsedUser.firstName;
        
        if (fullName) {
          const firstName = fullName.trim().split(" ")[0];
          setUserName(firstName);
        }
      } catch (error) {
        console.error("Error reading user data from localStorage:", error);
      }
    }
  }, []);

  const handleCardClick = (id) => {
    navigate(`/dashboard/application/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-white border-b border-[#DCE1E7] px-6 lg:px-16 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2430]">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Click on any application card below to edit details or review submitted forms.
            </p>
          </div>
          <button
            onClick={() => navigate("/select-university")}
            className="inline-flex items-center justify-center gap-2 bg-[#E8792E] text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:bg-[#C96A28] transition cursor-pointer self-start md:self-auto"
          >
            <FontAwesomeIcon icon={faPlus} />
            Start New Application
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-8">
        <div className="flex items-center gap-8 border-b border-[#DCE1E7] mb-8">
          <button
            onClick={() => setActiveTab("applications")}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === "applications"
                ? "border-[#E8792E] text-[#E8792E]"
                : "border-transparent text-slate-500 hover:text-[#1F2430]"
            }`}
          >
            <FontAwesomeIcon icon={faFolderOpen} />
            All Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === "transactions"
                ? "border-[#E8792E] text-[#E8792E]"
                : "border-transparent text-slate-500 hover:text-[#1F2430]"
            }`}
          >
            <FontAwesomeIcon icon={faReceipt} />
            Transaction History
          </button>
        </div>

        {activeTab === "applications" ? (
          applications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => handleCardClick(app.id)}
                  className="bg-white rounded-xl border border-[#DCE1E7] shadow-sm hover:shadow-md transition p-6 cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                        {app.applicationId}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${
                          app.status === "Submitted"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={app.status === "Submitted" ? faCheckCircle : faClock}
                          className="text-xs"
                        />
                        {app.status}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[#F5E6D8] text-[#E8792E] flex items-center justify-center shrink-0">
                        <FontAwesomeIcon icon={faGraduationCap} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1F2430] group-hover:text-[#E8792E] transition">
                          {app.university}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">{app.course}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4">
                    <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                      <span>Completion</span>
                      <span className="font-semibold text-slate-700">{app.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                      <div
                        className="bg-[#E8792E] h-full rounded-full transition-all duration-300"
                        style={{ width: `${app.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium text-[#E8792E] group-hover:translate-x-1 transition-transform">
                      <span>Open Application</span>
                      <FontAwesomeIcon icon={faChevronRight} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#DCE1E7] p-12 text-center max-w-lg mx-auto my-12">
              <div className="w-16 h-16 bg-[#F5E6D8] text-[#E8792E] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <h3 className="text-lg font-bold text-[#1F2430]">No Applications Found</h3>
              <p className="text-sm text-slate-500 mt-2 mb-6">
                You haven't started an application yet. Select a university to get started.
              </p>
              <button
                onClick={() => navigate("/select-university")}
                className="bg-[#E8792E] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-[#C96A28] transition cursor-pointer"
              >
                Apply to an Institution
              </button>
            </div>
          )
        ) : (
          <div className="bg-white rounded-xl border border-[#DCE1E7] p-8 text-slate-500 text-sm text-center">
            No recent payment transactions recorded.
          </div>
        )}
      </div>
    </div>
  );
};