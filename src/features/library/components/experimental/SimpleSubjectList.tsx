/**
 * SimpleSubjectList - Clean Studocu-inspired Design
 * List view with clear information
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { Subject } from '../../../../types/database';

interface SimpleSubjectListProps {
  subjects: Subject[];
  onSubjectClick: (subject: Subject) => void;
  nameKey: 'nameEn' | 'nameAr';
  descriptionKey: 'descriptionEn' | 'descriptionAr';
}

export const SimpleSubjectList: React.FC<SimpleSubjectListProps> = ({
  subjects,
  onSubjectClick,
  nameKey,
  descriptionKey,
}) => {
  return (
    <div className="space-y-3">
      {subjects.map((subject, index) => (
        <motion.button
          key={subject.$id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03, type: "spring", stiffness: 120 }}
          whileHover={{ scale: 1.01, x: 4 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSubjectClick(subject)}
          className="relative w-full text-left group bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 p-5 transition-all hover:shadow-2xl overflow-hidden"
        >
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500"></div>
          <div className="relative flex items-start justify-between gap-4">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {subject[nameKey]}
              </h3>
              
              {subject[descriptionKey] && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 transform group-hover:translate-x-1 transition-transform duration-300">
                  {subject[descriptionKey]}
                </p>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {subject.level && (
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-800 dark:text-blue-300 rounded-full font-semibold shadow-sm group-hover:shadow-md transition-all duration-300"
                  >
                    <span className="transform group-hover:scale-125 transition-transform duration-300">📊</span>
                    <span>Level {subject.level}</span>
                  </motion.span>
                )}
                
                {subject.creditHours && (
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 text-purple-800 dark:text-purple-300 rounded-full font-semibold shadow-sm group-hover:shadow-md transition-all duration-300"
                  >
                    <span className="transform group-hover:scale-125 transition-transform duration-300">⏱️</span>
                    <span>{subject.creditHours} Credits</span>
                  </motion.span>
                )}

                {subject.prerequisite && (
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-800 dark:text-orange-300 rounded-full font-semibold shadow-sm group-hover:shadow-md transition-all duration-300"
                  >
                    <span className="transform group-hover:scale-125 transition-transform duration-300">⚠️</span>
                    <span>Has Prerequisites</span>
                  </motion.span>
                )}
              </div>
            </div>

            {/* Arrow Icon */}
            <div className="relative flex-shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
              <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl group-hover:blur-2xl group-hover:bg-blue-400/40 transition-all duration-500"></div>
              <svg className="relative w-6 h-6 transform group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default SimpleSubjectList;
