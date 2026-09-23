import AdmissionOverview from "../components/AdmissionOverview";
import ApplicantList from "../components/ApplicantList";

const AdminDashboard = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <AdmissionOverview />
      <ApplicantList />
    </div>
  );
};

export default AdminDashboard;
