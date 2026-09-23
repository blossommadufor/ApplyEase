import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApplications } from '../context/ApplicationsContext'

const ApplicantList = () => {
  const { applications = [] } = useApplications()
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  // Sort applications with the newest first (by submittedAt descending or ID)
  const sortedApplicants = [...applications].sort((a, b) => {
    const timeA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
    const timeB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
    if (timeB !== timeA) return timeB - timeA;
    return String(b.id).localeCompare(String(a.id));
  });

  const filteredApplicants = sortedApplicants.filter((app) => {
    const term = searchTerm.toLowerCase();
    return (
      app.name?.toLowerCase().includes(term) ||
      app.id?.toString().includes(term) ||
      app.program?.toLowerCase().includes(term) ||
      app.email?.toLowerCase().includes(term)
    );
  });

  
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
      case 'Accepted':
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
            Approved
          </span>
        )
      case 'Rejected':
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Rejected
          </span>
        )
      case 'Under Review':
      case 'Pending':
      default:
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
            Under Review
          </span>
        )
    }
  }

  return (
    <div className="w-full bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-xs font-sans space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          Applicants
        </h2>
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all bg-gray-50/50"
          />
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-bold text-gray-800">
              <th className="py-3 px-4">Applicant ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Program</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">AI Predictor Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs sm:text-sm text-gray-700">
            {filteredApplicants.length > 0 ? (
              filteredApplicants.map((app) => (
                <tr 
                  key={app.id} 
                  onClick={() => navigate(`/admin-dashboard/applications/${app.id}`)}
                  className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-4 font-medium text-gray-900">{app.id}</td>
                  <td className="py-4 px-4 font-medium text-indigo-600 hover:underline">{app.name}</td>
                  <td className="py-4 px-4 text-gray-600">{app.program}</td>
                  <td className="py-4 px-4">{renderStatusBadge(app.status)}</td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-amber-100/80 text-amber-900">
                      {app.score || '88% Moderate'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-400 text-sm">
                  No applicants found.
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
              className="p-4 rounded-xl border border-gray-100 bg-gray-50/40 space-y-3 cursor-pointer hover:border-gray-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400">
                  #{app.id}
                </span>
                {renderStatusBadge(app.status)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">{app.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{app.program}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                <span className="text-gray-500 font-medium">AI Predictor</span>
                <span className="px-2.5 py-0.5 font-semibold rounded-full bg-amber-100 text-amber-900">
                  {app.score || '88% Moderate'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="py-6 text-center text-gray-400 text-sm">
            No applicants found.
          </p>
        )}
      </div>
    </div>
  )
}

export default ApplicantList