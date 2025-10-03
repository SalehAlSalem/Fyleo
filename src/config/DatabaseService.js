import { Client, Databases, Query, ID } from 'appwrite';
import minioStorage from './MinioService.js';
import { 
  DATABASE_ID, 
  USERS_COLLECTION_ID, 
  FILES_COLLECTION_ID,
  MATERIALS_COLLECTION_ID,
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
      console.log('🔄 Creating file with data:', fileData);
      console.log('📊 Using DATABASE_ID:', DATABASE_ID);
      console.log('📊 Using FILES_COLLECTION_ID (materials):', FILES_COLLECTION_ID);
      
      const response = await databases.createDocument(
        DATABASE_ID,
        FILES_COLLECTION_ID, // هذا materials collection
        ID.unique(),
        fileData // Appwrite automatically adds $createdAt and $updatedAt
      );
      
      console.log('✅ File created successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error creating file:', error);
      console.error('🔧 Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        type: error.type
      });
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
          Query.equal('uploadedBy', userId),
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
            Query.equal('uploadedBy', userId),
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
        updates // Appwrite يدير $updatedAt تلقائياً
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
      console.log('🔄 Creating user with data:', userData);
      console.log('📊 Using DATABASE_ID:', DATABASE_ID);
      console.log('📊 Using USERS_COLLECTION_ID:', USERS_COLLECTION_ID);
      
      const response = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(), // دائماً إنشاء ID جديد
        {
          name: userData.name,
          email: userData.email
          // بس الـ attributes الموجودة: name, email
          // Appwrite هيضيف $createdAt و $updatedAt تلقائياً
        }
      );
      
      console.log('✅ User created successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error creating user:', error);
      console.error('🔧 Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        type: error.type
      });
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
        queries.push(Query.equal('uploadedBy', userId));
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
  },

  // ============= Statistics =============
  async getActiveUsersCount() {
    try {
      // احصل على عدد المستخدمين النشطين (تسجيل دخول خلال آخر 30 يوم)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        PROFILES_COLLECTION_ID,
        [
          Query.greaterThan('$updatedAt', thirtyDaysAgo.toISOString()),
          Query.limit(1000) // حد أقصى للحصول على العدد
        ]
      );
      return response.total || response.documents.length;
    } catch (error) {
      console.error('Error getting active users count:', error);
      return 25; // رقم افتراضي
    }
  },

  async getTotalUsersCount() {
    try {
      // احصل على إجمالي عدد المستخدمين المسجلين
      console.log('🔍 DatabaseService: Attempting to fetch total users...');
      console.log('📊 Using DATABASE_ID:', DATABASE_ID);
      console.log('📊 Using USERS_COLLECTION_ID:', USERS_COLLECTION_ID);
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID, // استخدم users بدلاً من user_profiles
        [Query.limit(1)]
      );
      
      console.log('✅ DatabaseService: Users response received:', {
        total: response.total,
        documentsLength: response.documents?.length,
        fullResponse: response
      });
      
      if (response.total > 0) {
        console.log('🎯 Found users data:', response.total);
        return response.total;
      } else {
        console.warn('⚠️ No users found in', USERS_COLLECTION_ID);
        return 0; // بدون أرقام وهمية
      }
    } catch (error) {
      console.error('❌ DatabaseService: Error getting total users count:', error);
      console.error('🔧 Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        type: error.type
      });
      
      // في حالة الفشل، جرب من user_profiles كخطة احتياطية
      try {
        console.log('🔄 Trying fallback: user_profiles collection...');
        console.log('📊 Using PROFILES_COLLECTION_ID:', PROFILES_COLLECTION_ID);
        
        const fallbackResponse = await databases.listDocuments(
          DATABASE_ID,
          PROFILES_COLLECTION_ID,
          [Query.limit(1)]
        );
        
        console.log('✅ Fallback response:', {
          total: fallbackResponse.total,
          documentsLength: fallbackResponse.documents?.length
        });
        
        if (fallbackResponse.total > 0) {
          console.log('🎯 Found users in profiles:', fallbackResponse.total);
          return fallbackResponse.total;
        } else {
          console.warn('⚠️ No users found in user_profiles either');
          return 0;
        }
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        console.error('🔧 Fallback error details:', {
          name: fallbackError.name,
          message: fallbackError.message,
          code: fallbackError.code,
          type: fallbackError.type
        });
        return 0; // بدون أرقام وهمية
      }
    }
  },

  async getTotalFilesCount() {
    try {
      // احصل على إجمالي عدد الملفات - جرب materials أولاً
      console.log('🔍 DatabaseService: Attempting to fetch total files...');
      console.log('📊 Using DATABASE_ID:', DATABASE_ID);
      console.log('📊 First trying MATERIALS_COLLECTION_ID:', MATERIALS_COLLECTION_ID);
      
      const materialsResponse = await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [Query.limit(1)]
      );
      
      console.log('✅ DatabaseService: Materials response received:', {
        total: materialsResponse.total,
        documentsLength: materialsResponse.documents?.length,
        fullResponse: materialsResponse
      });
      
      if (materialsResponse.total > 0) {
        console.log('🎯 Found files in materials:', materialsResponse.total);
        return materialsResponse.total;
      } else {
        console.log('⚠️ No files found in materials collection, trying FILES collection...');
        console.log('📊 Trying FILES_COLLECTION_ID:', FILES_COLLECTION_ID);
        
        const filesResponse = await databases.listDocuments(
          DATABASE_ID,
          FILES_COLLECTION_ID,
          [Query.limit(1)]
        );
        
        console.log('✅ Files collection response:', {
          total: filesResponse.total,
          documentsLength: filesResponse.documents?.length
        });
        
        return filesResponse.total || 0;
      }
    } catch (error) {
      console.error('❌ DatabaseService: Error getting total files count:', error);
      console.error('🔧 Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        type: error.type
      });
      return 0; // بدون أرقام وهمية
    }
  },

  async getTotalDownloadsCount() {
    try {
      // احصل على إجمالي عدد التحميلات
      const response = await databases.listDocuments(
        DATABASE_ID,
        DOWNLOADS_COLLECTION_ID,
        [Query.limit(1)]
      );
      return response.total || 500; // رقم افتراضي
    } catch (error) {
      console.error('Error getting total downloads count:', error);
      return 500; // رقم افتراضي
    }
  },

  // ============= Downloads Management =============
  async createDownload(downloadData) {
    try {
      console.log('🔄 Creating download record:', downloadData);
      const response = await databases.createDocument(
        DATABASE_ID,
        DOWNLOADS_COLLECTION_ID,
        ID.unique(),
        {
          userId: downloadData.userId,
          fileId: downloadData.fileId,
          downloadedAt: new Date().toISOString()
          // البنية الصحيحة: userId, fileId, downloadedAt
        }
      );
      
      console.log('✅ Download recorded successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error creating download record:', error);
      console.error('🔧 Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        type: error.type
      });
      throw error;
    }
  },

  async getUserDownloads(userId) {
    try {
      console.log('🔍 Getting downloads for user:', userId);
      const response = await databases.listDocuments(
        DATABASE_ID,
        DOWNLOADS_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(50)
        ]
      );
      
      console.log('✅ User downloads fetched:', response.documents.length);
      return response.documents;
    } catch (error) {
      console.error('❌ Error getting user downloads:', error);
      return [];
    }
  },

  async getFileDownloadCount(fileId) {
    try {
      console.log('🔍 Getting download count for file:', fileId);
      const response = await databases.listDocuments(
        DATABASE_ID,
        DOWNLOADS_COLLECTION_ID,
        [
          Query.equal('fileId', fileId),
          Query.limit(1) // نحتاج فقط للعدد الإجمالي
        ]
      );
      
      console.log(`✅ File ${fileId} download count:`, response.total);
      console.log('🔍 Found downloads:', response.documents.length);
      
      // إضافة معلومات تفصيلية للتطوير
      if (response.documents.length > 0) {
        console.log('🔍 Sample download record:', response.documents[0]);
      }
      
      return response.total || 0;
    } catch (error) {
      console.error('❌ Error getting file download count:', error);
      return 0;
    }
  },

  async getUserTotalDownloads(userId) {
    try {
      console.log('🔍 Getting total downloads for user files:', userId);
      
      // احصل على جميع ملفات المستخدم
      const userFiles = await this.getUserFiles(userId, 1000);
      
      let totalDownloads = 0;
      
      // احسب مجموع التحميلات لكل ملف
      for (const file of userFiles.documents) {
        const downloadCount = await this.getFileDownloadCount(file.$id);
        totalDownloads += downloadCount;
      }
      
      console.log('✅ User total downloads:', totalDownloads);
      return totalDownloads;
    } catch (error) {
      console.error('❌ Error getting user total downloads:', error);
      return 0;
    }
  },

  async getUserDownloadedFilesCount(userId) {
    try {
      console.log('🔍 Getting count of files downloaded by user:', userId);
      const response = await databases.listDocuments(
        DATABASE_ID,
        DOWNLOADS_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.limit(1) // نحتاج فقط للعدد الإجمالي
        ]
      );
      
      console.log('✅ User downloaded files count:', response.total);
      return response.total || 0;
    } catch (error) {
      console.error('❌ Error getting user downloaded files count:', error);
      return 0;
    }
  },

  async enrichFilesWithDownloadCount(files) {
    try {
      console.log('🔍 Enriching files with download counts');
      const enrichedFiles = [];
      
      for (const file of files) {
        const downloadCount = await this.getFileDownloadCount(file.$id);
        enrichedFiles.push({
          ...file,
          downloadCount: downloadCount
        });
      }
      
      console.log('✅ Files enriched with download counts');
      return enrichedFiles;
    } catch (error) {
      console.error('❌ Error enriching files with download counts:', error);
      return files; // أعد الملفات كما هي في حالة الخطأ
    }
  },

  // ============= Bookmarks Management =============
  async createBookmark(bookmarkData) {
    try {
      console.log('🔄 Creating bookmark:', bookmarkData);
      const response = await databases.createDocument(
        DATABASE_ID,
        BOOKMARKS_COLLECTION_ID,
        ID.unique(),
        {
          userId: bookmarkData.userId,
          fileId: bookmarkData.fileId,
          fileName: bookmarkData.fileName,
          bookmarkedAt: new Date().toISOString()
        }
      );
      
      console.log('✅ Bookmark created successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error creating bookmark:', error);
      throw error;
    }
  },

  async getUserBookmarks(userId) {
    try {
      console.log('🔍 Getting bookmarks for user:', userId);
      const response = await databases.listDocuments(
        DATABASE_ID,
        BOOKMARKS_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(50)
        ]
      );
      
      console.log('✅ User bookmarks fetched:', response.documents.length);
      return response.documents;
    } catch (error) {
      console.error('❌ Error getting user bookmarks:', error);
      return [];
    }
  },

  async deleteBookmark(bookmarkId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        BOOKMARKS_COLLECTION_ID,
        bookmarkId
      );
      console.log('✅ Bookmark deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error deleting bookmark:', error);
      throw error;
    }
  },

  // ============= Test Functions =============
  async createTestUser() {
    try {
      console.log('🧪 Creating test user...');
      const testUser = {
        name: 'Test User',
        email: `test_${Date.now()}@example.com`,
        university: 'IIITDMJ',
        department: 'CSE',
        createdAt: new Date().toISOString(),
        isTestUser: true
      };
      
      const response = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        'unique()',
        testUser
      );
      
      console.log('✅ Test user created:', response);
      return response;
    } catch (error) {
      console.error('❌ Error creating test user:', error);
      throw error;
    }
  },

  async listAllCollections() {
    try {
      console.log('📋 Listing all collections and their counts...');
      
      const collections = [
        { name: 'users', id: USERS_COLLECTION_ID },
        { name: 'user_profiles', id: PROFILES_COLLECTION_ID },
        { name: 'materials', id: MATERIALS_COLLECTION_ID },
        { name: 'files', id: FILES_COLLECTION_ID },
        { name: 'downloads', id: DOWNLOADS_COLLECTION_ID },
        { name: 'bookmarks', id: BOOKMARKS_COLLECTION_ID }
      ];
      
      const results = {};
      
      for (const collection of collections) {
        try {
          const response = await databases.listDocuments(
            DATABASE_ID,
            collection.id,
            [Query.limit(1)]
          );
          
          results[collection.name] = {
            total: response.total,
            hasDocuments: response.documents?.length > 0
          };
          
          console.log(`📊 ${collection.name}: ${response.total} documents`);
        } catch (error) {
          console.error(`❌ Error checking ${collection.name}:`, error.message);
          results[collection.name] = { error: error.message };
        }
      }
      
      return results;
    } catch (error) {
      console.error('❌ Error listing collections:', error);
      throw error;
    }
  }
};