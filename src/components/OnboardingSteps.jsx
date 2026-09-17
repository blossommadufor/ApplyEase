import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export const OnboardingSteps = ({ currentStep = 1 }) => {
  const steps = [
    { number: 1, label: "Personal Info" },
    { number: 2, label: "Academic Details" },
    { number: 3, label: "Guardian Data" },
    { number: 4, label: "Final Review" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DCE1E7] mb-8">
      <div className="flex items-center justify-between relative">
        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <div key={step.number} className="flex items-center gap-3 z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all ${
                  isCurrent
                    ? "bg-[#E8792E] text-white ring-4 ring-[#F5E6D8]"
                    : isCompleted
                    ? "bg-[#1E2432] text-white"
                    : "bg-slate-200 text-slate-600 opacity-60"
                }`}
              >
                {isCompleted ? <FontAwesomeIcon icon={faCheck} /> : step.number}
              </div>
              <span
                className={`text-sm sm:text-base hidden sm:inline font-bold ${
                  isCurrent ? "text-[#E8792E]" : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};