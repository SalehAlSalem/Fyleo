/**
 * MaterialCard - Minimal Elegant Style 🎯
 * Ultra-clean design with sophisticated hover effects
 * Focus: Typography, spacing, subtle animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { Material } from '../../../../types/database';
// @ts-ignore
import { useAuth } from '../../../../hooks/useAuth';

interface MaterialCardMinimalProps {
  material: Material;
  onPreview?: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  labels: any;
}

const getFileIcon = (mimeType?: string): string => {
  if (!mimeType) return '📄';
  const type = mimeType.toLowerCase();
  if (type.includes('pdf')) return '📄';
  if (type.includes('word')) return '📝';
  if (type.includes('powerpoint')) return '📊';
  if (type.includes('excel')) return '📈';
  if (type.includes('image')) return '🖼️';
  if (type.includes('video')) return '🎥';
  return '📄';
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const MaterialCardMinimal: React.FC<MaterialCardMinimalProps> = ({
  material,
  onPreview,
  onBookmark,
  isBookmarked = false,
  labels
}) => {
  const { user } = useAuth();
  const icon = (material as any).fileType?.icon || getFileIcon(material.mimeType);
  const fileSize = material.fileSize ? formatFileSize(material.fileSize) : '';
  const fileExtension = material.fileName?.split('.').pop()?.toUpperCase() || 'FILE';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative h-full"
    >
      {/* Main Card */}
      <div className="h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-xl">
        
        {/* Header - Icon & Bookmark */}
        <div className="flex items-start justify-between mb-4">
          {/* File Icon - Minimal Circle */}
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          
          {/* Bookmark - Minimal */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmark?.();
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isBookmarked 
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-yellow-500'
            }`}
          >
            <span className="text-lg">{isBookmarked ? '★' : '☆'}</span>
          </button>
        </div>

        {/* Title - Clean Typography */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
          {material.title}
        </h3>

        {/* Metadata - Minimalist */}
        <div className="flex items-center gap-3 mb-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md font-medium">
            {fileExtension}
          </span>
          <span>{fileSize}</span>
        </div>

        {/* Description - Clean */}
        {material.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {material.description}
          </p>
        )}

        {/* Actions - Minimal Buttons */}
        <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onPreview}
            className="flex-1 py-2 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200"
          >
            {labels.preview}
          </button>
          <button
            onClick={() => {/* Download logic */}}
            className="py-2 px-4 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            ↓
          </button>
        </div>
      </div>

      {/* Subtle shadow effect on hover */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-100 to-transparent dark:from-gray-800 dark:to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-300 rounded-xl" />
    </motion.div>
  );
};
