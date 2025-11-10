/**
 * Library API Service
 * Centralized Appwrite database calls for the Library feature
 * Following Feature-Sliced Design (FSD) principles
 * 
 * 🎯 Tiered Caching Strategy:
 * - Tier 1 (Static): Categories, FileTypes, Purposes → IndexedDB + React Query (Cache Forever)
 * - Tier 2 (Semi-Static): Subjects → React Query (5min cache)
 * - Tier 3 (Dynamic): Materials, Posts → React Query (2min cache)
 * - Tier 4 (Sensitive): User data → Server-only (No cache)
 * 
 * 🔍 Search Strategy:
 * - All search operations now powered by Meilisearch for instant, typo-tolerant search
 * - Meilisearch handles full-text search, filtering, and ranking
 * - Appwrite still used for all CRUD operations
 */

import { databases, Query } from '../../../config/appwrite';
import { cacheManager } from '../utils/indexedDB';
import appwriteService from '../../../services/appwriteService';
import meilisearchService from '../../../services/meilisearchService';
import type { Category, Subject, Material, Post, EducationalPurpose } from '../../../types/database';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const CATEGORIES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CATEGORIES_COLLECTION_ID;
const SUBJECTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SUBJECTS_COLLECTION_ID;
const MATERIALS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_FILES_COLLECTION_ID;
const POSTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID;
const EDUCATIONAL_PURPOSES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_EDUCATIONAL_PURPOSES_COLLECTION_ID;
const FILETYPES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_FILE_TYPES_COLLECTION_ID;
const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;

/**
 * Categories API
 */
export const categoriesApi = {
  /**
   * 🟩 TIER 1: Get all active categories (IndexedDB cached)
   * This uses "Load All + Link Client-Side" strategy to minimize requests
   */
  async getAll(): Promise<Category[]> {
    try {
      // Try IndexedDB cache first
      const cached = await cacheManager.get<Category[]>('categories');
      if (cached) {
        console.log('✅ Categories loaded from IndexedDB cache');
        return cached;
      }

      console.log('🌐 Fetching categories from Appwrite...');
      const response = await databases.listDocuments(
        DATABASE_ID,
        CATEGORIES_COLLECTION_ID,
        [
          Query.equal('isActive', true),
          Query.orderAsc('order'),
          Query.limit(100)
        ]
      );
      
      const categories = response.documents as Category[];

      // Cache in IndexedDB for future use
      await cacheManager.set('categories', categories);
      
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * 🟩 TIER 1: Get all categories WITH subjects count (optimized)
   * Now uses Many-to-Many relationship via subject_categories
   */
  async getAllWithSubjectsCount(): Promise<(Category & { subjectsCount: number })[]> {
    try {
      // Get categories (from cache or Appwrite)
      const categories = await this.getAll();
      
      // Get ALL subject-category links in one request
      const allLinks = await Promise.all(
        categories.map(async (cat) => ({
          categoryId: cat.$id,
          links: await appwriteService.subjectCategories.getByCategory(cat.$id)
        }))
      );
      
      // Create a count map
      const countMap = new Map<string, number>();
      allLinks.forEach(({ categoryId, links }) => {
        countMap.set(categoryId, links.length);
      });
      
      // Add counts to categories
      const categoriesWithCount = categories.map(category => ({
        ...category,
        subjectsCount: countMap.get(category.$id) || 0
      }));
      
      return categoriesWithCount;
    } catch (error) {
      console.error('Error fetching categories with subjects count:', error);
      throw error;
    }
  },

  /**
   * Get category by ID
   */
  async getById(id: string): Promise<Category> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        CATEGORIES_COLLECTION_ID,
        id
      );
      return response as Category;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  /**
   * Get subjects for a category (using Many-to-Many relationship)
   */
  async getSubjects(categoryId: string): Promise<Subject[]> {
    try {
      // Get subject IDs linked to this category
      const links = await appwriteService.subjectCategories.getByCategory(categoryId);
      const subjectIds = links.map(link => link.subjectId);
      
      if (subjectIds.length === 0) return [];
      
      // Fetch subjects by IDs
      const response = await databases.listDocuments(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        [
          Query.equal('$id', subjectIds),
          Query.equal('isActive', true),
          Query.orderAsc('nameEn'),
          Query.limit(100)
        ]
      );
      return response.documents as Subject[];
    } catch (error) {
      console.error('Error fetching category subjects:', error);
      throw error;
    }
  }
};

/**
 * Subjects API
 */
export const subjectsApi = {
  /**
   * Get subject by ID
   */
  async getById(id: string): Promise<Subject> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        id
      );
      return response as Subject;
    } catch (error) {
      console.error('Error fetching subject:', error);
      throw error;
    }
  },

  /**
   * Get all subjects
   */
  async getAll(): Promise<Subject[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        [
          Query.equal('isActive', true),
          Query.limit(500)
        ]
      );
      return response.documents as Subject[];
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw error;
    }
  }
};

/**
 * Educational Purposes API
 */
export const purposesApi = {
  /**
   * Get all educational purposes
   */
  async getAll(): Promise<EducationalPurpose[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        EDUCATIONAL_PURPOSES_COLLECTION_ID,
        [
          Query.equal('isActive', true),
          Query.orderAsc('order'),
          Query.limit(50)
        ]
      );
      return response.documents as EducationalPurpose[];
    } catch (error) {
      console.error('Error fetching educational purposes:', error);
      throw error;
    }
  }
};

/**
 * Helper function to enrich materials with uploader names
 */
async function enrichMaterialsWithUploaderNames(materials: Material[]): Promise<Material[]> {
  const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;
  
  // Get unique uploader IDs
  const uploaderIds = [...new Set(materials.map(m => (m as any).uploaderId).filter(Boolean))];
  
  if (uploaderIds.length === 0) {
    return materials;
  }
  
  try {
    // Fetch all users in one query
    const usersResponse = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [
        Query.equal('$id', uploaderIds),
        Query.limit(100)
      ]
    );
    
    // Create a map of userId -> userName
    const userMap = new Map(
      usersResponse.documents.map((user: any) => [user.$id, user.name])
    );
    
    // Enrich materials with uploader names
    return materials.map(material => ({
      ...material,
      uploaderName: userMap.get((material as any).uploaderId) || 'Unknown User'
    }));
  } catch (error) {
    console.error('Error fetching uploader names:', error);
    return materials;
  }
}

/**
 * Materials API
 */
export const materialsApi = {
  /**
   * Get materials by subject and optional purpose
   * Uses 2-step process when purposeId is provided:
   * 1. Find fileTypes with matching educationalPurposeId
   * 2. Find materials with those fileTypeIds
   */
  async getBySubject(
    subjectId: string,
    purposeId?: string
  ): Promise<Material[]> {
    try {
      let materials: Material[];
      
      if (purposeId) {
        // STEP 1: Find fileTypes with matching educationalPurposeId
        const fileTypesResponse = await databases.listDocuments(
          DATABASE_ID,
          FILETYPES_COLLECTION_ID,
          [
            Query.equal('educationalPurposeId', purposeId),
            Query.limit(100)
          ]
        );

        const fileTypeIds = fileTypesResponse.documents.map((ft: any) => ft.$id);

        // If no fileTypes found, return empty array
        if (fileTypeIds.length === 0) {
          return [];
        }

        // STEP 2: Find materials with those fileTypeIds
        const response = await databases.listDocuments(
          DATABASE_ID,
          MATERIALS_COLLECTION_ID,
          [
            Query.equal('subjectId', subjectId),
            Query.equal('fileTypeId', fileTypeIds),
            Query.orderDesc('$createdAt'),
            Query.limit(100)
          ]
        );

        materials = response.documents as Material[];
      } else {
        // No purposeId: fetch all materials for subject
        const response = await databases.listDocuments(
          DATABASE_ID,
          MATERIALS_COLLECTION_ID,
          [
            Query.equal('subjectId', subjectId),
            Query.orderDesc('$createdAt'),
            Query.limit(100)
          ]
        );

        materials = response.documents as Material[];
      }
      
      // Enrich materials with uploader names AND fileType
      const enrichedMaterials = await enrichMaterialsWithUploaderNames(materials);
      
      // Populate fileType for each material
      const materialsWithFileType = await Promise.all(
        enrichedMaterials.map(async (material: any) => {
          if (material.fileTypeId) {
            try {
              const fileType = await databases.getDocument(
                DATABASE_ID,
                FILETYPES_COLLECTION_ID,
                material.fileTypeId
              );
              return { ...material, fileType };
            } catch (err) {
              console.warn(`⚠️ Could not fetch fileType for material ${material.$id}:`, err);
              return material;
            }
          }
          return material;
        })
      );
      
      return materialsWithFileType;
    } catch (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }
  },

  /**
   * Get material by ID (with fileType and uploader populated)
   */
  async getById(id: string): Promise<Material> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        id
      );
      
      const material = response as any;
      
      // Fetch related data in parallel
      const [fileType, uploader] = await Promise.all([
        // Populate fileType if available
        material.fileTypeId
          ? databases.getDocument(DATABASE_ID, FILETYPES_COLLECTION_ID, material.fileTypeId).catch(() => null)
          : null,
        // Populate uploader if available
        material.uploaderId
          ? databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, material.uploaderId).catch(() => null)
          : null
      ]);
      
      return {
        ...material,
        fileType: fileType || undefined,
        uploader: uploader || undefined,
        uploaderName: uploader ? (uploader.name || uploader.email || 'Unknown User') : 'Unknown User'
      } as Material;
    } catch (error) {
      console.error('Error fetching material:', error);
      throw error;
    }
  },

  /**
   * Search materials
   */
  async search(query: string): Promise<Material[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [
          Query.search('title', query),
          Query.limit(50)
        ]
      );
      return response.documents as Material[];
    } catch (error) {
      console.error('Error searching materials:', error);
      throw error;
    }
  }
};

/**
 * Posts API
 */
export const postsApi = {
  /**
   * Get posts by subject and optional purpose
   * Fetches uploader information for each post
   */
  async getBySubject(
    subjectId: string,
    purposeId?: string
  ): Promise<Post[]> {
    try {
      const queries = [
        Query.equal('subjectId', subjectId),
        Query.orderDesc('$createdAt'),
        Query.limit(100)
      ];

      if (purposeId) {
        queries.push(Query.equal('educationalPurposeId', purposeId));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        POSTS_COLLECTION_ID,
        queries
      );
      
      const posts = response.documents as Post[];
      
      // Fetch uploader information for each post
      const postsWithUploaders = await Promise.all(
        posts.map(async (post) => {
          try {
            const uploader = await databases.getDocument(
              DATABASE_ID,
              USERS_COLLECTION_ID,
              post.uploaderId
            );
            return {
              ...post,
              uploaderName: uploader.name || uploader.email || 'Unknown User'
            };
          } catch (error) {
            console.warn(`Could not fetch uploader for post ${post.$id}:`, error);
            return {
              ...post,
              uploaderName: 'Unknown User'
            };
          }
        })
      );
      
      return postsWithUploaders;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  /**
   * Get post by ID (with uploader populated)
   */
  async getById(id: string): Promise<Post> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        POSTS_COLLECTION_ID,
        id
      );
      
      const post = response as any;
      
      // Fetch uploader information
      let uploader = null;
      if (post.uploaderId) {
        try {
          uploader = await databases.getDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            post.uploaderId
          );
        } catch (err) {
          console.warn(`⚠️ Could not fetch uploader for post ${id}:`, err);
        }
      }
      
      return {
        ...post,
        uploader: uploader || undefined,
        uploaderName: uploader ? (uploader.name || uploader.email || 'Unknown User') : 'Unknown User'
      } as Post;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }
};

/**
 * Search API - Powered by Meilisearch
 * Now using Meilisearch for instant, typo-tolerant, relevance-ranked search
 */
export const searchApi = {
  /**
   * Global search - Search across everything (Level 1)
   * 🔍 Now powered by Meilisearch
   */
  async globalSearch(query: string): Promise<{
    categories: Category[];
    subjects: Subject[];
    materials: Material[];
    posts: Post[];
  }> {
    try {
      console.log(`🔍 Meilisearch global search: "${query}"`);

      // Use Meilisearch for instant search (returns only ID + title + description)
      const results = await meilisearchService.globalSearch(query, { limit: 10 });

      // ✅ Get full data from Appwrite using IDs (will use React Query cache)
      const enrichedMaterials = await Promise.all(
        (results.materials || []).map(async (searchResult: any) => {
          try {
            // Get full material data from Appwrite (React Query will cache it)
            const fullMaterial = await materialsApi.getById(searchResult.$id);
            console.log('📦 Material with uploader:', fullMaterial.$id, 'Uploader:', (fullMaterial as any).uploaderName);
            return fullMaterial;
          } catch (err) {
            console.warn('Error fetching material:', err);
            // Return minimal data from search if full fetch fails
            return {
              $id: searchResult.$id,
              title: searchResult.title || 'Untitled',
              description: searchResult.description || '',
            };
          }
        })
      );

      // ✅ Get full post data from Appwrite using IDs (will use React Query cache)
      const enrichedPosts = await Promise.all(
        (results.posts || []).map(async (searchResult: any) => {
          try {
            // Get full post data from Appwrite (React Query will cache it)
            const fullPost = await postsApi.getById(searchResult.$id);
            console.log('📦 Post with uploader:', fullPost.$id, 'Uploader:', (fullPost as any).uploaderName);
            return fullPost;
          } catch (err) {
            console.warn('Error fetching post:', err);
            // Return minimal data from search if full fetch fails
            return {
              $id: searchResult.$id,
              title: searchResult.title || '',
              contentText: searchResult.contentText || '',
            };
          }
        })
      );

      return {
        categories: results.categories as Category[] || [],
        subjects: results.subjects as Subject[] || [],
        materials: enrichedMaterials as Material[],
        posts: enrichedPosts as Post[]
      };
    } catch (error) {
      console.error('❌ Error in Meilisearch global search:', error);
      
      // Fallback to empty results if Meilisearch fails
      console.warn('⚠️ Meilisearch unavailable, returning empty results');
      return {
        categories: [],
        subjects: [],
        materials: [],
        posts: []
      };
    }
  },

  /**
   * Category search - Search subjects, materials, and posts within a category (Level 2)
   * 🔍 Now powered by Meilisearch with category filtering
   */
  async searchInCategory(categoryId: string, query: string): Promise<{
    subjects: Subject[];
    materials: Material[];
    posts: Post[];
  }> {
    try {
      console.log(`🔍 Meilisearch category search: Category="${categoryId}", Query="${query}"`);

      // Use Meilisearch for filtered search within category
      const results = await meilisearchService.searchInCategory(categoryId, query, { limit: 20 });

      // Enrich materials with additional data from Appwrite if needed
      const enrichedMaterials = await Promise.all(
        (results.materials || []).map(async (material: any) => {
          try {
            // Fetch fileType if not already included
            if (material.fileTypeId && !material.fileType) {
              const fileType = await databases.getDocument(
                DATABASE_ID,
                FILETYPES_COLLECTION_ID,
                material.fileTypeId
              );
              material.fileType = fileType;
            }
            
            // Fetch subject if not already included
            if (material.subjectId && !material.subject) {
              const subject = await databases.getDocument(
                DATABASE_ID,
                SUBJECTS_COLLECTION_ID,
                material.subjectId
              );
              material.subject = subject;
            }
            
            return material;
          } catch (err) {
            console.warn('Error enriching material:', err);
            return material;
          }
        })
      );

      // Enrich posts with additional data from Appwrite if needed
      const enrichedPosts = await Promise.all(
        (results.posts || []).map(async (post: any) => {
          try {
            // Fetch subject if not already included
            if (post.subjectId && !post.subject) {
              const subject = await databases.getDocument(
                DATABASE_ID,
                SUBJECTS_COLLECTION_ID,
                post.subjectId
              );
              post.subject = subject;
            }
            
            return post;
          } catch (err) {
            console.warn('Error enriching post:', err);
            return post;
          }
        })
      );

      console.log(`✅ Found ${results.subjects?.length || 0} subjects, ${enrichedMaterials.length} materials, ${enrichedPosts.length} posts`);

      return {
        subjects: results.subjects as Subject[] || [],
        materials: enrichedMaterials as Material[],
        posts: enrichedPosts as Post[]
      };
    } catch (error) {
      console.error('❌ Error in Meilisearch category search:', error);
      
      // Fallback to empty results if Meilisearch fails
      console.warn('⚠️ Meilisearch unavailable, returning empty results');
      return {
        subjects: [],
        materials: [],
        posts: []
      };
    }
  },

  /**
   * Subject search - Search materials and posts within a subject (Level 3)
   * 🔍 Now powered by Meilisearch with subject filtering
   */
  async searchInSubject(subjectId: string, query: string): Promise<{
    materials: Material[];
    posts: Post[];
  }> {
    try {
      console.log(`🔍 Meilisearch subject search: Subject="${subjectId}", Query="${query}"`);

      // Use Meilisearch for filtered search within subject
      const results = await meilisearchService.searchInSubject(subjectId, query, { limit: 20 });

      // Enrich materials with additional data from Appwrite if needed
      const enrichedMaterials = await Promise.all(
        (results.materials || []).map(async (material: any) => {
          try {
            // Fetch fileType if not already included
            if (material.fileTypeId && !material.fileType) {
              const fileType = await databases.getDocument(
                DATABASE_ID,
                FILETYPES_COLLECTION_ID,
                material.fileTypeId
              );
              material.fileType = fileType;
            }
            
            return material;
          } catch (err) {
            console.warn('Error enriching material:', err);
            return material;
          }
        })
      );

      // Posts are already enriched with uploader names from Meilisearch
      const enrichedPosts = results.posts || [];

      console.log(`✅ Found ${enrichedMaterials.length} materials, ${enrichedPosts.length} posts`);

      return {
        materials: enrichedMaterials as Material[],
        posts: enrichedPosts as Post[]
      };
    } catch (error) {
      console.error('❌ Error in Meilisearch subject search:', error);
      
      // Fallback to empty results if Meilisearch fails
      console.warn('⚠️ Meilisearch unavailable, returning empty results');
      return {
        materials: [],
        posts: []
      };
    }
  }
};

/**
 * 🟩 TIER 1: File Types API (IndexedDB cached)
 */
export const fileTypesApi = {
  /**
   * Get all file types (cached in IndexedDB)
   */
  async getAll(): Promise<any[]> {
    try {
      // Try IndexedDB cache first
      const cached = await cacheManager.get<any[]>('fileTypes');
      if (cached) {
        console.log('✅ FileTypes loaded from IndexedDB cache');
        return cached;
      }

      console.log('🌐 Fetching file types from Appwrite...');
      const response = await databases.listDocuments(
        DATABASE_ID,
        FILETYPES_COLLECTION_ID,
        [Query.limit(100)]
      );

      const fileTypes = response.documents;

      // Cache in IndexedDB
      await cacheManager.set('fileTypes', fileTypes);

      return fileTypes;
    } catch (error) {
      console.error('Error fetching file types:', error);
      throw error;
    }
  }
};

/**
 * 🟩 TIER 1: Educational Purposes API (IndexedDB cached)
 */
export const educationalPurposesApi = {
  /**
   * Get all educational purposes (cached in IndexedDB)
   */
  async getAll(): Promise<EducationalPurpose[]> {
    try {
      // Try IndexedDB cache first
      const cached = await cacheManager.get<EducationalPurpose[]>('educationalPurposes');
      if (cached) {
        console.log('✅ Educational Purposes loaded from IndexedDB cache');
        return cached;
      }

      console.log('🌐 Fetching educational purposes from Appwrite...');
      const response = await databases.listDocuments(
        DATABASE_ID,
        EDUCATIONAL_PURPOSES_COLLECTION_ID,
        [
          Query.equal('isActive', true),
          Query.orderAsc('order'),
          Query.limit(100)
        ]
      );

      const purposes = response.documents as EducationalPurpose[];

      // Cache in IndexedDB
      await cacheManager.set('educationalPurposes', purposes);

      return purposes;
    } catch (error) {
      console.error('Error fetching educational purposes:', error);
      throw error;
    }
  }
};

/**
 * 🟨 TIER 2: Get ALL Subjects (for client-side linking)
 */
export async function getAllSubjects(): Promise<Subject[]> {
  try {
    console.log('🌐 Fetching all subjects from Appwrite...');
    const response = await databases.listDocuments(
      DATABASE_ID,
      SUBJECTS_COLLECTION_ID,
      [
        Query.equal('isActive', true),
        Query.limit(1000)
      ]
    );

    return response.documents as Subject[];
  } catch (error) {
    console.error('Error fetching all subjects:', error);
    throw error;
  }
}

/**
 * 🟦 TIER 3: Get ALL Materials (for client-side linking)
 */
export async function getAllMaterials(): Promise<Material[]> {
  try {
    console.log('🌐 Fetching all materials from Appwrite...');
    const response = await databases.listDocuments(
      DATABASE_ID,
      MATERIALS_COLLECTION_ID,
      [Query.limit(5000)]
    );

    return response.documents as Material[];
  } catch (error) {
    console.error('Error fetching all materials:', error);
    throw error;
  }
}

/**
 * 🟦 TIER 3: Get ALL Posts (for client-side linking)
 */
export async function getAllPosts(): Promise<Post[]> {
  try {
    console.log('🌐 Fetching all posts from Appwrite...');
    const response = await databases.listDocuments(
      DATABASE_ID,
      POSTS_COLLECTION_ID,
      [Query.limit(5000)]
    );

    return response.documents as Post[];
  } catch (error) {
    console.error('Error fetching all posts:', error);
    throw error;
  }
}
