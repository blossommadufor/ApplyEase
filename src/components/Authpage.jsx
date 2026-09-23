import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import logoDark from "../assets/logo-dark.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faUser,
  faBuilding,
  faArrowLeft,
  faUserShield,
  faGraduationCap,
  faExclamationCircle,
  faChevronDown,
  faSpinner,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import { NIGERIAN_UNIVERSITIES } from "../universitiesdata";
import { usersAPI } from "../services/api";

export const AuthPage = ({ setIsLoggedIn, setIsAdminLoggedIn }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [role, setRole] = useState("applicant");
  const [authError, setAuthError] = useState("");
  const isSignUp = searchParams.get("mode") === "signup";
  const navigate = useNavigate();

  const toggleMode = () => {
    setAuthError("");
    const newMode = isSignUp ? "signin" : "signup";
    setSearchParams({ mode: newMode });
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setAuthError("");
    if (newRole === "admin" && isSignUp) {
      setSearchParams({ mode: "signin" });
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Enter a valid email address")
      .required("Email address is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    fullName:
      isSignUp || role === "admin"
        ? Yup.string()
            .trim()
            .min(3, "Full name must be at least 3 characters")
            .required("Full name is required")
        : Yup.string(),
    institution:
      role === "admin"
        ? Yup.string()
            .trim()
            .required("Please select your accredited partner institution")
        : Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      fullName: "",
      institution: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setAuthError("");
      try {
        if (isSignUp) {
          // --- REAL SIGN UP LOGIC (JSON Server) ---
          const existingUser = await usersAPI.getByEmail(values.email);
          if (existingUser) {
            setAuthError(
              "An account with this email address already exists. Please switch to Sign In."
            );
            setSubmitting(false);
            return;
          }

          const newUser = await usersAPI.create({
            fullName: values.fullName.trim(),
            email: values.email.trim(),
            password: values.password,
            role: role,
            institution: role === "admin" ? values.institution : "",
          });

          // Establish active authenticated session
          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("currentUser", JSON.stringify(newUser));
          localStorage.setItem("user", JSON.stringify(newUser));
          localStorage.setItem("userRole", role);

          if (role === "admin") {
            if (setIsAdminLoggedIn) setIsAdminLoggedIn(true);
            localStorage.setItem("isAdminLoggedIn", "true");
            localStorage.setItem("adminInstitution", values.institution);
            navigate("/admin-dashboard", { replace: true });
          } else {
            navigate("/select-university", { replace: true });
          }
        } else {
          // --- REAL SIGN IN VERIFICATION (JSON Server) ---
          const result = await usersAPI.login(
            values.email.trim(),
            values.password,
            role,
            role === "admin" ? values.institution : ""
          );

          if (!result.success) {
            setAuthError(result.error);
            setSubmitting(false);
            return;
          }

          // Verified credentials match a real account!
          const user = result.user;
          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("currentUser", JSON.stringify(user));
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("userRole", user.role);

          if (user.role === "admin") {
            if (setIsAdminLoggedIn) setIsAdminLoggedIn(true);
            localStorage.setItem("isAdminLoggedIn", "true");
            localStorage.setItem(
              "adminInstitution",
              user.institution || values.institution
            );
            navigate("/admin-dashboard", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        }
      } catch (err) {
        console.error("Auth error:", err);
        setAuthError(
          "Network error communicating with authentication service. Please ensure json-server is active."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Quick fill helper for testing and demonstrations
  const handleQuickFill = (email, password, testRole, inst = "") => {
    setAuthError("");
    setRole(testRole);
    if (isSignUp) setSearchParams({ mode: "signin" });
    formik.setValues({
      email,
      password,
      fullName: "",
      institution: inst,
    });
  };

  return (
    <div className="min-h-screen bg-[#F5E6D8] flex flex-col justify-center py-12 px-4 md:px-8 lg:px-8 font-sans">
      <div className="w-full max-w-md mx-auto">
        <Link to="/" className="flex justify-center mb-6">
          <img
            src={logoDark}
            alt="ApplyEase"
            className="w-36 h-auto object-contain"
          />
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-[#1F2430]">
          {role === "admin"
            ? "Institutional Portal Sign In"
            : isSignUp
            ? "Create your account"
            : "Sign in to your account"}
        </h2>
        {role === "applicant" && (
          <p className="mt-2 text-center text-sm text-[#8B93A1]">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="font-medium text-[#E8792E] hover:underline focus:outline-none cursor-pointer"
            >
              {isSignUp ? "Sign in" : "Get started"}
            </button>
          </p>
        )}
      </div>

      <div className="mt-8 w-full max-w-md mx-auto">
        <div className="bg-white py-8 px-6 shadow-sm rounded-3xl border border-[#DCE1E7] md:px-10">
          {/* Role Toggle Selector */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 border border-slate-200">
            <button
              type="button"
              onClick={() => handleRoleChange("applicant")}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                role === "applicant"
                  ? "bg-white text-[#1F2430] shadow-xs"
                  : "text-slate-500 hover:text-[#1F2430]"
              }`}
            >
              <FontAwesomeIcon icon={faGraduationCap} /> Applicant
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("admin")}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                role === "admin"
                  ? "bg-[#1E2432] text-white shadow-xs"
                  : "text-slate-500 hover:text-[#1F2430]"
              }`}
            >
              <FontAwesomeIcon icon={faUserShield} /> Admin Portal
            </button>
          </div>

          {/* Authentication Error Feedback Banner */}
          {authError && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="text-rose-600 text-sm shrink-0 mt-0.5"
              />
              <span className="leading-snug">{authError}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            {/* Full Name field - shown during Applicant Signup OR Admin Login */}
            {(isSignUp || role === "admin") && (
              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FontAwesomeIcon icon={faUser} className="text-xs" />
                  </span>
                  <input
                    type="text"
                    name="fullName"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={
                      role === "admin" ? "Dr. Samuel Adeyemi" : "Somtochi Madufor"
                    }
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none transition ${
                      formik.touched.fullName && formik.errors.fullName
                        ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                        : "border-[#DCE1E7] focus:border-[#E8792E]"
                    }`}
                  />
                </div>
                {formik.touched.fullName && formik.errors.fullName && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    {formik.errors.fullName}
                  </p>
                )}
              </div>
            )}

            {/* Admin Institution Dropdown */}
            {role === "admin" && (
              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                  Partner University <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FontAwesomeIcon icon={faBuilding} className="text-xs" />
                  </span>
                  <select
                    name="institution"
                    value={formik.values.institution}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-9 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none transition appearance-none cursor-pointer ${
                      formik.touched.institution && formik.errors.institution
                        ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                        : "border-[#DCE1E7] focus:border-[#E8792E]"
                    }`}
                  >
                    <option value="">Select accredited partner institution...</option>
                    {NIGERIAN_UNIVERSITIES.map((uni) => (
                      <option key={uni.id} value={uni.name}>
                        {uni.name} ({uni.state} State)
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                    <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                  </div>
                </div>
                {formik.touched.institution && formik.errors.institution && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    {formik.errors.institution}
                  </p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none transition ${
                    formik.touched.email && formik.errors.email
                      ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                      : "border-[#DCE1E7] focus:border-[#E8792E]"
                  }`}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FontAwesomeIcon icon={faLock} className="text-xs" />
                </span>
                <input
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none transition ${
                    formik.touched.password && formik.errors.password
                      ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                      : "border-[#DCE1E7] focus:border-[#E8792E]"
                  }`}
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className={`w-full py-3 px-4 rounded-xl shadow-xs text-xs sm:text-sm font-semibold text-white transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 ${
                  role === "admin"
                    ? "bg-[#1E2432] hover:bg-slate-800"
                    : "bg-[#E8792E] hover:bg-[#C96A28]"
                }`}
              >
                {formik.isSubmitting && (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
                )}
                <span>
                  {role === "admin"
                    ? "Access Admin Dashboard"
                    : isSignUp
                    ? "Create Account"
                    : "Sign In"}
                </span>
              </button>
            </div>
          </form>

          {/* Demo Accounts Quick-Fill Helper for Testing & Evaluation */}
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center flex items-center justify-center gap-1.5">
              <FontAwesomeIcon icon={faKey} className="text-slate-400 text-[10px]" />
              Quick Fill Demo Accounts
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() =>
                  handleQuickFill(
                    "blossommadufor@gmail.com",
                    "Password123!",
                    "applicant"
                  )
                }
                className="p-2 rounded-xl bg-slate-50 hover:bg-[#F5E6D8] border border-slate-200 text-slate-700 text-left transition cursor-pointer"
              >
                <strong className="block text-[11px] text-[#E8792E]">Applicant Account</strong>
                <span className="text-[10px] text-slate-400 block truncate">
                  blossommadufor@gmail.com
                </span>
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickFill(
                    "admin.unilag@applyease.ng",
                    "AdminSecret2026!",
                    "admin",
                    "University of Lagos (UNILAG)"
                  )
                }
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-left transition cursor-pointer"
              >
                <strong className="block text-[11px] text-[#1E2432]">UNILAG Admin</strong>
                <span className="text-[10px] text-slate-400 block truncate">
                  admin.unilag@applyease.ng
                </span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs text-[#8B93A1] hover:text-[#1F2430] transition"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};