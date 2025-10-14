import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { 
  ModernButton, 
  ModernCard
} from '../../components/modern/ModernComponents';
import { StatsService } from '../../services/StatsService.js';

const NewModernLanding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [scrollY, setScrollY] = useState(0);
  const [realStats, setRealStats] = useState({
    users: { number: '...', label: '' },
    files: { number: '...', label: '' }
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await StatsService.getFormattedStatsWithCache();
        setRealStats(stats);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo & Title */}
            <div className="mb-8 inline-block">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-orange-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-14 h-14 text-white"
                  fill="currentColor"
                >
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              Fyleo
            </h1>
            
            <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              {t('landing.heroSubtitle')}
            </p>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              {t('landing.heroDescription')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {user ? (
                <>
                  <ModernButton 
                    onClick={() => navigate('/dashboard')}
                    size="lg"
                    className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                  >
                    📊 {t('nav.dashboard')}
                  </ModernButton>
                  <ModernButton 
                    onClick={() => navigate('/materials')}
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-4"
                  >
                    📚 {t('landing.exploreMaterials')}
                  </ModernButton>
                </>
              ) : (
                <>
                  <ModernButton 
                    onClick={() => navigate('/signup')}
                    size="lg"
                    className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                  >
                    🚀 {t('landing.getStarted')}
                  </ModernButton>
                  <ModernButton 
                    onClick={() => navigate('/login')}
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-4"
                  >
                    🔐 {t('nav.login')}
                  </ModernButton>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <ModernCard className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 border-purple-200 dark:border-purple-800">
                <div className="text-4xl mb-2">👥</div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {realStats.users.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {t('landing.registeredUsers')}
                </div>
              </ModernCard>

              <ModernCard className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 border-blue-200 dark:border-blue-800">
                <div className="text-4xl mb-2">📁</div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {realStats.files.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {t('landing.uploadedFiles')}
                </div>
              </ModernCard>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ✨ {t('landing.whyChooseUs')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('landing.heroSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ModernCard className="p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {t('landing.fastAndEasy')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('landing.fastAndEasyDesc')}
              </p>
            </ModernCard>

            <ModernCard className="p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {t('landing.secureAndReliable')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('landing.secureAndReliableDesc')}
              </p>
            </ModernCard>

            <ModernCard className="p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {t('landing.organizedAndSorted')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('landing.organizedAndSortedDesc')}
              </p>
            </ModernCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
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
                  <Link to="/materials" className="text-gray-400 hover:text-white transition-colors">
                    📚 {t('nav.materials')}
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                    📊 {t('nav.dashboard')}
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

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Fyleo. {t('footer.allRightsReserved')}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {t('footer.madeWithLove')} Saleh Al-Salem
            </p>
          </div>
        </div>
      </footer>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default NewModernLanding;
