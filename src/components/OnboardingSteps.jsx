import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faUser,
  faGraduationCap,
  faUsers,
  faClipboardCheck,
} from "@fortawesome/free-solid-svg-icons";

export const OnboardingSteps = ({ currentStep = 1 }) => {
  const navigate = useNavigate();

  const steps = [
    {
      number: 1,
      label: "Personal Info",
      sublabel: "Bio & Contact",
      icon: faUser,
      path: "/onboarding/personal-info",
    },
    {
      number: 2,
      label: "Academic Details",
      sublabel: "JAMB & O'Level",
      icon: faGraduationCap,
      path: "/onboarding/academic-details",
    },
    {
      number: 3,
      label: "Guardian Data",
      sublabel: "Sponsor Details",
      icon: faUsers,
      path: "/onboarding/guardian-data",
    },
    {
      number: 4,
      label: "Final Review",
      sublabel: "Sign & Submit",
      icon: faClipboardCheck,
      path: "/onboarding/final-review",
    },
  ];

  const progressPercentage = Math.round(((currentStep - 1) / (steps.length - 1)) * 100);

  const handleStepClick = (step) => {
    if (step.path) {
      navigate(step.path);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-[#DCE1E7] mb-8">
      {/* Top Progress Info Bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8792E] block">
            Admissions Dossier
          </span>
          <h2 className="text-base sm:text-lg font-bold text-[#1F2430]">
            Application Progress
          </h2>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5E6D8] text-[#E8792E] text-xs font-bold font-mono">
            Step {currentStep} of {steps.length} • {progressPercentage}%
          </span>
        </div>
      </div>

      {/* Stepper Flow with Connecting Progress Bar */}
      <div className="relative">
        {/* Continuous Background Track */}
        <div className="absolute top-5 left-6 right-6 h-1 bg-slate-100 -translate-y-1/2 z-0 hidden sm:block">
          <div
            className="h-full bg-gradient-to-r from-[#E8792E] to-[#C96A28] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Step Circles & Labels */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 relative z-10">
          {steps.map((step) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;

            return (
              <div
                key={step.number}
                onClick={() => handleStepClick(step)}
                className="flex flex-col items-center text-center group cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0"
                title={`Jump to Step ${step.number}: ${step.label}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleStepClick(step);
                  }
                }}
              >
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-xs mb-2 group-hover:scale-110 ${
                    isCompleted
                      ? "bg-[#1E2432] text-white group-hover:bg-[#E8792E]"
                      : isCurrent
                      ? "bg-[#E8792E] text-white ring-4 ring-[#F5E6D8] scale-105 shadow-md"
                      : "bg-white border-2 border-slate-200 text-slate-400 group-hover:border-[#E8792E] group-hover:text-[#E8792E]"
                  }`}
                >
                  {isCompleted ? (
                    <FontAwesomeIcon icon={faCheck} className="text-xs" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>

                {/* Step Labels */}
                <div className="space-y-0.5 max-w-[90px] sm:max-w-none">
                  <p
                    className={`text-xs sm:text-sm font-bold truncate transition-colors ${
                      isCurrent
                        ? "text-[#E8792E]"
                        : isCompleted
                        ? "text-[#1F2430] group-hover:text-[#E8792E]"
                        : "text-slate-400 group-hover:text-[#E8792E]"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">
                    {step.sublabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};