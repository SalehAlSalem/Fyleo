import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { hierarchyService } from '@/services';
import localCache from '@/data/localCache';
import {
  createCategorySearch,
  createSubjectSearch,
  createMaterialSearch,
  createPostSearch,
  performFuzzySearch,
  generateSuggestions
} from '@/utils/fuzzySearch';
import './ModernNavbar.css';

const MobileSearchPopup = ({ isOpen, onClose, onMaterialClick, onPostClick }) => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ categories: [], subjects: [], materials: [], posts: [] });
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cacheInitialized, setCacheInitialized] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';

  // Initialize Fuse.js search instances once cache is loaded
  const searchInstances = useMemo(() => {
    if (!cacheInitialized) return null;

    return {
      categorySearch: createCategorySearch(localCache.getCategories()),
      subjectSearch: createSubjectSearch(localCache.getSubjects()),
      materialSearch: createMaterialSearch(localCache.getMaterials()),
      postSearch: createPostSearch(localCache.getPosts())
    };
  }, [cacheInitialized]);

  // Initialize local cache when popup opens
  useEffect(() => {
    if (isOpen && !localCache.isInitialized()) {
      localCache.init().then(() => {
        setCacheInitialized(true);
        console.log('✅ Cache initialized for mobile search');
      }).catch(error => {
        console.error('❌ Failed to initialize cache:', error);
      });
    } else if (isOpen && localCache.isInitialized()) {
      setCacheInitialized(true);
    }
  }, [isOpen]);

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

  // Fuzzy search function using Fuse.js and local cache
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults({ categories: [], subjects: [], materials: [], posts: [] });
      setSuggestions([]);
      return;
    }

    if (query.length < 2) {
      return; // Wait for at least 2 characters
    }

    setIsLoading(true);
    
    try {
      // Ensure cache is initialized
      await localCache.init();
      
      if (!searchInstances) {
        console.error('Search instances not initialized');
        return;
      }

      // Perform fuzzy search across all entity types
      const results = performFuzzySearch(query, searchInstances, 10);
      
      // Update search results
      setSearchResults({
        categories: results.categories,
        subjects: results.subjects,
        materials: results.materials,
        posts: results.posts
      });

      // Generate suggestions for alternative search terms
      // If results are poor or empty, suggest better terms
      const totalResults = 
        results.categories.length +
        results.subjects.length +
        results.materials.length +
        results.posts.length;

      if (totalResults < 3 && results._raw) {
        // Low results - generate suggestions
        const smartSuggestions = generateSuggestions(results._raw, query);
        setSuggestions(smartSuggestions);
      } else {
        setSuggestions([]);
      }

      console.log('🔍 Fuzzy search completed:', {
        query,
        categories: results.categories.length,
        subjects: results.subjects.length,
        materials: results.materials.length,
        posts: results.posts.length,
        suggestions: suggestions.length
      });
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ categories: [], subjects: [], materials: [], posts: [] });
      setSuggestions([]);
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
                {suggestions.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm mb-3">
                      {isArabic ? 'هل تقصد:' : 'Did you mean:'}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchQuery(suggestion)}
                          className="px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Suggestions Bar */}
                {suggestions.length > 0 && (
                  <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
                    <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                      💡 {isArabic ? 'اقتراحات:' : 'Suggestions:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchQuery(suggestion)}
                          className="px-3 py-1 bg-white dark:bg-gray-800 text-yellow-700 dark:text-yellow-300 rounded-full text-xs hover:bg-yellow-100 dark:hover:bg-gray-700 transition-colors border border-yellow-300 dark:border-yellow-600"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
