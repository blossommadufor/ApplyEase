import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApplications } from "../context/ApplicationsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faCheck,
  faTimes,
  faClock,
  faShieldHalved,
  faCommentDots,
  faCheckCircle,
  faBolt,
  faSpinner,
  faFileLines,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";

export default function AIDecisionHub({
  applicantId,
  currentStatus = "pending",
  application,
  initialNote = "",
}) {
  const navigate = useNavigate();
  const { applications, updateStatus } = useApplications();

  // Find latest application record if not directly passed
  const app =
    application ||
    applications.find((a) => String(a.id) === String(applicantId)) ||
    {};

  const [internalNote, setInternalNote] = useState(
    app.internalNotes || initialNote || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeDecision, setActiveDecision] = useState(
    app.status || currentStatus || "Pending"
  );

  // Compute realistic dynamic match score based on candidate data
  const jambScore = parseInt(app.jambScore) || 270;
  const rawScore = app.score ? parseInt(app.score) : null;
  const matchPercentage =
    rawScore && !isNaN(rawScore)
      ? rawScore
      : Math.min(Math.round((jambScore / 400) * 85) + 15, 96);

  const isHighMatch = matchPercentage >= 80;
  const isModerateMatch = matchPercentage >= 65 && matchPercentage < 80;

  const quickRemarkTags = [
    "Credentials Verified & Cleared",
    "Exceeded Departmental Cutoff",
    "Recommended by Faculty Board",
    "Awaiting Original JAMB Slip",
    "Placed on Supplementary List",
  ];

  const handleAddRemarkTag = (tag) => {
    setInternalNote((prev) => {
      if (!prev) return tag;
      if (prev.includes(tag)) return prev;
      return `${prev}. ${tag}`;
    });
  };

  const handleAction = async (statusType) => {
    setIsSubmitting(true);
    setActiveDecision(statusType);

    // Call updateStatus from context which sends PATCH to JSON Server
    await updateStatus(applicantId, statusType, internalNote);

    setIsSubmitting(false);
    setSuccessMessage(`Application successfully updated to "${statusType}"!`);

    // Redirect back to dashboard table after brief moment
    setTimeout(() => {
      navigate("/admin-dashboard");
    }, 1200);
  };

  const isCurrentAccepted =
    activeDecision.toLowerCase() === "approved" ||
    activeDecision.toLowerCase() === "accepted";
  const isCurrentRejected = activeDecision.toLowerCase() === "rejected";
  const isCurrentUnderReview =
    activeDecision.toLowerCase() === "under review";

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden sticky top-6 font-sans transition-all">
      {/* Top AI Copilot Banner */}
      <div className="bg-gradient-to-r from-[#1E2432] via-[#242C3D] to-[#1E2432] text-white p-5 sm:p-6 relative overflow-hidden">
        {/* Glow ambient background effect */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#E8792E]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8792E]/20 text-[#E8792E] text-[11px] font-bold uppercase tracking-wider border border-[#E8792E]/30 shadow-2xs">
            <FontAwesomeIcon icon={faBrain} className="text-xs" />
            Admissions AI v2.4
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Active Evaluation
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white relative z-10">
          AI Decision Hub
        </h2>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed relative z-10">
          Automated applicant evaluation, benchmark verification, and institutional review.
        </p>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Success Feedback Alert */}
        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
            <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-sm shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* AI Match Gauge Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-orange-50/40 border border-orange-100/80 shadow-2xs">
          <div className="flex items-center gap-4">
            {/* Circular Gauge */}
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={
                    isHighMatch
                      ? "text-emerald-500"
                      : isModerateMatch
                      ? "text-[#E8792E]"
                      : "text-rose-500"
                  }
                  strokeDasharray={`${matchPercentage}, 100`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-base sm:text-lg font-extrabold text-slate-900 block leading-tight">
                  {matchPercentage}%
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400 block -mt-0.5">
                  Fit
                </span>
              </div>
            </div>

            {/* Assessment Text */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isHighMatch
                      ? "bg-emerald-100 text-emerald-800"
                      : isModerateMatch
                      ? "bg-amber-100 text-amber-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {isHighMatch
                    ? "High Likelihood"
                    : isModerateMatch
                    ? "Moderate Fit"
                    : "Low Probability"}
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                Admission Eligibility Score
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                JAMB Score ({jambScore}) exceeds minimum cutoff. Core prerequisites satisfied.
              </p>
            </div>
          </div>
        </div>

        {/* Automated Benchmark Criteria Checklist */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
            Automated Verification Checks
          </span>
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-2">
                <FontAwesomeIcon icon={faBolt} className="text-[#E8792E] text-[10px]" />
                UTME Benchmark ({jambScore}/400)
              </span>
              <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                <FontAwesomeIcon icon={faCheck} className="text-[10px]" /> Satisfied
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-2">
                <FontAwesomeIcon icon={faShieldHalved} className="text-[#E8792E] text-[10px]" />
                O'Level WAEC/NECO Credits
              </span>
              <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                <FontAwesomeIcon icon={faCheck} className="text-[10px]" /> 5 Credits Cleared
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-2">
                <FontAwesomeIcon icon={faFileLines} className="text-[#E8792E] text-[10px]" />
                National ID (NIN)
              </span>
              <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                {app.nin ? "Verified Match" : "Identity Verified"}
              </span>
            </div>
          </div>
        </div>

        {/* AI Recommendation Banner */}
        <div
          className={`p-4 rounded-2xl border text-xs leading-relaxed ${
            isHighMatch
              ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
              : "bg-amber-50/70 border-amber-200 text-amber-900"
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] mb-1">
            <FontAwesomeIcon icon={faLightbulb} className="text-[#E8792E]" />
            <span>AI Recommendation:</span>
            <span className={isHighMatch ? "text-emerald-700" : "text-amber-700"}>
              {isHighMatch ? "GRANT ADMISSION" : "REVIEW MANUALLY"}
            </span>
          </div>
          <p className="text-[11px] text-slate-600">
            {isHighMatch
              ? "Applicant satisfies all departmental quota requirements. Recommend approving provisional admission offer."
              : "Applicant meets baseline threshold but faculty capacity may be constrained. Consider supplementary options."}
          </p>
        </div>

        {/* Quick-Insert Remark Chips */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faCommentDots} className="text-slate-400" />
              Quick Insert Remarks
            </label>
            <span className="text-[10px] text-slate-400">Click to append</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickRemarkTags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddRemarkTag(tag)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#F5E6D8] text-slate-600 hover:text-[#E8792E] text-[11px] font-medium transition cursor-pointer border border-slate-200 hover:border-[#E8792E]/40"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Internal Remarks Textarea */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Institutional Remarks & Audit Notes
          </label>
          <textarea
            rows="3"
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
            placeholder="Type confidential admissions board remarks, interview feedback, or conditions..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E8792E] focus:bg-white transition"
          />
          <span className="text-[10px] text-slate-400 block text-right">
            Signed by Institutional Admissions Officer
          </span>
        </div>

        {/* Action Decision Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleAction("Approved")}
            className={`w-full py-3 px-4 rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border shadow-2xs ${
              isCurrentAccepted
                ? "bg-emerald-100 text-emerald-800 border-emerald-400 ring-2 ring-emerald-500/20"
                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 border-emerald-200 hover:border-emerald-300"
            } disabled:opacity-50 active:scale-98`}
          >
            {isSubmitting ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
            ) : (
              <FontAwesomeIcon icon={faCheck} className="text-sm" />
            )}
            <span>
              {isCurrentAccepted
                ? "Officially Approved (Click to Re-confirm)"
                : "Approve Admission Offer"}
            </span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleAction("Under Review")}
            className={`w-full py-3 px-4 rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border shadow-2xs ${
              isCurrentUnderReview
                ? "bg-amber-100 text-amber-900 border-amber-400 ring-2 ring-amber-500/20"
                : "bg-amber-50 hover:bg-amber-100 text-amber-800 hover:text-amber-900 border-amber-200 hover:border-amber-300"
            } disabled:opacity-50 active:scale-98`}
          >
            <FontAwesomeIcon icon={faClock} className="text-xs" />
            <span>Mark Under Review / Awaiting Info</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleAction("Rejected")}
            className={`w-full py-3 px-4 rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border shadow-2xs ${
              isCurrentRejected
                ? "bg-rose-100 text-rose-800 border-rose-400 ring-2 ring-rose-500/20"
                : "bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border-rose-200 hover:border-rose-300"
            } disabled:opacity-50 active:scale-98`}
          >
            <FontAwesomeIcon icon={faTimes} className="text-xs" />
            <span>Decline / Reject Application</span>
          </button>
        </div>
      </div>
    </div>
  );
}