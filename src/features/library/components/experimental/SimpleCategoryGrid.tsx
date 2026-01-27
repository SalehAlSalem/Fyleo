/**
 * SimpleCategoryGrid - Clean Studocu-inspired Design
 * Simple, professional, mobile-first
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { Category } from '../../../../types/database';

interface SimpleCategoryGridProps {
  categories: (Category & { subjectsCount: number })[];
  onCategoryClick: (category: Category) => void;
  nameKey: 'nameEn' | 'nameAr';
  descriptionKey: 'descriptionEn' | 'descriptionAr';
}

export const SimpleCategoryGrid: React.FC<SimpleCategoryGridProps> = ({
  categories,
  onCategoryClick,
  nameKey,
  descriptionKey,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {categories.map((category, index) => (
        <motion.button
          key={category.$id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCategoryClick(category)}
          className="group relative text-left bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 p-6 transition-all hover:shadow-2xl overflow-hidden"
        >
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
          
          {/* Icon with Glow */}
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/40 to-purple-400/40 rounded-full blur-2xl group-hover:blur-3xl group-hover:from-blue-400/60 group-hover:to-purple-400/60 transition-all duration-500 scale-150"></div>
            <div className="relative text-5xl transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300">
              {category.icon}
            </div>
          </div>

          {/* Title */}
          <h3 className="relative text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {category[nameKey]}
          </h3>

          {/* Description */}
          {category[descriptionKey] && (
            <p className="relative text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {category[descriptionKey]}
            </p>
          )}

          {/* Subjects Count - Animated Badge */}
          <div className="relative flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-semibold w-fit transform group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
            <span className="transform group-hover:scale-125 transition-transform duration-300">📚</span>
            <motion.span
              key={category.subjectsCount}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="tabular-nums"
            >
              {category.subjectsCount}
            </motion.span>
            <span>subjects</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default SimpleCategoryGrid;
