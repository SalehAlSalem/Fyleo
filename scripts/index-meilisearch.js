/**
 * Meilisearch Data Indexing Script
 * 
 * This script fetches all data from Appwrite and indexes it into Meilisearch.
 * Run this once initially, and then whenever you need to re-sync data.
 * 
 * Usage:
 *   node scripts/index-meilisearch.js
 * 
 * Environment variables required:
 *   - VITE_APPWRITE_ENDPOINT
 *   - VITE_APPWRITE_PROJECT_ID
 *   - VITE_APPWRITE_DATABASE_ID
 *   - All collection IDs
 */

import { Client, Databases, Query } from 'appwrite';
import { MeiliSearch } from 'meilisearch';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

// Read .env file manually if dotenv doesn't work
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

// Appwrite Configuration
const APPWRITE_ENDPOINT = process.env.VITE_APPWRITE_URL || process.env.VITE_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const CATEGORIES_COLLECTION_ID = process.env.VITE_APPWRITE_CATEGORIES_COLLECTION_ID;
const SUBJECTS_COLLECTION_ID = process.env.VITE_APPWRITE_SUBJECTS_COLLECTION_ID;
const MATERIALS_COLLECTION_ID = process.env.VITE_APPWRITE_FILES_COLLECTION_ID;
const POSTS_COLLECTION_ID = process.env.VITE_APPWRITE_POSTS_COLLECTION_ID;
const FILETYPES_COLLECTION_ID = process.env.VITE_APPWRITE_FILE_TYPES_COLLECTION_ID;
const USERS_COLLECTION_ID = process.env.VITE_APPWRITE_USERS_COLLECTION_ID;
const SUBJECT_CATEGORIES_COLLECTION_ID = process.env.VITE_APPWRITE_SUBJECT_CATEGORIES_COLLECTION_ID;

// Meilisearch Configuration
const MEILISEARCH_HOST = 'https://minio97.chickenkiller.com/meili';
const MEILISEARCH_API_KEY = 'StrongSearchKey123';

// Initialize clients
const appwriteClient = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

const databases = new Databases(appwriteClient);

const meilisearchClient = new MeiliSearch({
  host: MEILISEARCH_HOST,
  apiKey: MEILISEARCH_API_KEY
});

// Index names
const INDEXES = {
  CATEGORIES: 'categories',
  SUBJECTS: 'subjects',
  MATERIALS: 'materials_posts',
  POSTS: 'posts'
};

/**
 * Fetch all documents from a collection (handles pagination)
 */
async function fetchAllDocuments(collectionId, queries = []) {
  let allDocuments = [];
  let offset = 0;
  const limit = 100;
  let hasMore = true;

  console.log(`📥 Fetching documents from ${collectionId}...`);

  while (hasMore) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        collectionId,
        [...queries, Query.limit(limit), Query.offset(offset)]
      );

      allDocuments = allDocuments.concat(response.documents);
      console.log(`   Fetched ${response.documents.length} documents (total: ${allDocuments.length})`);

      if (response.documents.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    } catch (error) {
      console.error(`❌ Error fetching documents from ${collectionId}:`, error.message);
      hasMore = false;
    }
  }

  return allDocuments;
}

/**
 * Get subject-category mappings (Many-to-Many)
 */
async function getSubjectCategoryMappings() {
  console.log('🔗 Fetching subject-category mappings...');
  const links = await fetchAllDocuments(SUBJECT_CATEGORIES_COLLECTION_ID);
  
  // Create a map: subjectId -> [categoryId1, categoryId2, ...]
  const subjectToCategoriesMap = new Map();
  
  links.forEach(link => {
    if (!subjectToCategoriesMap.has(link.subjectId)) {
      subjectToCategoriesMap.set(link.subjectId, []);
    }
    subjectToCategoriesMap.get(link.subjectId).push(link.categoryId);
  });
  
  console.log(`✅ Found ${links.length} subject-category links`);
  return subjectToCategoriesMap;
}

/**
 * Index Categories
 */
async function indexCategories() {
  console.log('\n📚 Indexing Categories...');
  
  try {
    const categories = await fetchAllDocuments(CATEGORIES_COLLECTION_ID, [
      Query.equal('isActive', true)
    ]);

    if (categories.length === 0) {
      console.log('⚠️  No active categories found');
      return;
    }

    const categoriesIndex = meilisearchClient.index(INDEXES.CATEGORIES);
    
    // Transform documents to include only necessary fields
    const documentsToIndex = categories.map(cat => ({
      $id: cat.$id,
      nameEn: cat.nameEn || '',
      nameAr: cat.nameAr || '',
      descriptionEn: cat.descriptionEn || '',
      descriptionAr: cat.descriptionAr || '',
      icon: cat.icon || '',
      order: cat.order || 0,
      isActive: cat.isActive || false
    }));

    const task = await categoriesIndex.addDocuments(documentsToIndex, { primaryKey: '$id' });
    console.log(`✅ Added ${documentsToIndex.length} categories (Task ID: ${task.taskUid})`);
    
    return task;
  } catch (error) {
    console.error('❌ Error indexing categories:', error.message);
    throw error;
  }
}

/**
 * Index Subjects
 */
async function indexSubjects(subjectToCategoriesMap) {
  console.log('\n📘 Indexing Subjects...');
  
  try {
    const subjects = await fetchAllDocuments(SUBJECTS_COLLECTION_ID, [
      Query.equal('isActive', true)
    ]);

    if (subjects.length === 0) {
      console.log('⚠️  No active subjects found');
      return;
    }

    const subjectsIndex = meilisearchClient.index(INDEXES.SUBJECTS);
    
    // Transform documents with categoryIds from Many-to-Many relationship
    const documentsToIndex = subjects.map(sub => ({
      $id: sub.$id,
      nameEn: sub.nameEn || '',
      nameAr: sub.nameAr || '',
      descriptionEn: sub.descriptionEn || '',
      descriptionAr: sub.descriptionAr || '',
      icon: sub.icon || '',
      level: sub.level || 0,
      categoryIds: subjectToCategoriesMap.get(sub.$id) || [],
      isActive: sub.isActive || false
    }));

    const task = await subjectsIndex.addDocuments(documentsToIndex, { primaryKey: '$id' });
    console.log(`✅ Added ${documentsToIndex.length} subjects (Task ID: ${task.taskUid})`);
    
    return task;
  } catch (error) {
    console.error('❌ Error indexing subjects:', error.message);
    throw error;
  }
}

/**
 * Index Materials
 */
async function indexMaterials(subjectToCategoriesMap) {
  console.log('\n📄 Indexing Materials...');
  
  try {
    const materials = await fetchAllDocuments(MATERIALS_COLLECTION_ID);

    if (materials.length === 0) {
      console.log('⚠️  No materials found');
      return;
    }

    // Fetch subjects, fileTypes, and users for enrichment
    const [subjects, fileTypes, users] = await Promise.all([
      fetchAllDocuments(SUBJECTS_COLLECTION_ID),
      fetchAllDocuments(FILETYPES_COLLECTION_ID),
      fetchAllDocuments(USERS_COLLECTION_ID)
    ]);

    // Create lookup maps
    const subjectsMap = new Map(subjects.map(s => [s.$id, s]));
    const fileTypesMap = new Map(fileTypes.map(ft => [ft.$id, ft]));
    const usersMap = new Map(users.map(u => [u.$id, u]));

    const materialsIndex = meilisearchClient.index(INDEXES.MATERIALS);
    
    // Transform and enrich documents
    const documentsToIndex = materials.map(mat => {
      const subject = subjectsMap.get(mat.subjectId);
      const fileType = fileTypesMap.get(mat.fileTypeId);
      const uploader = usersMap.get(mat.uploaderId);
      const categoryIds = subjectToCategoriesMap.get(mat.subjectId) || [];

      return {
        $id: mat.$id,
        title: mat.title || '',
        description: mat.description || '',
        subjectId: mat.subjectId || '',
        subjectName: subject ? `${subject.nameEn} / ${subject.nameAr}` : '',
        categoryIds: categoryIds,
        categoryNames: '', // Could be enriched further if needed
        fileTypeId: mat.fileTypeId || '',
        fileTypeName: fileType ? fileType.nameEn : '',
        year: mat.year || '',
        uploaderId: mat.uploaderId || '',
        uploaderName: uploader ? (uploader.name || uploader.email || 'Unknown') : 'Unknown',
        $createdAt: mat.$createdAt || ''
      };
    });

    const task = await materialsIndex.addDocuments(documentsToIndex, { primaryKey: '$id' });
    console.log(`✅ Added ${documentsToIndex.length} materials (Task ID: ${task.taskUid})`);
    
    return task;
  } catch (error) {
    console.error('❌ Error indexing materials:', error.message);
    throw error;
  }
}

/**
 * Index Posts
 */
async function indexPosts(subjectToCategoriesMap) {
  console.log('\n📝 Indexing Posts...');
  
  try {
    const posts = await fetchAllDocuments(POSTS_COLLECTION_ID);

    if (posts.length === 0) {
      console.log('⚠️  No posts found');
      return;
    }

    // Fetch subjects and users for enrichment
    const [subjects, users] = await Promise.all([
      fetchAllDocuments(SUBJECTS_COLLECTION_ID),
      fetchAllDocuments(USERS_COLLECTION_ID)
    ]);

    // Create lookup maps
    const subjectsMap = new Map(subjects.map(s => [s.$id, s]));
    const usersMap = new Map(users.map(u => [u.$id, u]));

    const postsIndex = meilisearchClient.index(INDEXES.POSTS);
    
    // Transform and enrich documents
    const documentsToIndex = posts.map(post => {
      const subject = subjectsMap.get(post.subjectId);
      const uploader = usersMap.get(post.uploaderId);
      const categoryIds = subjectToCategoriesMap.get(post.subjectId) || [];

      return {
        $id: post.$id,
        contentText: post.contentText || '',
        linkURL: post.linkURL || '',
        subjectId: post.subjectId || '',
        subjectName: subject ? `${subject.nameEn} / ${subject.nameAr}` : '',
        categoryIds: categoryIds,
        categoryNames: '', // Could be enriched further if needed
        educationalPurposeId: post.educationalPurposeId || '',
        uploaderId: post.uploaderId || '',
        uploaderName: uploader ? (uploader.name || uploader.email || 'Unknown') : 'Unknown',
        $createdAt: post.$createdAt || ''
      };
    });

    const task = await postsIndex.addDocuments(documentsToIndex, { primaryKey: '$id' });
    console.log(`✅ Added ${documentsToIndex.length} posts (Task ID: ${task.taskUid})`);
    
    return task;
  } catch (error) {
    console.error('❌ Error indexing posts:', error.message);
    throw error;
  }
}

/**
 * Configure index settings
 */
async function configureIndexSettings() {
  console.log('\n⚙️  Configuring index settings...');
  
  try {
    // Categories Index Settings
    await meilisearchClient.index(INDEXES.CATEGORIES).updateSettings({
      searchableAttributes: ['nameEn', 'nameAr', 'descriptionEn', 'descriptionAr'],
      filterableAttributes: ['isActive', '$id'],
      sortableAttributes: ['order'],
      displayedAttributes: ['$id', 'nameEn', 'nameAr', 'descriptionEn', 'descriptionAr', 'icon', 'order', 'isActive'],
      typoTolerance: {
        enabled: true,
        minWordSizeForTypos: { oneTypo: 4, twoTypos: 8 }
      }
    });
    console.log('✅ Categories index configured');

    // Subjects Index Settings
    await meilisearchClient.index(INDEXES.SUBJECTS).updateSettings({
      searchableAttributes: ['nameEn', 'nameAr', 'descriptionEn', 'descriptionAr'],
      filterableAttributes: ['isActive', '$id', 'categoryIds', 'level'],
      sortableAttributes: ['nameEn', 'nameAr'],
      displayedAttributes: ['$id', 'nameEn', 'nameAr', 'descriptionEn', 'descriptionAr', 'icon', 'level', 'categoryIds', 'isActive'],
      typoTolerance: {
        enabled: true,
        minWordSizeForTypos: { oneTypo: 4, twoTypos: 8 }
      }
    });
    console.log('✅ Subjects index configured');

    // Materials Index Settings
    await meilisearchClient.index(INDEXES.MATERIALS).updateSettings({
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
        minWordSizeForTypos: { oneTypo: 4, twoTypos: 8 }
      },
      rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness']
    });
    console.log('✅ Materials index configured');

    // Posts Index Settings
    await meilisearchClient.index(INDEXES.POSTS).updateSettings({
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
        minWordSizeForTypos: { oneTypo: 4, twoTypos: 8 }
      },
      rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness']
    });
    console.log('✅ Posts index configured');

  } catch (error) {
    console.error('❌ Error configuring index settings:', error.message);
    throw error;
  }
}

/**
 * Main indexing function
 */
async function main() {
  console.log('🚀 Starting Meilisearch indexing process...\n');
  console.log('📍 Meilisearch Host:', MEILISEARCH_HOST);
  console.log('📍 Appwrite Endpoint:', APPWRITE_ENDPOINT);
  console.log('📍 Database ID:', DATABASE_ID);
  console.log('');

  try {
    // Check Meilisearch health
    const health = await meilisearchClient.health();
    console.log('✅ Meilisearch server is healthy:', health);

    // Get subject-category mappings first
    const subjectToCategoriesMap = await getSubjectCategoryMappings();

    // Index all collections
    await indexCategories();
    await indexSubjects(subjectToCategoriesMap);
    await indexMaterials(subjectToCategoriesMap);
    await indexPosts(subjectToCategoriesMap);

    // Configure index settings
    await configureIndexSettings();

    console.log('\n✅ All data has been indexed successfully!');
    console.log('\n📊 Index Statistics:');
    
    // Show stats for each index
    for (const [key, indexName] of Object.entries(INDEXES)) {
      try {
        const stats = await meilisearchClient.index(indexName).getStats();
        console.log(`   ${key}: ${stats.numberOfDocuments} documents`);
      } catch (error) {
        console.log(`   ${key}: Unable to fetch stats`);
      }
    }

    console.log('\n🎉 Indexing complete! You can now use Meilisearch for search.');
    
  } catch (error) {
    console.error('\n❌ Indexing failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();
