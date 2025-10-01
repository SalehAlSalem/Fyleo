// 📋 Constants & Configuration
// استخدام المتغيرات البيئية في التطبيق

// 🎯 Pagination Settings
export const PAGINATION = {
    MATERIALS_PER_PAGE: parseInt(import.meta.env.VITE_MATERIALS_PER_PAGE) || 20,
    SUBJECTS_PER_PAGE: parseInt(import.meta.env.VITE_SUBJECTS_PER_PAGE) || 15,
    CATEGORIES_PER_PAGE: parseInt(import.meta.env.VITE_CATEGORIES_PER_PAGE) || 12
};

// 📁 File Upload Configuration
export const FILE_CONFIG = {
    MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) * 1024 * 1024 || 50 * 1024 * 1024, // Convert MB to bytes
    ALLOWED_FILE_TYPES: import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(',') || [
        'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt',
        'jpg', 'jpeg', 'png', 'gif', 'mp4', 'mp3', 'zip', 'rar'
    ],
    DOWNLOAD_LINK_EXPIRY: parseInt(import.meta.env.VITE_DOWNLOAD_LINK_EXPIRY) || 604800 // 7 days in seconds
};

// 🔐 Security Settings
export const SECURITY = {
    DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
    DOWNLOAD_LINK_EXPIRY: parseInt(import.meta.env.VITE_DOWNLOAD_LINK_EXPIRY) || 604800
};

// 🌐 Localization
export const LOCALIZATION = {
    DEFAULT_LANGUAGE: import.meta.env.VITE_DEFAULT_LANGUAGE || 'ar',
    SUPPORTED_LANGUAGES: import.meta.env.VITE_SUPPORTED_LANGUAGES?.split(',') || ['ar', 'en']
};

// 🎨 Theme Configuration
export const THEME = {
    PRIMARY_COLOR: import.meta.env.VITE_THEME_PRIMARY_COLOR || '#3B82F6',
    SECONDARY_COLOR: import.meta.env.VITE_THEME_SECONDARY_COLOR || '#10B981',
    ENABLE_DARK_MODE: import.meta.env.VITE_ENABLE_DARK_MODE === 'true'
};

// 📊 Performance Settings
export const PERFORMANCE = {
    ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    CACHE_DURATION: parseInt(import.meta.env.VITE_CACHE_DURATION) || 300 // 5 minutes
};

// 📱 App Information
export const APP_INFO = {
    NAME: import.meta.env.VITE_APP_NAME || 'Fyleo',
    VERSION: import.meta.env.VITE_APP_VERSION || '3.0.0',
    ENVIRONMENT: import.meta.env.NODE_ENV || 'development'
};

// 🔍 File Type Categories for Better Organization
export const FILE_TYPE_CATEGORIES = {
    DOCUMENTS: ['pdf', 'doc', 'docx', 'txt'],
    PRESENTATIONS: ['ppt', 'pptx'],
    SPREADSHEETS: ['xls', 'xlsx'],
    IMAGES: ['jpg', 'jpeg', 'png', 'gif'],
    MEDIA: ['mp4', 'mp3'],
    ARCHIVES: ['zip', 'rar']
};

// 🎯 Academic Levels
export const ACADEMIC_LEVELS = {
    FRESHMAN: 'السنة الأولى',
    SOPHOMORE: 'السنة الثانية', 
    JUNIOR: 'السنة الثالثة',
    SENIOR: 'السنة الرابعة',
    GRADUATE: 'الدراسات العليا'
};

// 📚 Semester Types
export const SEMESTER_TYPES = {
    FALL: 'الفصل الأول',
    SPRING: 'الفصل الثاني',
    SUMMER: 'الفصل الصيفي'
};

// 🚫 Error Messages
export const ERROR_MESSAGES = {
    FILE_TOO_LARGE: `حجم الملف يتجاوز الحد المسموح (${import.meta.env.VITE_MAX_FILE_SIZE || 50} ميجابايت)`,
    INVALID_FILE_TYPE: 'نوع الملف غير مدعوم',
    UPLOAD_FAILED: 'فشل في رفع الملف',
    NETWORK_ERROR: 'خطأ في الاتصال',
    PERMISSION_DENIED: 'ليس لديك صلاحية للوصول'
};

// ✅ Success Messages  
export const SUCCESS_MESSAGES = {
    FILE_UPLOADED: 'تم رفع الملف بنجاح',
    FILE_DELETED: 'تم حذف الملف بنجاح',
    PROFILE_UPDATED: 'تم تحديث الملف الشخصي',
    BOOKMARK_ADDED: 'تم إضافة العلامة المرجعية',
    BOOKMARK_REMOVED: 'تم إزالة العلامة المرجعية'
};

export default {
    PAGINATION,
    FILE_CONFIG,
    SECURITY,
    LOCALIZATION,
    THEME,
    PERFORMANCE,
    APP_INFO,
    FILE_TYPE_CATEGORIES,
    ACADEMIC_LEVELS,
    SEMESTER_TYPES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
};