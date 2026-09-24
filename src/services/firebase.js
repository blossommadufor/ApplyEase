import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA92LTu35_rOwRFyG5VIMnWAOemt6KAue0",
    authDomain: "applynow-ca036.firebaseapp.com",
    projectId: "applynow-ca036",
    storageBucket: "applynow-ca036.firebasestorage.app",
    messagingSenderId: "778467885831",
    appId: "1:778467885831:web:2199047cb5c3d5fa06fba2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;