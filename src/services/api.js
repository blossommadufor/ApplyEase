import axios from "axios";
import { INITIAL_USERS, INITIAL_APPLICATIONS } from "./seedData";
import { firestoreService } from "./firestoreService";

// Detection: Are we running locally or in cloud production (e.g. Vercel)?
const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");

// Local JSON Server endpoint for local development
const API_BASE_URL = "http://localhost:5000";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 2000,
});

// Storage keys for browser-level backup
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

// Preload initial seed data
if (typeof window !== "undefined") {
    storage.getUsers();
    storage.getApplications();
}

export const applicationsAPI = {
    // Fetch all applications
    getAll: async() => {
        // 1. When on localhost, JSON Server is the primary source
        if (isLocalhost) {
            try {
                const response = await apiClient.get("/applications");
                if (Array.isArray(response.data) && response.data.length > 0) {
                    storage.saveApplications(response.data);
                    return response.data;
                }
            } catch (err) {
                console.warn("Local JSON Server not responding, checking cloud Firestore:", err.message);
            }
        }

        // 2. Cloud / Vercel: Firebase Firestore is the permanent real-time database
        try {
            const firestoreApps = await firestoreService.getApplications();
            if (Array.isArray(firestoreApps) && firestoreApps.length > 0) {
                storage.saveApplications(firestoreApps);
                return firestoreApps;
            }
        } catch (err) {
            console.warn("Firestore fetch error, falling back to local store:", err.message);
        }

        // 3. Fallback to local storage
        return storage.getApplications();
    },

    // Fetch application by ID
    getById: async(id) => {
        if (isLocalhost) {
            try {
                const response = await apiClient.get(`/applications/${id}`);
                if (response.data) return response.data;
            } catch {
                // Fall through to Firestore
            }
        }

        try {
            const firestoreDoc = await firestoreService.getApplicationById(id);
            if (firestoreDoc) return firestoreDoc;
        } catch {
            // Fall through
        }

        const apps = storage.getApplications();
        return apps.find((app) => String(app.id) === String(id)) || null;
    },

    // Create new application
    create: async(newApp) => {
        const appWithId = {
            id: newApp.id || `app-${Date.now()}`,
            submittedAt: new Date().toISOString(),
            ...newApp,
        };

        // 1. Sync to local JSON Server if running locally
        if (isLocalhost) {
            try {
                await apiClient.post("/applications", appWithId);
            } catch (e) {
                console.warn("Local JSON Server sync skipped:", e.message);
            }
        }

        // 2. Save to Firebase Firestore (permanent cloud persistence)
        try {
            await firestoreService.saveApplication(appWithId);
        } catch (e) {
            console.warn("Firestore save notice:", e.message);
        }

        // 3. Keep in browser cache
        const apps = storage.getApplications();
        const updated = [appWithId, ...apps.filter((a) => String(a.id) !== String(appWithId.id))];
        storage.saveApplications(updated);

        return appWithId;
    },

    // Update application status and notes (PATCH)
    updateStatus: async(id, newStatus, internalNotes = "") => {
        // 1. Sync to JSON Server locally
        if (isLocalhost) {
            try {
                const patchData = { status: newStatus };
                if (internalNotes) patchData.internalNotes = internalNotes;
                await apiClient.patch(`/applications/${id}`, patchData);
            } catch {
                // Fall through
            }
        }

        // 2. Sync to Firebase Firestore
        try {
            await firestoreService.updateApplicationStatus(id, newStatus, internalNotes);
        } catch (e) {
            console.warn("Firestore status update notice:", e.message);
        }

        // 3. Update local cache
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

        const modified = updated.find((a) => String(a.id) === String(id));
        return modified || { id, status: newStatus, internalNotes };
    },

    // Delete application
    delete: async(id) => {
        if (isLocalhost) {
            try {
                await apiClient.delete(`/applications/${id}`);
            } catch {
                // Fall through
            }
        }

        try {
            await firestoreService.deleteApplication(id);
        } catch (e) {
            console.warn("Firestore delete notice:", e.message);
        }

        const apps = storage.getApplications();
        const updated = apps.filter((app) => String(app.id) !== String(id));
        storage.saveApplications(updated);
        return true;
    },
};

export const usersAPI = {
    // Get all users
    getAll: async() => {
        if (isLocalhost) {
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

        try {
            const firestoreUsers = await firestoreService.getAllUsers();
            if (Array.isArray(firestoreUsers) && firestoreUsers.length > 0) {
                storage.saveUsers(firestoreUsers);
                return firestoreUsers;
            }
        } catch {
            // Fall through
        }

        return storage.getUsers();
    },

    // Find user by email
    getByEmail: async(email) => {
        if (!email) return null;
        const cleanEmail = email.toLowerCase().trim();

        // 1. If on localhost, check JSON Server first
        if (isLocalhost) {
            try {
                const response = await apiClient.get(`/users?email=${encodeURIComponent(cleanEmail)}`);
                if (Array.isArray(response.data) && response.data.length > 0) {
                    return response.data[0];
                }
            } catch {
                // Fall through
            }
        }

        // 2. Check Firebase Firestore
        try {
            const firestoreUser = await firestoreService.getUserByEmail(cleanEmail);
            if (firestoreUser) {
                return firestoreUser;
            }
        } catch {
            // Fall through
        }

        // 3. Fallback to local store
        const users = storage.getUsers();
        return (
            users.find((u) => (u.email || "").toLowerCase().trim() === cleanEmail) ||
            null
        );
    },

    // Register a new user
    create: async(userData) => {
        const cleanEmail = userData.email.toLowerCase().trim();

        // Check if user already exists anywhere
        const existing = await usersAPI.getByEmail(cleanEmail);
        if (existing) {
            throw new Error("An account with this email address already exists. Please sign in.");
        }

        const newUser = {
            id: userData.id || `usr-${Date.now()}`,
            ...userData,
            email: cleanEmail,
            createdAt: new Date().toISOString(),
        };

        // 1. Sync to JSON Server if on localhost
        if (isLocalhost) {
            try {
                await apiClient.post("/users", newUser);
            } catch (error) {
                console.warn("JSON Server user sync notice:", error.message);
            }
        }

        // 2. Save to Firebase Firestore (permanent cloud persistence)
        try {
            await firestoreService.createUser(newUser);
        } catch (error) {
            console.warn("Firestore user sync notice:", error.message);
        }

        // 3. Save to local storage
        const users = storage.getUsers();
        const updatedUsers = [...users, newUser];
        storage.saveUsers(updatedUsers);

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