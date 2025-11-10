import { 
  databases, 
  storage, 
  account,
  teams,
  DATABASE_ID, 
  USERS_COLLECTION_ID,
  MATERIALS_COLLECTION_ID,
  CATEGORIES_COLLECTION_ID,
  SUBJECTS_COLLECTION_ID,
  FILE_TYPES_COLLECTION_ID,
  BOOKMARKS_COLLECTION_ID,
  DOWNLOADS_COLLECTION_ID,
  PROFILES_COLLECTION_ID,
  POSTS_COLLECTION_ID,
  EDUCATIONAL_PURPOSES_COLLECTION_ID,
  SUBJECT_CATEGORIES_COLLECTION_ID,
  STORAGE_BUCKET_ID,
  Query,
  ID,
  Permission,
  Role
} from '../config/appwrite';
import { StorageService } from '../config/StorageService';

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
      // Check if any subjects are using this category
      const subjectsCheck = await databases.listDocuments(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        [Query.equal('categoryId', categoryId), Query.limit(1)]
      );
      
      if (subjectsCheck.total > 0) {
        throw new Error('لا يمكن حذف هذا التصنيف لأنه مرتبط بمواد دراسية موجودة. يجب حذف المواد أولاً أو نقلها لتصنيف آخر.');
      }
      
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
      const updateData = {
        nameAr: updates.nameAr,
        nameEn: updates.nameEn,
        descriptionAr: updates.descriptionAr || '',
        descriptionEn: updates.descriptionEn || '',
        categoryId: updates.categoryId,
        creditHours: updates.creditHours || 3,
        level: String(updates.level || 1),
        isActive: updates.isActive !== false
      };
      
      const response = await databases.updateDocument(
        DATABASE_ID,
        SUBJECTS_COLLECTION_ID,
        subjectId,
        updateData
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
      // Check if any materials are using this subject
      const materialsCheck = await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [Query.equal('subjectId', subjectId), Query.limit(1)]
      );
      
      if (materialsCheck.total > 0) {
        throw new Error('لا يمكن حذف هذه المادة الدراسية لأنها مرتبطة بملفات موجودة. يجب حذف الملفات أولاً.');
      }
      
      // Check if any posts are using this subject
      const postsCheck = await databases.listDocuments(
        DATABASE_ID,
        POSTS_COLLECTION_ID,
        [Query.equal('subjectId', subjectId), Query.limit(1)]
      );
      
      if (postsCheck.total > 0) {
        throw new Error('لا يمكن حذف هذه المادة الدراسية لأنها مرتبطة بمنشورات موجودة. يجب حذف المنشورات أولاً.');
      }
      
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
          nameAr: fileTypeData.nameAr,
          nameEn: fileTypeData.nameEn,
          icon: fileTypeData.icon || '📄',
          color: fileTypeData.color || '#6B7280',
          allowedFormats: Array.isArray(fileTypeData.allowedFormats) 
            ? fileTypeData.allowedFormats 
            : (fileTypeData.allowedFormats || []),
          educationalPurposeId: fileTypeData.educationalPurposeId || '' // Required by database schema but managed from Educational Purposes side
        }
      );
      return response;
    } catch (error) {
      console.error('❌ Error creating file type:', error);
      throw error;
    }
  },

  /**
   * Update file type
   */
  async update(fileTypeId, updates) {
    try {
      // Build update payload dynamically to include all provided fields
      const updatePayload = {};
      
      if (updates.nameAr !== undefined) updatePayload.nameAr = updates.nameAr;
      if (updates.nameEn !== undefined) updatePayload.nameEn = updates.nameEn;
      if (updates.icon !== undefined) updatePayload.icon = updates.icon;
      if (updates.color !== undefined) updatePayload.color = updates.color;
      
      if (updates.allowedFormats !== undefined) {
        updatePayload.allowedFormats = Array.isArray(updates.allowedFormats) 
          ? updates.allowedFormats 
          : (updates.allowedFormats || []);
      }
      
      // CRITICAL: Educational Purpose ID - managed from Educational Purposes page
      if (updates.educationalPurposeId !== undefined) {
        updatePayload.educationalPurposeId = updates.educationalPurposeId;
      }
      
      const response = await databases.updateDocument(
        DATABASE_ID,
        FILE_TYPES_COLLECTION_ID,
        fileTypeId,
        updatePayload
      );
      return response;
    } catch (error) {
      console.error('❌ Error updating file type:', error);
      throw error;
    }
  },

  /**
   * Delete file type
   */
  async delete(fileTypeId) {
    try {
      // Check if any materials are using this file type
      const materialsCheck = await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [Query.equal('fileTypeId', fileTypeId), Query.limit(1)]
      );
      
      if (materialsCheck.total > 0) {
        throw new Error('لا يمكن حذف نوع الملف هذا لأنه مرتبط بملفات موجودة. يجب حذف الملفات أولاً أو تغيير نوعها.');
      }
      
      await databases.deleteDocument(
        DATABASE_ID,
        FILE_TYPES_COLLECTION_ID,
        fileTypeId
      );
      return true;
    } catch (error) {
      console.error('❌ Error deleting file type:', error);
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
      return response.documents;
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
   * Get material by ID (with fileType populated)
   */
  async getById(materialId) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        materialId
      );
      
      const material = response;
      
      // ✅ Populate fileType if available
      if (material.fileTypeId) {
        try {
          const fileType = await fileTypesService.getById(material.fileTypeId);
          return { ...material, fileType };
        } catch (err) {
          console.warn(`⚠️ Could not fetch fileType for material ${materialId}:`, err);
        }
      }
      
      return material;
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
      const response = await databases.createDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        ID.unique(),
        {
          uploaderId: materialData.uploaderId,
          title: materialData.title,
          description: materialData.description || 'No Description',
          fileId: materialData.fileId,
          fileName: materialData.fileName,
          fileSize: materialData.fileSize,
          downloadURL: materialData.downloadURL || materialData.viewURL || '',
          viewURL: materialData.viewURL || materialData.downloadURL || '',
          subjectId: materialData.subjectId,
          fileTypeId: materialData.fileTypeId,
          tags: materialData.tags || null
        }
      );
      return response;
    } catch (error) {
      console.error(' Error creating material:', error);
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
   * Delete material (complete cleanup)
   */
  async delete(materialId) {
    try {
      // 1. Get material to get fileId
      const material = await this.getById(materialId);
      
      // 2. Delete file from MinIO storage
      if (material.fileId) {
        try {
          await StorageService.deleteFile(material.fileId);
          console.log('🗑️ File deleted from MinIO:', material.fileId);
        } catch (err) {
          console.warn('⚠️ Could not delete file from MinIO:', err.message);
        }
      }
      
      // 3. Delete all downloads for this file
      try {
        const downloads = await databases.listDocuments(
          DATABASE_ID,
          DOWNLOADS_COLLECTION_ID,
          [Query.equal('fileId', materialId)]
        );
        for (const download of downloads.documents) {
          await databases.deleteDocument(DATABASE_ID, DOWNLOADS_COLLECTION_ID, download.$id);
        }
        console.log(`🗑️ Deleted ${downloads.documents.length} download records`);
      } catch (err) {
        console.warn('⚠️ Could not delete downloads:', err.message);
      }
      
      // 4. Delete all bookmarks for this file
      try {
        const bookmarks = await databases.listDocuments(
          DATABASE_ID,
          BOOKMARKS_COLLECTION_ID,
          [Query.equal('fileId', materialId)]
        );
        for (const bookmark of bookmarks.documents) {
          await databases.deleteDocument(DATABASE_ID, BOOKMARKS_COLLECTION_ID, bookmark.$id);
        }
        console.log(`🗑️ Deleted ${bookmarks.documents.length} bookmark records`);
      } catch (err) {
        console.warn('⚠️ Could not delete bookmarks:', err.message);
      }
      
      // 5. Finally, delete the material document
      await databases.deleteDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        materialId
      );
      
      console.log('✅ Material completely deleted:', materialId);
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
   * Get materials by uploader (with fileType populated)
   */
  async getByUploader(uploaderId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [
          Query.equal('uploaderId', uploaderId),
          Query.orderDesc('$createdAt'),
          Query.limit(5000) // Maximum allowed by Appwrite
        ]
      );
      
      // Populate fileType for each material
      const materialsWithFileType = await Promise.all(
        response.documents.map(async (material) => {
          if (material.fileTypeId) {
            try {
              const fileType = await fileTypesService.getById(material.fileTypeId);
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
   * ✅ FIX: Use Auth user's ID as document ID for proper linking
   */
  async create(userData) {
    try {
      console.log('🔥🔥🔥 usersService.create() CALLED 🔥🔥🔥');
      console.log('📝 Creating user in database:', userData.email);
      console.log('📊 DATABASE_ID:', DATABASE_ID);
      console.log('📊 USERS_COLLECTION_ID:', USERS_COLLECTION_ID);
      
      // Get the authenticated user to use their ID
      const authUser = await account.get();
      console.log('👤 Auth user from account.get():', {
        id: authUser.$id,
        name: authUser.name,
        email: authUser.email
      });
      
      // Fast path: if a document already exists with the correct ID, return it
      try {
        const existingById = await databases.getDocument(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          authUser.$id
        );
        console.log('ℹ️ User document already exists with matching ID:', existingById.$id);
        return existingById;
      } catch (_) {
        // Not found by ID, continue
      }

      // Check by email in case there is an old document with different ID
      let existingByEmail = null;
      try {
        const list = await databases.listDocuments(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          [Query.equal('email', userData.email || authUser.email), Query.limit(1)]
        );
        existingByEmail = list.documents?.[0] || null;
      } catch (_) {}

      // If an old document exists with a different ID, create the correct one and try to clean up
      if (existingByEmail && existingByEmail.$id !== authUser.$id) {
        console.log('🛠️ Found existing user by email with different ID:', existingByEmail.$id);
        try {
          const created = await databases.createDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            authUser.$id,
            {
              name: userData.name || authUser.name || existingByEmail.name || '',
              email: userData.email || authUser.email || existingByEmail.email || ''
            }
          );
          console.log('✅ Created new user doc with auth ID:', created.$id);
          // Try to delete the old document (ignore errors if permissions block it)
          try {
            await databases.deleteDocument(DATABASE_ID, USERS_COLLECTION_ID, existingByEmail.$id);
            console.log('🗑️ Deleted old user doc with mismatched ID:', existingByEmail.$id);
          } catch (delErr) {
            console.warn('⚠️ Could not delete old user doc:', delErr?.message);
          }
          return created;
        } catch (createErr) {
          if (createErr.code === 409) {
            const fallback = await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, authUser.$id);
            return fallback;
          }
          throw createErr;
        }
      }

      console.log('🎯 Creating document with Auth user ID as document ID:', authUser.$id);
      const response = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        authUser.$id, // ✅ FIX: Use Auth user's ID instead of ID.unique()
        {
          name: userData.name || authUser.name,
          email: userData.email || authUser.email
        }
      );
      console.log('✅✅✅ User created in database with matching ID:', response.$id);
      console.log('✅ Verify: Auth ID =', authUser.$id, '| Document ID =', response.$id);
      return response;
    } catch (error) {
      console.error('❌ Error creating user:', {
        message: error.message,
        code: error.code,
        type: error.type
      });
      
      // If user already exists (duplicate ID or email), try to fetch and return
      if (error.code === 409 || error.message?.includes('unique') || error.message?.includes('already exists')) {
        console.log('⚠️ User already exists, fetching existing user...');
        try {
          const authUser = await account.get();
          return await this.getById(authUser.$id);
        } catch (fetchError) {
          return await this.getByEmail(userData.email);
        }
      }
      
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
      // Return null instead of throwing to allow user creation
      return null;
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
  },

  /**
   * Update user data
   */
  async update(userId, data) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        data
      );
      console.log('✅ User updated in database:', userId);
      return response;
    } catch (error) {
      console.error('❌ Error updating user:', error);
      throw error;
    }
  },

  /**
   * Get all users (Admin only)
   */
  async getAll(limit = 100) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [
          Query.orderDesc('$createdAt'),
          Query.limit(limit)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching all users:', error);
      throw error;
    }
  },

  /**
   * Update user
   */
  async update(userId, updates) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        updates
      );
      return response;
    } catch (error) {
      console.error('❌ Error updating user:', error);
      throw error;
    }
  },

  /**
   * Add user to team
   * @param {string} userId - User ID to add
   * @param {string} teamId - Team ID (reviewer-team or content_manager)
   * @param {string[]} roles - Array of roles for the user in the team
   */
  async addToTeam(userId, teamId, roles = []) {
    try {
      // Create membership for the user in the team
      const response = await teams.createMembership(
        teamId,
        roles, // Roles array
        undefined, // No email (using existing user)
        userId, // User ID
        undefined, // No phone
        undefined, // No URL redirect
        undefined // No name (using existing)
      );
      console.log('✅ User added to team:', { userId, teamId, roles });
      return response;
    } catch (error) {
      console.error('❌ Error adding user to team:', error);
      throw error;
    }
  },

  /**
   * Remove user from team
   * @param {string} teamId - Team ID
   * @param {string} membershipId - Membership ID to remove
   */
  async removeFromTeam(teamId, membershipId) {
    try {
      await teams.deleteMembership(teamId, membershipId);
      console.log('✅ User removed from team:', { teamId, membershipId });
      return true;
    } catch (error) {
      console.error('❌ Error removing user from team:', error);
      throw error;
    }
  },

  /**
   * Get user's team memberships
   * @param {string} userId - User ID
   */
  async getUserTeams(userId) {
    try {
      // Get all teams
      const allTeams = await teams.list();
      
      // For each team, check if user is a member
      const userTeams = [];
      for (const team of allTeams.teams) {
        try {
          const memberships = await teams.listMemberships(team.$id);
          const isMember = memberships.memberships.some(m => m.userId === userId);
          if (isMember) {
            const membership = memberships.memberships.find(m => m.userId === userId);
            userTeams.push({
              teamId: team.$id,
              teamName: team.name,
              membershipId: membership.$id,
              roles: membership.roles || []
            });
          }
        } catch (err) {
          console.warn('Could not check membership for team:', team.$id);
        }
      }
      
      return userTeams;
    } catch (error) {
      console.error('❌ Error getting user teams:', error);
      return [];
    }
  },

  /**
   * Block/Unblock user by updating their status in database
   * Note: Appwrite doesn't have built-in user blocking, so we use a custom field
   */
  async updateBlockStatus(userId, isBlocked) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        { blocked: isBlocked }
      );
      console.log(`✅ User ${isBlocked ? 'blocked' : 'unblocked'}:`, userId);
      return response;
    } catch (error) {
      console.error('❌ Error updating block status:', error);
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

// Request deduplication cache
const bookmarkRequestCache = new Map();
const CACHE_DURATION = 1000; // 1 second

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
  async getByUser(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        BOOKMARKS_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(5000) // Maximum allowed by Appwrite
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching bookmarks:', error);
      throw error;
    }
  },

  /**
   * Get user bookmarks (alias for getByUser)
   */
  async getUserBookmarks(userId, limit = 50) {
    return this.getByUser(userId, limit);
  },

  /**
   * Get bookmarks for a specific material
   */
  async getByMaterial(materialId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        BOOKMARKS_COLLECTION_ID,
        [
          Query.equal('fileId', materialId),
          Query.orderDesc('$createdAt')
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching bookmarks by material:', error);
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
   * Toggle bookmark with request deduplication
   */
  async toggle(fileId) {
    try {
      const user = await account.get();
      const cacheKey = `${user.$id}-${fileId}`;
      
      // ✅ Request deduplication: Check if request is in progress
      const now = Date.now();
      if (bookmarkRequestCache.has(cacheKey)) {
        const { promise, timestamp } = bookmarkRequestCache.get(cacheKey);
        
        // If request is still fresh, return the existing promise
        if (now - timestamp < CACHE_DURATION) {
          console.log('⚡ Reusing existing bookmark request');
          return promise;
        }
      }
      
      // ✅ Create new request and cache it
      const requestPromise = (async () => {
        try {
          const existing = await this.getByUserAndFile(user.$id, fileId);
          
          if (existing) {
            await this.delete(existing.$id);
            return { bookmarked: false, bookmarkId: null };
          } else {
            const newBookmark = await this.create(fileId);
            return { bookmarked: true, bookmarkId: newBookmark.$id };
          }
        } finally {
          // ✅ Clear cache after request completes
          setTimeout(() => {
            bookmarkRequestCache.delete(cacheKey);
          }, CACHE_DURATION);
        }
      })();
      
      // ✅ Store promise in cache
      bookmarkRequestCache.set(cacheKey, {
        promise: requestPromise,
        timestamp: now
      });
      
      return requestPromise;
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
   * Get downloads by file
   */
  async getByFile(fileId, limit = 1000) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        DOWNLOADS_COLLECTION_ID,
        [
          Query.equal('fileId', fileId),
          Query.limit(limit)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching downloads by file:', error);
      return [];
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

// ============================================
// 📝 POSTS SERVICE
// ============================================
export const postsService = {
  /**
   * Create a new post
   */
  async create(postData) {
    try {
      const { subjectId, uploaderId, contentText, linkURL, educationalPurposeId } = postData;
      
      // Validate that at least one field is provided
      if (!contentText?.trim() && !linkURL?.trim()) {
        throw new Error('Post must have either text content or a link');
      }
      
      // Validate and check URL safety if provided
      if (linkURL?.trim()) {
        try {
          new URL(linkURL);
        } catch {
          throw new Error('Invalid URL format');
        }
        
        // For link posts, educational purpose is required
        if (!educationalPurposeId) {
          throw new Error('Educational purpose is required for link posts');
        }
        
        // Security check: Validate URL safety using backend service
        try {
          const { validateUrlSafety } = await import('./linkSecurityClient.js');
          const securityCheck = await validateUrlSafety(linkURL);
          
          if (!securityCheck.safe) {
            throw new Error(securityCheck.message || 'This URL has been flagged as potentially dangerous and cannot be posted');
          }
          
          if (securityCheck.warning) {
            console.warn('⚠️  URL security warning:', securityCheck.warning);
          }
        } catch (securityError) {
          // If it's our custom error about unsafe URL, rethrow it
          if (securityError.message.includes('flagged') || securityError.message.includes('dangerous')) {
            throw securityError;
          }
          // Otherwise, log and continue (backend might be unavailable)
          console.warn('⚠️  Could not perform security check:', securityError.message);
          console.warn('⚠️  Proceeding without security check - backend may be offline');
        }
      }
      
      const document = {
        subjectId,
        uploaderId,
        contentText: contentText?.trim() || '',
        linkURL: linkURL?.trim() || '',
        ...(educationalPurposeId ? { educationalPurposeId } : {})
      };
      
      console.log('📝 Creating post with data:', document);
      
      const response = await databases.createDocument(
        DATABASE_ID,
        POSTS_COLLECTION_ID,
        ID.unique(),
        document
      );
      
      console.log('✅ Post created:', response);
      return response;
    } catch (error) {
      console.error('❌ Error creating post:', error);
      throw error;
    }
  },

  /**
   * Get posts by subject
   */
  async getBySubject(subjectId, limit = 100) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        POSTS_COLLECTION_ID,
        [
          Query.equal('subjectId', subjectId),
          Query.orderDesc('$createdAt'),
          Query.limit(limit)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching posts by subject:', error);
      throw error;
    }
  },

  /**
   * Get posts by uploader
   */
  async getByUploader(uploaderId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        POSTS_COLLECTION_ID,
        [
          Query.equal('uploaderId', uploaderId),
          Query.orderDesc('$createdAt'),
          Query.limit(5000) // Maximum allowed by Appwrite
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching posts by uploader:', error);
      throw error;
    }
  },

  /**
   * Get a single post by ID
   */
  async getById(postId) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        POSTS_COLLECTION_ID,
        postId
      );
      return response;
    } catch (error) {
      console.error('❌ Error fetching post:', error);
      throw error;
    }
  },

  /**
   * Update a post
   */
  async update(postId, updates) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        POSTS_COLLECTION_ID,
        postId,
        updates
      );
      console.log('✅ Post updated:', response);
      return response;
    } catch (error) {
      console.error('❌ Error updating post:', error);
      throw error;
    }
  },

  /**
   * Delete a post
   */
  async delete(postId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        POSTS_COLLECTION_ID,
        postId
      );
      console.log('✅ Post deleted');
      return true;
    } catch (error) {
      console.error('❌ Error deleting post:', error);
      throw error;
    }
  },

  /**
   * Get all posts (admin)
   */
  async getAll(limit = 100) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        POSTS_COLLECTION_ID,
        [
          Query.orderDesc('$createdAt'),
          Query.limit(limit)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching all posts:', error);
      throw error;
    }
  }
};

// ============================================
// 🎯 EDUCATIONAL PURPOSES SERVICE
// ============================================
export const educationalPurposesService = {
  /**
   * Get all educational purposes
   */
  async getAll(limit = 100) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        EDUCATIONAL_PURPOSES_COLLECTION_ID,
        [
          Query.orderAsc('nameEn'),
          Query.limit(limit)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching educational purposes:', error);
      throw error;
    }
  },

  /**
   * Get educational purposes where links are allowed
   */
  async getLinkAllowed() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        EDUCATIONAL_PURPOSES_COLLECTION_ID,
        [
          Query.equal('isLinkAllowed', true),
          Query.orderAsc('nameEn')
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching link-allowed purposes:', error);
      throw error;
    }
  },

  /**
   * Get educational purpose by ID
   */
  async getById(purposeId) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        EDUCATIONAL_PURPOSES_COLLECTION_ID,
        purposeId
      );
      return response;
    } catch (error) {
      console.error('❌ Error fetching educational purpose:', error);
      throw error;
    }
  },

  /**
   * Create new educational purpose (Admin only)
   */
  async create(purposeData) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        EDUCATIONAL_PURPOSES_COLLECTION_ID,
        ID.unique(),
        {
          nameAr: purposeData.nameAr,
          nameEn: purposeData.nameEn,
          icon: purposeData.icon || '📚',
          isLinkAllowed: purposeData.isLinkAllowed || false
        }
      );
      console.log('✅ Educational purpose created:', response);
      return response;
    } catch (error) {
      console.error('❌ Error creating educational purpose:', error);
      throw error;
    }
  },

  /**
   * Update educational purpose
   */
  async update(purposeId, updates) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        EDUCATIONAL_PURPOSES_COLLECTION_ID,
        purposeId,
        updates
      );
      console.log('✅ Educational purpose updated:', response);
      return response;
    } catch (error) {
      console.error('❌ Error updating educational purpose:', error);
      throw error;
    }
  },

  /**
   * Delete educational purpose
   */
  async delete(purposeId) {
    try {
      // Check if any posts are using this educational purpose
      const postsCheck = await databases.listDocuments(
        DATABASE_ID,
        POSTS_COLLECTION_ID,
        [Query.equal('educationalPurposeId', purposeId), Query.limit(1)]
      );
      
      if (postsCheck.total > 0) {
        throw new Error('لا يمكن حذف هذا الغرض التعليمي لأنه مرتبط بمنشورات موجودة. يجب حذف المنشورات أولاً أو تغيير غرضها التعليمي.');
      }
      
      // Check if any file types are using this educational purpose
      const fileTypesCheck = await databases.listDocuments(
        DATABASE_ID,
        FILE_TYPES_COLLECTION_ID,
        [Query.equal('educationalPurposeId', purposeId), Query.limit(1)]
      );
      
      if (fileTypesCheck.total > 0) {
        throw new Error('لا يمكن حذف هذا الغرض التعليمي لأنه مرتبط بأنواع ملفات موجودة. يجب حذف أنواع الملفات أولاً أو تغيير غرضها التعليمي.');
      }
      
      await databases.deleteDocument(
        DATABASE_ID,
        EDUCATIONAL_PURPOSES_COLLECTION_ID,
        purposeId
      );
      console.log('✅ Educational purpose deleted');
      return true;
    } catch (error) {
      console.error('❌ Error deleting educational purpose:', error);
      throw error;
    }
  }
};

// ============================================
// 🔗 SUBJECT-CATEGORIES SERVICE (Many-to-Many)
// ============================================
export const subjectCategoriesService = {
  /**
   * Get all categories linked to a subject
   * @param {string} subjectId - Subject ID
   * @returns {Promise<Array>} Array of link documents {$id, subjectId, categoryId}
   */
  async getBySubject(subjectId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        SUBJECT_CATEGORIES_COLLECTION_ID,
        [Query.equal('subjectId', subjectId), Query.limit(5000)]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching subject categories:', error);
      throw error;
    }
  },

  /**
   * Get all subjects linked to a category
   * @param {string} categoryId - Category ID
   * @returns {Promise<Array>} Array of link documents {$id, subjectId, categoryId}
   */
  async getByCategory(categoryId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        SUBJECT_CATEGORIES_COLLECTION_ID,
        [Query.equal('categoryId', categoryId), Query.limit(5000)]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching category subjects:', error);
      throw error;
    }
  },

  /**
   * Create a link between subject and category
   * @param {string} subjectId - Subject ID
   * @param {string} categoryId - Category ID
   * @returns {Promise<Object>} Created link document
   */
  async create(subjectId, categoryId) {
    try {
      // Check if link already exists
      const existing = await databases.listDocuments(
        DATABASE_ID,
        SUBJECT_CATEGORIES_COLLECTION_ID,
        [
          Query.equal('subjectId', subjectId),
          Query.equal('categoryId', categoryId),
          Query.limit(1)
        ]
      );

      if (existing.total > 0) {
        console.warn('⚠️ Link already exists, returning existing');
        return existing.documents[0];
      }

      const response = await databases.createDocument(
        DATABASE_ID,
        SUBJECT_CATEGORIES_COLLECTION_ID,
        ID.unique(),
        { subjectId, categoryId }
      );
      console.log('✅ Subject-Category link created:', response);
      return response;
    } catch (error) {
      console.error('❌ Error creating subject-category link:', error);
      throw error;
    }
  },

  /**
   * Remove a link between subject and category
   * @param {string} linkId - Link document ID
   * @returns {Promise<boolean>}
   */
  async remove(linkId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        SUBJECT_CATEGORIES_COLLECTION_ID,
        linkId
      );
      console.log('✅ Subject-Category link deleted');
      return true;
    } catch (error) {
      console.error('❌ Error deleting subject-category link:', error);
      throw error;
    }
  },

  /**
   * Remove all links for a subject (used when deleting subject)
   * @param {string} subjectId - Subject ID
   * @returns {Promise<number>} Number of links deleted
   */
  async removeAllBySubject(subjectId) {
    try {
      const links = await this.getBySubject(subjectId);
      await Promise.all(links.map(link => this.remove(link.$id)));
      console.log(`✅ Deleted ${links.length} subject-category links`);
      return links.length;
    } catch (error) {
      console.error('❌ Error deleting subject links:', error);
      throw error;
    }
  },

  /**
   * Get all subject-category links
   * @returns {Promise<Array>} Array of all link documents
   */
  async getAll() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        SUBJECT_CATEGORIES_COLLECTION_ID,
        [Query.limit(5000)]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error fetching all subject-category links:', error);
      throw error;
    }
  },

  /**
   * Remove all links for a category (used when deleting category)
   * @param {string} categoryId - Category ID
   * @returns {Promise<number>} Number of links deleted
   */
  async removeAllByCategory(categoryId) {
    try {
      const links = await this.getByCategory(categoryId);
      await Promise.all(links.map(link => this.remove(link.$id)));
      console.log(`✅ Deleted ${links.length} category-subject links`);
      return links.length;
    } catch (error) {
      console.error('❌ Error deleting category links:', error);
      throw error;
    }
  }
};

// Export all services as default
export default {
  categories: categoriesService,
  subjects: subjectsService,
  subjectCategories: subjectCategoriesService,
  fileTypes: fileTypesService,
  materials: materialsService,
  users: usersService,
  userProfiles: userProfilesService,
  bookmarks: bookmarksService,
  downloads: downloadsService,
  storage: storageService,
  statistics: statisticsService,
  posts: postsService,
  educationalPurposes: educationalPurposesService
};
