import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApplications } from "../context/ApplicationsContext";
import { applicationsAPI } from "../services/api";
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
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

export const ApplicationDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("applications");
  const { applications } = useApplications();

  const currentUser = (() => {
    try {
      const stored =
        localStorage.getItem("currentUser") || localStorage.getItem("user");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  })();

  const currentEmail = (
    currentUser.email ||
    currentUser.contactEmail ||
    ""
  )
    .toLowerCase()
    .trim();

  const [fetchedApplications, setFetchedApplications] = useState([]);
  const [isFetching, setIsFetching] = useState(() => Boolean(currentEmail));

  // Directly fetch only the applications linked strictly to this user's email
  useEffect(() => {
    if (!currentEmail) return;

    let isMounted = true;
    applicationsAPI
      .getByEmail(currentEmail)
      .then((data) => {
        if (isMounted) {
          const list = Array.isArray(data) ? data : [];
          setFetchedApplications(list);
          setIsFetching(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Failed to fetch user applications:", err);
          setFetchedApplications([]);
          setIsFetching(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentEmail]);

  // Derived user applications list combining direct fetch and context updates (e.g. freshly submitted)
  const map = new Map();
  if (currentEmail) {
    fetchedApplications.forEach((a) => map.set(String(a.id), a));

    if (Array.isArray(applications)) {
      applications.forEach((a) => {
        const appEmail = (a.email || a.contactEmail || "").toLowerCase().trim();
        if (appEmail === currentEmail) {
          map.set(String(a.id), a);
        }
      });
    }
  }

  const userApplications = Array.from(map.values()).sort((a, b) => {
    const timeA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
    const timeB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
    if (timeB !== timeA) return timeB - timeA;
    return String(b.id).localeCompare(String(a.id));
  });

  const loading = isFetching && userApplications.length === 0;

  const rawName =
    currentUser.fullName ||
    currentUser.name ||
    currentUser.firstName ||
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
      <div className="bg-white border-b border-[#DCE1E7] px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#1F2430]">
              Welcome back, {firstName}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Review your personal application progress and admissions status.
            </p>
          </div>
          <button
            onClick={() => navigate("/select-university")}
            className="inline-flex items-center justify-center gap-2 bg-[#E8792E] text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-xl shadow-xs hover:bg-[#C96A28] transition cursor-pointer self-start md:self-auto"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Start New Application</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex items-center gap-6 border-b border-[#DCE1E7] mb-6">
          <button
            onClick={() => setActiveTab("applications")}
            className={`pb-3 text-xs sm:text-sm font-medium flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === "applications"
                ? "border-[#E8792E] text-[#E8792E]"
                : "border-transparent text-slate-500 hover:text-[#1F2430]"
            }`}
          >
            <FontAwesomeIcon icon={faFolderOpen} />
            <span>My Applications ({userApplications.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`pb-3 text-xs sm:text-sm font-medium flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === "transactions"
                ? "border-[#E8792E] text-[#E8792E]"
                : "border-transparent text-slate-500 hover:text-[#1F2430]"
            }`}
          >
            <FontAwesomeIcon icon={faReceipt} />
            <span>Transaction History</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {userApplications.map((app, index) => {
                const status = app.status || "Pending";
                const statusConfig = getStatusConfig(status);

                return (
                  <div
                    key={app.id || index}
                    onClick={() => navigate(`/dashboard/application/${app.id || index}`)}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-[#E8792E]/40 transition-all duration-300 cursor-pointer flex flex-col justify-between group space-y-4"
                  >
                    <div>
                      {/* Top Header Row */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium">
                          #{app.id}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${statusConfig.bg}`}
                        >
                          <FontAwesomeIcon icon={statusConfig.icon} className="text-[11px]" />
                          <span>{status}</span>
                        </span>
                      </div>

                      {/* Course / Program Title */}
                      <div className="flex items-start gap-3 mt-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F5E6D8] text-[#E8792E] flex items-center justify-center shrink-0 text-sm shadow-2xs">
                          <FontAwesomeIcon icon={faGraduationCap} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm sm:text-base text-slate-900 group-hover:text-[#E8792E] transition line-clamp-1">
                            {app.program || app.course}
                          </h3>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {app.university || "University Application"}
                          </p>
                        </div>
                      </div>

                      {/* Application Info Chips */}
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <span className="text-slate-400 block text-[11px]">JAMB Score</span>
                          <span className="font-medium text-slate-700">
                            {app.jambScore ? `${app.jambScore} pts` : "N/A"}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <span className="text-slate-400 block text-[11px]">Submission</span>
                          <span className="font-medium text-slate-700 truncate block">
                            {app.submittedAt
                              ? new Date(app.submittedAt).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Recent"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Link */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-[#E8792E] group-hover:translate-x-0.5 transition-transform">
                      <span>View Dossier & Status</span>
                      <FontAwesomeIcon icon={faChevronRight} className="text-[11px]" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center max-w-lg mx-auto my-8 space-y-4">
              <div className="w-14 h-14 bg-[#F5E6D8] text-[#E8792E] rounded-full flex items-center justify-center mx-auto text-xl shadow-2xs">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <h3 className="text-lg font-medium text-[#1F2430]">No Applications Found</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                You haven't submitted an admission application under this candidate profile yet.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate("/select-university")}
                  className="bg-[#E8792E] text-white text-xs sm:text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-[#C96A28] transition cursor-pointer shadow-xs"
                >
                  Apply to an Institution
                </button>
              </div>
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