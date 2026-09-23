import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
});

// Cache for offline/disconnected resilience
const localCache = {
    getApplications: () => {
        try {
            const data = localStorage.getItem("app_applications_data");
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },
    saveApplications: (apps) => {
        try {
            localStorage.setItem("app_applications_data", JSON.stringify(apps));
        } catch (e) {
            console.warn("Could not cache to localStorage", e);
        }
    },
};

export const applicationsAPI = {
    // Fetch all applications
    getAll: async() => {
        try {
            const response = await apiClient.get("/applications");
            localCache.saveApplications(response.data);
            return response.data;
        } catch (error) {
            console.warn(
                "JSON Server not reachable at " + API_BASE_URL + ". Using cached applications.",
                error.message
            );
            return localCache.getApplications();
        }
    },

    // Fetch application by ID
    getById: async(id) => {
        try {
            const response = await apiClient.get(`/applications/${id}`);
            return response.data;
        } catch (error) {
            console.warn(`Could not fetch application ${id} from server:`, error.message);
            const cached = localCache.getApplications();
            return cached.find((app) => String(app.id) === String(id)) || null;
        }
    },

    // Create new application (POST)
    create: async(newApp) => {
        try {
            const response = await apiClient.post("/applications", newApp);
            const current = localCache.getApplications();
            localCache.saveApplications([response.data, ...current]);
            return response.data;
        } catch (error) {
            console.warn(
                "Could not save application to JSON Server. Storing in local cache:",
                error.message
            );
            const current = localCache.getApplications();
            const updated = [newApp, ...current];
            localCache.saveApplications(updated);
            return newApp;
        }
    },

    // Update application status and notes (PATCH)
    updateStatus: async(id, newStatus, internalNotes = "") => {
        try {
            const patchData = { status: newStatus };
            if (internalNotes) {
                patchData.internalNotes = internalNotes;
            }
            const response = await apiClient.patch(`/applications/${id}`, patchData);
            const current = localCache.getApplications();
            const updated = current.map((app) =>
                String(app.id) === String(id) ? {...app, ...response.data } : app
            );
            localCache.saveApplications(updated);
            return response.data;
        } catch (error) {
            console.warn(
                `Could not patch status for ${id} on JSON Server. Updating local cache:`,
                error.message
            );
            const current = localCache.getApplications();
            const updated = current.map((app) =>
                String(app.id) === String(id) ? {...app, status: newStatus, internalNotes } : app
            );
            localCache.saveApplications(updated);
            return { id, status: newStatus, internalNotes };
        }
    },

    // Delete application
    delete: async(id) => {
        try {
            await apiClient.delete(`/applications/${id}`);
            const current = localCache.getApplications();
            const updated = current.filter((app) => String(app.id) !== String(id));
            localCache.saveApplications(updated);
            return true;
        } catch (error) {
            console.warn(`Could not delete application ${id} on server:`, error.message);
            return false;
        }
    },
};

export const usersAPI = {
    getAll: async() => {
        try {
            const response = await apiClient.get("/users");
            return response.data;
        } catch (error) {
            console.warn("Could not fetch users from JSON Server:", error.message);
            return [];
        }
    },

    getByEmail: async(email) => {
        if (!email) return null;
        const cleanEmail = email.toLowerCase().trim();
        try {
            const response = await apiClient.get(`/users?email=${encodeURIComponent(cleanEmail)}`);
            if (Array.isArray(response.data) && response.data.length > 0) {
                return response.data[0];
            }
            // Case-insensitive fallback
            const allResponse = await apiClient.get("/users");
            if (Array.isArray(allResponse.data)) {
                return allResponse.data.find(
                    (u) => (u.email || "").toLowerCase().trim() === cleanEmail
                ) || null;
            }
            return null;
        } catch (error) {
            console.warn("Could not query user by email from JSON Server:", error.message);
            return null;
        }
    },

    create: async(userData) => {
        try {
            const cleanEmail = userData.email.toLowerCase().trim();
            const newUser = {
                id: userData.id || `usr-${Date.now()}`,
                ...userData,
                email: cleanEmail,
                createdAt: new Date().toISOString(),
            };
            const response = await apiClient.post("/users", newUser);
            return response.data;
        } catch (error) {
            console.warn("Could not create user on JSON Server:", error.message);
            throw error;
        }
    },

    // Verify credentials against real user records in JSON Server
    login: async(email, password, expectedRole = "applicant", expectedInstitution = "") => {
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