// 🔍 File Validation Utilities
// استخدام المتغيرات البيئية للتحقق من الملفات

import { FILE_CONFIG, ERROR_MESSAGES, FILE_TYPE_CATEGORIES } from './constants.js';

/**
 * التحقق من صحة الملف المرفوع
 * @param {File} file - الملف المراد التحقق منه
 * @returns {Object} - نتيجة التحقق
 */
export const validateFile = (file) => {
    const result = {
        isValid: true,
        errors: [],
        warnings: []
    };

    // التحقق من حجم الملف
    if (file.size > FILE_CONFIG.MAX_FILE_SIZE) {
        result.isValid = false;
        result.errors.push(ERROR_MESSAGES.FILE_TOO_LARGE);
    }

    // التحقق من نوع الملف
    const fileExtension = getFileExtension(file.name);
    if (!FILE_CONFIG.ALLOWED_FILE_TYPES.includes(fileExtension.toLowerCase())) {
        result.isValid = false;
        result.errors.push(ERROR_MESSAGES.INVALID_FILE_TYPE);
    }

    // تحذيرات للملفات الكبيرة (أكثر من 10 ميجا)
    if (file.size > 10 * 1024 * 1024) {
        result.warnings.push('الملف كبير الحجم، قد يستغرق وقتاً أطول في الرفع');
    }

    return result;
};

/**
 * الحصول على امتداد الملف
 * @param {string} fileName - اسم الملف
 * @returns {string} - امتداد الملف
 */
export const getFileExtension = (fileName) => {
    return fileName.split('.').pop() || '';
};

/**
 * الحصول على فئة الملف حسب نوعه
 * @param {string} fileName - اسم الملف
 * @returns {string} - فئة الملف
 */
export const getFileCategory = (fileName) => {
    const extension = getFileExtension(fileName).toLowerCase();
    
    for (const [category, extensions] of Object.entries(FILE_TYPE_CATEGORIES)) {
        if (extensions.includes(extension)) {
            return category;
        }
    }
    
    return 'OTHER';
};

/**
 * تنسيق حجم الملف للعرض
 * @param {number} bytes - حجم الملف بالبايت
 * @returns {string} - حجم الملف منسق
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * التحقق من أن الملف صورة
 * @param {string} fileName - اسم الملف
 * @returns {boolean} - true إذا كان الملف صورة
 */
export const isImageFile = (fileName) => {
    const extension = getFileExtension(fileName).toLowerCase();
    return FILE_TYPE_CATEGORIES.IMAGES.includes(extension);
};

/**
 * التحقق من أن الملف فيديو
 * @param {string} fileName - اسم الملف  
 * @returns {boolean} - true إذا كان الملف فيديو
 */
export const isVideoFile = (fileName) => {
    const extension = getFileExtension(fileName).toLowerCase();
    return ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension);
};

/**
 * التحقق من أن الملف صوتي
 * @param {string} fileName - اسم الملف
 * @returns {boolean} - true إذا كان الملف صوتي
 */
export const isAudioFile = (fileName) => {
    const extension = getFileExtension(fileName).toLowerCase();
    return ['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(extension);
};

/**
 * الحصول على أيقونة الملف حسب نوعه
 * @param {string} fileName - اسم الملف
 * @returns {string} - اسم الأيقونة
 */
export const getFileIcon = (fileName) => {
    const extension = getFileExtension(fileName).toLowerCase();
    
    // صور
    if (FILE_TYPE_CATEGORIES.IMAGES.includes(extension)) {
        return 'image';
    }
    
    // وثائق
    if (FILE_TYPE_CATEGORIES.DOCUMENTS.includes(extension)) {
        if (extension === 'pdf') return 'file-pdf';
        return 'file-text';
    }
    
    // عروض تقديمية
    if (FILE_TYPE_CATEGORIES.PRESENTATIONS.includes(extension)) {
        return 'file-presentation';
    }
    
    // جداول بيانات
    if (FILE_TYPE_CATEGORIES.SPREADSHEETS.includes(extension)) {
        return 'file-spreadsheet';
    }
    
    // ملفات مضغوطة
    if (FILE_TYPE_CATEGORIES.ARCHIVES.includes(extension)) {
        return 'file-archive';
    }
    
    // فيديو
    if (isVideoFile(fileName)) {
        return 'file-video';
    }
    
    // صوت
    if (isAudioFile(fileName)) {
        return 'file-audio';
    }
    
    return 'file';
};

/**
 * إنشاء اسم ملف فريد لتجنب التكرار
 * @param {string} originalName - الاسم الأصلي للملف
 * @returns {string} - اسم الملف الفريد
 */
export const generateUniqueFileName = (originalName) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = getFileExtension(originalName);
    const nameWithoutExt = originalName.replace(`.${extension}`, '');
    
    return `${nameWithoutExt}_${timestamp}_${random}.${extension}`;
};

export default {
    validateFile,
    getFileExtension,
    getFileCategory,
    formatFileSize,
    isImageFile,
    isVideoFile,
    isAudioFile,
    getFileIcon,
    generateUniqueFileName
};