import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout"; // Your normal layout with the real Navbar
import AdminLayout from "./components/AdminLayout"; // Your layout with the AdminSidebar
import Landing from "./pages/Landing";
import { AuthPage } from "./components/Authpage";
import { PersonalInfo } from "./components/PersonalInfo";
import { AcademicDetails } from "./pages/AcademicDetails";
import { GuardianData } from "./pages/GuardianData";
import { FinalReview } from "./pages/FinalReview";
import { OnboardingProvider } from "./context/OnboardingContext";
import { ConfirmationSuccess } from "./pages/ConfirmationSucess";
import MainDasboard from "./pages/MainDasboard";
import { SelectUniversity } from "./components/SelectUniversity";
import { SelectCourse } from "./components/SelectCourse";
import { ApplicationsProvider } from "./context/ApplicationsContext";
import { ApplicationDetails } from "./pages/ApplicationDetails";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDetail from "./pages/StudentDetail";

// Protected Route Guard for Admin
function AdminRoute({ isAdminLoggedIn, setIsAdminLoggedIn }) {
  return isAdminLoggedIn ? (
    <AdminLayout setIsAdminLoggedIn={setIsAdminLoggedIn} />
  ) : (
    <Navigate to="/auth" replace />
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem("isAdminLoggedIn") === "true";
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("isAdminLoggedIn", isAdminLoggedIn);
  }, [isAdminLoggedIn]);

  return (
    <OnboardingProvider>
      <ApplicationsProvider>
        <BrowserRouter>
          <Routes>
            {/* --- NORMAL LAYOUT (Your real Navbar shows here) --- */}
            <Route
              element={
                <Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              }
            >
              <Route path="/" element={<Landing />} />
              <Route path="/select-university" element={<SelectUniversity />} />
              <Route path="/select-course/:universityId" element={<SelectCourse />} />
              <Route path="/dashboard" element={<MainDasboard />} />
              <Route path="/dashboard/application/:id" element={<ApplicationDetails />} />
            </Route>

            {/* --- ADMIN LAYOUT (AdminSidebar shows here securely) --- */}
            <Route
              element={
                <AdminRoute
                  isAdminLoggedIn={isAdminLoggedIn}
                  setIsAdminLoggedIn={setIsAdminLoggedIn}
                />
              }
            >
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-dashboard/applications/:id" element={<StudentDetail />} />
            </Route>

            {/* --- AUTH & ONBOARDING ROUTES --- */}
            <Route 
              path="/auth" 
              element={
                <AuthPage 
                  setIsLoggedIn={setIsLoggedIn} 
                  setIsAdminLoggedIn={setIsAdminLoggedIn} 
                />
              } 
            />
            <Route path="/onboarding/personal-info" element={<PersonalInfo />} />
            <Route path="/onboarding/academic-details" element={<AcademicDetails />} />
            <Route path="/onboarding/guardian-data" element={<GuardianData />} />
            <Route path="/onboarding/final-review" element={<FinalReview />} />
            <Route path="/onboarding/success" element={<ConfirmationSuccess />} />
          </Routes>
        </BrowserRouter>
      </ApplicationsProvider>
    </OnboardingProvider>
  );
}