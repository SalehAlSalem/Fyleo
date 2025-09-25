// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getAuth,
} from "firebase/auth";
import {
    getFirestore,
} from "firebase/firestore";
import {
    getStorage,
} from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// Initialize Analytics only in browser and when measurement id is provided
let analytics;
if (typeof window !== 'undefined' && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
    try {
        analytics = getAnalytics(app);
    } catch (e) {
        // Analytics can fail if disabled in the environment; log and continue
        // eslint-disable-next-line no-console
        console.warn('Firebase analytics initialization failed:', e);
    }
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
    app,
    auth,
    db,
    storage,
    firebaseConfig
};
