import axios from "axios";
import { INITIAL_USERS, INITIAL_APPLICATIONS } from "./seedData";
import { firestoreService } from "./firestoreService";

const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");

const API_BASE_URL = "http://localhost:5000";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 2000,
});

const STORAGE_KEYS = {
    APPLICATIONS: "app_applications_data",
    USERS: "app_users_data",
};

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
                let needsUpdate = false;
                const merged = [...parsed];
                INITIAL_USERS.forEach((seedUser) => {
                    const exists = merged.some(
                        (u) => (u.email || "").toLowerCase() === seedUser.email.toLowerCase()
                    );
                    if (!exists) {
                        merged.push(seedUser);
                        needsUpdate = true;
                    }
                });
                if (needsUpdate) {
                    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(merged));
                }
                return merged;
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

        // Cloud / Vercel: Firebase Firestore is the permanent real-time database
        try {
            const firestoreApps = await firestoreService.getApplications();
            if (Array.isArray(firestoreApps) && firestoreApps.length > 0) {
                storage.saveApplications(firestoreApps);
                return firestoreApps;
            }
        } catch (err) {
            console.warn("Firestore fetch error, falling back to local store:", err.message);
        }

        // Fallback to local storage
        return storage.getApplications();
    },



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



    getByEmail: async(email) => {
        if (!email) return [];
        const cleanEmail = email.toLowerCase().trim();
        const originalTrimmed = email.trim();
        const emailsToQuery = Array.from(new Set([cleanEmail, originalTrimmed]));

        if (isLocalhost) {
            try {
                const requests = [];
                for (const em of emailsToQuery) {
                    requests.push(apiClient.get(`/applications?email=${encodeURIComponent(em)}`));
                    requests.push(apiClient.get(`/applications?contactEmail=${encodeURIComponent(em)}`));
                }
                const responses = await Promise.all(requests);
                const map = new Map();
                for (const res of responses) {
                    if (Array.isArray(res.data)) {
                        res.data.forEach((app) => map.set(String(app.id), app));
                    }
                }
                const results = Array.from(map.values());
                if (results.length > 0) {
                    return results;
                }
            } catch (err) {
                console.warn("Local JSON server email filter notice:", err.message);
            }
        }


        const localApps = storage.getApplications();
        const filteredLocal = localApps.filter((app) => {
            const appEmail = (app.email || app.contactEmail || "").toLowerCase().trim();
            return appEmail === cleanEmail;
        });
        if (filteredLocal.length > 0) return filteredLocal;

        try {
            const firestoreApps = await Promise.race([
                firestoreService.getApplicationsByEmail(cleanEmail),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Firestore timeout")), 1500)
                ),
            ]);
            if (Array.isArray(firestoreApps) && firestoreApps.length > 0) {
                return firestoreApps;
            }
        } catch {
            // Fall through
        }

        return filteredLocal;
    },

    // Create new application
    create: async(newApp) => {
        const appWithId = {
            id: newApp.id || `app-${Date.now()}`,
            submittedAt: new Date().toISOString(),
            ...newApp,
        };

        if (isLocalhost) {
            try {
                await apiClient.post("/applications", appWithId);
            } catch (e) {
                console.warn("Local JSON Server sync skipped:", e.message);
            }
        }

        firestoreService.saveApplication(appWithId).catch((e) => {
            console.warn("Firestore save notice:", e.message);
        });

        const apps = storage.getApplications();
        const updated = [appWithId, ...apps.filter((a) => String(a.id) !== String(appWithId.id))];
        storage.saveApplications(updated);

        return appWithId;
    },

    // Update application status and notes (PATCH)
    updateStatus: async(id, newStatus, internalNotes = "") => {
        if (isLocalhost) {
            try {
                const patchData = { status: newStatus };
                if (internalNotes) patchData.internalNotes = internalNotes;
                await apiClient.patch(`/applications/${id}`, patchData);
            } catch {
                // Fall through
            }
        }

        // Fire-and-forget sync to Firebase Firestore
        firestoreService.updateApplicationStatus(id, newStatus, internalNotes).catch((e) => {
            console.warn("Firestore status update notice:", e.message);
        });

        // Update local cache
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

        // 1. If on localhost, check JSON Server first (fast local database)
        if (isLocalhost) {
            try {
                const response = await apiClient.get(`/users?email=${encodeURIComponent(cleanEmail)}`);
                if (Array.isArray(response.data)) {
                    if (response.data.length > 0) {
                        return response.data[0];
                    }
                    // JSON Server is authoritative locally and confirmed 0 matching users
                    const localUsers = storage.getUsers();
                    const localMatch = localUsers.find(
                        (u) => (u.email || "").toLowerCase().trim() === cleanEmail
                    );
                    return localMatch || null;
                }
            } catch {
                // Fall through if local JSON Server is offline
            }
        }

        // 2. Check local storage cache
        const localUsers = storage.getUsers();
        const localMatch = localUsers.find(
            (u) => (u.email || "").toLowerCase().trim() === cleanEmail
        );
        if (localMatch) return localMatch;

        // 3. Check Firebase Firestore with 1.5-second timeout (for remote / Vercel cloud)
        try {
            const firestoreUser = await Promise.race([
                firestoreService.getUserByEmail(cleanEmail),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Firestore timeout")), 1500)
                ),
            ]);
            if (firestoreUser) {
                return firestoreUser;
            }
        } catch {
            // Fall through
        }

        return null;
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

        // Sync to JSON Server if on localhost
        if (isLocalhost) {
            try {
                await apiClient.post("/users", newUser);
            } catch (error) {
                console.warn("JSON Server user sync notice:", error.message);
            }
        }

        // Fire-and-forget sync to Firebase Firestore (non-blocking)
        firestoreService.createUser(newUser).catch((error) => {
            console.warn("Firestore user sync notice:", error.message);
        });

        // Save to local storage
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
            const isSuperAdminOnAdminTab =
                expectedRole.toLowerCase() === "admin" &&
                user.role.toLowerCase() === "superadmin";

            if (!isSuperAdminOnAdminTab) {
                return {
                    success: false,
                    error: `Unauthorized access: This account is registered as an ${user.role}. Please switch to the ${user.role} sign in tab.`,
                };
            }
        }

        if (expectedRole === "admin" && expectedInstitution) {
            // Superadmin has global platform audit access and is not restricted to a single university
            if (user.role && user.role.toLowerCase() === "superadmin") {
                // Permitted platform-wide access
            } else {
                const userInst = (user.institution || "").toLowerCase().trim();
                const reqInst = expectedInstitution.toLowerCase().trim();
                if (userInst && !reqInst.includes(userInst) && !userInst.includes(reqInst)) {
                    return {
                        success: false,
                        error: `Institutional mismatch: Your credentials belong to ${user.institution}, not ${expectedInstitution}.`,
                    };
                }
            }
        }

        return {
            success: true,
            user,
        };
    },
};