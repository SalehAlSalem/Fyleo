import { IntegratedStorageService } from './IntegratedStorageService.js';

export const StorageService = {
  // ============= File Upload =============
  async uploadFile(file, options = {}) {
    try {
      console.log('بدء رفع الملف عبر MinIO:', file.name);
      
      // محاكاة progress للتجربة البصرية
      if (options.onProgress) {
        const simulateProgress = () => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            if (progress <= 90) {
              options.onProgress(progress);
            } else {
              clearInterval(interval);
            }
          }, 200);
          return interval;
        };
        const progressInterval = simulateProgress();
        
        // استخدام الخدمة المتكاملة (MinIO + Database)
        const result = await IntegratedStorageService.uploadFile(file, options);
        
        clearInterval(progressInterval);
        options.onProgress(100);
        
        console.log('تم رفع الملف بنجاح عبر MinIO:', result);
        return result;
      } else {
        // استخدام الخدمة المتكاملة (MinIO + Database)
        const result = await IntegratedStorageService.uploadFile(file, options);
        console.log('تم رفع الملف بنجاح عبر MinIO:', result);
        return result;
      }
    } catch (error) {
      console.error('خطأ في رفع الملف عبر MinIO:', error);
      throw new Error(`فشل في رفع الملف: ${error.message}`);
    }
  },

  // ============= File Management =============
  async getFileInfo(fileId) {
    try {
      return await IntegratedStorageService.getFileInfo(fileId);
    } catch (error) {
      console.error('خطأ في الحصول على معلومات الملف:', error);
      throw error;
    }
  },

  async deleteFile(fileId) {
    try {
      const result = await IntegratedStorageService.deleteFile(fileId);
      console.log('تم حذف الملف بنجاح من MinIO:', fileId);
      return result;
    } catch (error) {
      console.error('خطأ في حذف الملف من MinIO:', error);
      throw error;
    }
  },

  async listFiles(limit = 100, offset = 0) {
    try {
      return await IntegratedStorageService.listFiles(limit, offset);
    } catch (error) {
      console.error('خطأ في جلب قائمة الملفات من MinIO:', error);
      throw error;
    }
  },

  // ============= File URLs =============
  getFileDownload(fileId) {
    try {
      return IntegratedStorageService.getFileDownload(fileId);
    } catch (error) {
      console.error('خطأ في الحصول على رابط التحميل من MinIO:', error);
      return null;
    }
  },

  getFileView(fileId) {
    try {
      return IntegratedStorageService.getFileView(fileId);
    } catch (error) {
      console.error('خطأ في الحصول على رابط العرض من MinIO:', error);
      return null;
    }
  },

  getFilePreview(fileId, width = 800, height = 600, quality = 90) {
    try {
      return IntegratedStorageService.getFilePreview(fileId, width, height, quality);
    } catch (error) {
      console.error('خطأ في الحصول على رابط المعاينة من MinIO:', error);
      return null;
    }
  },

  // ============= Validation Functions =============
  isValidFileType(mimeType) {
    return IntegratedStorageService.isValidFileType(mimeType);
  },

  isValidFileSize(size) {
    return IntegratedStorageService.isValidFileSize(size);
  },

  // ============= Utility Functions =============
  formatFileSize(bytes) {
    return IntegratedStorageService.formatFileSize(bytes);
  },

  getFileTypeIcon(mimeType) {
    return IntegratedStorageService.getFileTypeIcon(mimeType);
  },

  getFileCategory(mimeType) {
    return IntegratedStorageService.getFileCategory(mimeType);
  },

  // ============= Bulk Operations =============
  async uploadMultipleFiles(files, options = {}) {
    try {
      return await IntegratedStorageService.uploadMultipleFiles(files, options);
    } catch (error) {
      console.error('خطأ في رفع الملفات المتعددة عبر MinIO:', error);
      throw error;
    }
  },

  async deleteMultipleFiles(fileIds) {
    try {
      return await IntegratedStorageService.deleteMultipleFiles(fileIds);
    } catch (error) {
      console.error('خطأ في حذف الملفات المتعددة من MinIO:', error);
      throw error;
    }
  }
};