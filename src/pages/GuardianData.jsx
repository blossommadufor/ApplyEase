import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import logoDark from "../assets/logo-dark.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { OnboardingSteps } from "../components/OnboardingSteps";
import { useOnboarding } from "../context/OnboardingContext";

const guardianDataSchema = Yup.object().shape({
  guardianName: Yup.string()
    .trim()
    .min(2, "Guardian full name must be at least 2 characters")
    .required("Guardian full name is required"),
  relationship: Yup.string()
    .required("Please select relationship to applicant"),
  guardianEmail: Yup.string()
    .email("Enter a valid email address")
    .required("Guardian email is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9+() -]{8,20}$/, "Enter a valid phone number")
    .required("Phone number is required"),
  homeAddress: Yup.string()
    .trim()
    .min(5, "Residential address must be at least 5 characters")
    .required("Home address is required"),
  state: Yup.string()
    .trim()
    .required("State is required"),
  lga: Yup.string()
    .trim()
    .required("LGA is required"),
  employer: Yup.string().trim(),
});

export const GuardianData = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useOnboarding();

  const formik = useFormik({
    initialValues: {
      guardianName: formData.guardianName || "",
      relationship: formData.relationship || "",
      guardianEmail: formData.guardianEmail || "",
      phoneNumber: formData.guardianPhone || formData.phoneNumber || "",
      homeAddress: formData.guardianAddress || formData.homeAddress || "",
      state: formData.state || "",
      lga: formData.lga || "",
      employer: formData.employer || "",
    },
    enableReinitialize: true,
    validationSchema: guardianDataSchema,
    onSubmit: (values) => {
      updateFormData({
        ...values,
        guardianPhone: values.phoneNumber,
        guardianAddress: values.homeAddress,
      });

      navigate("/onboarding/final-review");
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
            Step 3 of 4: Guardian & Sponsor Details
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col">
        <OnboardingSteps currentStep={3} />

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2430]">
            Guardian Data
          </h1>
          <p className="text-xs sm:text-sm text-[#8B93A1] mt-1">
            Provide the contact and sponsorship information for your legal guardian or next of kin.
          </p>
        </div>

        <form
          id="guardian-data-form"
          onSubmit={formik.handleSubmit}
          className="bg-white rounded-2xl p-6 sm:p-10 shadow-xs border border-[#DCE1E7] space-y-6 flex-1"
        >
          {/* Row 1: Guardian Name, Relationship, Email */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                Guardian Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="guardianName"
                placeholder="e.g. Dr. Ngozi Okafor"
                value={formik.values.guardianName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none transition ${
                  formik.touched.guardianName && formik.errors.guardianName
                    ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                    : "border-[#DCE1E7] focus:border-[#E8792E]"
                }`}
              />
              {formik.touched.guardianName && formik.errors.guardianName && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  {formik.errors.guardianName}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                Relationship to Applicant <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="relationship"
                  value={formik.values.relationship}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none transition appearance-none cursor-pointer ${
                    formik.touched.relationship && formik.errors.relationship
                      ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                      : "border-[#DCE1E7] focus:border-[#E8792E]"
                  }`}
                >
                  <option value="">Select Relationship</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Uncle">Uncle</option>
                  <option value="Aunt">Aunt</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                  <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                </div>
              </div>
              {formik.touched.relationship && formik.errors.relationship && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  {formik.errors.relationship}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                Guardian Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="guardianEmail"
                placeholder="e.g. guardian@gmail.com"
                value={formik.values.guardianEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none transition ${
                  formik.touched.guardianEmail && formik.errors.guardianEmail
                    ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                    : "border-[#DCE1E7] focus:border-[#E8792E]"
                }`}
              />
              {formik.touched.guardianEmail && formik.errors.guardianEmail && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  {formik.errors.guardianEmail}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Phone Number & Employer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                Guardian Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="e.g. +234 802 345 6789"
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

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                Guardian Occupation / Employer <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="employer"
                placeholder="e.g. Senior Civil Servant, Self-Employed"
                value={formik.values.employer}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2.5 bg-slate-50 border border-[#DCE1E7] rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none focus:border-[#E8792E] transition"
              />
            </div>
          </div>

          {/* Row 3: Guardian Home Address & State/LGA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                Guardian Residential Address <span className="text-rose-500">*</span>
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

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2430]">
                  State & LGA of Residence <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      name="state"
                      placeholder="State (e.g. Lagos)"
                      value={formik.values.state}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none transition ${
                        formik.touched.state && formik.errors.state
                          ? "border-rose-400 bg-rose-50/20"
                          : "border-[#DCE1E7] focus:border-[#E8792E]"
                      }`}
                    />
                    {formik.touched.state && formik.errors.state && (
                      <p className="text-[11px] text-rose-500 mt-1">
                        {formik.errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      name="lga"
                      placeholder="LGA (e.g. Ikeja)"
                      value={formik.values.lga}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-[#1F2430] focus:outline-none transition ${
                        formik.touched.lga && formik.errors.lga
                          ? "border-rose-400 bg-rose-50/20"
                          : "border-[#DCE1E7] focus:border-[#E8792E]"
                      }`}
                    />
                    {formik.touched.lga && formik.errors.lga && (
                      <p className="text-[11px] text-rose-500 mt-1">
                        {formik.errors.lga}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Sticky Bottom Actions Footer */}
      <footer className="sticky bottom-0 bg-[#1E2432] border-t border-slate-800 py-4 px-6 lg:px-16 shadow-lg mt-auto">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/onboarding/academic-details")}
            className="px-6 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800 font-medium text-xs sm:text-sm transition cursor-pointer"
          >
            Back
          </button>
          <button
            type="submit"
            form="guardian-data-form"
            className="px-8 py-2.5 rounded-xl bg-[#E8792E] hover:bg-[#C96A28] text-white font-semibold text-xs sm:text-sm shadow-md transition cursor-pointer"
          >
            Review Application
          </button>
        </div>
      </footer>
    </div>
  );
};