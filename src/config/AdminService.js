import { databases, ID, Query } from './appwrite';
import { 
  DATABASE_ID, 
  CATEGORIES_COLLECTION_ID, 
  MATERIALS_COLLECTION_ID,
  SUBJECTS_COLLECTION_ID 
} from './appwrite';

/**
 * AdminService - Service for admin operations on categories, materials, and files
 */
class AdminService {
  // ==================== CATEGORIES ====================
  
  /**
   * Get all categories
   */
  async getAllCategories() {
    try {
      console.log('📂 AdminService: Fetching all categories...');
      const response = await databases.listDocuments(
        DATABASE_ID,
        CATEGORIES_COLLECTION_ID,
        [Query.orderAsc('order')]
      );
      console.log('✅ Categories fetched:', response.documents.length);
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Create a new category
   */
  async createCategory(categoryData) {
    try {
      console.log('➕ AdminService: Creating category...', categoryData);
      // Generate slug from nameEn
      const slug = categoryData.nameEn
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .trim();
      
      const response = await databases.createDocument(
        DATABASE_ID,
        CATEGORIES_COLLECTION_ID,
        ID.unique(),
        {
          nameAr: categoryData.nameAr,
          nameEn: categoryData.nameEn,
          slug: slug,
          descriptionAr: categoryData.descriptionAr || '',
          descriptionEn: categoryData.descriptionEn || '',
          icon: categoryData.icon || '',
          color: categoryData.color || '#3B82F6',
          order: categoryData.order || 0,
          isActive: categoryData.isActive !== false
        }
      );
      console.log('✅ Category created:', response.$id);
      return response;
    } catch (error) {
      console.error('❌ Error creating category:', error);
      throw error;
    }
  }

  /**
   * Update a category
   */
  async updateCategory(categoryId, categoryData) {
    try {
      console.log('✏️ AdminService: Updating category...', categoryId);
      const response = await databases.updateDocument(
        DATABASE_ID,
        CATEGORIES_COLLECTION_ID,
        categoryId,
        categoryData
      );
      console.log('✅ Category updated:', categoryId);
      return response;
    } catch (error) {
      console.error('❌ Error updating category:', error);
      throw error;
    }
  }

  /**
   * Delete a category
   */
  async deleteCategory(categoryId) {
    try {
      console.log('🗑️ AdminService: Deleting category...', categoryId);
      await databases.deleteDocument(
        DATABASE_ID,
        CATEGORIES_COLLECTION_ID,
        categoryId
      );
      console.log('✅ Category deleted:', categoryId);
      return true;
    } catch (error) {
      console.error('❌ Error deleting category:', error);
      throw error;
    }
  }

  // ==================== SUBJECTS ====================
  
  /**
   * Get subjects by category
   */
  async getSubjectsByCategory(categoryId) {
    try {
      console.log('📚 AdminService: Fetching subjects for category...', categoryId);
      const response = await databases.listDocuments(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        [Query.equal('categoryId', categoryId)]
      );
      console.log('✅ Subjects fetched:', response.documents.length);
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching subjects:', error);
      throw error;
    }
  }

  /**
   * Create a new subject
   */
  async createSubject(subjectData) {
    try {
      console.log('➕ AdminService: Creating subject...', subjectData);
      const response = await databases.createDocument(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        ID.unique(),
        {
          nameAr: subjectData.nameAr,
          nameEn: subjectData.nameEn,
          descriptionAr: subjectData.descriptionAr || '',
          descriptionEn: subjectData.descriptionEn || '',
          categoryId: subjectData.categoryId,
          creditHours: subjectData.creditHours || 0,
          level: subjectData.level || '',
          prerequisite: subjectData.prerequisite || '',
          isActive: subjectData.isActive !== false
        }
      );
      console.log('✅ Subject created:', response.$id);
      return response;
    } catch (error) {
      console.error('❌ Error creating subject:', error);
      throw error;
    }
  }

  /**
   * Update a subject
   */
  async updateSubject(subjectId, subjectData) {
    try {
      console.log('✏️ AdminService: Updating subject...', subjectId);
      const response = await databases.updateDocument(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        subjectId,
        subjectData
      );
      console.log('✅ Subject updated:', subjectId);
      return response;
    } catch (error) {
      console.error('❌ Error updating subject:', error);
      throw error;
    }
  }

  /**
   * Delete a subject
   */
  async deleteSubject(subjectId) {
    try {
      console.log('🗑️ AdminService: Deleting subject...', subjectId);
      await databases.deleteDocument(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        subjectId
      );
      console.log('✅ Subject deleted:', subjectId);
      return true;
    } catch (error) {
      console.error('❌ Error deleting subject:', error);
      throw error;
    }
  }

  // ==================== MATERIALS ====================
  
  /**
   * Get all materials with pagination
   */
  async getAllMaterials(limit = 25, offset = 0) {
    try {
      console.log('📄 AdminService: Fetching materials...', { limit, offset });
      const response = await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [
          Query.limit(limit),
          Query.offset(offset),
          Query.orderDesc('$createdAt')
        ]
      );
      console.log('✅ Materials fetched:', response.documents.length);
      return {
        documents: response.documents,
        total: response.total
      };
    } catch (error) {
      console.error('❌ Error fetching materials:', error);
      throw error;
    }
  }

  /**
   * Get materials by category
   */
  async getMaterialsByCategory(categoryId, limit = 25, offset = 0) {
    try {
      console.log('📄 AdminService: Fetching materials by category...', categoryId);
      const response = await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [
          Query.equal('categoryId', categoryId),
          Query.limit(limit),
          Query.offset(offset),
          Query.orderDesc('$createdAt')
        ]
      );
      console.log('✅ Materials fetched:', response.documents.length);
      return {
        documents: response.documents,
        total: response.total
      };
    } catch (error) {
      console.error('❌ Error fetching materials by category:', error);
      throw error;
    }
  }

  /**
   * Search materials by title
   */
  async searchMaterials(searchTerm, limit = 25) {
    try {
      console.log('🔍 AdminService: Searching materials...', searchTerm);
      const response = await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [
          Query.search('title', searchTerm),
          Query.limit(limit)
        ]
      );
      console.log('✅ Materials found:', response.documents.length);
      return response.documents;
    } catch (error) {
      console.error('❌ Error searching materials:', error);
      throw error;
    }
  }

  /**
   * Create a new material
   */
  async createMaterial(materialData) {
    try {
      console.log('➕ AdminService: Creating material...', materialData);
      const response = await databases.createDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        ID.unique(),
        materialData
      );
      console.log('✅ Material created:', response.$id);
      return response;
    } catch (error) {
      console.error('❌ Error creating material:', error);
      throw error;
    }
  }

  /**
   * Update a material
   */
  async updateMaterial(materialId, materialData) {
    try {
      console.log('✏️ AdminService: Updating material...', materialId);
      const response = await databases.updateDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        materialId,
        materialData
      );
      console.log('✅ Material updated:', materialId);
      return response;
    } catch (error) {
      console.error('❌ Error updating material:', error);
      throw error;
    }
  }

  /**
   * Delete a material
   */
  async deleteMaterial(materialId) {
    try {
      console.log('🗑️ AdminService: Deleting material...', materialId);
      await databases.deleteDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        materialId
      );
      console.log('✅ Material deleted:', materialId);
      return true;
    } catch (error) {
      console.error('❌ Error deleting material:', error);
      throw error;
    }
  }

  /**
   * Reassign material to different category
   */
  async reassignMaterialCategory(materialId, newCategoryId, newSubjectId = null) {
    try {
      console.log('🔄 AdminService: Reassigning material...', { materialId, newCategoryId, newSubjectId });
      const updateData = {
        categoryId: newCategoryId
      };
      if (newSubjectId) {
        updateData.subjectId = newSubjectId;
      }
      const response = await databases.updateDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        materialId,
        updateData
      );
      console.log('✅ Material reassigned:', materialId);
      return response;
    } catch (error) {
      console.error('❌ Error reassigning material:', error);
      throw error;
    }
  }

  // ==================== STATISTICS ====================
  
  /**
   * Get admin statistics
   */
  async getAdminStats() {
    try {
      console.log('📊 AdminService: Fetching admin statistics...');
      
      const [categories, materials, subjects] = await Promise.all([
        databases.listDocuments(DATABASE_ID, CATEGORIES_COLLECTION_ID, [Query.limit(1)]),
        databases.listDocuments(DATABASE_ID, MATERIALS_COLLECTION_ID, [Query.limit(1)]),
        databases.listDocuments(DATABASE_ID, SUBJECTS_COLLECTION_ID, [Query.limit(1)])
      ]);

      const stats = {
        totalCategories: categories.total,
        totalMaterials: materials.total,
        totalSubjects: subjects.total
      };

      console.log('✅ Admin stats fetched:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Error fetching admin stats:', error);
      throw error;
    }
  }
}

export default new AdminService();
