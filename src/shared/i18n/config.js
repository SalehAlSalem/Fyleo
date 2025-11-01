import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Initialize with empty resources; we'll load from public/locales at runtime
const resources = {
  en: { translation: {} },
  ar: { translation: {} }
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: 'ar', // default language
    lng: localStorage.getItem('language') || 'ar', // initial language
    debug: false,
    
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

// Load translations from public folder asynchronously
async function loadTranslations() {
  try {
    const [enResp, arResp] = await Promise.all([
      fetch('/locales/en/translation.json'),
      fetch('/locales/ar/translation.json')
    ]);
    const [enJson, arJson] = await Promise.all([
      enResp.ok ? enResp.json() : Promise.resolve({}),
      arResp.ok ? arResp.json() : Promise.resolve({})
    ]);
    if (enJson && Object.keys(enJson).length) {
      i18n.addResourceBundle('en', 'translation', enJson, true, true);
    }
    if (arJson && Object.keys(arJson).length) {
      i18n.addResourceBundle('ar', 'translation', arJson, true, true);
    }
  } catch (e) {
    console.warn('i18n: Failed to load translation files from public/locales', e);
  }
}

loadTranslations();

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
