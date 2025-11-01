/**
 * CategoryCard Component
 * يرث من BaseCard ويضيف معلومات الـ Category
 */

import React from 'react';
import BaseCard from './BaseCard';
import type { Category } from '../../../types/database';

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
  onHover?: () => void;
  className?: string;
  nameKey: 'nameAr' | 'nameEn';
  descriptionKey: 'descriptionAr' | 'descriptionEn';
  subjectsLabel: string; // مثل "عدد المواد" أو "Subjects"
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onClick,
  onHover,
  className = '',
  nameKey,
  descriptionKey,
  subjectsLabel,
}) => {
  // Header Content - الأيقونة
  const headerContent = (
    <div className="flex items-center justify-center mb-3">
      <div 
        className="w-20 h-20 rounded-xl backdrop-blur-sm flex items-center justify-center text-5xl border bg-gray-200/50 dark:bg-white/10 border-gray-300 dark:border-white/20"
        style={category.color ? {
          backgroundColor: `${category.color}20`,
          borderColor: `${category.color}40`
        } : undefined}
      >
        {category.icon || '📚'}
      </div>
    </div>
  );

  // Content - العنوان، الوصف، الإحصائيات، الزر
  const contentSection = (
    <>
      {/* Title */}
      <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-3 text-center line-clamp-2 min-h-[3rem]">
        {category[nameKey]}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-center line-clamp-3 min-h-[3.75rem]">
        {category[descriptionKey] || ''}
      </p>

      {/* Badge: Subjects Count */}
      <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
        {/* Subjects Count Badge */}
        {category.subjectsCount !== undefined && (
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/30 rounded-lg px-3 py-1.5 text-center border border-blue-300 dark:border-blue-600/40 shadow-sm">
            <div className="text-blue-700 dark:text-blue-300 text-[10px] font-medium mb-0.5">📚 {subjectsLabel}</div>
            <div className="text-gray-900 dark:text-white font-bold text-sm">{category.subjectsCount}</div>
          </div>
        )}
      </div>

      {/* Status Badge */}
      {!category.isActive && (
        <div className="flex justify-center mb-4">
          <span className="px-3 py-1 rounded-full text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {nameKey === 'nameAr' ? 'غير نشط' : 'Inactive'}
          </span>
        </div>
      )}

      {/* Action Button */}
      <div className="flex">
        <button 
          className="flex-1 px-4 py-3 rounded-xl text-white font-bold text-sm text-center transition-all shadow-lg flex items-center justify-center gap-2"
          style={category.color ? {
            background: `linear-gradient(to right, ${category.color}, ${category.color}dd)`,
          } : {
            background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(37, 99, 235))'
          }}
          onMouseEnter={(e) => {
            if (category.color) {
              e.currentTarget.style.background = `linear-gradient(to right, ${category.color}ee, ${category.color}cc)`;
            }
          }}
          onMouseLeave={(e) => {
            if (category.color) {
              e.currentTarget.style.background = `linear-gradient(to right, ${category.color}, ${category.color}dd)`;
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <span>📖</span>
          <span>{nameKey === 'nameAr' ? 'عرض المواضيع' : 'View Subjects'}</span>
        </button>
      </div>
    </>
  );

  // Create gradient from category color
  const categoryGradient = category.color 
    ? `linear-gradient(135deg, ${category.color}15, ${category.color}30)`
    : undefined;
  
  const accentGradient = category.color
    ? `linear-gradient(to right, ${category.color}, ${category.color}cc)`
    : 'linear-gradient(to right, rgb(147, 51, 234), rgb(37, 99, 235), rgb(6, 182, 212))';

  return (
    <BaseCard
      header={headerContent}
      content={contentSection}
      headerGradient={categoryGradient}
      accentColor={category.color}
      defaultGradient={accentGradient}
      onClick={onClick}
      onHover={onHover}
      className={className}
      ariaLabel={category[nameKey]}
    />
  );
};

export default CategoryCard;
