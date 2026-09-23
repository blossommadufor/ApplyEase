import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoLight from "../assets/logo-light.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faRightFromBracket,
  faBars,
  faTimes,
  faUser,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

export const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  const closeMenu = () => setMobileMenuOpen(false);

  const scrollToSection = (sectionId) => {
    closeMenu();
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleGetStarted = () => {
    closeMenu();
    if (isLoggedIn) {
      navigate("/select-university");
    } else {
      navigate("/auth?mode=signup");
    }
  };

  const handleAuthRedirect = (mode) => {
    closeMenu();
    navigate(`/auth?mode=${mode}`);
  };

  const handleSignOut = () => {
    if (typeof setIsLoggedIn === "function") {
      setIsLoggedIn(false);
    }
    localStorage.removeItem("isLoggedIn");
    closeMenu();
    navigate("/", { replace: true });
  };

  return (
    <header className="bg-[#1E2432]/95 backdrop-blur-md text-white border-b border-slate-800/80 sticky top-0 z-50 transition-all duration-300 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to={isLoggedIn ? "/dashboard" : "/"}
          onClick={closeMenu}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src={logoLight}
            alt="ApplyEase"
            className="w-28 sm:w-36 lg:w-40 h-auto object-contain transition-transform group-hover:scale-102"
          />
        </Link>

        {/* Landing Page Navigation Links */}
        {!isLoggedIn && (
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className="text-xs lg:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 px-3.5 py-2 rounded-lg transition-all cursor-pointer"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("howitworks")}
              className="text-xs lg:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 px-3.5 py-2 rounded-lg transition-all cursor-pointer"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("institutions")}
              className="text-xs lg:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 px-3.5 py-2 rounded-lg transition-all cursor-pointer"
            >
              Institutions
            </button>
          </nav>
        )}

        {/* Desktop CTA / Auth / User Status */}
        <div className="hidden md:flex items-center">
          {isLoggedIn ? (
            <div className="flex items-center gap-4 lg:gap-6">
              {!isDashboard && (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-white transition"
                >
                  <FontAwesomeIcon icon={faGauge} />
                  Dashboard
                </Link>
              )}
              <button
                type="button"
                onClick={handleGetStarted}
                className="flex items-center gap-2 text-xs sm:text-sm bg-[#E8792E] text-white px-3.5 py-2 rounded-lg font-semibold hover:bg-[#C96A28] transition shadow-sm cursor-pointer"
              >
                <FontAwesomeIcon icon={faPlus} />
                New Application
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-700/80">
                <div className="w-9 h-9 rounded-full bg-[#E8792E] text-white flex items-center justify-center font-semibold text-sm shadow-xs">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-white transition bg-slate-800/90 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 lg:gap-4">
              <button
                type="button"
                onClick={() => handleAuthRedirect("signin")}
                className="text-xs sm:text-sm px-4 py-2 text-[#E8792E] font-semibold transition bg-[#F5E6D8] hover:bg-[#ecd2bd] rounded-lg cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={handleGetStarted}
                className="text-xs sm:text-sm px-4 py-2 bg-[#E8792E] text-white font-semibold rounded-lg hover:bg-[#C96A28] transition shadow-sm cursor-pointer"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-300 hover:text-white p-2 focus:outline-none cursor-pointer rounded-lg hover:bg-white/10 transition"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon
              icon={mobileMenuOpen ? faTimes : faBars}
              className="text-xl"
            />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1E2432]/98 backdrop-blur-lg border-b border-slate-800 px-6 py-6 space-y-5">
          {!isLoggedIn && (
            <nav className="flex flex-col space-y-1.5">
              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="text-left text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 px-3.5 py-2.5 rounded-lg transition cursor-pointer"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("howitworks")}
                className="text-left text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 px-3.5 py-2.5 rounded-lg transition cursor-pointer"
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("institutions")}
                className="text-left text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 px-3.5 py-2.5 rounded-lg transition cursor-pointer"
              >
                Institutions
              </button>
            </nav>
          )}

          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
            {isLoggedIn ? (
              <>
                {!isDashboard && (
                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className="flex items-center gap-2 text-sm font-medium text-slate-200 py-2"
                  >
                    <FontAwesomeIcon icon={faGauge} />
                    Dashboard
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleGetStarted}
                  className="flex items-center justify-center gap-2 text-sm bg-[#E8792E] text-white font-semibold py-2.5 rounded-lg cursor-pointer hover:bg-[#C96A28] transition"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  New Application
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-2 text-sm text-slate-300 bg-slate-800 px-4 py-2.5 rounded-lg border border-slate-700 w-full cursor-pointer hover:bg-slate-700 transition"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => handleAuthRedirect("signin")}
                  className="text-sm px-4 py-2.5 text-[#E8792E] font-semibold bg-[#F5E6D8] hover:bg-[#ecd2bd] rounded-lg text-center w-full cursor-pointer transition"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={handleGetStarted}
                  className="text-sm px-4 py-2.5 bg-[#E8792E] text-white font-semibold rounded-lg text-center w-full shadow-sm hover:bg-[#C96A28] cursor-pointer transition"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};