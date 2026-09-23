import { createContext, useContext, useState, useEffect } from "react";

const OnboardingContext = createContext();

export function OnboardingProvider({ children }) {
  const [formData, setFormData] = useState(() => {
    try {
      const savedData = localStorage.getItem("onboarding_form_data");
      return savedData ? JSON.parse(savedData) : {};
    } catch (error) {
      console.error("Failed to load form data from localStorage", error);
      return {};
    }
  });

  //  Automatically save to localStorage whenever formData changes
  useEffect(() => {
    try {
      localStorage.setItem("onboarding_form_data", JSON.stringify(formData));
    } catch (error) {
      console.error("Failed to save form data to localStorage", error);
    }
  }, [formData]);

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  // Clear draft form data after final submission so a new application starts fresh
  const clearFormData = () => {
    setFormData({});
    try {
      localStorage.removeItem("onboarding_form_data");
    } catch (error) {
      console.error("Failed to clear onboarding_form_data", error);
    }
  };

  return (
    <OnboardingContext.Provider value={{ formData, updateFormData, setFormData, clearFormData }}>
      {children}
    </OnboardingContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOnboarding() {
  return useContext(OnboardingContext);
}