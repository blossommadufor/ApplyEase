import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faBuildingColumns,
  faComments,
  faCheckCircle,
  faLocationDot,
  faClock,
  faPaperPlane,
  faSpinner,
  faUserGraduate,
  faCircleQuestion,
  faArrowRight,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

export default function Contact() {
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [ticketRef, setTicketRef] = useState("");

  const initialType = searchParams.get("type") === "partner" ? "partner" : "applicant";

  const formik = useFormik({
    initialValues: {
      inquiryType: initialType,
      fullName: "",
      email: "",
      phone: "",
      institution: "",
      subject: "",
      message: "",
    },
    validationSchema: Yup.object().shape({
      inquiryType: Yup.string().required(),
      fullName: Yup.string()
        .trim()
        .min(2, "Full name must be at least 2 characters")
        .required("Full name is required"),
      email: Yup.string()
        .email("Enter a valid email address")
        .required("Email address is required"),
      phone: Yup.string().trim(),
      institution: Yup.string().when("inquiryType", {
        is: "partner",
        then: (schema) => schema.required("Institution name is required for university partners"),
        otherwise: (schema) => schema.notRequired(),
      }),
      subject: Yup.string()
        .trim()
        .min(3, "Subject must be at least 3 characters")
        .required("Subject line is required"),
      message: Yup.string()
        .trim()
        .min(10, "Please provide at least 10 characters in your inquiry")
        .required("Message content is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      // Simulate dispatching customer care inquiry
      await new Promise((resolve) => setTimeout(resolve, 800));
      const ref = `REQ-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketRef(ref);
      setSubmitted(true);
      resetForm();
    },
  });

  const { setFieldValue } = formik;

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "partner" || type === "applicant" || type === "general") {
      setFieldValue("inquiryType", type);
    }
  }, [searchParams, setFieldValue]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1F2430] font-sans pb-20">
      {/* Top Banner */}
      <section className="bg-[#1E2432] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-16 text-center relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#E8792E]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8792E]/20 text-[#E8792E] text-xs font-semibold uppercase tracking-wider border border-[#E8792E]/30">
            <FontAwesomeIcon icon={faComments} />
            <span>ApplyNow Customer Care & Partnerships</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            How Can We Assist You Today?
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Whether you are a university looking to partner, an applicant navigating admission cutoffs, 
            or a parent seeking guidance, our dedicated team is here to support you.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contact Channels & Headquarters */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Channel Card 1: University Partners */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-[#E8792E]/40 transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#E8792E] flex items-center justify-center text-lg shrink-0">
                  <FontAwesomeIcon icon={faBuildingColumns} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    Tertiary Institution Partnerships
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    Accredited universities, polytechnics, and colleges seeking to onboard their admissions process.
                  </p>
                  <div className="pt-2 text-xs sm:text-sm font-medium text-slate-700 space-y-1">
                    <p className="flex items-center gap-2 text-[#E8792E]">
                      <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
                      <a href="mailto:partners@applynow.ng" className="hover:underline">partners@applynow.ng</a>
                    </p>
                    <p className="flex items-center gap-2 text-slate-600">
                      <FontAwesomeIcon icon={faPhone} className="text-xs" />
                      <span>+234 (0) 800-APPLY-UNI</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Channel Card 2: Student & Applicant Helpdesk */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-[#E8792E]/40 transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shrink-0">
                  <FontAwesomeIcon icon={faUserGraduate} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    Applicant & Candidate Support
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    Need help tracking your application status, UTME prerequisites, or document uploads?
                  </p>
                  <div className="pt-2 text-xs sm:text-sm font-medium text-slate-700 space-y-1">
                    <p className="flex items-center gap-2 text-[#E8792E]">
                      <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
                      <a href="mailto:support@applynow.ng" className="hover:underline">support@applynow.ng</a>
                    </p>
                    <p className="flex items-center gap-2 text-slate-600">
                      <FontAwesomeIcon icon={faClock} className="text-xs" />
                      <span>Mon - Fri, 8:00 AM - 6:00 PM (WAT)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Channel Card 3: Physical Headquarters */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-lg shrink-0">
                  <FontAwesomeIcon icon={faLocationDot} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    ApplyNow Headquarters
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                    Plot 14B, Adetokunbo Ademola Street, Victoria Island, Lagos State, Nigeria.
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs text-emerald-700 font-medium">
                    <FontAwesomeIcon icon={faShieldHalved} className="text-xs" />
                    <span>Accredited National Admissions Infrastructure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Help / FAQ Link Box */}
            <div className="p-5 rounded-2xl bg-[#F5E6D8]/60 border border-[#E8792E]/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faCircleQuestion} className="text-[#E8792E] text-xl shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Need Immediate Answers?</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 font-normal">Review our frequently asked questions for swift resolution.</p>
                </div>
              </div>
              <Link
                to="/#faq"
                className="px-3.5 py-2 bg-white text-xs font-semibold text-slate-800 rounded-xl hover:bg-slate-50 transition border border-slate-200 shrink-0 shadow-2xs flex items-center gap-1.5"
              >
                <span>Browse FAQ</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
              </Link>
            </div>

          </div>

          {/* Right Column: Interactive Dispatch Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            {submitted ? (
              <div className="py-12 px-4 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Message Dispatched Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to ApplyNow. Your support ticket has been registered under reference:
                </p>
                <div className="inline-block px-4 py-2 bg-slate-100 rounded-xl font-mono text-sm font-bold text-slate-800 border border-slate-200">
                  {ticketRef}
                </div>
                <p className="text-xs text-slate-500 font-normal">
                  Our admissions and partnerships team typically responds within 24 business hours.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-[#1E2432] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-slate-800 transition cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6 space-y-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Send Us a Direct Message
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal">
                    Fill out the form below and the appropriate department will connect with you promptly.
                  </p>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-5">
                  {/* Inquiry Category Selector Pills */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Select Your Inquiry Type <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: "applicant", label: "Applicant Support" },
                        { id: "partner", label: "University Partner" },
                        { id: "general", label: "General Inquiry" },
                      ].map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => formik.setFieldValue("inquiryType", type.id)}
                          className={`py-2 px-3 text-xs font-medium rounded-xl border transition text-center cursor-pointer ${
                            formik.values.inquiryType === type.id
                              ? "bg-[#1E2432] text-white border-[#1E2432] shadow-xs"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g. Dr. Samuel Adeyemi or Somtochi Madufor"
                        className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none transition ${
                          formik.touched.fullName && formik.errors.fullName
                            ? "border-rose-400 bg-rose-50/20"
                            : "border-slate-200 focus:border-[#E8792E]"
                        }`}
                      />
                      {formik.touched.fullName && formik.errors.fullName && (
                        <p className="text-[11px] text-rose-500">{formik.errors.fullName}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="name@example.com"
                        className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none transition ${
                          formik.touched.email && formik.errors.email
                            ? "border-rose-400 bg-rose-50/20"
                            : "border-slate-200 focus:border-[#E8792E]"
                        }`}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="text-[11px] text-rose-500">{formik.errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone & Institution Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="+234 803 000 0000"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#E8792E] transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        {formik.values.inquiryType === "partner" ? (
                          <>
                            Institution Name <span className="text-rose-500">*</span>
                          </>
                        ) : (
                          "Target University (Optional)"
                        )}
                      </label>
                      <input
                        type="text"
                        name="institution"
                        value={formik.values.institution}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g. University of Lagos (UNILAG)"
                        className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none transition ${
                          formik.touched.institution && formik.errors.institution
                            ? "border-rose-400 bg-rose-50/20"
                            : "border-slate-200 focus:border-[#E8792E]"
                        }`}
                      />
                      {formik.touched.institution && formik.errors.institution && (
                        <p className="text-[11px] text-rose-500">{formik.errors.institution}</p>
                      )}
                    </div>
                  </div>

                  {/* Subject Line */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Subject <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formik.values.subject}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={
                        formik.values.inquiryType === "partner"
                          ? "e.g. Partnership inquiry for faculty admissions integration"
                          : "e.g. Question regarding UTME score submission"
                      }
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none transition ${
                        formik.touched.subject && formik.errors.subject
                          ? "border-rose-400 bg-rose-50/20"
                          : "border-slate-200 focus:border-[#E8792E]"
                      }`}
                    />
                    {formik.touched.subject && formik.errors.subject && (
                      <p className="text-[11px] text-rose-500">{formik.errors.subject}</p>
                    )}
                  </div>

                  {/* Message Body */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows="4"
                      name="message"
                      value={formik.values.message}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Please elaborate on your inquiry or provide details about your institution or application..."
                      className={`w-full p-3.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none transition ${
                        formik.touched.message && formik.errors.message
                          ? "border-rose-400 bg-rose-50/20"
                          : "border-slate-200 focus:border-[#E8792E]"
                      }`}
                    />
                    {formik.touched.message && formik.errors.message && (
                      <p className="text-[11px] text-rose-500">{formik.errors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="w-full py-3.5 px-4 bg-[#E8792E] hover:bg-[#C96A28] text-white font-semibold text-xs sm:text-sm rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {formik.isSubmitting ? (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
                    ) : (
                      <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                    )}
                    <span>{formik.isSubmitting ? "Dispatching Message..." : "Send Message to ApplyNow"}</span>
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
