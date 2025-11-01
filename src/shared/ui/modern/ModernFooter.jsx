import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ModernFooter = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white py-12 pb-24 md:pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📚</span>
              <span>{t('footer.aboutUs')}</span>
            </h3>
            <p className="text-gray-400 mb-4">
              {t('footer.aboutDesc')}
            </p>
            <p className="text-sm text-gray-500">
              {t('footer.madeWithLove')} Saleh Al-Salem
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  🏠 {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/library" className="text-gray-400 hover:text-white transition-colors">
                  📚 {t('nav.materials')}
                </Link>
              </li>
              <li>
                <Link to="/workspace" className="text-gray-400 hover:text-white transition-colors">
                  💼 {t('nav.dashboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:fyleo.bawa3neh.97@gmail.com" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>📧</span>
                  <span>fyleo.bawa3neh.97@gmail.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/SalehAlSalem/Fyleo" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>💻</span>
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.linkedin.com/in/saleh-al-salem-226122294/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>💼</span>
                  <span>LinkedIn</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-gray-800 pt-8 mb-6">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm mb-6">
            <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
              {t('legal.termsOfService')}
            </Link>
            <span className="text-gray-600">•</span>
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
              {t('legal.privacyPolicy')}
            </Link>
            <span className="text-gray-600">•</span>
            <Link to="/disclaimer" className="text-gray-400 hover:text-white transition-colors">
              {t('legal.disclaimer')}
            </Link>
          </div>
          
          {/* Donation Button */}
          <div className="flex justify-center mb-6">
            <a
              href="https://ko-fi.com/bawa3neh_97"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-2xl">☕</span>
              <span>{t('footer.supportUs')}</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-400">
            © 2025 Fyleo. {t('footer.allRightsReserved')}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {t('footer.madeWithLove')} Saleh Al-Salem
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;