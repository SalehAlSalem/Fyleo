import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useWorkspaceData, useWorkspaceRealtimeSync } from './hooks/useWorkspaceData';
import { materialsService, postsService } from '../../services/appwriteService';
import WorkspaceHeader from './components/WorkspaceHeader';
import AnimatedStats from './components/AnimatedStats';
import UnifiedComposerCard from './components/UnifiedComposerCard';
import ContentTabs from './components/ContentTabs';
import './PersonalWorkspace.css';

/**
 * ✨ Personal Workspace - Premium Edition
 * Glass Morphism + 3D Effects + Smooth Animations
 * Inspired by Landing Page & GPA Calculator
 * 
 * ✅ React Query + Realtime Sync (No page reloads!)
 * - Auto-updates when data changes
 * - Fast local cache
 * - Optimistic updates
 */
const PersonalWorkspace = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // ✅ Use React Query hooks instead of manual state
  const { materials, posts, bookmarks, downloads, isLoading, isError, error } = useWorkspaceData(user?.$id);
  
  // ✅ Enable Realtime Sync (auto-updates when data changes in Appwrite)
  useWorkspaceRealtimeSync(user?.$id);
  
  console.log('🚀 Workspace Data:', {
    materials: materials?.length || 0,
    posts: posts?.length || 0,
    bookmarks: bookmarks?.length || 0,
    downloads: downloads?.length || 0,
    isLoading,
  });
  
  // For backwards compatibility (ContentTabs expects these names)
  const files = materials;
  const links = posts;
  
  // Loading state
  const loading = isLoading;
  
  // Bookmarked content state
  const [bookmarkedContentState, setBookmarkedContent] = useState([]);
  
  // ✅ Calculate stats from React Query data (reactive)
  const stats = useMemo(() => {
    const totalStorage = (materials || []).reduce((acc, file) => {
      return acc + (file.fileSize || 0);
    }, 0);

    const calculatedStats = {
      myFiles: materials?.length || 0,
      myLinks: posts?.length || 0,
      downloads: downloads?.length || 0,
      bookmarks: bookmarks?.length || 0,
      storageUsed: totalStorage
    };
    
    console.log('📊 PersonalWorkspace calculated stats:', calculatedStats);
    console.log('📊 Raw data:', { 
      materials: materials?.length, 
      posts: posts?.length, 
      downloads: downloads?.length, 
      bookmarks: bookmarks?.length 
    });
    
    return calculatedStats;
  }, [materials, posts, downloads, bookmarks]);

  /**
   * ✅ Process bookmarks to get full content (with React Query data)
   */
  useEffect(() => {
    const fetchBookmarkedContent = async () => {
      if (!bookmarks || bookmarks.length === 0) {
        console.log('📌 No bookmarks to fetch');
        setBookmarkedContent([]);
        return;
      }

      console.log('📌 Fetching bookmarked content for', bookmarks.length, 'bookmarks');
      
      try {
        const contentPromises = bookmarks.map(async (bookmark) => {
          try {
            const material = await materialsService.getById(bookmark.fileId);
            console.log('✅ Found material:', material.title, 'fileType:', material.fileType);
            return { 
              ...material, 
              contentType: 'file', 
              bookmarkId: bookmark.$id,
              bookmarkDate: bookmark.$createdAt 
            };
          } catch {
            try {
              const post = await postsService.getById(bookmark.fileId);
              console.log('✅ Found post:', post.$id);
              return { 
                ...post, 
                contentType: 'link', 
                bookmarkId: bookmark.$id,
                bookmarkDate: bookmark.$createdAt 
              };
            } catch {
              console.warn('⚠️ Could not find content for bookmark:', bookmark.fileId);
              return null;
            }
          }
        });

        const resolvedContent = await Promise.all(contentPromises);
        const validContent = resolvedContent.filter(item => item !== null);
        validContent.sort((a, b) => new Date(b.bookmarkDate) - new Date(a.bookmarkDate));
        
        console.log('📌 Total bookmarked content loaded:', validContent.length);
        setBookmarkedContent(validContent);
      } catch (error) {
        console.error('❌ Error fetching bookmarked content:', error);
      }
    };

    fetchBookmarkedContent();
  }, [bookmarks]);

  /**
   * ✅ No need for manual refresh - React Query + Realtime handles it automatically!
   */
  const handleRefresh = () => {
    console.log('✨ Data refreshes automatically via Realtime Sync - no manual refresh needed!');
    // React Query will refetch automatically when:
    // 1. Window is refocused
    // 2. Network reconnects
    // 3. Appwrite Realtime event fires
    // 4. staleTime expires (2 minutes)
  };

  const handleLogout = async () => {
    if (confirm(t('auth.logoutConfirm'))) {
      try {
        await logout();
        navigate('/'); // ✅ Use navigate instead of window.location
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    navigate('/delete-account/reauth');
  };

  if (!user) {
    return (
      <div className="workspace-container">
        <div className="workspace-auth-required">
          <div className="auth-icon">🔒</div>
          <h2>{t('auth.loginRequired')}</h2>
          <button 
            onClick={() => window.location.href = '/login'}
            className="workspace-btn workspace-btn-primary"
          >
            {t('nav.login')}
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="workspace-container">
        <div className="workspace-loading">
          <div className="loading-spinner"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="workspace-container">
      <div className="workspace-content">
        {/* Header */}
        <WorkspaceHeader 
          user={user}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
          onUserUpdate={handleRefresh}
        />

        {/* Animated Stats */}
        <AnimatedStats stats={stats} />

        {/* Unified Composer */}
        <UnifiedComposerCard 
          userId={user.$id}
          onSuccess={handleRefresh}
        />

        {/* Content Tabs */}
        <ContentTabs
          files={files}
          links={links}
          bookmarks={bookmarkedContentState}
          onRefresh={handleRefresh}
          userId={user.$id}
        />

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                  تحذير: حذف الحساب
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  هل أنت متأكد من رغبتك في حذف حسابك؟
                </p>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                <p className="text-sm text-red-800 dark:text-red-200 font-semibold mb-3">
                  ⚠️ سيتم حذف جميع البيانات التالية نهائياً:
                </p>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span>📁</span>
                    <span>جميع الملفات المرفوعة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>📝</span>
                    <span>جميع المنشورات والروابط</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>⭐</span>
                    <span>جميع البوك ماركس المحفوظة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>📊</span>
                    <span>سجل التحميلات والإحصائيات</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>👤</span>
                    <span>معلومات الحساب الشخصية</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3 mb-6">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center font-semibold">
                  🔒 للمتابعة، ستحتاج إلى تسجيل الدخول مرة أخرى للتأكيد
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  ❌ إلغاء
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
                >
                  ➡️ متابعة الحذف
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalWorkspace;

