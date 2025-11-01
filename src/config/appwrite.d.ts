// Type declarations for src/config/appwrite.js
// Minimal, pragmatic typings to satisfy TS usage in TS files

export const account: any;
export const databases: any;
export const storage: any;

export const DATABASE_ID: string;
export const USERS_COLLECTION_ID: string;
export const FILES_COLLECTION_ID: string;
export const MATERIALS_COLLECTION_ID: string;
export const BOOKMARKS_COLLECTION_ID: string;
export const DOWNLOADS_COLLECTION_ID: string;
export const PROFILES_COLLECTION_ID: string;
export const STORAGE_BUCKET_ID: string;

export const CATEGORIES_COLLECTION_ID: string;
export const SUBJECTS_COLLECTION_ID: string;
export const FILE_TYPES_COLLECTION_ID: string;
export const POSTS_COLLECTION_ID: string;
export const EDUCATIONAL_PURPOSES_COLLECTION_ID: string;

export const OAuthProvider: {
  Google: string;
  GitHub: string;
  Facebook: string;
};

export const Query: any;
export const ID: any;
export const Permission: any;
export const Role: any;

declare const client: any;
export default client;
