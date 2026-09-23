import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApplications } from "../context/ApplicationsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faGraduationCap,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faReceipt,
  faFolderOpen,
  faChevronRight,
  faUser,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

export const ApplicationDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("applications");
  const { applications, loading } = useApplications();

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("user") ||
          localStorage.getItem("currentUser") ||
          "{}"
      );
    } catch {
      return {};
    }
  }, []);

  const currentEmail = (currentUser.email || "").toLowerCase().trim();
  const currentName = (currentUser.fullName || currentUser.name || "").toLowerCase().trim();

  // Dynamic filter matching active user's identity from JSON Server data
  const userApplications = useMemo(() => {
    const sourceApps = Array.isArray(applications) ? applications : [];

    // Strictly match authenticated user's email for complete data isolation
    if (currentEmail) {
      return sourceApps.filter((app) => {
        const appEmail = (app.email || app.contactEmail || "").toLowerCase().trim();
        return appEmail === currentEmail;
      });
    }

    if (currentName) {
      return sourceApps.filter((app) => {
        const appName = (app.name || "").toLowerCase().trim();
        return appName === currentName;
      });
    }

    return sourceApps;
  }, [applications, currentEmail, currentName]);

  const rawName =
    currentUser.firstName ||
    currentUser.name ||
    userApplications[0]?.name ||
    "Applicant";
  const firstName = rawName.trim().split(" ")[0];

  const getStatusConfig = (statusStr) => {
    const s = (statusStr || "Pending").toLowerCase();
    if (s === "approved" || s === "submitted") {
      return {
        bg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        icon: faCheckCircle,
      };
    } else if (s === "rejected") {
      return {
        bg: "bg-rose-50 text-rose-700 border border-rose-200",
        icon: faTimesCircle,
      };
    } else {
      // Pending / Under Review
      return {
        bg: "bg-amber-50 text-amber-700 border border-amber-200",
        icon: faClock,
      };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Banner */}
      <div className="bg-white border-b border-[#DCE1E7] px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1F2430]">
              Welcome back, {firstName}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Review your personal application progress and status.
            </p>
          </div>
          <button
            onClick={() => navigate("/select-university")}
            className="inline-flex items-center justify-center gap-2 bg-[#E8792E] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-[#C96A28] transition cursor-pointer self-start md:self-auto"
          >
            <FontAwesomeIcon icon={faPlus} />
            Start New Application
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
     
        <div className="flex items-center gap-6 border-b border-[#DCE1E7] mb-6">
          <button
            onClick={() => setActiveTab("applications")}
            className={`pb-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === "applications"
                ? "border-[#E8792E] text-[#E8792E]"
                : "border-transparent text-slate-500 hover:text-[#1F2430]"
            }`}
          >
            <FontAwesomeIcon icon={faFolderOpen} />
            My Applications ({userApplications.length})
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`pb-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === "transactions"
                ? "border-[#E8792E] text-[#E8792E]"
                : "border-transparent text-slate-500 hover:text-[#1F2430]"
            }`}
          >
            <FontAwesomeIcon icon={faReceipt} />
            Transaction History
          </button>
        </div>

        {/* Applications View */}
        {activeTab === "applications" ? (
          loading ? (
            <div className="py-20 text-center text-slate-400">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl text-[#E8792E] mb-3" />
              <p className="text-xs font-medium">Fetching applications from server...</p>
            </div>
          ) : userApplications.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {userApplications.map((app, index) => {
                const status = app.status || "Pending";
                const statusConfig = getStatusConfig(status);

                return (
                  <div
                    key={app.id || index}
                    onClick={() => navigate(`/dashboard/application/${app.id || index}`)}
                    className="bg-white rounded-lg border border-[#DCE1E7] p-4 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          #{app.id}
                        </span>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${statusConfig.bg}`}
                        >
                          <FontAwesomeIcon icon={statusConfig.icon} />
                          {status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#E8792E] uppercase tracking-wider mb-2">
                        <FontAwesomeIcon icon={faUser} className="text-[10px]" />
                        <span className="truncate">{app.name}</span>
                      </div>

                      <div className="flex items-start gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-md bg-[#F5E6D8] text-[#E8792E] flex items-center justify-center shrink-0 text-xs">
                          <FontAwesomeIcon icon={faGraduationCap} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-xs sm:text-sm text-[#1F2430] group-hover:text-[#E8792E] transition truncate">
                            {app.program || app.course}
                          </h3>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {app.university || "University Application"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 mt-2 flex items-center justify-between text-[11px] font-medium text-[#E8792E]">
                      <span>View Details</span>
                      <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-[#DCE1E7] p-8 text-center max-w-md mx-auto my-8">
              <div className="w-12 h-12 bg-[#F5E6D8] text-[#E8792E] rounded-full flex items-center justify-center mx-auto mb-3 text-lg">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <h3 className="text-base font-bold text-[#1F2430]">No Application Found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                You haven't submitted an application under this account yet.
              </p>
              <button
                onClick={() => navigate("/select-university")}
                className="bg-[#E8792E] text-white text-xs font-semibold px-5 py-2 rounded-lg hover:bg-[#C96A28] transition cursor-pointer"
              >
                Apply to an Institution
              </button>
            </div>
          )
        ) : (
          <div className="bg-white rounded-lg border border-[#DCE1E7] p-6 text-slate-500 text-xs text-center">
            No recent payment transactions recorded.
          </div>
        )}
      </div>
    </div>
  );
};