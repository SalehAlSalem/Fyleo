import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  // G-L-01: Update HTML dir and lang attributes when language changes
  useEffect(() => {
    const dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
    
    // Persist language preference
    localStorage.setItem('language', currentLang);
    
    console.log(`🌐 Language changed to: ${currentLang} (${dir})`);
  }, [currentLang]);

  const toggleLanguage = () => {
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    const newDir = newLang === 'ar' ? 'rtl' : 'ltr';
    
    // Update immediately for better UX
    document.documentElement.dir = newDir;
    document.documentElement.lang = newLang;
    localStorage.setItem('language', newLang);
    
    // Change language
    i18n.changeLanguage(newLang).then(() => {
      // Force page reload to ensure all components update
      window.location.reload();
    });
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`modern-tool-btn flex-shrink-0 ${className}`}
      title={currentLang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
      aria-label="Toggle language"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    </button>
  );
};

export default LanguageSwitcher;
