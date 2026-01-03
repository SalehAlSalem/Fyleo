/**
 * PurposeTabs Component
 * Data-driven tabs based on Educational Purposes
 * Dumb component - receives all data via props
 * Includes dynamic "All" tab to show all content
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { EducationalPurpose } from '../../../types/database';

interface PurposeTabsProps {
  purposes: EducationalPurpose[];
  activeTab: string;
  onTabChange: (purposeId: string) => void;
  nameKey: 'nameAr' | 'nameEn';
  className?: string;
  showAllTab?: boolean; // New: Show "All" tab
}

const PurposeTabs: React.FC<PurposeTabsProps> = ({
  purposes,
  activeTab,
  onTabChange,
  nameKey,
  className = '',
  showAllTab = false,
}) => {
  const { t } = useTranslation();

  // Create "All" tab object
  const allTab = {
    $id: 'all',
    nameAr: 'الكل',
    nameEn: 'All',
    icon: '📚',
  };

  // Prepend "All" tab if enabled
  const allTabs = showAllTab ? [allTab, ...purposes] : purposes;

  const handleKeyDown = (e: React.KeyboardEvent, _purposeId: string, index: number) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (index > 0) {
          onTabChange(allTabs[index - 1].$id);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (index < allTabs.length - 1) {
          onTabChange(allTabs[index + 1].$id);
        }
        break;
      case 'Home':
        e.preventDefault();
        onTabChange(allTabs[0].$id);
        break;
      case 'End':
        e.preventDefault();
        onTabChange(allTabs[allTabs.length - 1].$id);
        break;
    }
  };

  if (!purposes || purposes.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <div
        className="flex flex-col md:flex-row gap-2 md:overflow-x-auto pb-2 scrollbar-hide"
        role="tablist"
        aria-label="Educational Purposes"
      >
        {allTabs.map((purpose, index) => {
          const isActive = purpose.$id === activeTab;
          
          return (
            <button
              key={purpose.$id}
              onClick={() => onTabChange(purpose.$id)}
              onKeyDown={(e) => handleKeyDown(e, purpose.$id, index)}
              className={`relative px-4 py-3 md:px-6 md:py-3 rounded-xl font-semibold text-sm md:whitespace-nowrap transition-all ${
                isActive
                  ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${purpose.$id}`}
              tabIndex={isActive ? 0 : -1}
            >
              {purpose.icon && <span className="mr-2">{purpose.icon}</span>}
              {purpose[nameKey]}
              
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PurposeTabs;
