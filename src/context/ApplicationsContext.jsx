import { createContext, useContext, useState, useEffect } from "react";
import { applicationsAPI } from "../services/api";

const ApplicationsContext = createContext();

export const ApplicationsProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load applications from JSON Server asynchronously
  useEffect(() => {
    let isMounted = true;

    applicationsAPI
      .getAll()
      .then((data) => {
        if (isMounted) {
          const list = Array.isArray(data) ? data : [];
          const sorted = [...list].sort((a, b) => {
            const timeA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
            const timeB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
            if (timeB !== timeA) return timeB - timeA;
            return String(b.id).localeCompare(String(a.id));
          });
          setApplications(sorted);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Failed to fetch applications from server:", err);
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshApplications = async () => {
    try {
      const data = await applicationsAPI.getAll();
      const list = Array.isArray(data) ? data : [];
      const sorted = [...list].sort((a, b) => {
        const timeA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        const timeB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
        if (timeB !== timeA) return timeB - timeA;
        return String(b.id).localeCompare(String(a.id));
      });
      setApplications(sorted);
      setError(null);
    } catch (err) {
      console.error("Failed to refresh applications from server:", err);
      setError(err.message);
    }
  };

  // Create new application via POST to JSON Server
  const addApplication = async (newApplicant) => {
    const formattedEntry = {
      id: newApplicant.id || String(Math.floor(100000 + Math.random() * 900000)),
      status: "Pending",
      score: "88% Moderate",
      submittedAt: new Date().toISOString(),
      ...newApplicant,
    };

    // Optimistically update context state immediately for responsive UI
    setApplications((prev) => [
      formattedEntry,
      ...prev.filter((a) => String(a.id) !== String(formattedEntry.id)),
    ]);

    try {
      const saved = await applicationsAPI.create(formattedEntry);
      setApplications((prev) =>
        prev.map((app) =>
          String(app.id) === String(formattedEntry.id) ? { ...app, ...saved } : app
        )
      );
      return saved;
    } catch (err) {
      console.error("Error creating application on JSON Server:", err);
      return formattedEntry;
    }
  };

  // Update status via PATCH to JSON Server
  const updateStatus = async (id, newStatus, notes = "") => {
    // Optimistically update UI
    setApplications((prev) =>
      prev.map((app) =>
        String(app.id) === String(id)
          ? { ...app, status: newStatus, internalNotes: notes || app.internalNotes }
          : app
      )
    );

    try {
      await applicationsAPI.updateStatus(id, newStatus, notes);
    } catch (err) {
      console.error(`Error updating status for application ${id}:`, err);
    }
  };

  return (
    <ApplicationsContext.Provider
      value={{
        applications,
        loading,
        error,
        addApplication,
        updateStatus,
        refreshApplications,
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApplications = () => {
  const context = useContext(ApplicationsContext);
  if (!context) {
    throw new Error("useApplications must be used within an ApplicationsProvider");
  }
  return context;
};