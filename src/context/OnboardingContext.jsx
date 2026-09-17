import React, { createContext, useContext, useState } from "react";

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    
    fullName: "",
    dob: "",
    citizenship: "Nigeria",
    contactEmail: "",
    phoneNumber: "",
    homeAddress: "",
    
    secondarySchool: "",
    graduationYear: "",
    jambScore: "",
    olevelResults: [],
    
    guardianName: "",
    relationship: "",
    guardianEmail: "",
    guardianPhone: "",
    guardianAddress: "",
    state: "",
    lga: "",
    employer: "",
    nin: "",
  });

  const updateFormData = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  return (
    <OnboardingContext.Provider value={{ formData, updateFormData }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);