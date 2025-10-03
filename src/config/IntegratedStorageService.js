// 🔗 خدمة التخزين المتكاملة - MinIO + Database
// تجمع بين رفع الملفات على MinIO وحفظ البيانات في Appwrite Database

import minioStorage from './MinioService.js';
import { DatabaseService } from './DatabaseService.js';
import { Client, Databases, ID } from 'appwrite';

// إعداد Appwrite
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_URL || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '68d9740b0012416cb71b');

const databases = new Databases(client);
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const MATERIALS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_FILES_COLLECTION_ID;

export const IntegratedStorageService = {
  // ============= رفع ملف متكامل =============
  async uploadFile(file, options = {}) {
    try {
      console.log('🚀 بدء الرفع المتكامل (MinIO + Database):', file.name);
      
      // الخطوة 1: رفع الملف على MinIO
      const minioResult = await minioStorage.uploadFile(file, options);
      console.log('✅ تم رفع الملف على MinIO:', minioResult);
      
      // الخطوة 2: حفظ البيانات في قاعدة البيانات
      const materialData = {
        title: options.title || file.name.split('.')[0], // إزالة امتداد الملف من العنوان
        description: options.description || '',
        category: options.category || 'general', // قيمة افتراضية
        fileId: minioResult.signature, // حفظ الاسم الكامل في MinIO كـ fileId
        uploadedBy: options.uploadedBy || 'مجهول',
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream', // قيمة افتراضية
        downloadURL: minioResult.downloadURL,
        viewURL: minioResult.viewURL || minioResult.downloadURL,
        subject: options.subject || '',
        categoryId: options.category || 'general', // قيمة افتراضية
        subjectId: options.subject || 'general', // قيمة افتراضية
        fileTypeId: options.fileType || 'other', // قيمة افتراضية
        tags: options.tags || null,
        semester: options.semester || null,
        year: options.year || null
      };
      
      console.log('📊 بيانات الملف المرسلة لقاعدة البيانات:', materialData);
      console.log('🔍 حقول قاعدة البيانات:', Object.keys(materialData));
      console.log('🔍 قيم الحقول المطلوبة:', {
        title: materialData.title,
        category: materialData.category,
        fileId: materialData.fileId,
        uploadedBy: materialData.uploadedBy,
        fileName: materialData.fileName,
        fileSize: materialData.fileSize,
        mimeType: materialData.mimeType,
        downloadURL: materialData.downloadURL,
        categoryId: materialData.categoryId,
        subjectId: materialData.subjectId,
        fileTypeId: materialData.fileTypeId
      });
      
      const dbResult = await databases.createDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        ID.unique(),
        materialData
      );
      console.log('✅ تم حفظ البيانات في قاعدة البيانات:', dbResult);
      
      // إرجاع نتيجة مدمجة
      return {
        // معلومات MinIO
        ...minioResult,
        // معلومات قاعدة البيانات
        documentId: dbResult.$id,
        databaseId: dbResult.$id,
        // تأكيد النجاح
        success: true,
        storageProvider: 'minio',
        databaseProvider: 'appwrite'
      };
      
    } catch (error) {
      console.error('❌ خطأ في الرفع المتكامل:', error);
      throw new Error(`فشل الرفع المتكامل: ${error.message}`);
    }
  },

  // ============= إدارة الملفات =============
  async getFileInfo(fileId) {
    try {
      // الحصول على معلومات الملف من قاعدة البيانات
      const dbInfo = await databases.getDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        fileId
      );
      
      // الحصول على روابط MinIO
      const downloadURL = minioStorage.getFileDownload(dbInfo.storageId);
      const viewURL = minioStorage.getFileView(dbInfo.storageId);
      const previewURL = minioStorage.getFilePreview(dbInfo.storageId);
      
      return {
        ...dbInfo,
        downloadURL,
        viewURL,
        previewURL
      };
    } catch (error) {
      console.error('خطأ في الحصول على معلومات الملف:', error);
      throw error;
    }
  },

  async deleteFile(documentId) {
    try {
      console.log('🗑️ بدء حذف الملف المتكامل:', documentId);
      
      // الحصول على معلومات الملف من قاعدة البيانات
      const dbInfo = await databases.getDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        documentId
      );
      
      console.log('📋 معلومات الملف من قاعدة البيانات:', {
        documentId: dbInfo.$id,
        fileId: dbInfo.fileId, // هذا يحتوي الآن على الاسم الكامل في MinIO
        fileName: dbInfo.fileName,
        title: dbInfo.title
      });
      
      // حذف الملف من MinIO باستخدام fileId (يحتوي على الاسم الكامل)
      await minioStorage.deleteFile(dbInfo.fileId, dbInfo.fileId);
      console.log('✅ تم حذف الملف من MinIO');
      
      // حذف البيانات من قاعدة البيانات
      await databases.deleteDocument(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        documentId
      );
      console.log('✅ تم حذف البيانات من قاعدة البيانات');
      
      console.log('✅ تم حذف الملف بالكامل من MinIO وقاعدة البيانات');
      return { success: true, message: 'تم حذف الملف بنجاح' };
    } catch (error) {
      console.error('❌ خطأ في حذف الملف:', error);
      throw new Error(`فشل في حذف الملف: ${error.message}`);
    }
  },

  async listFiles(limit = 100, offset = 0) {
    try {
      // الحصول على قائمة الملفات من قاعدة البيانات
      const dbFiles = await databases.listDocuments(
        DATABASE_ID,
        MATERIALS_COLLECTION_ID,
        [],
        limit,
        offset
      );
      
      // إضافة روابط MinIO لكل ملف
      const filesWithUrls = dbFiles.documents.map(file => ({
        ...file,
        downloadURL: minioStorage.getFileDownload(file.storageId),
        viewURL: minioStorage.getFileView(file.storageId),
        previewURL: minioStorage.getFilePreview(file.storageId)
      }));
      
      return {
        ...dbFiles,
        files: filesWithUrls
      };
    } catch (error) {
      console.error('خطأ في جلب قائمة الملفات:', error);
      throw error;
    }
  },

  // ============= روابط الملفات =============
  getFileDownload(fileId) {
    // استخدام storageId إذا كان متوفراً
    return minioStorage.getFileDownload(fileId);
  },

  getFileView(fileId) {
    return minioStorage.getFileView(fileId);
  },

  getFilePreview(fileId, width = 800, height = 600, quality = 90) {
    return minioStorage.getFilePreview(fileId, width, height, quality);
  },

  // ============= الوظائف المساعدة =============
  isValidFileType(mimeType) {
    return minioStorage.isValidFileType(mimeType);
  },

  isValidFileSize(size) {
    return minioStorage.isValidFileSize(size);
  },

  formatFileSize(bytes) {
    return minioStorage.formatFileSize(bytes);
  },

  getFileTypeIcon(mimeType) {
    return minioStorage.getFileTypeIcon(mimeType);
  },

  getFileCategory(mimeType) {
    return minioStorage.getFileCategory(mimeType);
  },

  // ============= العمليات المتعددة =============
  async uploadMultipleFiles(files, options = {}) {
    const results = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.uploadFile(files[i], {
          ...options,
          onProgress: (progress) => {
            if (options.onProgress) {
              const totalProgress = ((i / files.length) * 100) + (progress / files.length);
              options.onProgress(Math.round(totalProgress));
            }
          }
        });
        results.push(result);
      } catch (error) {
        errors.push({
          file: files[i].name,
          error: error.message
        });
      }
    }

    return {
      results,
      errors,
      successCount: results.length,
      errorCount: errors.length
    };
  },

  async deleteMultipleFiles(fileIds) {
    const results = [];
    const errors = [];

    for (const fileId of fileIds) {
      try {
        await this.deleteFile(fileId);
        results.push(fileId);
      } catch (error) {
        errors.push({
          fileId,
          error: error.message
        });
      }
    }

    return {
      deletedFiles: results,
      errors,
      successCount: results.length,
      errorCount: errors.length
    };
  }
};