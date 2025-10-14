import { 
  databases, 
  storage, 
  account,
  DATABASE_ID, 
  USERS_COLLECTION_ID,
  MATERIALS_COLLECTION_ID,
  CATEGORIES_COLLECTION_ID,
  SUBJECTS_COLLECTION_ID,
  FILE_TYPES_COLLECTION_ID,
  BOOKMARKS_COLLECTION_ID,
  DOWNLOADS_COLLECTION_ID,
  PROFILES_COLLECTION_ID,
  STORAGE_BUCKET_ID,
  Query,
  ID,
  Permission,
  Role
} from '../config/appwrite';

/**
 * 🚀 Comprehensive Appwrite Service Layer
 * Handles all database operations for Fyleo platform
 */

// ============================================
// 📁 CATEGORIES SERVICE
// ============================================
export const categoriesService = {
  /**
   * Get all active categories
   */
  async getAll(limit = 100) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        CATEGORIES_COLLECTION_ID,
        [
          Query.equal('isActive', true),
          Query.orderAsc('order'),
          Query.limit(limit)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Get category by ID
   */
  async getById(categoryId) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        CATEGORIES_COLLECTION_ID,
        categoryId
      );
      return response;
    } catch (error) {
      console.error('❌ Error fetching category:', error);
      throw error;
    }
  },

  /**
   * Create new category (Admin only)
   */
  async create(categoryData) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        CATEGORIES_COLLECTION_ID,
        ID.unique(),
        {
          nameAr: categoryData.nameAr,
          nameEn: categoryData.nameEn,
          descriptionAr: categoryData.descriptionAr || '',
          descriptionEn: categoryData.descriptionEn || '',
          icon: categoryData.icon || '📚',
          color: categoryData.color || '#3B82F6',
          order: categoryData.order || 0,
          isActive: categoryData.isActive !== false
        }
      );
      return response;
    } catch (error) {
      console.error('❌ Error creating category:', error);
      throw error;
    }
  },

  /**
   * Update category
   */
  async update(categoryId, updates) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        CATEGORIES_COLLECTION_ID,
        categoryId,
        updates
      );
      return response;
    } catch (error) {
      console.error('❌ Error updating category:', error);
      throw error;
    }
  },

  /**
   * Delete category
   */
  async delete(categoryId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        CATEGORIES_COLLECTION_ID,
        categoryId
      );
      return true;
    } catch (error) {
      console.error('❌ Error deleting category:', error);
      throw error;
    }
  }
};

// ============================================
// 📚 SUBJECTS SERVICE
// ============================================
export const subjectsService = {
  /**
   * Get all subjects
   */
  async getAll(limit = 200) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        [
          Query.equal('isActive', true),
          Query.orderAsc('nameEn'),
          Query.limit(limit)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching subjects:', error);
      throw error;
    }
  },

  /**
   * Get subjects by category
   */
  async getByCategory(categoryId, limit = 100) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        [
          Query.equal('categoryId', categoryId),
          Query.equal('isActive', true),
          Query.orderAsc('nameEn'),
          Query.limit(limit)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching subjects by category:', error);
      throw error;
    }
  },

  /**
   * Get subject by ID
   */
  async getById(subjectId) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        subjectId
      );
      return response;
    } catch (error) {
      console.error('❌ Error fetching subject:', error);
      throw error;
    }
  },

  /**
   * Create new subject (Admin only)
   */
  async create(subjectData) {
    try {
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
          creditHours: subjectData.creditHours || 3,
          level: String(subjectData.level || 1), // Convert to string
          prerequisite: subjectData.prerequisite || '',
          isActive: subjectData.isActive !== false
        }
      );
      return response;
    } catch (error) {
      console.error('❌ Error creating subject:', error);
      throw error;
    }
  },

  /**
   * Update subject
   */
  async update(subjectId, updates) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        subjectId,
        updates
      );
      return response;
    } catch (error) {
      console.error('❌ Error updating subject:', error);
      throw error;
    }
  },

  /**
   * Delete subject
   */
  async delete(subjectId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        subjectId
      );
      return true;
    } catch (error) {
      console.error('❌ Error deleting subject:', error);
      throw error;
    }
  }
};

// ============================================
// 📄 FILE TYPES SERVICE
// ============================================
export const fileTypesService = {
  /**
   * Get all file types
   */
  async getAll(limit = 50) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        FILE_TYPES_COLLECTION_ID,
        [
          Query.orderAsc('nameEn'),
          Query.limit(limit)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching file types:', error);
      throw error;
    }
  },

  /**
   * Get file type by ID
   */
  async getById(fileTypeId) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        FILE_TYPES_COLLECTION_ID,
        fileTypeId
      );
      return response;
    } catch (error) {
      console.error('❌ Error fetching file type:', error);
      throw error;
    }
  },

  /**
   * Create new file type (Admin only)
   */
  async create(fileTypeData) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        FILE_TYPES_COLLECTION_ID,
        ID.unique(),
        {
          name: fileTypeData.name,
          nameAr: fileTypeData.nameAr,
          nameEn: fileTypeData.nameEn,
          icon: fileTypeData.icon || '📄',
          color: fileTypeData.color || '#6B7280',
          allowedFormats: Array.isArray(fileTypeData.allowedFormats) 
            ? fileTypeData.allowedFormats.join(',') 
            : (fileTypeData.allowedFormats || '')
        }
      );
      return response;
    } catch (error) {
      console.error('❌ Error creating file type:', error);
      throw error;
    }
  }
};

// ============================================
// 📦 MATERIALS SERVICE
// ============================================
export const materialsService = {
  /**
   * Get all materials
   */
  async getAll(limit = 50, offset = 0) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [
          Query.orderDesc('$createdAt'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      );
      return response;
    } catch (error) {
      console.error('❌ Error fetching materials:', error);
      throw error;
    }
  },

  /**
   * Get materials by category
   */
  async getByCategory(categoryId, limit = 50) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [
          Query.equal('categoryId', categoryId),
          Query.orderDesc('$createdAt'),
          Query.limit(limit)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching materials by category:', error);
      throw error;
    }
  },

  /**
   * Get materials by subject
   */
  async getBySubject(subjectId, limit = 50) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [
          Query.equal('subjectId', subjectId),
          Query.orderDesc('$createdAt'),
          Query.limit(limit)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching materials by subject:', error);
      throw error;
    }
  },

  /**
   * Get material by ID
   */
  async getById(materialId) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        materialId
      );
      return response;
    } catch (error) {
      console.error('❌ Error fetching material:', error);
      throw error;
    }
  },

  /**
   * Create new material
   */
  async create(materialData) {
    try {
      const user = await account.get();
      
      const response = await databases.createDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        ID.unique(),
        {
          title: materialData.title,
          description: materialData.description || '',
          categoryId: materialData.categoryId,
          subjectId: materialData.subjectId,
          fileTypeId: materialData.fileTypeId,
          fileId: materialData.fileId,
          uploaderId: user.$id,
          fileName: materialData.fileName,
          fileSize: materialData.fileSize,
          mimeType: materialData.mimeType,
          downloadURL: materialData.downloadURL,
          viewURL: materialData.viewURL || '',
          tags: materialData.tags || [],
          semester: materialData.semester || '',
          year: materialData.year || new Date().getFullYear()
        }
      );
      return response;
    } catch (error) {
      console.error('❌ Error creating material:', error);
      throw error;
    }
  },

  /**
   * Update material
   */
  async update(materialId, updates) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        materialId,
        updates
      );
      return response;
    } catch (error) {
      console.error('❌ Error updating material:', error);
      throw error;
    }
  },

  /**
   * Delete material
   */
  async delete(materialId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        materialId
      );
      return true;
    } catch (error) {
      console.error('❌ Error deleting material:', error);
      throw error;
    }
  },

  /**
   * Search materials
   */
  async search(searchTerm, limit = 50) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [
          Query.search('title', searchTerm),
          Query.orderDesc('$createdAt'),
          Query.limit(limit)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error searching materials:', error);
      throw error;
    }
  },

  /**
   * Get materials by uploader
   */
  async getByUploader(uploaderId, limit = 50) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [
          Query.equal('uploaderId', uploaderId),
          Query.orderDesc('$createdAt'),
          Query.limit(limit)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching materials by uploader:', error);
      throw error;
    }
  },

  /**
   * Get download count for material
   */
  async getDownloadCount(materialId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        DOWNLOADS_COLLECTION_ID,
        [
          Query.equal('fileId', materialId),
          Query.limit(1)
        ]
      );
      return response.total || 0;
    } catch (error) {
      console.error('❌ Error fetching download count:', error);
      return 0;
    }
  }
};

// ============================================
// 👤 USERS SERVICE
// ============================================
export const usersService = {
  /**
   * Create user record in database
   */
  async create(userData) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        {
          name: userData.name,
          email: userData.email
        }
      );
      return response;
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  },

  /**
   * Get user by email
   */
  async getByEmail(email) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('email', email)]
      );
      return response.documents.length > 0 ? response.documents[0] : null;
    } catch (error) {
      console.error('❌ Error fetching user by email:', error);
      throw error;
    }
  },

  /**
   * Get user by ID
   */
  async getById(userId) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId
      );
      return response;
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      throw error;
    }
  }
};

// ============================================
// 👥 USER PROFILES SERVICE
// ============================================
export const userProfilesService = {
  /**
   * Create user profile
   */
  async create(profileData) {
    try {
      const user = await account.get();
      
      const response = await databases.createDocument(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          bio: profileData.bio || '',
          profilePicture: profileData.profilePicture || '',
          website: profileData.website || '',
          dateOfBirth: profileData.dateOfBirth || '',
          location: profileData.location || '',
          gender: profileData.gender || '',
          university: profileData.university || '',
          major: profileData.major || '',
          semester: profileData.semester || ''
        }
      );
      return response;
    } catch (error) {
      console.error('❌ Error creating user profile:', error);
      throw error;
    }
  },

  /**
   * Get profile by user ID
   */
  async getByUserId(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        [Query.equal('userId', userId)]
      );
      return response.documents.length > 0 ? response.documents[0] : null;
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  async update(profileId, updates) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        profileId,
        updates
      );
      return response;
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw error;
    }
  }
};

// ============================================
// 🔖 BOOKMARKS SERVICE
// ============================================
export const bookmarksService = {
  /**
   * Create bookmark
   */
  async create(fileId) {
    try {
      const user = await account.get();
      
      // Check if already bookmarked
      const existing = await this.getByUserAndFile(user.$id, fileId);
      if (existing) {
        return existing;
      }
      
      const response = await databases.createDocument(
        DATABASE_ID,
        BOOKMARKS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          fileId: fileId
        }
      );
      return response;
    } catch (error) {
      console.error('❌ Error creating bookmark:', error);
      throw error;
    }
  },

  /**
   * Get user bookmarks
   */
  async getByUser(userId, limit = 50) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        BOOKMARKS_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(limit)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching bookmarks:', error);
      throw error;
    }
  },

  /**
   * Check if file is bookmarked by user
   */
  async getByUserAndFile(userId, fileId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        BOOKMARKS_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.equal('fileId', fileId)
        ]
      );
      return response.documents.length > 0 ? response.documents[0] : null;
    } catch (error) {
      console.error('❌ Error checking bookmark:', error);
      return null;
    }
  },

  /**
   * Delete bookmark
   */
  async delete(bookmarkId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        BOOKMARKS_COLLECTION_ID,
        bookmarkId
      );
      return true;
    } catch (error) {
      console.error('❌ Error deleting bookmark:', error);
      throw error;
    }
  },

  /**
   * Toggle bookmark
   */
  async toggle(fileId) {
    try {
      const user = await account.get();
      const existing = await this.getByUserAndFile(user.$id, fileId);
      
      if (existing) {
        await this.delete(existing.$id);
        return { bookmarked: false };
      } else {
        await this.create(fileId);
        return { bookmarked: true };
      }
    } catch (error) {
      console.error('❌ Error toggling bookmark:', error);
      throw error;
    }
  }
};

// ============================================
// 📥 DOWNLOADS SERVICE
// ============================================
export const downloadsService = {
  /**
   * Record download
   */
  async create(fileId) {
    try {
      const user = await account.get();
      
      const response = await databases.createDocument(
        DATABASE_ID,
        DOWNLOADS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          fileId: fileId,
          downloadedAt: new Date().toISOString()
        }
      );
      
      // Download count is tracked by downloads collection entries
      
      return response;
    } catch (error) {
      console.error('❌ Error recording download:', error);
      throw error;
    }
  },

  /**
   * Get user downloads
   */
  async getByUser(userId, limit = 50) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        DOWNLOADS_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(limit)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching downloads:', error);
      throw error;
    }
  },

  /**
   * Get download count for file
   */
  async getCountByFile(fileId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        DOWNLOADS_COLLECTION_ID,
        [
          Query.equal('fileId', fileId),
          Query.limit(1)
        ]
      );
      return response.total || 0;
    } catch (error) {
      console.error('❌ Error fetching download count:', error);
      return 0;
    }
  }
};

// ============================================
// 💾 STORAGE SERVICE
// ============================================
export const storageService = {
  /**
   * Upload file to Appwrite Storage
   */
  async uploadFile(file, onProgress) {
    try {
      const response = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        file,
        onProgress ? [Permission.read(Role.any())] : undefined
      );
      
      return response;
    } catch (error) {
      console.error('❌ Error uploading file:', error);
      throw error;
    }
  },

  /**
   * Get file download URL
   */
  getFileDownloadURL(fileId) {
    try {
      const result = storage.getFileDownload(STORAGE_BUCKET_ID, fileId);
      return result.href;
    } catch (error) {
      console.error('❌ Error getting download URL:', error);
      throw error;
    }
  },

  /**
   * Get file view URL
   */
  getFileViewURL(fileId) {
    try {
      const result = storage.getFileView(STORAGE_BUCKET_ID, fileId);
      return result.href;
    } catch (error) {
      console.error('❌ Error getting view URL:', error);
      throw error;
    }
  },

  /**
   * Delete file from storage
   */
  async deleteFile(fileId) {
    try {
      await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
      return true;
    } catch (error) {
      console.error('❌ Error deleting file:', error);
      throw error;
    }
  }
};

// ============================================
// 📊 STATISTICS SERVICE
// ============================================
export const statisticsService = {
  /**
   * Get platform statistics
   */
  async getPlatformStats() {
    try {
      const [usersCount, materialsCount, downloadsCount] = await Promise.all([
        databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [Query.limit(1)]),
        databases.listDocuments(DATABASE_ID, MATERIALS_COLLECTION_ID, [Query.limit(1)]),
        databases.listDocuments(DATABASE_ID, DOWNLOADS_COLLECTION_ID, [Query.limit(1)])
      ]);

      return {
        totalUsers: usersCount.total || 0,
        totalMaterials: materialsCount.total || 0,
        totalDownloads: downloadsCount.total || 0
      };
    } catch (error) {
      console.error('❌ Error fetching platform stats:', error);
      return {
        totalUsers: 0,
        totalMaterials: 0,
        totalDownloads: 0
      };
    }
  },

  /**
   * Get user statistics
   */
  async getUserStats(userId) {
    try {
      const [uploads, downloads, bookmarks] = await Promise.all([
        materialsService.getByUploader(userId),
        downloadsService.getByUser(userId),
        bookmarksService.getByUser(userId)
      ]);

      return {
        totalUploads: uploads.length,
        totalDownloads: downloads.length,
        totalBookmarks: bookmarks.length
      };
    } catch (error) {
      console.error('❌ Error fetching user stats:', error);
      return {
        totalUploads: 0,
        totalDownloads: 0,
        totalBookmarks: 0
      };
    }
  }
};

// Export all services as default
export default {
  categories: categoriesService,
  subjects: subjectsService,
  fileTypes: fileTypesService,
  materials: materialsService,
  users: usersService,
  userProfiles: userProfilesService,
  bookmarks: bookmarksService,
  downloads: downloadsService,
  storage: storageService,
  statistics: statisticsService
};
