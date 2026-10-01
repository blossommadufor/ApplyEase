import { useState, useMemo, useEffect } from "react";
import { NIGERIAN_UNIVERSITIES } from "../universitiesdata";
import { useApplications } from "../context/ApplicationsContext";
import { isInstitutionMatch } from "../utils/institutionMatcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faBook,
  faPlus,
  faSearch,
  faPenToSquare,
  faTrashCan,
  faCheckCircle,
  faTimesCircle,
  faTimes,
  faBuildingColumns,
  faUsers,
  faSliders,
  faEye,
  faArrowRotateRight,
  faTriangleExclamation,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

const STORAGE_KEY = "applyease_courses_data";

const COMMON_FACULTIES = [
  "Faculty of Science",
  "College of Medicine",
  "Faculty of Engineering",
  "Faculty of Law",
  "Faculty of Arts",
  "Faculty of Social Sciences",
  "Faculty of Management Sciences",
  "Faculty of Education",
  "Faculty of Environmental Sciences",
  "Faculty of Agriculture",
  "Faculty of Pharmacy",
  "Faculty of Basic Medical Sciences",
];

const COMMON_SUBJECTS = [
  "English Language",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Government",
  "Literature in English",
  "Commerce",
  "Accounting",
  "Geography",
  "Further Mathematics",
  "Agricultural Science",
  "CRK / IRK",
];

export default function CourseManagement() {
  const { applications = [] } = useApplications();

  // 1. Resolve logged in admin identity & scope
  const currentAdmin = useMemo(() => {
    try {
      return JSON.parse(
        sessionStorage.getItem("currentUser") ||
          sessionStorage.getItem("user") ||
          "{}"
      );
    } catch {
      return {};
    }
  }, []);

  const userRole = sessionStorage.getItem("userRole") || currentAdmin.role || "admin";
  const isSuperAdmin = userRole === "superadmin" || currentAdmin.role === "superadmin";

  const adminInstitution =
    sessionStorage.getItem("adminInstitution") ||
    currentAdmin.institution ||
    (isSuperAdmin ? "ApplyNow Headquarters" : "University of Lagos (UNILAG)");

  // 2. State for active university selection (for Super Admins)
  const [selectedUniId, setSelectedUniId] = useState(() => {
    if (isSuperAdmin) return "ALL";
    const match = NIGERIAN_UNIVERSITIES.find((u) =>
      isInstitutionMatch(u.name, adminInstitution)
    );
    return match ? match.id : NIGERIAN_UNIVERSITIES[0]?.id || "unilag";
  });

  // 3. Courses State with localStorage persistence
  const [coursesData, setCoursesData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not read custom courses from localStorage:", e);
    }

    // Default initialization from NIGERIAN_UNIVERSITIES
    const initialList = [];
    NIGERIAN_UNIVERSITIES.forEach((uni) => {
      (uni.courses || []).forEach((c, idx) => {
        initialList.push({
          id: c.id || `${uni.id}-${idx + 1}`,
          universityId: uni.id,
          universityName: uni.name,
          name: c.name,
          faculty: c.faculty || "General Faculty",
          jambCutoff: Number(c.jambCutoff) || 200,
          duration: c.duration || "4 Years",
          capacity: c.capacity || 100,
          status: c.status || "Open", // 'Open' | 'Closed' | 'Limited'
          olevelReqs:
            c.olevelReqs ||
            "5 O'Level credits: English, Mathematics, and 3 relevant departmental subjects.",
          waecFiveCoreSubjects:
            c.waecFiveCoreSubjects ||
            c.weacFiveCoreSubjects || [
              "English Language",
              "Mathematics",
              "Physics",
              "Chemistry",
              "Biology",
            ],
          note: c.note || "",
          updatedAt: new Date().toISOString(),
        });
      });
    });
    return initialList;
  });

  // Save courses whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(coursesData));
    } catch (e) {
      console.warn("Failed to persist courses to localStorage:", e);
    }
  }, [coursesData]);

  // 4. Filtering and Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [cutoffFilter, setCutoffFilter] = useState("ALL"); // 'ALL', '180', '200', '220', '250'

  // 5. Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);

  // Form State for Add / Edit
  const [formValues, setFormValues] = useState({
    name: "",
    faculty: "",
    customFaculty: "",
    universityId: "",
    jambCutoff: 200,
    duration: "4 Years",
    capacity: 100,
    status: "Open",
    olevelReqs: "",
    waecFiveCoreSubjects: [],
    customSubject: "",
  });

  // Notification Toast State
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 6. Institutional Scoping
  const scopedCourses = useMemo(() => {
    if (isSuperAdmin) {
      if (selectedUniId === "ALL") return coursesData;
      return coursesData.filter((c) => c.universityId === selectedUniId);
    }
    // University Admin scope
    return coursesData.filter(
      (c) =>
        isInstitutionMatch(c.universityName, adminInstitution) ||
        c.universityId === selectedUniId
    );
  }, [coursesData, isSuperAdmin, selectedUniId, adminInstitution]);

  // Calculate actual applicant counts per course from ApplicationsContext
  const courseApplicationStats = useMemo(() => {
    const stats = {};
    applications.forEach((app) => {
      const courseKey = (app.course || app.program || "").toLowerCase().trim();
      const uniKey = (app.university || "").toLowerCase().trim();
      const compositeKey = `${uniKey}:::${courseKey}`;

      if (!stats[compositeKey]) {
        stats[compositeKey] = { total: 0, approved: 0, pending: 0, rejected: 0 };
      }
      stats[compositeKey].total += 1;
      if (app.status === "Approved" || app.status === "Accepted") {
        stats[compositeKey].approved += 1;
      } else if (app.status === "Rejected") {
        stats[compositeKey].rejected += 1;
      } else {
        stats[compositeKey].pending += 1;
      }
    });
    return stats;
  }, [applications]);

  // Available Faculties for Filter Dropdown
  const availableFaculties = useMemo(() => {
    const set = new Set();
    scopedCourses.forEach((c) => {
      if (c.faculty) set.add(c.faculty);
    });
    return Array.from(set).sort();
  }, [scopedCourses]);

  // Filtered Courses based on search and filters
  const filteredCourses = useMemo(() => {
    return scopedCourses.filter((course) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        course.name.toLowerCase().includes(term) ||
        (course.faculty && course.faculty.toLowerCase().includes(term)) ||
        (course.olevelReqs && course.olevelReqs.toLowerCase().includes(term)) ||
        (course.universityName && course.universityName.toLowerCase().includes(term));

      const matchesFaculty =
        facultyFilter === "ALL" || course.faculty === facultyFilter;

      const matchesStatus =
        statusFilter === "ALL" || course.status === statusFilter;

      let matchesCutoff = true;
      if (cutoffFilter === "180") matchesCutoff = course.jambCutoff >= 180;
      if (cutoffFilter === "200") matchesCutoff = course.jambCutoff >= 200;
      if (cutoffFilter === "220") matchesCutoff = course.jambCutoff >= 220;
      if (cutoffFilter === "250") matchesCutoff = course.jambCutoff >= 250;

      return matchesSearch && matchesFaculty && matchesStatus && matchesCutoff;
    });
  }, [scopedCourses, searchTerm, facultyFilter, statusFilter, cutoffFilter]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = scopedCourses.length;
    const open = scopedCourses.filter((c) => c.status === "Open").length;
    const closed = scopedCourses.filter((c) => c.status === "Closed").length;
    const limited = scopedCourses.filter((c) => c.status === "Limited").length;

    const totalCapacity = scopedCourses.reduce(
      (sum, c) => sum + (Number(c.capacity) || 0),
      0
    );

    const avgCutoff =
      total > 0
        ? Math.round(
            scopedCourses.reduce((sum, c) => sum + (Number(c.jambCutoff) || 200), 0) /
              total
          )
        : 200;

    // Total applications for the scoped courses
    let totalApps = 0;
    scopedCourses.forEach((c) => {
      const compositeKey = `${(c.universityName || "").toLowerCase().trim()}:::${c.name.toLowerCase().trim()}`;
      totalApps += courseApplicationStats[compositeKey]?.total || 0;
    });

    return { total, open, closed, limited, totalCapacity, avgCutoff, totalApps };
  }, [scopedCourses, courseApplicationStats]);

  // Open Add Modal
  const handleOpenAdd = () => {
    const defaultUniId =
      selectedUniId !== "ALL"
        ? selectedUniId
        : NIGERIAN_UNIVERSITIES.find((u) =>
            isInstitutionMatch(u.name, adminInstitution)
          )?.id || NIGERIAN_UNIVERSITIES[0]?.id;

    setFormValues({
      name: "",
      faculty: COMMON_FACULTIES[0],
      customFaculty: "",
      universityId: defaultUniId,
      jambCutoff: 200,
      duration: "4 Years",
      capacity: 100,
      status: "Open",
      olevelReqs:
        "5 O'Level credits: English Language, Mathematics, and 3 relevant departmental subjects.",
      waecFiveCoreSubjects: ["English Language", "Mathematics"],
      customSubject: "",
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (course) => {
    setActiveCourse(course);
    setFormValues({
      name: course.name,
      faculty: COMMON_FACULTIES.includes(course.faculty) ? course.faculty : "Other",
      customFaculty: COMMON_FACULTIES.includes(course.faculty) ? "" : course.faculty,
      universityId: course.universityId,
      jambCutoff: course.jambCutoff,
      duration: course.duration || "4 Years",
      capacity: course.capacity || 100,
      status: course.status || "Open",
      olevelReqs: course.olevelReqs || "",
      waecFiveCoreSubjects: [...(course.waecFiveCoreSubjects || [])],
      customSubject: "",
    });
    setIsEditModalOpen(true);
  };

  // Open View Modal
  const handleOpenView = (course) => {
    setActiveCourse(course);
    setIsViewModalOpen(true);
  };

  // Open Delete Confirmation Modal
  const handleOpenDelete = (course) => {
    setActiveCourse(course);
    setIsDeleteModalOpen(true);
  };

  // Submit Add Course
  const handleSaveNewCourse = (e) => {
    e.preventDefault();
    if (!formValues.name.trim()) {
      showToast("Please provide a valid Course Title.", "error");
      return;
    }

    const assignedUni = NIGERIAN_UNIVERSITIES.find(
      (u) => u.id === formValues.universityId
    );
    const finalFaculty =
      formValues.faculty === "Other"
        ? formValues.customFaculty.trim() || "General Faculty"
        : formValues.faculty;

    const newCourse = {
      id: `course-${Date.now()}`,
      universityId: formValues.universityId,
      universityName: assignedUni?.name || adminInstitution,
      name: formValues.name.trim(),
      faculty: finalFaculty,
      jambCutoff: Number(formValues.jambCutoff) || 200,
      duration: formValues.duration,
      capacity: Number(formValues.capacity) || 100,
      status: formValues.status,
      olevelReqs: formValues.olevelReqs.trim(),
      waecFiveCoreSubjects: formValues.waecFiveCoreSubjects,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCoursesData((prev) => [newCourse, ...prev]);
    setIsAddModalOpen(false);
    showToast(`"${newCourse.name}" has been successfully accredited!`);
  };

  // Submit Edit Course
  const handleSaveEditCourse = (e) => {
    e.preventDefault();
    if (!formValues.name.trim()) {
      showToast("Please provide a valid Course Title.", "error");
      return;
    }

    const finalFaculty =
      formValues.faculty === "Other"
        ? formValues.customFaculty.trim() || "General Faculty"
        : formValues.faculty;

    const updated = {
      ...activeCourse,
      name: formValues.name.trim(),
      faculty: finalFaculty,
      jambCutoff: Number(formValues.jambCutoff) || 200,
      duration: formValues.duration,
      capacity: Number(formValues.capacity) || 100,
      status: formValues.status,
      olevelReqs: formValues.olevelReqs.trim(),
      waecFiveCoreSubjects: formValues.waecFiveCoreSubjects,
      updatedAt: new Date().toISOString(),
    };

    setCoursesData((prev) =>
      prev.map((c) => (c.id === activeCourse.id ? updated : c))
    );
    setIsEditModalOpen(false);
    setActiveCourse(null);
    showToast(`"${updated.name}" updated successfully.`);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!activeCourse) return;
    setCoursesData((prev) => prev.filter((c) => c.id !== activeCourse.id));
    setIsDeleteModalOpen(false);
    showToast(`"${activeCourse.name}" has been removed from accredited courses.`, "info");
    setActiveCourse(null);
  };

  // Toggle Course Status Quick Action (Open <-> Closed)
  const handleToggleStatus = (courseId) => {
    setCoursesData((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const nextStatus = c.status === "Open" ? "Closed" : "Open";
          return { ...c, status: nextStatus, updatedAt: new Date().toISOString() };
        }
        return c;
      })
    );
    showToast("Course admission status updated.");
  };

  // Reset to Factory Default University Courses
  const handleResetDefaults = () => {
    if (
      window.confirm(
        "Are you sure you want to restore default university course listings? Any custom courses added will be reset."
      )
    ) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  // Toggle Subject in WAEC Requirements Form
  const toggleSubject = (sub) => {
    setFormValues((prev) => {
      const exists = prev.waecFiveCoreSubjects.includes(sub);
      return {
        ...prev,
        waecFiveCoreSubjects: exists
          ? prev.waecFiveCoreSubjects.filter((s) => s !== sub)
          : [...prev.waecFiveCoreSubjects, sub],
      };
    });
  };

  // Add Custom Subject to Form
  const handleAddCustomSubject = () => {
    const val = formValues.customSubject.trim();
    if (!val) return;
    if (!formValues.waecFiveCoreSubjects.includes(val)) {
      setFormValues((prev) => ({
        ...prev,
        waecFiveCoreSubjects: [...prev.waecFiveCoreSubjects, val],
        customSubject: "",
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl border text-sm font-semibold flex items-center gap-3 transition-all animate-in slide-in-from-bottom duration-300 ${
            toast.type === "error"
              ? "bg-rose-900/90 text-white border-rose-700"
              : toast.type === "info"
              ? "bg-slate-900/90 text-white border-slate-700"
              : "bg-[#1E2432] text-white border-[#E8792E]"
          }`}
        >
          <FontAwesomeIcon
            icon={toast.type === "error" ? faTimesCircle : faCheckCircle}
            className={toast.type === "error" ? "text-rose-400" : "text-[#E8792E]"}
          />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#1E2432] text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E8792E]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#E8792E]/20 text-[#E8792E] font-bold uppercase tracking-wider text-[10px] border border-[#E8792E]/30">
                {isSuperAdmin ? "Headquarters Control" : "Institutional Admin"}
              </span>
              <span className="text-slate-400 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faBuildingColumns} className="text-xs" />
                {isSuperAdmin && selectedUniId === "ALL"
                  ? "All Partner Universities"
                  : isSuperAdmin
                  ? NIGERIAN_UNIVERSITIES.find((u) => u.id === selectedUniId)?.name
                  : adminInstitution}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Course &amp; Program Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Configure academic degree programs, define minimum JAMB score cut-offs, establish
              O'Level requirements, and monitor real-time admission quota capacities.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-5 py-3 bg-[#E8792E] hover:bg-[#d06925] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-102"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Accredit New Course</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefaults}
              title="Reset course directory to platform defaults"
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-2xl border border-slate-700 transition cursor-pointer text-xs"
            >
              <FontAwesomeIcon icon={faArrowRotateRight} />
            </button>
          </div>
        </div>

        {/* Superadmin University Switcher */}
        {isSuperAdmin && (
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="font-semibold text-slate-400">Institutional Filter:</span>
              <select
                value={selectedUniId}
                onChange={(e) => {
                  setSelectedUniId(e.target.value);
                  setFacultyFilter("ALL");
                }}
                className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#E8792E]"
              >
                <option value="ALL">All Universities (Global Overview)</option>
                {NIGERIAN_UNIVERSITIES.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name} ({uni.courses?.length || 0} courses)
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[11px] text-slate-400">
              Editing will dynamically reflect in candidate course selector.
            </span>
          </div>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Courses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Accredited Courses
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#E8792E] flex items-center justify-center">
              <FontAwesomeIcon icon={faBook} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#1F2430]">{metrics.total}</div>
          <p className="text-[11px] text-slate-500 mt-1">Across approved faculties</p>
        </div>

        {/* Card 2: Active Admissions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Open Admissions
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{metrics.open}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            {metrics.closed} paused / {metrics.limited} limited
          </p>
        </div>

        {/* Card 3: Average Cut-off */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Avg. Cut-off Score
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FontAwesomeIcon icon={faSliders} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#1F2430]">
            {metrics.avgCutoff}{" "}
            <span className="text-xs font-normal text-slate-500">JAMB</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Minimum qualification bar</p>
        </div>

        {/* Card 4: Total Applicants Received */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Applicants Logged
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FontAwesomeIcon icon={faUsers} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#1F2430]">{metrics.totalApps}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Across {metrics.totalCapacity} total seats
          </p>
        </div>
      </div>

      {/* Search, Filter & View Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FontAwesomeIcon icon={faSearch} className="text-xs" />
            </span>
            <input
              type="text"
              placeholder="Search course title, faculty department, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#1F2430] placeholder-slate-400 focus:outline-none focus:border-[#E8792E] transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xs" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Faculty Filter */}
            <select
              value={facultyFilter}
              onChange={(e) => setFacultyFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#E8792E]"
            >
              <option value="ALL">All Faculties</option>
              {availableFaculties.map((fac) => (
                <option key={fac} value={fac}>
                  {fac}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#E8792E]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Limited">Limited</option>
              <option value="Closed">Closed</option>
            </select>

            {/* JAMB Cut-off Filter */}
            <select
              value={cutoffFilter}
              onChange={(e) => setCutoffFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#E8792E]"
            >
              <option value="ALL">All Cut-offs</option>
              <option value="180">180+ Points</option>
              <option value="200">200+ Points</option>
              <option value="220">220+ Points</option>
              <option value="250">250+ Points</option>
            </select>

            {(searchTerm ||
              facultyFilter !== "ALL" ||
              statusFilter !== "ALL" ||
              cutoffFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setFacultyFilter("ALL");
                  setStatusFilter("ALL");
                  setCutoffFilter("ALL");
                }}
                className="text-xs text-[#E8792E] font-semibold hover:underline px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Counter Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{filteredCourses.length}</strong> of{" "}
            <strong className="text-slate-800">{scopedCourses.length}</strong> programs
          </span>
          <span className="text-[11px] text-slate-400">
            Real-time synchronization active
          </span>
        </div>
      </div>

      {/* Courses List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredCourses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Course &amp; Degree</th>
                  <th className="py-4 px-6">Faculty / Department</th>
                  {isSuperAdmin && selectedUniId === "ALL" && (
                    <th className="py-4 px-6">Institution</th>
                  )}
                  <th className="py-4 px-6 text-center">Cut-off</th>
                  <th className="py-4 px-6">Capacity &amp; Applicants</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredCourses.map((course) => {
                  const compositeKey = `${(course.universityName || "").toLowerCase().trim()}:::${course.name.toLowerCase().trim()}`;
                  const stats = courseApplicationStats[compositeKey] || {
                    total: 0,
                    approved: 0,
                  };
                  const capacityNum = Number(course.capacity) || 100;
                  const percentFilled = Math.min(
                    100,
                    Math.round((stats.approved / capacityNum) * 100)
                  );

                  return (
                    <tr
                      key={course.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Course Name */}
                      <td className="py-4 px-6">
                        <div className="font-extrabold text-[#1F2430]">
                          {course.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                            {course.duration || "4 Years"}
                          </span>
                          <span>•</span>
                          <span className="truncate max-w-[200px]" title={course.olevelReqs}>
                            {course.olevelReqs || "Standard 5 Credits"}
                          </span>
                        </div>
                      </td>

                      {/* Faculty */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                          {course.faculty}
                        </span>
                      </td>

                      {/* University (If Superadmin) */}
                      {isSuperAdmin && selectedUniId === "ALL" && (
                        <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                          {course.universityName}
                        </td>
                      )}

                      {/* JAMB Cutoff */}
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                          {course.jambCutoff} pts
                        </span>
                      </td>

                      {/* Capacity & Applications */}
                      <td className="py-4 px-6">
                        <div className="w-36 space-y-1">
                          <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                            <span>
                              {stats.total} Applied ({stats.approved} Admitted)
                            </span>
                            <span>{capacityNum} Max</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                percentFilled > 80
                                  ? "bg-rose-500"
                                  : percentFilled > 50
                                  ? "bg-amber-500"
                                  : "bg-[#E8792E]"
                              }`}
                              style={{ width: `${percentFilled}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(course.id)}
                          title="Click to toggle status between Open and Closed"
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition hover:opacity-80 border ${
                            course.status === "Open"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : course.status === "Limited"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-slate-100 text-slate-600 border-slate-300"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              course.status === "Open"
                                ? "bg-emerald-500"
                                : course.status === "Limited"
                                ? "bg-amber-500"
                                : "bg-slate-400"
                            }`}
                          />
                          {course.status}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenView(course)}
                            title="View Requirements"
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#E8792E] text-slate-600 hover:text-white flex items-center justify-center transition cursor-pointer"
                          >
                            <FontAwesomeIcon icon={faEye} className="text-xs" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(course)}
                            title="Edit Course"
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-800 text-slate-600 hover:text-white flex items-center justify-center transition cursor-pointer"
                          >
                            <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenDelete(course)}
                            title="Delete Course"
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-rose-600 text-slate-600 hover:text-white flex items-center justify-center transition cursor-pointer"
                          >
                            <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#E8792E] flex items-center justify-center mx-auto mb-4 text-xl">
              <FontAwesomeIcon icon={faGraduationCap} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No matching courses found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any courses matching your search or filters. Try
              adjusting your filter parameters or add a new course.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setFacultyFilter("ALL");
                  setStatusFilter("ALL");
                  setCutoffFilter("ALL");
                }}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition cursor-pointer"
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-4 py-2 bg-[#E8792E] text-white text-xs font-bold rounded-xl hover:bg-[#d06925] transition cursor-pointer flex items-center gap-1.5"
              >
                <FontAwesomeIcon icon={faPlus} /> Add Course
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* ADD COURSE MODAL */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E8792E]">
                Accreditation Console
              </span>
              <h3 className="text-xl font-extrabold text-[#1F2430] mt-0.5">
                Accredit New Academic Program
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Add a new undergraduate course to the university portal.
              </p>
            </div>

            <form onSubmit={handleSaveNewCourse} className="space-y-4 text-xs sm:text-sm">
              {/* University (If Superadmin) */}
              {isSuperAdmin && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Assigning University <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formValues.universityId}
                    onChange={(e) =>
                      setFormValues({ ...formValues, universityId: e.target.value })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E8792E]"
                    required
                  >
                    {NIGERIAN_UNIVERSITIES.map((uni) => (
                      <option key={uni.id} value={uni.id}>
                        {uni.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Course Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Course Title &amp; Degree <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. B.Sc. Software Engineering"
                  value={formValues.name}
                  onChange={(e) =>
                    setFormValues({ ...formValues, name: e.target.value })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E8792E]"
                  required
                />
              </div>

              {/* Faculty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Faculty / College <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formValues.faculty}
                    onChange={(e) =>
                      setFormValues({ ...formValues, faculty: e.target.value })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E8792E]"
                  >
                    {COMMON_FACULTIES.map((fac) => (
                      <option key={fac} value={fac}>
                        {fac}
                      </option>
                    ))}
                    <option value="Other">Custom Faculty Name...</option>
                  </select>
                </div>

                {formValues.faculty === "Other" ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Custom Faculty Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. School of Transport"
                      value={formValues.customFaculty}
                      onChange={(e) =>
                        setFormValues({ ...formValues, customFaculty: e.target.value })
                      }
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E8792E]"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Degree Duration
                    </label>
                    <select
                      value={formValues.duration}
                      onChange={(e) =>
                        setFormValues({ ...formValues, duration: e.target.value })
                      }
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E8792E]"
                    >
                      <option value="4 Years">4 Years</option>
                      <option value="5 Years">5 Years</option>
                      <option value="6 Years">6 Years</option>
                      <option value="3 Years">3 Years (Direct Entry)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* JAMB Cutoff & Quota Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    JAMB Cut-off Score <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="140"
                    max="400"
                    value={formValues.jambCutoff}
                    onChange={(e) =>
                      setFormValues({ ...formValues, jambCutoff: e.target.value })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E8792E]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Admissions Quota
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={formValues.capacity}
                    onChange={(e) =>
                      setFormValues({ ...formValues, capacity: e.target.value })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E8792E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Admission Status
                  </label>
                  <select
                    value={formValues.status}
                    onChange={(e) =>
                      setFormValues({ ...formValues, status: e.target.value })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E8792E]"
                  >
                    <option value="Open">Open</option>
                    <option value="Limited">Limited</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* O'Level Text Requirements */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  O'Level Requirement Summary
                </label>
                <textarea
                  rows="2"
                  value={formValues.olevelReqs}
                  onChange={(e) =>
                    setFormValues({ ...formValues, olevelReqs: e.target.value })
                  }
                  placeholder="e.g. 5 Credits: English, Math, Physics, Chemistry, Biology at one sitting."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E8792E]"
                />
              </div>

              {/* WAEC Core Subjects Chips */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Core WAEC/NECO Subjects Required
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2 max-h-28 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {COMMON_SUBJECTS.map((sub) => {
                    const isSelected = formValues.waecFiveCoreSubjects.includes(sub);
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => toggleSubject(sub)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                          isSelected
                            ? "bg-[#E8792E] text-white"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {sub}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Subject */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Other subject (e.g. Technical Drawing)..."
                    value={formValues.customSubject}
                    onChange={(e) =>
                      setFormValues({ ...formValues, customSubject: e.target.value })
                    }
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#E8792E]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSubject}
                    className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#E8792E] hover:bg-[#d06925] text-white font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faCheckCircle} /> Save &amp; Accredit Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT COURSE MODAL */}
      {/* ======================================================== */}
      {isEditModalOpen && activeCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E8792E]">
                Modify Accredited Program
              </span>
              <h3 className="text-xl font-extrabold text-[#1F2430] mt-0.5">
                Edit Course Parameters
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Updates to cut-off marks and quota take effect immediately.
              </p>
            </div>

            <form onSubmit={handleSaveEditCourse} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Course Title &amp; Degree
                </label>
                <input
                  type="text"
                  value={formValues.name}
                  onChange={(e) =>
                    setFormValues({ ...formValues, name: e.target.value })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E8792E]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Faculty / College
                  </label>
                  <select
                    value={formValues.faculty}
                    onChange={(e) =>
                      setFormValues({ ...formValues, faculty: e.target.value })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E8792E]"
                  >
                    {COMMON_FACULTIES.map((fac) => (
                      <option key={fac} value={fac}>
                        {fac}
                      </option>
                    ))}
                    <option value="Other">Custom Faculty...</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Degree Duration
                  </label>
                  <select
                    value={formValues.duration}
                    onChange={(e) =>
                      setFormValues({ ...formValues, duration: e.target.value })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E8792E]"
                  >
                    <option value="4 Years">4 Years</option>
                    <option value="5 Years">5 Years</option>
                    <option value="6 Years">6 Years</option>
                    <option value="3 Years">3 Years (Direct Entry)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    JAMB Cut-off Score
                  </label>
                  <input
                    type="number"
                    min="140"
                    max="400"
                    value={formValues.jambCutoff}
                    onChange={(e) =>
                      setFormValues({ ...formValues, jambCutoff: e.target.value })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E8792E]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Quota Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={formValues.capacity}
                    onChange={(e) =>
                      setFormValues({ ...formValues, capacity: e.target.value })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E8792E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Admission Status
                  </label>
                  <select
                    value={formValues.status}
                    onChange={(e) =>
                      setFormValues({ ...formValues, status: e.target.value })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E8792E]"
                  >
                    <option value="Open">Open</option>
                    <option value="Limited">Limited</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  O'Level Requirement Summary
                </label>
                <textarea
                  rows="2"
                  value={formValues.olevelReqs}
                  onChange={(e) =>
                    setFormValues({ ...formValues, olevelReqs: e.target.value })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E8792E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Core WAEC/NECO Subjects Required
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {COMMON_SUBJECTS.map((sub) => {
                    const isSelected = formValues.waecFiveCoreSubjects.includes(sub);
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => toggleSubject(sub)}
                        className={`px-2 py-0.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                          isSelected
                            ? "bg-[#E8792E] text-white"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {sub}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#E8792E] hover:bg-[#d06925] text-white font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faCheckCircle} /> Update Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW COURSE DETAILS MODAL */}
      {/* ======================================================== */}
      {isViewModalOpen && activeCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <div className="border-b border-slate-100 pb-4 mb-4">
              <span className="text-xs font-bold text-[#E8792E] uppercase">
                Academic Program Profile
              </span>
              <h3 className="text-xl font-extrabold text-[#1F2430] mt-0.5">
                {activeCourse.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {activeCourse.universityName} • {activeCourse.faculty}
              </p>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl">
                  <strong className="block text-[10px] uppercase font-bold text-amber-800">
                    JAMB Cut-off Target
                  </strong>
                  <span className="text-lg font-black text-amber-900">
                    {activeCourse.jambCutoff} Points
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="block text-[10px] uppercase font-bold text-slate-500">
                    Admission Status
                  </strong>
                  <span
                    className={`inline-block mt-1 font-bold ${
                      activeCourse.status === "Open"
                        ? "text-emerald-700"
                        : activeCourse.status === "Limited"
                        ? "text-amber-700"
                        : "text-slate-600"
                    }`}
                  >
                    ● {activeCourse.status}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="block text-xs uppercase font-bold text-slate-500 mb-1">
                  O'Level Admission Requirements
                </strong>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeCourse.olevelReqs}
                </p>
              </div>

              {activeCourse.waecFiveCoreSubjects?.length > 0 && (
                <div>
                  <strong className="block text-xs font-bold text-slate-700 mb-1.5">
                    Required Subject Prerequisites:
                  </strong>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCourse.waecFiveCoreSubjects.map((sub, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                      >
                        ✓ {sub}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-500">
                <div>
                  <span className="font-semibold text-slate-700">Duration:</span>{" "}
                  {activeCourse.duration || "4 Years"}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Total Quota:</span>{" "}
                  {activeCourse.capacity || 100} Seats
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenEdit(activeCourse);
                }}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 cursor-pointer flex items-center gap-1.5"
              >
                <FontAwesomeIcon icon={faPenToSquare} /> Edit Course
              </button>

              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {isDeleteModalOpen && activeCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 text-xl">
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Confirm Program Removal
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Are you sure you want to remove <strong>"{activeCourse.name}"</strong>?
              This will un-accredit the course from candidate application portals.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <FontAwesomeIcon icon={faTrashCan} /> Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
