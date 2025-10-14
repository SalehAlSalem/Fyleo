import { useTranslation } from 'react-i18next';

/**
 * Custom hook for handling localized content from database
 * Automatically selects the correct field based on current language
 */
export const useLocalizedContent = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  /**
   * Get localized value from an object
   * @param {Object} item - The object containing localized fields
   * @param {string} fieldBase - The base field name (without Ar/En suffix)
   * @param {string} fallback - Fallback value if field doesn't exist
   * @returns {string} The localized value
   */
  const getLocalizedValue = (item, fieldBase, fallback = '') => {
    if (!item) return fallback;
    
    const arField = `${fieldBase}Ar`;
    const enField = `${fieldBase}En`;
    
    if (currentLang === 'ar') {
      return item[arField] || item[enField] || fallback;
    } else {
      return item[enField] || item[arField] || fallback;
    }
  };

  /**
   * Get the field name based on current language
   * @param {string} fieldBase - The base field name
   * @returns {string} The field name with language suffix
   */
  const getFieldName = (fieldBase) => {
    return currentLang === 'ar' ? `${fieldBase}Ar` : `${fieldBase}En`;
  };

  /**
   * Check if current language is RTL
   * @returns {boolean}
   */
  const isRTL = () => {
    return currentLang === 'ar';
  };

  /**
   * Check if current language is Arabic
   * @returns {boolean}
   */
  const isArabic = () => {
    return currentLang === 'ar';
  };

  /**
   * Check if current language is English
   * @returns {boolean}
   */
  const isEnglish = () => {
    return currentLang === 'en';
  };

  return {
    getLocalizedValue,
    getFieldName,
    isRTL: isRTL(),
    isArabic: isArabic(),
    isEnglish: isEnglish(),
    currentLang
  };
};

export default useLocalizedContent;
