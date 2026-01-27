/**
 * HexagonCategoryGrid - Level 1 Revolutionary Design
 * Honeycomb hexagonal grid for categories
 * Interactive, beautiful, and unique
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Category } from '../../../../types/database';

interface HexagonCategoryGridProps {
  categories: (Category & { subjectsCount: number })[];
  onCategoryClick: (category: Category) => void;
  nameKey: 'nameAr' | 'nameEn';
  descriptionKey: 'descriptionAr' | 'descriptionEn';
}

export const HexagonCategoryGrid: React.FC<HexagonCategoryGridProps> = ({
  categories,
  onCategoryClick,
  nameKey,
  descriptionKey,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="relative py-12">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-4">
          Explore Knowledge
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Choose your learning path from our interactive hexagonal galaxy
        </p>
      </motion.div>

      {/* Hexagon Grid Container */}
      <div className="flex flex-wrap justify-center gap-4 max-w-7xl mx-auto px-4">
        {categories.map((category, index) => {
          const isHovered = hoveredId === category.$id;
          
          return (
            <motion.div
              key={category.$id}
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: index * 0.05,
                type: 'spring',
                stiffness: 100,
                damping: 15,
              }}
              onMouseEnter={() => setHoveredId(category.$id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onCategoryClick(category)}
              className="relative cursor-pointer group"
              style={{ margin: '8px' }}
            >
              {/* Hexagon SVG */}
              <svg
                width="200"
                height="220"
                viewBox="0 0 200 220"
                className="drop-shadow-2xl"
              >
                <defs>
                  <linearGradient id={`gradient-${category.$id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={category.color || '#6366f1'} />
                    <stop offset="100%" stopColor={adjustColor(category.color || '#6366f1', -30)} />
                  </linearGradient>
                  
                  {/* Glow filter */}
                  <filter id={`glow-${category.$id}`}>
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Hexagon Shape */}
                <motion.path
                  d="M 100 10 L 175 60 L 175 160 L 100 210 L 25 160 L 25 60 Z"
                  fill={`url(#gradient-${category.$id})`}
                  stroke={isHovered ? '#ffffff' : category.color}
                  strokeWidth={isHovered ? '4' : '2'}
                  filter={isHovered ? `url(#glow-${category.$id})` : undefined}
                  initial={false}
                  animate={{
                    scale: isHovered ? 1.1 : 1,
                    rotate: isHovered ? 5 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />

                {/* Icon */}
                <foreignObject x="50" y="50" width="100" height="50">
                  <motion.div
                    className="flex items-center justify-center h-full"
                    animate={{
                      scale: isHovered ? 1.2 : 1,
                      rotate: isHovered ? 360 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-6xl">{category.icon}</span>
                  </motion.div>
                </foreignObject>

                {/* Title */}
                <foreignObject x="20" y="110" width="160" height="60">
                  <div className="flex flex-col items-center justify-center h-full px-2">
                    <p className="text-white font-bold text-center text-lg mb-1 line-clamp-2">
                      {category[nameKey]}
                    </p>
                    <p className="text-white/90 text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                      {category.subjectsCount} Subjects
                    </p>
                  </div>
                </foreignObject>
              </svg>

              {/* Hover Tooltip */}
              {isHovered && category[descriptionKey] && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 z-50 border-2 border-gray-200 dark:border-gray-700"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                    {category[descriptionKey]}
                  </p>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-t-2 border-l-2 border-gray-200 dark:border-gray-700 rotate-45"></div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HexagonCategoryGrid;

// Helper: Adjust color brightness
function adjustColor(color: string, amount: number): string {
  const clamp = (num: number) => Math.min(Math.max(num, 0), 255);
  
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Adjust brightness
  const newR = clamp(r + amount);
  const newG = clamp(g + amount);
  const newB = clamp(b + amount);
  
  // Convert back to hex
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}
