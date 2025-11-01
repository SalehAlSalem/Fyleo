import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { hierarchyService } from '@/services';
import './ModernNavbar.css';

const MobileSearchPopup = ({ isOpen, onClose, onMaterialClick, onPostClick }) => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ categories: [], subjects: [], materials: [], posts: [] });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';

  // Focus input when popup opens & prevent body scroll
  useEffect(() => {
    if (isOpen) {
      // Focus input immediately (iOS requires immediate focus)
      if (inputRef.current) {
        inputRef.current.focus();
        // Force keyboard on iOS
        inputRef.current.click();
      }
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Search function - comprehensive search in all data
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults({ categories: [], subjects: [], materials: [], posts: [] });
      return;
    }

    setIsLoading(true);
    
    try {
      const searchLower = query.toLowerCase();
      
      // Import services
      const { categoriesService, subjectsService, materialsService } = await import('@/services');
      const { postsService } = await import('@/services/appwriteService');
      
      // Fetch all data in parallel
      const [allCategories, allSubjects, allMaterials, allPosts] = await Promise.all([
        categoriesService.getAll(),
        subjectsService.getAll(),
        materialsService.getAll(1000),
        postsService.getAll(1000)
      ]);
      
      // Search in categories (nameAr, nameEn, descriptionAr, descriptionEn)
      const matchedCategories = allCategories.filter(cat => 
        cat.nameAr?.toLowerCase().includes(searchLower) ||
        cat.nameEn?.toLowerCase().includes(searchLower) ||
        cat.descriptionAr?.toLowerCase().includes(searchLower) ||
        cat.descriptionEn?.toLowerCase().includes(searchLower)
      );
      
      // Search in subjects (nameAr, nameEn, descriptionAr, descriptionEn)
      const matchedSubjects = allSubjects.filter(subj => 
        subj.nameAr?.toLowerCase().includes(searchLower) ||
        subj.nameEn?.toLowerCase().includes(searchLower) ||
        subj.descriptionAr?.toLowerCase().includes(searchLower) ||
        subj.descriptionEn?.toLowerCase().includes(searchLower)
      );
      
      // Search in materials (title, description, fileName, tags)
      const materials = allMaterials.documents || allMaterials;
      const matchedMaterials = materials.filter(mat => 
        mat.title?.toLowerCase().includes(searchLower) ||
        mat.description?.toLowerCase().includes(searchLower) ||
        mat.fileName?.toLowerCase().includes(searchLower) ||
        mat.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
      
      // Search in posts (contentText, linkURL)
      const posts = allPosts.documents || allPosts;
      const matchedPosts = posts.filter(post => 
        post.contentText?.toLowerCase().includes(searchLower) ||
        post.linkURL?.toLowerCase().includes(searchLower)
      );
      
      // Sort results by relevance (exact match first, then partial)
      const sortByRelevance = (items, getTexts) => {
        return items.sort((a, b) => {
          const aTexts = getTexts(a).map(t => t?.toLowerCase() || '');
          const bTexts = getTexts(b).map(t => t?.toLowerCase() || '');
          
          const aExact = aTexts.some(t => t === searchLower);
          const bExact = bTexts.some(t => t === searchLower);
          
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;
          
          const aStarts = aTexts.some(t => t.startsWith(searchLower));
          const bStarts = bTexts.some(t => t.startsWith(searchLower));
          
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          
          return 0;
        });
      };
      
      const sortedCategories = sortByRelevance(matchedCategories, cat => [cat.nameAr, cat.nameEn]);
      const sortedSubjects = sortByRelevance(matchedSubjects, subj => [subj.nameAr, subj.nameEn]);
      const sortedMaterials = sortByRelevance(matchedMaterials, mat => [mat.title, mat.fileName]);
      const sortedPosts = sortByRelevance(matchedPosts, post => [post.contentText, post.linkURL]);
      
      setSearchResults({
        categories: sortedCategories,
        subjects: sortedSubjects,
        materials: sortedMaterials,
        posts: sortedPosts
      });
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ categories: [], subjects: [], materials: [], posts: [] });
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = (result, type) => {
    if (type === 'material') {
      // Open material card popup
      if (onMaterialClick) {
        onMaterialClick(result);
      }
    } else if (type === 'post') {
      // Open post card popup
      if (onPostClick) {
        onPostClick(result);
      }
    } else if (type === 'subject') {
      // Navigate to subject page
      navigate(`/library/${result.categoryId}/${result.$id}`);
    } else if (type === 'category') {
      // Navigate to category page
      navigate(`/library/${result.$id}`);
    }
    onClose();
    setSearchQuery('');
  };
  
  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur(); // Close keyboard
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="mobile-search-popup"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isArabic ? 'ابحث عن مواد، مواضيع، ملفات...' : 'Search materials, subjects, files...'}
                className="w-full px-4 py-3 pr-12 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ fontSize: '16px' }}
                dir={isArabic ? 'rtl' : 'ltr'}
                inputMode="search"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">
                {isLoading ? '⏳' : '🔍'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
            >
              <span className="text-xl">×</span>
            </button>
          </div>

          {/* Search Results */}
          <div className="overflow-y-auto max-h-[60vh] p-4">
            {searchQuery.trim() === '' ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg">
                  {isArabic ? 'ابدأ البحث عن المحتوى' : 'Start searching for content'}
                </p>
              </div>
            ) : ((searchResults.categories?.length || 0) === 0 && (searchResults.subjects?.length || 0) === 0 && (searchResults.materials?.length || 0) === 0 && (searchResults.posts?.length || 0) === 0) && !isLoading ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">😕</div>
                <p className="text-lg">
                  {isArabic ? 'لا توجد نتائج' : 'No results found'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Categories */}
                {searchResults.categories?.length > 0 && (
                  <div>
                    <div className="px-2 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b-2 border-blue-200 dark:border-blue-700 rounded-t-xl mb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                          📚 {isArabic ? 'التصنيفات' : 'Categories'}
                        </span>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded-full">
                          {searchResults.categories?.length || 0}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {searchResults.categories?.map((category) => (
                        <button
                          key={category.$id}
                          onClick={() => handleResultClick(category, 'category')}
                          className="w-full flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-left border border-gray-100 dark:border-gray-700"
                        >
                          <span className="text-2xl">{category.icon || '📚'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                              {isArabic ? category.nameAr : category.nameEn}
                            </p>
                          </div>
                          <span className="text-blue-600 dark:text-blue-400">→</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Subjects */}
                {searchResults.subjects?.length > 0 && (
                  <div>
                    <div className="px-2 py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b-2 border-purple-200 dark:border-purple-700 rounded-t-xl mb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                          📖 {isArabic ? 'المواضيع' : 'Subjects'}
                        </span>
                        <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 rounded-full">
                          {searchResults.subjects?.length || 0}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {searchResults.subjects?.map((subject) => (
                        <button
                          key={subject.$id}
                          onClick={() => handleResultClick(subject, 'subject')}
                          className="w-full flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-left border border-gray-100 dark:border-gray-700"
                        >
                          <span className="text-2xl">📖</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                              {isArabic ? subject.nameAr : subject.nameEn}
                            </p>
                          </div>
                          <span className="text-blue-600 dark:text-blue-400">→</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Materials */}
                {searchResults.materials?.length > 0 && (
                  <div>
                    <div className="px-2 py-2 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-b-2 border-green-200 dark:border-green-700 rounded-t-xl mb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wider">
                          📄 {isArabic ? 'الملفات' : 'Materials'}
                        </span>
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">
                          {searchResults.materials?.length || 0}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {searchResults.materials?.map((material) => (
                        <button
                          key={material.$id}
                          onClick={() => handleResultClick(material, 'material')}
                          className="w-full flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-left border border-gray-100 dark:border-gray-700"
                        >
                          <span className="text-2xl">📄</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                              {material.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {material.fileName}
                            </p>
                          </div>
                          <span className="text-blue-600 dark:text-blue-400">→</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Posts */}
                {searchResults.posts?.length > 0 && (
                  <div>
                    <div className="px-2 py-2 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-b-2 border-orange-200 dark:border-orange-700 rounded-t-xl mb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wider">
                          🔗 {isArabic ? 'روابط' : 'Links'}
                        </span>
                        <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded-full">
                          {searchResults.posts?.length || 0}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {searchResults.posts?.map((post) => (
                        <button
                          key={post.$id}
                          onClick={() => handleResultClick(post, 'post')}
                          className="w-full flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-left border border-gray-100 dark:border-gray-700"
                        >
                          <span className="text-2xl">🔗</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                              {post.contentText?.substring(0, 50) || post.linkURL || 'Link'}
                            </p>
                            {post.linkURL && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {post.linkURL}
                              </p>
                            )}
                          </div>
                          <span className="text-blue-600 dark:text-blue-400">→</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileSearchPopup;
