import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { Material } from '../../../../types/database';

interface ZenLibraryProps {
  materials: Material[];
  onPreview: (material: Material) => void;
  onDownload: (material: Material) => void;
  onBookmark: (materialId: string) => void;
  bookmarkedIds: Set<string>;
}

/**
 * Zen Library - Steve Jobs Philosophy
 * "Simplicity is the ultimate sophistication"
 * 
 * ONE card at a time. Full attention. Zero distraction.
 * Swipe to explore. Tap to action. That's it.
 */
export default function ZenLibrary({
  materials,
  onPreview,
  onDownload,
  onBookmark,
  bookmarkedIds,
}: ZenLibraryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const currentMaterial = materials[currentIndex];

  const handleNext = () => {
    if (currentIndex < materials.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrevious();
  };

  // Get file icon
  const getIcon = (mimeType?: string) => {
    if (!mimeType) return '📄';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📊';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📈';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('video')) return '🎥';
    return '📄';
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  if (!currentMaterial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-xl">No materials available</p>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      {/* Progress indicator - minimal, elegant */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <span className="text-sm text-gray-400 font-light">
          {currentIndex + 1} / {materials.length}
        </span>
      </div>

      {/* Navigation arrows - invisible until hover */}
      {currentIndex > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          onClick={handlePrevious}
          className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform z-10"
        >
          ←
        </motion.button>
      )}

      {currentIndex < materials.length - 1 && (
        <motion.button
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          onClick={handleNext}
          className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform z-10"
        >
          →
        </motion.button>
      )}

      {/* The ONE card - center of attention */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentMaterial.$id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 },
          }}
          className="w-full max-w-4xl mx-auto px-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            {/* Massive icon - makes statement */}
            <div className="flex items-center justify-center h-80 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="text-[200px] filter drop-shadow-2xl"
              >
                {getIcon(currentMaterial?.mimeType)}
              </motion.div>
            </div>

            {/* Content - clean, spacious */}
            <div className="p-12">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold mb-6 text-gray-900 dark:text-white leading-tight"
              >
                {currentMaterial.title}
              </motion.h1>

              {currentMaterial.description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
                >
                  {currentMaterial.description}
                </motion.p>
              )}

              {/* Metadata - minimal, essential only */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400 mb-12"
              >
                {currentMaterial.uploader?.name && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👤</span>
                    <span>{currentMaterial.uploader.name}</span>
                  </div>
                )}
                {currentMaterial.fileType?.name && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    <span>{currentMaterial.fileType.name}</span>
                  </div>
                )}
                {currentMaterial.downloads !== undefined && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⬇️</span>
                    <span>{currentMaterial.downloads} downloads</span>
                  </div>
                )}
              </motion.div>

              {/* Actions - big, bold, unmistakable */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4"
              >
                <button
                  onClick={() => onPreview(currentMaterial)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-2xl text-xl font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Open
                </button>
                <button
                  onClick={() => onDownload(currentMaterial)}
                  className="flex-1 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white py-6 rounded-2xl text-xl font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Download
                </button>
                <button
                  onClick={() => onBookmark(currentMaterial.$id)}
                  className="px-8 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 py-6 rounded-2xl text-3xl transition-all hover:scale-110 shadow-lg"
                >
                  {bookmarkedIds.has(currentMaterial.$id) ? '⭐' : '☆'}
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Swipe hint - subtle, fades after first interaction */}
      {currentIndex === 0 && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 text-sm"
        >
          ← Use arrow keys or click arrows →
        </motion.div>
      )}
    </div>
  );
}
