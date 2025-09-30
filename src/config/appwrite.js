import { Client, Account, Databases, Storage, Query, ID } from 'appwrite';

// Appwrite Configuration - النطاق الرسمي الوحيد المعتمد
const client = new Client()
    .setEndpoint('https://fyleo.appwrite.network/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '';
export const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID || '';
export const MATERIALS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_MATERIALS_COLLECTION_ID || '';
export const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID || '';

export { Query, ID };
export default client;