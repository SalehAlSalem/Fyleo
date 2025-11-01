/**
 * SubjectCard Component
 * يرث من BaseCard ويضيف معلومات الـ Subject
 */

import React from 'react';
import BaseCard from './BaseCard';
import type { Subject } from '../../../types/database';

interface SubjectCardProps {
  subject: Subject;
  onClick: () => void;
  onHover?: () => void;
  className?: string;
  nameKey: 'nameAr' | 'nameEn';
  descriptionKey: 'descriptionAr' | 'descriptionEn';
  creditHoursLabel: string;
  levelLabel: string;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  onClick,
  onHover,
  className = '',
  nameKey,
  descriptionKey,
  creditHoursLabel,
  levelLabel,
}) => {
  // Header Content - الأيقونة
  const headerContent = (
    <div className="flex items-center justify-center mb-3">
      <div className="w-20 h-20 rounded-xl bg-gray-200/50 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center text-5xl border border-gray-300 dark:border-white/20">
        📚
      </div>
    </div>
  );

  // Content - العنوان، الوصف، الـ Badges، الزر
  const contentSection = (
    <>
      {/* Title */}
      <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-3 text-center line-clamp-2 min-h-[3rem]">
        {subject[nameKey]}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-center line-clamp-3 min-h-[3.75rem]">
        {subject[descriptionKey] || ''}
      </p>

      {/* Badges: Level and Credit Hours */}
      <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
        {/* Level Badge */}
        {subject.level && (
          <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/30 rounded-lg px-3 py-1.5 text-center border border-green-300 dark:border-green-600/40 shadow-sm">
            <div className="text-green-700 dark:text-green-300 text-[10px] font-medium mb-0.5">📊 {levelLabel}</div>
            <div className="text-gray-900 dark:text-white font-bold text-sm">{subject.level}</div>
          </div>
        )}
        
        {/* Credit Hours Badge */}
        {subject.creditHours && (
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/30 rounded-lg px-3 py-1.5 text-center border border-purple-300 dark:border-purple-600/40 shadow-sm">
            <div className="text-purple-700 dark:text-purple-300 text-[10px] font-medium mb-0.5">⏱️ {creditHoursLabel}</div>
            <div className="text-gray-900 dark:text-white font-bold text-sm">{subject.creditHours}</div>
          </div>
        )}
      </div>

      {/* Status Badge */}
      {!subject.isActive && (
        <div className="flex justify-center mb-4">
          <span className="px-3 py-1 rounded-full text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {nameKey === 'nameAr' ? 'غير نشط' : 'Inactive'}
          </span>
        </div>
      )}

      {/* Action Button */}
      <div className="flex">
        <button 
          className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-sm text-center transition-all shadow-lg flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <span>📖</span>
          <span>{nameKey === 'nameAr' ? 'عرض المحتوى' : 'View Content'}</span>
        </button>
      </div>
    </>
  );

  return (
    <BaseCard
      header={headerContent}
      content={contentSection}
      defaultGradient="linear-gradient(to right, rgb(147, 51, 234), rgb(37, 99, 235), rgb(6, 182, 212))"
      onClick={onClick}
      onHover={onHover}
      className={className}
      ariaLabel={subject[nameKey]}
    />
  );
};

export default SubjectCard;
