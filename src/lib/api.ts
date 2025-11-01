/**
 * API Client for Materials/Subjects Feature
 * Integrates with existing Appwrite services
 */

import { hierarchyService } from '../services/hierarchyService';
import { 
  materialsService, 
  postsService, 
  educationalPurposesService,
  fileTypesService,
  bookmarksService,
  subjectsService
} from '../services/appwriteService';
import type {
  Category,
  Subject,
  Material,
  Post,
  EducationalPurpose,
  SearchResults,
  MaterialsQueryParams,
  PostsQueryParams,
  SearchQueryParams,
  PaginatedResponse,
} from '../types/database';

/**
 * Categories API
 */
export const categoriesApi = {
  /**
   * Get all categories with hierarchy
   */
  async getAll(): Promise<Category[]> {
    const hierarchy = await hierarchyService.getCompleteHierarchy();
    return hierarchy;
  },

  /**
   * Get category by ID with subjects
   */
  async getById(id: string): Promise<Category> {
    const category = await hierarchyService.getCategoryHierarchy(id);
    return category;
  },

  /**
   * Get subjects for a category
   */
  async getSubjects(id: string): Promise<Subject[]> {
    const category = await hierarchyService.getCategoryHierarchy(id);
    return category.subjects || [];
  },
};

/**
 * Subjects API
 */
export const subjectsApi = {
  /**
   * Get subjects by category ID
   */
  async getByCategory(categoryId: string): Promise<Subject[]> {
    const subjects = await subjectsService.getByCategory(categoryId);
    return subjects;
  },

  /**
   * Get subject by ID with materials
   */
  async getById(id: string): Promise<Subject> {
    const subject = await hierarchyService.getSubjectHierarchy(id);
    return subject;
  },

  /**
   * Get educational purposes for a subject
   */
  async getPurposes(id: string): Promise<EducationalPurpose[]> {
    // Get all active purposes
    // In production, this should filter by subject if needed
    const purposes = await educationalPurposesService.getAll();
    return purposes.filter(p => p.isActive !== false);
  },

  /**
   * Search within a subject
   */
  async search(id: string, query: string): Promise<SearchResults> {
    const subject = await hierarchyService.getSubjectHierarchy(id);
    const materials = subject.materials || [];
    const posts = await postsService.getBySubject(id);

    // Filter by query
    const filteredMaterials = materials.filter(m =>
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.description?.toLowerCase().includes(query.toLowerCase())
    );

    const filteredPosts = posts.filter(p =>
      p.contentText?.toLowerCase().includes(query.toLowerCase())
    );

    return {
      categories: [],
      subjects: [],
      materials: filteredMaterials,
      posts: filteredPosts,
    };
  },
};

/**
 * Educational Purposes API
 */
export const purposesApi = {
  /**
   * Get all educational purposes from database
   */
  async getAll(): Promise<EducationalPurpose[]> {
    const purposes = await educationalPurposesService.getAll();
    return purposes.filter(p => p.isActive !== false);
  },

  /**
   * Get purposes that allow links
   */
  async getLinkAllowed(): Promise<EducationalPurpose[]> {
    const purposes = await educationalPurposesService.getLinkAllowed();
    return purposes;
  },
};

/**
 * Materials API
 */
export const materialsApi = {
  /**
   * Get materials with filters
   */
  async getList(params: MaterialsQueryParams): Promise<PaginatedResponse<Material>> {
    const { subjectId, educationalPurposeId, fileTypeId, q } = params;
    
    // Get subject materials
    if (subjectId) {
      const subject = await hierarchyService.getSubjectHierarchy(subjectId);
      let materials = subject.materials || [];

      // Filter by educational purpose
      if (educationalPurposeId) {
        // Get all fileTypes for this educational purpose
        const allFileTypes = await fileTypesService.getAll();
        const relevantFileTypeIds = allFileTypes
          .filter(ft => ft.educationalPurposeId === educationalPurposeId)
          .map(ft => ft.$id);
        
        // Filter materials by:
        // 1. Direct educationalPurposeId (if exists)
        // 2. Or via fileType → educationalPurposeId
        materials = materials.filter(m => 
          m.educationalPurposeId === educationalPurposeId ||
          (m.fileTypeId && relevantFileTypeIds.includes(m.fileTypeId))
        );
      }

      // Filter by file type
      if (fileTypeId) {
        materials = materials.filter(m => m.fileTypeId === fileTypeId);
      }

      // Filter by search query
      if (q) {
        materials = materials.filter(m =>
          m.title.toLowerCase().includes(q.toLowerCase()) ||
          m.description?.toLowerCase().includes(q.toLowerCase())
        );
      }

      return {
        data: materials,
        total: materials.length,
        page: 1,
        limit: materials.length,
        hasMore: false,
      };
    }

    return {
      data: [],
      total: 0,
      page: 1,
      limit: 0,
      hasMore: false,
    };
  },

  /**
   * Get material by ID
   */
  async getById(id: string): Promise<Material> {
    const material = await materialsService.getById(id);
    return material;
  },
};

/**
 * Posts API
 */
export const postsApi = {
  /**
   * Get posts with filters
   */
  async getList(params: PostsQueryParams): Promise<PaginatedResponse<Post>> {
    const { subjectId, educationalPurposeId, q } = params;

    if (subjectId) {
      let posts = await postsService.getBySubject(subjectId);

      // Filter by educational purpose
      if (educationalPurposeId) {
        posts = posts.filter(p => p.educationalPurposeId === educationalPurposeId);
      }

      // Filter by search query
      if (q) {
        posts = posts.filter(p =>
          p.contentText?.toLowerCase().includes(q.toLowerCase())
        );
      }

      return {
        data: posts,
        total: posts.length,
        page: 1,
        limit: posts.length,
        hasMore: false,
      };
    }

    return {
      data: [],
      total: 0,
      page: 1,
      limit: 0,
      hasMore: false,
    };
  },

  /**
   * Get post by ID
   */
  async getById(id: string): Promise<Post> {
    const post = await postsService.getById(id);
    return post;
  },
};

/**
 * Global Search API
 */
export const searchApi = {
  /**
   * Search across all content types
   */
  async search(params: SearchQueryParams): Promise<SearchResults> {
    const { q, limit = 10 } = params;
    const query = q.toLowerCase();

    // Get all data
    const [categories, hierarchy] = await Promise.all([
      hierarchyService.getCompleteHierarchy(),
      hierarchyService.getCompleteHierarchy(),
    ]);

    // Extract subjects from hierarchy
    const subjects = hierarchy.flatMap(cat => cat.subjects || []);

    // Search categories
    const filteredCategories = categories
      .filter(c =>
        c.nameAr.toLowerCase().includes(query) ||
        c.nameEn.toLowerCase().includes(query) ||
        c.descriptionAr?.toLowerCase().includes(query) ||
        c.descriptionEn?.toLowerCase().includes(query)
      )
      .slice(0, limit);

    // Search subjects
    const filteredSubjects = subjects
      .filter(s =>
        s.nameAr.toLowerCase().includes(query) ||
        s.nameEn.toLowerCase().includes(query) ||
        s.descriptionAr?.toLowerCase().includes(query) ||
        s.descriptionEn?.toLowerCase().includes(query)
      )
      .slice(0, limit);

    // Search materials (from all subjects)
    const allMaterials = subjects.flatMap(s => s.materials || []);
    const filteredMaterials = allMaterials
      .filter(m =>
        m.title.toLowerCase().includes(query) ||
        m.description?.toLowerCase().includes(query)
      )
      .slice(0, limit);

    // Search posts (would need to fetch from all subjects)
    // For now, return empty array
    const filteredPosts: Post[] = [];

    return {
      categories: filteredCategories,
      subjects: filteredSubjects,
      materials: filteredMaterials,
      posts: filteredPosts,
    };
  },
};

/**
 * Bookmarks API
 */
export const bookmarksApi = {
  /**
   * Get user bookmarks
   */
  async getByUser(userId: string): Promise<string[]> {
    const bookmarks = await bookmarksService.getByUser(userId);
    return bookmarks.map(b => b.fileId);
  },

  /**
   * Toggle bookmark
   */
  async toggle(materialId: string): Promise<{ bookmarked: boolean }> {
    const result = await bookmarksService.toggle(materialId);
    return result;
  },
};

/**
 * File Types API
 */
export const fileTypesApi = {
  /**
   * Get all file types
   */
  async getAll() {
    const types = await fileTypesService.getAll();
    return types;
  },
};
