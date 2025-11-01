import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { ModernButton, ModernCard } from '@shared/ui/modern/ModernComponents';
import { StatsService } from '../../services/StatsService.js';
import { materialsService } from '../../services/appwriteService';
import { Client, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_URL || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const USERS_COLLECTION_ID = 'users';

const NewModernLanding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    users: { number: '...', label: '' },
    files: { number: '...', label: '' }
  });
  const [topContributors, setTopContributors] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await StatsService.getFormattedStatsWithCache();
        setStats(data);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };
    loadStats();
  }, []);

  useEffect(() => {
    const loadTopContributors = async () => {
      try {
        const materialsResponse = await materialsService.getAll(500);
        const materials = Array.isArray(materialsResponse) 
          ? materialsResponse 
          : materialsResponse?.documents || [];
        
        if (materials.length === 0) {
          setTopContributors([]);
          return;
        }
        
        const uploadsCount = {};
        materials.forEach(material => {
          const uploaderId = material.uploaderId;
          if (uploaderId) {
            uploadsCount[uploaderId] = (uploadsCount[uploaderId] || 0) + 1;
          }
        });
        
        const sortedUsers = Object.entries(uploadsCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5);
        
        if (sortedUsers.length === 0) {
          setTopContributors([]);
          return;
        }
        
        const contributors = await Promise.all(
          sortedUsers.map(async ([userId, count]) => {
            try {
              const userDoc = await databases.getDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                userId
              );
              
              return {
                id: userId,
                name: userDoc.name || 'مستخدم',
                uploads: count
              };
            } catch (error) {
              return {
                id: userId,
                name: `مستخدم ${userId.substring(0, 8)}`,
                uploads: count
              };
            }
          })
        );
        
        setTopContributors(contributors);
      } catch (error) {
        console.error('Error loading contributors:', error);
        setTopContributors([]);
      }
    };
    
    const timer = setTimeout(() => {
      loadTopContributors();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      
      {/* Hero Section - Steve Jobs Philosophy: Simple. Elegant. Powerful. */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20 md:pt-0" style={{ height: '100vh', minHeight: '100vh' }}>
        {/* Subtle animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            
            {/* Logo */}
            <div className="mb-12 flex flex-col items-center">
              <div className="mb-6">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-2xl">
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-14 h-14 text-white"
                    fill="currentColor"
                  >
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-6xl md:text-8xl font-black" style={{ 
                fontFamily: 'Comfortaa, sans-serif',
                background: 'linear-gradient(135deg, #ff6b35 0%, #8b5cf6 50%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Fyleo
              </h1>
            </div>

            {/* Main Message - One Clear Thing */}
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8 leading-tight tracking-tight">
              {t('landing.heroTitle', 'مكتبتك الدراسية.')}
              <br />
              <span className="gradient-text">{t('landing.heroSubtitle', 'في مكان واحد.')}</span>
            </h2>
            
            {/* Subtitle - Clear Value Proposition */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-16 max-w-3xl mx-auto font-light leading-relaxed">
              {t('landing.heroDescription', 'كل ما تحتاجه للنجاح. ملخصات، سلايدات، اختبارات. منظم، سريع، بسيط.')}
            </p>

            {/* Single Clear CTA - One Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {!user && (
                <button
                  onClick={() => navigate('/signup')}
                  className="btn btn-primary text-lg px-12 py-4"
                >
                  {t('landing.joinNow', 'ابدأ الآن')}
                </button>
              )}
              <button
                onClick={() => navigate('/library')}
                className="text-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                {t('landing.lookAround', 'أو تصفح المكتبة')} →
              </button>
            </div>
            
            {/* Social Proof - Subtle Numbers */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold gradient-text">{stats.users.number}</span>
                <span>{t('landing.studentsJoined', 'طالب')}</span>
              </div>
              <div className="w-px h-8 bg-gray-300 dark:bg-gray-700"></div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold gradient-text">{stats.files.number}</span>
                <span>{t('landing.filesShared', 'ملف')}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section - Apple Style: Show, Don't Tell */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-modern">
          <div className="max-w-6xl mx-auto">
            
            {/* Section Title - Minimal */}
            <div className="text-center mb-20">
              <h2 className="heading-md text-gray-900 dark:text-white mb-4">
                {t('landing.whatYouGet', 'مصمم للطلاب.')}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
                {t('landing.whatYouGetDesc', 'بسيط. سريع. فعّال.')}
              </p>
            </div>

            {/* Features Grid - Spacious & Premium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              
              {/* Feature 1 - Organized */}
              <div className="text-center group">
                <div className="mb-6 inline-block">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-4xl shadow-2xl group-hover:shadow-orange-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    📚
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t('landing.feature1Title', 'منظم')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                  {t('landing.feature1Desc', 'كل مادة في مكانها. تصنيف ذكي يوفر وقتك.')}
                </p>
              </div>

              {/* Feature 2 - Fast */}
              <div className="text-center group">
                <div className="mb-6 inline-block">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-4xl shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    ⚡
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t('landing.feature2Title', 'سريع')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                  {t('landing.feature2Desc', 'ابحث واعثر على ما تريد في ثوانٍ.')}
                </p>
              </div>

              {/* Feature 3 - Collaborative */}
              <div className="text-center group">
                <div className="mb-6 inline-block">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-4xl shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    🤝
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t('landing.feature3Title', 'تعاوني')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                  {t('landing.feature3Desc', 'شارك واستفد من مجتمع طلابي نشط.')}
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Hall of Fame - Premium Luxury Design */}
      <section className="section-padding bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            
            <div className="text-center mb-20 relative z-10">
              <div className="inline-block mb-8">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center text-6xl shadow-2xl animate-pulse">
                  🏆
                </div>
              </div>
              <h2 className="heading-md text-gray-900 dark:text-white mb-6">
                {t('landing.hallOfFame', 'لوحة الشرف')}
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
                {t('landing.hallOfFameDesc', 'الطلاب الذين يصنعون الفرق. كن واحداً منهم.')}
              </p>
            </div>

            {topContributors.length > 0 ? (
              <div className="space-y-4">
                {topContributors.map((contributor, index) => (
                  <ModernCard 
                    key={contributor.id}
                    className={`p-6 transform transition-all duration-300 hover:scale-[1.02] ${
                      index === 0 
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-400 dark:border-yellow-600' 
                        : index === 1
                        ? 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-2 border-gray-300 dark:border-gray-600'
                        : index === 2
                        ? 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-300 dark:border-orange-600'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold ${
                          index === 0 
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg' 
                            : index === 1
                            ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800'
                            : index === 2
                            ? 'bg-gradient-to-br from-orange-400 to-red-400 text-white'
                            : 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                        }`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {contributor.name}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
                          {contributor.uploads}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {t('landing.uploads', 'رفعة')}
                        </div>
                      </div>
                    </div>
                  </ModernCard>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {t('landing.noContributorsYet', 'لا يوجد مساهمون بعد')}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  {t('landing.beTheFirst', 'كن أول من يشارك!')}
                </p>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Final CTA - Minimalist & Powerful */}
      <section className="section-padding relative overflow-hidden bg-gradient-to-br from-orange-500 via-purple-600 to-blue-600 dark:from-orange-900 dark:via-purple-950 dark:to-blue-950">
        <div className="absolute inset-0 hero-pattern opacity-30"></div>
        <div className="container-modern relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            
            <h2 className="heading-lg text-white mb-8">
              {t('landing.finalCTATitle', 'جاهز للبدء؟')}
            </h2>
            
            <p className="text-2xl text-white/90 mb-12 font-light">
              {t('landing.finalCTADesc', 'انضم إلى آلاف الطلاب الذين يستخدمون Fyleo يومياً.')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user && (
                <button
                  onClick={() => navigate('/signup')}
                  className="btn btn-primary text-lg px-12 py-4 bg-white text-purple-600 hover:bg-gray-50"
                >
                  {t('landing.startNow', 'ابدأ الآن')}
                </button>
              )}
              <button
                onClick={() => navigate('/library')}
                className="text-lg text-white hover:text-white/80 font-medium transition-colors"
              >
                {t('landing.exploreNow', 'أو تصفح المكتبة')} →
              </button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default NewModernLanding;

