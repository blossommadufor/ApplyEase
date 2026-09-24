import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApplications } from "../context/ApplicationsContext";
import { applicationsAPI } from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheckCircle,
  faClipboardCheck,
  faLink,
  faExternalLinkAlt,
  faTimesCircle,
  faDownload,
  faArrowRight,
  faXmark,
  faGraduationCap,
  faUniversity,
  faIdCard,
  faClock,
  faFileAlt,
  faBolt,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

export const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications } = useApplications();

  const foundApp = applications.find((item) => item.id.toString() === id);
  const [fetchedApp, setFetchedApp] = useState(null);
  const [isFetching, setIsFetching] = useState(() => !foundApp);

  useEffect(() => {
    if (foundApp) return;

    let isMounted = true;
    applicationsAPI
      .getById(id)
      .then((data) => {
        if (isMounted) {
          setFetchedApp(data || null);
          setIsFetching(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Error fetching application details:", err);
          setIsFetching(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id, foundApp]);

  const app = foundApp || fetchedApp;
  const isLoading = isFetching && !app;

  // Track if user has explicitly dismissed the decision popup
  const [modalDismissed, setModalDismissed] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F9FA] flex flex-col items-center justify-center p-6 text-center">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl text-[#E8792E] mb-3" />
        <p className="text-xs font-medium text-slate-500">Loading application details...</p>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-[#F5F9FA] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white/95 backdrop-blur-xs p-8 rounded-3xl border border-[#DCE1E7] shadow-sm max-w-md w-full">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            <FontAwesomeIcon icon={faTimesCircle} />
          </div>
          <h2 className="text-xl font-bold text-[#1F2430]">
            Application Not Found
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6">
            We couldn't locate this application record in the database.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-[#E8792E] hover:bg-[#C96A28] text-white text-sm font-semibold px-5 py-3 rounded-xl transition shadow-sm cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const matchScore = app.progress || 84;
  const isAccepted = app.status === "Approved" || app.status === "Accepted";
  const isRejected = app.status === "Rejected";
  const isPending = !isAccepted && !isRejected;

  // Show decision modal automatically if accepted or rejected unless candidate dismissed it
  const showModal = !modalDismissed && (isAccepted || isRejected);

  const formattedDate = app.submittedAt
    ? new Date(app.submittedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Sep 21, 2026";

  return (
    <div className="min-h-screen bg-[#F5F9FA] text-[#1F2430] py-8 sm:py-12 px-4 sm:px-8 lg:px-16 relative font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Bar / Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 hover:text-[#E8792E] text-xs sm:text-sm font-semibold border border-[#DCE1E7] shadow-2xs transition-all cursor-pointer"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Back to Dashboard</span>
          </button>
          <span className="text-xs font-mono font-semibold px-3 py-1 bg-white/60 border border-[#DCE1E7] rounded-lg text-slate-600">
            ID: APP-{app.id}
          </span>
        </div>

        {/* Main Application Status Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-sm border border-[#DCE1E7] relative overflow-hidden">
          {/* Top Row: Institution Info & Status Badge */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#E8792E] bg-[#F5E6D8] px-2.5 py-0.5 rounded-full">
                  <FontAwesomeIcon icon={faUniversity} className="text-[10px]" />
                  Accredited Program
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  • Submitted {formattedDate}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
                {app.university || "University of Lagos (UNILAG)"}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium mt-1 flex items-center gap-2">
                <FontAwesomeIcon icon={faGraduationCap} className="text-[#E8792E]" />
                {app.course || app.program || "B.Sc. Computer Science"}
              </p>
            </div>

            {/* Dynamic Status Badge */}
            <span
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide self-start sm:self-auto border shadow-2xs inline-flex items-center gap-2 ${
                isAccepted
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300 ring-2 ring-emerald-500/20"
                  : isRejected
                  ? "bg-rose-100 text-rose-800 border-rose-300 ring-2 ring-rose-500/20"
                  : "bg-amber-100 text-amber-800 border-amber-300 ring-2 ring-amber-500/20"
              }`}
            >
              {isAccepted && <FontAwesomeIcon icon={faCheckCircle} />}
              {isRejected && <FontAwesomeIcon icon={faTimesCircle} />}
              {isPending && <FontAwesomeIcon icon={faClock} />}
              <span>{app.status || "Pending Review"}</span>
            </span>
          </div>

          {/* Circular Score Indicator */}
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={
                    isAccepted
                      ? "text-emerald-500"
                      : isRejected
                      ? "text-rose-500"
                      : "text-[#E8792E]"
                  }
                  strokeDasharray={`${matchScore}, 100`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-3xl font-extrabold text-[#1F2430]">
                  {matchScore}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  AI Fit
                </span>
              </div>
            </div>

            <div className="mt-4 text-center max-w-md">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5E6D8] text-[#E8792E] text-xs font-mono font-bold mb-2">
                <FontAwesomeIcon icon={faBolt} className="text-xs" />
                Admission Predictor Metric
              </span>
              <p className="text-xs sm:text-sm font-medium text-slate-600">
                {isAccepted
                  ? "Congratulations! Your profile benchmarks met and exceeded the departmental cutoff."
                  : isRejected
                  ? "Departmental competition was stringent for this cycle. Review alternate options."
                  : "Based on your JAMB score and secondary school records, the AI predicts a high probability of admission."}
              </p>
            </div>
          </div>

          {/* Progress Tracker Steps (Responsive Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="bg-[#1E2432] text-white p-4 rounded-2xl flex flex-col items-center text-center relative shadow-xs">
              <span className="font-bold text-xs sm:text-sm">1. Application Submitted</span>
              <span className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                <FontAwesomeIcon icon={faCheckCircle} /> {formattedDate}
              </span>
            </div>

            <div
              className={`p-4 rounded-2xl flex flex-col items-center text-center relative border transition-all ${
                isAccepted || isRejected
                  ? "bg-slate-100 text-slate-700 border-slate-200"
                  : "bg-[#E8792E] text-white border-[#E8792E] shadow-sm ring-2 ring-[#F5E6D8]"
              }`}
            >
              <span className="font-bold text-xs sm:text-sm">2. Institutional Review</span>
              <span className="text-[11px] mt-1">
                {isAccepted || isRejected ? "Evaluation Completed" : "Currently in Review"}
              </span>
            </div>

            <div
              className={`p-4 rounded-2xl flex flex-col items-center text-center relative border transition-all ${
                isAccepted
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                  : isRejected
                  ? "bg-rose-600 text-white border-rose-700 shadow-sm"
                  : "bg-slate-50 text-slate-400 border-slate-200"
              }`}
            >
              <span className="font-bold text-xs sm:text-sm">3. Official Decision</span>
              <span className="text-[11px] mt-1 font-medium">
                {isAccepted
                  ? "Admission Offered"
                  : isRejected
                  ? "Decision Concluded"
                  : "Awaiting Committee"}
              </span>
            </div>
          </div>

          {/* Prompt to reopen notice modal if closed */}
          {(isAccepted || isRejected) && !showModal && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setModalDismissed(false)}
                className="text-xs sm:text-sm font-semibold text-[#E8792E] hover:underline cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>View Official Admission Notice Popup</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>
            </div>
          )}
        </div>

        {/* Candidate Dossier Breakdown Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-sm border border-[#DCE1E7]">
          <h2 className="text-base font-bold text-[#1F2430] uppercase tracking-wide border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
            <FontAwesomeIcon icon={faIdCard} className="text-[#E8792E]" />
            <span>Applicant Credentials & Dossier</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider mb-1">
                Candidate Name
              </span>
              <span className="font-semibold text-slate-800 block truncate">
                {app.name || "Student Applicant"}
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider mb-1">
                Contact Email
              </span>
              <span className="font-semibold text-slate-800 block truncate">
                {app.email || app.contactEmail || "Not provided"}
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider mb-1">
                Phone Number
              </span>
              <span className="font-semibold text-slate-800 block truncate">
                {app.phone || app.phoneNumber || "Not provided"}
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider mb-1">
                National ID (NIN)
              </span>
              <span className="font-semibold text-slate-800 block font-mono">
                {app.nin || "Not provided"}
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider mb-1">
                JAMB UTME Score
              </span>
              <span className="font-bold text-[#E8792E] text-base">
                {app.jambScore || 270} / 400
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider mb-1">
                Target Institution
              </span>
              <span className="font-semibold text-slate-800 truncate block">
                {app.university || "UNILAG"}
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider mb-1">
                Secondary School
              </span>
              <span className="font-semibold text-slate-800 truncate block">
                {app.secondarySchool || "Federal Government College"}
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider mb-1">
                Origin / Citizenship
              </span>
              <span className="font-semibold text-slate-800 truncate block">
                {app.state ? `${app.state}, ${app.citizenship || "Nigeria"}` : (app.citizenship || "Nigeria")}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Links & Verified Documents Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Action Links */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-sm border border-[#DCE1E7]">
            <h3 className="text-base font-bold text-[#111827] mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faLink} className="text-[#E8792E]" />
              <span>Application Quick Actions</span>
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li>
                <a
                  href="#portal"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Redirecting to institution's official portal...");
                  }}
                  className="text-slate-600 hover:text-[#E8792E] flex items-center justify-between p-3 bg-slate-50 hover:bg-[#F5E6D8]/50 rounded-xl border border-slate-100 transition cursor-pointer"
                >
                  <span className="font-medium">University Portal Access</span>
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="#receipt"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Downloading official application receipt PDF...");
                  }}
                  className="text-slate-600 hover:text-[#E8792E] flex items-center justify-between p-3 bg-slate-50 hover:bg-[#F5E6D8]/50 rounded-xl border border-slate-100 transition cursor-pointer"
                >
                  <span className="font-medium">Download Application Slip (PDF)</span>
                  <FontAwesomeIcon icon={faDownload} className="text-xs text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Required Documents Status */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-sm border border-[#DCE1E7]">
            <h3 className="text-base font-bold text-[#111827] mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faClipboardCheck} className="text-[#E8792E]" />
              <span>Verified Documents Status</span>
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <FontAwesomeIcon icon={faFileAlt} className="text-[#E8792E]" />
                  <span className="text-slate-700 font-medium">
                    {app.wasceFileName || "O'Level Result Sheet"}
                  </span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] px-2.5 py-1 rounded-full font-bold">
                  Verified
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <FontAwesomeIcon icon={faFileAlt} className="text-[#E8792E]" />
                  <span className="text-slate-700 font-medium">
                    {app.jambSlipFileName || "JAMB Result Slip"}
                  </span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] px-2.5 py-1 rounded-full font-bold">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
            {/* Modal Header */}
            <div
              className={`p-6 text-white flex justify-between items-center ${
                isAccepted
                  ? "bg-emerald-600"
                  : isRejected
                  ? "bg-rose-600"
                  : "bg-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
                  {isAccepted ? "🎉" : isRejected ? "⚠️" : "ℹ️"}
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {isAccepted
                      ? "Official Admission Offer"
                      : isRejected
                      ? "Admission Status Notice"
                      : "Application Status Update"}
                  </h3>
                  <p className="text-xs text-white/90 font-medium">
                    {app.university || "University Admissions Board"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalDismissed(true)}
                className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
              {isAccepted ? (
                <>
                  <p className="font-semibold text-slate-900 text-sm sm:text-base">
                    Congratulations! We are pleased to notify you that your application for{" "}
                    <strong className="text-emerald-700">
                      {app.course || app.program}
                    </strong>{" "}
                    has been officially{" "}
                    <span className="text-emerald-600 font-bold uppercase">ACCEPTED</span>.
                  </p>
                  <p className="text-xs text-slate-600 bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100">
                    Your entrance credentials, UTME score ({app.jambScore || 270}), and O'Level
                    benchmark satisfied all requirements for the 2026/2027 academic session.
                  </p>
                  <div className="pt-2 space-y-2">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Next Clearance Milestones:
                    </p>
                    <ul className="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
                      <li>Log into JAMB CAPS and accept your official admission offer.</li>
                      <li>Download and print your provisional admission letter.</li>
                      <li>Proceed with institutional fee schedule and biodata clearance.</li>
                    </ul>
                  </div>
                </>
              ) : isRejected ? (
                <>
                  <p className="font-semibold text-slate-900">
                    Dear Applicant, thank you for your application to study{" "}
                    <span className="font-semibold">{app.course || app.program}</span>.
                  </p>
                  <p className="text-xs text-slate-600 bg-rose-50 p-3.5 rounded-2xl border border-rose-100">
                    Following an intensive review cycle of credentials and cutoff rankings, we
                    regret to inform you that we are unable to offer you admission into this
                    program for this session.
                  </p>
                  <p className="text-xs text-slate-500">
                    We invite you to consult the admissions office for possible supplementary
                    options or alternative faculties.
                  </p>
                </>
              ) : (
                <p>Your application is currently being evaluated by the admissions committee.</p>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setModalDismissed(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
              >
                Close
              </button>
              {isAccepted && (
                <button
                  onClick={() => alert("Downloading official provisional admission letter PDF...")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition cursor-pointer"
                >
                  <FontAwesomeIcon icon={faDownload} />
                  <span>Download Admission Letter</span>
                </button>
              )}
              {isRejected && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <span>Return to Dashboard</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};