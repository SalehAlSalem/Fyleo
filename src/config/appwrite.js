import { Client, Account, Databases, Storage, Teams, Query, ID, Permission, Role } from 'appwrite';

// Appwrite Configuration - النطاق الرسمي الوحيد المعتمد
const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_URL || 'https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || 'fyleo-project');

export { client }; // Export client for Realtime subscriptions
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const teams = new Teams(client);
// Note: Users API is server-only, use Appwrite Functions for user management

// Configuration IDs
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'fyleo-database';
export const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID || 'users';
export const FILES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_FILES_COLLECTION_ID || 'materials';
export const MATERIALS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_MATERIALS_COLLECTION_ID || FILES_COLLECTION_ID;
export const BOOKMARKS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_BOOKMARKS_COLLECTION_ID || 'bookmarks';
export const DOWNLOADS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_DOWNLOADS_COLLECTION_ID || 'downloads';
export const PROFILES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID || 'user_profiles';
export const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID || 'files';

// New Collections for Hierarchical System
export const CATEGORIES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CATEGORIES_COLLECTION_ID || 'categories';
export const SUBJECTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SUBJECTS_COLLECTION_ID || 'subjects';
export const FILE_TYPES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_FILE_TYPES_COLLECTION_ID || 'fileTypes';
export const POSTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID || 'posts';
export const EDUCATIONAL_PURPOSES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_EDUCATIONAL_PURPOSES_COLLECTION_ID || 'educationalPurposes';

// OAuth Providers - using string constants
export const OAuthProvider = {
    Google: 'google',
    GitHub: 'github',
    Facebook: 'facebook'
};

export { Query, ID, Permission, Role };
export default client;