/**
 * IndexedDB Cache Manager
 * Persistent local storage for static data (Tier 1)
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

const DB_NAME = 'fyleo-cache';
const DB_VERSION = 1;
const CACHE_VERSION = 'v1.0.0';

interface FyleoDB extends DBSchema {
  categories: {
    key: string;
    value: any;
  };
  fileTypes: {
    key: string;
    value: any;
  };
  educationalPurposes: {
    key: string;
    value: any;
  };
  metadata: {
    key: string;
    value: {
      version: string;
      timestamp: number;
    };
  };
}

let dbInstance: IDBPDatabase<FyleoDB> | null = null;

/**
 * Initialize IndexedDB
 */
export async function initDB(): Promise<IDBPDatabase<FyleoDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<FyleoDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create object stores
      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories');
      }
      if (!db.objectStoreNames.contains('fileTypes')) {
        db.createObjectStore('fileTypes');
      }
      if (!db.objectStoreNames.contains('educationalPurposes')) {
        db.createObjectStore('educationalPurposes');
      }
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata');
      }
    },
  });

  // Check cache version
  await validateCacheVersion(dbInstance);

  return dbInstance;
}

/**
 * Validate cache version and clear if outdated
 */
async function validateCacheVersion(db: IDBPDatabase<FyleoDB>) {
  try {
    const metadata = await db.get('metadata', 'version');
    
    if (!metadata || metadata.version !== CACHE_VERSION) {
      console.log('🗑️ Cache version mismatch. Clearing old cache...');
      await clearAllCache(db);
      await db.put('metadata', { version: CACHE_VERSION, timestamp: Date.now() }, 'version');
    }
  } catch (error) {
    console.error('Error validating cache version:', error);
  }
}

/**
 * Clear all cached data
 */
async function clearAllCache(db: IDBPDatabase<FyleoDB>) {
  const tx = db.transaction(['categories', 'fileTypes', 'educationalPurposes'], 'readwrite');
  await Promise.all([
    tx.objectStore('categories').clear(),
    tx.objectStore('fileTypes').clear(),
    tx.objectStore('educationalPurposes').clear(),
  ]);
}

/**
 * Cache Manager
 */
export const cacheManager = {
  /**
   * Get data from cache
   */
  async get<T>(store: 'categories' | 'fileTypes' | 'educationalPurposes', key: string = 'data'): Promise<T | null> {
    try {
      const db = await initDB();
      const data = await db.get(store, key);
      return data || null;
    } catch (error) {
      console.error(`Error getting ${store} from cache:`, error);
      return null;
    }
  },

  /**
   * Set data in cache
   */
  async set(store: 'categories' | 'fileTypes' | 'educationalPurposes', data: any, key: string = 'data'): Promise<void> {
    try {
      const db = await initDB();
      await db.put(store, data, key);
      console.log(`✅ Cached ${store} to IndexedDB`);
    } catch (error) {
      console.error(`Error caching ${store}:`, error);
    }
  },

  /**
   * Clear specific store
   */
  async clear(store: 'categories' | 'fileTypes' | 'educationalPurposes'): Promise<void> {
    try {
      const db = await initDB();
      await db.clear(store);
      console.log(`🗑️ Cleared ${store} cache`);
    } catch (error) {
      console.error(`Error clearing ${store}:`, error);
    }
  },

  /**
   * Clear all caches
   */
  async clearAll(): Promise<void> {
    try {
      const db = await initDB();
      await clearAllCache(db);
      console.log('🗑️ Cleared all caches');
    } catch (error) {
      console.error('Error clearing all caches:', error);
    }
  },
};
