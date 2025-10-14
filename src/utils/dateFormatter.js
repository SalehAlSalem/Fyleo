/**
 * Date Formatting Utilities
 * تحويل التواريخ للتقويم الميلادي مع دعم اللغتين
 */

/**
 * تنسيق التاريخ حسب اللغة المختارة
 * @param {string|Date} date - التاريخ المراد تنسيقه
 * @param {string} language - اللغة ('ar' أو 'en')
 * @param {object} options - خيارات التنسيق
 * @returns {string} - التاريخ المنسق
 */
export const formatDate = (date, language = 'ar', options = {}) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // التحقق من صحة التاريخ
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  // الخيارات الافتراضية - التقويم الميلادي دائماً
  const defaultOptions = {
    calendar: 'gregory', // التقويم الميلادي
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  // تحديد اللغة المناسبة
  const locale = language === 'ar' ? 'ar-SA' : 'en-US';
  
  try {
    return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateObj.toLocaleDateString();
  }
};

/**
 * تنسيق التاريخ والوقت معاً
 * @param {string|Date} date - التاريخ المراد تنسيقه
 * @param {string} language - اللغة ('ar' أو 'en')
 * @returns {string} - التاريخ والوقت المنسق
 */
export const formatDateTime = (date, language = 'ar') => {
  return formatDate(date, language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * تنسيق التاريخ بشكل مختصر
 * @param {string|Date} date - التاريخ المراد تنسيقه
 * @param {string} language - اللغة ('ar' أو 'en')
 * @returns {string} - التاريخ المختصر
 */
export const formatDateShort = (date, language = 'ar') => {
  return formatDate(date, language, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * تنسيق التاريخ النسبي (منذ كم يوم)
 * @param {string|Date} date - التاريخ المراد تنسيقه
 * @param {string} language - اللغة ('ar' أو 'en')
 * @returns {string} - التاريخ النسبي
 */
export const formatRelativeDate = (date, language = 'ar') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now - dateObj;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  const translations = {
    ar: {
      justNow: 'الآن',
      secondsAgo: 'منذ {n} ثانية',
      minuteAgo: 'منذ دقيقة',
      minutesAgo: 'منذ {n} دقيقة',
      hourAgo: 'منذ ساعة',
      hoursAgo: 'منذ {n} ساعة',
      dayAgo: 'منذ يوم',
      daysAgo: 'منذ {n} يوم',
      monthAgo: 'منذ شهر',
      monthsAgo: 'منذ {n} شهر',
      yearAgo: 'منذ سنة',
      yearsAgo: 'منذ {n} سنة'
    },
    en: {
      justNow: 'Just now',
      secondsAgo: '{n} seconds ago',
      minuteAgo: '1 minute ago',
      minutesAgo: '{n} minutes ago',
      hourAgo: '1 hour ago',
      hoursAgo: '{n} hours ago',
      dayAgo: '1 day ago',
      daysAgo: '{n} days ago',
      monthAgo: '1 month ago',
      monthsAgo: '{n} months ago',
      yearAgo: '1 year ago',
      yearsAgo: '{n} years ago'
    }
  };
  
  const t = translations[language] || translations.ar;
  
  if (diffSecs < 60) return t.justNow;
  if (diffMins === 1) return t.minuteAgo;
  if (diffMins < 60) return t.minutesAgo.replace('{n}', diffMins);
  if (diffHours === 1) return t.hourAgo;
  if (diffHours < 24) return t.hoursAgo.replace('{n}', diffHours);
  if (diffDays === 1) return t.dayAgo;
  if (diffDays < 30) return t.daysAgo.replace('{n}', diffDays);
  if (diffMonths === 1) return t.monthAgo;
  if (diffMonths < 12) return t.monthsAgo.replace('{n}', diffMonths);
  if (diffYears === 1) return t.yearAgo;
  return t.yearsAgo.replace('{n}', diffYears);
};

/**
 * Hook لاستخدام تنسيق التواريخ مع i18n
 */
export const useDateFormatter = () => {
  // يمكن استخدام useTranslation هنا إذا لزم الأمر
  const getCurrentLanguage = () => {
    return localStorage.getItem('i18nextLng') || 'ar';
  };
  
  return {
    formatDate: (date, options) => formatDate(date, getCurrentLanguage(), options),
    formatDateTime: (date) => formatDateTime(date, getCurrentLanguage()),
    formatDateShort: (date) => formatDateShort(date, getCurrentLanguage()),
    formatRelativeDate: (date) => formatRelativeDate(date, getCurrentLanguage())
  };
};

export default {
  formatDate,
  formatDateTime,
  formatDateShort,
  formatRelativeDate,
  useDateFormatter
};
