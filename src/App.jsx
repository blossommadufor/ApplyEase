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
import AdminCourses from "./pages/AdminCourses";
import StudentDetail from "./pages/StudentDetail";
import Contact from "./pages/Contact";

// Protected Route Guard for Admin
function AdminRoute({ isAdminLoggedIn, setIsAdminLoggedIn }) {
  const hasAdmin =
    isAdminLoggedIn || sessionStorage.getItem("isAdminLoggedIn") === "true";
  return hasAdmin ? (
    <AdminLayout setIsAdminLoggedIn={setIsAdminLoggedIn} />
  ) : (
    <Navigate to="/auth" replace />
  );
}

// Protected Route Guard for Applicants
function UserRoute({ isLoggedIn, children }) {
  const hasAuth =
    isLoggedIn || sessionStorage.getItem("isLoggedIn") === "true";
  return hasAuth ? children : <Navigate to="/auth?mode=signin" replace />;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("isLoggedIn") === "true";
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem("isAdminLoggedIn") === "true";
  });

  // Clean up legacy localStorage auth keys from previous versions
  useEffect(() => {
    const legacyKeys = [
      "isLoggedIn",
      "isAdminLoggedIn",
      "currentUser",
      "user",
      "userRole",
      "adminInstitution",
    ];
    legacyKeys.forEach((key) => localStorage.removeItem(key));
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      sessionStorage.setItem("isLoggedIn", "true");
    } else {
      sessionStorage.removeItem("isLoggedIn");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isAdminLoggedIn) {
      sessionStorage.setItem("isAdminLoggedIn", "true");
    } else {
      sessionStorage.removeItem("isAdminLoggedIn");
    }
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
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/select-university"
                element={
                  <UserRoute isLoggedIn={isLoggedIn}>
                    <SelectUniversity />
                  </UserRoute>
                }
              />
              <Route
                path="/select-course/:universityId"
                element={
                  <UserRoute isLoggedIn={isLoggedIn}>
                    <SelectCourse />
                  </UserRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <UserRoute isLoggedIn={isLoggedIn}>
                    <MainDasboard />
                  </UserRoute>
                }
              />
              <Route
                path="/dashboard/application/:id"
                element={
                  <UserRoute isLoggedIn={isLoggedIn}>
                    <ApplicationDetails />
                  </UserRoute>
                }
              />
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
              <Route path="/admin-dashboard/courses" element={<AdminCourses />} />
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
            <Route
              path="/onboarding/personal-info"
              element={
                <UserRoute isLoggedIn={isLoggedIn}>
                  <PersonalInfo />
                </UserRoute>
              }
            />
            <Route
              path="/onboarding/academic-details"
              element={
                <UserRoute isLoggedIn={isLoggedIn}>
                  <AcademicDetails />
                </UserRoute>
              }
            />
            <Route
              path="/onboarding/guardian-data"
              element={
                <UserRoute isLoggedIn={isLoggedIn}>
                  <GuardianData />
                </UserRoute>
              }
            />
            <Route
              path="/onboarding/final-review"
              element={
                <UserRoute isLoggedIn={isLoggedIn}>
                  <FinalReview />
                </UserRoute>
              }
            />
            <Route
              path="/onboarding/success"
              element={
                <UserRoute isLoggedIn={isLoggedIn}>
                  <ConfirmationSuccess />
                </UserRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ApplicationsProvider>
    </OnboardingProvider>
  );
}