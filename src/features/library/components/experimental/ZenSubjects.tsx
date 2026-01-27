import { motion } from 'framer-motion';
import type { Subject } from '../../../../types/database';

interface ZenSubjectsProps {
  subjects: Subject[];
  onSubjectClick: (subject: Subject) => void;
  nameKey: 'nameEn' | 'nameAr';
  descriptionKey: 'descriptionEn' | 'descriptionAr';
}

/**
 * Zen Subjects - Level 2
 * "Design is how it works, not how it looks"
 * 
 * Clear hierarchy. Easy navigation. Zero confusion.
 */
export default function ZenSubjects({
  subjects,
  onSubjectClick,
  nameKey,
  descriptionKey,
}: ZenSubjectsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
      <div className="max-w-6xl mx-auto px-8">
        {/* Header - clean, minimal */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Select Subject
          </h1>
          <p className="text-xl text-gray-500">
            {subjects.length} subjects available
          </p>
        </motion.div>

        {/* Subjects - card grid, generous spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {subjects.map((subject, index) => (
            <motion.button
              key={subject.$id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * 0.05,
                type: 'spring',
                stiffness: 200,
              }}
              whileHover={{ scale: 1.03, y: -8 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSubjectClick(subject)}
              className="group text-left"
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-blue-500">
                {/* Color bar - brand accent */}
                <div className="h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                <div className="p-10">
                  {/* Title - prominent */}
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {subject[nameKey]}
                  </h2>

                  {/* Description - readable */}
                  {subject[descriptionKey] && (
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed line-clamp-3">
                      {subject[descriptionKey]}
                    </p>
                  )}

                  {/* Metadata - minimal, useful */}
                  <div className="flex flex-wrap gap-4">
                    {subject.level && (
                      <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                        Level {subject.level}
                      </span>
                    )}
                    {subject.creditHours && (
                      <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                        {subject.creditHours} Credits
                      </span>
                    )}
                    {subject.prerequisite && (
                      <span className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium flex items-center gap-1">
                        <span>⚠️</span>
                        Prerequisites
                      </span>
                    )}
                  </div>
                </div>

                {/* Action indicator */}
                <div className="px-10 pb-8 flex items-center justify-end">
                  <div className="text-3xl text-gray-300 group-hover:text-blue-600 group-hover:translate-x-2 transition-all duration-300">
                    →
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
