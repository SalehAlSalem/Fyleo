/**
 * BaseCard Component - Clean & Performant Version
 * تصميم نظيف وسريع بدون تأثيرات ثقيلة
 */

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface BaseCardProps {
  header: ReactNode;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const BaseCard: React.FC<BaseCardProps> = ({
  header,
  children,
  className = '',
  onClick,
}) => {
  return (
    <motion.div
      className={`group relative bg-white dark:bg-[#1a2332] rounded-2xl shadow-md overflow-hidden border border-gray-200/80 dark:border-gray-700/50 hover:shadow-xl hover:border-purple-400/40 dark:hover:border-purple-500/40 transition-all duration-300 ${className}`}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
    >
      {/* Subtle gradient overlay on hover - NO BLUR */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-blue-500/0 to-transparent group-hover:from-purple-500/5 group-hover:via-blue-500/5 transition-all duration-300 pointer-events-none" />
      
      {/* Header Section - Clean design */}
      <div className="relative bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-850/80 p-4 border-b border-gray-200/60 dark:border-gray-700/40">
        {header}
      </div>

      {/* Content Section */}
      <div className="relative p-4">
        {children}
      </div>

      {/* Bottom accent - Simple gradient */}
      <div className="h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500" />
    </motion.div>
  );
};

export default BaseCard;
