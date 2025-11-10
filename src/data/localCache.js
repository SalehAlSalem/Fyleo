/**
 * 🗄️ Local Cache Module
 * In-memory cache for all library data with lazy initialization
 * Uses existing IndexedDB cache from libraryApi
 * for instant fuzzy search without network requests
 */

import { 
  categoriesApi, 
  subjectsApi, 
  getAllMaterials, 
  getAllPosts 
} from '@/features/library/api/libraryApi';
import appwriteService from '@/services/appwriteService';

// In-memory cache
let cache = {
  categories: null,
  subjects: null,
  materials: null,
  posts: null,
  subjectCategoryLinks: null, // Many-to-many relationship links
  isInitialized: false,
  isLoading: false
};

/**
 * Initialize the local cache
 * Fetches all data using existing APIs (leverages IndexedDB cache)
 * Safe to call multiple times - only loads once
 * @returns {Promise<void>}
 */
export async function init() {
  // If already initialized, return immediately
  if (cache.isInitialized) {
    return;
  }

  // If currently loading, wait for it to complete
  if (cache.isLoading) {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (cache.isInitialized || !cache.isLoading) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  cache.isLoading = true;
  console.log('🗄️ Initializing local cache...');

  try {
    // Fetch all data in parallel using existing cached APIs
    const [categories, subjects, materials, posts, subjectCategoryLinks] = await Promise.all([
      categoriesApi.getAll(),
      subjectsApi.getAll(),
      getAllMaterials(),
      getAllPosts(),
      appwriteService.subjectCategories.getAll()
    ]);

    // Store in cache
    cache.categories = categories || [];
    cache.subjects = subjects || [];
    cache.materials = materials || [];
    cache.posts = posts || [];
    cache.subjectCategoryLinks = subjectCategoryLinks || [];
    cache.isInitialized = true;

    console.log('✅ Local cache initialized:', {
      categories: cache.categories.length,
      subjects: cache.subjects.length,
      materials: cache.materials.length,
      posts: cache.posts.length,
      links: cache.subjectCategoryLinks.length
    });
  } catch (error) {
    console.error('❌ Failed to initialize local cache:', error);
    throw error;
  } finally {
    cache.isLoading = false;
  }
}

/**
 * Get all cached categories
 * @returns {Array} Categories array
 */
export function getCategories() {
  return cache.categories || [];
}

/**
 * Get all cached subjects
 * @returns {Array} Subjects array
 */
export function getSubjects() {
  return cache.subjects || [];
}

/**
 * Get all cached materials
 * @returns {Array} Materials array
 */
export function getMaterials() {
  return cache.materials || [];
}

/**
 * Get all cached posts
 * @returns {Array} Posts array
 */
export function getPosts() {
  return cache.posts || [];
}

/**
 * Get all subject-category links
 * @returns {Array} Links array
 */
export function getSubjectCategoryLinks() {
  return cache.subjectCategoryLinks || [];
}

/**
 * Check if cache is initialized
 * @returns {boolean}
 */
export function isInitialized() {
  return cache.isInitialized;
}

/**
 * Clear the cache (useful for testing or forced refresh)
 */
export function clearCache() {
  cache = {
    categories: null,
    subjects: null,
    materials: null,
    posts: null,
    subjectCategoryLinks: null,
    isInitialized: false,
    isLoading: false
  };
  console.log('🗑️ Local cache cleared');
}

/**
 * Refresh the cache by clearing and re-initializing
 * @returns {Promise<void>}
 */
export async function refresh() {
  clearCache();
  await init();
}

// Default export for convenience
export default {
  init,
  getCategories,
  getSubjects,
  getMaterials,
  getPosts,
  getSubjectCategoryLinks,
  isInitialized,
  clearCache,
  refresh
};
