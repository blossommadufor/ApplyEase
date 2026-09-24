import { useMemo } from "react";
import { useApplications } from "../context/ApplicationsContext";
import { NIGERIAN_UNIVERSITIES } from "../universitiesdata";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faFileLines,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faShieldHalved,
  faEye,
  faChartPie,
  faSchool,
} from "@fortawesome/free-solid-svg-icons";

import { isInstitutionMatch } from "../utils/institutionMatcher";

const AdmissionOverview = () => {
  const { applications = [] } = useApplications();

  // Resolve current logged in admin details
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

  const adminInstitution =
    localStorage.getItem("adminInstitution") ||
    currentAdmin.institution ||
    (isSuperAdmin ? "ApplyNow Headquarters" : "University of Lagos (UNILAG)");

  // 1. If Super Admin: analyze all applications across all institutions
  // 2. If University Admin: scope ONLY to their accredited institution
  const scopedApplications = useMemo(() => {
    if (isSuperAdmin) {
      return applications;
    }
    return applications.filter((app) =>
      isInstitutionMatch(app.university, adminInstitution)
    );
  }, [applications, isSuperAdmin, adminInstitution]);

  // Status counts for the active scope
  const pendingCount = scopedApplications.filter(
    (app) => app.status === "Pending" || app.status === "Under Review"
  ).length;

  const approvedCount = scopedApplications.filter(
    (app) => app.status === "Approved" || app.status === "Accepted"
  ).length;

  const rejectedCount = scopedApplications.filter(
    (app) => app.status === "Rejected"
  ).length;

  const totalCount = scopedApplications.length;

  // Platform-wide University Activity Breakdown (For App Admin)
  const universityBreakdown = useMemo(() => {
    if (!isSuperAdmin) return [];

    // Map each university in NIGERIAN_UNIVERSITIES or found in applications
    const map = {};

    // First populate from registered universities in data
    NIGERIAN_UNIVERSITIES.forEach((uni) => {
      map[uni.name] = {
        name: uni.name,
        state: uni.state,
        total: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
      };
    });

    // Aggregate counts from actual applications
    applications.forEach((app) => {
      const uniName = app.university || "Other / Unassigned";
      if (!map[uniName]) {
        map[uniName] = {
          name: uniName,
          state: "Federal",
          total: 0,
          approved: 0,
          rejected: 0,
          pending: 0,
        };
      }

      map[uniName].total += 1;
      const st = (app.status || "").toLowerCase();
      if (st === "approved" || st === "accepted") {
        map[uniName].approved += 1;
      } else if (st === "rejected") {
        map[uniName].rejected += 1;
      } else {
        map[uniName].pending += 1;
      }
    });

    // Return list with universities that have applications first, then others
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [isSuperAdmin, applications]);

  // Unique partner universities with applications or in system
  const totalPartnerUnis = NIGERIAN_UNIVERSITIES.length;

  return (
    <div className="w-full bg-[#FAFAFA] p-4 sm:p-6 lg:p-8 rounded-3xl font-sans space-y-6 border border-slate-200 shadow-2xs">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isSuperAdmin
                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                  : "bg-emerald-100 text-emerald-800 border border-emerald-200"
              }`}
            >
              <FontAwesomeIcon icon={isSuperAdmin ? faShieldHalved : faBuildingColumns} />
              <span>{isSuperAdmin ? "ApplyNow App Admin Portal" : "Institutional Admin Console"}</span>
            </span>
            {isSuperAdmin && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                <FontAwesomeIcon icon={faEye} className="text-[10px]" />
                View-Only Governance Mode
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isSuperAdmin ? "Global Admissions Analytics" : `Admissions Overview`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
            {isSuperAdmin
              ? "Comprehensive multi-tenant view of all universities, candidate dossiers, and decision metrics across Nigeria."
              : `Real-time candidate submissions and enrollment workflow for ${adminInstitution}.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 shadow-2xs font-medium">
            Active Scope: <strong className="text-slate-900">{isSuperAdmin ? "All Partner Universities" : adminInstitution}</strong>
          </div>
        </div>
      </div>

      {/* Notice Banner for Platform Admin */}
      {isSuperAdmin && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-slate-50 to-orange-50 border border-purple-100 text-xs sm:text-sm text-slate-700 flex items-start gap-3">
          <FontAwesomeIcon icon={faShieldHalved} className="text-purple-600 mt-0.5 text-base shrink-0" />
          <div className="leading-relaxed">
            <strong className="text-purple-900 block font-semibold">Platform Administrator Rights & Limitations:</strong>
            As ApplyNow Platform Super Admin, you have platform-wide monitoring rights to inspect all partner universities and candidate numbers. In compliance with Nigerian tertiary admissions regulations, 
            <span className="font-semibold text-slate-900"> you cannot approve or reject candidate offers</span>; admission decisions are strictly executed by accredited university officers.
          </div>
        </div>
      )}

      {/* Key Metric Cards */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          isSuperAdmin ? "lg:grid-cols-5" : "lg:grid-cols-4"
        } gap-4`}
      >
        {/* App Admin Exclusive: Total Partner Universities */}
        {isSuperAdmin && (
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-purple-300 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Partner Unis
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xs">
                <FontAwesomeIcon icon={faSchool} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {totalPartnerUnis}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Accredited institutions</span>
          </div>
        )}

        {/* Total Applications Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#E8792E]/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Applications
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-xs">
              <FontAwesomeIcon icon={faFileLines} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {totalCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {isSuperAdmin ? "Across all institutions" : "For your university"}
          </span>
        </div>

        {/* Pending Reviews Card */}
        <div className="p-5 rounded-2xl bg-[#FFF7F2] border border-[#FDE3CF] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#E8792E] uppercase tracking-wider">
              Pending / Under Review
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-100/80 text-[#E8792E] flex items-center justify-center text-xs">
              <FontAwesomeIcon icon={faClock} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {pendingCount}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Awaiting board action</span>
        </div>

        {/* Approved Card */}
        <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Approved
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {approvedCount}
          </div>
          <span className="text-[11px] text-emerald-700 mt-1 block">Admission offers confirmed</span>
        </div>

        {/* Rejected Card */}
        <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
              Rejected
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-xs">
              <FontAwesomeIcon icon={faTimesCircle} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {rejectedCount}
          </div>
          <span className="text-[11px] text-rose-700 mt-1 block">Cutoff / quota exceeded</span>
        </div>
      </div>

      {/* Super Admin Exclusive: University Activity Table */}
      {isSuperAdmin && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faChartPie} className="text-[#E8792E]" />
                University Admissions Activity Breakdown
              </h2>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Real-time tracking of candidate applications, reviews, and decisions per accredited tertiary institution.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium self-start sm:self-auto">
              Live Synchronized Metrics
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3 px-3">University</th>
                  <th className="py-3 px-3">State</th>
                  <th className="py-3 px-3 text-center">Total Applicants</th>
                  <th className="py-3 px-3 text-center">Approved</th>
                  <th className="py-3 px-3 text-center">Under Review</th>
                  <th className="py-3 px-3 text-center">Rejected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {universityBreakdown.slice(0, 10).map((uni, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2">
                      <FontAwesomeIcon icon={faBuildingColumns} className="text-slate-400 text-xs" />
                      <span>{uni.name}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{uni.state}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">
                      {uni.total}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
                        {uni.approved}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold text-xs border border-amber-200">
                        {uni.pending}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold text-xs border border-rose-200">
                        {uni.rejected}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdmissionOverview;