// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getAuth,
} from "firebase/auth";
import {
    getFirestore,
} from "firebase/firestore";

// تحقق من وجود المتغيرات المطلوبة
const hasRequiredConfig = import.meta.env.VITE_FIREBASE_API_KEY && 
                         import.meta.env.VITE_FIREBASE_AUTH_DOMAIN && 
                         import.meta.env.VITE_FIREBASE_PROJECT_ID;

if (!hasRequiredConfig && typeof window !== 'undefined') {
    console.warn('⚠️ Firebase: Missing required environment variables. Some features may not work.');
}

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:demo",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app;
try {
    app = initializeApp(firebaseConfig);
    if (typeof window !== 'undefined') {
        console.log('✅ Firebase: App initialized successfully');
    }
} catch (error) {
    console.error('❌ Firebase: Initialization failed:', error);
    // في بيئة الإنتاج، ننشئ app وهمي لمنع الأخطاء
    if (typeof window !== 'undefined') {
        console.warn('🚨 Running in fallback mode - some features may not work');
    }
    app = null;
}

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

let auth, db; // تمت إزالة التخزين Firebase Storage

if (app) {
    try {
        auth = getAuth(app);
        db = getFirestore(app);
    // لا نستخدم Firebase Storage في هذا المشروع (استبدل بنظام هجين GitHub + Supabase)
    } catch (error) {
        console.error('❌ Firebase: Service initialization failed:', error);
        auth = null;
        db = null;
    }
} else {
    // Fallback للوضع التجريبي
    auth = null;
    db = null;
    // storage غير مستخدم
}

export {
    app,
    auth,
    db,
    firebaseConfig
};
