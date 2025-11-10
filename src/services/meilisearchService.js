/**
 * Meilisearch Service
 * Handles all search operations using Meilisearch backend
 * 
 * 🔍 Features:
 * - Instant full-text search
 * - Typo tolerance (1-2 typos automatically handled)
 * - Prefix matching (autocomplete)
 * - Filtering by category, subject, file type, year
 * - Relevance ranking
 * - Real-time sync with Appwrite via Realtime API
 * - Automatic initial indexing on startup
 * 
 * 🌐 Infrastructure:
 * - Hosted on Caddy reverse proxy server with HTTPS
 * - SSL certificates managed by Let's Encrypt
 * - CORS configured for fyleo.dev, fyleo.vercel.app, localhost
 * - Direct HTTPS communication (no Appwrite Functions)
 * - Port mapping: 443 → 127.0.0.1:7701
 */

import { MeiliSearch } from 'meilisearch';
import { MeilisearchProxyClient } from './meilisearchProxyClient.js';

// Meilisearch Configuration
const MEILISEARCH_HOST = import.meta.env.VITE_MEILISEARCH_HOST || 'https://minio97.chickenkiller.com/meili';
const MEILISEARCH_API_KEY = import.meta.env.VITE_MEILISEARCH_API_KEY || 'StrongSearchKey123';
const MEILISEARCH_ENABLED = import.meta.env.VITE_MEILISEARCH_ENABLED !== 'false';
const MEILISEARCH_PROXY_MODE = import.meta.env.VITE_MEILISEARCH_PROXY_MODE === 'true';
const MEILISEARCH_FUNCTION_ID = import.meta.env.VITE_MEILISEARCH_FUNCTION_ID;

// Index Names
export const INDEXES = {
  CATEGORIES: 'categories',
  SUBJECTS: 'subjects',
  MATERIALS: 'materials_posts',
  POSTS: 'posts',
  FILETYPES: 'filetypes',
  EDUCATIONAL_PURPOSES: 'educational_purposes'
};

/**
 * Initialize Meilisearch client
 * Supports two modes:
 * 1. Direct Mode: Direct HTTPS to Meilisearch (Vite Proxy for dev, Direct for prod)
 * 2. Proxy Mode: Via Appwrite Function (secure, hides API key)
 */
let meilisearchClient;

if (MEILISEARCH_PROXY_MODE && MEILISEARCH_FUNCTION_ID) {
  console.log('🔒 Using Appwrite Function Proxy Mode');
  meilisearchClient = new MeilisearchProxyClient(MEILISEARCH_HOST, MEILISEARCH_FUNCTION_ID);
} else {
  console.log('🔓 Using Direct Mode');
  meilisearchClient = new MeiliSearch({
    host: MEILISEARCH_HOST,
    apiKey: MEILISEARCH_API_KEY
  });
}

export { meilisearchClient };

// Alias for compatibility
export const meili = meilisearchClient;

// Track if initial indexing has been completed
let isInitialIndexingComplete = false;
let realtimeSubscriptions = [];

/**
 * Configure index settings for optimal search
 * Call this once during initial setup or when index structure changes
 */
export async function configureIndexSettings() {
  try {
    console.log('🔧 Configuring Meilisearch index settings...');

    // Configure Categories Index
    const categoriesIndex = meilisearchClient.index(INDEXES.CATEGORIES);
    await categoriesIndex.updateSettings({
      searchableAttributes: ['nameEn', 'nameAr', 'descriptionEn', 'descriptionAr'],
      filterableAttributes: ['isActive', '$id'],
      sortableAttributes: ['order'],
      displayedAttributes: ['$id', 'nameEn', 'nameAr', 'descriptionEn', 'descriptionAr', 'icon', 'order', 'isActive'],
      typoTolerance: {
        enabled: true,
        minWordSizeForTypos: {
          oneTypo: 4,
          twoTypos: 8
        }
      }
    });

    // Configure Subjects Index
    const subjectsIndex = meilisearchClient.index(INDEXES.SUBJECTS);
    await subjectsIndex.updateSettings({
      searchableAttributes: ['nameEn', 'nameAr', 'descriptionEn', 'descriptionAr'],
      filterableAttributes: ['isActive', '$id', 'categoryIds', 'level'],
      sortableAttributes: ['nameEn', 'nameAr'],
      displayedAttributes: ['$id', 'nameEn', 'nameAr', 'descriptionEn', 'descriptionAr', 'icon', 'level', 'categoryIds', 'isActive'],
      typoTolerance: {
        enabled: true,
        minWordSizeForTypos: {
          oneTypo: 4,
          twoTypos: 8
        }
      }
    });

    // Configure Materials Index
    const materialsIndex = meilisearchClient.index(INDEXES.MATERIALS);
    await materialsIndex.updateSettings({
      searchableAttributes: ['title', 'description', 'subjectName', 'categoryNames'],
      filterableAttributes: ['subjectId', 'categoryIds', 'fileTypeId', 'year', 'uploaderId', '$id'],
      sortableAttributes: ['$createdAt', 'title'],
      displayedAttributes: [
        '$id', 'title', 'description', 'subjectId', 'subjectName', 
        'categoryIds', 'categoryNames', 'fileTypeId', 'fileTypeName',
        'year', 'uploaderId', 'uploaderName', '$createdAt'
      ],
      typoTolerance: {
        enabled: true,
        minWordSizeForTypos: {
          oneTypo: 4,
          twoTypos: 8
        }
      },
      rankingRules: [
        'words',
        'typo',
        'proximity',
        'attribute',
        'sort',
        'exactness'
      ]
    });

    // Configure Posts Index
    const postsIndex = meilisearchClient.index(INDEXES.POSTS);
    await postsIndex.updateSettings({
      searchableAttributes: ['contentText', 'linkURL', 'subjectName', 'categoryNames'],
      filterableAttributes: ['subjectId', 'categoryIds', 'educationalPurposeId', 'uploaderId', '$id'],
      sortableAttributes: ['$createdAt'],
      displayedAttributes: [
        '$id', 'contentText', 'linkURL', 'subjectId', 'subjectName',
        'categoryIds', 'categoryNames', 'educationalPurposeId',
        'uploaderId', 'uploaderName', '$createdAt'
      ],
      typoTolerance: {
        enabled: true,
        minWordSizeForTypos: {
          oneTypo: 4,
          twoTypos: 8
        }
      },
      rankingRules: [
        'words',
        'typo',
        'proximity',
        'attribute',
        'sort',
        'exactness'
      ]
    });

    console.log('✅ Meilisearch index settings configured successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error configuring Meilisearch settings:', error);
    throw error;
  }
}

/**
 * Search Service - Replaces Appwrite-based search
 */
export const meilisearchService = {
  /**
   * Global search - Search across all indexes
   */
  async globalSearch(query, options = {}) {
    // Return empty results if Meilisearch is disabled
    if (!MEILISEARCH_ENABLED) {
      console.warn('⚠️ Meilisearch is disabled in environment variables');
      return {
        materials: [],
        posts: [],
        subjects: [],
        categories: [],
        totalHits: 0
      };
    }

    try {
      const { limit = 10 } = options;

      // Search in parallel across all indexes
      const [categoriesResults, subjectsResults, materialsResults, postsResults] = await Promise.all([
        meilisearchClient.index(INDEXES.CATEGORIES).search(query, {
          filter: ['isActive = true'],
          limit: Math.min(limit, 5),
          attributesToHighlight: ['nameEn', 'nameAr', 'descriptionEn', 'descriptionAr']
        }),
        meilisearchClient.index(INDEXES.SUBJECTS).search(query, {
          filter: ['isActive = true'],
          limit: limit,
          attributesToHighlight: ['nameEn', 'nameAr', 'descriptionEn', 'descriptionAr']
        }),
        meilisearchClient.index(INDEXES.MATERIALS).search(query, {
          limit: limit,
          attributesToHighlight: ['title', 'description']
        }),
        meilisearchClient.index(INDEXES.POSTS).search(query, {
          limit: limit,
          attributesToHighlight: ['contentText', 'linkURL']
        })
      ]);

      return {
        categories: categoriesResults.hits || [],
        subjects: subjectsResults.hits || [],
        materials: materialsResults.hits || [],
        posts: postsResults.hits || []
      };
    } catch (error) {
      console.error('❌ Meilisearch global search error:', error);
      throw error;
    }
  },

  /**
   * Search within a category
   */
  async searchInCategory(categoryId, query, options = {}) {
    // Return empty results if Meilisearch is disabled
    if (!MEILISEARCH_ENABLED) {
      return { subjects: [], materials: [], posts: [] };
    }

    try {
      const { limit = 20 } = options;

      // Search subjects and materials/posts that belong to this category
      const [subjectsResults, materialsResults, postsResults] = await Promise.all([
        meilisearchClient.index(INDEXES.SUBJECTS).search(query, {
          filter: [`isActive = true AND categoryIds = ${categoryId}`],
          limit: limit,
          attributesToHighlight: ['nameEn', 'nameAr', 'descriptionEn', 'descriptionAr']
        }),
        meilisearchClient.index(INDEXES.MATERIALS).search(query, {
          filter: [`categoryIds = ${categoryId}`],
          limit: limit,
          attributesToHighlight: ['title', 'description']
        }),
        meilisearchClient.index(INDEXES.POSTS).search(query, {
          filter: [`categoryIds = ${categoryId}`],
          limit: limit,
          attributesToHighlight: ['contentText', 'linkURL']
        })
      ]);

      return {
        subjects: subjectsResults.hits || [],
        materials: materialsResults.hits || [],
        posts: postsResults.hits || []
      };
    } catch (error) {
      console.error('❌ Meilisearch category search error:', error);
      throw error;
    }
  },

  /**
   * Search within a specific subject
   */
  async searchInSubject(subjectId, query, options = {}) {
    // Return empty results if Meilisearch is disabled
    if (!MEILISEARCH_ENABLED) {
      return { materials: [], posts: [] };
    }

    try {
      const { limit = 20 } = options;

      // Search materials and posts within this subject
      const [materialsResults, postsResults] = await Promise.all([
        meilisearchClient.index(INDEXES.MATERIALS).search(query, {
          filter: [`subjectId = ${subjectId}`],
          limit: limit,
          attributesToHighlight: ['title', 'description']
        }),
        meilisearchClient.index(INDEXES.POSTS).search(query, {
          filter: [`subjectId = ${subjectId}`],
          limit: limit,
          attributesToHighlight: ['contentText', 'linkURL']
        })
      ]);

      return {
        materials: materialsResults.hits || [],
        posts: postsResults.hits || []
      };
    } catch (error) {
      console.error('❌ Meilisearch subject search error:', error);
      throw error;
    }
  },

  /**
   * Advanced search with filters
   */
  async advancedSearch(query, filters = {}, options = {}) {
    try {
      const { 
        index = INDEXES.MATERIALS, 
        limit = 20, 
        sort = ['$createdAt:desc'] 
      } = options;

      // Build filter array
      const filterArray = [];
      
      if (filters.subjectId) {
        filterArray.push(`subjectId = ${filters.subjectId}`);
      }
      
      if (filters.categoryIds && filters.categoryIds.length > 0) {
        const categoryFilters = filters.categoryIds.map(id => `categoryIds = ${id}`).join(' OR ');
        filterArray.push(`(${categoryFilters})`);
      }
      
      if (filters.fileTypeId) {
        filterArray.push(`fileTypeId = ${filters.fileTypeId}`);
      }
      
      if (filters.year) {
        filterArray.push(`year = ${filters.year}`);
      }

      const searchParams = {
        limit,
        attributesToHighlight: ['title', 'description', 'contentText'],
        sort
      };

      if (filterArray.length > 0) {
        searchParams.filter = filterArray;
      }

      const results = await meilisearchClient.index(index).search(query, searchParams);
      
      return {
        hits: results.hits || [],
        estimatedTotalHits: results.estimatedTotalHits || 0,
        processingTimeMs: results.processingTimeMs || 0
      };
    } catch (error) {
      console.error('❌ Meilisearch advanced search error:', error);
      throw error;
    }
  },

  /**
   * Get autocomplete suggestions
   */
  async autocomplete(query, index = INDEXES.MATERIALS, limit = 5) {
    try {
      const results = await meilisearchClient.index(index).search(query, {
        limit,
        attributesToRetrieve: ['title', 'nameEn', 'nameAr'],
        attributesToHighlight: []
      });

      return results.hits || [];
    } catch (error) {
      console.error('❌ Meilisearch autocomplete error:', error);
      throw error;
    }
  },

  /**
   * Check Meilisearch server health
   */
  async healthCheck() {
    try {
      const health = await meilisearchClient.health();
      console.log('✅ Meilisearch server is healthy:', health);
      return health;
    } catch (error) {
      console.error('❌ Meilisearch health check failed:', error);
      throw error;
    }
  },

  /**
   * Get index statistics
   */
  async getIndexStats(indexName) {
    try {
      const index = meilisearchClient.index(indexName);
      const stats = await index.getStats();
      console.log(`📊 Index "${indexName}" stats:`, stats);
      return stats;
    } catch (error) {
      console.error(`❌ Error getting stats for index "${indexName}":`, error);
      throw error;
    }
  },

  /**
   * Add or update a single document in Meilisearch
   * Used by real-time sync
   */
  async syncDocument(indexName, document) {
    try {
      const index = meilisearchClient.index(indexName);
      await index.addDocuments([document], { primaryKey: '$id' });
      console.log(`✅ Synced document to ${indexName}:`, document.$id);
    } catch (error) {
      console.error(`❌ Error syncing document to ${indexName}:`, error);
      throw error;
    }
  },

  /**
   * Delete a document from Meilisearch
   * Used by real-time sync
   */
  async deleteDocument(indexName, documentId) {
    try {
      const index = meilisearchClient.index(indexName);
      await index.deleteDocument(documentId);
      console.log(`🗑️ Deleted document from ${indexName}:`, documentId);
    } catch (error) {
      console.error(`❌ Error deleting document from ${indexName}:`, error);
      throw error;
    }
  },

  /**
   * Check if initial indexing is complete
   */
  isIndexingComplete() {
    return isInitialIndexingComplete;
  },

  /**
   * Mark initial indexing as complete
   */
  setIndexingComplete(status = true) {
    isInitialIndexingComplete = status;
  },

  /**
   * Get current realtime subscriptions
   */
  getRealtimeSubscriptions() {
    return realtimeSubscriptions;
  },

  /**
   * Add a realtime subscription reference
   */
  addRealtimeSubscription(subscription) {
    realtimeSubscriptions.push(subscription);
  },

  /**
   * Cleanup all realtime subscriptions
   */
  cleanupRealtimeSubscriptions() {
    realtimeSubscriptions.forEach(unsub => {
      if (typeof unsub === 'function') {
        unsub();
      }
    });
    realtimeSubscriptions = [];
    console.log('🧹 Cleaned up Meilisearch realtime subscriptions');
  }
};

export default meilisearchService;
