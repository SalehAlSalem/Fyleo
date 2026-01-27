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
  const [activeFilter, setActiveFilter] = useState('all');
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
      // Reset filter when opening
      setActiveFilter('all');
      
      // Focus input immediately (iOS requires immediate focus)
      if (inputRef.current) {
        inputRef.current.focus();
        // Force keyboard on iOS
        inputRef.current.click();
      }
      
      // Prevent body scroll - Enhanced for all browsers
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
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
    setActiveFilter('all');
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
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-md overflow-hidden"
        onClick={onClose}
        onTouchMove={(e) => e.preventDefault()}
        onWheel={(e) => e.preventDefault()}
      >
        <motion.div
          initial={{ scale: 0.95, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 30, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="mobile-search-popup"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative Gradient Blobs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-orange-400/30 via-purple-400/30 to-blue-400/30 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-blue-400/30 via-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>

          {/* Search Header - Creative Design */}
          <div className="relative flex items-center gap-2 p-3 border-b-2 border-gradient-to-r from-orange-200/50 via-purple-200/50 to-blue-200/50 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
            {/* Gradient Line Decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500"></div>
            
            <div className="flex-1 relative group">
              {/* Search Icon with Pulsing Ring */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                <div className="relative">
                  <span className="text-xl">{isLoading ? '⏳' : '🔍'}</span>
                  {!isLoading && (
                    <span className="absolute inset-0 rounded-full border-2 border-purple-500/50 animate-ping"></span>
                  )}
                </div>
              </div>
              
              {/* Input with Glass Effect */}
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isArabic ? 'ابحث عن أي شيء... ✨' : 'Search anything... ✨'}
                className="w-full pl-11 pr-11 py-3 bg-gradient-to-br from-gray-50 to-gray-100/80 dark:from-gray-800 dark:to-gray-700/80 text-gray-900 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner backdrop-blur-sm border-2 border-transparent group-hover:border-purple-300/50 dark:group-hover:border-purple-600/50 transition-all duration-300"
                style={{ fontSize: '16px' }}
                dir={isArabic ? 'rtl' : 'ltr'}
                inputMode="search"
              />
              
              {/* Clear Button - X للمسح */}
              {searchQuery && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 hover:from-gray-500 hover:to-gray-600 dark:hover:from-gray-500 dark:hover:to-gray-600 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90 shadow-md z-20"
                >
                  <span className="text-white text-base font-bold">×</span>
                </motion.button>
              )}
            </div>
            
            {/* Close Button with Gradient */}
            <button
              onClick={onClose}
              className="relative w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg group overflow-hidden flex-shrink-0"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></span>
              <span className="relative text-xl font-bold">×</span>
            </button>
          </div>

          {/* Smart Filters Bar - Only show when there are results */}
          {searchQuery.trim() !== '' && ((searchResults.categories?.length || 0) > 0 || (searchResults.subjects?.length || 0) > 0 || (searchResults.materials?.length || 0) > 0 || (searchResults.posts?.length || 0) > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-3 py-2 bg-gradient-to-r from-gray-50/90 via-white/90 to-gray-50/90 dark:from-gray-800/90 dark:via-gray-900/90 dark:to-gray-800/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {/* All Filter */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                    activeFilter === 'all'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span>✨</span>
                    <span>{isArabic ? 'الكل' : 'All'}</span>
                    <span className="opacity-75">({(searchResults.categories?.length || 0) + (searchResults.subjects?.length || 0) + (searchResults.materials?.length || 0) + (searchResults.posts?.length || 0)})</span>
                  </span>
                </motion.button>

                {/* Categories Filter */}
                {searchResults.categories && searchResults.categories.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveFilter('categories')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                      activeFilter === 'categories'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <span>📚</span>
                    <span>{isArabic ? 'التخصصات' : 'Majors'}</span>
                      <span className="opacity-75">({searchResults.categories.length})</span>
                    </span>
                  </motion.button>
                )}

                {/* Subjects Filter */}
                {searchResults.subjects && searchResults.subjects.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveFilter('subjects')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                      activeFilter === 'subjects'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <span>📖</span>
                    <span>{isArabic ? 'المواد' : 'Subjects'}</span>
                      <span className="opacity-75">({searchResults.subjects.length})</span>
                    </span>
                  </motion.button>
                )}

                {/* Materials Filter */}
                {searchResults.materials && searchResults.materials.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveFilter('materials')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                      activeFilter === 'materials'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <span>📄</span>
                    <span>{isArabic ? 'الملفات' : 'Files'}</span>
                      <span className="opacity-75">({searchResults.materials.length})</span>
                    </span>
                  </motion.button>
                )}

                {/* Posts Filter */}
                {searchResults.posts && searchResults.posts.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveFilter('posts')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                      activeFilter === 'posts'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <span>🔗</span>
                      <span>{isArabic ? 'الروابط' : 'Links'}</span>
                      <span className="opacity-75">({searchResults.posts.length})</span>
                    </span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {/* Search Results - Enhanced Design */}
          <div 
            className="relative overflow-y-auto max-h-[65vh] p-3 bg-gradient-to-b from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50"
            onTouchMove={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {searchQuery.trim() === '' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4 filter drop-shadow-lg"
                >
                  🔍
                </motion.div>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isArabic ? 'ابدأ البحث عن المحتوى' : 'Start Searching'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isArabic ? 'اكتشف المواد، المواضيع، والملفات' : 'Discover materials, subjects, and files'}
                </p>
              </motion.div>
            ) : ((searchResults.categories?.length || 0) === 0 && (searchResults.subjects?.length || 0) === 0 && (searchResults.materials?.length || 0) === 0 && (searchResults.posts?.length || 0) === 0) && !isLoading ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                  className="text-6xl mb-4 filter drop-shadow-lg"
                >
                  😔
                </motion.div>
                <p className="text-lg font-bold bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 dark:from-gray-300 dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent mb-3">
                  {isArabic ? 'لم يتم العثور على نتائج' : 'No results found'}
                </p>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6"
                  >
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      {isArabic ? 'هل تقصد:' : 'Did you mean:'}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSearchQuery(suggestion)}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full transition-all duration-300 text-xs font-medium shadow-lg hover:shadow-xl relative overflow-hidden group"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></span>
                          <span className="relative">{suggestion}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="space-y-3">
                {/* Suggestions Bar with Creative Design */}
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl border-2 border-yellow-300/50 dark:border-yellow-600/50 shadow-lg relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl"></div>
                    <p className="text-xs font-bold text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2 relative z-10">
                      <span className="text-base">💡</span>
                      {isArabic ? 'اقتراحات:' : 'Suggestions:'}
                    </p>
                    <div className="flex flex-wrap gap-2 relative z-10">
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSearchQuery(suggestion)}
                          className="px-3 py-1.5 bg-white dark:bg-gray-800 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium hover:bg-yellow-50 dark:hover:bg-gray-700 transition-all border-2 border-yellow-300 dark:border-yellow-600 shadow-md hover:shadow-lg"
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
                {/* Categories - Spotlight Style */}
                {searchResults.categories?.length > 0 && (activeFilter === 'all' || activeFilter === 'categories') && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="py-2 px-2"
                  >
                    {activeFilter === 'all' && (
                      <div className="px-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-blue-500"></div>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                            {isArabic ? 'التخصصات' : 'Majors'}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      {searchResults.categories?.map((category, index) => (
                        <button
                          key={category.$id}
                          onClick={() => handleResultClick(category, 'category')}
                          className="group relative w-full px-3 py-2.5 rounded-xl text-left transition-all duration-200 bg-gradient-to-br from-blue-500/15 via-blue-400/10 to-purple-500/15 dark:from-blue-500/25 dark:via-blue-400/15 dark:to-purple-500/25 border border-blue-300/50 dark:border-blue-600/50 hover:shadow-lg active:scale-[0.98]"
                        >
                          <div className="relative flex items-center gap-3">
                            <div className="text-2xl flex-shrink-0 transition-transform group-hover:scale-110">
                              {category.icon || '📚'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 dark:text-white truncate mb-0.5">
                                {isArabic ? category.nameAr : category.nameEn}
                              </p>
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-[9px] font-semibold text-blue-700 dark:text-blue-400">
                                  {isArabic ? 'تخصص' : 'Major'}
                                </span>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 rounded-full bg-blue-500/20 dark:bg-blue-500/30 flex items-center justify-center group-hover:bg-blue-500 dark:group-hover:bg-blue-600 transition-colors">
                                <span className="text-blue-600 dark:text-blue-400 group-hover:text-white text-sm">›</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {/* Subjects - Spotlight Style */}
                {searchResults.subjects?.length > 0 && (activeFilter === 'all' || activeFilter === 'subjects') && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="py-2 px-2"
                  >
                    {activeFilter === 'all' && (
                      <div className="px-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-purple-500"></div>
                          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                            {isArabic ? 'المواد' : 'Subjects'}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      {searchResults.subjects?.map((subject, index) => (
                        <button
                          key={subject.$id}
                          onClick={() => handleResultClick(subject, 'subject')}
                          className="group relative w-full px-3 py-2.5 rounded-xl text-left transition-all duration-200 bg-gradient-to-br from-purple-500/15 via-purple-400/10 to-pink-500/15 dark:from-purple-500/25 dark:via-purple-400/15 dark:to-pink-500/25 border border-purple-300/50 dark:border-purple-600/50 hover:shadow-lg active:scale-[0.98]"
                        >
                          <div className="relative flex items-center gap-3">
                            <div className="text-2xl flex-shrink-0 transition-transform group-hover:scale-110">
                              📖
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 dark:text-white truncate mb-0.5">
                                {isArabic ? subject.nameAr : subject.nameEn}
                              </p>
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-[9px] font-semibold text-purple-700 dark:text-purple-400">
                                  {isArabic ? 'مادة' : 'Subject'}
                                </span>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 rounded-full bg-purple-500/20 dark:bg-purple-500/30 flex items-center justify-center group-hover:bg-purple-500 dark:group-hover:bg-purple-600 transition-colors">
                                <span className="text-purple-600 dark:text-purple-400 group-hover:text-white text-sm">›</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {/* Materials - Spotlight Style */}
                {searchResults.materials?.length > 0 && (activeFilter === 'all' || activeFilter === 'materials') && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="py-2 px-2"
                  >
                    {activeFilter === 'all' && (
                      <div className="px-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-green-500"></div>
                          <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
                            {isArabic ? 'الملفات' : 'Files'}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      {searchResults.materials?.map((material, index) => (
                        <button
                          key={material.$id}
                          onClick={() => handleResultClick(material, 'material')}
                          className="group relative w-full px-3 py-2.5 rounded-xl text-left transition-all duration-200 bg-gradient-to-br from-green-500/15 via-green-400/10 to-emerald-500/15 dark:from-green-500/25 dark:via-green-400/15 dark:to-emerald-500/25 border border-green-300/50 dark:border-green-600/50 hover:shadow-lg active:scale-[0.98]"
                        >
                          <div className="relative flex items-center gap-3">
                            <div className="text-2xl flex-shrink-0 transition-transform group-hover:scale-110">
                              {material.fileType?.icon || '📄'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 dark:text-white truncate mb-0.5">
                                {material.title}
                              </p>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/40 text-[9px] font-semibold text-green-700 dark:text-green-400">
                                  {material.fileType?.[isArabic ? 'nameAr' : 'nameEn'] || (isArabic ? 'ملف' : 'File')}
                                </span>
                                {material.subject && (
                                  <>
                                    <span className="text-[9px] text-gray-400 dark:text-gray-500">•</span>
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                                      {material.subject[isArabic ? 'nameAr' : 'nameEn']}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 rounded-full bg-green-500/20 dark:bg-green-500/30 flex items-center justify-center group-hover:bg-green-500 dark:group-hover:bg-green-600 transition-colors">
                                <span className="text-green-600 dark:text-green-400 group-hover:text-white text-sm">›</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {/* Posts - Spotlight Style */}
                {searchResults.posts?.length > 0 && (activeFilter === 'all' || activeFilter === 'posts') && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="py-2 px-2"
                  >
                    {activeFilter === 'all' && (
                      <div className="px-2 mb-2">
                        <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">
                          {isArabic ? 'روابط' : 'Links'}
                        </span>
                      </div>
                    )}
                    <div className="space-y-1.5">
                      {searchResults.posts?.map((post, index) => (
                        <button
                          key={post.$id}
                          onClick={() => handleResultClick(post, 'post')}
                          className="group w-full px-3 py-2.5 rounded-xl text-left transition-all duration-200 bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 hover:shadow-md active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl flex-shrink-0 transition-transform group-hover:scale-110">
                              🔗
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {post.contentText?.substring(0, 50) || post.linkURL || 'Link'}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                {post.subject && (
                                  <>
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[100px]">
                                      {post.subject[isArabic ? 'nameAr' : 'nameEn']}
                                    </span>
                                    {post.uploaderName && <span className="text-[9px] text-gray-400 dark:text-gray-500">•</span>}
                                  </>
                                )}
                                {post.uploaderName && (
                                  <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[80px]">
                                    {post.uploaderName}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-orange-500 dark:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                              →
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
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
