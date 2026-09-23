import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faUsers,
  faArrowRightFromBracket,
  faXmark,
  faBuildingColumns,
} from "@fortawesome/free-solid-svg-icons";
import logoLight from "../assets/logo-light.png";

export default function AdminSidebar({
  isOpen = false,
  setIsOpen = () => {},
  setIsAdminLoggedIn = () => {},
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Overview Dashboard", path: "/admin-dashboard", icon: faGauge },
    { name: "Applicant Dossiers", path: "/admin-dashboard", icon: faUsers },
  ];

  const handleExitAdmin = () => {
    if (typeof setIsAdminLoggedIn === "function") {
      setIsAdminLoggedIn(false);
    }
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminInstitution");
    setIsOpen(false);
    navigate("/auth", { replace: true });
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full bg-[#1E2432] text-white">
      <div>
        {/* Brand / Logo Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              navigate("/admin-dashboard");
              setIsOpen(false);
            }}
          >
            <img
              src={logoLight}
              alt="ApplyEase"
              className="w-32 h-auto object-contain"
            />
          </div>

          {/* Close button for mobile drawer */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg cursor-pointer"
            aria-label="Close menu"
          >
            <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
          </button>
        </div>

        {/* Institution Badge */}
        <div className="px-4 py-4 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <FontAwesomeIcon icon={faBuildingColumns} className="text-[#E8792E]" />
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-200">
              Institutional Admin
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 truncate">
            {localStorage.getItem("adminInstitution") || "Partner University"}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-2">
            Navigation
          </span>
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive(link.path)
                  ? "bg-[#E8792E] text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <FontAwesomeIcon icon={link.icon} className="w-4 h-4 shrink-0" />
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer Utilities */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <button
          type="button"
          onClick={handleExitAdmin}
          className="w-full flex items-center justify-center gap-2 text-xs font-semibold bg-slate-800 hover:bg-rose-900/30 hover:text-rose-300 text-slate-300 px-4 py-3 rounded-xl border border-slate-700 transition cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-3.5 h-3.5" />
          <span>Exit Admin Portal</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 h-screen sticky top-0 border-r border-slate-800 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Out Drawer & Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}