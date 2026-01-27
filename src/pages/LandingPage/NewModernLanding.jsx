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
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState({
    users: { number: '...', label: '' },
    files: { number: '...', label: '' }
  });
  const [topContributors, setTopContributors] = useState([]);
  const [visibleChapters, setVisibleChapters] = useState({
    chapter1: false,
    chapter2: false,
    chapter3: false,
    chapter4: false
  });

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px'
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const chapterId = entry.target.getAttribute('data-chapter');
          if (chapterId) {
            setVisibleChapters(prev => ({ ...prev, [chapterId]: true }));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all chapter elements
    const chapters = document.querySelectorAll('[data-chapter]');
    chapters.forEach(chapter => observer.observe(chapter));

    return () => {
      chapters.forEach(chapter => observer.unobserve(chapter));
    };
  }, []);

  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      // Component will re-render automatically
      console.log('Language changed to:', i18n.language);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

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
                name: userDoc.name || t('landing.user'),
                uploads: count
              };
            } catch (error) {
              return {
                id: userId,
                name: `${t('landing.user')} ${userId.substring(0, 8)}`,
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
  }, [t]);


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      
      {/* Hero Section - Leaderboard & Intro Side by Side */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 pb-16 md:pt-32 md:pb-20">
        {/* Enhanced animated background decoration with floating elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Floating Emoji Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 left-10 text-4xl animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>🚀</div>
          <div className="absolute top-48 right-16 text-3xl animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '1s' }}>⭐</div>
          <div className="absolute bottom-32 left-20 text-3xl animate-bounce" style={{ animationDuration: '3.5s' }}>🎓</div>
          <div className="absolute bottom-48 right-24 text-4xl animate-bounce" style={{ animationDuration: '2.8s', animationDelay: '0.7s' }}>📚</div>
          <div className="absolute top-1/3 right-1/4 text-2xl animate-bounce" style={{ animationDuration: '3.2s', animationDelay: '1.5s' }}>💡</div>
          <div className="absolute top-2/3 left-1/4 text-2xl animate-bounce" style={{ animationDuration: '2.7s', animationDelay: '0.3s' }}>🎯</div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            
            {/* Logo & Title - Centered at Top - Enhanced Design with 3D Effects */}
            <div className="text-center mb-16">
              {/* Logo with Advanced 3D Effect */}
              <div className="relative inline-block mb-8">
                {/* Multi-layered Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 via-purple-500/30 to-blue-500/30 rounded-full blur-3xl scale-150 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-pink-500/20 rounded-full blur-2xl scale-125 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                
                {/* Main Logo with Perspective Transform */}
                <div className="relative group perspective-1000">
                  <div 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-orange-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                    style={{
                      transform: 'rotateX(10deg) rotateY(-10deg)',
                      transition: 'transform 0.5s ease-out',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'rotateX(-5deg) rotateY(10deg) scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'rotateX(10deg) rotateY(-10deg) scale(1)';
                    }}
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      className="w-14 h-14 md:w-18 md:h-18 text-white transform group-hover:scale-110 transition-transform duration-300"
                      fill="currentColor"
                    >
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                  </div>
                  
                  {/* Enhanced Floating Elements with stagger animation */}
                  <div className="absolute -top-4 -right-4 text-3xl animate-bounce" style={{ animationDuration: '2s' }}>✨</div>
                  <div className="absolute -bottom-4 -left-4 text-3xl animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }}>📚</div>
                  <div className="absolute -top-2 -left-6 text-2xl animate-bounce" style={{ animationDuration: '2.2s', animationDelay: '0.6s' }}>🌟</div>
                  <div className="absolute -bottom-2 -right-6 text-2xl animate-bounce" style={{ animationDuration: '2.7s', animationDelay: '0.9s' }}>💡</div>
                </div>
              </div>

              {/* Brand Name with Modern Typography */}
              <div className="mb-6 relative">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-2 tracking-tight relative" style={{ 
                  fontFamily: 'Comfortaa, sans-serif',
                }}>
                  <span className="inline-block bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] relative">
                    Fyleo
                  </span>
                </h1>
                
                {/* Decorative Line */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="h-1 w-12 bg-gradient-to-r from-transparent to-orange-500 rounded-full"></div>
                  <div className="h-1.5 w-16 bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 rounded-full"></div>
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
                </div>
              </div>

              {/* Tagline with Better Typography */}
              <div className="max-w-2xl mx-auto">
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2 leading-tight">
                  {t('landing.heroTagline')}
                </p>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-medium">
                  {t('landing.heroSubtagline')} 
                  <span className="inline-block ml-2 text-2xl">🎯</span>
                </p>
              </div>
            </div>

            {/* Main Grid Layout - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              
              {/* Left Side: Website Introduction */}
              <div className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                    {t('landing.introTitle')}
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full"></div>
                </div>

                <div className="space-y-6">
                  <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('landing.introText1')}
                  </p>
                  
                  <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-xl border border-gray-200 dark:border-gray-700 card-hover group">
                    {/* Decorative Corner Elements */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-tr-full"></div>
                    
                    {/* Animated Border Gradient */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                      background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
                      padding: '2px',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    }}></div>
                    
                    <div className="relative">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                        <span className="text-3xl transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">🎯</span>
                        {t('landing.ourMission')}
                      </h3>
                      <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                        {t('landing.missionText')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Files Card with Enhanced Hover Effects */}
                    <div className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 text-center border border-orange-200 dark:border-orange-700 transform hover:scale-105 hover:-rotate-2 transition-all duration-300 hover:shadow-2xl card-hover">
                      {/* Animated Background Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 via-orange-500/0 to-orange-600/0 group-hover:from-orange-400/20 group-hover:via-orange-500/20 group-hover:to-orange-600/20 transition-all duration-500 rounded-2xl"></div>
                      
                      <div className="relative">
                        <div className="text-4xl mb-2 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">📚</div>
                        <div className="text-2xl md:text-3xl font-black text-orange-600 dark:text-orange-400 mb-1 group-hover:scale-110 transition-transform">
                          {stats.files.number}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {t('landing.totalFiles')}
                        </div>
                      </div>
                      
                      {/* Corner Decoration */}
                      <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
                    </div>
                    
                    {/* Users Card with Enhanced Hover Effects */}
                    <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 text-center border border-purple-200 dark:border-purple-700 transform hover:scale-105 hover:rotate-2 transition-all duration-300 hover:shadow-2xl card-hover">
                      {/* Animated Background Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 via-purple-500/0 to-purple-600/0 group-hover:from-purple-400/20 group-hover:via-purple-500/20 group-hover:to-purple-600/20 transition-all duration-500 rounded-2xl"></div>
                      
                      <div className="relative">
                        <div className="text-4xl mb-2 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">👥</div>
                        <div className="text-2xl md:text-3xl font-black text-purple-600 dark:text-purple-400 mb-1 group-hover:scale-110 transition-transform">
                          {stats.users.number}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {t('landing.activeStudents')}
                        </div>
                      </div>
                      
                      {/* Corner Decoration */}
                      <div className="absolute top-2 left-2 w-3 h-3 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-6 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
                    {/* Animated Background Particles */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>
                    
                    <div className="relative flex items-start gap-4">
                      <div className="text-3xl md:text-4xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">💡</div>
                      <div>
                        <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {t('landing.whyDifferent')}
                        </h4>
                        <ul className="space-y-2 text-sm md:text-base text-gray-700 dark:text-gray-300">
                          <li className="flex items-center gap-2 transform hover:translate-x-2 transition-transform duration-200">
                            <span className="text-green-500 text-xl">✓</span>
                            {t('landing.feature1Short')}
                          </li>
                          <li className="flex items-center gap-2 transform hover:translate-x-2 transition-transform duration-200">
                            <span className="text-green-500 text-xl">✓</span>
                            {t('landing.feature2Short')}
                          </li>
                          <li className="flex items-center gap-2 transform hover:translate-x-2 transition-transform duration-200">
                            <span className="text-green-500 text-xl">✓</span>
                            {t('landing.feature3Short')}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons with Creative Effects */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    {!user && (
                      <button
                        onClick={() => navigate('/signup')}
                        className="group relative overflow-hidden bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 text-white text-lg px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 btn-ripple"
                      >
                        {/* Shimmer Effect */}
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></span>
                        
                        {/* Button Content */}
                        <span className="relative flex items-center justify-center gap-2">
                          <span className="text-2xl group-hover:scale-110 transition-transform">🚀</span>
                          <span>{t('landing.joinNow')}</span>
                        </span>
                        
                        {/* Glow Effect on Hover */}
                        <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                          boxShadow: '0 0 20px rgba(255, 107, 53, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)'
                        }}></span>
                      </button>
                    )}
                    <button
                      onClick={() => navigate('/library')}
                      className="group relative overflow-hidden bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-lg px-8 py-4 rounded-2xl font-bold shadow hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <span className="relative flex items-center justify-center gap-2">
                        <span>{t('landing.lookAround')}</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side: Leaderboard - Creative Design with Animations */}
              <div className="space-y-8">
                <div className="text-center mb-10">
                  <div className="relative inline-block mb-6">
                    {/* Multi-layered Animated Trophy with Enhanced Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/40 via-orange-500/40 to-red-500/40 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/30 via-orange-400/30 to-red-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    
                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center text-5xl md:text-6xl shadow-2xl transform hover:scale-110 hover:rotate-12 transition-transform duration-500 cursor-pointer rotate-on-hover">
                      🏆
                    </div>
                    
                    {/* Enhanced Floating Sparkles with Random Movement */}
                    <div className="absolute -top-2 -right-2 text-2xl animate-bounce bounce-random-1">✨</div>
                    <div className="absolute -bottom-2 -left-2 text-2xl animate-bounce bounce-random-2">⭐</div>
                    <div className="absolute -top-3 -left-3 text-xl animate-bounce bounce-random-3">💫</div>
                    <div className="absolute -bottom-3 -right-3 text-xl animate-bounce bounce-random-4">🌟</div>
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                    <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                      {t('landing.hallOfFame')}
                    </span>
                  </h2>
                  <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto font-medium">
                    {t('landing.hallOfFameDesc')}
                  </p>
                </div>

                {topContributors.length > 0 ? (
                  <div className="space-y-6">
                    {/* Top 3 - Podium Style */}
                    {topContributors.slice(0, 3).length === 3 && (
                      <div className="mb-8">
                        {/* Podium Layout */}
                        <div className="flex items-end justify-center gap-2 mb-6">
                          {/* 2nd Place - Left */}
                          <div className="flex-1 max-w-[120px]">
                            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-t-2xl p-4 text-center transform hover:scale-105 transition-all duration-300 shadow-xl border-2 border-gray-300 dark:border-gray-600">
                              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-3xl md:text-4xl shadow-lg ring-4 ring-gray-200 dark:ring-gray-700">
                                🥈
                              </div>
                              <div className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 line-clamp-2 min-h-[2.5rem] flex items-center justify-center px-1 leading-tight">
                                {topContributors[1].name}
                              </div>
                              <div className="text-2xl md:text-3xl font-black text-gray-600 dark:text-gray-400">
                                {topContributors[1].uploads}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-500">
                                {t('landing.uploads')}
                              </div>
                            </div>
                            <div className="bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 h-24 rounded-b-lg"></div>
                          </div>

                          {/* 1st Place - Center (Tallest) */}
                          <div className="flex-1 max-w-[140px]">
                            <div className="relative">
                              {/* Crown */}
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-4xl animate-bounce">
                                👑
                              </div>
                              <div className="bg-gradient-to-br from-yellow-200 via-yellow-300 to-orange-300 dark:from-yellow-600 dark:to-orange-700 rounded-t-2xl p-4 text-center transform hover:scale-105 transition-all duration-300 shadow-2xl border-4 border-yellow-400 dark:border-yellow-500 relative overflow-hidden">
                                {/* Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                                
                                <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl md:text-5xl shadow-2xl ring-4 ring-yellow-300 dark:ring-yellow-600">
                                  🥇
                                </div>
                                <div className="text-sm md:text-base font-black text-yellow-900 dark:text-yellow-100 mb-1 line-clamp-2 min-h-[2.5rem] flex items-center justify-center px-1 leading-tight">
                                  {topContributors[0].name}
                                </div>
                                <div className="text-3xl md:text-4xl font-black text-yellow-800 dark:text-yellow-200">
                                  {topContributors[0].uploads}
                                </div>
                                <div className="text-xs text-yellow-700 dark:text-yellow-300 font-bold">
                                  {t('landing.uploads')}
                                </div>
                              </div>
                              <div className="bg-gradient-to-b from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600 h-32 rounded-b-lg shadow-xl"></div>
                            </div>
                          </div>

                          {/* 3rd Place - Right */}
                          <div className="flex-1 max-w-[120px]">
                            <div className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-800 dark:to-red-900 rounded-t-2xl p-4 text-center transform hover:scale-105 transition-all duration-300 shadow-xl border-2 border-orange-300 dark:border-orange-600">
                              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-3xl md:text-4xl shadow-lg ring-4 ring-orange-200 dark:ring-orange-700">
                                🥉
                              </div>
                              <div className="text-xs md:text-sm font-bold text-orange-800 dark:text-orange-200 mb-1 line-clamp-2 min-h-[2.5rem] flex items-center justify-center px-1 leading-tight">
                                {topContributors[2].name}
                              </div>
                              <div className="text-2xl md:text-3xl font-black text-orange-700 dark:text-orange-300">
                                {topContributors[2].uploads}
                              </div>
                              <div className="text-xs text-orange-600 dark:text-orange-400">
                                {t('landing.uploads')}
                              </div>
                            </div>
                            <div className="bg-gradient-to-b from-orange-400 to-red-500 dark:from-orange-600 dark:to-red-700 h-20 rounded-b-lg"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rest of Contributors */}
                    {topContributors.slice(3).map((contributor, index) => {
                      const actualIndex = index + 3;
                      return (
                        <div 
                          key={contributor.id}
                          className="group relative"
                        >
                          {/* Hover Glow Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-purple-500/20 group-hover:via-blue-500/20 group-hover:to-purple-500/20 rounded-2xl blur-xl transition-all duration-500"></div>
                          
                          <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                {/* Rank Badge */}
                                <div className="relative">
                                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
                                    #{actualIndex + 1}
                                  </div>
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
                                </div>
                                
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                    {contributor.name}
                                  </h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t('landing.contributor')}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Upload Count with Animation */}
                              <div className="text-center">
                                <div className="relative">
                                  <div className="text-3xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {contributor.uploads}
                                  </div>
                                  <div className="absolute -top-2 -right-2 text-xl opacity-50 group-hover:opacity-100 transition-opacity">
                                    🔥
                                  </div>
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                  {t('landing.uploads')}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-blue-100/50 to-pink-100/50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-pink-900/20 rounded-3xl blur-2xl"></div>
                    <div className="relative text-center py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                      <div className="text-7xl mb-6 animate-bounce">📊</div>
                      <p className="text-gray-600 dark:text-gray-300 text-xl font-bold mb-3">
                        {t('landing.noContributorsYet')}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-base mb-6">
                        {t('landing.beTheFirst')}
                      </p>
                      <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-bold">
                        <span>🚀</span>
                        <span>{t('landing.startNow')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Motivational Call to Action - Enhanced */}
                <div className="mt-8 relative overflow-hidden rounded-3xl">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 animate-gradient-x"></div>
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                  
                  <div className="relative p-8 text-center">
                    <div className="text-4xl mb-4">🌟</div>
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
                      {t('landing.joinLeaderboard')}
                    </h3>
                    <p className="text-base md:text-lg text-white/90 mb-6 font-medium">
                      {t('landing.shareAndContribute')}
                    </p>
                    {!user && (
                      <button
                        onClick={() => navigate('/signup')}
                        className="group relative inline-flex items-center gap-3 bg-white text-purple-600 hover:bg-gray-50 font-black px-8 py-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                      >
                        <span className="text-2xl group-hover:rotate-12 transition-transform">🚀</span>
                        <span>{t('landing.startContributing')}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Share Fyleo Section - Social Media Sharing */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 py-20">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="text-5xl md:text-6xl animate-bounce">📢</div>
                <div className="text-5xl md:text-6xl">❤️</div>
                <div className="text-5xl md:text-6xl animate-bounce" style={{ animationDelay: '0.2s' }}>✨</div>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {t('landing.shareTitle', 'ساعدنا ننشر الفايدة!')}
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                {t('landing.shareSubtitle', 'كل مشاركة تساعد طالب جديد يلاقي المواد اللي بدها. شارك Fyleo مع زملائك!')}
              </p>
            </div>

            {/* Social Share Buttons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              
              {/* X (Twitter) Share */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('اكتشفت Fyleo - منصة تعليمية رهيبة للطلاب! 📚✨ كل المواد الدراسية في مكان واحد')}&url=https://linktr.ee/fyleo_official&hashtags=Fyleo,تعليم,طلاب`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-gradient-to-br from-black to-gray-800 hover:from-gray-900 hover:to-black rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl font-bold">𝕏</div>
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {t('landing.shareTwitter', 'شارك على X')}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {t('landing.shareTwitterDesc', 'شارك عن Fyleo وساعد زملائك')}
                  </p>
                </div>
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              </a>

              {/* WhatsApp Share */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent('سلام! 👋\n\nلقيت منصة Fyleo - منصة تعليمية رهيبة للطلاب! 📚✨\n\nفيها كل المواد الدراسية في مكان واحد:\n✓ ملخصات\n✓ سلايدات\n✓ اختبارات سابقة\n\nوكله مجاني! 🎉\n\nشوفها من هون: https://linktr.ee/fyleo_official')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">💬</div>
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {t('landing.shareWhatsApp', 'واتساب')}
                  </h3>
                  <p className="text-green-100 text-sm">
                    {t('landing.shareWhatsAppDesc', 'شارك مع جروباتك ومجموعاتك')}
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              </a>

              {/* Facebook Share */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=https://linktr.ee/fyleo_official&quote=${encodeURIComponent('اكتشفت Fyleo - منصة تعليمية رهيبة للطلاب! 📚✨')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">👍</div>
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {t('landing.shareFacebook', 'فيسبوك')}
                  </h3>
                  <p className="text-blue-100 text-sm">
                    {t('landing.shareFacebookDesc', 'شارك على صفحتك الشخصية')}
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              </a>

              {/* Linktree Direct */}
              <a
                href="https://linktr.ee/fyleo_official"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-gradient-to-br from-lime-400 via-green-500 to-emerald-600 hover:from-lime-500 hover:via-green-600 hover:to-emerald-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">🌳</div>
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.5108 5.85343L17.5158 1.73642L19.8404 4.11701L15.6393 8.12199H21.5488V11.4268H15.6113L19.8404 15.5345L17.5158 17.8684L11.7744 12.099L6.03299 17.8684L3.70842 15.5438L7.93745 11.4361H2V8.12199H7.90944L3.70842 4.11701L6.03299 1.73642L10.038 5.85343V0H13.5108V5.85343ZM10.038 16.16H13.5108V24H10.038V16.16Z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {t('landing.visitLinktree', 'Linktree')}
                  </h3>
                  <p className="text-lime-100 text-sm">
                    {t('landing.visitLinktreeDesc', 'كل روابطنا في مكان واحد')}
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              </a>

            </div>

            {/* Bottom CTA */}
            <div className="text-center">
              <div className="inline-block bg-white dark:bg-gray-800 rounded-2xl px-8 py-6 shadow-xl border-2 border-purple-200 dark:border-purple-700">
                <p className="text-gray-700 dark:text-gray-300 text-lg font-medium mb-2">
                  {t('landing.shareThankYou', 'شكراً لدعمك! كل مشاركة تصنع فرق 💜')}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {t('landing.shareImpact', 'مع بعض نقدر نساعد آلاف الطلاب')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* The Fyleo Journey - Story Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900 py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Story Header */}
            <div className="text-center mb-20">
              <div className="inline-block mb-6">
                <div className="text-6xl md:text-7xl">📖</div>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                {t('landing.ourStoryTitle')}
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light">
                {t('landing.ourStorySubtitle')}
              </p>
            </div>

            {/* Story Timeline */}
            <div className="space-y-24">
              
              {/* Chapter 1: The Beginning */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center" data-chapter="chapter1">
                <div className="order-2 md:order-1">
                  <div className={`relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-3xl p-8 md:p-12 border-2 border-orange-200 dark:border-orange-700 shadow-2xl transform transition-all duration-1000 ${visibleChapters.chapter1 ? 'scale-105 -rotate-1 shadow-orange-500/50' : 'scale-95 opacity-0'}`}>
                    {/* Animated Background */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-orange-400/0 via-yellow-400/0 to-orange-400/0 transition-all duration-1000 ${visibleChapters.chapter1 ? 'from-orange-400/20 via-yellow-400/20 to-orange-400/20' : ''}`}></div>
                    
                    {/* Floating Particles */}
                    <div className={`absolute top-4 right-4 w-2 h-2 bg-orange-400 rounded-full transition-all duration-700 ${visibleChapters.chapter1 ? 'opacity-100 animate-ping' : 'opacity-0'}`}></div>
                    <div className={`absolute bottom-8 left-8 w-3 h-3 bg-yellow-400 rounded-full transition-all duration-700 delay-200 ${visibleChapters.chapter1 ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
                    
                    <div className="relative">
                      <div className={`text-4xl md:text-5xl mb-8 md:mb-10 transform transition-all duration-1000 ${visibleChapters.chapter1 ? 'scale-125 rotate-12' : 'scale-100'}`}>🌱</div>
                      <h3 className={`text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-700 ${visibleChapters.chapter1 ? 'text-orange-600 dark:text-orange-400' : ''}`}>
                        {t('landing.chapter1Title')}
                      </h3>
                      <p className={`text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 transition-colors duration-700 ${visibleChapters.chapter1 ? 'text-gray-900 dark:text-white' : ''}`}>
                        {t('landing.chapter1Text1')}
                      </p>
                      <p className={`text-lg text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-700 ${visibleChapters.chapter1 ? 'text-gray-900 dark:text-white' : ''}`}>
                        {t('landing.chapter1Text2')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br from-orange-400/20 to-purple-400/20 rounded-3xl blur-3xl transition-all duration-1000 ${visibleChapters.chapter1 ? 'from-orange-400/40 to-purple-400/40 scale-110' : ''}`}></div>
                    <div className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-1000 overflow-hidden ${visibleChapters.chapter1 ? 'shadow-orange-500/30 scale-110 rotate-3' : 'scale-95 opacity-0'}`}>
                      {/* Shine Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ${visibleChapters.chapter1 ? 'translate-x-full' : '-translate-x-full'}`}></div>
                      
                      <div className={`text-4xl md:text-6xl lg:text-8xl text-center mb-4 transform transition-all duration-1000 ${visibleChapters.chapter1 ? 'scale-125 rotate-12' : 'scale-100'}`}>💡</div>
                      <div className="text-center">
                        <div className={`text-3xl md:text-5xl font-black text-orange-600 dark:text-orange-400 mb-2 transition-all duration-700 ${visibleChapters.chapter1 ? 'md:text-6xl text-yellow-500' : ''}`}>2025</div>
                        <p className={`text-gray-600 dark:text-gray-400 text-lg transition-all duration-700 ${visibleChapters.chapter1 ? 'text-orange-500 font-bold' : ''}`}>
                          {t('landing.chapter1Year')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chapter 2: The Problem */}
              <div data-chapter="chapter2" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br rounded-3xl blur-3xl transition-all duration-1000 ${visibleChapters.chapter2 ? 'from-purple-400/40 to-blue-400/40 scale-110' : 'from-purple-400/20 to-blue-400/20'}`}></div>
                    <div className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-1000 overflow-hidden ${visibleChapters.chapter2 ? 'shadow-purple-500/30 scale-105 -rotate-2' : 'opacity-0'}`}>
                      {/* Wave Animation */}
                      <div className={`absolute inset-0 bg-gradient-to-t transition-all duration-700 ${visibleChapters.chapter2 ? 'from-purple-500/10 to-transparent' : 'from-purple-500/0 to-purple-500/0'}`}></div>
                      
                      <div className={`text-4xl md:text-6xl lg:text-8xl text-center mb-8 md:mb-10 transform transition-all duration-1000 relative ${visibleChapters.chapter2 ? 'scale-110 -rotate-12' : 'scale-100'}`}>
                        <span>😤</span>
                        {/* Steam effect */}
                        <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 transition-opacity duration-700 ${visibleChapters.chapter2 ? 'opacity-100' : 'opacity-0'}`}>
                          <span className="text-xl md:text-2xl">💨</span>
                        </div>
                      </div>
                      <div className="space-y-4 relative">
                        <div className={`flex items-center gap-3 transform transition-all duration-800 ${visibleChapters.chapter2 ? 'translate-x-2' : 'translate-x-0'}`}>
                          <div className={`w-2 h-2 bg-red-500 rounded-full transition-all duration-800 ${visibleChapters.chapter2 ? 'scale-150 animate-pulse' : 'scale-100'}`}></div>
                          <p className={`text-gray-700 dark:text-gray-300 transition-all duration-800 ${visibleChapters.chapter2 ? 'text-purple-600 dark:text-purple-400 font-semibold' : ''}`}>
                            {t('landing.problem1')}
                          </p>
                        </div>
                        <div className={`flex items-center gap-3 transform transition-all duration-800 ${visibleChapters.chapter2 ? 'translate-x-2' : 'translate-x-0'}`} style={{ transitionDelay: '100ms' }}>
                          <div className={`w-2 h-2 bg-red-500 rounded-full transition-all duration-800 ${visibleChapters.chapter2 ? 'scale-150 animate-pulse' : 'scale-100'}`}></div>
                          <p className={`text-gray-700 dark:text-gray-300 transition-all duration-800 ${visibleChapters.chapter2 ? 'text-purple-600 dark:text-purple-400 font-semibold' : ''}`}>
                            {t('landing.problem2')}
                          </p>
                        </div>
                        <div className={`flex items-center gap-3 transform transition-all duration-800 ${visibleChapters.chapter2 ? 'translate-x-2' : 'translate-x-0'}`} style={{ transitionDelay: '200ms' }}>
                          <div className={`w-2 h-2 bg-red-500 rounded-full transition-all duration-800 ${visibleChapters.chapter2 ? 'scale-150 animate-pulse' : 'scale-100'}`}></div>
                          <p className={`text-gray-700 dark:text-gray-300 transition-all duration-800 ${visibleChapters.chapter2 ? 'text-purple-600 dark:text-purple-400 font-semibold' : ''}`}>
                            {t('landing.problem3')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className={`relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-3xl p-8 md:p-12 border-2 border-purple-200 dark:border-purple-700 shadow-2xl transform transition-all duration-1000 ${visibleChapters.chapter2 ? 'shadow-purple-500/50 scale-105 rotate-1' : 'opacity-0'}`}>
                    {/* Ripple Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-700 ${visibleChapters.chapter2 ? 'from-purple-400/20 via-blue-400/20 to-purple-400/20' : 'from-purple-400/0 via-blue-400/0 to-purple-400/0'}`}></div>
                    
                    {/* Sparkles */}
                    <div className={`absolute top-6 right-6 text-2xl transition-all duration-700 ${visibleChapters.chapter2 ? 'opacity-100 animate-bounce' : 'opacity-0'}`}>✨</div>
                    <div className={`absolute bottom-6 left-6 text-xl transition-all duration-700 ${visibleChapters.chapter2 ? 'opacity-100 animate-pulse' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>⭐</div>
                    
                    <div className="relative">
                      <div className={`text-4xl md:text-5xl mb-8 md:mb-10 transform transition-all duration-1000 ${visibleChapters.chapter2 ? 'scale-125 rotate-12' : 'scale-100'}`}>🎯</div>
                      <h3 className={`text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-800 ${visibleChapters.chapter2 ? 'text-purple-600 dark:text-purple-400' : ''}`}>
                        {t('landing.chapter2Title')}
                      </h3>
                      <p className={`text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 transition-colors duration-800 ${visibleChapters.chapter2 ? 'text-gray-900 dark:text-white' : ''}`}>
                        {t('landing.chapter2Text1')}
                      </p>
                      <p className={`text-lg text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-800 ${visibleChapters.chapter2 ? 'text-gray-900 dark:text-white' : ''}`}>
                        {t('landing.chapter2Text2')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chapter 3: The Solution */}
              <div data-chapter="chapter3" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <div className={`relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-3xl p-8 md:p-12 border-2 border-blue-200 dark:border-blue-700 shadow-2xl transform transition-all duration-1000 ${visibleChapters.chapter3 ? 'shadow-blue-500/50 scale-105 -rotate-1' : 'opacity-0'}`}>
                    {/* Electric Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-700 ${visibleChapters.chapter3 ? 'from-blue-400/20 via-cyan-400/20 to-blue-400/20' : 'from-blue-400/0 via-cyan-400/0 to-blue-400/0'}`}></div>
                    
                    {/* Lightning Bolts */}
                    <div className={`absolute top-4 left-4 text-2xl transition-all duration-700 ${visibleChapters.chapter3 ? 'opacity-100 animate-pulse' : 'opacity-0'}`}>⚡</div>
                    <div className={`absolute bottom-4 right-4 text-xl transition-all duration-700 ${visibleChapters.chapter3 ? 'opacity-100 animate-ping' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>✨</div>
                    
                    <div className="relative">
                      <div className={`text-4xl md:text-5xl mb-8 md:mb-10 transform transition-all duration-1000 ${visibleChapters.chapter3 ? 'scale-125 rotate-12 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'scale-100'}`}>⚡</div>
                      <h3 className={`text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-800 ${visibleChapters.chapter3 ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                        {t('landing.chapter3Title')}
                      </h3>
                      <p className={`text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 transition-colors duration-800 ${visibleChapters.chapter3 ? 'text-gray-900 dark:text-white' : ''}`}>
                        {t('landing.chapter3Text1')}
                      </p>
                      <p className={`text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6 transition-colors duration-800 ${visibleChapters.chapter3 ? 'text-gray-900 dark:text-white' : ''}`}>
                        {t('landing.chapter3Text2')}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <span className={`px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium transform transition-all duration-800 cursor-pointer ${visibleChapters.chapter3 ? 'scale-110 bg-blue-600 shadow-lg shadow-blue-500/50' : ''}`}>
                          {t('landing.tag1')}
                        </span>
                        <span className={`px-4 py-2 bg-purple-500 text-white rounded-full text-sm font-medium transform transition-all duration-800 cursor-pointer ${visibleChapters.chapter3 ? 'scale-110 bg-purple-600 shadow-lg shadow-purple-500/50' : ''}`}>
                          {t('landing.tag2')}
                        </span>
                        <span className={`px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium transform transition-all duration-800 cursor-pointer ${visibleChapters.chapter3 ? 'scale-110 bg-orange-600 shadow-lg shadow-orange-500/50' : ''}`}>
                          {t('landing.tag3')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br rounded-3xl blur-3xl transition-all duration-1000 ${visibleChapters.chapter3 ? 'from-blue-400/40 to-green-400/40 scale-110' : 'from-blue-400/20 to-green-400/20'}`}></div>
                    <div className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-1000 overflow-hidden ${visibleChapters.chapter3 ? 'shadow-blue-500/30 scale-105 -rotate-2' : 'opacity-0'}`}>
                      {/* Rocket Trail */}
                      <div className={`absolute inset-0 bg-gradient-to-b from-transparent transition-all duration-700 ${visibleChapters.chapter3 ? 'via-blue-500/10 to-blue-500/20' : 'via-blue-500/0 to-blue-500/0'}`}></div>
                      
                      <div className={`text-4xl md:text-6xl lg:text-8xl text-center mb-6 transform transition-all duration-1000 relative ${visibleChapters.chapter3 ? 'scale-125 -translate-y-4' : 'scale-100'}`}>
                        🚀
                        {/* Exhaust Fire */}
                        <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full transition-all duration-700 ${visibleChapters.chapter3 ? 'opacity-100' : 'opacity-0'}`}>
                          <span className="text-2xl md:text-4xl animate-pulse">🔥</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl transform transition-all duration-800 cursor-pointer ${visibleChapters.chapter3 ? 'scale-110 shadow-lg shadow-blue-500/30' : ''}`}>
                          <div className="text-2xl md:text-3xl font-black text-blue-600 dark:text-blue-400">
                            {stats.files.number}
                          </div>
                          <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {t('landing.filesAvailable')}
                          </div>
                        </div>
                        <div className={`text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl transform transition-all duration-800 cursor-pointer ${visibleChapters.chapter3 ? 'scale-110 shadow-lg shadow-purple-500/30' : ''}`}>
                          <div className="text-2xl md:text-3xl font-black text-purple-600 dark:text-purple-400">
                            {stats.users.number}
                          </div>
                          <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {t('landing.activeUsers')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chapter 4: The Future */}
              <div data-chapter="chapter4" className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br rounded-3xl blur-3xl transition-all duration-700 ${visibleChapters.chapter4 ? 'from-yellow-400/20 via-orange-400/20 to-red-400/20' : 'from-yellow-400/10 via-orange-400/10 to-red-400/10'}`}></div>
                <div className={`relative bg-gradient-to-br from-orange-500 via-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 lg:p-16 text-center shadow-2xl transform transition-all duration-1000 overflow-hidden ${visibleChapters.chapter4 ? 'shadow-orange-500/50 scale-105' : 'opacity-0'}`}>
                  {/* Animated Waves */}
                  <div className="absolute inset-0 opacity-20">
                    <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 transition-transform duration-1500 ${visibleChapters.chapter4 ? 'translate-x-full' : '-translate-x-full'}`}></div>
                  </div>
                  
                  {/* Floating Stars */}
                  <div className={`absolute top-8 right-8 text-2xl md:text-3xl transition-all duration-700 ${visibleChapters.chapter4 ? 'opacity-100 animate-bounce' : 'opacity-0'}`}>🌟</div>
                  <div className={`absolute bottom-8 left-8 text-xl md:text-2xl transition-all duration-700 ${visibleChapters.chapter4 ? 'opacity-100 animate-pulse' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>💫</div>
                  <div className={`absolute top-1/2 right-16 text-lg md:text-xl transition-all duration-700 ${visibleChapters.chapter4 ? 'opacity-100 animate-ping' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>⭐</div>
                  
                  <div className="relative">
                    <div className={`text-4xl md:text-6xl lg:text-7xl mb-8 md:mb-10 transform transition-all duration-1000 ${visibleChapters.chapter4 ? 'scale-125 rotate-12' : 'scale-100'}`}>✨</div>
                    <h3 className={`text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6 transition-all duration-800 ${visibleChapters.chapter4 ? 'scale-110' : 'scale-100'}`}>
                      {t('landing.chapter4Title')}
                    </h3>
                    <p className={`text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-light leading-relaxed transition-colors duration-800 ${visibleChapters.chapter4 ? 'text-white' : ''}`}>
                      {t('landing.chapter4Text1')}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-8">
                      <div className={`bg-white/10 backdrop-blur-lg rounded-xl md:rounded-2xl p-3 md:p-6 border border-white/20 transform transition-all duration-800 cursor-pointer flex md:flex-col items-center md:items-start gap-3 md:gap-0 ${visibleChapters.chapter4 ? 'bg-white/20 scale-105 md:scale-110 border-white/40' : ''}`}>
                        <div className={`text-2xl md:text-4xl flex-shrink-0 transform transition-all duration-800 ${visibleChapters.chapter4 ? 'scale-110 md:scale-125 rotate-12' : ''}`}>🤖</div>
                        <div className="flex-1 md:w-full">
                          <h4 className="text-base md:text-xl font-bold text-white mb-1 md:mb-2 md:mt-3">
                            {t('landing.future1Title')}
                          </h4>
                          <p className="text-white/80 text-xs md:text-sm">
                            {t('landing.future1Text')}
                          </p>
                        </div>
                      </div>
                      <div className={`bg-white/10 backdrop-blur-lg rounded-xl md:rounded-2xl p-3 md:p-6 border border-white/20 transform transition-all duration-800 cursor-pointer flex md:flex-col items-center md:items-start gap-3 md:gap-0 ${visibleChapters.chapter4 ? 'bg-white/20 scale-105 md:scale-110 border-white/40' : ''}`}>
                        <div className={`text-2xl md:text-4xl flex-shrink-0 transform transition-all duration-800 ${visibleChapters.chapter4 ? 'scale-110 md:scale-125 rotate-12' : ''}`}>👥</div>
                        <div className="flex-1 md:w-full">
                          <h4 className="text-base md:text-xl font-bold text-white mb-1 md:mb-2 md:mt-3">
                            {t('landing.future2Title')}
                          </h4>
                          <p className="text-white/80 text-xs md:text-sm">
                            {t('landing.future2Text')}
                          </p>
                        </div>
                      </div>
                      <div className={`bg-white/10 backdrop-blur-lg rounded-xl md:rounded-2xl p-3 md:p-6 border border-white/20 transform transition-all duration-800 cursor-pointer flex md:flex-col items-center md:items-start gap-3 md:gap-0 ${visibleChapters.chapter4 ? 'bg-white/20 scale-105 md:scale-110 border-white/40' : ''}`}>
                        <div className={`text-2xl md:text-4xl flex-shrink-0 transform transition-all duration-800 ${visibleChapters.chapter4 ? 'scale-110 md:scale-125 rotate-12' : ''}`}>📱</div>
                        <div className="flex-1 md:w-full">
                          <h4 className="text-base md:text-xl font-bold text-white mb-1 md:mb-2 md:mt-3">
                            {t('landing.future3Title')}
                          </h4>
                          <p className="text-white/80 text-xs md:text-sm">
                            {t('landing.future3Text')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className={`text-xl md:text-2xl lg:text-3xl text-white font-bold mb-8 transition-all duration-800 ${visibleChapters.chapter4 ? 'scale-105' : 'scale-100'}`}>
                      {t('landing.chapter4Text2')}
                    </p>
                  </div>

                  {!user && (
                    <button
                      onClick={() => navigate('/signup')}
                      className="btn bg-white text-purple-600 hover:bg-gray-50 font-bold text-lg px-12 py-4 rounded-xl shadow-2xl"
                    >
                      {t('landing.joinTheJourney')}
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Community Quote */}
            <div className="mt-24 text-center">
              <div className="inline-block bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200 dark:border-gray-600 max-w-4xl">
                <div className="text-5xl mb-4">💬</div>
                <blockquote className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 italic">
                  "{t('landing.quote')}"
                </blockquote>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  — {t('landing.quoteAuthor')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default NewModernLanding;

