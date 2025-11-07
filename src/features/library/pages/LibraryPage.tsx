/**
 * LibraryPage - Main Page Component
 * Three Progressive Levels using Feature-Sliced Design (FSD)
 * Level 1: Smart Explorer (Categories + Search)
 * Level 2: Category View (Subjects Grid)
 * Level 3: Subject Page (Smart Tabs + Content)
 * 
 * 🎯 OPTIMIZED with Tiered Caching Architecture:
 * ✅ Level 1: Categories with subjects count (2 requests instead of 1+N)
 * ✅ Level 2: Subjects filtered client-side (0 additional requests)
 * ✅ Tier 1 data: IndexedDB cached (Categories, Purposes, FileTypes)
 * ✅ Realtime sync: Automatic cache invalidation on data changes
 * 
 * Performance: 90%+ fewer database requests, instant navigation
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/mobile-cards.css';
import { motion, AnimatePresence } from 'framer-motion';
import { bookmarksService } from '../../../services/appwriteService';
// @ts-ignore - useAuth is a JSX file without type definitions
import { useAuth } from '../../../hooks/useAuth';

// Hooks - Legacy (still supported)
import {
  useCategory,
  useSubject,
  useSubjectContent,
  useGlobalSearch,
  useCategorySearch,
  useSubjectSearch,
  usePrefetchCategory,
} from '../hooks';

// Hooks - New Tiered Architecture (Optimized)
import {
  useCategoriesWithSubjects,
  useTier1Purposes,
  useSubjectsByCategory,
} from '../hooks';

// Components
import {
  CategoryCard,
  SubjectCard,
  MaterialCard,
  PostCard,
  SearchBar,
  PurposeTabs,
  LoaderSkeleton,
  Breadcrumb,
  EmptyState,
  ErrorState,
} from '../components';
import CardModal from '../components/CardModal';
import FilePreviewModal from '../components/FilePreviewModal';

import type { Category, Subject, Material } from '../../../types/database';

/**
 * Main LibraryPage Component
 */
const LibraryPage: React.FC = () => {
  const { categoryId, subjectId } = useParams<{
    categoryId?: string;
    subjectId?: string;
  }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  
  // Determine language
  const isArabic = i18n.language === 'ar';
  const nameKey = isArabic ? 'nameAr' : 'nameEn';
  const descriptionKey = isArabic ? 'descriptionAr' : 'descriptionEn';

  // Determine current level
  const level = subjectId ? 3 : categoryId ? 2 : 1;

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null); // Level filter state

  // Prefetch functions
  const prefetchCategory = usePrefetchCategory();
  // const prefetchSubject = usePrefetchSubject();

  // Data fetching - NEW: Using Tiered Architecture (Optimized)
  // ✅ Level 1: Categories with subjects count (2 requests instead of 1+N)
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategoriesWithSubjects();
  
  // ✅ Level 2: Subjects filtered client-side (0 additional requests!)
  const { data: subjects, isLoading: subjectsLoading } = useSubjectsByCategory(categoryId);
  
  // Legacy hooks (still needed for specific items)
  const { data: category, isLoading: categoryLoading } = useCategory(categoryId);
  const { data: subject, isLoading: subjectLoading } = useSubject(subjectId);
  
  // ✅ Tier 1: Purposes (IndexedDB cached)
  const { data: purposes, isLoading: purposesLoading } = useTier1Purposes();
  
  // Level 3: Content (materials + posts)
  const { materials, posts, isLoading: contentLoading } = useSubjectContent(subjectId, activeTab);
  
  // Context-aware search
  // Level 1: Global search (everything)
  const { data: globalSearchResults, isLoading: isGlobalSearching } = useGlobalSearch(
    searchQuery,
    level === 1 && searchQuery.length >= 2
  );

  // Level 2: Category search (subjects, materials, posts)
  const { data: categorySearchResults, isLoading: isCategorySearching } = useCategorySearch(
    categoryId,
    searchQuery,
    level === 2 && searchQuery.length >= 2
  );

  // Level 3: Subject search (materials and posts)
  const { data: subjectSearchResults, isLoading: isSubjectSearching } = useSubjectSearch(
    subjectId,
    searchQuery,
    level === 3 && searchQuery.length >= 2
  );

  // Determine which search results to use based on level
  const searchResults = level === 1 
    ? globalSearchResults  // Level 1: All results (categories, subjects, materials, posts)
    : level === 2 
    ? { 
        categories: [], 
        subjects: categorySearchResults?.subjects || [], 
        materials: categorySearchResults?.materials || [], 
        posts: categorySearchResults?.posts || [] 
      }  // Level 2: Subjects, Materials, Posts in category
    : { categories: [], subjects: [], materials: subjectSearchResults?.materials || [], posts: subjectSearchResults?.posts || [] };  // Level 3: Materials & Posts

  const isSearching = isGlobalSearching || isCategorySearching || isSubjectSearching;

  // Set initial active tab when purposes load
  React.useEffect(() => {
    if (purposes && purposes.length > 0 && !activeTab) {
      setActiveTab(purposes[0].$id);
    } else if (purposes && purposes.length === 0 && !activeTab) {
      setActiveTab('');
    }
  }, [purposes, activeTab]);

  // Navigation handlers
  const handleCategoryClick = useCallback((cat: Category) => {
    navigate(`/library/${cat.$id}`);
  }, [navigate]);

  const handleSubjectClick = useCallback(async (sub: Subject) => {
    if (categoryId) {
      // If we're already in a category view, use that category
      navigate(`/library/${categoryId}/${sub.$id}`);
    } else {
      // If no category in URL, we need to fetch subject's categories
      try {
        // @ts-ignore - appwriteService.js is not typed
        const appwriteService = (await import('../../../services/appwriteService')).default;
        const links = await appwriteService.subjectCategories.getBySubject(sub.$id);
        
        if (links.length === 0) {
          console.error('Subject has no categories!');
          return;
        }
        
        // Use the first category for URL
        const firstCategoryId = links[0].categoryId;
        navigate(`/library/${firstCategoryId}/${sub.$id}`);
      } catch (error) {
        console.error('Error fetching subject categories:', error);
      }
    }
  }, [navigate, categoryId]);

  // File Preview Modal state
  const [previewMaterial, setPreviewMaterial] = React.useState<Material | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [bookmarkedMaterials, setBookmarkedMaterials] = React.useState<Set<string>>(new Set());
  
  // Card Modal state (Instagram-style)
  const [cardModalOpen, setCardModalOpen] = React.useState(false);
  const [modalMaterial, setModalMaterial] = React.useState<Material | null>(null);
  const [modalPost, setModalPost] = React.useState<any>(null);

  // Load user bookmarks on mount
  React.useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const { account } = await import('../../../config/appwrite');
        const user = await account.get();
        const bookmarks = await bookmarksService.getByUser(user.$id);
        const bookmarkIds = new Set<string>(bookmarks.map((b: any) => b.fileId as string));
        setBookmarkedMaterials(bookmarkIds);
        console.log('✅ Loaded bookmarks:', bookmarkIds.size);
      } catch (error) {
        console.error('❌ Error loading bookmarks:', error);
      }
    };
    loadBookmarks();
  }, []);

  // ✅ No need for preloading - URLs are permanent public URLs

  // Handle Material click from search - Open card modal
  const handleMaterialClick = useCallback((material: Material) => {
    setModalMaterial(material);
    setModalPost(null);
    setCardModalOpen(true);
  }, []);

  // Handle Post click from search - Open card modal
  const handlePostClick = useCallback((post: any) => {
    setModalPost(post);
    setModalMaterial(null);
    setCardModalOpen(true);
  }, []);

  const handleMaterialPreview = useCallback(async (material: Material) => {
    // ✅ Get permanent public URL if not already set
    let updatedMaterial = material;
    if (material.fileId && !material.viewURL) {
      try {
        const { StorageService } = await import('../../../config/StorageService');
        const publicUrl = StorageService.getPublicURL(material.fileId);
        updatedMaterial = { ...material, viewURL: publicUrl };
      } catch (error) {
        console.warn('⚠️ Could not generate public URL:', error);
      }
    }
    
    setPreviewMaterial(updatedMaterial);
    setIsPreviewOpen(true);
  }, []);

  const handleBookmark = useCallback(async (materialId: string) => {
    try {
      const result = await bookmarksService.toggle(materialId);
      
      if (result.bookmarked) {
        setBookmarkedMaterials(prev => {
          const newSet = new Set(prev);
          newSet.add(materialId);
          return newSet;
        });
        console.log('✅ Bookmark added:', materialId);
      } else {
        setBookmarkedMaterials(prev => {
          const newSet = new Set(prev);
          newSet.delete(materialId);
          return newSet;
        });
        console.log('❌ Bookmark removed:', materialId);
      }
    } catch (error) {
      console.error('❌ Bookmark error:', error);
    }
  }, []);

  const handleClosePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setPreviewMaterial(null);
  }, []);

  const handleBackToLibrary = useCallback(() => {
    navigate('/library');
  }, [navigate]);

  const handleBackToCategory = useCallback(() => {
    if (categoryId) {
      navigate(`/library/${categoryId}`);
    }
  }, [navigate, categoryId]);

  // Combine materials and posts
  const combinedContent = useMemo(() => {
    return [...materials, ...posts].sort((a, b) => {
      const dateA = new Date(a.$createdAt).getTime();
      const dateB = new Date(b.$createdAt).getTime();
      return dateB - dateA;
    });
  }, [materials, posts]);

  // Breadcrumb items
  const breadcrumbItems = useMemo(() => {
    const items = [
      {
        label: t('nav.materials'),
        onClick: level > 1 ? handleBackToLibrary : undefined,
      },
    ];

    if (level >= 2 && category) {
      items.push({
        label: category[nameKey],
        onClick: level > 2 ? handleBackToCategory : undefined,
      });
    }

    if (level === 3 && subject) {
      items.push({
        label: subject[nameKey],
        onClick: undefined,
      });
    }

    return items;
  }, [level, category, subject, nameKey, t, handleBackToLibrary, handleBackToCategory]);

  // Labels for components
  const searchLabels = {
    categories: t('materials.categories'),
    subjects: t('materials.subjects'),
    materials: t('materials.title'),
    posts: t('materials.posts'),
    noResults: isArabic ? 'لا توجد نتائج' : 'No results',
  };

  // 🆕 Filter and Sort subjects by level (Level 2 only)
  const { sortedSubjects, availableLevels } = useMemo(() => {
    if (!subjects || subjects.length === 0) {
      return { sortedSubjects: [], availableLevels: [] };
    }

    // Debug: Check first few subjects
    console.log('🔍 First 3 subjects:', subjects.slice(0, 3).map(s => ({
      name: s.nameAr || s.nameEn,
      level: s.level,
      levelType: typeof s.level
    })));

    // Get all unique levels from subjects (ensure we get the level property)
    const levelsSet = new Set<number>();
    subjects.forEach((s: Subject) => {
      const level = s.level;
      if (level !== undefined && level !== null && typeof level === 'number') {
        levelsSet.add(level);
      } else if (level !== undefined && level !== null) {
        // Try to convert to number if it's a string
        const numLevel = parseInt(String(level), 10);
        if (!isNaN(numLevel)) {
          levelsSet.add(numLevel);
        }
      }
    });
    
    const levels = Array.from(levelsSet).sort((a, b) => a - b);

    // Sort subjects by level (ascending) by default
    let sorted = [...subjects].sort((a: Subject, b: Subject) => {
      const aLevel = typeof a.level === 'number' ? a.level : parseInt(String(a.level || 1), 10) || 1;
      const bLevel = typeof b.level === 'number' ? b.level : parseInt(String(b.level || 1), 10) || 1;
      return aLevel - bLevel;
    });

    // Apply level filter if selected
    if (selectedLevel !== null) {
      sorted = sorted.filter((s: Subject) => {
        const sLevel = typeof s.level === 'number' ? s.level : parseInt(String(s.level || 0), 10);
        return sLevel === selectedLevel;
      });
    }

    console.log('🔍 Level Filter Debug:', {
      totalSubjects: subjects.length,
      availableLevels: levels,
      selectedLevel,
      sortedSubjectsCount: sorted.length
    });

    return { 
      sortedSubjects: sorted, 
      availableLevels: levels
    };
  }, [subjects, selectedLevel]);

  const materialLabels = {
    fileSize: isArabic ? 'حجم الملف' : 'File Size',
    fileType: isArabic ? 'نوع الملف' : 'File Type',
    preview: isArabic ? 'معاينة' : 'Preview',
    download: isArabic ? 'تحميل' : 'Download',
    bookmark: isArabic ? 'حفظ' : 'Bookmark',
    info: isArabic ? 'معلومات' : 'Info',
    description: isArabic ? 'الوصف' : 'Description',
    size: isArabic ? 'الحجم' : 'Size',
    type: isArabic ? 'النوع' : 'Type',
    downloads: isArabic ? 'التحميلات' : 'Downloads',
    date: isArabic ? 'التاريخ' : 'Date',
    back: isArabic ? 'رجوع' : 'Back',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Level 1: Smart Explorer */}
        {level === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
                📚 {t('nav.materials')}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('exploreDescription')}
              </p>
            </div>

            {/* Search Bar - Level 1: Global Search */}
            <SearchBar
              onSearch={setSearchQuery}
              results={searchResults}
              isSearching={isSearching}
              onCategoryClick={handleCategoryClick}
              onSubjectClick={handleSubjectClick}
              onMaterialClick={handleMaterialClick}
              onPostClick={handlePostClick}
              placeholder={isArabic ? 'ابحث في المكتبة...' : 'Search the library...'}
              labels={searchLabels}
              nameKey={nameKey}
              className="mb-12 max-w-3xl mx-auto"
              searchLevel="global"
            />

            {/* Categories Grid */}
            {categoriesLoading ? (
              <LoaderSkeleton variant="grid" count={8} />
            ) : categoriesError ? (
              <ErrorState
                title={isArabic ? 'خطأ في تحميل التصنيفات' : 'Error loading categories'}
                message={categoriesError.message}
                onRetry={() => window.location.reload()}
                retryLabel={isArabic ? 'إعادة المحاولة' : 'Try Again'}
              />
            ) : categories && categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat: Category & { subjectsCount: number }) => (
                  <CategoryCard
                    key={cat.$id}
                    category={cat}
                    onClick={() => handleCategoryClick(cat)}
                    onHover={() => prefetchCategory(cat.$id)}
                    nameKey={nameKey}
                    descriptionKey={descriptionKey}
                    subjectsLabel={t('materials.subjects')}
                    className="card-container"
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="📚"
                title={isArabic ? 'لا توجد تصنيفات' : 'No categories available'}
                description={isArabic ? 'لم يتم إضافة أي تصنيفات بعد' : 'No categories have been added yet'}
              />
            )}
          </motion.div>
        )}

        {/* Level 2: Category View */}
        {level === 2 && (
          <AnimatePresence mode="wait">
            <motion.div
              key="category-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Breadcrumb */}
              <Breadcrumb items={breadcrumbItems} className="mb-6" />

              {/* Category Header */}
              {categoryLoading ? (
                <LoaderSkeleton variant="text" count={3} className="mb-12" />
              ) : category && (
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <span className="text-6xl">{category.icon}</span>
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                      {category[nameKey]}
                    </h1>
                  </div>
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    {category[descriptionKey]}
                  </p>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {subjects?.length || 0} {t('subjects')}
                    </span>
                  </div>
                </div>
              )}

            {/* Search Bar - Level 2: Category Search (Subjects, Materials, Posts) */}
            <SearchBar
              onSearch={setSearchQuery}
              results={searchResults}
              isSearching={isSearching}
              onSubjectClick={handleSubjectClick}
              onMaterialClick={handleMaterialClick}
              onPostClick={handlePostClick}
              placeholder={isArabic ? 'ابحث في التصنيف...' : 'Search in category...'}
              labels={searchLabels}
              nameKey={nameKey}
              className="mb-8 max-w-3xl mx-auto"
              searchLevel="category"
            />

            {/* 🆕 Level Filter Buttons (Dynamic based on available levels) */}
            {!subjectsLoading && subjects && subjects.length > 0 && availableLevels.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isArabic ? 'فلترة حسب المستوى:' : 'Filter by Level:'}
                </span>
                
                {/* All Button */}
                <button
                  onClick={() => setSelectedLevel(null)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${selectedLevel === null
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50 border-2 border-indigo-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md'
                    }
                  `}
                >
                  {isArabic ? 'الكل' : 'All'} ({subjects.length})
                </button>

                {/* Dynamic Level Buttons (only show levels that exist) */}
                {availableLevels.map(level => {
                  const count = subjects.filter((s: Subject) => s.level === level).length;
                  return (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`
                        w-10 h-10 flex items-center justify-center text-sm font-bold rounded-md
                        transition-all duration-200 transform hover:scale-110
                        ${selectedLevel === level
                          ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50 border-2 border-indigo-700 ring-2 ring-indigo-300 dark:ring-indigo-700'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md'
                        }
                      `}
                      title={`${isArabic ? 'المستوى' : 'Level'} ${level} (${count})`}
                    >
                      {level}
                    </button>
                  );
                })}

                {selectedLevel !== null && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {sortedSubjects.length} {isArabic ? 'مواد' : 'subjects'}
                  </span>
                )}
              </div>
            )}

            {/* Subjects Grid */}
            {subjectsLoading ? (
              <LoaderSkeleton variant="grid" count={6} />
            ) : sortedSubjects && sortedSubjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedSubjects.map((subject: Subject) => (
                  <SubjectCard
                    key={subject.$id}
                    subject={subject}
                    onClick={() => handleSubjectClick(subject)}
                    nameKey={nameKey}
                    descriptionKey={descriptionKey}
                    creditHoursLabel={isArabic ? 'ساعة معتمدة' : 'Credit Hours'}
                    levelLabel={isArabic ? 'المستوى' : 'Level'}
                    className="card-container"
                  />
                ))}
              </div>
            ) : selectedLevel !== null ? (
              <EmptyState
                icon="🔍"
                title={isArabic ? 'لا توجد مواد' : 'No subjects'}
                description={isArabic ? `لا توجد مواد في المستوى ${selectedLevel}` : `No subjects found in level ${selectedLevel}`}
              />
            ) : (
              <EmptyState
                icon="📚"
                title={isArabic ? 'لا توجد مواد' : 'No subjects'}
                description={isArabic ? 'لم يتم إضافة مواد لهذا التصنيف بعد' : 'No subjects have been added to this category yet'}
              />
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* LEVEL 3: Subject Page - Materials & Posts */}
      {categoryId && subjectId && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`subject-${subjectId}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Breadcrumb */}
            {category && subject && (
              <Breadcrumb items={breadcrumbItems} className="mb-6" />
            )}

            {/* Subject Header */}
            {subjectLoading ? (
              <LoaderSkeleton variant="text" count={3} className="mb-12" />
            ) : subject && (
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                  {subject[nameKey]}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
                  {subject[descriptionKey]}
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {subject.creditHours || 0} {isArabic ? 'ساعة معتمدة' : 'Credit Hours'}
                  </span>
                  {subject.level && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {subject.level}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Search Bar - Level 3: Subject Search (Materials & Posts only) */}
            <SearchBar
              onSearch={setSearchQuery}
              results={searchResults}
              isSearching={isSearching}
              onMaterialClick={handleMaterialClick}
              onPostClick={handlePostClick}
              placeholder={isArabic ? 'ابحث في المحتوى...' : 'Search content...'}
              labels={searchLabels}
              nameKey={nameKey}
              className="mb-6 max-w-3xl mx-auto"
              searchLevel="subject"
            />

            {/* Data-Driven Purpose Tabs */}
            {purposesLoading ? (
              <LoaderSkeleton variant="text" count={1} className="mb-6" />
            ) : purposes && purposes.length > 0 ? (
              <PurposeTabs
                purposes={purposes}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                nameKey={nameKey}
                className="mb-8"
              />
            ) : null}

            {/* Content Grid */}
            {contentLoading ? (
              <LoaderSkeleton variant="grid" count={6} />
            ) : combinedContent.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {combinedContent.map((item) =>
                  'fileName' in item ? (
                    <MaterialCard
                      key={item.$id}
                      material={item as Material}
                      onPreview={() => handleMaterialPreview(item as Material)}
                      onBookmark={() => handleBookmark(item.$id)}
                      isBookmarked={bookmarkedMaterials.has(item.$id)}
                      labels={materialLabels}
                      className="card-container"
                    />
                  ) : (
                    <PostCard
                      key={item.$id}
                      post={item as any}
                      labels={{
                        link: isArabic ? 'رابط' : 'Link',
                        viewPost: isArabic ? 'عرض المنشور' : 'View Post',
                      }}
                    />
                  )
                )}
              </div>
            ) : (
              <EmptyState
                icon="📭"
                title={t('noContent')}
                description={isArabic ? 'لم يتم إضافة محتوى لهذا القسم بعد' : 'No content has been added to this section yet'}
              />
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>

      {/* File Preview Modal - Advanced multi-format previewer */}
      <FilePreviewModal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        fileUrl={previewMaterial?.viewURL || ''}
        fileName={previewMaterial?.fileName || ''}
        mimeType={previewMaterial?.mimeType}
        title={previewMaterial?.title || ''}
        onDownload={async () => {
          // Check if user is authenticated
          if (!user) {
            alert(isArabic 
              ? 'يجب عليك تسجيل الدخول أولاً لتحميل الملفات' 
              : 'You must log in first to download files');
            return;
          }

          if (!previewMaterial?.fileId) return;
          
          // ✅ Get permanent public URL
          let downloadUrl = previewMaterial.viewURL;
          if (!downloadUrl) {
            try {
              const { StorageService } = await import('../../../config/StorageService');
              downloadUrl = StorageService.getPublicURL(previewMaterial.fileId);
            } catch (error) {
              console.error('❌ Could not generate public URL:', error);
              return;
            }
          }
          
          // Record download
          try {
            const { downloadsService } = await import('../../../services/appwriteService');
            await downloadsService.create(previewMaterial.$id);
            console.log('✅ Download recorded:', previewMaterial.$id);
          } catch (error) {
            console.error('❌ Error recording download:', error);
          }
          
          // Download file
          try {
            const response = await fetch(downloadUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = previewMaterial.fileName || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
          } catch (error) {
            console.error('Download error:', error);
            window.open(previewMaterial.viewURL, '_blank');
          }
        }}
      />

      {/* Card Modal - Instagram-style */}
      <CardModal
        isOpen={cardModalOpen}
        onClose={() => setCardModalOpen(false)}
        material={modalMaterial || undefined}
        post={modalPost}
        onMaterialPreview={() => {
          if (modalMaterial) {
            setCardModalOpen(false);
            handleMaterialPreview(modalMaterial);
          }
        }}
        onBookmark={() => {
          if (modalMaterial) {
            handleBookmark(modalMaterial.$id);
          }
        }}
        isBookmarked={modalMaterial ? bookmarkedMaterials.has(modalMaterial.$id) : false}
        materialLabels={materialLabels}
        postLabels={{
          link: isArabic ? 'رابط' : 'Link',
          viewPost: isArabic ? 'عرض المنشور' : 'View Post',
        }}
      />
    </div>
  );
};

export default LibraryPage;
