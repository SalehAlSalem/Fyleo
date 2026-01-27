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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -8, 
        scale: 1.015
      }}
      whileTap={{ scale: 0.99 }}
      transition={{ 
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }}
      onClick={onClick}
      onMouseEnter={onHover}
      className={`group relative bg-white dark:bg-[#1a2332] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-200/70 dark:border-gray-700/50 hover:border-blue-400/50 dark:hover:border-blue-500/50 cursor-pointer transition-all duration-300 ${className}`}
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
      {/* Simple gradient overlay - NO BLUR - Lightweight */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/6 group-hover:via-purple-500/6 group-hover:to-pink-500/6 transition-all duration-300 pointer-events-none"></div>
      
      {/* Header Section */}
      <div 
        className={`relative p-6 border-b border-gray-300 dark:border-gray-700/50 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-colors duration-300 ${!headerGradient ? 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900' : ''}`}
        style={headerGradient ? {
          background: headerGradient
        } : undefined}
      >
        <div className="relative z-10">
          {header}
        </div>
      </div>

      {/* Content Section */}
      <div className="relative p-6">
        {content}
      </div>

      {/* Bottom Accent Line - Clean gradient */}
      <div 
        className="h-1 group-hover:h-1.5 transition-all duration-300"
        style={{
          background: accentColor 
            ? `linear-gradient(to right, ${accentColor}, ${accentColor}cc)`
            : defaultGradient
        }}
      />
    </motion.div>
  );
};

export default BaseCard;
