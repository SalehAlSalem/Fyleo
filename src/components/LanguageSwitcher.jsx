import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = ({ className = '' }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
        language === 'ar'
          ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700'
          : 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
      } ${className}`}
      title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <span className="text-lg font-semibold">
        {language === 'ar' ? '🇸🇦' : '🇬🇧'}
      </span>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {language === 'ar' ? 'عربي' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
