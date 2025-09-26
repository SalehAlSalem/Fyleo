import React from 'react';
import { Link } from 'react-router-dom';
import { ModernButton, useTranslation, useTheme } from '../../components/modern/ModernComponents';

const Modern404 = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="blob-container">
          <div className="blob blob-1 animate-blob-spin bg-gradient-to-r from-primary-400/30 to-secondary-400/30"></div>
          <div className="blob blob-2 animate-blob-bounce bg-gradient-to-r from-secondary-400/30 to-accent-400/30 animation-delay-2000"></div>
          <div className="blob blob-3 animate-blob-pulse bg-gradient-to-r from-accent-400/30 to-primary-400/30 animation-delay-4000"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent leading-none animate-pulse">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('pageNotFound', 'الصفحة غير موجودة', 'Page Not Found')}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {t('pageNotFoundDesc', 
                'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى موقع آخر.', 
                'Sorry, the page you are looking for does not exist or has been moved to another location.'
              )}
            </p>
          </div>

          {/* Illustration */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-48 h-48 mx-auto bg-gradient-to-br from-primary-100 to-accent-100 dark:from-gray-800 dark:to-gray-700 rounded-full shadow-lg">
              <svg className="w-24 h-24 text-primary-500 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.464-.881-6.08-2.33m0 0L5 13m.927-.82A7.965 7.965 0 014 9c0-4.418 3.582-8 8-8s8 3.582 8 8c0 1.538-.43 2.983-1.177 4.2L19 11m-1.073.82A7.965 7.965 0 0120 15c0 4.418-3.582 8-8 8s-8-3.582-8-8c0-1.538.43-2.983 1.177-4.2" />
              </svg>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/">
              <ModernButton 
                variant="primary" 
                size="lg"
                className="modern-button-glow w-full sm:w-auto"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {t('backToHome', 'العودة للرئيسية', 'Back to Home')}
              </ModernButton>
            </Link>

            <button 
              onClick={() => window.history.back()}
              className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('goBack', 'العودة للخلف', 'Go Back')}
            </button>
          </div>

          {/* Additional Links */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {t('needHelp', 'تحتاج مساعدة؟ جرب هذه الروابط:', 'Need help? Try these links:')}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                to="/materials" 
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
              >
                {t('materials', 'المواد التعليمية', 'Materials')}
              </Link>
              <Link 
                to="/login" 
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
              >
                {t('login', 'تسجيل الدخول', 'Login')}
              </Link>
              <Link 
                to="/signup" 
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
              >
                {t('signup', 'إنشاء حساب', 'Sign Up')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modern404;