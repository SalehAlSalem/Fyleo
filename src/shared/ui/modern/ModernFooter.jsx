import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ModernFooter = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative bg-black text-white py-16 pb-24 md:pb-16 overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      
      {/* Subtle Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          
          {/* About - Minimalist Dark Design */}
          <div className="group">
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:bg-zinc-900/70">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="text-4xl">📚</span>
                <span className="text-white">
                  {t('footer.aboutUs')}
                </span>
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {t('footer.aboutDesc')}
              </p>
              <p className="text-sm text-gray-500">
                {t('footer.madeWithLove')} <span className="font-semibold text-gray-300">Saleh Al-Salem</span>
              </p>
            </div>
          </div>

          {/* Contact - Dark Elegant Social Grid */}
          <div className="group">
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:bg-zinc-900/70">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="text-4xl">🌐</span>
                <span className="text-white">
                  {t('footer.contact')}
                </span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <a 
                  href="mailto:fyleo.bawa3neh.97@gmail.com" 
                  className="group/link flex flex-col items-center gap-2 p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl border border-zinc-700/50 hover:border-zinc-600 transition-all duration-300 hover:scale-105"
                >
                  <span className="text-3xl group-hover/link:scale-110 transition-transform duration-300">📧</span>
                  <span className="text-xs text-gray-400 group-hover/link:text-gray-200 font-medium">Email</span>
                </a>
                
                <a 
                  href="https://github.com/SalehAlSalem/Fyleo" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link flex flex-col items-center gap-2 p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl border border-zinc-700/50 hover:border-zinc-600 transition-all duration-300 hover:scale-105"
                >
                  <span className="text-3xl group-hover/link:scale-110 transition-transform duration-300">💻</span>
                  <span className="text-xs text-gray-400 group-hover/link:text-gray-200 font-medium">GitHub</span>
                </a>

                <a 
                  href="https://www.linkedin.com/in/saleh-al-salem-226122294/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link flex flex-col items-center gap-2 p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl border border-zinc-700/50 hover:border-zinc-600 transition-all duration-300 hover:scale-105"
                >
                  <span className="text-3xl group-hover/link:scale-110 transition-transform duration-300">💼</span>
                  <span className="text-xs text-gray-400 group-hover/link:text-gray-200 font-medium">LinkedIn</span>
                </a>

                <a 
                  href="https://www.instagram.com/fyleo_official" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link flex flex-col items-center gap-2 p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl border border-zinc-700/50 hover:border-zinc-600 transition-all duration-300 hover:scale-105"
                >
                  <span className="text-3xl group-hover/link:scale-110 transition-transform duration-300">📷</span>
                  <span className="text-xs text-gray-400 group-hover/link:text-gray-200 font-medium">Instagram</span>
                </a>

                <a 
                  href="https://x.com/fyleo_official" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link flex flex-col items-center gap-2 p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl border border-zinc-700/50 hover:border-zinc-600 transition-all duration-300 hover:scale-105"
                >
                  <span className="text-3xl group-hover/link:scale-110 transition-transform duration-300">🐦</span>
                  <span className="text-xs text-gray-400 group-hover/link:text-gray-200 font-medium">X</span>
                </a>

                <a 
                  href="https://www.youtube.com/@fyleo_official" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link flex flex-col items-center gap-2 p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl border border-zinc-700/50 hover:border-zinc-600 transition-all duration-300 hover:scale-105"
                >
                  <span className="text-3xl group-hover/link:scale-110 transition-transform duration-300">📺</span>
                  <span className="text-xs text-gray-400 group-hover/link:text-gray-200 font-medium">YouTube</span>
                </a>

                <a 
                  href="https://linktr.ee/fyleo_official" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link flex flex-col items-center gap-2 p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl border border-zinc-700/50 hover:border-zinc-600 transition-all duration-300 hover:scale-105"
                >
                  <span className="text-3xl group-hover/link:scale-110 transition-transform duration-300">🔗</span>
                  <span className="text-xs text-gray-400 group-hover/link:text-gray-200 font-medium">Linktree</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Legal Links - Dark Minimalist */}
        <div className="border-t border-zinc-800 pt-8 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm mb-6">
            <Link to="/terms-of-service" className="text-gray-500 hover:text-gray-300 transition-colors px-4 py-2 rounded-lg hover:bg-zinc-900/50">
              {t('legal.termsOfServiceTitle')}
            </Link>
            <span className="text-zinc-700">•</span>
            <Link to="/privacy-policy" className="text-gray-500 hover:text-gray-300 transition-colors px-4 py-2 rounded-lg hover:bg-zinc-900/50">
              {t('legal.privacyPolicyTitle')}
            </Link>
            <span className="text-zinc-700">•</span>
            <Link to="/disclaimer" className="text-gray-500 hover:text-gray-300 transition-colors px-4 py-2 rounded-lg hover:bg-zinc-900/50">
              {t('legal.disclaimerTitle')}
            </Link>
          </div>
          
          {/* Donation Button - Elegant Dark */}
          <div className="flex justify-center mb-8">
            <a
              href="https://ko-fi.com/bawa3neh_97"
              target="_blank"
              rel="noopener noreferrer"
              className="group/donate inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl border border-zinc-700 hover:border-zinc-600 transform hover:scale-105 transition-all duration-300"
            >
              <span className="text-2xl group-hover/donate:rotate-12 transition-transform duration-300">☕</span>
              <span>{t('footer.supportUs')}</span>
              <span className="text-xl group-hover/donate:scale-110 transition-transform duration-300">❤️</span>
            </a>
          </div>
        </div>

        {/* Copyright - Sleek Dark */}
        <div className="text-center">
          <div className="inline-block bg-zinc-900/30 backdrop-blur-sm rounded-xl px-8 py-4 border border-zinc-800">
            <p className="text-gray-400 mb-2 flex items-center justify-center gap-2 text-sm">
              <span>©</span>
              <span>{new Date().getFullYear()} Fyleo.</span>
              <span>{t('footer.allRightsReserved')}</span>
            </p>
            <p className="text-xs text-gray-500">
              {t('footer.madeWithLove')} <span className="font-semibold text-gray-400">Saleh Al-Salem</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;