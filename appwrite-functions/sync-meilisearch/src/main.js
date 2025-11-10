/**
 * Meilisearch Sync Function for Appwrite
 * 
 * This function automatically syncs data changes from Appwrite to Meilisearch.
 * It listens to database events (create, update, delete) and updates the corresponding
 * Meilisearch indexes in real-time.
 * 
 * Environment Variables Required:
 * - MEILISEARCH_HOST: Meilisearch server URL
 * - MEILISEARCH_MASTER_KEY: Master API key for write operations
 * - APPWRITE_API_KEY: Appwrite API key for reading related documents
 * - APPWRITE_ENDPOINT: Appwrite endpoint URL
 * - APPWRITE_PROJECT_ID: Appwrite project ID
 * - DATABASE_ID: Database ID
 * - SUBJECTS_COLLECTION_ID: Subjects collection ID
 * - CATEGORIES_COLLECTION_ID: Categories collection ID
 * - FILETYPES_COLLECTION_ID: FileTypes collection ID
 * - USERS_COLLECTION_ID: Users collection ID
 * - SUBJECT_CATEGORIES_COLLECTION_ID: Subject-Categories junction collection ID
 */

import { MeiliSearch } from 'meilisearch';
import { Client, Databases, Query } from 'node-appwrite';

// Meilisearch Configuration
const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST || 'https://minio97.chickenkiller.com/meili';
const MEILISEARCH_MASTER_KEY = process.env.MEILISEARCH_MASTER_KEY || 'StrongSearchKey123';

// Appwrite Configuration
const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;

// Collection IDs
const DATABASE_ID = process.env.DATABASE_ID;
const SUBJECTS_COLLECTION_ID = process.env.SUBJECTS_COLLECTION_ID;
const CATEGORIES_COLLECTION_ID = process.env.CATEGORIES_COLLECTION_ID;
const FILETYPES_COLLECTION_ID = process.env.FILETYPES_COLLECTION_ID;
const USERS_COLLECTION_ID = process.env.USERS_COLLECTION_ID;
const SUBJECT_CATEGORIES_COLLECTION_ID = process.env.SUBJECT_CATEGORIES_COLLECTION_ID;

// Initialize Meilisearch client
const meili = new MeiliSearch({
  host: MEILISEARCH_HOST,
  apiKey: MEILISEARCH_MASTER_KEY
});

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

// Index names
const INDEXES = {
  CATEGORIES: 'categories',
  SUBJECTS: 'subjects',
  MATERIALS: 'materials_posts',
  POSTS: 'posts'
};

/**
 * Get subject-category mappings for a subject
 */
async function getSubjectCategoryIds(subjectId) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SUBJECT_CATEGORIES_COLLECTION_ID,
      [Query.equal('subjectId', subjectId)]
    );
    return response.documents.map(link => link.categoryId);
  } catch (error) {
    console.error('Error fetching subject categories:', error);
    return [];
  }
}

/**
 * Enrich material document with related data
 */
async function enrichMaterial(material) {
  try {
    const [subject, fileType, uploader, categoryIds] = await Promise.all([
      material.subjectId ? databases.getDocument(DATABASE_ID, SUBJECTS_COLLECTION_ID, material.subjectId).catch(() => null) : null,
      material.fileTypeId ? databases.getDocument(DATABASE_ID, FILETYPES_COLLECTION_ID, material.fileTypeId).catch(() => null) : null,
      material.uploaderId ? databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, material.uploaderId).catch(() => null) : null,
      material.subjectId ? getSubjectCategoryIds(material.subjectId) : []
    ]);

    return {
      $id: material.$id,
      title: material.title || '',
      description: material.description || '',
      subjectId: material.subjectId || '',
      subjectName: subject ? `${subject.nameEn} / ${subject.nameAr}` : '',
      categoryIds: categoryIds,
      categoryNames: '',
      fileTypeId: material.fileTypeId || '',
      fileTypeName: fileType ? fileType.nameEn : '',
      year: material.year || '',
      uploaderId: material.uploaderId || '',
      uploaderName: uploader ? (uploader.name || uploader.email || 'Unknown') : 'Unknown',
      $createdAt: material.$createdAt || ''
    };
  } catch (error) {
    console.error('Error enriching material:', error);
    return null;
  }
}

/**
 * Enrich post document with related data
 */
async function enrichPost(post) {
  try {
    const [subject, uploader, categoryIds] = await Promise.all([
      post.subjectId ? databases.getDocument(DATABASE_ID, SUBJECTS_COLLECTION_ID, post.subjectId).catch(() => null) : null,
      post.uploaderId ? databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, post.uploaderId).catch(() => null) : null,
      post.subjectId ? getSubjectCategoryIds(post.subjectId) : []
    ]);

    return {
      $id: post.$id,
      contentText: post.contentText || '',
      linkURL: post.linkURL || '',
      subjectId: post.subjectId || '',
      subjectName: subject ? `${subject.nameEn} / ${subject.nameAr}` : '',
      categoryIds: categoryIds,
      categoryNames: '',
      educationalPurposeId: post.educationalPurposeId || '',
      uploaderId: post.uploaderId || '',
      uploaderName: uploader ? (uploader.name || uploader.email || 'Unknown') : 'Unknown',
      $createdAt: post.$createdAt || ''
    };
  } catch (error) {
    console.error('Error enriching post:', error);
    return null;
  }
}

/**
 * Enrich subject document with category IDs
 */
async function enrichSubject(subject) {
  try {
    const categoryIds = await getSubjectCategoryIds(subject.$id);

    return {
      $id: subject.$id,
      nameEn: subject.nameEn || '',
      nameAr: subject.nameAr || '',
      descriptionEn: subject.descriptionEn || '',
      descriptionAr: subject.descriptionAr || '',
      icon: subject.icon || '',
      level: subject.level || 0,
      categoryIds: categoryIds,
      isActive: subject.isActive || false
    };
  } catch (error) {
    console.error('Error enriching subject:', error);
    return null;
  }
}

/**
 * Main handler function
 */
export default async ({ req, res, log, error: logError }) => {
  try {
    log('🔄 Meilisearch sync triggered');
    log(`Event: ${req.headers['x-appwrite-event']}`);

    // Parse the event
    const event = req.headers['x-appwrite-event'];
    const payload = JSON.parse(req.body || '{}');
    
    if (!event) {
      logError('No event header found');
      return res.json({ success: false, error: 'No event header' });
    }

    // Extract collection and action from event
    // Event format: databases.{databaseId}.collections.{collectionId}.documents.{documentId}.{action}
    const eventParts = event.split('.');
    const collectionName = eventParts[3]; // materials, posts, subjects, categories
    const action = eventParts[eventParts.length - 1]; // create, update, delete

    log(`Collection: ${collectionName}, Action: ${action}`);
    log(`Document ID: ${payload.$id}`);

    // Determine index based on collection
    let index;
    let enrichedDocument = null;

    switch (collectionName) {
      case 'materials':
        index = meili.index(INDEXES.MATERIALS);
        if (action !== 'delete') {
          enrichedDocument = await enrichMaterial(payload);
        }
        break;

      case 'posts':
        index = meili.index(INDEXES.POSTS);
        if (action !== 'delete') {
          enrichedDocument = await enrichPost(payload);
        }
        break;

      case 'subjects':
        index = meili.index(INDEXES.SUBJECTS);
        if (action !== 'delete') {
          enrichedDocument = await enrichSubject(payload);
        }
        break;

      case 'categories':
        index = meili.index(INDEXES.CATEGORIES);
        if (action !== 'delete') {
          enrichedDocument = {
            $id: payload.$id,
            nameEn: payload.nameEn || '',
            nameAr: payload.nameAr || '',
            descriptionEn: payload.descriptionEn || '',
            descriptionAr: payload.descriptionAr || '',
            icon: payload.icon || '',
            order: payload.order || 0,
            isActive: payload.isActive || false
          };
        }
        break;

      default:
        log(`⚠️ Unknown collection: ${collectionName}`);
        return res.json({ success: false, error: 'Unknown collection' });
    }

    // Perform the appropriate action
    if (action === 'delete') {
      log(`🗑️ Deleting document ${payload.$id} from Meilisearch`);
      await index.deleteDocument(payload.$id);
      log('✅ Document deleted from Meilisearch');
    } else {
      if (!enrichedDocument) {
        logError('Failed to enrich document');
        return res.json({ success: false, error: 'Failed to enrich document' });
      }

      log(`📝 ${action === 'create' ? 'Adding' : 'Updating'} document in Meilisearch`);
      await index.addDocuments([enrichedDocument], { primaryKey: '$id' });
      log('✅ Document synced to Meilisearch');
    }

    return res.json({
      success: true,
      action,
      collection: collectionName,
      documentId: payload.$id,
      message: `Document ${action}d successfully`
    });

  } catch (err) {
    logError('❌ Error syncing to Meilisearch:', err);
    return res.json({
      success: false,
      error: err.message,
      stack: err.stack
    }, 500);
  }
};
