/**
 * 🔍 Fuzzy Search Utilities
 * Centralized Fuse.js configuration for consistent fuzzy matching
 * across library and mobile search
 */

import Fuse from 'fuse.js';

/**
 * Fuse.js Options
 * Configured for strong fuzzy matching with tolerance for:
 * - Spelling errors (threshold: 0.35)
 * - Reordered tokens (ignoreLocation: true)
 * - Short queries (minMatchCharLength: 2)
 * 
 * Threshold scale:
 * - 0.0 = exact match only
 * - 0.35 = moderate fuzziness (good for typos)
 * - 1.0 = match anything
 */
const FUSE_OPTIONS = {
  threshold: 0.35, // Moderate fuzziness for typo tolerance
  ignoreLocation: true, // Don't care where in text the match is
  minMatchCharLength: 2, // Minimum 2 characters to match
  includeScore: true, // Include match score for sorting
  useExtendedSearch: false, // Simple search is faster
  findAllMatches: false, // Only need best matches
};

/**
 * Create a Fuse instance for categories
 * Searches: nameAr, nameEn, descriptionAr, descriptionEn
 */
export function createCategorySearch(categories) {
  return new Fuse(categories, {
    ...FUSE_OPTIONS,
    keys: [
      { name: 'nameAr', weight: 2 }, // Higher weight for name
      { name: 'nameEn', weight: 2 },
      { name: 'descriptionAr', weight: 1 },
      { name: 'descriptionEn', weight: 1 }
    ]
  });
}

/**
 * Create a Fuse instance for subjects
 * Searches: nameAr, nameEn, descriptionAr, descriptionEn
 */
export function createSubjectSearch(subjects) {
  return new Fuse(subjects, {
    ...FUSE_OPTIONS,
    keys: [
      { name: 'nameAr', weight: 2 },
      { name: 'nameEn', weight: 2 },
      { name: 'descriptionAr', weight: 1 },
      { name: 'descriptionEn', weight: 1 }
    ]
  });
}

/**
 * Create a Fuse instance for materials
 * Searches: title, description, fileName, tags
 */
export function createMaterialSearch(materials) {
  return new Fuse(materials, {
    ...FUSE_OPTIONS,
    keys: [
      { name: 'title', weight: 3 }, // Title is most important
      { name: 'description', weight: 2 },
      { name: 'fileName', weight: 1.5 },
      { name: 'tags', weight: 1 }
    ]
  });
}

/**
 * Create a Fuse instance for posts
 * Searches: contentText, linkURL
 */
export function createPostSearch(posts) {
  return new Fuse(posts, {
    ...FUSE_OPTIONS,
    keys: [
      { name: 'contentText', weight: 2 },
      { name: 'linkURL', weight: 1 }
    ]
  });
}

/**
 * Extract suggestions from fuzzy search results
 * Returns top matching terms that could be used as suggestions
 * @param {Array} results - Fuse.js search results
 * @param {number} limit - Maximum number of suggestions
 * @returns {Array<string>} - Suggested search terms
 */
export function extractSuggestions(results, limit = 3) {
  if (!results || results.length === 0) return [];

  const suggestions = results
    .slice(0, limit)
    .map(result => {
      const item = result.item;
      // Try to extract the most relevant field
      if (item.nameAr) return item.nameAr;
      if (item.nameEn) return item.nameEn;
      if (item.title) return item.title;
      if (item.contentText) {
        // For posts, take first 50 chars
        return item.contentText.substring(0, 50) + (item.contentText.length > 50 ? '...' : '');
      }
      return null;
    })
    .filter(Boolean);

  // Remove duplicates
  return [...new Set(suggestions)];
}

/**
 * Perform comprehensive fuzzy search across all entity types
 * @param {string} query - Search query
 * @param {Object} searchInstances - Object containing Fuse instances
 * @param {number} maxResults - Maximum results per category
 * @returns {Object} - Search results grouped by type
 */
export function performFuzzySearch(query, searchInstances, maxResults = 10) {
  const { categorySearch, subjectSearch, materialSearch, postSearch } = searchInstances;

  if (!query || query.length < 2) {
    return {
      categories: [],
      subjects: [],
      materials: [],
      posts: []
    };
  }

  // Perform searches
  const categoryResults = categorySearch ? categorySearch.search(query).slice(0, maxResults) : [];
  const subjectResults = subjectSearch ? subjectSearch.search(query).slice(0, maxResults) : [];
  const materialResults = materialSearch ? materialSearch.search(query).slice(0, maxResults) : [];
  const postResults = postSearch ? postSearch.search(query).slice(0, maxResults) : [];

  // Extract items from Fuse results (they're wrapped in { item, score })
  return {
    categories: categoryResults.map(r => r.item),
    subjects: subjectResults.map(r => r.item),
    materials: materialResults.map(r => r.item),
    posts: postResults.map(r => r.item),
    // Also return raw results for suggestion extraction
    _raw: {
      categories: categoryResults,
      subjects: subjectResults,
      materials: materialResults,
      posts: postResults
    }
  };
}

/**
 * Generate smart suggestions based on search results
 * Returns alternative search terms when results are poor
 * @param {Object} rawResults - Raw Fuse results with scores
 * @param {string} currentQuery - Current search query
 * @returns {Array<string>} - Suggested alternative terms
 */
export function generateSuggestions(rawResults, currentQuery) {
  const suggestions = [];

  // If we have low-score matches, suggest better terms
  const allResults = [
    ...(rawResults.categories || []),
    ...(rawResults.subjects || []),
    ...(rawResults.materials || []),
    ...(rawResults.posts || [])
  ];

  // Filter results with decent scores (< 0.5 is good)
  const goodResults = allResults.filter(r => r.score < 0.5);

  if (goodResults.length > 0) {
    // Extract unique suggestions from good matches
    goodResults.slice(0, 3).forEach(result => {
      const item = result.item;
      let suggestion = null;

      if (item.nameAr && !currentQuery.includes(item.nameAr)) {
        suggestion = item.nameAr;
      } else if (item.nameEn && !currentQuery.includes(item.nameEn)) {
        suggestion = item.nameEn;
      } else if (item.title && !currentQuery.includes(item.title)) {
        suggestion = item.title;
      }

      if (suggestion && !suggestions.includes(suggestion)) {
        suggestions.push(suggestion);
      }
    });
  }

  return suggestions.slice(0, 3);
}

export default {
  createCategorySearch,
  createSubjectSearch,
  createMaterialSearch,
  createPostSearch,
  extractSuggestions,
  performFuzzySearch,
  generateSuggestions,
  FUSE_OPTIONS
};
