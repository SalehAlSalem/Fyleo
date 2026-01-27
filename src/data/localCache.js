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
    const [categories, subjects, materials, posts, subjectCategoryLinks, fileTypes] = await Promise.all([
      categoriesApi.getAll(),
      subjectsApi.getAll(),
      getAllMaterials(),
      getAllPosts(),
      appwriteService.subjectCategories.getAll(),
      appwriteService.fileTypes.getAll()
    ]);

    // Create lookup maps for better performance
    const subjectsMap = new Map(subjects.map(s => [s.$id, s]));
    const fileTypesMap = new Map(fileTypes.map(ft => [ft.$id, ft]));

    // Enrich materials with subject and fileType objects
    const enrichedMaterials = materials.map(material => ({
      ...material,
      subject: material.subjectId ? subjectsMap.get(material.subjectId) : null,
      fileType: material.fileTypeId ? fileTypesMap.get(material.fileTypeId) : null
    }));

    // Enrich posts with subject objects
    const enrichedPosts = posts.map(post => ({
      ...post,
      subject: post.subjectId ? subjectsMap.get(post.subjectId) : null
    }));

    // Store in cache
    cache.categories = categories || [];
    cache.subjects = subjects || [];
    cache.materials = enrichedMaterials || [];
    cache.posts = enrichedPosts || [];
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

/**
 * Simple fuzzy matching algorithm
 * @param {string} pattern - Search pattern
 * @param {string} text - Text to search in
 * @returns {number} Match score (0-1, higher is better)
 */
function fuzzyMatch(pattern, text) {
  pattern = pattern.toLowerCase();
  text = text.toLowerCase();

  // Exact match gets highest score
  if (text === pattern) return 1.0;
  
  // Starts with pattern gets high score
  if (text.startsWith(pattern)) return 0.9;
  
  // Contains pattern as substring gets good score
  if (text.includes(pattern)) return 0.7;

  // Fuzzy character-by-character matching
  let patternIdx = 0;
  let score = 0;
  let previousMatchIdx = -1;

  for (let i = 0; i < text.length; i++) {
    if (patternIdx < pattern.length && text[i] === pattern[patternIdx]) {
      score += previousMatchIdx === i - 1 ? 2 : 1; // Consecutive matches get bonus
      previousMatchIdx = i;
      patternIdx++;
    }
  }

  // If not all pattern characters matched, return 0
  if (patternIdx !== pattern.length) return 0;

  // Normalize score (max possible is 2 * pattern.length for all consecutive)
  return (score / (pattern.length * 2)) * 0.6; // Max 0.6 for fuzzy match
}

/**
 * Fuzzy search for subjects
 * @param {string} query - Search query
 * @param {Array} subjects - Subjects array (optional, uses cache if not provided)
 * @returns {Array} Filtered and sorted subjects by relevance
 */
export function searchSubjects(query, subjects = null) {
  const subjectsToSearch = subjects || cache.subjects || [];
  
  if (!query || !query.trim()) {
    return subjectsToSearch;
  }

  const searchResults = subjectsToSearch.map(subject => {
    const nameAr = subject.nameAr || '';
    const nameEn = subject.nameEn || '';
    
    // Get match scores for both names
    const scoreAr = fuzzyMatch(query, nameAr);
    const scoreEn = fuzzyMatch(query, nameEn);
    
    // Use the best score
    const score = Math.max(scoreAr, scoreEn);
    
    return { subject, score };
  })
  .filter(({ score }) => score > 0) // Only keep matches
  .sort((a, b) => b.score - a.score) // Sort by score (best first)
  .map(({ subject }) => subject); // Extract subjects

  return searchResults;
}

/**
 * Fuzzy search for categories
 * @param {string} query - Search query
 * @param {Array} categories - Categories array (optional, uses cache if not provided)
 * @returns {Array} Filtered and sorted categories by relevance
 */
export function searchCategories(query, categories = null) {
  const categoriesToSearch = categories || cache.categories || [];
  
  if (!query || !query.trim()) {
    return categoriesToSearch;
  }

  const searchResults = categoriesToSearch.map(category => {
    const nameAr = category.nameAr || '';
    const nameEn = category.nameEn || '';
    
    // Get match scores for both names
    const scoreAr = fuzzyMatch(query, nameAr);
    const scoreEn = fuzzyMatch(query, nameEn);
    
    // Use the best score
    const score = Math.max(scoreAr, scoreEn);
    
    return { category, score };
  })
  .filter(({ score }) => score > 0) // Only keep matches
  .sort((a, b) => b.score - a.score) // Sort by score (best first)
  .map(({ category }) => category); // Extract categories

  return searchResults;
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
  refresh,
  searchSubjects,
  searchCategories
};
