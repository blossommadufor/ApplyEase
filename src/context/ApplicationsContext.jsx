// src/context/ApplicationsContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const ApplicationsContext = createContext();

export const ApplicationsProvider = ({ children }) => {
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem("userApplications");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("userApplications", JSON.stringify(applications));
  }, [applications]);

  const addApplication = (universityName, courseName) => {
    const newApp = {
      id: `app-${Date.now()}`,
      university: universityName,
      course: courseName,
      status: "In Progress",
      progress: 25,
      appliedDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      applicationId: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setApplications((prev) => [newApp, ...prev]);
  };

  return (
    <ApplicationsContext.Provider value={{ applications, addApplication }}>
      {children}
    </ApplicationsContext.Provider>
  );
};

export const useApplications = () => useContext(ApplicationsContext);