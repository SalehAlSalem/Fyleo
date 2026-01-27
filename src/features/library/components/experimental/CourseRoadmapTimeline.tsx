/**
 * CourseRoadmapTimeline - Level 2 Revolutionary Design
 * Interactive timeline/roadmap view for subjects by level
 * Inspired by learning paths and course progression
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Subject } from '../../../../types/database';

interface CourseRoadmapTimelineProps {
  subjects: Subject[];
  onSubjectClick: (subject: Subject) => void;
  nameKey: 'nameAr' | 'nameEn';
  descriptionKey: 'descriptionAr' | 'descriptionEn';
}

export const CourseRoadmapTimeline: React.FC<CourseRoadmapTimelineProps> = ({
  subjects,
  onSubjectClick,
  nameKey,
  descriptionKey,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  // Group subjects by level
  const subjectsByLevel = subjects.reduce((acc, subject) => {
    const level = subject.level || 1;
    if (!acc[level]) acc[level] = [];
    acc[level].push(subject);
    return acc;
  }, {} as Record<number, Subject[]>);

  const levels = Object.keys(subjectsByLevel)
    .map(Number)
    .sort((a, b) => a - b);

  const filteredLevels = selectedLevel 
    ? levels.filter(l => l === selectedLevel)
    : levels;

  return (
    <div className="relative py-12">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 mb-4">
          Learning Roadmap
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Follow your academic journey level by level
        </p>
      </motion.div>

      {/* Level Filter Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedLevel(null)}
          className={`px-6 py-3 rounded-full font-bold transition-all ${
            selectedLevel === null
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All Levels ({subjects.length})
        </motion.button>

        {levels.map(level => (
          <motion.button
            key={level}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedLevel(level)}
            className={`px-6 py-3 rounded-full font-bold transition-all ${
              selectedLevel === level
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Level {level} ({subjectsByLevel[level].length})
          </motion.button>
        ))}
      </div>

      {/* Roadmap Timeline */}
      <div className="max-w-6xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {filteredLevels.map((level, levelIndex) => (
            <motion.div
              key={level}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ delay: levelIndex * 0.1 }}
              className="mb-16 relative"
            >
              {/* Level Header */}
              <div className="flex items-center gap-4 mb-8">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-2xl shadow-2xl"
                >
                  L{level}
                </motion.div>
                <div>
                  <h3 className="text-3xl font-black text-gray-800 dark:text-white">
                    Level {level}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {subjectsByLevel[level].length} courses in this level
                  </p>
                </div>
              </div>

              {/* Subjects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-12">
                {subjectsByLevel[level].map((subject, index) => (
                  <motion.div
                    key={subject.$id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    onClick={() => onSubjectClick(subject)}
                    className="relative group cursor-pointer"
                  >
                    {/* Card */}
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden transition-all group-hover:shadow-2xl group-hover:border-blue-500">
                      {/* Gradient Header */}
                      <div className="h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Title */}
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
                          {subject[nameKey]}
                        </h4>

                        {/* Description */}
                        {subject[descriptionKey] && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                            {subject[descriptionKey]}
                          </p>
                        )}

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">⏱️</span>
                            <span className="text-gray-700 dark:text-gray-300 font-semibold">
                              {subject.creditHours} hrs
                            </span>
                          </div>

                          {subject.materialsCount !== undefined && (
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">📁</span>
                              <span className="text-gray-700 dark:text-gray-300 font-semibold">
                                {subject.materialsCount}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Prerequisite Badge */}
                        {subject.prerequisite && (
                          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                            <span className="text-lg">⚠️</span>
                            <span className="text-xs font-bold text-orange-700 dark:text-orange-400">
                              Has Prerequisites
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Hover Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>

                    {/* Connector Line to Next */}
                    {index < subjectsByLevel[level].length - 1 && (
                      <div className="absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600 hidden lg:block"></div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Vertical Line Connecting Levels */}
              {levelIndex < filteredLevels.length - 1 && (
                <div className="absolute left-10 -bottom-8 w-0.5 h-16 bg-gradient-to-b from-purple-500 to-transparent"></div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {subjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <span className="text-8xl mb-4 block">🎓</span>
          <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            No courses yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Courses will appear here once added
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CourseRoadmapTimeline;
