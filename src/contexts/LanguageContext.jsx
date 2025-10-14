import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// Translations
const translations = {
  ar: {
    // Navigation
    home: 'الرئيسية',
    materials: 'المواد',
    dashboard: 'لوحة التحكم',
    profile: 'الملف الشخصي',
    admin: 'لوحة الإدارة',
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    
    // Common
    search: 'بحث',
    filter: 'تصفية',
    sort: 'ترتيب',
    upload: 'رفع',
    download: 'تحميل',
    delete: 'حذف',
    edit: 'تعديل',
    save: 'حفظ',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    close: 'إغلاق',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    warning: 'تحذير',
    info: 'معلومات',
    
    // Profile
    myProfile: 'ملفي الشخصي',
    editName: 'تعديل الاسم',
    accountInfo: 'معلومات الحساب',
    quickLinks: 'روابط سريعة',
    stats: 'الإحصائيات',
    filesUploaded: 'ملف مرفوع',
    downloads: 'تحميل',
    storageUsed: 'مساحة مستخدمة',
    
    // Dashboard
    myFiles: 'ملفاتي',
    recentUploads: 'آخر الملفات المرفوعة',
    bookmarks: 'المفضلة',
    uploadFile: 'رفع ملف',
    
    // Materials
    categories: 'التصنيفات',
    subjects: 'المواد',
    fileTypes: 'أنواع الملفات',
    selectCategory: 'اختر التصنيف',
    selectSubject: 'اختر المادة',
    selectFileType: 'اختر نوع الملف',
    
    // Admin
    usersManagement: 'إدارة المستخدمين',
    categoriesManagement: 'إدارة التصنيفات',
    subjectsManagement: 'إدارة المواد',
    fileTypesManagement: 'إدارة أنواع الملفات',
    materialsManagement: 'إدارة الملفات',
    
    // Messages
    uploadSuccess: 'تم رفع الملف بنجاح',
    uploadError: 'حدث خطأ أثناء رفع الملف',
    deleteSuccess: 'تم حذف الملف بنجاح',
    deleteError: 'حدث خطأ أثناء حذف الملف',
    updateSuccess: 'تم التحديث بنجاح',
    updateError: 'حدث خطأ أثناء التحديث',
    
    // Auth
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    name: 'الاسم',
    rememberMe: 'تذكرني',
    forgotPassword: 'نسيت كلمة المرور؟',
    dontHaveAccount: 'ليس لديك حساب؟',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    
    // Footer
    aboutUs: 'عن Fyleo',
    contactUs: 'تواصل معنا',
    madeWithLove: 'صُنع بحب بواسطة',
    allRightsReserved: 'جميع الحقوق محفوظة',
    
    // Stats
    totalUsers: 'مستخدم مسجل',
    totalFiles: 'ملف مرفوع',
    totalDownloads: 'تحميل',
    
    // File Info
    fileName: 'اسم الملف',
    fileSize: 'حجم الملف',
    uploadDate: 'تاريخ الرفع',
    uploadedBy: 'رفع بواسطة',
    category: 'التصنيف',
    subject: 'المادة',
    fileType: 'نوع الملف',
    description: 'الوصف',
    
    // Actions
    viewFile: 'عرض الملف',
    downloadFile: 'تحميل الملف',
    deleteFile: 'حذف الملف',
    editFile: 'تعديل الملف',
    shareFile: 'مشاركة الملف',
    addToBookmarks: 'إضافة للمفضلة',
    removeFromBookmarks: 'إزالة من المفضلة',
  },
  
  en: {
    // Navigation
    home: 'Home',
    materials: 'Materials',
    dashboard: 'Dashboard',
    profile: 'Profile',
    admin: 'Admin Panel',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    
    // Common
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    upload: 'Upload',
    download: 'Download',
    delete: 'Delete',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    
    // Profile
    myProfile: 'My Profile',
    editName: 'Edit Name',
    accountInfo: 'Account Information',
    quickLinks: 'Quick Links',
    stats: 'Statistics',
    filesUploaded: 'Files Uploaded',
    downloads: 'Downloads',
    storageUsed: 'Storage Used',
    
    // Dashboard
    myFiles: 'My Files',
    recentUploads: 'Recent Uploads',
    bookmarks: 'Bookmarks',
    uploadFile: 'Upload File',
    
    // Materials
    categories: 'Categories',
    subjects: 'Subjects',
    fileTypes: 'File Types',
    selectCategory: 'Select Category',
    selectSubject: 'Select Subject',
    selectFileType: 'Select File Type',
    
    // Admin
    usersManagement: 'Users Management',
    categoriesManagement: 'Categories Management',
    subjectsManagement: 'Subjects Management',
    fileTypesManagement: 'File Types Management',
    materialsManagement: 'Materials Management',
    
    // Messages
    uploadSuccess: 'File uploaded successfully',
    uploadError: 'Error uploading file',
    deleteSuccess: 'File deleted successfully',
    deleteError: 'Error deleting file',
    updateSuccess: 'Updated successfully',
    updateError: 'Error updating',
    
    // Auth
    email: 'Email',
    password: 'Password',
    name: 'Name',
    rememberMe: 'Remember Me',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    
    // Footer
    aboutUs: 'About Fyleo',
    contactUs: 'Contact Us',
    madeWithLove: 'Made with love by',
    allRightsReserved: 'All rights reserved',
    
    // Stats
    totalUsers: 'Registered Users',
    totalFiles: 'Uploaded Files',
    totalDownloads: 'Downloads',
    
    // File Info
    fileName: 'File Name',
    fileSize: 'File Size',
    uploadDate: 'Upload Date',
    uploadedBy: 'Uploaded By',
    category: 'Category',
    subject: 'Subject',
    fileType: 'File Type',
    description: 'Description',
    
    // Actions
    viewFile: 'View File',
    downloadFile: 'Download File',
    deleteFile: 'Delete File',
    editFile: 'Edit File',
    shareFile: 'Share File',
    addToBookmarks: 'Add to Bookmarks',
    removeFromBookmarks: 'Remove from Bookmarks',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get from localStorage or default to Arabic
    return localStorage.getItem('language') || 'ar';
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('language', language);
    
    // Update HTML dir and lang attributes
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  // Get field name based on current language
  const getFieldName = (fieldBase) => {
    return language === 'ar' ? `${fieldBase}Ar` : `${fieldBase}En`;
  };

  // Get localized value from object
  const getLocalizedValue = (obj, fieldBase) => {
    if (!obj) return '';
    const arField = `${fieldBase}Ar`;
    const enField = `${fieldBase}En`;
    return language === 'ar' ? (obj[arField] || obj[enField] || '') : (obj[enField] || obj[arField] || '');
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    getFieldName,
    getLocalizedValue,
    isRTL: language === 'ar',
    isArabic: language === 'ar',
    isEnglish: language === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
