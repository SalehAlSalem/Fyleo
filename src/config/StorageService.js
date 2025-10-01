import { Client, Storage, ID } from 'appwrite';
import { STORAGE_BUCKET_ID } from './appwrite.js';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_URL || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '68d9740b0012416cb71b');

const storage = new Storage(client);

export const StorageService = {
  // ============= File Upload =============
  async uploadFile(file, options = {}) {
    try {
      const fileId = options.fileId || ID.unique();
      
      // التحقق من نوع الملف والحجم
      if (!this.isValidFileType(file.type)) {
        throw new Error('نوع الملف غير مدعوم');
      }
      
      if (!this.isValidFileSize(file.size)) {
        throw new Error('حجم الملف كبير جداً (الحد الأقصى 100 ميجابايت)');
      }

      // إنشاء metadata للملف
      const metadata = {
        originalName: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        ...options.metadata
      };

      console.log('بدء رفع الملف:', file.name);

      // رفع الملف
      const uploadPromise = storage.createFile(
        STORAGE_BUCKET_ID,
        fileId,
        file
      );

      // محاكاة تتبع التقدم
      if (options.onProgress) {
        const progressInterval = setInterval(() => {
          const progress = Math.min(90, Math.random() * 100);
          options.onProgress(progress);
        }, 200);

        uploadPromise.finally(() => {
          clearInterval(progressInterval);
          options.onProgress(100);
        });
      }

      const response = await uploadPromise;
      console.log('تم رفع الملف بنجاح:', response);
      
      // الحصول على روابط المعاينة والتحميل
      const downloadURL = this.getFileDownload(response.$id);
      const viewURL = this.getFileView(response.$id);
      const previewURL = this.getFilePreview(response.$id);
      
      return {
        fileId: response.$id,
        downloadURL: downloadURL,
        viewURL: viewURL,
        previewURL: previewURL,
        fileName: response.name,
        size: response.sizeOriginal,
        mimeType: response.mimeType,
        metadata: metadata
      };
    } catch (error) {
      console.error('خطأ في رفع الملف:', error);
      throw new Error(`فشل في رفع الملف: ${error.message}`);
    }
  },

  // ============= File Management =============
  async getFileInfo(fileId) {
    try {
      const response = await storage.getFile(
        STORAGE_BUCKET_ID,
        fileId
      );
      return {
        ...response,
        downloadURL: this.getFileDownload(fileId),
        viewURL: this.getFileView(fileId),
        previewURL: this.getFilePreview(fileId)
      };
    } catch (error) {
      console.error('خطأ في الحصول على معلومات الملف:', error);
      throw error;
    }
  },

  async deleteFile(fileId) {
    try {
      await storage.deleteFile(
        STORAGE_BUCKET_ID,
        fileId
      );
      console.log('تم حذف الملف بنجاح:', fileId);
      return true;
    } catch (error) {
      console.error('خطأ في حذف الملف:', error);
      throw error;
    }
  },

  async listFiles(limit = 100, offset = 0) {
    try {
      const response = await storage.listFiles(
        STORAGE_BUCKET_ID,
        [],
        limit,
        offset
      );
      
      // إضافة روابط لكل ملف
      const filesWithUrls = response.files.map(file => ({
        ...file,
        downloadURL: this.getFileDownload(file.$id),
        viewURL: this.getFileView(file.$id),
        previewURL: this.getFilePreview(file.$id)
      }));
      
      return {
        ...response,
        files: filesWithUrls
      };
    } catch (error) {
      console.error('خطأ في جلب قائمة الملفات:', error);
      throw error;
    }
  },

  // ============= File URLs =============
  getFileDownload(fileId) {
    try {
      const url = storage.getFileDownload(
        STORAGE_BUCKET_ID,
        fileId
      );
      return url.href || url;
    } catch (error) {
      console.error('خطأ في الحصول على رابط التحميل:', error);
      return null;
    }
  },

  getFileView(fileId) {
    try {
      const url = storage.getFileView(
        STORAGE_BUCKET_ID,
        fileId
      );
      return url.href || url;
    } catch (error) {
      console.error('خطأ في الحصول على رابط العرض:', error);
      return null;
    }
  },

  getFilePreview(fileId, width = 800, height = 600, quality = 90) {
    try {
      const url = storage.getFilePreview(
        STORAGE_BUCKET_ID,
        fileId,
        width,
        height,
        'center',
        quality
      );
      return url.href || url;
    } catch (error) {
      console.error('خطأ في الحصول على رابط المعاينة:', error);
      return null;
    }
  },

  // ============= Validation Functions =============
  isValidFileType(mimeType) {
    const allowedTypes = [
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv',
      'application/rtf',
      
      // Images
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/bmp',
      
      // Videos
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/wmv',
      'video/flv',
      'video/webm',
      
      // Audio
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/aac',
      
      // Archives
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/gzip'
    ];

    return allowedTypes.includes(mimeType);
  },

  isValidFileSize(size) {
    const maxSize = 100 * 1024 * 1024; // 100 MB
    return size <= maxSize;
  },

  // ============= Utility Functions =============
  formatFileSize(bytes) {
    if (bytes === 0) return '0 بايت';
    
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  getFileTypeIcon(mimeType) {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📋';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) return '🗜️';
    return '📁';
  },

  getFileCategory(mimeType) {
    if (mimeType.startsWith('image/')) return 'images';
    if (mimeType.startsWith('video/')) return 'videos';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('word')) return 'documents';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'spreadsheets';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentations';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) return 'archives';
    return 'others';
  },

  // ============= Bulk Operations =============
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