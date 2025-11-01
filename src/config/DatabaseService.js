import { Client, Databases, Query, ID } from 'appwrite';
import { 
  DATABASE_ID, 
  USERS_COLLECTION_ID, 
  FILES_COLLECTION_ID,
  BOOKMARKS_COLLECTION_ID,
  DOWNLOADS_COLLECTION_ID,
  PROFILES_COLLECTION_ID
} from './appwrite.js';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_URL || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '68d9740b0012416cb71b');

const databases = new Databases(client);

export const DatabaseService = {
  // ============= File Management =============
  async createFile(fileData) {
    try {
      console.log('Creating file with data:', fileData);
      const response = await databases.createDocument(
        DATABASE_ID,
        FILES_COLLECTION_ID,
        ID.unique(),
        fileData // Appwrite automatically adds $createdAt and $updatedAt
      );
      return response;
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  },

  async getFileById(fileId) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        FILES_COLLECTION_ID,
        fileId
      );
      return response;
    } catch (error) {
      console.error('Error getting file:', error);
      throw error;
    }
  },

  async getAllFiles(limit = 50, offset = 0, searchQuery = '') {
    try {
      let queries = [
        Query.orderDesc('$createdAt'), // استخدام $createdAt
        Query.limit(limit),
        Query.offset(offset)
      ];

      if (searchQuery) {
        queries.push(Query.search('title', searchQuery)); // البحث في title بدلاً من name
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        FILES_COLLECTION_ID,
        queries
      );
      return response;
    } catch (error) {
      console.error('Error getting all files:', error);
      // إذا فشل، جرب بدون sorting
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          FILES_COLLECTION_ID,
          [
            Query.limit(limit),
            Query.offset(offset)
          ]
        );
        return response;
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        throw retryError;
      }
    }
  },

  async getUserFiles(userId, limit = 50) {
    try {
      // استخدام $createdAt بدلاً من createdAt
      const response = await databases.listDocuments(
        DATABASE_ID,
        FILES_COLLECTION_ID,
        [
          Query.equal('uploaderId', userId),
          Query.orderDesc('$createdAt'), // استخدام $createdAt
          Query.limit(limit)
        ]
      );
      return response;
    } catch (error) {
      console.error('Error getting user files:', error);
      // إذا فشل، جرب بدون sorting
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          FILES_COLLECTION_ID,
          [
            Query.equal('uploaderId', userId),
            Query.limit(limit)
          ]
        );
        return response;
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        throw retryError;
      }
    }
  },

  async getFilesByCategory(category, limit = 50) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        FILES_COLLECTION_ID,
        [
          Query.equal('category', category),
          Query.orderDesc('$createdAt'), // استخدام $createdAt
          Query.limit(limit)
        ]
      );
      return response;
    } catch (error) {
      console.error('Error getting files by category:', error);
      // إذا فشل، جرب بدون sorting
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          FILES_COLLECTION_ID,
          [
            Query.equal('category', category),
            Query.limit(limit)
          ]
        );
        return response;
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        throw retryError;
      }
    }
  },

  async updateFile(fileId, updates) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        FILES_COLLECTION_ID,
        fileId,
        {
          ...updates,
          updatedAt: new Date().toISOString()
        }
      );
      return response;
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    }
  },

  async deleteFile(fileId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        FILES_COLLECTION_ID,
        fileId
      );
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  async incrementDownloadCount(fileId) {
    try {
      const file = await this.getFileById(fileId);
      const newCount = (file.downloads || 0) + 1;
      return await this.updateFile(fileId, { downloads: newCount });
    } catch (error) {
      console.error('Error incrementing download count:', error);
      throw error;
    }
  },

  // ============= User Management =============
  async createUser(userData) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userData.userId || ID.unique(),
        {
          ...userData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );
      return response;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async getUserById(userId) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId
      );
      return response;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  async updateUser(userId, updates) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        {
          ...updates,
          updatedAt: new Date().toISOString()
        }
      );
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async getUserByEmail(email) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('email', email)]
      );
      return response.documents.length > 0 ? response.documents[0] : null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  },

  // ============= Material Management =============
  async createMaterial(materialData) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        ID.unique(),
        {
          ...materialData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );
      return response;
    } catch (error) {
      console.error('Error creating material:', error);
      throw error;
    }
  },

  async getAllMaterials(limit = 50, offset = 0) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [
          Query.orderDesc('createdAt'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      );
      return response;
    } catch (error) {
      console.error('Error getting materials:', error);
      throw error;
    }
  },

  async getMaterialsByCategory(category, limit = 50) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [
          Query.equal('category', category),
          Query.orderDesc('createdAt'),
          Query.limit(limit)
        ]
      );
      return response;
    } catch (error) {
      console.error('Error getting materials by category:', error);
      throw error;
    }
  },

  async updateMaterial(materialId, updates) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        materialId,
        {
          ...updates,
          updatedAt: new Date().toISOString()
        }
      );
      return response;
    } catch (error) {
      console.error('Error updating material:', error);
      throw error;
    }
  },

  async deleteMaterial(materialId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        materialId
      );
      return true;
    } catch (error) {
      console.error('Error deleting material:', error);
      throw error;
    }
  },

  // ============= Search & Analytics =============
  async searchFiles(searchTerm, category = null, limit = 50) {
    try {
      let queries = [
        Query.search('name', searchTerm),
        Query.orderDesc('createdAt'),
        Query.limit(limit)
      ];

      if (category && category !== 'all') {
        queries.push(Query.equal('category', category));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        FILES_COLLECTION_ID,
        queries
      );
      return response;
    } catch (error) {
      console.error('Error searching files:', error);
      throw error;
    }
  },

  async getFileStats(userId = null) {
    try {
      let queries = [];
      if (userId) {
        queries.push(Query.equal('uploaderId', userId));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        FILES_COLLECTION_ID,
        queries
      );

      // حساب الإحصائيات
      const stats = {
        total: response.total,
        totalSize: 0,
        categories: {},
        recentUploads: 0
      };

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      response.documents.forEach(file => {
        // حساب الحجم الإجمالي
        stats.totalSize += file.size || 0;
        
        // تجميع حسب الفئات
        const category = file.category || 'other';
        stats.categories[category] = (stats.categories[category] || 0) + 1;
        
        // حساب الرفوعات الحديثة
        if (new Date(file.createdAt) > oneWeekAgo) {
          stats.recentUploads++;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting file stats:', error);
      throw error;
    }
  },

  // ============= Utility Functions =============
  async getRecentActivity(limit = 10) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        FILES_COLLECTION_ID,
        [
          Query.orderDesc('createdAt'),
          Query.limit(limit)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('Error getting recent activity:', error);
      throw error;
    }
  },

  async getPopularFiles(limit = 10) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        FILES_COLLECTION_ID,
        [
          Query.orderDesc('downloads'),
          Query.limit(limit)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('Error getting popular files:', error);
      throw error;
    }
  }
};