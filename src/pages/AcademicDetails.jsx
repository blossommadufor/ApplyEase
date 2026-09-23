import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import logoDark from "../assets/logo-dark.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faCloudUploadAlt,
  faFileAlt,
  faTimes,
  faCheck,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { OnboardingSteps } from "../components/OnboardingSteps";
import { useOnboarding } from "../context/OnboardingContext";

const ALL_JAMB_SUBJECTS = [
  "Accounting",
  "Agricultural Science",
  "Arabic",
  "Art",
  "Biology",
  "Chemistry",
  "Christian Religious Studies",
  "Commerce",
  "Economics",
  "English Language",
  "French",
  "Geography",
  "Government",
  "Hausa",
  "History",
  "Igbo",
  "Islamic Studies",
  "Literature-in-English",
  "Mathematics",
  "Music",
  "Physics",
  "Principles of Accounts",
  "Yoruba",
  "Use of English",
];

const academicDetailsSchema = Yup.object().shape({
  schoolName: Yup.string()
    .trim()
    .min(3, "Secondary school name must be at least 3 characters")
    .required("Secondary school name is required"),
  examType: Yup.string().required("Please select your examination type"),
  yearOfGraduation: Yup.string().required("Graduation year is required"),
  examYear: Yup.string().required("Exam year is required"),
  jambRegNumber: Yup.string()
    .trim()
    .matches(/^[A-Za-z0-9]{8,14}$/, "Enter a valid JAMB registration number (8-14 characters)")
    .required("JAMB registration number is required"),
  jambScore: Yup.number()
    .typeError("JAMB score must be a number")
    .min(100, "JAMB score must be at least 100")
    .max(400, "JAMB score cannot exceed 400")
    .required("JAMB UTME score is required"),
  selectedSubjects: Yup.array()
    .of(Yup.string())
    .min(4, "Please select exactly 4 JAMB subjects")
    .max(4, "Please select exactly 4 JAMB subjects")
    .required("You must select exactly 4 JAMB subjects"),
});

export const AcademicDetails = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useOnboarding();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [wasceFile, setWasceFile] = useState(formData.wasceFile || null);
  const [jambSlipFile, setJambSlipFile] = useState(formData.jambSlipFile || null);
  const dropdownRef = useRef(null);

  // Close subject dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formik = useFormik({
    initialValues: {
      schoolName: formData.secondarySchool || formData.schoolName || "",
      examType: formData.examType || "WAEC SSCE",
      yearOfGraduation: formData.yearOfGraduation || "2024",
      examYear: formData.examYear || "2024",
      jambRegNumber: formData.jambRegNumber || "",
      jambScore: formData.jambScore || "",
      selectedSubjects: formData.selectedSubjects || [],
    },
    validationSchema: academicDetailsSchema,
    onSubmit: (values) => {
      updateFormData({
        ...values,
        secondarySchool: values.schoolName,
        graduationYear: values.yearOfGraduation,
        wasceFileName: wasceFile?.name || formData.wasceFileName,
        jambSlipFileName: jambSlipFile?.name || formData.jambSlipFileName,
      });

      navigate("/onboarding/guardian-data");
    },
  });

  const toggleSubject = (subject) => {
    const current = formik.values.selectedSubjects || [];
    let updated;
    if (current.includes(subject)) {
      updated = current.filter((s) => s !== subject);
    } else {
      if (current.length >= 4) {
        return;
      }
      updated = [...current, subject];
    }
    formik.setFieldValue("selectedSubjects", updated);
    formik.setFieldTouched("selectedSubjects", true, false);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setWasceFile(file);
      updateFormData({ wasceFileName: file.name });
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setWasceFile(file);
      updateFormData({ wasceFileName: file.name });
    }
  };

  const handleJambSlipDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setJambSlipFile(file);
      updateFormData({ jambSlipFileName: file.name });
    }
  };

  const handleJambSlipSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setJambSlipFile(file);
      updateFormData({ jambSlipFileName: file.name });
    }
  };

  return (
    <div className="min-h-screen text-[#1F2430] flex flex-col bg-slate-50/50">
      {/* Top Header */}
      <header className="bg-[#1E2432] text-white h-20 px-6 lg:px-16 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img
            src={logoDark}
            alt="ApplyEase"
            className="w-32 h-auto object-contain filter brightness-0 invert"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs sm:text-sm font-medium text-slate-300">
            Step 2 of 4: Academic Records
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col">
        <OnboardingSteps currentStep={2} />

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2430]">
            Academic Details
          </h1>
          <p className="text-xs sm:text-sm text-[#8B93A1] mt-1">
            Enter your secondary school credentials, O'Level exam records, and UTME scores.
          </p>
        </div>

        <form
          id="academic-details-form"
          onSubmit={formik.handleSubmit}
          className="bg-white rounded-2xl p-6 sm:p-10 shadow-xs border border-[#DCE1E7] space-y-6 flex-1"
        >
          {/* Row 1: School Name & Exam Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                Secondary School Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="schoolName"
                placeholder="e.g. King's College, Lagos"
                value={formik.values.schoolName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none transition ${
                  formik.touched.schoolName && formik.errors.schoolName
                    ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                    : "border-[#DCE1E7] focus:border-[#E8792E]"
                }`}
              />
              {formik.touched.schoolName && formik.errors.schoolName && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  {formik.errors.schoolName}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                O'Level Examination Type <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="examType"
                  value={formik.values.examType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition appearance-none cursor-pointer"
                >
                  <option value="WAEC SSCE">WAEC SSCE</option>
                  <option value="NECO SSCE">NECO SSCE</option>
                  <option value="NABTEB">NABTEB</option>
                  <option value="GCE">GCE O'Level</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                  <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                Year of Graduation <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="yearOfGraduation"
                  value={formik.values.yearOfGraduation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition appearance-none cursor-pointer"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                  <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                O'Level Exam Sitting Year <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="examYear"
                  value={formik.values.examYear}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition appearance-none cursor-pointer"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                  <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                </div>
              </div>
            </div>
          </div>

          {/* O'Level Slip File Upload Box */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
              Upload Result Slip / Statement of Result{" "}
              <span className="text-xs font-normal text-slate-500">
                (PDF, PNG, JPG - Max 5MB)
              </span>
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-[#DCE1E7] bg-slate-50 hover:bg-slate-100 transition rounded-2xl p-6 text-center relative cursor-pointer flex flex-col items-center justify-center"
            >
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {wasceFile || formData.wasceFileName ? (
                <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-[#DCE1E7] shadow-xs z-10">
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    className="text-[#E8792E] text-lg"
                  />
                  <span className="text-xs sm:text-sm font-medium text-[#1F2430]">
                    {wasceFile?.name || formData.wasceFileName}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setWasceFile(null);
                      updateFormData({ wasceFileName: null });
                    }}
                    className="text-slate-400 hover:text-rose-500 ml-2 cursor-pointer p-1"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-11 h-11 rounded-xl bg-[#F5E6D8] text-[#E8792E] flex items-center justify-center text-lg mb-2">
                    <FontAwesomeIcon icon={faCloudUploadAlt} />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-[#1F2430]">
                    Drag and drop your O'Level result slip here, or{" "}
                    <span className="text-[#E8792E] underline">browse file</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Official WAEC / NECO / GCE statement
                  </p>
                </>
              )}
            </div>
          </div>

          {/* JAMB Registration & Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                JAMB Registration Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="jambRegNumber"
                placeholder="e.g. 202410982731AB"
                value={formik.values.jambRegNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none transition ${
                  formik.touched.jambRegNumber && formik.errors.jambRegNumber
                    ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                    : "border-[#DCE1E7] focus:border-[#E8792E]"
                }`}
              />
              {formik.touched.jambRegNumber && formik.errors.jambRegNumber && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  {formik.errors.jambRegNumber}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                JAMB UTME Score (Out of 400) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="jambScore"
                placeholder="e.g. 275"
                value={formik.values.jambScore}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none transition ${
                  formik.touched.jambScore && formik.errors.jambScore
                    ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                    : "border-[#DCE1E7] focus:border-[#E8792E]"
                }`}
              />
              {formik.touched.jambScore && formik.errors.jambScore && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  {formik.errors.jambScore}
                </p>
              )}
            </div>
          </div>

          {/* JAMB Result Slip File Upload Box */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
              Upload JAMB UTME Result Slip{" "}
              <span className="text-xs font-normal text-slate-500">
                (PDF, PNG, JPG - Max 5MB)
              </span>
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleJambSlipDrop}
              className="border-2 border-dashed border-[#DCE1E7] bg-slate-50 hover:bg-slate-100 transition rounded-2xl p-6 text-center relative cursor-pointer flex flex-col items-center justify-center"
            >
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleJambSlipSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {jambSlipFile || formData.jambSlipFileName ? (
                <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-[#DCE1E7] shadow-xs z-10">
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    className="text-[#E8792E] text-lg"
                  />
                  <span className="text-xs sm:text-sm font-medium text-[#1F2430]">
                    {jambSlipFile?.name || formData.jambSlipFileName}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setJambSlipFile(null);
                      updateFormData({ jambSlipFileName: null });
                    }}
                    className="text-slate-400 hover:text-rose-500 ml-2 cursor-pointer p-1"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-11 h-11 rounded-xl bg-[#F5E6D8] text-[#E8792E] flex items-center justify-center text-lg mb-2">
                    <FontAwesomeIcon icon={faCloudUploadAlt} />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-[#1F2430]">
                    Drag and drop your JAMB UTME result slip here, or{" "}
                    <span className="text-[#E8792E] underline">browse file</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Official Joint Admissions and Matriculation Board statement
                  </p>
                </>
              )}
            </div>
          </div>

          {/* JAMB Subject Combination Selector */}
          <div ref={dropdownRef} className="space-y-2 pt-2 relative">
            <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
              JAMB Subject Combination{" "}
              <span className="text-[#E8792E] font-bold">
                ({formik.values.selectedSubjects?.length || 0}/4 selected)
              </span>{" "}
              <span className="text-rose-500">*</span>
            </label>

            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm flex items-center justify-between cursor-pointer transition text-left ${
                formik.touched.selectedSubjects && formik.errors.selectedSubjects
                  ? "border-rose-400 bg-rose-50/20"
                  : "border-[#DCE1E7] hover:border-slate-300"
              }`}
            >
              <span
                className={
                  formik.values.selectedSubjects?.length === 0
                    ? "text-slate-400"
                    : "text-[#1F2430] font-medium truncate"
                }
              >
                {formik.values.selectedSubjects?.length > 0
                  ? formik.values.selectedSubjects.join(", ")
                  : "Select exactly 4 subjects (e.g. English, Math, Physics, Chemistry)..."}
              </span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-xs text-slate-500 transition-transform shrink-0 ml-2 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Selected Subject Chips with Instant Removal */}
            {formik.values.selectedSubjects?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {formik.values.selectedSubjects.map((sub) => (
                  <span
                    key={sub}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#F5E6D8] text-[#E8792E] border border-orange-200 shadow-2xs"
                  >
                    <span>{sub}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleSubject(sub);
                      }}
                      className="hover:text-rose-600 transition cursor-pointer p-0.5 ml-0.5"
                      title={`Remove ${sub}`}
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-[10px]" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {formik.touched.selectedSubjects && formik.errors.selectedSubjects && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <FontAwesomeIcon icon={faExclamationCircle} />
                {formik.errors.selectedSubjects}
              </p>
            )}

            {isDropdownOpen && (
              <div className="absolute z-30 mt-1 w-full bg-white border border-[#DCE1E7] rounded-xl shadow-xl max-h-60 overflow-y-auto p-2.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 animate-in fade-in duration-150">
                {ALL_JAMB_SUBJECTS.map((sub) => {
                  const isSelected = formik.values.selectedSubjects?.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleSubject(sub);
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm cursor-pointer transition text-left w-full ${
                        isSelected
                          ? "bg-[#F5E6D8] text-[#E8792E] font-semibold"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span>{sub}</span>
                      {isSelected && (
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="text-[#E8792E]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </form>
      </main>

      {/* Sticky Bottom Footer */}
      <footer className="sticky bottom-0 bg-[#1E2432] border-t border-slate-800 py-4 px-6 lg:px-16 shadow-lg mt-auto">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/onboarding/personal-info")}
            className="px-6 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800 font-medium text-xs sm:text-sm transition cursor-pointer"
          >
            Back
          </button>
          <button
            type="submit"
            form="academic-details-form"
            className="px-8 py-2.5 rounded-xl bg-[#E8792E] hover:bg-[#C96A28] text-white font-semibold text-xs sm:text-sm shadow-md transition cursor-pointer"
          >
            Save & Continue
          </button>
        </div>
      </footer>
    </div>
  );
};