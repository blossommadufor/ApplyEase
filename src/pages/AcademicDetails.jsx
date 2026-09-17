import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoDark from "../assets/logo-dark.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCloudUploadAlt, faFileAlt, faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { OnboardingSteps } from "../components/OnboardingSteps";
import { useOnboarding } from "../context/OnboardingContext"; 

const ALL_JAMB_SUBJECTS = [
  "Accounting", "Agricultural Science", "Arabic", "Art", "Biology", 
  "Chemistry", "Christian Religious Studies", "Commerce", "Economics", 
  "English Language", "French", "Geography", "Government", "Hausa", 
  "History", "Igbo", "Islamic Studies", "Literature-in-English", 
  "Mathematics", "Music", "Physics", "Principles of Accounts", 
  "Yoruba", "Use of English"
];

export const AcademicDetails = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useOnboarding(); 

  const [selectedSubjects, setSelectedSubjects] = useState(formData.selectedSubjects || []);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [wasceFile, setWasceFile] = useState(formData.wasceFile || null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value }); 
  };

  const toggleSubject = (subject) => {
    setErrorMsg("");
    let updatedSubjects;
    if (selectedSubjects.includes(subject)) {
      updatedSubjects = selectedSubjects.filter((s) => s !== subject);
    } else {
      if (selectedSubjects.length >= 4) {
        setErrorMsg("You can only select exactly 4 subjects.");
        return;
      }
      updatedSubjects = [...selectedSubjects, subject];
    }
    setSelectedSubjects(updatedSubjects);
    updateFormData({ selectedSubjects: updatedSubjects }); 
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setWasceFile(file);
      updateFormData({ wasceFileName: file.name });
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setWasceFile(file);
      updateFormData({ wasceFileName: file.name });
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (selectedSubjects.length !== 4) {
      setErrorMsg("Please select exactly 4 JAMB subjects before continuing.");
      return;
    }
    navigate("/onboarding/guardian-data");
  };

  return (
    <div className="min-h-screen text-[#1F2430] flex flex-col bg-white">
      <header className="bg-[#1E2432] text-white h-20 px-6 lg:px-16 flex items-center justify-between border-b border-[#DCE1E7]">
        <div className="flex items-center gap-3">
          <img src={logoDark} alt="ApplyEase" className="w-32 h-auto object-contain filter brightness-0 invert" />
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-wider text-slate-300">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="#institutional" className="hover:text-white transition">Institutional</a>
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-300 hidden sm:inline">Sign In</span>
          <span className="text-sm px-4 py-2 bg-[#E8792E] text-white font-semibold rounded-md shadow-sm">
            Get Started
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-10 flex flex-col">
        
        <OnboardingSteps currentStep={2} />

        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#1F2430]">Academic Details</h1>
        </div>

        <form onSubmit={handleNext} className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-[#DCE1E7] space-y-6 flex-1">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1F2430]">Secondary School Name</label>
              <input
                type="text"
                name="schoolName"
                placeholder="e.g. King's College, Lagos"
                required
                value={formData.schoolName || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1F2430]">O'Level Examination Type</label>
              <div className="relative">
                <select
                  name="examType"
                  value={formData.examType || "WAEC SSCE"}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition appearance-none"
                >
                  <option value="WAEC SSCE">WAEC SSCE</option>
                  <option value="NECO SSCE">NECO SSCE</option>
                  <option value="GCE">GCE O'Level</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                  <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1F2430]">Year of Graduation</label>
              <div className="relative">
                <select
                  name="yearOfGraduation"
                  value={formData.yearOfGraduation || "2024"}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition appearance-none"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                  <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1F2430]">O'Level Exam Year</label>
              <div className="relative">
                <select
                  name="examYear"
                  value={formData.examYear || "2024"}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition appearance-none"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                  <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="block text-sm font-semibold text-[#1F2430]">
              Upload WASCE Result Slip <span className="text-xs font-normal text-slate-500">(Auto-extracts grades)</span>
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-[#DCE1E7] bg-slate-50 hover:bg-slate-100 transition rounded-xl p-8 text-center relative cursor-pointer flex flex-col items-center justify-center"
            >
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {wasceFile ? (
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-[#DCE1E7] shadow-sm z-10">
                  <FontAwesomeIcon icon={faFileAlt} className="text-[#E8792E] text-lg" />
                  <span className="text-sm font-medium text-[#1F2430]">
                    {wasceFile.name || formData.wasceFileName}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setWasceFile(null);
                      updateFormData({ wasceFileName: null });
                    }}
                    className="text-slate-400 hover:text-red-500 ml-2"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-[#F5E6D8] text-[#E8792E] flex items-center justify-center text-xl mb-3">
                    <FontAwesomeIcon icon={faCloudUploadAlt} />
                  </div>
                  <p className="text-sm font-medium text-[#1F2430]">
                    Drag and drop your WAEC result document here, or <span className="text-[#E8792E] underline">browse</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Supports PDF, PNG, JPG (Max 5MB)</p>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1F2430]">JAMB Registration Number</label>
              <input
                type="text"
                name="jambRegNumber"
                placeholder="e.g. 202410982731AB"
                value={formData.jambRegNumber || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1F2430]">JAMB UTME Score (Out of 400)</label>
              <input
                type="number"
                name="jambScore"
                placeholder="e.g. 270"
                value={formData.jambScore || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 relative">
            <label className="block text-sm font-semibold text-[#1F2430]">
              JAMB Subject Combination <span className="text-[#E8792E] font-bold">({selectedSubjects.length}/4 selected)</span>
            </label>
            
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] flex items-center justify-between cursor-pointer focus:border-[#E8792E]"
            >
              <span className={selectedSubjects.length === 0 ? "text-slate-400" : "text-[#1F2430]"}>
                {selectedSubjects.length > 0 ? selectedSubjects.join(", ") : "Select exactly 4 subjects..."}
              </span>
              <FontAwesomeIcon icon={faChevronDown} className="text-xs text-slate-500" />
            </div>

            {isDropdownOpen && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-[#DCE1E7] rounded-lg shadow-lg max-h-60 overflow-y-auto p-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
                {ALL_JAMB_SUBJECTS.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub);
                  return (
                    <div
                      key={sub}
                      onClick={() => toggleSubject(sub)}
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer transition ${
                        isSelected ? "bg-[#F5E6D8] text-[#1F2430] font-semibold" : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span>{sub}</span>
                      {isSelected && <FontAwesomeIcon icon={faCheck} className="text-[#E8792E]" />}
                    </div>
                  );
                })}
              </div>
            )}
            {errorMsg && <p className="text-xs text-red-500 font-medium mt-1">{errorMsg}</p>}
          </div>

        </form>
      </main>

      <footer className="sticky bottom-0 bg-[#1E2432] border-t border-[#DCE1E7] py-4 px-6 lg:px-16 shadow-lg mt-auto">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/onboarding/personal-info")}
            className="px-6 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800 font-medium text-sm transition cursor-pointer"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="px-8 py-2.5 rounded-lg bg-[#E8792E] hover:bg-[#C96A28] text-white font-semibold text-sm shadow-md transition cursor-pointer"
          >
            Continue
          </button>
        </div>
      </footer>
    </div>
  );
};