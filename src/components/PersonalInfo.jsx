import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import logoDark from "../assets/logo-dark.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { OnboardingSteps } from "../components/OnboardingSteps";
import { useOnboarding } from "../context/OnboardingContext";


const personalInfoSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  gender: Yup.string()
    .oneOf(["Male", "Female", "Other"], "Please select a gender")
    .required("Gender selection is required"),
  dob: Yup.string()
    .required("Date of birth is required"),
  citizenship: Yup.string()
    .required("Please select your citizenship"),
  contactEmail: Yup.string()
    .email("Enter a valid email address")
    .required("Contact email is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9+() -]{8,20}$/, "Enter a valid phone number")
    .required("Phone number is required"),
  nin: Yup.string()
    .trim()
    .matches(/^[0-9]{11}$/, "NIN must be exactly 11 numeric digits")
    .required("National Identity Number (NIN) is required"),
  homeAddress: Yup.string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .required("Residential address is required"),
  home: Yup.string().trim(),
});

export const PersonalInfo = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useOnboarding();

  const activeUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "{}");
    } catch {
      return {};
    }
  })();

  const userParts = (activeUser.fullName || activeUser.name || "").trim().split(" ");
  const fallbackFirstName = userParts[0] || "";
  const fallbackLastName = userParts.slice(1).join(" ") || "";

  const formik = useFormik({
    initialValues: {
      firstName: formData.firstName || fallbackFirstName,
      lastName: formData.lastName || fallbackLastName,
      gender: formData.gender || "Male",
      dob: formData.dob || "",
      citizenship: formData.citizenship || "Nigeria",
      contactEmail: formData.contactEmail || formData.email || activeUser.email || "",
      phoneNumber: formData.phoneNumber || formData.phone || "",
      nin: formData.nin || "",
      homeAddress: formData.homeAddress || "",
      home: formData.home || "",
    },
    enableReinitialize: true,
    validationSchema: personalInfoSchema,
    onSubmit: (values) => {
      const full = `${values.firstName} ${values.lastName}`.trim();
      updateFormData({
        ...values,
        fullName: full,
        name: full,
        phone: values.phoneNumber,
        nin: values.nin,
      });

      localStorage.setItem("applicantName", full);
      localStorage.setItem("applicantEmail", values.contactEmail);

      navigate("/onboarding/academic-details");
    },
  });

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
            Step 1 of 4: Personal Information
          </span>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col">
        <OnboardingSteps currentStep={1} />

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2430]">
            Personal Info
          </h1>
          <p className="text-xs sm:text-sm text-[#8B93A1] mt-1">
            Provide your official identity and primary contact details for verification.
          </p>
        </div>

        <form
          id="personal-info-form"
          onSubmit={formik.handleSubmit}
          className="bg-white rounded-2xl p-6 sm:p-10 shadow-xs border border-[#DCE1E7] space-y-6 flex-1"
        >
          {/* Row 1: Full Name & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none transition ${
                      formik.touched.firstName && formik.errors.firstName
                        ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                        : "border-[#DCE1E7] focus:border-[#E8792E]"
                    }`}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                      <FontAwesomeIcon icon={faExclamationCircle} />
                      {formik.errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none transition ${
                      formik.touched.lastName && formik.errors.lastName
                        ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                        : "border-[#DCE1E7] focus:border-[#E8792E]"
                    }`}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                      <FontAwesomeIcon icon={faExclamationCircle} />
                      {formik.errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Gender Field */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                Gender <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-6 pt-2">
                {["Male", "Female", "Other"].map((g) => (
                  <label
                    key={g}
                    className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-medium text-slate-700"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formik.values.gender === g}
                      onChange={formik.handleChange}
                      className="w-4 h-4 text-[#E8792E] focus:ring-[#E8792E]"
                    />
                    {g}
                  </label>
                ))}
              </div>
              {formik.touched.gender && formik.errors.gender && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  {formik.errors.gender}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                Date of Birth <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="dob"
                value={formik.values.dob}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none transition ${
                  formik.touched.dob && formik.errors.dob
                    ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                    : "border-[#DCE1E7] focus:border-[#E8792E]"
                }`}
              />
              {formik.touched.dob && formik.errors.dob && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  {formik.errors.dob}
                </p>
              )}
            </div>

            {/* Citizenship */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                Citizenship <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="citizenship"
                  value={formik.values.citizenship}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none transition appearance-none cursor-pointer ${
                    formik.touched.citizenship && formik.errors.citizenship
                      ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                      : "border-[#DCE1E7] focus:border-[#E8792E]"
                  }`}
                >
                  <option value="">Select Citizenship</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                  <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                </div>
              </div>
              {formik.touched.citizenship && formik.errors.citizenship && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  {formik.errors.citizenship}
                </p>
              )}
            </div>

            {/* Contact Email */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                Contact Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="contactEmail"
                placeholder="e.g. user@gmail.com"
                value={formik.values.contactEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none transition ${
                  formik.touched.contactEmail && formik.errors.contactEmail
                    ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                    : "border-[#DCE1E7] focus:border-[#E8792E]"
                }`}
              />
              {formik.touched.contactEmail && formik.errors.contactEmail && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  {formik.errors.contactEmail}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="e.g. +234 801 234 5678"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none transition ${
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                    ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                    : "border-[#DCE1E7] focus:border-[#E8792E]"
                }`}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  {formik.errors.phoneNumber}
                </p>
              )}
            </div>

            {/* National Identity Number (NIN) */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                National Identity Number (NIN) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="nin"
                maxLength={11}
                placeholder="e.g. 10293847561 (11 numeric digits)"
                value={formik.values.nin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none transition ${
                  formik.touched.nin && formik.errors.nin
                    ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                    : "border-[#DCE1E7] focus:border-[#E8792E]"
                }`}
              />
              {formik.touched.nin && formik.errors.nin && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  {formik.errors.nin}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Residential Address & Landmark */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                Home Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="homeAddress"
                rows="3"
                placeholder="Enter complete residential address..."
                value={formik.values.homeAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none transition resize-none ${
                  formik.touched.homeAddress && formik.errors.homeAddress
                    ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                    : "border-[#DCE1E7] focus:border-[#E8792E]"
                }`}
              />
              {formik.touched.homeAddress && formik.errors.homeAddress && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  {formik.errors.homeAddress}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                Landmark / Estate <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="home"
                placeholder="Closest landmark, bus stop, or estate name"
                value={formik.values.home}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition"
              />
            </div>
          </div>
        </form>
      </main>

      {/* Sticky Bottom Actions Footer */}
      <footer className="sticky bottom-0 bg-[#1E2432] border-t border-slate-800 py-4 px-6 lg:px-16 shadow-lg mt-auto">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800 font-medium text-xs sm:text-sm transition cursor-pointer"
          >
            Back
          </button>
          <button
            type="submit"
            form="personal-info-form"
            className="px-8 py-2.5 rounded-xl bg-[#E8792E] hover:bg-[#C96A28] text-white font-semibold text-xs sm:text-sm shadow-md transition cursor-pointer"
          >
            Save & Continue
          </button>
        </div>
      </footer>
    </div>
  );
};