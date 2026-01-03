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
        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            
            {/* Logo & Title - Centered at Top - Enhanced Design */}
            <div className="text-center mb-16">
              {/* Logo with 3D Effect */}
              <div className="relative inline-block mb-8">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 via-purple-500/30 to-blue-500/30 rounded-full blur-3xl scale-150 animate-pulse"></div>
                
                {/* Main Logo */}
                <div className="relative group">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-orange-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <svg 
                      viewBox="0 0 24 24" 
                      className="w-14 h-14 md:w-18 md:h-18 text-white transform group-hover:scale-110 transition-transform duration-300"
                      fill="currentColor"
                    >
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 text-3xl animate-bounce" style={{ animationDuration: '2s' }}>✨</div>
                  <div className="absolute -bottom-4 -left-4 text-3xl animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }}>📚</div>
                </div>
              </div>

              {/* Brand Name with Modern Typography */}
              <div className="mb-6">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-2 tracking-tight" style={{ 
                  fontFamily: 'Comfortaa, sans-serif',
                }}>
                  <span className="inline-block bg-gradient-to-r from-orange-500 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
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
                  
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <span className="text-3xl">🎯</span>
                      {t('landing.ourMission')}
                    </h3>
                    <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t('landing.missionText')}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 text-center border border-orange-200 dark:border-orange-700">
                      <div className="text-4xl mb-2">📚</div>
                      <div className="text-2xl md:text-3xl font-black text-orange-600 dark:text-orange-400 mb-1">
                        {stats.files.number}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {t('landing.totalFiles')}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 text-center border border-purple-200 dark:border-purple-700">
                      <div className="text-4xl mb-2">👥</div>
                      <div className="text-2xl md:text-3xl font-black text-purple-600 dark:text-purple-400 mb-1">
                        {stats.users.number}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {t('landing.activeStudents')}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-6 border-2 border-blue-200 dark:border-blue-700">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl md:text-4xl">💡</div>
                      <div>
                        <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {t('landing.whyDifferent')}
                        </h4>
                        <ul className="space-y-2 text-sm md:text-base text-gray-700 dark:text-gray-300">
                          <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            {t('landing.feature1Short')}
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            {t('landing.feature2Short')}
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            {t('landing.feature3Short')}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    {!user && (
                      <button
                        onClick={() => navigate('/signup')}
                        className="btn btn-primary text-lg px-8 py-4"
                      >
                        {t('landing.joinNow')}
                      </button>
                    )}
                    <button
                      onClick={() => navigate('/library')}
                      className="text-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors px-8 py-4"
                    >
                      {t('landing.lookAround')} →
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side: Leaderboard - Creative Design */}
              <div>
                <div className="text-center mb-10">
                  <div className="relative inline-block mb-6">
                    {/* Animated Trophy with Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/40 via-orange-500/40 to-red-500/40 rounded-full blur-2xl animate-pulse"></div>
                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center text-5xl md:text-6xl shadow-2xl transform hover:scale-110 transition-transform duration-500">
                      🏆
                    </div>
                    {/* Floating Sparkles */}
                    <div className="absolute -top-2 -right-2 text-2xl animate-bounce" style={{ animationDelay: '0s' }}>✨</div>
                    <div className="absolute -bottom-2 -left-2 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>⭐</div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-3xl p-8 md:p-12 border-2 border-orange-200 dark:border-orange-700 shadow-2xl">
                    <div className="text-5xl mb-4">🌱</div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      {t('landing.chapter1Title')}
                    </h3>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      {t('landing.chapter1Text1')}
                    </p>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      {t('landing.chapter1Text2')}
                    </p>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-purple-400/20 rounded-3xl blur-3xl"></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                      <div className="text-6xl md:text-8xl text-center mb-4">💡</div>
                      <div className="text-center">
                        <div className="text-5xl font-black text-orange-600 dark:text-orange-400 mb-2">2025</div>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                          {t('landing.chapter1Year')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chapter 2: The Problem */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-3xl blur-3xl"></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                      <div className="text-6xl md:text-8xl text-center mb-4">😤</div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <p className="text-gray-700 dark:text-gray-300">
                            {t('landing.problem1')}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <p className="text-gray-700 dark:text-gray-300">
                            {t('landing.problem2')}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <p className="text-gray-700 dark:text-gray-300">
                            {t('landing.problem3')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-3xl p-8 md:p-12 border-2 border-purple-200 dark:border-purple-700 shadow-2xl">
                    <div className="text-5xl mb-4">🎯</div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      {t('landing.chapter2Title')}
                    </h3>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      {t('landing.chapter2Text1')}
                    </p>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      {t('landing.chapter2Text2')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chapter 3: The Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-3xl p-8 md:p-12 border-2 border-blue-200 dark:border-blue-700 shadow-2xl">
                    <div className="text-5xl mb-4">⚡</div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      {t('landing.chapter3Title')}
                    </h3>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      {t('landing.chapter3Text1')}
                    </p>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                      {t('landing.chapter3Text2')}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium">
                        {t('landing.tag1')}
                      </span>
                      <span className="px-4 py-2 bg-purple-500 text-white rounded-full text-sm font-medium">
                        {t('landing.tag2')}
                      </span>
                      <span className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium">
                        {t('landing.tag3')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-3xl blur-3xl"></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                      <div className="text-6xl md:text-8xl text-center mb-6">🚀</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl">
                          <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                            {stats.files.number}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {t('landing.filesAvailable')}
                          </div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl">
                          <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
                            {stats.users.number}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {t('landing.activeUsers')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chapter 4: The Future */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-red-400/10 rounded-3xl blur-3xl"></div>
                <div className="relative bg-gradient-to-br from-orange-500 via-purple-600 to-blue-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
                  <div className="text-6xl md:text-7xl mb-6">✨</div>
                  <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    {t('landing.chapter4Title')}
                  </h3>
                  <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
                    {t('landing.chapter4Text1')}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                      <div className="text-4xl mb-3">🤖</div>
                      <h4 className="text-xl font-bold text-white mb-2">
                        {t('landing.future1Title')}
                      </h4>
                      <p className="text-white/80 text-sm">
                        {t('landing.future1Text')}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                      <div className="text-4xl mb-3">👥</div>
                      <h4 className="text-xl font-bold text-white mb-2">
                        {t('landing.future2Title')}
                      </h4>
                      <p className="text-white/80 text-sm">
                        {t('landing.future2Text')}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                      <div className="text-4xl mb-3">📱</div>
                      <h4 className="text-xl font-bold text-white mb-2">
                        {t('landing.future3Title')}
                      </h4>
                      <p className="text-white/80 text-sm">
                        {t('landing.future3Text')}
                      </p>
                    </div>
                  </div>

                  <p className="text-2xl md:text-3xl text-white font-bold mb-8">
                    {t('landing.chapter4Text2')}
                  </p>

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

