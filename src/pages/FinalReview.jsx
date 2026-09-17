import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoDark from "../assets/logo-dark.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faFileAlt, faPenNib } from "@fortawesome/free-solid-svg-icons";
import { OnboardingSteps } from "../components/OnboardingSteps";
import { useOnboarding } from "../context/OnboardingContext"; // Import the context

export const FinalReview = () => {
  const navigate = useNavigate();
  const { formData } = useOnboarding(); // Access global state

  const [signature, setSignature] = useState(formData.fullName || "Annoon Smith");
  const [currentDate] = useState("09/14/2026");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to the confirmation success page
    navigate("/onboarding/success");
  };

  return (
    <div className="min-h-screen text-[#1F2430] flex flex-col bg-white">
      {/* Top Header Navigation */}
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

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10 flex flex-col">
        
        {/* Progress Tracker Steps Bar */}
        <OnboardingSteps currentStep={4} />

        {/* Section Heading */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#1F2430]">Final Review</h1>
        </div>

        {/* Review Grid Container */}
        <form onSubmit={handleSubmit} className="space-y-6 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column: Personal Information & Academic Details Review */}
            <div className="space-y-6">
              
              {/* Personal Information Review Box */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DCE1E7]">
                <h2 className="text-base font-bold text-[#1F2430] uppercase tracking-wide border-b border-slate-100 pb-3 mb-4">
                  Personal Information Review
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-3"><span className="text-slate-500 font-medium">Full Name</span><span className="col-span-2 font-semibold text-[#1F2430]">{formData.fullName || "Annoon Smith"}</span></div>
                  <div className="grid grid-cols-3"><span className="text-slate-500 font-medium">DOB</span><span className="col-span-2 text-[#1F2430]">{formData.dob || "06-09/1977"}</span></div>
                  <div className="grid grid-cols-3"><span className="text-slate-500 font-medium">Citizenship</span><span className="col-span-2 text-[#1F2430]">{formData.citizenship || "Nigeria"}</span></div>
                  <div className="grid grid-cols-3"><span className="text-slate-500 font-medium">Contact Email</span><span className="col-span-2 text-[#1F2430]">{formData.contactEmail || formData.email || "contactcov@gmail.com"}</span></div>
                  <div className="grid grid-cols-3"><span className="text-slate-500 font-medium">Phone</span><span className="col-span-2 text-[#1F2430]">{formData.phone || "(013) 7367670"}</span></div>
                  <div className="grid grid-cols-3"><span className="text-slate-500 font-medium">Home Address</span><span className="col-span-2 text-[#1F2430]">{formData.homeAddress || "23 Foam Home Address, Gotium Road, Nanmangham"}</span></div>
                </div>
              </div>

              {/* Academic Details Review Box */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DCE1E7]">
                <h2 className="text-base font-bold text-[#1F2430] uppercase tracking-wide border-b border-slate-100 pb-3 mb-4">
                  Academic Details Review
                </h2>
                <div className="space-y-3 text-sm mb-4">
                  <div className="grid grid-cols-3"><span className="text-slate-500 font-medium">Secondary School</span><span className="col-span-2 font-semibold text-[#1F2430]">{formData.schoolName || "King's College, Lagos"}</span></div>
                  <div className="grid grid-cols-3"><span className="text-slate-500 font-medium">Graduation Year</span><span className="col-span-2 text-[#1F2430]">{formData.yearOfGraduation || "2024"}</span></div>
                  <div className="grid grid-cols-3"><span className="text-slate-500 font-medium">JAMB UTME</span><span className="col-span-2 text-[#1F2430]">Score: {formData.jambScore || "270"} ({formData.jambRegNumber || "202410982731AB"})</span></div>
                  <div className="grid grid-cols-3"><span className="text-slate-500 font-medium">JAMB Subjects</span><span className="col-span-2 text-[#1F2430]">{formData.selectedSubjects ? formData.selectedSubjects.join(", ") : "Use of English, Mathematics, Physics, Chemistry"}</span></div>
                </div>

                {/* O'Level Results Table Preview */}
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">O'Level results (Extracted from WAEC Slip)</span>
                  <div className="overflow-x-auto border border-[#DCE1E7] rounded-lg">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 border-b border-[#DCE1E7]">
                        <tr>
                          <th className="p-2">Subject</th>
                          <th className="p-2">Grade</th>
                          <th className="p-2">Subject</th>
                          <th className="p-2">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[#1F2430]">
                        <tr>
                          <td className="p-2 font-medium">English Language</td><td className="p-2">A1</td>
                          <td className="p-2 font-medium">Chemistry</td><td className="p-2">C4</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Mathematics</td><td className="p-2">B2</td>
                          <td className="p-2 font-medium">Biology</td><td className="p-2">C5</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Physics</td><td className="p-2">B3</td>
                          <td className="p-2 font-medium">-</td><td className="p-2">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column: Guardian Data, AI Status Predictor & Signature */}
            <div className="space-y-6">
              
              {/* Guardian & Secondary Data Review Box */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DCE1E7]">
                <h2 className="text-base font-bold text-[#1F2430] uppercase tracking-wide border-b border-slate-100 pb-3 mb-4">
                  Guardian Data Review
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-3"><span className="text-slate-500 font-medium">Guardian Name</span><span className="col-span-2 font-semibold text-[#1F2430]">{formData.fullName || "John Nomith"}</span></div>
                  <div className="grid grid-cols-3"><span className="text-slate-500 font-medium">Relationship</span><span className="col-span-2 text-[#1F2430]">{formData.relationship || "Father"}</span></div>
                  <div className="grid grid-cols-3"><span className="text-slate-500 font-medium">Guardian Email</span><span className="col-span-2 text-[#1F2430]">{formData.email || "guardian@email.com"}</span></div>
                  <div className="grid grid-cols-3"><span className="text-slate-500 font-medium">Guardian Address</span><span className="col-span-2 text-[#1F2430]">{formData.homeAddress || "28 Anmxi Address, Gotium Road"}</span></div>
                  <div className="grid grid-cols-3"><span className="text-slate-500 font-medium">State / LGA</span><span className="col-span-2 text-[#1F2430]">{formData.state || "Lagos"} / {formData.lga || "Ikeja"}</span></div>
                  <div className="grid grid-cols-3"><span className="text-slate-500 font-medium">Employer</span><span className="col-span-2 text-[#1F2430]">{formData.employer || "Tech Corp Ltd"}</span></div>
                  <div className="grid grid-cols-3 items-center">
                    <span className="text-slate-500 font-medium">WASCE Slip</span>
                    <span className="col-span-2 text-emerald-600 font-semibold flex items-center gap-1 text-xs">
                      <FontAwesomeIcon icon={faFileAlt} /> {formData.wasceFileName ? "Uploaded Successfully" : "Uploaded Successfully"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3"><span className="text-slate-500 font-medium">NIN</span><span className="col-span-2 text-[#1F2430]">0073015533750</span></div>
                </div>
              </div>

              {/* AI Status Predictor Result Card */}
              <div className="bg-gradient-to-r from-slate-900 to-[#1E2432] text-white rounded-2xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-[#E8792E] font-bold">AI Status Predictor Result</span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <FontAwesomeIcon icon={faCheckCircle} /> 82% - High Likelihood
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The Admission Status Predictor results scan 82% - rating drives your prospective application and profile's acceptance likelihood.
                </p>
                <div className="mt-3 pt-3 border-t border-slate-700 text-[11px] text-slate-400">
                  Method: Integrated AI Scoring API v2.4
                </div>
              </div>

            </div>

          </div>

          {/* Applicant Signature & Date Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DCE1E7] grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1F2430]">Applicant Signature</label>
              <div className="relative">
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm font-serif italic text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition"
                  placeholder="Type full name as signature"
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                  <FontAwesomeIcon icon={faPenNib} className="text-xs" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1F2430]">Date</label>
              <input
                type="text"
                readOnly
                value={currentDate}
                className="w-full px-4 py-2.5 bg-slate-100 border border-[#DCE1E7] rounded-lg text-sm text-slate-600 cursor-not-allowed"
              />
            </div>
          </div>

        </form>
      </main>

      {/* Floating Dark Action Footer Bar */}
      <footer className="sticky bottom-0 bg-[#1E2432] border-t border-[#DCE1E7] py-4 px-6 lg:px-16 shadow-lg mt-auto">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/onboarding/guardian-data")}
            className="px-6 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800 font-medium text-sm transition cursor-pointer"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-8 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <FontAwesomeIcon icon={faCheckCircle} /> Validate and Submit
          </button>
        </div>
      </footer>
    </div>
  );
}; 
