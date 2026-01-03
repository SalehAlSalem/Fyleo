import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  // Load translations from public folder
  .use(HttpBackend)
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    fallbackLng: 'ar', // default language
    lng: localStorage.getItem('language') || 'ar', // initial language
    debug: false,
    
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    
    react: {
      useSuspense: false // Disable suspense to avoid loading issues
    }
  });

// Update HTML attributes when language changes
i18n.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('lang', lng);
  document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr');
  localStorage.setItem('language', lng);
});

// Set initial direction
const currentLang = i18n.language || 'ar';
document.documentElement.setAttribute('lang', currentLang);
document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');

export default i18n;
