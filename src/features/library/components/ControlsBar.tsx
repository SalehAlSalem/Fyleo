/**
 * ControlsBar Component
 * Compact controls for sorting, grouping, and view mode
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SortBy, SortOrder, GroupBy, ViewMode } from '../utils/contentHelpers';
import { getSortLabel, getGroupLabel } from '../utils/contentHelpers';

interface ControlsBarProps {
  sortBy: SortBy;
  sortOrder: SortOrder;
  groupBy: GroupBy;
  viewMode: ViewMode;
  onChange: (updates: Partial<{ sortBy: SortBy; sortOrder: SortOrder; groupBy: GroupBy; viewMode: ViewMode }>) => void;
  showPurposeGroup?: boolean; // Show "Purpose" option in Group By (only when activePurpose === 'all')
  isArabic?: boolean;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  sortBy,
  sortOrder,
  groupBy,
  viewMode,
  onChange,
  showPurposeGroup = false,
  isArabic = false,
}) => {
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [groupMenuOpen, setGroupMenuOpen] = useState(false);
  
  const sortRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortMenuOpen(false);
      }
      if (groupRef.current && !groupRef.current.contains(event.target as Node)) {
        setGroupMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortOptions: Array<{ value: SortBy; order: SortOrder; icon: string }> = [
    { value: 'date', order: 'desc', icon: '📅↓' },
    { value: 'date', order: 'asc', icon: '📅↑' },
    { value: 'name', order: 'asc', icon: '🔤↑' },
    { value: 'name', order: 'desc', icon: '🔤↓' },
    { value: 'size', order: 'desc', icon: '📊↓' },
    { value: 'size', order: 'asc', icon: '📊↑' },
    { value: 'downloads', order: 'desc', icon: '⭐↓' },
    { value: 'downloads', order: 'asc', icon: '⭐↑' },
  ];

  const groupOptions: Array<{ value: GroupBy; icon: string; label: { en: string; ar: string } }> = [
    { value: 'type', icon: '📂', label: { en: 'File Type', ar: 'نوع الملف' } },
    { value: 'date', icon: '📅', label: { en: 'Date', ar: 'التاريخ' } },
    { value: 'uploader', icon: '👤', label: { en: 'Uploader', ar: 'الناشر' } },
    ...(showPurposeGroup ? [{ value: 'purpose' as GroupBy, icon: '📑', label: { en: 'Purpose', ar: 'الغرض' } }] : []),
    { value: 'none', icon: '❌', label: { en: 'None', ar: 'بدون' } },
  ];

  return (
    <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
      {/* Sort & Group Controls - Mobile Responsive */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Sort Dropdown */}
        <div ref={sortRef} className="relative flex-1 sm:flex-initial">
          <button
            onClick={() => setSortMenuOpen(!sortMenuOpen)}
            className="w-full sm:w-auto px-3 sm:px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-between sm:justify-start gap-2 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors shadow-sm"
          >
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
              <span className="hidden sm:inline">📊 </span>
              {getSortLabel(sortBy, sortOrder, isArabic)}
            </span>
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${sortMenuOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {sortMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 sm:left-auto sm:right-auto sm:w-56 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
              >
              {sortOptions.map((option) => (
                <button
                  key={`${option.value}-${option.order}`}
                  onClick={() => {
                    onChange({ sortBy: option.value, sortOrder: option.order });
                    setSortMenuOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                    sortBy === option.value && sortOrder === option.order
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="text-sm font-medium">
                    {getSortLabel(option.value, option.order, isArabic)}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Group Dropdown */}
      <div ref={groupRef} className="relative flex-1 sm:flex-initial">
        <button
          onClick={() => setGroupMenuOpen(!groupMenuOpen)}
          className="w-full sm:w-auto px-3 sm:px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-between sm:justify-start gap-2 border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors shadow-sm"
        >
          <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            <span className="hidden sm:inline">📑 </span>
            {getGroupLabel(groupBy, isArabic)}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${groupMenuOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {groupMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 sm:left-auto sm:right-auto sm:w-48 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
            >
              {groupOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange({ groupBy: option.value });
                    setGroupMenuOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                    groupBy === option.value
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="text-sm font-medium">{isArabic ? option.label.ar : option.label.en}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>

      {/* View Mode Toggle - Better on Mobile */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700 flex-shrink-0">
        <button
          onClick={() => onChange({ viewMode: 'grid' })}
          className={`p-2 sm:p-2.5 rounded-lg transition-all ${
            viewMode === 'grid'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          title={isArabic ? 'شبكة' : 'Grid'}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        </button>

        <button
          onClick={() => onChange({ viewMode: 'list' })}
          className={`p-2 sm:p-2.5 rounded-lg transition-all ${
            viewMode === 'list'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          title={isArabic ? 'قائمة' : 'List'}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <button
          onClick={() => onChange({ viewMode: 'compact' })}
          className={`p-2 sm:p-2.5 rounded-lg transition-all ${
            viewMode === 'compact'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          title={isArabic ? 'مضغوط' : 'Compact'}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ControlsBar;
