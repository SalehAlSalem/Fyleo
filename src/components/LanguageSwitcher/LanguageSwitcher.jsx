import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
        currentLang === 'ar'
          ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700'
          : 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
      } ${className}`}
      title={currentLang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
      aria-label="Toggle language"
    >
      <span className="text-lg font-semibold">
        {currentLang === 'ar' ? '🇸🇦' : '🇬🇧'}
      </span>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {currentLang === 'ar' ? 'عربي' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
