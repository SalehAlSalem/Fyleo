/**
 * BaseCard Component - الكارد الأب
 * التصميم الأساسي والأبعاد المشتركة لجميع الكاردات
 * جميع الكاردات ترث من هذا الكومبوننت
 */

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface BaseCardProps {
  /** محتوى الـ Header */
  header: ReactNode;
  /** محتوى الـ Content */
  content: ReactNode;
  /** لون الشريط السفلي (gradient) */
  accentColor?: string;
  /** Gradient للـ header */
  headerGradient?: string;
  /** Gradient افتراضي إذا لم يتم تحديد لون */
  defaultGradient?: string;
  /** دالة عند الضغط على الكارد */
  onClick?: () => void;
  /** دالة عند hover */
  onHover?: () => void;
  /** className إضافي */
  className?: string;
  /** aria-label للـ accessibility */
  ariaLabel?: string;
}

const BaseCard: React.FC<BaseCardProps> = ({
  header,
  content,
  accentColor,
  headerGradient,
  defaultGradient = 'linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234), rgb(236, 72, 153))',
  onClick,
  onHover,
  className = '',
  ariaLabel,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      onMouseEnter={onHover}
      className={`relative bg-white dark:bg-[#1a2332] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700/50 cursor-pointer ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={ariaLabel}
    >
      {/* Header Section */}
      <div 
        className={`p-6 border-b border-gray-300 dark:border-gray-700/50 ${!headerGradient ? 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900' : ''}`}
        style={headerGradient ? {
          background: headerGradient
        } : undefined}
      >
        {header}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {content}
      </div>

      {/* Bottom Accent Line - الشريط الملون */}
      <div 
        className="h-1"
        style={{
          background: accentColor 
            ? `linear-gradient(to right, ${accentColor}, ${accentColor}cc)`
            : defaultGradient
        }}
      ></div>
    </motion.div>
  );
};

export default BaseCard;
