import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
} from "firebase/firestore";
import { db } from "./firebase";
import { INITIAL_USERS, INITIAL_APPLICATIONS } from "./seedData";

let isUsersSeeded = false;
let isAppsSeeded = false;

export const firestoreService = {
    // Seed initial users & applications if Firestore collection is completely empty
    seedInitialDataIfEmpty: async() => {
        try {
            if (!isUsersSeeded) {
                const usersSnap = await getDocs(collection(db, "users"));
                if (usersSnap.empty) {
                    for (const u of INITIAL_USERS) {
                        await setDoc(doc(db, "users", u.id), u);
                    }
                }
                isUsersSeeded = true;
            }

            if (!isAppsSeeded) {
                const appsSnap = await getDocs(collection(db, "applications"));
                if (appsSnap.empty) {
                    for (const app of INITIAL_APPLICATIONS) {
                        await setDoc(doc(db, "applications", String(app.id)), app);
                    }
                }
                isAppsSeeded = true;
            }
        } catch (err) {
            console.warn("Firestore auto-seed notice:", err.message);
        }
    },

    // Applications API
    getApplications: async() => {
        await firestoreService.seedInitialDataIfEmpty();
        const snap = await getDocs(collection(db, "applications"));
        const list = [];
        snap.forEach((d) => list.push(d.data()));
        return list;
    },

    getApplicationById: async(id) => {
        const d = await getDoc(doc(db, "applications", String(id)));
        return d.exists() ? d.data() : null;
    },

    saveApplication: async(app) => {
        const id = String(app.id || `app-${Date.now()}`);
        const data = {...app, id };
        await setDoc(doc(db, "applications", id), data);
        return data;
    },

    updateApplicationStatus: async(id, status, internalNotes) => {
        const ref = doc(db, "applications", String(id));
        const patch = { status };
        if (internalNotes !== undefined) patch.internalNotes = internalNotes;
        await updateDoc(ref, patch);
        const updated = await getDoc(ref);
        return updated.exists() ? updated.data() : { id, ...patch };
    },

    deleteApplication: async(id) => {
        await deleteDoc(doc(db, "applications", String(id)));
        return true;
    },

    // Users API
    getUserByEmail: async(email) => {
        await firestoreService.seedInitialDataIfEmpty();
        const cleanEmail = email.toLowerCase().trim();
        const q = query(collection(db, "users"), where("email", "==", cleanEmail));
        const snap = await getDocs(q);
        if (!snap.empty) {
            return snap.docs[0].data();
        }
        return null;
    },

    getAllUsers: async() => {
        await firestoreService.seedInitialDataIfEmpty();
        const snap = await getDocs(collection(db, "users"));
        const list = [];
        snap.forEach((d) => list.push(d.data()));
        return list;
    },

    createUser: async(userData) => {
        const cleanEmail = userData.email.toLowerCase().trim();
        const existing = await firestoreService.getUserByEmail(cleanEmail);
        if (existing) {
            throw new Error("An account with this email address already exists. Please sign in.");
        }

        const newUser = {
            id: userData.id || `usr-${Date.now()}`,
            ...userData,
            email: cleanEmail,
            createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "users", newUser.id), newUser);
        return newUser;
    },
};