/**
 * CollapsibleGroup Component
 * Expandable group header for grouped content
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CollapsibleGroupProps {
  groupName: string;
  groupIcon: string;
  itemCount: number;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const CollapsibleGroup: React.FC<CollapsibleGroupProps> = ({
  groupName,
  groupIcon,
  itemCount,
  children,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-6">
      {/* Group Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md group"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{groupIcon}</span>
          <div className="text-right">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {groupName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {itemCount} {itemCount === 1 ? 'عنصر' : 'عناصر'}
            </p>
          </div>
        </div>

        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* Group Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
