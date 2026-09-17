import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
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
import { ApplicationDetails } from "./pages/ApplicationDetails"; // <-- ADD THIS IMPORT

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <OnboardingProvider>
      <ApplicationsProvider>
        <BrowserRouter>
          <Routes>
            <Route
              element={
                <Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              }
            >
              <Route path="/" element={<Landing />} />
              <Route path="/select-university" element={<SelectUniversity />} />

              <Route
                path="/select-course/:universityId"
                element={<SelectCourse />}
              />
              <Route path="/dashboard" element={<MainDasboard />} />
              
              {/* Dynamic route to view status & admission progress */}
              <Route 
                path="/dashboard/application/:id" 
                element={<ApplicationDetails />} 
              />
            </Route>

            <Route
              path="/auth"
              element={<AuthPage setIsLoggedIn={setIsLoggedIn} />}
            />

            <Route
              path="/onboarding/personal-info"
              element={<PersonalInfo />}
            />
            <Route
              path="/onboarding/academic-details"
              element={<AcademicDetails />}
            />
            <Route
              path="/onboarding/guardian-data"
              element={<GuardianData />}
            />
            <Route path="/onboarding/final-review" element={<FinalReview />} />
            <Route
              path="/onboarding/success"
              element={<ConfirmationSuccess />}
            />
          </Routes>
        </BrowserRouter>
      </ApplicationsProvider>
    </OnboardingProvider>
  );
}