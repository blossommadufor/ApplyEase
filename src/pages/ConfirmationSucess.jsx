import { useNavigate } from "react-router-dom";
import logoDark from "../assets/logo-dark.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useOnboarding } from "../context/OnboardingContext"; // Import context to read user data/JAMB number

export const ConfirmationSuccess = () => {
  const navigate = useNavigate();
  const { formData } = useOnboarding();

  // Generate reference number using JAMB registration number if available, or fall back to sample
  const referenceNumber = formData?.jambRegNumber 
    ? `APP-${formData.jambRegNumber}` 
    : "APP-2024109827";

  return (
    <div className="min-h-screen text-[#1F2430] flex flex-col bg-white">
      {/* Top Header Navigation */}
      <header className="bg-[#1E2432] text-white h-20 px-6 lg:px-16 flex items-center justify-between border-b border-slate-800">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={logoDark}
            alt="ApplyNow"
            className="w-32 h-auto object-contain filter brightness-0 invert"
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              localStorage.setItem("isLoggedIn", "true");
              navigate("/dashboard");
            }}
            className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition cursor-pointer"
          >
            Go to Dashboard &rarr;
          </button>
        </div>
      </header>

      {/* Main Success Content Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        
        {/* Large Rounded Green Checkmark Icon Box */}
        <div className="w-28 h-28 bg-[#E6F4ED] rounded-full flex items-center justify-center mb-8 shadow-sm">
          <div className="w-20 h-20 bg-[#34A853] rounded-full flex items-center justify-center text-white text-4xl shadow-md">
            <FontAwesomeIcon icon={faCheck} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2430] tracking-tight mb-4">
          Application Submitted
        </h1>

        {/* Reference Number Pill */}
        <div className="inline-flex items-center px-6 py-2 bg-slate-100 border border-[#DCE1E7] rounded-full text-sm font-medium text-[#1F2430] mb-10 shadow-xs">
          Reference No: <span className="font-bold ml-1.5">{referenceNumber}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <button
            type="button"
            onClick={() => {
              localStorage.setItem("isLoggedIn", "true");
              navigate("/dashboard");
            }}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#1E2432] hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition cursor-pointer"
          >
            View Status
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white border border-[#DCE1E7] hover:bg-slate-50 text-[#1F2430] font-semibold text-sm shadow-xs transition cursor-pointer"
          >
            Back to Home
          </button>
        </div>

      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-[#DCE1E7] py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} ApplyNow. All rights reserved.
      </footer>
    </div>
  );
};