import { Client, Databases, Query } from 'appwrite';

const client = new Client()
  .setEndpoint('https://fyleo.appwrite.network/v1')
  .setProject('fyleo-project');

const databases = new Databases(client);
const DATABASE_ID = 'fyleo-database';
const COLLECTIONS = {
  MATERIALS: 'materials',
  USERS: 'users',
  FILES: 'files'
};

export const DatabaseService = {
  // File management functions
  async createFile(fileData) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.FILES,
        'unique()',
        {
          ...fileData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
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
        COLLECTIONS.FILES,
        fileId
      );
      return response;
    } catch (error) {
      console.error('Error getting file:', error);
      throw error;
    }
  },

  async getAllFiles(limit = 50, offset = 0) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FILES,
        [
          Query.orderDesc('createdAt'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      );
      return response;
    } catch (error) {
      console.error('Error getting all files:', error);
      throw error;
    }
  },

  async getUserFiles(userId, limit = 50) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FILES,
        [
          Query.equal('uploadedBy', userId),
          Query.orderDesc('createdAt'),
          Query.limit(limit)
        ]
      );
      return response;
    } catch (error) {
      console.error('Error getting user files:', error);
      throw error;
    }
  },

  async getFilesByCategory(category, limit = 50) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FILES,
        [
          Query.equal('category', category),
          Query.orderDesc('createdAt'),
          Query.limit(limit)
        ]
      );
      return response;
    } catch (error) {
      console.error('Error getting files by category:', error);
      throw error;
    }
  },

  async updateFile(fileId, updates) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.FILES,
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
        COLLECTIONS.FILES,
        fileId
      );
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  // User management
  async createUser(userData) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        'unique()',
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
        COLLECTIONS.USERS,
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
        COLLECTIONS.USERS,
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

  // Material management
  async createMaterial(materialData) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.MATERIALS,
        'unique()',
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
        COLLECTIONS.MATERIALS,
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
        COLLECTIONS.MATERIALS,
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

  // Search functionality
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
        COLLECTIONS.FILES,
        queries
      );
      return response;
    } catch (error) {
      console.error('Error searching files:', error);
      throw error;
    }
  },

  // Statistics
  async getFileStats(userId = null) {
    try {
      let queries = [];
      if (userId) {
        queries.push(Query.equal('uploadedBy', userId));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FILES,
        queries
      );

      return {
        total: response.total,
        files: response.documents
      };
    } catch (error) {
      console.error('Error getting file stats:', error);
      throw error;
    }
  }
};