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
    formik.resetForm({
      values: {
        email: "",
        password: "",
        fullName: "",
        institution: "",
      },
    });
    const newMode = isSignUp ? "signin" : "signup";
    setSearchParams({ mode: newMode });
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setAuthError("");
    formik.resetForm({
      values: {
        email: "",
        password: "",
        fullName: "",
        institution: "",
      },
    });
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
      isSignUp
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
    onSubmit: async (values, { setSubmitting }) => {
      setAuthError("");
      try {
        if (isSignUp) {
          // --- REAL SIGN UP LOGIC ---
          const existingUser = await usersAPI.getByEmail(values.email);
          if (existingUser) {
            setAuthError(
              "An account with this email address already exists. Please switch to Sign In."
            );
            setSubmitting(false);
            return;
          }

          const userFullName = values.fullName.trim();
          const userFirstName = userFullName.split(" ")[0];
          const newUser = await usersAPI.create({
            fullName: userFullName,
            name: userFullName,
            firstName: userFirstName,
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
            navigate("/dashboard", { replace: true });
          }
        } else {
          // --- REAL SIGN IN VERIFICATION ---
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
          const rawName = result.user.fullName || result.user.name || "";
          const user = {
            ...result.user,
            fullName: rawName,
            name: rawName,
            firstName: rawName ? rawName.split(" ")[0] : "",
          };
          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("currentUser", JSON.stringify(user));
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("userRole", user.role);

          if (user.role === "admin" || user.role === "superadmin") {
            if (setIsAdminLoggedIn) setIsAdminLoggedIn(true);
            localStorage.setItem("isAdminLoggedIn", "true");
            localStorage.setItem(
              "adminInstitution",
              user.institution || values.institution || "ApplyNow Headquarters"
            );
            navigate("/admin-dashboard", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        }
      } catch (err) {
        console.error("Auth error:", err);
        setAuthError(
          err.message ||
            "Authentication failed. Please check your credentials and try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#F5E6D8] flex flex-col justify-center py-12 px-4 md:px-8 lg:px-8 font-sans">
      <div className="w-full max-w-md mx-auto">
        <Link to="/" className="flex justify-center mb-6">
          <img
            src={logoDark}
            alt="ApplyNow Logo"
            className="w-40 sm:w-44 h-auto object-contain"
          />
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#DCE1E7]">
          {/* Header Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F2430]">
              {isSignUp ? "Create an Account" : "Sign In to Your Account"}
            </h2>
            <p className="text-xs sm:text-sm text-[#8B93A1] mt-1">
              {role === "admin"
                ? "Institutional administrative admissions access"
                : isSignUp
                ? "Enter your details to begin university applications"
                : "Welcome back! Access your admissions dashboard"}
            </p>
          </div>

          {/* Role Selector Tabs (Applicant vs Admin) */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange("applicant")}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                role === "applicant"
                  ? "bg-white text-[#1F2430] shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <FontAwesomeIcon icon={faGraduationCap} />
              <span>Applicant</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("admin")}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                role === "admin"
                  ? "bg-[#1E2432] text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <FontAwesomeIcon icon={faUserShield} />
              <span>Admin / Partner</span>
            </button>
          </div>

          {/* Toggle Sign In / Sign Up Mode (Only for Applicants) */}
          {role === "applicant" && (
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm mb-6 pb-4 border-b border-slate-100">
              <span className="text-[#8B93A1]">
                {isSignUp
                  ? "Already registered an account?"
                  : "New to ApplyNow?"}
              </span>
              <button
                type="button"
                onClick={toggleMode}
                className="text-[#E8792E] font-bold hover:underline cursor-pointer"
              >
                {isSignUp ? "Sign In instead" : "Create Account"}
              </button>
            </div>
          )}

          {/* Live Auth Error Banner */}
          {authError && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="text-rose-500 mt-0.5 shrink-0"
              />
              <div className="leading-snug">
                <strong className="block font-semibold">Authentication Error</strong>
                <span>{authError}</span>
              </div>
            </div>
          )}

          {/* Formik Auth Form */}
          <form onSubmit={formik.handleSubmit} autoComplete="off" className="space-y-4">
            {/* Full Name Field (Sign Up only) */}
            {isSignUp && (
              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                  Candidate Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FontAwesomeIcon icon={faUser} className="text-xs" />
                  </span>
                  <input
                    type="text"
                    name="fullName"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder=""
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

            {/* Institution Dropdown (Only for Admin) */}
            {role === "admin" && (
              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                  Accredited University Institution{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FontAwesomeIcon icon={faBuilding} className="text-xs" />
                  </span>
                  <select
                    name="institution"
                    autoComplete="off"
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
                    <option value="ApplyNow Headquarters">ApplyNow Platform Administration (HQ)</option>
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
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder=""
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
                  autoComplete="new-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder=""
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

export default AuthPage;