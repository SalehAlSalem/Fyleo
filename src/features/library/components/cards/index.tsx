/**
 * Card Style Preview & Switcher
 * Preview all 3 card designs side-by-side
 * Quick switching between styles
 */

import React, { useState } from 'react';
import { MaterialCardMinimal } from './MaterialCardMinimal';
import { MaterialCardGlass } from './MaterialCardGlass';
import { MaterialCardGradient } from './MaterialCardGradient';
import type { Material } from '../../../../types/database';

export type CardStyle = 'minimal' | 'glass' | 'gradient';

interface CardStyleSwitcherProps {
  material: Material;
  onPreview?: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  labels: any;
  defaultStyle?: CardStyle;
}

export const CardStyleSwitcher: React.FC<CardStyleSwitcherProps> = ({
  material,
  onPreview,
  onBookmark,
  isBookmarked,
  labels,
  defaultStyle = 'glass' // Default to glassmorphic
}) => {
  const [currentStyle, setCurrentStyle] = useState<CardStyle>(defaultStyle);

  const renderCard = () => {
    switch (currentStyle) {
      case 'minimal':
        return (
          <MaterialCardMinimal
            material={material}
            onPreview={onPreview}
            onBookmark={onBookmark}
            isBookmarked={isBookmarked}
            labels={labels}
          />
        );
      case 'glass':
        return (
          <MaterialCardGlass
            material={material}
            onPreview={onPreview}
            onBookmark={onBookmark}
            isBookmarked={isBookmarked}
            labels={labels}
          />
        );
      case 'gradient':
        return (
          <MaterialCardGradient
            material={material}
            onPreview={onPreview}
            onBookmark={onBookmark}
            isBookmarked={isBookmarked}
            labels={labels}
          />
        );
    }
  };

  return (
    <div className="relative">
      {/* Style Selector - Floating */}
      <div className="absolute -top-12 left-0 flex gap-2 z-50">
        <button
          onClick={() => setCurrentStyle('minimal')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            currentStyle === 'minimal'
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-lg'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          🎯 Minimal
        </button>
        <button
          onClick={() => setCurrentStyle('glass')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            currentStyle === 'glass'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          💎 Glass
        </button>
        <button
          onClick={() => setCurrentStyle('gradient')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            currentStyle === 'gradient'
              ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          🌈 Gradient
        </button>
      </div>

      {/* Card */}
      {renderCard()}
    </div>
  );
};

// Export all styles
export { MaterialCardMinimal } from './MaterialCardMinimal';
export { MaterialCardGlass } from './MaterialCardGlass';
export { MaterialCardGradient } from './MaterialCardGradient';
export { MaterialCardModern } from './MaterialCardModern';
