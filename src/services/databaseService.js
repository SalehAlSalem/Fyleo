import { databases, account, DATABASE_ID, PROFILES_COLLECTION_ID, MATERIALS_COLLECTION_ID, DOWNLOADS_COLLECTION_ID, Query } from '../config/appwrite';
import { ID } from 'appwrite';

// 📊 Database Service for Appwrite
class DatabaseService {
  
  // 👤 Users Operations
  async createUser(userData) {
    try {
      const user = await account.get();
      const userDoc = {
        userId: user.$id,
        name: userData.name || user.name,
        email: user.email,
        avatar: userData.avatar || null,
        role: 'user',
        uploadCount: 0,
        downloadCount: 0,
        joinedAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      
            return await databases.createDocument(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        user.$id,
        userDoc
      );
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  }

  async getUser(userId) {
    try {
            return await databases.getDocument(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        userId
      );
    } catch (error) {
      console.error('❌ Error getting user:', error);
      throw error;
    }
  }

  async updateUser(userId, updates) {
    try {
            return await databases.updateDocument(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        userId,
        updates
      );
    } catch (error) {
      console.error('❌ Error updating user:', error);
      throw error;
    }
  }

  async getUserStats(userId) {
    try {
      const user = await this.getUser(userId);
      const uploads = await this.getUserUploads(userId);
      const downloads = await this.getUserDownloads(userId);
      
      return {
        totalUploads: uploads.documents.length,
        totalDownloads: downloads.documents.length,
        uploadCount: user.uploadCount || 0,
        downloadCount: user.downloadCount || 0,
        joinedAt: user.joinedAt,
        lastActive: user.lastActive
      };
    } catch (error) {
      console.error('❌ Error getting user stats:', error);
      throw error;
    }
  }

  // 📁 Materials Operations
  async createMaterial(materialData) {
    try {
      const user = await account.get();
      const material = {
        ...materialData,
        uploaderId: user.$id,
        uploaderName: user.name,
        uploadDate: new Date().toISOString(),
        downloadCount: 0,
        viewCount: 0,
        approved: import.meta.env.VITE_AUTO_APPROVE === 'true',
        tags: materialData.tags || []
      };
      
      const result = await databases.createDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        ID.unique(),
        material
      );

      // Update user upload count
      await this.incrementUserUploadCount(user.$id);
      
      return result;
    } catch (error) {
      console.error('❌ Error creating material:', error);
      throw error;
    }
  }

  async getMaterial(materialId) {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        materialId
      );
    } catch (error) {
      console.error('❌ Error getting material:', error);
      throw error;
    }
  }

  async updateMaterial(materialId, updates) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        materialId,
        updates
      );
    } catch (error) {
      console.error('❌ Error updating material:', error);
      throw error;
    }
  }

  async deleteMaterial(materialId) {
    try {
      return await databases.deleteDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        materialId
      );
    } catch (error) {
      console.error('❌ Error deleting material:', error);
      throw error;
    }
  }

  async getAllMaterials(limit = 50, offset = 0) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [
          Query.equal('approved', true),
          Query.orderDesc('uploadDate'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      );
    } catch (error) {
      console.error('❌ Error getting materials:', error);
      throw error;
    }
  }

  async getMaterialsByCategory(category, limit = 50) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [
          Query.equal('category', category),
          Query.equal('approved', true),
          Query.orderDesc('uploadDate'),
          Query.limit(limit)
        ]
      );
    } catch (error) {
      console.error('❌ Error getting materials by category:', error);
      throw error;
    }
  }

  async getMaterialsBySubject(subject, limit = 50) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [
          Query.equal('subject', subject),
          Query.equal('approved', true),
          Query.orderDesc('uploadDate'),
          Query.limit(limit)
        ]
      );
    } catch (error) {
      console.error('❌ Error getting materials by subject:', error);
      throw error;
    }
  }

  async searchMaterials(searchTerm, limit = 50) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [
          Query.search('title', searchTerm),
          Query.equal('approved', true),
          Query.orderDesc('uploadDate'),
          Query.limit(limit)
        ]
      );
    } catch (error) {
      console.error('❌ Error searching materials:', error);
      throw error;
    }
  }

  async getUserUploads(userId, limit = 50) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [
          Query.equal('uploaderId', userId),
          Query.orderDesc('uploadDate'),
          Query.limit(limit)
        ]
      );
    } catch (error) {
      console.error('❌ Error getting user uploads:', error);
      throw error;
    }
  }

    async getUserDownloads(userId, limit = 50) {
    try {
      // Fetches download records for the user
      return await databases.listDocuments(
        DATABASE_ID,
        DOWNLOADS_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(limit)
        ]
      );
    } catch (error) {
      console.error('❌ Error getting user downloads:', error);
      throw error;
    }
  }

  // 🎯 Utility Functions
  async incrementMaterialViewCount(materialId) {
    try {
      const material = await this.getMaterial(materialId);
      return await this.updateMaterial(materialId, {
        viewCount: (material.viewCount || 0) + 1
      });
    } catch (error) {
      console.error('❌ Error incrementing view count:', error);
      throw error;
    }
  }

    async incrementMaterialDownloadCount(materialId, userId) {
    try {
      const material = await this.getMaterial(materialId);
      await this.updateMaterial(materialId, {
        downloadCount: (material.downloadCount || 0) + 1
      });

      // Log the download event in the downloads collection
      if (userId) {
        await databases.createDocument(
          DATABASE_ID,
          DOWNLOADS_COLLECTION_ID,
          ID.unique(),
          {
            userId: userId,
            fileId: materialId,
            downloadDate: new Date().toISOString()
          }
        );

        // Update user's total download count in their profile
        await this.incrementUserDownloadCount(userId);
      }
      
      return material;
    } catch (error) {
      console.error('❌ Error incrementing download count:', error);
      throw error;
    }
  }

  async incrementUserUploadCount(userId) {
    try {
      const user = await this.getUser(userId);
      return await this.updateUser(userId, {
        uploadCount: (user.uploadCount || 0) + 1,
        lastActive: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error incrementing user upload count:', error);
      throw error;
    }
  }

  async incrementUserDownloadCount(userId) {
    try {
      const user = await this.getUser(userId);
      return await this.updateUser(userId, {
        downloadCount: (user.downloadCount || 0) + 1,
        lastActive: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error incrementing user download count:', error);
      throw error;
    }
  }

  async approveMaterial(materialId) {
    try {
      return await this.updateMaterial(materialId, {
        approved: true,
        approvedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error approving material:', error);
      throw error;
    }
  }

  async rejectMaterial(materialId, reason = '') {
    try {
      return await this.updateMaterial(materialId, {
        approved: false,
        rejected: true,
        rejectionReason: reason,
        rejectedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error rejecting material:', error);
      throw error;
    }
  }

  // 📊 Analytics Functions
  async getPopularMaterials(limit = 10) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [
          Query.equal('approved', true),
          Query.orderDesc('downloadCount'),
          Query.limit(limit)
        ]
      );
    } catch (error) {
      console.error('❌ Error getting popular materials:', error);
      throw error;
    }
  }

  async getRecentMaterials(limit = 10) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [
          Query.equal('approved', true),
          Query.orderDesc('uploadDate'),
          Query.limit(limit)
        ]
      );
    } catch (error) {
      console.error('❌ Error getting recent materials:', error);
      throw error;
    }
  }

  async getPendingMaterials(limit = 50) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [
          Query.equal('approved', false),
          Query.orderDesc('uploadDate'),
          Query.limit(limit)
        ]
      );
    } catch (error) {
      console.error('❌ Error getting pending materials:', error);
      throw error;
    }
  }

  // Files functions
  async createFile(fileData) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        'files',
        ID.unique(),
        fileData
      );
    } catch (error) {
      console.error('❌ Error creating file:', error);
      throw error;
    }
  }

  async getFileById(fileId) {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        'files',
        fileId
      );
    } catch (error) {
      console.error('❌ Error getting file:', error);
      throw error;
    }
  }

  async getAllFiles() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        'files',
        [Query.orderDesc('$createdAt')]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error getting all files:', error);
      return [];
    }
  }

  async getUserFiles(userEmail) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        'files',
        [
          Query.equal('uploadedBy', userEmail),
          Query.orderDesc('$createdAt')
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('❌ Error getting user files:', error);
      return [];
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();
export default databaseService;