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
 */

import { databases, Query } from '../../../config/appwrite';
import { cacheManager } from '../utils/indexedDB';
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
   * Uses client-side linking instead of N+1 queries
   */
  async getAllWithSubjectsCount(): Promise<(Category & { subjectsCount: number })[]> {
    try {
      // Get categories (from cache or Appwrite)
      const categories = await this.getAll();
      
      // Get ALL subjects in one request
      const subjectsResponse = await databases.listDocuments(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        [
          Query.equal('isActive', true),
          Query.limit(1000)
        ]
      );
      
      const subjects = subjectsResponse.documents as Subject[];
      
      // Link client-side (no additional requests!)
      const categoriesWithCount = categories.map(category => ({
        ...category,
        subjectsCount: subjects.filter(s => s.categoryId === category.$id).length
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
   * Get subjects for a category
   */
  async getSubjects(categoryId: string): Promise<Subject[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        [
          Query.equal('categoryId', categoryId),
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
   * Get material by ID (with fileType populated)
   */
  async getById(id: string): Promise<Material> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        id
      );
      
      const material = response as any;
      
      // Populate fileType if available
      if (material.fileTypeId) {
        try {
          const fileType = await databases.getDocument(
            DATABASE_ID,
            FILETYPES_COLLECTION_ID,
            material.fileTypeId
          );
          return { ...material, fileType } as Material;
        } catch (err) {
          console.warn(`⚠️ Could not fetch fileType for material ${id}:`, err);
        }
      }
      
      return material as Material;
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
   * Get post by ID
   */
  async getById(id: string): Promise<Post> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        POSTS_COLLECTION_ID,
        id
      );
      return response as Post;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }
};

/**
 * Search API - Context-Aware
 */
export const searchApi = {
  /**
   * Global search - Search across everything (Level 1)
   */
  async globalSearch(query: string): Promise<{
    categories: Category[];
    subjects: Subject[];
    materials: Material[];
    posts: Post[];
  }> {
    try {
      // Fetch all data and filter client-side (more reliable than Appwrite search)
      const [categoriesRes, subjectsRes, materialsRes, postsRes] = await Promise.all([
        // Get all active categories
        databases.listDocuments(
          DATABASE_ID,
          CATEGORIES_COLLECTION_ID,
          [
            Query.equal('isActive', true),
            Query.limit(100)
          ]
        ),
        // Get all active subjects
        databases.listDocuments(
          DATABASE_ID,
          SUBJECTS_COLLECTION_ID,
          [
            Query.equal('isActive', true),
            Query.limit(200)
          ]
        ),
        // Get recent materials
        databases.listDocuments(
          DATABASE_ID,
          MATERIALS_COLLECTION_ID,
          [
            Query.orderDesc('$createdAt'),
            Query.limit(100)
          ]
        ),
        // Get recent posts
        databases.listDocuments(
          DATABASE_ID,
          POSTS_COLLECTION_ID,
          [
            Query.orderDesc('$createdAt'),
            Query.limit(100)
          ]
        )
      ]);

      // Client-side filtering for better search results
      const searchLower = query.toLowerCase();
      
      const filteredCategories = (categoriesRes.documents as Category[])
        .filter(cat => 
          cat.nameEn?.toLowerCase().includes(searchLower) ||
          cat.nameAr?.toLowerCase().includes(searchLower) ||
          cat.descriptionEn?.toLowerCase().includes(searchLower) ||
          cat.descriptionAr?.toLowerCase().includes(searchLower)
        )
        .slice(0, 5);

      const filteredSubjects = (subjectsRes.documents as Subject[])
        .filter(sub => 
          sub.nameEn?.toLowerCase().includes(searchLower) ||
          sub.nameAr?.toLowerCase().includes(searchLower) ||
          sub.descriptionEn?.toLowerCase().includes(searchLower) ||
          sub.descriptionAr?.toLowerCase().includes(searchLower)
        )
        .slice(0, 10);

      // Populate fileType for materials
      const materialsWithFileType = await Promise.all(
        (materialsRes.documents as Material[]).map(async (material: any) => {
          if (material.fileTypeId) {
            try {
              const fileType = await databases.getDocument(
                DATABASE_ID,
                FILETYPES_COLLECTION_ID,
                material.fileTypeId
              );
              return { ...material, fileType };
            } catch (err) {
              return material;
            }
          }
          return material;
        })
      );

      const filteredMaterials = materialsWithFileType
        .filter((mat: any) => 
          mat.title?.toLowerCase().includes(searchLower) ||
          mat.description?.toLowerCase().includes(searchLower)
        )
        .slice(0, 10);

      const filteredPosts = (postsRes.documents as Post[])
        .filter(post => 
          post.contentText?.toLowerCase().includes(searchLower) ||
          post.linkURL?.toLowerCase().includes(searchLower)
        )
        .slice(0, 10);

      // Enrich materials with uploader names
      const enrichedMaterials = await enrichMaterialsWithUploaderNames(filteredMaterials);
      
      // Add subject info to materials
      const materialsWithSubject = await Promise.all(
        enrichedMaterials.map(async (material: any) => {
          if (material.subjectId) {
            try {
              const subject = await databases.getDocument(
                DATABASE_ID,
                SUBJECTS_COLLECTION_ID,
                material.subjectId
              );
              return { ...material, subject };
            } catch (err) {
              return material;
            }
          }
          return material;
        })
      );

      // Fetch uploader information AND subject info for filtered posts
      const postsWithUploaders = await Promise.all(
        filteredPosts.map(async (post) => {
          try {
            const [uploader, subject] = await Promise.all([
              databases.getDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                post.uploaderId
              ),
              databases.getDocument(
                DATABASE_ID,
                SUBJECTS_COLLECTION_ID,
                post.subjectId
              )
            ]);
            return {
              ...post,
              uploaderName: uploader.name || uploader.email || 'Unknown User',
              subject
            };
          } catch (error) {
            return {
              ...post,
              uploaderName: 'Unknown User'
            };
          }
        })
      );

      return {
        categories: filteredCategories,
        subjects: filteredSubjects,
        materials: materialsWithSubject,
        posts: postsWithUploaders
      };
    } catch (error) {
      console.error('Error in global search:', error);
      throw error;
    }
  },

  /**
   * Category search - Search subjects, materials, and posts within a category (Level 2)
   */
  async searchInCategory(categoryId: string, query: string): Promise<{
    subjects: Subject[];
    materials: Material[];
    posts: Post[];
  }> {
    try {
      // Get all subjects in this category first
      const subjectsResponse = await databases.listDocuments(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        [
          Query.equal('categoryId', categoryId),
          Query.equal('isActive', true),
          Query.limit(100)
        ]
      );

      const subjects = subjectsResponse.documents as Subject[];
      const subjectIds = subjects.map(s => s.$id);

      console.log(`[Level 2 Search] Category: ${categoryId}, Query: "${query}"`);
      console.log(`[Level 2 Search] Found ${subjects.length} subjects in category`);

      // Fetch materials for each subject (materials don't have categoryId, only subjectId)
      let allMaterialsArray: any[] = [];
      if (subjectIds.length > 0) {
        const materialsPromises = subjectIds.map(subjectId =>
          databases.listDocuments(
            DATABASE_ID,
            MATERIALS_COLLECTION_ID,
            [
              Query.equal('subjectId', subjectId),
              Query.limit(50)
            ]
          )
        );
        const materialsResults = await Promise.all(materialsPromises);
        allMaterialsArray = materialsResults.flatMap(res => res.documents);
      }

      console.log(`[Level 2 Search] Found ${allMaterialsArray.length} materials in category`);

      // Fetch posts for each subject (Appwrite doesn't support array in Query.equal)
      let allPosts: any[] = [];
      if (subjectIds.length > 0) {
        const postsPromises = subjectIds.map(subjectId =>
          databases.listDocuments(
            DATABASE_ID,
            POSTS_COLLECTION_ID,
            [
              Query.equal('subjectId', subjectId),
              Query.limit(50)
            ]
          )
        );
        const postsResults = await Promise.all(postsPromises);
        allPosts = postsResults.flatMap(res => res.documents);
      }

      console.log(`[Level 2 Search] Found ${allPosts.length} posts in category`);

      const searchLower = query.toLowerCase();

      // Filter subjects
      const filteredSubjects = subjects.filter(sub => 
        sub.nameEn?.toLowerCase().includes(searchLower) ||
        sub.nameAr?.toLowerCase().includes(searchLower) ||
        sub.descriptionEn?.toLowerCase().includes(searchLower) ||
        sub.descriptionAr?.toLowerCase().includes(searchLower)
      );

      // Enrich ALL materials first (don't filter yet)
      const allMaterials = allMaterialsArray as Material[];
      const enrichedMaterials = await enrichMaterialsWithUploaderNames(allMaterials);
      
      // Add subject and fileType info to ALL materials
      const materialsWithInfo = await Promise.all(
        enrichedMaterials.map(async (material: any) => {
          try {
            const [subject, fileType] = await Promise.all([
              material.subjectId ? databases.getDocument(DATABASE_ID, SUBJECTS_COLLECTION_ID, material.subjectId) : null,
              material.fileTypeId ? databases.getDocument(DATABASE_ID, FILETYPES_COLLECTION_ID, material.fileTypeId) : null
            ]);
            return { ...material, subject, fileType };
          } catch (err) {
            return material;
          }
        })
      );

      // NOW filter materials after enrichment
      const filteredMaterials = materialsWithInfo.filter((mat: any) => 
        mat.title?.toLowerCase().includes(searchLower) ||
        mat.description?.toLowerCase().includes(searchLower)
      );

      // Enrich ALL posts first (don't filter yet)
      const postsWithInfo = await Promise.all(
        (allPosts as Post[]).map(async (post) => {
          try {
            const [uploader, subject] = await Promise.all([
              databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, post.uploaderId),
              databases.getDocument(DATABASE_ID, SUBJECTS_COLLECTION_ID, post.subjectId)
            ]);
            return {
              ...post,
              uploaderName: uploader.name || uploader.email || 'Unknown User',
              subject
            };
          } catch (error) {
            return {
              ...post,
              uploaderName: 'Unknown User'
            };
          }
        })
      );

      // NOW filter posts after enrichment
      const filteredPosts = postsWithInfo.filter((post: any) => 
        post.contentText?.toLowerCase().includes(searchLower) ||
        post.linkURL?.toLowerCase().includes(searchLower)
      );

      console.log(`[Level 2 Search] After filtering: ${filteredSubjects.length} subjects, ${filteredMaterials.length} materials, ${filteredPosts.length} posts`);

      return {
        subjects: filteredSubjects,
        materials: filteredMaterials,
        posts: filteredPosts
      };
    } catch (error) {
      console.error('Error in category search:', error);
      throw error;
    }
  },

  /**
   * Subject search - Search materials and posts within a subject (Level 3)
   */
  async searchInSubject(subjectId: string, query: string): Promise<{
    materials: Material[];
    posts: Post[];
  }> {
    try {
      const [materialsRes, postsRes] = await Promise.all([
        databases.listDocuments(
          DATABASE_ID,
          MATERIALS_COLLECTION_ID,
          [
            Query.equal('subjectId', subjectId),
            Query.limit(100)
          ]
        ),
        databases.listDocuments(
          DATABASE_ID,
          POSTS_COLLECTION_ID,
          [
            Query.equal('subjectId', subjectId),
            Query.limit(100)
          ]
        )
      ]);

      const searchLower = query.toLowerCase();

      const filteredMaterials = (materialsRes.documents as Material[])
        .filter(mat => 
          mat.title?.toLowerCase().includes(searchLower) ||
          mat.description?.toLowerCase().includes(searchLower)
        );

      const filteredPosts = (postsRes.documents as Post[])
        .filter(post => 
          post.contentText?.toLowerCase().includes(searchLower)
        );

      // Enrich materials with uploader names
      const enrichedMaterials = await enrichMaterialsWithUploaderNames(filteredMaterials);

      // Fetch uploader information for filtered posts
      const postsWithUploaders = await Promise.all(
        filteredPosts.map(async (post) => {
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
            return {
              ...post,
              uploaderName: 'Unknown User'
            };
          }
        })
      );

      return {
        materials: enrichedMaterials,
        posts: postsWithUploaders
      };
    } catch (error) {
      console.error('Error in subject search:', error);
      throw error;
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
