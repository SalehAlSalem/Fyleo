import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme Context for modern design system
const ThemeContext = createContext();

// Import LanguageContext from the new system
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';

// Modern Theme Provider
export const ModernThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('fyleo-theme') || 'light';
    
    setTheme(savedTheme);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('fyleo-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeContext.Provider>
  );
};

// Modern Button Component
export const ModernButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  loading = false, 
  icon,
  ...props 
}) => {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variants = {
    primary: 'btn-primary',
    login: 'btn-login',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 focus:ring-red-500'
  };

  return (
    <button 
      className={`btn ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// Modern Card Component
export const ModernCard = ({ 
  children, 
  className = '', 
  hover = false, 
  glass = false,
  ...props 
}) => {
  const cardClass = glass ? 'glass' : 'card';
  const hoverClass = hover ? 'card-hover' : '';
  
  return (
    <div className={`${cardClass} ${hoverClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Modern Input Component
export const ModernInput = ({ 
  label, 
  error, 
  className = '', 
  icon,
  ...props 
}) => {
  const { language } = useLanguage();
  
  return (
    <div className="form-group-modern">
      {label && (
        <label className="form-label-modern">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-3 text-gray-400`}>
            {icon}
          </div>
        )}
        <input 
          className={`input-modern ${icon ? (language === 'ar' ? 'pr-10' : 'pl-10') : ''} ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

// Modern Badge Component
export const ModernBadge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'badge-modern',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  return (
    <span className={`${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Modern Alert Component
export const ModernAlert = ({ type = 'info', title, children, onClose }) => {
  const types = {
    success: 'alert-success',
    error: 'alert-error',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };

  return (
    <div className={`${types[type]} relative`}>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
      )}
      {title && <h4 className="font-semibold mb-2">{title}</h4>}
      {children}
    </div>
  );
};

// Modern Progress Bar Component
export const ModernProgress = ({ progress = 0, className = '' }) => {
  return (
    <div className={`progress-modern ${className}`}>
      <div 
        className="progress-modern-bar"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
};

// Modern Loading Skeleton
export const ModernSkeleton = ({ className = '', lines = 1 }) => {
  return (
    <div className="animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`loading-pulse rounded-lg h-4 mb-2 ${className}`} />
      ))}
    </div>
  );
};

// Theme Toggle Component - Redesigned
export const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <button
      onClick={toggleTheme}
      className="modern-tool-btn flex-shrink-0"
      aria-label="Toggle theme"
      title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    >
      {theme === 'light' ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
};

// Language Toggle Component
export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
      aria-label="Toggle language"
    >
      {language === 'ar' ? 'EN' : 'ع'}
    </button>
  );
};

// Custom Hooks
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ModernThemeProvider');
  }
  return context;
};

// Re-export useLanguage for external use
export { useLanguage } from '@/contexts/LanguageContext';

// Translations Helper
export const translations = {
  ar: {
    // Navigation
    home: 'الرئيسية',
    materials: 'المكتبة',
    dashboard: 'لوحة التحكم',
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    profile: 'الملف الشخصي',
    
    // Hero Section
    heroTitle: 'شارك ملفاتك',
    heroSubtitle: 'بسهولة وأمان',
    heroDescription: 'منصة متقدمة لمشاركة الملفات مع طلاب جامعة البلقاء التطبيقية. رفع سريع، تنظيم ذكي، وأمان عالي.',
    newFeature: 'ميزة جديدة - Firebase Storage',
    getStarted: 'ابدأ الآن',
    exploreMaterials: 'استكشف المكتبة',
    goToDashboard: 'اذهب للوحة التحكم',
    previewPlaceholder: 'معاينة المنصة',
    
    // Features
    whyChooseUs: 'لماذا تختارنا؟',
    featuresDescription: 'نقدم أفضل الحلول لمشاركة وإدارة الملفات الأكاديمية',
    fastUpload: 'رفع سريع',
    fastUploadDesc: 'رفع الملفات بسرعة عالية مع Firebase Storage',
    secure: 'آمن ومحمي',
    secureDesc: 'حماية متقدمة للملفات مع التشفير الكامل',
    accessible: 'متاح في أي مكان',
    accessibleDesc: 'وصول سهل للملفات من أي مكان وأي جهاز',
    responsive: 'متجاوب',
    responsiveDesc: 'يعمل بشكل مثالي على جميع الأجهزة',
    
    // Stats
    ourNumbers: 'أرقامنا',
    statsDescription: 'إحصائيات تعكس جودة خدماتنا',
    users: 'مستخدم',
    files: 'ملف',
    uptime: 'وقت التشغيل',
    support: 'دعم فني',
    
    // CTA
    readyToStart: 'مستعد للبدء؟',
    ctaDescription: 'انضم إلى آلاف الطلاب الذين يستخدمون منصتنا لمشاركة المواد الأكاديمية',
    startFree: 'ابدأ مجاناً',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    
    // Common
    loading: 'جاري التحميل...',
    error: 'حدث خطأ',
    success: 'تم بنجاح',
    cancel: 'إلغاء',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    view: 'عرض',
    download: 'تحميل',
    upload: 'رفع',
    search: 'البحث',
    filter: 'فلترة',
    
    // Theme
    lightMode: 'الوضع النهاري',
    darkMode: 'الوضع الليلي',
    
    // Language
    arabic: 'العربية',
    english: 'English',
    
    // Footer
    rights: 'جميع الحقوق محفوظة',
    contact: 'تواصل معنا',
    about: 'حول',
    privacy: 'الخصوصية',
    terms: 'الشروط'
  },
  en: {
    // Navigation
    home: 'Home',
    materials: 'Materials',
    dashboard: 'Dashboard',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    profile: 'Profile',
    
    // Hero Section
    heroTitle: 'Share Your Files',
    heroSubtitle: 'Easily & Securely',
    heroDescription: 'Advanced platform for sharing files with AlBalqa Applied University students. Fast upload, smart organization, and high security.',
    newFeature: 'New Feature - Firebase Storage',
    getStarted: 'Get Started',
    exploreMaterials: 'Explore Materials',
    goToDashboard: 'Go to Dashboard',
    previewPlaceholder: 'Platform Preview',
    
    // Features
    whyChooseUs: 'Why Choose Us?',
    featuresDescription: 'We provide the best solutions for sharing and managing academic files',
    fastUpload: 'Fast Upload',
    fastUploadDesc: 'Upload files at high speed with Firebase Storage',
    secure: 'Secure & Protected',
    secureDesc: 'Advanced file protection with full encryption',
    accessible: 'Accessible Anywhere',
    accessibleDesc: 'Easy access to files from anywhere, any device',
    responsive: 'Responsive',
    responsiveDesc: 'Works perfectly on all devices',
    
    // Stats
    ourNumbers: 'Our Numbers',
    statsDescription: 'Statistics that reflect the quality of our services',
    users: 'Users',
    files: 'Files',
    uptime: 'Uptime',
    support: 'Support',
    
    // CTA
    readyToStart: 'Ready to Start?',
    ctaDescription: 'Join thousands of students who use our platform to share academic materials',
    startFree: 'Start Free',
    alreadyHaveAccount: 'Already have an account?',
    
    // Common
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    download: 'Download',
    upload: 'Upload',
    search: 'Search',
    filter: 'Filter',
    
    // Theme
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    
    // Language
    arabic: 'العربية',
    english: 'English',
    
    // Footer
    rights: 'All rights reserved',
    contact: 'Contact',
    about: 'About',
    privacy: 'Privacy',
    terms: 'Terms'
  }
};

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key) => {
    return translations[language]?.[key] || key;
  };
  
  return { t, language };
};