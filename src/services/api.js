import axios from "axios";
import { INITIAL_USERS, INITIAL_APPLICATIONS } from "./seedData";

// Resolve API base URL. On production deployments (e.g. Vercel HTTPS),
// avoid calling http://localhost:5000 which would trigger browser mixed-content blocks.
const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
const configuredUrl =
    import.meta.env.VITE_API_URL;
const isRemoteConfigured = Boolean(configuredUrl && configuredUrl.trim());

// If on HTTPS and no remote API is explicitly configured, skip localhost calls directly
const isLocalhostOnly = !isRemoteConfigured && isHttps;

const API_BASE_URL = configuredUrl || "http://localhost:5000";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: isLocalhostOnly ? 800 : 3500,
});

// Storage keys
const STORAGE_KEYS = {
    APPLICATIONS: "app_applications_data",
    USERS: "app_users_data",
};

// Local storage persistent fallback engine
const storage = {
    getUsers: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.USERS);
            if (!data) {
                localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
                return INITIAL_USERS;
            }
            const parsed = JSON.parse(data);
            // Ensure initial demo/admin users are always accessible
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
            return INITIAL_USERS;
        } catch {
            return INITIAL_USERS;
        }
    },

    saveUsers: (users) => {
        try {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        } catch (e) {
            console.warn("Could not save users to localStorage:", e);
        }
    },

    getApplications: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
            if (!data) {
                localStorage.setItem(
                    STORAGE_KEYS.APPLICATIONS,
                    JSON.stringify(INITIAL_APPLICATIONS)
                );
                return INITIAL_APPLICATIONS;
            }
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
            localStorage.setItem(
                STORAGE_KEYS.APPLICATIONS,
                JSON.stringify(INITIAL_APPLICATIONS)
            );
            return INITIAL_APPLICATIONS;
        } catch {
            return INITIAL_APPLICATIONS;
        }
    },

    saveApplications: (apps) => {
        try {
            localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
        } catch (e) {
            console.warn("Could not save applications to localStorage:", e);
        }
    },
};

// Initialize seed data immediately on load if not present
if (typeof window !== "undefined") {
    storage.getUsers();
    storage.getApplications();
}

export const applicationsAPI = {
    // Fetch all applications
    getAll: async() => {
        if (!isLocalhostOnly) {
            try {
                const response = await apiClient.get("/applications");
                if (Array.isArray(response.data) && response.data.length > 0) {
                    storage.saveApplications(response.data);
                    return response.data;
                }
            } catch (error) {
                console.warn(
                    "JSON Server unreachable. Falling back to persistent browser store:",
                    error.message
                );
            }
        }
        return storage.getApplications();
    },

    // Fetch application by ID
    getById: async(id) => {
        if (!isLocalhostOnly) {
            try {
                const response = await apiClient.get(`/applications/${id}`);
                return response.data;
            } catch {
                // Fall through to local cache
            }
        }
        const apps = storage.getApplications();
        return apps.find((app) => String(app.id) === String(id)) || null;
    },

    // Create new application
    create: async(newApp) => {
        const apps = storage.getApplications();
        const appWithId = {
            id: newApp.id || `app-${Date.now()}`,
            submittedAt: new Date().toISOString(),
            ...newApp,
        };

        // Save locally first to guarantee zero data loss
        const updated = [appWithId, ...apps.filter((a) => String(a.id) !== String(appWithId.id))];
        storage.saveApplications(updated);

        // Sync to JSON Server if available
        if (!isLocalhostOnly) {
            try {
                const response = await apiClient.post("/applications", appWithId);
                return response.data;
            } catch (error) {
                console.warn("JSON Server sync skipped. Stored in browser database:", error.message);
            }
        }

        return appWithId;
    },

    // Update application status and notes (PATCH)
    updateStatus: async(id, newStatus, internalNotes = "") => {
        const apps = storage.getApplications();
        const updated = apps.map((app) => {
            if (String(app.id) === String(id)) {
                return {
                    ...app,
                    status: newStatus,
                    internalNotes: internalNotes !== undefined ? internalNotes : app.internalNotes,
                };
            }
            return app;
        });
        storage.saveApplications(updated);

        // Sync to JSON Server if available
        if (!isLocalhostOnly) {
            try {
                const patchData = { status: newStatus };
                if (internalNotes) patchData.internalNotes = internalNotes;
                const response = await apiClient.patch(`/applications/${id}`, patchData);
                return response.data;
            } catch {
                // Local update already succeeded
            }
        }

        const modified = updated.find((a) => String(a.id) === String(id));
        return modified || { id, status: newStatus, internalNotes };
    },

    // Delete application
    delete: async(id) => {
        const apps = storage.getApplications();
        const updated = apps.filter((app) => String(app.id) !== String(id));
        storage.saveApplications(updated);

        if (!isLocalhostOnly) {
            try {
                await apiClient.delete(`/applications/${id}`);
            } catch {
                // Local removal succeeded
            }
        }
        return true;
    },
};

export const usersAPI = {
    getAll: async() => {
        if (!isLocalhostOnly) {
            try {
                const response = await apiClient.get("/users");
                if (Array.isArray(response.data) && response.data.length > 0) {
                    storage.saveUsers(response.data);
                    return response.data;
                }
            } catch {
                // Fall through
            }
        }
        return storage.getUsers();
    },

    getByEmail: async(email) => {
        if (!email) return null;
        const cleanEmail = email.toLowerCase().trim();

        // Try server first if appropriate
        if (!isLocalhostOnly) {
            try {
                const response = await apiClient.get(`/users?email=${encodeURIComponent(cleanEmail)}`);
                if (Array.isArray(response.data) && response.data.length > 0) {
                    return response.data[0];
                }
            } catch {
                // Fall through to local store
            }
        }

        // Reliable fallback against local user store
        const users = storage.getUsers();
        return (
            users.find((u) => (u.email || "").toLowerCase().trim() === cleanEmail) ||
            null
        );
    },

    create: async(userData) => {
        const cleanEmail = userData.email.toLowerCase().trim();
        const users = storage.getUsers();

        // Check if user already exists
        const existing = users.find(
            (u) => (u.email || "").toLowerCase().trim() === cleanEmail
        );
        if (existing) {
            throw new Error("An account with this email address already exists. Please sign in.");
        }

        const newUser = {
            id: userData.id || `usr-${Date.now()}`,
            ...userData,
            email: cleanEmail,
            createdAt: new Date().toISOString(),
        };

        // Save to local store immediately
        const updatedUsers = [...users, newUser];
        storage.saveUsers(updatedUsers);

        // Sync to JSON Server in background if available
        if (!isLocalhostOnly) {
            try {
                const response = await apiClient.post("/users", newUser);
                return response.data;
            } catch (error) {
                console.warn(
                    "JSON Server unreachable. Account saved in local browser storage:",
                    error.message
                );
            }
        }

        return newUser;
    },

    // Verify credentials against real user records
    login: async(
        email,
        password,
        expectedRole = "applicant",
        expectedInstitution = ""
    ) => {
        const user = await usersAPI.getByEmail(email);

        if (!user) {
            return {
                success: false,
                error: "No account found with this email address. Please check your email or sign up.",
            };
        }

        if (user.password !== password) {
            return {
                success: false,
                error: "Incorrect password. Please verify your credentials and try again.",
            };
        }

        if (expectedRole && user.role && user.role.toLowerCase() !== expectedRole.toLowerCase()) {
            return {
                success: false,
                error: `Unauthorized access: This account is registered as an ${user.role}. Please switch to the ${user.role} sign in tab.`,
            };
        }

        if (expectedRole === "admin" && expectedInstitution) {
            const userInst = (user.institution || "").toLowerCase().trim();
            const reqInst = expectedInstitution.toLowerCase().trim();
            if (userInst && !reqInst.includes(userInst) && !userInst.includes(reqInst)) {
                return {
                    success: false,
                    error: `Institutional mismatch: Your credentials belong to ${user.institution}, not ${expectedInstitution}.`,
                };
            }
        }

        return {
            success: true,
            user,
        };
    },
};

export default apiClient;