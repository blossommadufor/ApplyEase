import React from "react";
import landingHero from "../assets/lh.png";

const LandingHero = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12 lg:py-20 flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-20">
      <div className="w-full lg:w-3/5 space-y-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-text-primary">
          Your Application, <span className="text-primary">Simplified</span>.
        </h1>
        <p className="text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed">
          Streamline your future with our AI-powered admissions platform. Apply to top programs with speed and precision.
        </p>
        <div className="pt-2">
          <button className="text-sm px-6 py-3.5 text-primary bg-customBg font-semibold rounded-md shadow-sm hover:bg-primary-hover transition">
            Begin Your Journey
          </button>
        </div>
      </div>

      <div className="w-full lg:w-2/5 flex justify-center">
        <img src={landingHero} alt="ApplyEase Admissions Platform" className="w-full max-w-md lg:max-w-none h-auto object-contain" />
      </div>
    </div>
  );
};

export default LandingHero;