import { storage, STORAGE_BUCKET_ID } from '../config/appwrite';
import { ID } from 'appwrite';

class StorageService {
  constructor() {
    this.allowedTypes = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png'];
  }

  async uploadFile(file, options = {}) {
    try {
      const uploadedFile = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        file
      );
      return {
        id: uploadedFile.$id,
        name: uploadedFile.name,
        size: uploadedFile.sizeOriginal
      };
    } catch (error) {
      throw new Error('فشل في رفع الملف');
    }
  }

  validateFile(file) {
    if (!file) return { isValid: false, error: 'لم يتم اختيار ملف' };
    return { isValid: true };
  }

  getFileUrl(fileId) {
    return storage.getFileView(STORAGE_BUCKET_ID, fileId);
  }
}

export default new StorageService();