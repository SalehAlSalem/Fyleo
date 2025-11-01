/**
 * SearchBar Component
 * Spotlight-style search with dropdown results
 * Dumb component - receives search results via props
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Category, Subject, Material } from '../../../types/database';

interface Post {
  $id: string;
  contentText?: string;
  linkURL?: string;
  $createdAt: string;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  results?: {
    categories?: Category[];
    subjects?: Subject[];
    materials?: Material[];
    posts?: Post[];
  };
  isSearching?: boolean;
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
  searchLevel: 'global' | 'category' | 'subject';
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  results,
  isSearching,
  onCategoryClick,
  onSubjectClick,
  onMaterialClick,
  onPostClick,
  placeholder,
  labels,
  nameKey,
  className = '',
  autoFocus = false,
  searchLevel: _searchLevel,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        onSearch(query);
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

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
      {/* Search Input */}
      <div className="relative">
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
          className="w-full px-4 py-3 md:px-6 md:py-4 pr-10 md:pr-12 rounded-xl md:rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 shadow-lg transition-all"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="search-results"
          aria-autocomplete="list"
        />
        <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-xl md:text-2xl">
          {isSearching ? '⏳' : '🔍'}
        </div>
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {isOpen && query.length >= 2 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-80 md:max-h-96 overflow-y-auto"
            id="search-results"
            role="listbox"
          >
            {hasResults ? (
              <>
                {/* Categories */}
                {results.categories && results.categories.length > 0 && (
                  <div className="py-2">
                    <div className="px-3 py-2 md:px-4 md:py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b-2 border-blue-200 dark:border-blue-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                          📚 {labels.categories}
                        </span>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded-full">
                          {results.categories.length}
                        </span>
                      </div>
                    </div>
                    {results.categories.map((category, index) => (
                      <button
                        key={category.$id}
                        ref={selectedIndex === index ? selectedItemRef : null}
                        onClick={() => {
                          onCategoryClick?.(category);
                          setIsOpen(false);
                          setQuery('');
                        }}
                        className={`w-full px-3 py-2 md:px-4 md:py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                          selectedIndex === index ? 'bg-blue-50 dark:bg-gray-700' : ''
                        }`}
                        role="option"
                        aria-selected={selectedIndex === index}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl md:text-2xl">{category.icon || '📚'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white truncate">
                              {category[nameKey]}
                            </p>
                          </div>
                          <span className="text-blue-600 dark:text-blue-400">→</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Subjects */}
                {results.subjects && results.subjects.length > 0 && (
                  <div className="py-2">
                    <div className="px-3 py-2 md:px-4 md:py-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b-2 border-purple-200 dark:border-purple-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                          📖 {labels.subjects}
                        </span>
                        <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 rounded-full">
                          {results.subjects.length}
                        </span>
                      </div>
                    </div>
                    {results.subjects.map((subject, index) => {
                      const globalIndex = (results.categories?.length || 0) + index;
                      return (
                        <button
                          key={subject.$id}
                          ref={selectedIndex === globalIndex ? selectedItemRef : null}
                          onClick={() => {
                            onSubjectClick?.(subject);
                            setIsOpen(false);
                            setQuery('');
                          }}
                          className={`w-full px-3 py-2 md:px-4 md:py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                            selectedIndex === globalIndex ? 'bg-blue-50 dark:bg-gray-700' : ''
                          }`}
                          role="option"
                          aria-selected={selectedIndex === globalIndex}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl md:text-2xl">📖</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white truncate">
                                {subject[nameKey]}
                              </p>
                            </div>
                            <span className="text-blue-600 dark:text-blue-400">→</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Materials */}
                {results.materials && results.materials.length > 0 && (
                  <div className="py-2">
                    <div className="px-3 py-2 md:px-4 md:py-3 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-b-2 border-green-200 dark:border-green-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm font-bold text-green-700 dark:text-green-300 uppercase tracking-wider">
                          📄 {labels.materials}
                        </span>
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">
                          {results.materials.length}
                        </span>
                      </div>
                    </div>
                    {results.materials.map((material, index) => {
                      const globalIndex =
                        (results.categories?.length || 0) +
                        (results.subjects?.length || 0) +
                        index;
                      return (
                        <button
                          key={material.$id}
                          ref={selectedIndex === globalIndex ? selectedItemRef : null}
                          onClick={() => {
                            onMaterialClick?.(material);
                            setIsOpen(false);
                            setQuery('');
                          }}
                          className={`w-full px-3 py-2 md:px-4 md:py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                            selectedIndex === globalIndex ? 'bg-blue-50 dark:bg-gray-700' : ''
                          }`}
                          role="option"
                          aria-selected={selectedIndex === globalIndex}
                        >
                          <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-xl md:text-2xl">{(material as any).fileType?.icon || '📄'}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white truncate">
                                {material.title}
                                {(material as any).subject && (
                                  <span className="text-gray-500 dark:text-gray-400 font-normal ml-1">
                                    / {(material as any).subject[nameKey]}
                                  </span>
                                )}
                              </p>
                            </div>
                            <span className="text-blue-600 dark:text-blue-400">→</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Posts */}
                {results.posts && results.posts.length > 0 && (
                  <div className="py-2">
                    <div className="px-3 py-2 md:px-4 md:py-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-b-2 border-orange-200 dark:border-orange-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wider">
                          🔗 {labels.posts || 'Links'}
                        </span>
                        <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded-full">
                          {results.posts.length}
                        </span>
                      </div>
                    </div>
                    {results.posts.map((post, index) => {
                      const globalIndex =
                        (results.categories?.length || 0) +
                        (results.subjects?.length || 0) +
                        (results.materials?.length || 0) +
                        index;
                      return (
                        <button
                          key={post.$id}
                          ref={selectedIndex === globalIndex ? selectedItemRef : null}
                          onClick={() => {
                            onPostClick?.(post);
                            setIsOpen(false);
                            setQuery('');
                          }}
                          className={`w-full px-3 py-2 md:px-4 md:py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                            selectedIndex === globalIndex ? 'bg-blue-50 dark:bg-gray-700' : ''
                          }`}
                          role="option"
                          aria-selected={selectedIndex === globalIndex}
                        >
                          <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-xl md:text-2xl">🔗</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white truncate">
                                {post.contentText?.substring(0, 50) || post.linkURL || 'Link'}
                                {(post as any).subject && (
                                  <span className="text-gray-500 dark:text-gray-400 font-normal ml-1">
                                    / {(post as any).subject[nameKey]}
                                  </span>
                                )}
                              </p>
                            </div>
                            <span className="text-blue-600 dark:text-blue-400">→</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                {isSearching ? '⏳ جاري البحث...' : labels.noResults}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
