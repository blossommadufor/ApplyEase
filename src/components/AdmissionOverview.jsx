import { useApplications } from '../context/ApplicationsContext'

const AdmissionOverview = () => {
  const { applications = [] } = useApplications()

  // Dynamic status counts
  const pendingCount = applications.filter(
    (app) => app.status === 'Pending' || app.status === 'Under Review'
  ).length

  const approvedCount = applications.filter(
    (app) => app.status === 'Approved' || app.status === 'Accepted'
  ).length

  const rejectedCount = applications.filter(
    (app) => app.status === 'Rejected'
  ).length

  return (
    <div className="w-full bg-[#FAFAFA] p-4 sm:p-6 lg:p-8 rounded-2xl font-sans space-y-4 sm:space-y-6">
      {/* Heading Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Admissions Overview
        </h1>
        <button className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#1E2432] rounded-lg shadow-xs hover:bg-[#2A3245] transition-colors text-center">
          Admissions Dashboard
        </button>
      </div>

      {/* Metrics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Pending Reviews Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF7F2] border border-[#FDE3CF]">
          <p className="text-xs font-semibold text-gray-800 uppercase tracking-wide mb-1 sm:mb-2">
            Pending Reviews
          </p>
          <span className="text-2xl sm:text-3xl font-bold text-gray-900">
            {pendingCount}
          </span>
        </div>

        {/* Approved Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1 sm:mb-2">
            Approved
          </p>
          <span className="text-2xl sm:text-3xl font-bold text-gray-900">
            {approvedCount}
          </span>
        </div>

        {/* Rejected Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-xs sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1 sm:mb-2">
            Rejected
          </p>
          <span className="text-2xl sm:text-3xl font-bold text-gray-900">
            {rejectedCount}
          </span>
        </div>
      </div>
    </div>
  )
}

export default AdmissionOverview