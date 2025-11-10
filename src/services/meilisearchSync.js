/**
 * Meilisearch Realtime Sync Service
 * 
 * This service automatically synchronizes Appwrite database changes with Meilisearch
 * in real-time using Appwrite's Realtime API.
 * 
 * Features:
 * - Listens to create, update, delete events
 * - Automatically enriches documents with related data
 * - Handles many-to-many relationships
 * - Runs initial full indexing on startup
 * - Maintains sync state
 */

import { client, databases, DATABASE_ID, Query } from '../config/appwrite';
import meilisearchService, { INDEXES } from './meilisearchService';

// Collection IDs from environment
const CATEGORIES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CATEGORIES_COLLECTION_ID;
const SUBJECTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SUBJECTS_COLLECTION_ID;
const MATERIALS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_FILES_COLLECTION_ID;
const POSTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID;
const FILETYPES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_FILE_TYPES_COLLECTION_ID;
const EDUCATIONAL_PURPOSES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_EDUCATIONAL_PURPOSES_COLLECTION_ID;
const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;
const SUBJECT_CATEGORIES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SUBJECT_CATEGORIES_COLLECTION_ID;

/**
 * Map collection IDs to index names
 */
const COLLECTION_TO_INDEX = {
  [CATEGORIES_COLLECTION_ID]: INDEXES.CATEGORIES,
  [SUBJECTS_COLLECTION_ID]: INDEXES.SUBJECTS,
  [MATERIALS_COLLECTION_ID]: INDEXES.MATERIALS,
  [POSTS_COLLECTION_ID]: INDEXES.POSTS,
  [FILETYPES_COLLECTION_ID]: INDEXES.FILETYPES,
  [EDUCATIONAL_PURPOSES_COLLECTION_ID]: INDEXES.EDUCATIONAL_PURPOSES
};

/**
 * Get subject-category mappings for a subject
 */
async function getSubjectCategoryIds(subjectId) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SUBJECT_CATEGORIES_COLLECTION_ID,
      [Query.equal('subjectId', subjectId), Query.limit(100)]
    );
    return response.documents.map(link => link.categoryId);
  } catch (error) {
    console.error('Error fetching subject categories:', error);
    return [];
  }
}

/**
 * Transform and enrich document for Meilisearch
 */
async function transformDocument(collectionId, document) {
  try {
    const baseDoc = {
      $id: document.$id,
      $createdAt: document.$createdAt || new Date().toISOString(),
      $updatedAt: document.$updatedAt || new Date().toISOString()
    };

    // Transform based on collection type
    switch (collectionId) {
      case CATEGORIES_COLLECTION_ID:
        return {
          ...baseDoc,
          nameEn: document.nameEn || '',
          nameAr: document.nameAr || '',
          descriptionEn: document.descriptionEn || '',
          descriptionAr: document.descriptionAr || '',
          icon: document.icon || '',
          order: document.order || 0,
          isActive: document.isActive !== false
        };

      case SUBJECTS_COLLECTION_ID: {
        const categoryIds = await getSubjectCategoryIds(document.$id);
        return {
          ...baseDoc,
          nameEn: document.nameEn || '',
          nameAr: document.nameAr || '',
          descriptionEn: document.descriptionEn || '',
          descriptionAr: document.descriptionAr || '',
          icon: document.icon || '',
          level: document.level || 0,
          categoryIds: categoryIds,
          isActive: document.isActive !== false
        };
      }

      case MATERIALS_COLLECTION_ID: {
        // ✅ فقط البيانات الضرورية للبحث
        return {
          ...baseDoc,
          title: document.title || '',
          description: document.description || ''
        };
      }

      case POSTS_COLLECTION_ID: {
        // ✅ فقط البيانات الضرورية للبحث
        return {
          ...baseDoc,
          title: document.title || '',  // لو موجود عنوان
          contentText: document.contentText || ''
        };
      }

      case FILETYPES_COLLECTION_ID:
        return {
          ...baseDoc,
          nameEn: document.nameEn || '',
          nameAr: document.nameAr || '',
          icon: document.icon || '',
          educationalPurposeId: document.educationalPurposeId || '',
          isActive: document.isActive !== false
        };

      case EDUCATIONAL_PURPOSES_COLLECTION_ID:
        return {
          ...baseDoc,
          nameEn: document.nameEn || '',
          nameAr: document.nameAr || '',
          descriptionEn: document.descriptionEn || '',
          descriptionAr: document.descriptionAr || '',
          icon: document.icon || '',
          order: document.order || 0,
          isActive: document.isActive !== false
        };

      default:
        return baseDoc;
    }
  } catch (error) {
    console.error('Error transforming document:', error);
    return null;
  }
}

/**
 * Handle document create/update event
 */
async function handleDocumentUpsert(collectionId, document) {
  try {
    const indexName = COLLECTION_TO_INDEX[collectionId];
    if (!indexName) {
      console.warn('⚠️ No index mapping for collection:', collectionId);
      return;
    }

    console.log(`🔄 Syncing document: ${collectionId}/${document.$id}`);
    const transformedDoc = await transformDocument(collectionId, document);
    
    if (!transformedDoc) {
      console.error('❌ Failed to transform document');
      return;
    }

    await meilisearchService.syncDocument(indexName, transformedDoc);
  } catch (error) {
    console.error('❌ Error handling document upsert:', error);
  }
}

/**
 * Handle document delete event
 */
async function handleDocumentDelete(collectionId, documentId) {
  try {
    const indexName = COLLECTION_TO_INDEX[collectionId];
    if (!indexName) {
      console.warn('⚠️ No index mapping for collection:', collectionId);
      return;
    }

    console.log(`🗑️ Deleting document: ${collectionId}/${documentId}`);
    await meilisearchService.deleteDocument(indexName, documentId);
  } catch (error) {
    console.error('❌ Error handling document delete:', error);
  }
}

/**
 * Setup realtime listeners for a collection
 */
function setupRealtimeListener(collectionId) {
  try {
    const channel = `databases.${DATABASE_ID}.collections.${collectionId}.documents`;
    
    console.log(`👂 Setting up realtime listener for: ${channel}`);

    const unsubscribe = client.subscribe(channel, (response) => {
      const events = response.events || [];
      const payload = response.payload;

      if (!payload || !payload.$id) {
        console.warn('⚠️ Invalid payload received');
        return;
      }

      // Check event type
      const isCreate = events.some(e => e.includes('.create'));
      const isUpdate = events.some(e => e.includes('.update'));
      const isDelete = events.some(e => e.includes('.delete'));

      if (isDelete) {
        handleDocumentDelete(collectionId, payload.$id);
      } else if (isCreate || isUpdate) {
        handleDocumentUpsert(collectionId, payload);
      }
    });

    // Store the unsubscribe function
    meilisearchService.addRealtimeSubscription(unsubscribe);

    return unsubscribe;
  } catch (error) {
    console.error(`❌ Error setting up realtime listener for ${collectionId}:`, error);
    return null;
  }
}

/**
 * Initialize realtime sync for all collections
 */
export async function initializeRealtimeSync() {
  try {
    console.log('🚀 Initializing Meilisearch realtime sync...');

    // Check Meilisearch health
    try {
      await meilisearchService.healthCheck();
    } catch (error) {
      console.error('❌ Meilisearch server is not available. Realtime sync disabled.');
      return false;
    }

    // Setup listeners for each collection
    const collections = [
      CATEGORIES_COLLECTION_ID,
      SUBJECTS_COLLECTION_ID,
      MATERIALS_COLLECTION_ID,
      POSTS_COLLECTION_ID,
      FILETYPES_COLLECTION_ID,
      EDUCATIONAL_PURPOSES_COLLECTION_ID
    ];

    collections.forEach(collectionId => {
      if (collectionId) {
        setupRealtimeListener(collectionId);
      }
    });

    console.log('✅ Realtime sync initialized for all collections');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize realtime sync:', error);
    return false;
  }
}

/**
 * Cleanup realtime subscriptions
 */
export function cleanupRealtimeSync() {
  meilisearchService.cleanupRealtimeSubscriptions();
}

/**
 * Perform initial full indexing of all existing data
 * This should be called once on app startup
 */
export async function performInitialIndexing(options = {}) {
  const { skipIfComplete = true, onProgress = null } = options;

  // Skip if already completed (unless forced)
  if (skipIfComplete && meilisearchService.isIndexingComplete()) {
    console.log('ℹ️ Initial indexing already completed. Skipping...');
    return { success: true, skipped: true };
  }

  try {
    console.log('🔄 Starting initial Meilisearch indexing...');

    // Check Meilisearch health
    await meilisearchService.healthCheck();

    const collections = [
      { id: CATEGORIES_COLLECTION_ID, name: 'Categories' },
      { id: SUBJECTS_COLLECTION_ID, name: 'Subjects' },
      { id: MATERIALS_COLLECTION_ID, name: 'Materials' },
      { id: POSTS_COLLECTION_ID, name: 'Posts' },
      { id: FILETYPES_COLLECTION_ID, name: 'FileTypes' },
      { id: EDUCATIONAL_PURPOSES_COLLECTION_ID, name: 'Educational Purposes' }
    ];

    let totalDocuments = 0;

    for (const collection of collections) {
      if (!collection.id) continue;

      try {
        console.log(`📥 Fetching ${collection.name}...`);
        
        // Fetch all documents from this collection
        let allDocs = [];
        let offset = 0;
        const limit = 100;
        let hasMore = true;

        while (hasMore) {
          const response = await databases.listDocuments(
            DATABASE_ID,
            collection.id,
            [Query.limit(limit), Query.offset(offset)]
          );

          allDocs = allDocs.concat(response.documents);
          
          if (response.documents.length < limit) {
            hasMore = false;
          } else {
            offset += limit;
          }
        }

        console.log(`   Found ${allDocs.length} documents`);

        // Transform and index each document
        const transformedDocs = [];
        for (const doc of allDocs) {
          const transformed = await transformDocument(collection.id, doc);
          if (transformed) {
            transformedDocs.push(transformed);
          }
        }

        // Bulk index to Meilisearch
        if (transformedDocs.length > 0) {
          const indexName = COLLECTION_TO_INDEX[collection.id];
          
          // Import meili client directly
          const { meili } = await import('./meilisearchService.js');
          
          // Sync first doc to ensure index exists
          await meilisearchService.syncDocument(indexName, transformedDocs[0]);
          
          // Get index and add documents
          const index = meili.index(indexName);
          await index.addDocuments(transformedDocs, { primaryKey: '$id' });
          
          console.log(`✅ Indexed ${transformedDocs.length} ${collection.name}`);
          totalDocuments += transformedDocs.length;
        }

        if (onProgress) {
          onProgress({ 
            collection: collection.name, 
            count: transformedDocs.length,
            total: totalDocuments
          });
        }

      } catch (error) {
        console.error(`❌ Error indexing ${collection.name}:`, error);
      }
    }

    // Mark as complete
    meilisearchService.setIndexingComplete(true);
    
    console.log(`✅ Initial indexing complete! Total documents: ${totalDocuments}`);
    
    return {
      success: true,
      totalDocuments,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Initial indexing failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Export sync manager object
 */
export const meilisearchSyncManager = {
  initialize: initializeRealtimeSync,
  cleanup: cleanupRealtimeSync,
  performInitialIndexing,
  isIndexingComplete: () => meilisearchService.isIndexingComplete()
};

export default meilisearchSyncManager;
