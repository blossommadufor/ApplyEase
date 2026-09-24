import { useNavigate } from "react-router-dom";
import landingHero from "../assets/lh.png";

const LandingHero = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8 sm:py-16 lg:py-20 flex flex-col lg:flex-row justify-between items-center gap-8 sm:gap-12 lg:gap-20">
      <div className="w-full lg:w-3/5 space-y-4 sm:space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-text-primary">
          Your Application, <span className="text-primary">Simplified</span>.
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-text-secondary max-w-xl leading-relaxed">
          Streamline your future with our AI-powered admissions platform. Apply to top programs with speed and precision.
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate("/auth?mode=signup")}
            className="text-sm sm:text-base px-7 py-3.5 text-white bg-[#E8792E] font-medium rounded-xl shadow-md hover:bg-[#C96A28] transition cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </div>

      <div className="w-full lg:w-2/5 flex justify-center">
        <img src={landingHero} alt="ApplyNow Admissions Platform" className="w-full max-w-xs sm:max-w-md lg:max-w-none h-auto object-contain" />
      </div>
    </div>
  );
};

export default LandingHero;