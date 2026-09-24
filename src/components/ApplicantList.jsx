import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '../context/ApplicationsContext';
import { NIGERIAN_UNIVERSITIES } from '../universitiesdata';
import { isInstitutionMatch } from '../utils/institutionMatcher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faBuildingColumns,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const ApplicantList = () => {
  const { applications = [] } = useApplications();
  const [searchTerm, setSearchTerm] = useState('');
  const [universityFilter, setUniversityFilter] = useState('ALL');
  const navigate = useNavigate();

  // Resolve current admin role & institution
  const currentAdmin = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem('currentUser') ||
          localStorage.getItem('user') ||
          '{}'
      );
    } catch {
      return {};
    }
  }, []);

  const userRole = localStorage.getItem('userRole') || currentAdmin.role || 'admin';
  const isSuperAdmin = userRole === 'superadmin' || currentAdmin.role === 'superadmin';

  const adminInstitution =
    localStorage.getItem('adminInstitution') ||
    currentAdmin.institution ||
    (isSuperAdmin ? 'ApplyNow Headquarters' : 'University of Lagos (UNILAG)');

  // 1. Scope applicants to institution if university admin, or provide all if superadmin
  const scopedApplicants = useMemo(() => {
    if (isSuperAdmin) {
      if (universityFilter === 'ALL') {
        return applications;
      }
      return applications.filter((app) =>
        isInstitutionMatch(app.university, universityFilter)
      );
    }
    // University Admin: Strictly scoped to their institution
    return applications.filter((app) =>
      isInstitutionMatch(app.university, adminInstitution)
    );
  }, [applications, isSuperAdmin, adminInstitution, universityFilter]);

  // 2. Sort applications newest first
  const sortedApplicants = useMemo(() => {
    return [...scopedApplicants].sort((a, b) => {
      const timeA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const timeB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      if (timeB !== timeA) return timeB - timeA;
      return String(b.id).localeCompare(String(a.id));
    });
  }, [scopedApplicants]);

  // 3. Search filter
  const filteredApplicants = sortedApplicants.filter((app) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      app.name?.toLowerCase().includes(term) ||
      app.id?.toString().includes(term) ||
      app.program?.toLowerCase().includes(term) ||
      app.email?.toLowerCase().includes(term) ||
      app.university?.toLowerCase().includes(term)
    );
  });

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
      case 'Accepted':
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            Rejected
          </span>
        );
      case 'Under Review':
      case 'Pending':
      default:
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            Under Review
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-white p-4 sm:p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-2xs font-sans space-y-6">
      
      {/* Header and Controls Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {isSuperAdmin ? 'National Candidate Dossiers' : 'Institutional Applicants'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              {filteredApplicants.length} records
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
            {isSuperAdmin
              ? 'View verified academic submissions across all participating institutions (Audit mode).'
              : `Applications submitted to ${adminInstitution} for qualification review.`}
          </p>
        </div>

        {/* Search & Filter Inputs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* University selector for Super Admin */}
          {isSuperAdmin && (
            <div className="relative">
              <select
                value={universityFilter}
                onChange={(e) => setUniversityFilter(e.target.value)}
                className="w-full sm:w-56 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#E8792E] text-slate-700 font-medium cursor-pointer"
              >
                <option value="ALL">All Universities (All Nigeria)</option>
                {NIGERIAN_UNIVERSITIES.map((uni) => (
                  <option key={uni.id} value={uni.name}>
                    {uni.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Search Box */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
            />
            <input
              type="text"
              placeholder="Search by name, ID, program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-[#E8792E] transition-all bg-slate-50 text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Applicant ID</th>
              <th className="py-3 px-4">Candidate Name</th>
              {isSuperAdmin && <th className="py-3 px-4">University</th>}
              <th className="py-3 px-4">Program & Course</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">AI Score</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredApplicants.length > 0 ? (
              filteredApplicants.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => navigate(`/admin-dashboard/applications/${app.id}`)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-4 font-mono font-medium text-slate-900">
                    #{app.id}
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-900 group-hover:text-[#E8792E] transition">
                    <div>{app.name}</div>
                    <span className="text-[11px] text-slate-400 font-normal">{app.email}</span>
                  </td>
                  {isSuperAdmin && (
                    <td className="py-4 px-4 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faBuildingColumns} className="text-slate-400 text-xs shrink-0" />
                        <span className="truncate max-w-[200px]" title={app.university}>
                          {app.university || 'General'}
                        </span>
                      </div>
                    </td>
                  )}
                  <td className="py-4 px-4 text-slate-600">
                    {app.program || app.course || 'Undergraduate'}
                  </td>
                  <td className="py-4 px-4">{renderStatusBadge(app.status)}</td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-orange-50 text-[#E8792E] border border-orange-200">
                      {app.score || '88% Moderate'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 group-hover:text-[#E8792E] transition">
                      <span>{isSuperAdmin ? 'Inspect Dossier' : 'Review'}</span>
                      <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={isSuperAdmin ? 7 : 6}
                  className="py-12 text-center text-slate-400 text-sm"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-600">No applicant records found</p>
                    <p className="text-xs text-slate-400">
                      {searchTerm
                        ? `No applications matched "${searchTerm}". Try a different keyword.`
                        : `No applications currently recorded for this filter scope.`}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filteredApplicants.length > 0 ? (
          filteredApplicants.map((app) => (
            <div
              key={app.id}
              onClick={() => navigate(`/admin-dashboard/applications/${app.id}`)}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 cursor-pointer hover:border-[#E8792E]/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500">
                  #{app.id}
                </span>
                {renderStatusBadge(app.status)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{app.name}</h3>
                {isSuperAdmin && (
                  <p className="text-xs text-[#E8792E] font-medium flex items-center gap-1 mt-0.5">
                    <FontAwesomeIcon icon={faBuildingColumns} className="text-[10px]" />
                    <span>{app.university}</span>
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-0.5">{app.program || app.course}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <span className="text-slate-500 font-medium">AI Predictor</span>
                <span className="px-2.5 py-0.5 font-semibold rounded-full bg-orange-50 text-[#E8792E] border border-orange-200">
                  {app.score || '88% Moderate'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-slate-400 text-xs">
            No applicants found.
          </p>
        )}
      </div>

    </div>
  );
};

export default ApplicantList;