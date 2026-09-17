import React from "react";
import { useNavigate } from "react-router-dom";
import logoDark from "../assets/logo-dark.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { OnboardingSteps } from "../components/OnboardingSteps";
import { useOnboarding } from "../context/OnboardingContext"; // Import the context

export const GuardianData = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useOnboarding(); // Access global state

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value }); // Update global state immediately on change
  };

  const handleNext = (e) => {
    e.preventDefault();
    // Proceed to Step 4: Final Review
    navigate("/onboarding/final-review");
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
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-10 flex flex-col">
        
        {/* Progress Tracker Steps Bar */}
        <OnboardingSteps currentStep={3} />

        {/* Section Heading */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#1F2430]">Guardian Data</h1>
        </div>

        {/* Form Container */}
        <form onSubmit={handleNext} className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-[#DCE1E7] space-y-6 flex-1">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Guardian Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1F2430]">Guardian Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Guardian Full Name"
                required
                value={formData.fullName || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition"
              />
            </div>

            {/* Relationship to Applicant */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1F2430]">Relationship to Applicant</label>
              <div className="relative">
                <select
                  name="relationship"
                  value={formData.relationship || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition appearance-none"
                >
                  <option value="">Relationship to Applicant</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Uncle">Uncle</option>
                  <option value="Aunt">Aunt</option>
                  <option value="Guardian">Guardian</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                  <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                </div>
              </div>
            </div>

            {/* Guardian Email Address */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1F2430]">Guardian Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Guardian Email Address"
                required
                value={formData.email || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Contact Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1F2430]">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                placeholder="Contact Email"
                value={formData.contactEmail || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1F2430]">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Guardian Home Address & State/LGA */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1F2430]">Guardian Home Address</label>
              <textarea
                name="homeAddress"
                rows="3"
                value={formData.homeAddress || ""}
                onChange={handleChange}
                placeholder="Guardian Home Address"
                className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition resize-none"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#1F2430]">State & LGA</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition"
                  />
                  <input
                    type="text"
                    name="lga"
                    placeholder="LGA"
                    value={formData.lga || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition"
                  />
                </div>
              </div>

              {/* Guardian Employer/Company */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#1F2430]">Guardian Employer/Company</label>
                <input
                  type="text"
                  name="employer"
                  placeholder="Guardian Employer/Company"
                  value={formData.employer || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition"
                />
              </div>
            </div>
          </div>

        </form>
      </main>

      {/* Floating Dark Action Footer Bar */}
      <footer className="sticky bottom-0 bg-[#1E2432] border-t border-[#DCE1E7] py-4 px-6 lg:px-16 shadow-lg mt-auto">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/onboarding/academic-details")}
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