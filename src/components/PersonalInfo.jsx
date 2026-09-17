import React from "react";
import { useNavigate } from "react-router-dom";
import logoDark from "../assets/logo-dark.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { OnboardingSteps } from "../components/OnboardingSteps";
import { useOnboarding } from "../context/OnboardingContext"; 

export const PersonalInfo = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useOnboarding(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value }); 
  };

  const handleNext = (e) => {
    e.preventDefault();
    navigate("/onboarding/academic-details");
  };

  return (
    <div className="min-h-screen text-[#1F2430] flex flex-col ">
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
        
        <OnboardingSteps currentStep={1} />

        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#1F2430]">Personal Info</h1>
        </div>

        <form onSubmit={handleNext} className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-[#DCE1E7] space-y-6 flex-1">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1F2430]">Full Name</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  required
                  value={formData.firstName || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  required
                  value={formData.lastName || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1F2430]">Gender</label>
              <div className="flex items-center gap-6 pt-2">
                {["Male", "Female", "Other"].map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#E8792E] focus:ring-[#E8792E]"
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1F2430]">Date of Birth</label>
              <div className="relative">
                <input
                  type="date"
                  name="dob"
                  value={formData.dob || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1F2430]">Citizenship</label>
              <div className="relative">
                <select
                  name="citizenship"
                  value={formData.citizenship || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition appearance-none"
                >
                  <option value="">Citizenship</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                  <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1F2430]">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                placeholder="e.g. user@gmail.com"
                required
                value={formData.contactEmail || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition"
              />
            </div>

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
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1F2430]">Home Address</label>
              <textarea
                name="homeAddress"
                rows="3"
                value={formData.homeAddress || ""}
                onChange={handleChange}
                placeholder="Enter full residential address..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1F2430]">Home / Landmark</label>
              <input
                type="text"
                name="home"
                value={formData.home || ""}
                onChange={handleChange}
                placeholder="Closest landmark or estate name"
                className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-lg text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition"
              />
            </div>
          </div>

        </form>
      </main>

      <footer className="sticky bottom-0 bg-[#1E2432] border-t border-[#DCE1E7] py-4 px-6 lg:px-16 shadow-lg mt-auto">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
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