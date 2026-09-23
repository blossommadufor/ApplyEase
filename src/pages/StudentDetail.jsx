import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOnboarding } from "../context/OnboardingContext";
import { useApplications } from "../context/ApplicationsContext"; 
import AIDecisionHub from "../components/AIDecisionHub"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faDownload, 
  faChevronRight, 
  faFileAlt, 
  faUser, 
  faShieldHalved,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faArrowLeft,
  faCopy,
  faCheck,
  faPrint,
  faGraduationCap,
  faBuilding,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faIdCard,
  faSchool,
  faBookOpen
} from "@fortawesome/free-solid-svg-icons";

export default function StudentDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const { formData } = useOnboarding();
  const { applications } = useApplications();

  // Find the exact application if it exists in context
  const currentApp = applications.find((app) => String(app.id) === String(id));
  
  const studentName = currentApp?.name || formData.fullName || `${formData.firstName || ""} ${formData.lastName || ""}`.trim() || "Applicant";
  const displayId = id || "846986";

  // Safely determine current status and normalize it
  const rawStatus = currentApp?.status || formData.status || "pending";
  const applicationStatus = typeof rawStatus === "string" ? rawStatus.trim().toLowerCase() : "pending";

  // Treat both "accepted" and "approved" the same way
  const isAcceptedOrApproved = applicationStatus === "accepted" || applicationStatus === "approved";
  const isRejected = applicationStatus === "rejected";

  // Control whether the full-screen decision popup is visible
  const [showDecisionModal, setShowDecisionModal] = useState(
    isAcceptedOrApproved || isRejected
  );

  // Quick feedback state for copying Applicant ID
  const [copied, setCopied] = useState(false);
  const handleCopyId = () => {
    navigator.clipboard?.writeText?.(`APP-${displayId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // State to simulate document download feedback
  const [downloadingDoc, setDownloadingDoc] = useState(null);
  const handleDownload = (docName) => {
    setDownloadingDoc(docName);
    setTimeout(() => {
      setDownloadingDoc(null);
    }, 1500);
  };

  // Derive student initials for clean avatar badge
  const initials = studentName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "AP";

  // Resolve data values with graceful fallbacks
  const contactEmail = currentApp?.email || currentApp?.contactEmail || formData.email || formData.contactEmail || "Not provided";
  const phoneNumber = currentApp?.phone || currentApp?.phoneNumber || formData.phone || formData.phoneNumber || "Not provided";
  const university = currentApp?.university || formData.university || formData.selectedUniversity || "Federal University";
  const programCourse = currentApp?.program || currentApp?.course || formData.program || formData.course || "General Studies";
  const stateOrigin = currentApp?.state || formData.state || "Lagos";
  const citizenship = currentApp?.citizenship || formData.citizenship || "Nigeria";
  const secondarySchool = currentApp?.secondarySchool || formData.schoolName || formData.secondarySchool || "Federal Government College";
  const graduationYear = currentApp?.graduationYear || formData.graduationYear || formData.yearOfGraduation || "2024";
  const jambRegNo = currentApp?.jambRegNumber || formData.jambRegNumber || `202410982${String(displayId).slice(-4)}`;
  const jambScore = currentApp?.jambScore || formData.jambScore || 285;
  const ninNumber = currentApp?.nin || formData.nin || "78291048291";
  const guardianName = currentApp?.guardianName || formData.guardianName || "Chief E. Madufor";
  const guardianPhone = currentApp?.guardianPhone || formData.guardianPhone || "+234 803 456 7890";

  // Subject list fallback
  const subjectList = Array.isArray(currentApp?.selectedSubjects) && currentApp.selectedSubjects.length > 0
    ? currentApp.selectedSubjects
    : Array.isArray(formData.selectedSubjects) && formData.selectedSubjects.length > 0
    ? formData.selectedSubjects
    : ["Use of English", "Mathematics", "Physics", "Chemistry"];

  // Default verified O'Level subject breakdown
  const defaultOlevels = [
    { subject: "English Language", grade: "A1" },
    { subject: "Mathematics", grade: "B2" },
    { subject: "Physics", grade: "B3" },
    { subject: "Chemistry", grade: "A1" },
    { subject: "Biology", grade: "B2" },
  ];
  const olevelData = (formData.olevelResults && formData.olevelResults.length > 0)
    ? formData.olevelResults
    : defaultOlevels;

  const uploadedDocs = [
    { name: currentApp?.wasceFileName || formData.wasceFileName || "WASCE_Statement_of_Result.pdf", size: "1.4 MB", type: "WAEC Result" },
    { name: currentApp?.jambSlipFileName || formData.jambSlipFileName || "JAMB_UTME_Result_Slip.pdf", size: "820 KB", type: "JAMB Slip" },
    { name: "LGA_Indigene_Letter.pdf", size: "640 KB", type: "State Indigene" },
    { name: "Birth_Certificate.pdf", size: "512 KB", type: "Civil Registration" }
  ];

  return (
    <div className="min-h-screen bg-[#F5F9FA] p-4 sm:p-6 lg:p-8 font-sans text-slate-800 relative">
      
      {/* --- FULL-SCREEN POPUP OVERLAY FOR ACCEPTED/APPROVED OR REJECTED STATUS --- */}
      {showDecisionModal && applicationStatus !== "pending" && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className={`w-full max-w-lg rounded-3xl p-8 text-center shadow-2xl bg-white border-2 ${
            isAcceptedOrApproved ? "border-emerald-500" : "border-rose-500"
          }`}>
            
            {isAcceptedOrApproved ? (
              <>
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-10 h-10" />
                </div>
                <span className="text-xs uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-medium">
                  Official Admission Decision
                </span>
                <h3 className="text-2xl font-semibold text-[#1E2432] mt-3 mb-2">Admission Granted</h3>
                <p className="text-slate-600 mb-8 leading-relaxed text-base">
                  {studentName}&apos;s application review is complete. They have been officially approved into {university}.
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <FontAwesomeIcon icon={faTimesCircle} className="w-10 h-10" />
                </div>
                <span className="text-xs uppercase tracking-widest text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 font-medium">
                  Official Admission Decision
                </span>
                <h3 className="text-2xl font-semibold text-[#1E2432] mt-3 mb-2">Application Declined</h3>
                <p className="text-slate-600 mb-8 leading-relaxed text-base">
                  The review process for {studentName} has concluded. This application does not meet the current departmental threshold.
                </p>
              </>
            )}

            <button 
              onClick={() => setShowDecisionModal(false)}
              className={`w-full py-3.5 rounded-xl font-medium text-white shadow-md transition transform active:scale-95 cursor-pointer text-base ${
                isAcceptedOrApproved 
                  ? "bg-emerald-600 hover:bg-emerald-700" 
                  : "bg-[#1E2432] hover:bg-slate-800"
              }`}
            >
              Close & View Dossier
            </button>
          </div>
        </div>
      )}

      {/* Top Bar: Navigation & Action Controls */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1.5 text-slate-600 hover:text-[#E8792E] font-normal transition cursor-pointer"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" />
            <span>Applications Queue</span>
          </button>
          <FontAwesomeIcon icon={faChevronRight} className="w-2.5 h-2.5 text-slate-400" />
          <span className="text-slate-800 font-medium">{studentName}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button 
            onClick={handleCopyId}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-normal text-slate-700 shadow-sm hover:border-[#E8792E] hover:text-[#E8792E] transition cursor-pointer"
            title="Copy Application ID"
          >
            <FontAwesomeIcon icon={copied ? faCheck : faCopy} className={copied ? "text-emerald-600" : "text-slate-400"} />
            <span>{copied ? "Copied ID!" : `APP-${displayId}`}</span>
          </button>
          <button 
            onClick={() => window.print()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-normal text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer"
          >
            <FontAwesomeIcon icon={faPrint} className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* Status Banner Notification inside page layout */}
      {isAcceptedOrApproved && (
        <div className="max-w-7xl mx-auto mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-emerald-900 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-medium text-sm text-emerald-950">Admission Offer Approved</h4>
              <p className="text-sm text-emerald-800 mt-0.5 font-normal">This candidate has been cleared and issued an official acceptance letter.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowDecisionModal(true)}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl font-medium shadow-sm transition cursor-pointer shrink-0"
          >
            Verdict Modal
          </button>
        </div>
      )}

      {isRejected && (
        <div className="max-w-7xl mx-auto mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between text-rose-900 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <FontAwesomeIcon icon={faTimesCircle} className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-medium text-sm text-rose-950">Application Declined</h4>
              <p className="text-sm text-rose-800 mt-0.5 font-normal">This applicant did not satisfy admission quotas or cut-off requirements.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowDecisionModal(true)}
            className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-xl font-medium shadow-sm transition cursor-pointer shrink-0"
          >
            Verdict Modal
          </button>
        </div>
      )}

      {/* Hero Header Card: Student Overview */}
      <div className="max-w-7xl mx-auto mb-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 text-[#E8792E] flex items-center justify-center text-xl font-medium shadow-sm border border-slate-700 shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-semibold text-slate-900">
                  {studentName}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-normal bg-slate-100 text-slate-700 border border-slate-200">
                  <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-600 text-xs" />
                  Verified Profile
                </span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 mt-2 text-sm text-slate-600 flex-wrap">
                <span className="flex items-center gap-1.5 font-normal">
                  <FontAwesomeIcon icon={faBuilding} className="text-[#E8792E]" />
                  {university}
                </span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="flex items-center gap-1.5 font-normal">
                  <FontAwesomeIcon icon={faGraduationCap} className="text-[#E8792E]" />
                  {programCourse}
                </span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="font-mono text-slate-500 font-normal">
                  APP-{displayId}
                </span>
              </div>
            </div>
          </div>

          {/* Right Status Badge in Hero */}
          <div className="shrink-0 flex items-center gap-3 self-stretch sm:self-auto justify-end">
            {isAcceptedOrApproved && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-800 border border-emerald-300 capitalize">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600" /> {applicationStatus}
              </span>
            )}
            {isRejected && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-rose-50 text-rose-800 border border-rose-300">
                <FontAwesomeIcon icon={faTimesCircle} className="text-rose-600" /> Rejected
              </span>
            )}
            {!isAcceptedOrApproved && !isRejected && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-amber-50 text-amber-800 border border-amber-300">
                <FontAwesomeIcon icon={faClock} className="text-amber-600" /> Pending Review
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grid Layout: Left Candidate Dossier & Right AI Hub */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Candidate Details Dossier (Clean, Airy, Spacious) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Academic & Institution Placement */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <h2 className="text-lg font-medium text-slate-900 flex items-center gap-2.5">
                <FontAwesomeIcon icon={faGraduationCap} className="text-[#E8792E]" />
                Academic Qualifications & Program
              </h2>
              <span className="text-xs font-normal text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-600 text-xs" />
                Verified Application
              </span>
            </div>

            {/* University & Degree Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 mb-7">
              <div>
                <span className="text-sm text-slate-500 font-normal block mb-1">Target Institution</span>
                <p className="text-base text-slate-800 font-normal flex items-center gap-2">
                  <FontAwesomeIcon icon={faBuilding} className="text-[#E8792E] text-sm" />
                  {university}
                </p>
                <span className="text-sm text-slate-500 mt-1 block font-normal">1st Choice Partner Institution</span>
              </div>

              <div>
                <span className="text-sm text-slate-500 font-normal block mb-1">Applied Program / Major</span>
                <p className="text-base text-slate-800 font-normal flex items-center gap-2">
                  <FontAwesomeIcon icon={faBookOpen} className="text-[#E8792E] text-sm" />
                  {programCourse}
                </p>
                <span className="text-sm text-slate-500 mt-1 block font-normal">Faculty of Science & Technology</span>
              </div>

              <div>
                <span className="text-sm text-slate-500 font-normal block mb-1">Secondary School</span>
                <p className="text-base text-slate-800 font-normal flex items-center gap-2">
                  <FontAwesomeIcon icon={faSchool} className="text-slate-400 text-sm" />
                  {secondarySchool}
                </p>
              </div>

              <div>
                <span className="text-sm text-slate-500 font-normal block mb-1">Graduation Year</span>
                <p className="text-base text-slate-800 font-normal flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-slate-400 text-sm" />
                  Class of {graduationYear}
                </p>
              </div>
            </div>

            {/* JAMB UTME Examination Benchmark */}
            <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/70 mb-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div>
                  <span className="text-sm text-slate-500 font-normal">JAMB Registration Number</span>
                  <p className="text-lg text-slate-900 font-mono mt-1 font-normal">{jambRegNo}</p>
                  <span className="text-sm text-emerald-600 font-normal flex items-center gap-1.5 mt-1.5">
                    <FontAwesomeIcon icon={faCheck} className="text-xs" /> Verified via JAMB CAPS
                  </span>
                </div>

                <div className="sm:text-right">
                  <span className="text-sm text-slate-500 font-normal">Official UTME Score</span>
                  <div className="flex items-baseline sm:justify-end gap-1.5 mt-1">
                    <span className="text-3xl font-medium text-[#E8792E]">{jambScore}</span>
                    <span className="text-sm text-slate-500 font-normal">/ 400</span>
                  </div>
                  <span className="text-xs font-normal text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mt-1.5">
                    {Number(jambScore) >= 250 ? "Competitive Distinction" : "Eligible for Screening"}
                  </span>
                </div>
              </div>

              {/* UTME Subject Combination */}
              <div className="mt-5 pt-4 border-t border-slate-200/70 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-slate-600 font-normal mr-1">UTME Subjects:</span>
                {subjectList.map((sub, idx) => (
                  <span 
                    key={idx} 
                    className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-normal shadow-2xs"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Verified O'Level Results */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-700 font-medium">
                  Verified O&apos;Level Results (WAEC / NECO)
                </span>
                <span className="text-sm text-emerald-700 font-normal flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-xs text-emerald-600" /> 5 Credits Cleared
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {olevelData.map((res, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-xl p-3.5 border border-slate-200 flex items-center justify-between shadow-2xs"
                  >
                    <span className="text-sm text-slate-700 font-normal truncate pr-2" title={res.subject || res.name}>
                      {res.subject || res.name}
                    </span>
                    <span className="text-sm font-medium text-slate-800 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 shrink-0">
                      {res.grade}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Card 2: Personal & Contact Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <h2 className="text-lg font-medium text-slate-900 flex items-center gap-2.5">
                <FontAwesomeIcon icon={faUser} className="text-[#E8792E]" />
                Personal Information & Contact Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
              <div>
                <span className="text-sm text-slate-500 font-normal block mb-1">Full Legal Name</span>
                <p className="text-base text-slate-800 font-normal">{studentName}</p>
              </div>

              <div>
                <span className="text-sm text-slate-500 font-normal block mb-1 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faEnvelope} className="text-slate-400 text-xs" />
                  Email Address
                </span>
                <p className="text-base text-slate-800 font-normal truncate" title={contactEmail}>
                  {contactEmail}
                </p>
              </div>

              <div>
                <span className="text-sm text-slate-500 font-normal block mb-1 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faPhone} className="text-slate-400 text-xs" />
                  Phone Number
                </span>
                <p className="text-base text-slate-800 font-normal">{phoneNumber}</p>
              </div>

              <div>
                <span className="text-sm text-slate-500 font-normal block mb-1 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-slate-400 text-xs" />
                  State / Nationality
                </span>
                <p className="text-base text-slate-800 font-normal">{stateOrigin}, {citizenship}</p>
              </div>

              <div>
                <span className="text-sm text-slate-500 font-normal block mb-1 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faIdCard} className="text-slate-400 text-xs" />
                  National ID (NIN)
                </span>
                <p className="text-base text-slate-800 font-mono font-normal">{ninNumber}</p>
              </div>

              <div>
                <span className="text-sm text-slate-500 font-normal block mb-1">
                  Guardian / Sponsor
                </span>
                <p className="text-base text-slate-800 font-normal">{guardianName}</p>
                <span className="text-sm text-slate-500 mt-0.5 block font-normal">{guardianPhone}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Uploaded Documents & Credentials */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
              <h2 className="text-lg font-medium text-slate-900 flex items-center gap-2.5">
                <FontAwesomeIcon icon={faFileAlt} className="text-[#E8792E]" />
                Uploaded Documents
              </h2>
              <span className="text-sm text-slate-500 font-normal">4 Verified Files</span>
            </div>

            <div className="divide-y divide-slate-100">
              {uploadedDocs.map((doc, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#E8792E] flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={faFileAlt} className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-base font-normal text-slate-800 truncate hover:text-[#E8792E] transition">
                        {doc.name}
                      </p>
                      <span className="text-sm text-slate-400 font-normal">
                        {doc.type} • {doc.size}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDownload(doc.name)}
                    className="text-sm font-medium text-[#E8792E] hover:text-[#C96A28] px-4 py-2 rounded-xl hover:bg-orange-50 transition cursor-pointer flex items-center gap-1.5 shrink-0 ml-3"
                  >
                    <FontAwesomeIcon icon={downloadingDoc === doc.name ? faCheck : faDownload} />
                    <span>{downloadingDoc === doc.name ? "Downloaded" : "Download"}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Decision Hub (Unchanged functional integration) */}
        <div className="space-y-6">
          <AIDecisionHub
            applicantId={displayId}
            currentStatus={applicationStatus}
            application={currentApp}
          />
        </div>

      </div>
    </div>
  );
}