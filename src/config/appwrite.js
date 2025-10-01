import { Client, Account, Databases, Storage, Query, ID, Permission, Role } from 'appwrite';

// Appwrite Configuration - النطاق الرسمي الوحيد المعتمد
const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_URL || 'https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || 'fyleo-project');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// تصدير Permission و Role للاستخدام في الملفات الأخرى
export { Permission, Role };

// Configuration IDs
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'fyleo-database';
export const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID || 'users';
export const FILES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_FILES_COLLECTION_ID || 'materials';
export const MATERIALS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_FILES_COLLECTION_ID || 'materials'; // نفس FILES
export const BOOKMARKS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_BOOKMARKS_COLLECTION_ID || 'bookmarks';
export const DOWNLOADS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_DOWNLOADS_COLLECTION_ID || 'downloads';
export const PROFILES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID || 'user_profiles';
export const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID || 'files';

// New Collections for Hierarchical System
export const CATEGORIES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CATEGORIES_COLLECTION_ID || 'categories';
export const SUBJECTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SUBJECTS_COLLECTION_ID || 'subjects';
export const FILE_TYPES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_FILE_TYPES_COLLECTION_ID || 'fileTypes';

// OAuth Providers - using string constants
export const OAuthProvider = {
    Google: 'google',
    GitHub: 'github',
    Facebook: 'facebook'
};

export { Query, ID };
export default client;