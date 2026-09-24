import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBuilding,
  faRightFromBracket,
  faBell,
  faUserTie,
  faShieldHalved,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

export const AdminNavbar = ({ onToggleSidebar, setIsAdminLoggedIn }) => {
  const navigate = useNavigate();

  const currentAdmin = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("currentUser") ||
          localStorage.getItem("user") ||
          "{}"
      );
    } catch {
      return {};
    }
  }, []);

  const userRole = localStorage.getItem("userRole") || currentAdmin.role || "admin";
  const isSuperAdmin = userRole === "superadmin" || currentAdmin.role === "superadmin";

  const adminName =
    currentAdmin.fullName ||
    currentAdmin.name ||
    (isSuperAdmin ? "ApplyNow Platform Admin" : "Dr. Samuel Adeyemi");

  const institutionName =
    localStorage.getItem("adminInstitution") ||
    currentAdmin.institution ||
    (isSuperAdmin ? "ApplyNow Platform Administration" : "University of Lagos (UNILAG)");

  const handleSignOut = () => {
    if (typeof setIsAdminLoggedIn === "function") {
      setIsAdminLoggedIn(false);
    }
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminInstitution");
    localStorage.removeItem("userRole");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user");
    navigate("/auth", { replace: true });
  };

  return (
    <header className="h-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 shadow-xs shrink-0 w-full">
      {/* Left side: Hamburger toggle + Partner Institution branding */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer shrink-0"
          aria-label="Toggle navigation drawer"
        >
          <FontAwesomeIcon icon={faBars} className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#1E2432] text-white flex items-center justify-center shrink-0 shadow-xs hidden sm:flex">
            <FontAwesomeIcon icon={isSuperAdmin ? faShieldHalved : faBuilding} className="text-sm text-[#E8792E]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {institutionName}
              </h2>
              {isSuperAdmin ? (
                <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 shrink-0">
                  <FontAwesomeIcon icon={faShieldHalved} className="text-[9px]" />
                  Platform Super Admin
                </span>
              ) : (
                <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-[9px]" />
                  Accredited Partner
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              {isSuperAdmin
                ? "National Multi-Tenant Admissions System Console"
                : "Institutional Admissions & Enrollment Console"}
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Notifications, Profile pill, Sign Out button */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Notifications Icon */}
        <button
          type="button"
          onClick={() => alert("No unread administrator alerts at this time.")}
          className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer hidden sm:block"
          title="Notifications"
        >
          <FontAwesomeIcon icon={faBell} className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E8792E] rounded-full ring-2 ring-white"></span>
        </button>

        {/* Admin Profile Badge */}
        <div className="flex items-center gap-2.5 pl-2 sm:border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <FontAwesomeIcon icon={isSuperAdmin ? faShieldHalved : faUserTie} className="text-xs" />
          </div>
          <div className="hidden md:block text-left">
            <span className="text-xs font-bold text-slate-900 block truncate max-w-[130px]">
              {adminName}
            </span>
            <span className="text-[10px] text-[#E8792E] font-semibold flex items-center gap-1">
              <FontAwesomeIcon icon={faShieldHalved} className="text-[9px]" />
              {isSuperAdmin ? "Super Admin (Audit)" : "Admissions Officer"}
            </span>
          </div>
        </div>

        {/* Functional Exit / Sign Out Button */}
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
          title="Exit Admin Console"
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
          <span>Exit Portal</span>
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
