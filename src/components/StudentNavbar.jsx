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

export const StudentNavbar = ({ setIsLoggedIn }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  const closeMenu = () => setMobileMenuOpen(false);

  const handleSignOut = () => {
    if (typeof setIsLoggedIn === "function") {
      setIsLoggedIn(false);
    }
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    closeMenu();
    navigate("/", { replace: true });
  };

  return (
    <header className="bg-[#1E2432] text-white border-b border-[#DCE1E7] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 h-20 flex items-center justify-between">
        <Link to="/dashboard" onClick={closeMenu} className="flex items-center gap-3 cursor-pointer">
          <img src={logoLight} alt="ApplyEase" className="w-28 sm:w-36 lg:w-40 h-auto object-contain" />
        </Link>

        {/* Student Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          {!isDashboard && (
            <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-white transition">
              <FontAwesomeIcon icon={faGauge} />
              Dashboard
            </Link>
          )}
          <button
            type="button"
            onClick={() => navigate("/select-university")}
            className="flex items-center gap-2 text-sm bg-[#E8792E] text-white px-3.5 py-1.5 rounded-md font-semibold hover:bg-[#C96A28] transition shadow-sm cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} />
            New Application
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
            <div className="w-9 h-9 rounded-full bg-[#E8792E] text-white flex items-center justify-center font-semibold text-sm shadow-sm">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700 cursor-pointer"
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-300 hover:text-white p-2 cursor-pointer">
            <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="text-xl" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1E2432] border-b border-[#DCE1E7] px-6 py-6 space-y-4">
          {!isDashboard && (
            <Link to="/dashboard" onClick={closeMenu} className="flex items-center gap-2 text-sm font-medium text-slate-200 py-2">
              <FontAwesomeIcon icon={faGauge} />
              Dashboard
            </Link>
          )}
          <button
            type="button"
            onClick={() => { closeMenu(); navigate("/select-university"); }}
            className="flex items-center justify-center gap-2 text-sm bg-[#E8792E] text-white font-semibold py-2.5 rounded-md w-full cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} />
            New Application
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 text-sm text-slate-300 bg-slate-800 px-4 py-2 rounded-md border border-slate-700 w-full cursor-pointer"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
};