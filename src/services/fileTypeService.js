/**
 * File Type Service
 * Handles all file type validation and checking logic using the fileTypes collection
 */

import { fileTypesService } from './appwriteService';

export const fileTypeService = {
  /**
   * Check if a file extension is allowed for a given file type
   * @param {string} fileTypeId - The file type ID
   * @param {string} fileName - The file name to check
   * @returns {Promise<boolean>}
   */
  async isFileAllowed(fileTypeId, fileName) {
    try {
      const fileType = await fileTypesService.getById(fileTypeId);
      
      if (!fileType || !fileType.allowedFormats) {
        console.warn('⚠️ No allowed formats found for file type:', fileTypeId);
        return false;
      }

      // Get file extension
      const extension = fileName.split('.').pop()?.toLowerCase();
      if (!extension) {
        return false;
      }

      // Parse allowed formats (comma-separated string)
      const allowedFormats = fileType.allowedFormats
        .split(',')
        .map(format => format.trim().toLowerCase());

      const isAllowed = allowedFormats.includes(extension);
      
      console.log('🔍 File validation:', {
        fileName,
        extension,
        fileTypeId,
        allowedFormats,
        isAllowed
      });

      return isAllowed;
    } catch (error) {
      console.error('❌ Error checking file type:', error);
      return false;
    }
  },

  /**
   * Get allowed formats for a file type
   * @param {string} fileTypeId
   * @returns {Promise<string[]>}
   */
  async getAllowedFormats(fileTypeId) {
    try {
      const fileType = await fileTypesService.getById(fileTypeId);
      
      if (!fileType || !fileType.allowedFormats) {
        return [];
      }

      return fileType.allowedFormats
        .split(',')
        .map(format => format.trim().toLowerCase());
    } catch (error) {
      console.error('❌ Error getting allowed formats:', error);
      return [];
    }
  },

  /**
   * Check if a file type supports preview (based on allowed formats)
   * @param {Object} fileType - The file type object from database
   * @param {string} fileName - The file name
   * @returns {boolean}
   */
  isPreviewSupported(fileType, fileName) {
    if (!fileType || !fileType.allowedFormats || !fileName) {
      return false;
    }

    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) {
      return false;
    }

    const allowedFormats = fileType.allowedFormats
      .split(',')
      .map(format => format.trim().toLowerCase());

    // Check if extension is in allowed formats
    if (!allowedFormats.includes(extension)) {
      return false;
    }

    // Preview is supported for PDFs and images
    const previewableFormats = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    return previewableFormats.includes(extension);
  },

  /**
   * Get file type by extension
   * @param {string} fileName
   * @returns {Promise<Object|null>}
   */
  async getFileTypeByExtension(fileName) {
    try {
      const extension = fileName.split('.').pop()?.toLowerCase();
      if (!extension) {
        return null;
      }

      const allFileTypes = await fileTypesService.getAll();
      
      // Find file type that includes this extension in allowedFormats
      const matchingFileType = allFileTypes.documents?.find(fileType => {
        if (!fileType.allowedFormats) return false;
        
        const allowedFormats = fileType.allowedFormats
          .split(',')
          .map(format => format.trim().toLowerCase());
        
        return allowedFormats.includes(extension);
      });

      return matchingFileType || null;
    } catch (error) {
      console.error('❌ Error getting file type by extension:', error);
      return null;
    }
  },

  /**
   * Validate file against file type
   * @param {File} file - The file to validate
   * @param {string} fileTypeId - The file type ID
   * @returns {Promise<{valid: boolean, error?: string}>}
   */
  async validateFile(file, fileTypeId) {
    try {
      if (!file || !fileTypeId) {
        return { valid: false, error: 'Missing file or file type' };
      }

      const fileType = await fileTypesService.getById(fileTypeId);
      
      if (!fileType) {
        return { valid: false, error: 'Invalid file type' };
      }

      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension) {
        return { valid: false, error: 'File has no extension' };
      }

      const allowedFormats = fileType.allowedFormats
        .split(',')
        .map(format => format.trim().toLowerCase());

      if (!allowedFormats.includes(extension)) {
        return {
          valid: false,
          error: `File type .${extension} is not allowed. Allowed formats: ${allowedFormats.join(', ')}`
        };
      }

      return { valid: true };
    } catch (error) {
      console.error('❌ Error validating file:', error);
      return { valid: false, error: error.message };
    }
  }
};

export default fileTypeService;
