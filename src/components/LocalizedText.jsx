import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * مكون لعرض النصوص المترجمة من قاعدة البيانات
 * 
 * @param {Object} item - الكائن من قاعدة البيانات
 * @param {string} field - اسم الحقل الأساسي (بدون Ar/En)
 * @param {string} fallback - نص احتياطي إذا لم يوجد
 */
const LocalizedText = ({ item, field, fallback = '' }) => {
  const { getLocalizedValue } = useLanguage();
  
  if (!item) return fallback;
  
  return getLocalizedValue(item, field) || fallback;
};

export default LocalizedText;

/**
 * Hook مساعد للحصول على النص المترجم
 */
export const useLocalizedText = () => {
  const { getLocalizedValue } = useLanguage();
  
  return (item, field, fallback = '') => {
    if (!item) return fallback;
    return getLocalizedValue(item, field) || fallback;
  };
};
