/**
 * SearchBar Component
 * Spotlight-style search with dropdown results
 * Now uses local fuzzy search with Fuse.js for instant results
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Category, Subject, Material } from '../../../types/database';
import { useLocalSearch } from '../hooks/useLocalSearch';
import './SearchBar.css';

interface Post {
  $id: string;
  contentText?: string;
  linkURL?: string;
  $createdAt: string;
}

interface SearchBarProps {
  onCategoryClick?: (category: Category) => void;
  onSubjectClick?: (subject: Subject) => void;
  onMaterialClick?: (material: Material) => void;
  onPostClick?: (post: Post) => void;
  placeholder: string;
  labels: {
    categories?: string;
    subjects?: string;
    materials?: string;
    posts?: string;
    noResults: string;
  };
  nameKey: 'nameAr' | 'nameEn';
  className?: string;
  autoFocus?: boolean;
  // Filter by context
  categoryId?: string | null;
  subjectId?: string | null;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onCategoryClick,
  onSubjectClick,
  onMaterialClick,
  onPostClick,
  placeholder,
  labels,
  nameKey,
  className = '',
  autoFocus = false,
  categoryId = null,
  subjectId = null,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [activeFilter, setActiveFilter] = useState<'all' | 'categories' | 'subjects' | 'materials' | 'posts'>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);

  // Use local fuzzy search hook with context filters
  const { isSearching, results, suggestions, search } = useLocalSearch(categoryId, subjectId);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        search(query);
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, search]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedItemRef.current && selectedIndex >= 0) {
      selectedItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [selectedIndex]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Enter and Escape even when dropdown is closed
    if (e.key === 'Enter') {
      e.preventDefault();
      // Close keyboard on mobile
      (e.target as HTMLInputElement).blur();
      if (isOpen && selectedIndex >= 0) {
        handleSelectResult(selectedIndex);
      }
      return;
    }
    
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setSelectedIndex(-1);
      (e.target as HTMLInputElement).blur();
      return;
    }
    
    if (!isOpen || !results) return;

    const totalResults =
      (results.categories?.length || 0) +
      (results.subjects?.length || 0) +
      (results.materials?.length || 0) +
      (results.posts?.length || 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < totalResults - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
    }
  };

  const handleSelectResult = (index: number) => {
    if (!results) return;

    let currentIndex = 0;

    // Check categories
    if (results.categories && index < results.categories.length) {
      onCategoryClick?.(results.categories[index]);
      setIsOpen(false);
      setQuery('');
      return;
    }
    currentIndex += results.categories?.length || 0;

    // Check subjects
    if (results.subjects && index < currentIndex + results.subjects.length) {
      onSubjectClick?.(results.subjects[index - currentIndex]);
      setIsOpen(false);
      setQuery('');
      return;
    }
    currentIndex += results.subjects?.length || 0;

    // Check materials
    if (results.materials && index < currentIndex + results.materials.length) {
      onMaterialClick?.(results.materials[index - currentIndex]);
      setIsOpen(false);
      setQuery('');
      return;
    }
    currentIndex += results.materials?.length || 0;

    // Check posts
    if (results.posts && index < currentIndex + results.posts.length) {
      onPostClick?.(results.posts[index - currentIndex]);
      setIsOpen(false);
      setQuery('');
      return;
    }
  };

  const hasResults =
    results &&
    ((results.categories?.length || 0) > 0 ||
      (results.subjects?.length || 0) > 0 ||
      (results.materials?.length || 0) > 0 ||
      (results.posts?.length || 0) > 0);

  return (
    <div className={`relative ${className}`}>
      {/* Modern Search Container - Mobile First */}
      <div className="relative group">
        {/* Animated Gradient Border - Shows on focus */}
        <motion.div 
          className="absolute -inset-0.5 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(90deg, #ff6b35, #a855f7, #3b82f6, #06b6d4)',
            backgroundSize: '300% 100%',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Search Input Container */}
        <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg group-focus-within:shadow-2xl transition-shadow duration-300">
          {/* Search Icon - Left Side */}
          <div className="absolute left-3 md:left-4 flex items-center pointer-events-none">
            <motion.div
              animate={isSearching ? { rotate: 360 } : {}}
              transition={isSearching ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
            >
              <svg 
                className="w-5 h-5 md:w-6 md:h-6 text-gray-400 dark:text-gray-500" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </motion.div>
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            style={{ fontSize: '16px' }}
            className="w-full pl-11 md:pl-14 pr-10 md:pr-12 py-3.5 md:py-4 bg-transparent border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls="search-results"
            aria-autocomplete="list"
          />

          {/* Clear Button (X) - Shows when there's text */}
          <AnimatePresence>
            {query.length > 0 && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                onClick={() => {
                  setQuery('');
                  setIsOpen(false);
                  setSelectedIndex(-1);
                  inputRef.current?.focus();
                }}
                className="absolute right-3 md:right-4 p-1.5 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="مسح البحث"
              >
                <svg 
                  className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-300" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results Dropdown - Spotlight Style */}
      <AnimatePresence>
        {isOpen && query.length >= 2 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute z-50 w-full mt-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
            id="search-results"
            role="listbox"
          >
            {hasResults ? (
              <div className="max-h-[75vh] md:max-h-[500px] overflow-hidden flex flex-col">
                {/* Smart Filters Bar - Spotlight Style */}
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="sticky top-0 z-10 px-3 py-3 bg-gradient-to-r from-gray-50/90 via-white/90 to-gray-50/90 dark:from-gray-800/90 dark:via-gray-900/90 dark:to-gray-800/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {/* All Filter */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveFilter('all')}
                      className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                        activeFilter === 'all'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>✨</span>
                        <span>{nameKey === 'nameAr' ? 'الكل' : 'All'}</span>
                        <span className="text-xs opacity-75">({(results.categories?.length || 0) + (results.subjects?.length || 0) + (results.materials?.length || 0) + (results.posts?.length || 0)})</span>
                      </span>
                    </motion.button>

                    {/* Categories Filter */}
                    {results.categories && results.categories.length > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveFilter('categories')}
                        className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                          activeFilter === 'categories'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>📚</span>
                          <span>{labels.categories}</span>
                          <span className="text-xs opacity-75">({results.categories.length})</span>
                        </span>
                      </motion.button>
                    )}

                    {/* Subjects Filter */}
                    {results.subjects && results.subjects.length > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveFilter('subjects')}
                        className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                          activeFilter === 'subjects'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>📖</span>
                          <span>{labels.subjects}</span>
                          <span className="text-xs opacity-75">({results.subjects.length})</span>
                        </span>
                      </motion.button>
                    )}

                    {/* Materials Filter */}
                    {results.materials && results.materials.length > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveFilter('materials')}
                        className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                          activeFilter === 'materials'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>📄</span>
                          <span>{labels.materials}</span>
                          <span className="text-xs opacity-75">({results.materials.length})</span>
                        </span>
                      </motion.button>
                    )}

                    {/* Posts Filter */}
                    {results.posts && results.posts.length > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveFilter('posts')}
                        className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                          activeFilter === 'posts'
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>🔗</span>
                          <span>{labels.posts || 'Links'}</span>
                          <span className="text-xs opacity-75">({results.posts.length})</span>
                        </span>
                      </motion.button>
                    )}
                  </div>
                </motion.div>

                {/* Results Container with Scroll */}
                <div className="overflow-y-auto search-results-container">
              <>
                {/* Smart Suggestions Bar */}
                {suggestions && suggestions.length > 0 && (
                  <div className="mx-2 mt-2 mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
                    <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                      💡 {nameKey === 'nameAr' ? 'اقتراحات:' : 'Suggestions:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(suggestion);
                            search(suggestion);
                          }}
                          className="px-3 py-1 bg-white dark:bg-gray-800 text-yellow-700 dark:text-yellow-300 rounded-full text-xs hover:bg-yellow-100 dark:hover:bg-gray-700 transition-colors border border-yellow-300 dark:border-yellow-600"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories - Spotlight Style */}
                {results.categories && results.categories.length > 0 && (activeFilter === 'all' || activeFilter === 'categories') && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="py-3 px-3"
                  >
                    {activeFilter === 'all' && (
                      <div className="px-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-blue-500"></div>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                            {nameKey === 'nameAr' ? 'التخصصات الجامعية' : 'University Majors'}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      {results.categories.map((category, index) => (
                        <motion.button
                          key={category.$id}
                          ref={selectedIndex === index ? selectedItemRef : null}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.03 * index, type: "spring", stiffness: 400, damping: 30 }}
                          whileHover={{ x: 6 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            onCategoryClick?.(category);
                            setIsOpen(false);
                            setQuery('');
                          }}
                          className={`group relative w-full px-3 py-2.5 rounded-xl text-left transition-all duration-300 overflow-hidden ${
                            selectedIndex === index 
                              ? 'bg-gradient-to-br from-blue-500/15 via-blue-400/10 to-purple-500/15 dark:from-blue-500/25 dark:via-blue-400/15 dark:to-purple-500/25 shadow-lg border border-blue-300/50 dark:border-blue-600/50' 
                              : 'bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700/50 dark:hover:to-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                          }`}
                          role="option"
                          aria-selected={selectedIndex === index}
                        >
                          {/* Gradient Shine Effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.6 }}
                          />
                          
                          <div className="relative flex items-center gap-3">
                            <motion.div 
                              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                              transition={{ duration: 0.5 }}
                              className="text-2xl flex-shrink-0"
                            >
                              {category.icon || '🎓'}
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm md:text-base font-bold text-gray-900 dark:text-white truncate mb-0.5">
                                {category[nameKey]}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-[9px] font-semibold text-blue-700 dark:text-blue-400">
                                  {nameKey === 'nameAr' ? 'تخصص' : 'Major'}
                                </span>
                              </div>
                            </div>
                            <motion.div
                              className="flex-shrink-0"
                              animate={{ 
                                x: selectedIndex === index ? [0, 4, 0] : 0,
                                opacity: selectedIndex === index ? 1 : [0, 1, 0]
                              }}
                              transition={{ 
                                repeat: selectedIndex === index ? Infinity : 0, 
                                duration: 1.5,
                                ease: "easeInOut"
                              }}
                            >
                              <div className="w-6 h-6 rounded-full bg-blue-500/20 dark:bg-blue-500/30 flex items-center justify-center group-hover:bg-blue-500 dark:group-hover:bg-blue-600 transition-colors">
                                <span className="text-blue-600 dark:text-blue-400 group-hover:text-white text-sm">›</span>
                              </div>
                            </motion.div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Subjects - Spotlight Style */}
                {results.subjects && results.subjects.length > 0 && (activeFilter === 'all' || activeFilter === 'subjects') && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="py-3 px-3"
                  >
                    {activeFilter === 'all' && (
                      <div className="px-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-purple-500"></div>
                          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                            {nameKey === 'nameAr' ? 'المواد الدراسية' : 'Subjects'}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      {results.subjects.map((subject, index) => {
                        const globalIndex = (results.categories?.length || 0) + index;
                        return (
                          <motion.button
                            key={subject.$id}
                            ref={selectedIndex === globalIndex ? selectedItemRef : null}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.03 * index, type: "spring", stiffness: 400, damping: 30 }}
                            whileHover={{ x: 6 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              onSubjectClick?.(subject);
                              setIsOpen(false);
                              setQuery('');
                            }}
                            className={`group relative w-full px-3 py-2.5 rounded-xl text-left transition-all duration-300 overflow-hidden ${
                              selectedIndex === globalIndex
                                ? 'bg-gradient-to-br from-purple-500/15 via-purple-400/10 to-pink-500/15 dark:from-purple-500/25 dark:via-purple-400/15 dark:to-pink-500/25 shadow-lg border border-purple-300/50 dark:border-purple-600/50'
                                : 'bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700/50 dark:hover:to-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                            }`}
                            role="option"
                            aria-selected={selectedIndex === globalIndex}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                              initial={{ x: '-100%' }}
                              whileHover={{ x: '100%' }}
                              transition={{ duration: 0.6 }}
                            />
                            
                            <div className="relative flex items-center gap-3">
                              <motion.div 
                                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                                className="text-2xl flex-shrink-0"
                              >
                                📖
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm md:text-base font-bold text-gray-900 dark:text-white truncate mb-0.5">
                                  {subject[nameKey]}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-[9px] font-semibold text-purple-700 dark:text-purple-400">
                                    {nameKey === 'nameAr' ? 'مادة' : 'Subject'}
                                  </span>
                                </div>
                              </div>
                              <motion.div
                                className="flex-shrink-0"
                                animate={{ 
                                  x: selectedIndex === globalIndex ? [0, 4, 0] : 0,
                                  opacity: selectedIndex === globalIndex ? 1 : [0, 1, 0]
                                }}
                                transition={{ 
                                  repeat: selectedIndex === globalIndex ? Infinity : 0, 
                                  duration: 1.5,
                                  ease: "easeInOut"
                                }}
                              >
                                <div className="w-6 h-6 rounded-full bg-purple-500/20 dark:bg-purple-500/30 flex items-center justify-center group-hover:bg-purple-500 dark:group-hover:bg-purple-600 transition-colors">
                                  <span className="text-purple-600 dark:text-purple-400 group-hover:text-white text-sm">›</span>
                                </div>
                              </motion.div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Materials - Spotlight Style */}
                {results.materials && results.materials.length > 0 && (activeFilter === 'all' || activeFilter === 'materials') && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    className="py-3 px-3"
                  >
                    {activeFilter === 'all' && (
                      <div className="px-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-green-500"></div>
                          <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
                            {nameKey === 'nameAr' ? 'الملفات' : 'Files'}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      {results.materials.map((material, index) => {
                        const globalIndex = (results.categories?.length || 0) + (results.subjects?.length || 0) + index;
                        return (
                          <motion.button
                            key={material.$id}
                            ref={selectedIndex === globalIndex ? selectedItemRef : null}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.03 * index, type: "spring", stiffness: 400, damping: 30 }}
                            whileHover={{ x: 6 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              onMaterialClick?.(material);
                              setIsOpen(false);
                              setQuery('');
                            }}
                            className={`group relative w-full px-3 py-2.5 rounded-xl text-left transition-all duration-300 overflow-hidden ${
                              selectedIndex === globalIndex
                                ? 'bg-gradient-to-br from-green-500/15 via-green-400/10 to-emerald-500/15 dark:from-green-500/25 dark:via-green-400/15 dark:to-emerald-500/25 shadow-lg border border-green-300/50 dark:border-green-600/50'
                                : 'bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700/50 dark:hover:to-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                            }`}
                            role="option"
                            aria-selected={selectedIndex === globalIndex}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                              initial={{ x: '-100%' }}
                              whileHover={{ x: '100%' }}
                              transition={{ duration: 0.6 }}
                            />
                            
                            <div className="relative flex items-center gap-3">
                              <motion.div 
                                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                                className="text-2xl flex-shrink-0"
                              >
                                {(material as any).fileType?.icon || '📄'}
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm md:text-base font-bold text-gray-900 dark:text-white truncate mb-0.5">
                                  {material.title}
                                </p>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/40 text-[9px] font-semibold text-green-700 dark:text-green-400">
                                    {(material as any).fileType?.[nameKey] || (nameKey === 'nameAr' ? 'ملف' : 'File')}
                                  </span>
                                  {(material as any).subject && (
                                    <>
                                      <span className="text-[9px] text-gray-400 dark:text-gray-500">•</span>
                                      <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                                        {(material as any).subject[nameKey]}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <motion.div
                                className="flex-shrink-0"
                                animate={{ 
                                  x: selectedIndex === globalIndex ? [0, 4, 0] : 0,
                                  opacity: selectedIndex === globalIndex ? 1 : [0, 1, 0]
                                }}
                                transition={{ 
                                  repeat: selectedIndex === globalIndex ? Infinity : 0, 
                                  duration: 1.5,
                                  ease: "easeInOut"
                                }}
                              >
                                <div className="w-6 h-6 rounded-full bg-green-500/20 dark:bg-green-500/30 flex items-center justify-center group-hover:bg-green-500 dark:group-hover:bg-green-600 transition-colors">
                                  <span className="text-green-600 dark:text-green-400 group-hover:text-white text-sm">›</span>
                                </div>
                              </motion.div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Posts - Spotlight Style */}
                {results.posts && results.posts.length > 0 && (activeFilter === 'all' || activeFilter === 'posts') && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="py-3 px-3"
                  >
                    {activeFilter === 'all' && (
                      <div className="px-2 mb-2">
                        <span className="text-[10px] md:text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">
                          {labels.posts || 'Links'}
                        </span>
                      </div>
                    )}
                    <div className="space-y-1">
                      {results.posts.map((post, index) => {
                        const globalIndex = (results.categories?.length || 0) + (results.subjects?.length || 0) + (results.materials?.length || 0) + index;
                        return (
                          <motion.button
                            key={post.$id}
                            ref={selectedIndex === globalIndex ? selectedItemRef : null}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * index }}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              onPostClick?.(post);
                              setIsOpen(false);
                              setQuery('');
                            }}
                            className={`group w-full px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                              selectedIndex === globalIndex
                                ? 'bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 shadow-md'
                                : 'hover:bg-gray-100/80 dark:hover:bg-gray-800/80'
                            }`}
                            role="option"
                            aria-selected={selectedIndex === globalIndex}
                          >
                            <div className="flex items-center gap-3">
                              <motion.div 
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                className="text-2xl md:text-3xl flex-shrink-0"
                              >
                                🔗
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white truncate">
                                  {post.contentText?.substring(0, 50) || post.linkURL || 'Link'}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                  {(post as any).subject && (
                                    <>
                                      <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[100px]">
                                        {(post as any).subject[nameKey]}
                                      </span>
                                      {(post as any).uploaderName && <span className="text-[9px] text-gray-400 dark:text-gray-500">•</span>}
                                    </>
                                  )}
                                  {(post as any).uploaderName && (
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[80px]">
                                      {(post as any).uploaderName}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <motion.span 
                                className="text-orange-500 dark:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                animate={{ x: selectedIndex === globalIndex ? [0, 4, 0] : 0 }}
                                transition={{ repeat: selectedIndex === globalIndex ? Infinity : 0, duration: 1 }}
                              >
                                →
                              </motion.span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </>
            </div>
          </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="px-4 py-12 text-center"
              >
                {isSearching ? (
                  <div className="flex flex-col items-center gap-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
                    />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      {nameKey === 'nameAr' ? 'جاري البحث...' : 'Searching...'}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="text-6xl"
                    >
                      🔍
                    </motion.div>
                    <div>
                      <p className="text-gray-900 dark:text-white font-semibold text-lg mb-1">
                        {labels.noResults}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {nameKey === 'nameAr' ? 'جرّب كلمات أخرى' : 'Try different keywords'}
                      </p>
                    </div>
                    {/* Smart Suggestions */}
                    {suggestions && suggestions.length > 0 && (
                      <div className="mt-4 w-full">
                        <p className="text-sm mb-3 text-gray-700 dark:text-gray-300 font-medium">
                          💡 {nameKey === 'nameAr' ? 'هل تقصد:' : 'Did you mean:'}
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {suggestions.map((suggestion: string, index: number) => (
                            <motion.button
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.05 * index }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setQuery(suggestion);
                                search(suggestion);
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-medium hover:shadow-md transition-all border border-blue-200 dark:border-blue-700"
                            >
                              {suggestion}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
