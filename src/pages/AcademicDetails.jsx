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
  faWandMagicSparkles,
  faSpinner,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { OnboardingSteps } from "../components/OnboardingSteps";
import { useOnboarding } from "../context/OnboardingContext";
import { scanAndExtractDocument } from "../services/aiEvaluationService";

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

const matchJambSubjects = (extractedSubjects, allSubjects) => {
  if (!Array.isArray(extractedSubjects)) return [];
  const matched = [];
  for (const item of extractedSubjects) {
    const rawName = (typeof item === "string" ? item : item?.subject || "").trim().toLowerCase();
    if (!rawName) continue;

    let candidate = allSubjects.find((s) => s.toLowerCase() === rawName);
    if (!candidate) {
      if (rawName.includes("eng")) {
        candidate = "Use of English";
      } else if (rawName.includes("math")) {
        candidate = "Mathematics";
      } else if (rawName.includes("chem")) {
        candidate = "Chemistry";
      } else if (rawName.includes("phys")) {
        candidate = "Physics";
      } else if (rawName.includes("bio")) {
        candidate = "Biology";
      } else if (rawName.includes("econ")) {
        candidate = "Economics";
      } else if (rawName.includes("govt") || rawName.includes("government")) {
        candidate = "Government";
      } else if (rawName.includes("lit")) {
        candidate = "Literature-in-English";
      } else if (rawName.includes("crk") || rawName.includes("crs")) {
        candidate = "Christian Religious Studies";
      } else if (rawName.includes("irk") || rawName.includes("irs")) {
        candidate = "Islamic Studies";
      } else if (rawName.includes("agric")) {
        candidate = "Agricultural Science";
      } else if (rawName.includes("acc") || rawName.includes("account")) {
        candidate = "Accounting";
      } else if (rawName.includes("comm")) {
        candidate = "Commerce";
      } else if (rawName.includes("geo")) {
        candidate = "Geography";
      } else {
        candidate = allSubjects.find((s) => {
          const sLower = s.toLowerCase();
          return sLower.includes(rawName) || rawName.includes(sLower);
        });
      }
    }

    if (candidate && !matched.includes(candidate)) {
      matched.push(candidate);
      if (matched.length === 4) break;
    }
  }
  return matched;
};

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
  const [isScanningOlevel, setIsScanningOlevel] = useState(false);
  const [isScanningJamb, setIsScanningJamb] = useState(false);
  const [scanFeedback, setScanFeedback] = useState({
    olevel: null,
    jamb: null,
  });
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

  const handleScanOlevel = async () => {
    if (!wasceFile) {
      setScanFeedback((prev) => ({
        ...prev,
        olevel: {
          type: "warning",
          message: "Please drop or select your O'Level statement file to scan with AI.",
        },
      }));
      return;
    }

    setIsScanningOlevel(true);
    setScanFeedback((prev) => ({ ...prev, olevel: null }));

    try {
      const data = await scanAndExtractDocument(wasceFile);
      const filledItems = [];

      if (data.schoolName && typeof data.schoolName === "string" && data.schoolName.trim().length >= 3) {
        const cleanSchool = data.schoolName.trim();
        formik.setFieldValue("schoolName", cleanSchool);
        formik.setFieldTouched("schoolName", true, false);
        filledItems.push(`School: "${cleanSchool}"`);
      }

      if (data.documentType) {
        const docType = String(data.documentType).toUpperCase();
        if (docType.includes("WAEC")) {
          formik.setFieldValue("examType", "WAEC SSCE");
          filledItems.push("Exam: WAEC SSCE");
        } else if (docType.includes("NECO")) {
          formik.setFieldValue("examType", "NECO SSCE");
          filledItems.push("Exam: NECO SSCE");
        } else if (docType.includes("NABTEB")) {
          formik.setFieldValue("examType", "NABTEB");
          filledItems.push("Exam: NABTEB");
        }
      }

      if (data.examinationYear) {
        const year = String(data.examinationYear).trim();
        const validGradYears = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];
        const validExamYears = ["2022", "2023", "2024", "2025", "2026"];
        if (validGradYears.includes(year)) {
          formik.setFieldValue("yearOfGraduation", year);
          formik.setFieldTouched("yearOfGraduation", true, false);
        }
        if (validExamYears.includes(year)) {
          formik.setFieldValue("examYear", year);
          formik.setFieldTouched("examYear", true, false);
          filledItems.push(`Year: ${year}`);
        }
      }

      if (data.jambScore && !isNaN(Number(data.jambScore))) {
        const score = Math.round(Number(data.jambScore));
        if (score >= 100 && score <= 400) {
          formik.setFieldValue("jambScore", score);
          formik.setFieldTouched("jambScore", true, false);
          filledItems.push(`JAMB Score: ${score}`);
        }
      }
      if (data.registrationNumber) {
        const cleanReg = String(data.registrationNumber).replace(/[^A-Za-z0-9]/g, "").toUpperCase();
        if (cleanReg.length >= 8 && cleanReg.length <= 14) {
          formik.setFieldValue("jambRegNumber", cleanReg);
          formik.setFieldTouched("jambRegNumber", true, false);
          filledItems.push(`JAMB Reg: ${cleanReg}`);
        }
      }

      if (filledItems.length > 0) {
        setScanFeedback((prev) => ({
          ...prev,
          olevel: {
            type: "success",
            message: `✨ Auto-filled: ${filledItems.join(", ")}`,
          },
        }));
      } else {
        setScanFeedback((prev) => ({
          ...prev,
          olevel: {
            type: "warning",
            message: "Document scanned, but could not detect school details. Please enter them manually.",
          },
        }));
      }
    } catch (error) {
      console.error("O'Level scan error:", error);
      setScanFeedback((prev) => ({
        ...prev,
        olevel: {
          type: "error",
          message: error.message || "Failed to scan document. Please enter details manually.",
        },
      }));
    } finally {
      setIsScanningOlevel(false);
    }
  };

  const handleScanJambSlip = async () => {
    if (!jambSlipFile) {
      setScanFeedback((prev) => ({
        ...prev,
        jamb: {
          type: "warning",
          message: "Please drop or select your JAMB UTME result slip file to scan with AI.",
        },
      }));
      return;
    }

    setIsScanningJamb(true);
    setScanFeedback((prev) => ({ ...prev, jamb: null }));

    try {
      const data = await scanAndExtractDocument(jambSlipFile);
      const filledItems = [];

      if (data.jambScore && !isNaN(Number(data.jambScore))) {
        const score = Math.round(Number(data.jambScore));
        if (score >= 100 && score <= 400) {
          formik.setFieldValue("jambScore", score);
          formik.setFieldTouched("jambScore", true, false);
          filledItems.push(`Score: ${score}`);
        }
      }

      if (data.registrationNumber) {
        const cleanReg = String(data.registrationNumber).replace(/[^A-Za-z0-9]/g, "").toUpperCase();
        if (cleanReg.length >= 8 && cleanReg.length <= 14) {
          formik.setFieldValue("jambRegNumber", cleanReg);
          formik.setFieldTouched("jambRegNumber", true, false);
          filledItems.push(`Reg No: ${cleanReg}`);
        }
      }

      if (data.examinationYear) {
        const year = String(data.examinationYear).trim();
        if (["2022", "2023", "2024", "2025", "2026"].includes(year)) {
          formik.setFieldValue("examYear", year);
          formik.setFieldTouched("examYear", true, false);
          filledItems.push(`Year: ${year}`);
        }
      }

      if (Array.isArray(data.subjects) && data.subjects.length > 0) {
        const matched = matchJambSubjects(data.subjects, ALL_JAMB_SUBJECTS);
        if (matched.length > 0) {
          formik.setFieldValue("selectedSubjects", matched);
          formik.setFieldTouched("selectedSubjects", true, false);
          filledItems.push(`${matched.length} Subjects matched (${matched.join(", ")})`);
        }
      }

      if (filledItems.length > 0) {
        setScanFeedback((prev) => ({
          ...prev,
          jamb: {
            type: "success",
            message: `✨ Auto-filled: ${filledItems.join(", ")}`,
          },
        }));
      } else {
        setScanFeedback((prev) => ({
          ...prev,
          jamb: {
            type: "warning",
            message: "Document scanned, but could not detect JAMB credentials. Please enter them manually.",
          },
        }));
      }
    } catch (error) {
      console.error("JAMB scan error:", error);
      setScanFeedback((prev) => ({
        ...prev,
        jamb: {
          type: "error",
          message: error.message || "Failed to scan document. Please enter details manually.",
        },
      }));
    } finally {
      setIsScanningJamb(false);
    }
  };

  return (
    <div className="min-h-screen text-[#1F2430] flex flex-col bg-slate-50/50">
      {/* Top Header */}
      <header className="bg-[#1E2432] text-white h-20 px-6 lg:px-16 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img
            src={logoDark}
            alt="ApplyNow"
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
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                Upload Result Slip / Statement of Result{" "}
                <span className="text-xs font-normal text-slate-500">
                  (PDF, PNG, JPG - Max 5MB)
                </span>
              </label>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#E8792E]">
                <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[10px]" />
                Gemini AI Vision
              </span>
            </div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-[#DCE1E7] bg-slate-50 hover:bg-slate-100 transition rounded-2xl p-6 text-center relative cursor-pointer flex flex-col items-center justify-center min-h-[140px]"
            >
              {!wasceFile && !formData.wasceFileName && (
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              )}
              {wasceFile || formData.wasceFileName ? (
                <div className="flex flex-col sm:flex-row items-center gap-3 z-10 relative">
                  <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-[#DCE1E7] shadow-xs">
                    <FontAwesomeIcon
                      icon={faFileAlt}
                      className="text-[#E8792E] text-lg"
                    />
                    <span className="text-xs sm:text-sm font-medium text-[#1F2430] max-w-[200px] truncate">
                      {wasceFile?.name || formData.wasceFileName}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setWasceFile(null);
                        updateFormData({ wasceFileName: null });
                        setScanFeedback((prev) => ({ ...prev, olevel: null }));
                      }}
                      className="text-slate-400 hover:text-rose-500 ml-2 cursor-pointer p-1"
                      title="Remove file"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isScanningOlevel}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleScanOlevel();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-[#E8792E] to-amber-500 hover:from-[#d56b22] hover:to-amber-600 text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow transition disabled:opacity-60 cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={isScanningOlevel ? faSpinner : faWandMagicSparkles}
                      className={isScanningOlevel ? "animate-spin" : ""}
                    />
                    <span>{isScanningOlevel ? "Scanning with AI..." : "✨ Scan & Auto-fill"}</span>
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

            {scanFeedback.olevel && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center justify-between transition animate-in fade-in duration-150 ${
                  scanFeedback.olevel.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : scanFeedback.olevel.type === "warning"
                    ? "bg-amber-50 border-amber-200 text-amber-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={
                      scanFeedback.olevel.type === "success"
                        ? faCheckCircle
                        : faExclamationCircle
                    }
                  />
                  <span>{scanFeedback.olevel.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setScanFeedback((prev) => ({ ...prev, olevel: null }))}
                  className="text-slate-400 hover:text-slate-600 ml-2 p-1 cursor-pointer"
                  title="Dismiss"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            )}
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
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                Upload JAMB UTME Result Slip{" "}
                <span className="text-xs font-normal text-slate-500">
                  (PDF, PNG, JPG - Max 5MB)
                </span>
              </label>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#E8792E]">
                <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[10px]" />
                Gemini AI Vision
              </span>
            </div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleJambSlipDrop}
              className="border-2 border-dashed border-[#DCE1E7] bg-slate-50 hover:bg-slate-100 transition rounded-2xl p-6 text-center relative cursor-pointer flex flex-col items-center justify-center min-h-[140px]"
            >
              {!jambSlipFile && !formData.jambSlipFileName && (
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleJambSlipSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              )}
              {jambSlipFile || formData.jambSlipFileName ? (
                <div className="flex flex-col sm:flex-row items-center gap-3 z-10 relative">
                  <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-[#DCE1E7] shadow-xs">
                    <FontAwesomeIcon
                      icon={faFileAlt}
                      className="text-[#E8792E] text-lg"
                    />
                    <span className="text-xs sm:text-sm font-medium text-[#1F2430] max-w-[200px] truncate">
                      {jambSlipFile?.name || formData.jambSlipFileName}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setJambSlipFile(null);
                        updateFormData({ jambSlipFileName: null });
                        setScanFeedback((prev) => ({ ...prev, jamb: null }));
                      }}
                      className="text-slate-400 hover:text-rose-500 ml-2 cursor-pointer p-1"
                      title="Remove file"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isScanningJamb}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleScanJambSlip();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-[#E8792E] to-amber-500 hover:from-[#d56b22] hover:to-amber-600 text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow transition disabled:opacity-60 cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={isScanningJamb ? faSpinner : faWandMagicSparkles}
                      className={isScanningJamb ? "animate-spin" : ""}
                    />
                    <span>{isScanningJamb ? "Scanning with AI..." : "✨ Scan & Auto-fill"}</span>
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

            {scanFeedback.jamb && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center justify-between transition animate-in fade-in duration-150 ${
                  scanFeedback.jamb.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : scanFeedback.jamb.type === "warning"
                    ? "bg-amber-50 border-amber-200 text-amber-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={
                      scanFeedback.jamb.type === "success"
                        ? faCheckCircle
                        : faExclamationCircle
                    }
                  />
                  <span>{scanFeedback.jamb.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setScanFeedback((prev) => ({ ...prev, jamb: null }))}
                  className="text-slate-400 hover:text-slate-600 ml-2 p-1 cursor-pointer"
                  title="Dismiss"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            )}
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