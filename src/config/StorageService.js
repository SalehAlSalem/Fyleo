import { Client, Storage, ID } from 'appwrite';

const client = new Client()
  .setEndpoint('https://fyleo.appwrite.network/v1')
  .setProject('fyleo-project');

const storage = new Storage(client);
const BUCKET_ID = 'fyleo-files';

export const StorageService = {
  async uploadFile(file, options = {}) {
    try {
      const fileId = ID.unique();
      
      // رفع الملف
      const uploadPromise = storage.createFile(
        BUCKET_ID,
        fileId,
        file
      );

      // تتبع التقدم إذا تم توفير دالة onProgress
      if (options.onProgress) {
        // محاكاة التقدم لأن Appwrite لا يدعم onProgress مباشرة
        const progressInterval = setInterval(() => {
          const progress = Math.random() * 100;
          options.onProgress(progress);
        }, 100);

        uploadPromise.finally(() => {
          clearInterval(progressInterval);
          options.onProgress(100);
        });
      }

      const response = await uploadPromise;
      
      // الحصول على رابط التحميل
      const downloadURL = this.getFilePreview(response.$id);
      
      return {
        fileId: response.$id,
        downloadURL: downloadURL,
        fileName: response.name,
        size: response.sizeOriginal,
        mimeType: response.mimeType
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  getFilePreview(fileId, width = 800, height = 600) {
    try {
      const url = storage.getFilePreview(
        BUCKET_ID,
        fileId,
        width,
        height
      );
      return url;
    } catch (error) {
      console.error('Error getting file preview:', error);
      return null;
    }
  },

  getFileDownload(fileId) {
    try {
      const url = storage.getFileDownload(
        BUCKET_ID,
        fileId
      );
      return url;
    } catch (error) {
      console.error('Error getting file download URL:', error);
      return null;
    }
  },

  getFileView(fileId) {
    try {
      const url = storage.getFileView(
        BUCKET_ID,
        fileId
      );
      return url;
    } catch (error) {
      console.error('Error getting file view URL:', error);
      return null;
    }
  },

  async deleteFile(fileId) {
    try {
      await storage.deleteFile(
        BUCKET_ID,
        fileId
      );
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  async getFileInfo(fileId) {
    try {
      const response = await storage.getFile(
        BUCKET_ID,
        fileId
      );
      return response;
    } catch (error) {
      console.error('Error getting file info:', error);
      throw error;
    }
  },

  async listFiles(limit = 100, offset = 0) {
    try {
      const response = await storage.listFiles(
        BUCKET_ID,
        [],
        limit,
        offset
      );
      return response;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }
};