import { Client, Functions } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_URL || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const functions = new Functions(client);
const UPLOAD_FUNCTION_ID = import.meta.env.VITE_APPWRITE_MINIO_UPLOAD_FUNCTION_ID;

export const StorageService = {
  async uploadFile(file, options = {}) {
    try {
      if (!this.isValidFileType(file.type)) {
        throw new Error('نوع الملف غير مدعوم');
      }
      if (!this.isValidFileSize(file.size)) {
        throw new Error('حجم الملف كبير جداً (الحد الأقصى 100 ميجابايت)');
      }
      if (!UPLOAD_FUNCTION_ID) {
        throw new Error('لم يتم ضبط مُعرف وظيفة Appwrite الخاصة برفع MinIO (VITE_APPWRITE_MINIO_UPLOAD_FUNCTION_ID)');
      }

      // 1) اطلب رابط رفع موقّت من Appwrite Function
      const execution = await functions.createExecution(
        UPLOAD_FUNCTION_ID,
        JSON.stringify({
          action: 'getUploadUrl',
          fileName: file.name,
          contentType: file.type
        }),
        false,
        '/',
        'POST'
      );

      let data;
      try {
        data = JSON.parse(execution.responseBody || '{}');
      } catch (e) {
        throw new Error('استجابة الوظيفة غير صالحة');
      }

      const { uploadUrl, objectName, downloadUrl } = data || {};
      if (!uploadUrl || !objectName) {
        throw new Error('فشل الحصول على رابط الرفع من الوظيفة');
      }

      console.log('🔼 بدء رفع الملف عبر Presigned URL:', { objectName });

      // 2) ارفع الملف إلى MinIO عبر Presigned URL with progress tracking
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // ✅ Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable && options.onProgress) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            options.onProgress(percentComplete);
            console.log(`📈 Upload progress: ${percentComplete}%`);
          }
        });
        
        // ✅ Handle completion
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            if (options.onProgress) options.onProgress(100);
            resolve();
          } else {
            reject(new Error(`فشل رفع الملف إلى MinIO: ${xhr.status}`));
          }
        });
        
        // ✅ Handle errors
        xhr.addEventListener('error', () => {
          reject(new Error('حدث خطأ أثناء رفع الملف'));
        });
        
        xhr.addEventListener('abort', () => {
          reject(new Error('تم إلغاء عملية الرفع'));
        });
        
        // ✅ Start upload
        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

      console.log('✅ تم رفع الملف بنجاح إلى MinIO:', { objectName });

      // ✅ Generate permanent public URL (bucket is public with download policy)
      const publicUrl = this.getPublicURL(objectName);
      console.log('✅ Public URL (permanent):', publicUrl);

      return {
        fileId: objectName,
        downloadURL: publicUrl,
        viewURL: publicUrl,
        previewURL: publicUrl,
        fileName: file.name,
        size: file.size,
        mimeType: file.type
      };
    } catch (error) {
      console.error('خطأ في رفع الملف عبر الوظيفة:', error);
      throw new Error(`فشل في رفع الملف: ${error.message}`);
    }
  },

  async deleteFile(fileId) {
    try {
      if (!UPLOAD_FUNCTION_ID) {
        throw new Error('لم يتم ضبط مُعرف وظيفة Appwrite (VITE_APPWRITE_MINIO_UPLOAD_FUNCTION_ID)');
      }
      const execution = await functions.createExecution(
        UPLOAD_FUNCTION_ID,
        JSON.stringify({ action: 'deleteObject', objectName: fileId }),
        false,
        '/',
        'POST'
      );
      const res = JSON.parse(execution.responseBody || '{}');
      const ok = !!res?.deleted;
      if (ok) console.log('🗑️ تم حذف الملف بنجاح:', fileId);
      return ok;
    } catch (error) {
      console.error('خطأ في حذف الملف عبر الوظيفة:', error);
      throw error;
    }
  },

  /**
   * Get public URL for a file (permanent - no expiry)
   * @param {string} fileId - MinIO object name
   * @returns {string} - Public URL
   */
  getPublicURL(fileId) {
    const endpoint = import.meta.env.VITE_MINIO_ENDPOINT;
    const port = import.meta.env.VITE_MINIO_PORT || '9000';
    const useSSL = String(import.meta.env.VITE_MINIO_USE_SSL || 'true') === 'true';
    const bucket = import.meta.env.VITE_MINIO_BUCKET_NAME || 'mybucket';
    
    const protocol = useSSL ? 'https' : 'http';
    const publicUrl = `${protocol}://${endpoint}:${port}/${bucket}/${fileId}`;
    
    return publicUrl;
  },

  /**
   * Get file download URL (uses public URL - permanent)
   * @param {string} fileId - MinIO object name
   * @returns {Promise<string|null>}
   */
  async getFileDownload(fileId) {
    try {
      // ✅ Return permanent public URL (bucket is public)
      return this.getPublicURL(fileId);
    } catch (error) {
      console.error('خطأ في الحصول على رابط التحميل:', error);
      return null;
    }
  },

  /**
   * Get presigned download URL that forces download (Content-Disposition: attachment)
   * @param {string} fileId - MinIO object name
   * @param {string} fileName - Original file name for download
   * @returns {Promise<string>}
   */
  async getDownloadURL(fileId, fileName = null) {
    try {
      if (!UPLOAD_FUNCTION_ID) {
        // Fallback to public URL
        return this.getPublicURL(fileId);
      }

      const execution = await functions.createExecution(
        UPLOAD_FUNCTION_ID,
        JSON.stringify({
          action: 'getDownloadUrl',
          objectName: fileId,
          fileName: fileName || fileId.split('/').pop()
        }),
        false,
        '/',
        'POST'
      );

      let data;
      try {
        data = JSON.parse(execution.responseBody || '{}');
      } catch (e) {
        console.warn('Failed to parse presign response, using public URL');
        return this.getPublicURL(fileId);
      }

      const { downloadUrl } = data || {};
      if (downloadUrl) {
        return downloadUrl;
      }

      // Fallback to public URL
      return this.getPublicURL(fileId);
    } catch (error) {
      console.error('خطأ في الحصول على رابط التحميل:', error);
      // Fallback to public URL
      return this.getPublicURL(fileId);
    }
  },
  
  getFileView(fileId) {
    // ✅ Return permanent public URL
    return this.getPublicURL(fileId);
  },
  
  getFilePreview(fileId) {
    // ✅ Return permanent public URL
    return this.getPublicURL(fileId);
  },
  
  // Helper functions remain the same
  isValidFileType(mimeType) {
    const allowedTypes = [
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
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/bmp',
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/wmv',
      'video/flv',
      'video/webm',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/aac',
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
};