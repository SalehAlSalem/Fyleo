/**
 * MaterialCardCompact - Simple, Clean, Mobile-First Design
 * Responsive card with all essential features
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { Material } from '../../../../types/database';

interface MaterialCardCompactProps {
  material: Material;
  onPreview: (material: Material) => void;
  onDownload?: (material: Material) => void;
  onBookmark?: (materialId: string) => void;
  isBookmarked: boolean;
  labels: {
    preview: string;
    download: string;
    bookmark: string;
    bookmarked: string;
    fileSize: string;
    date: string;
  };
}

export const MaterialCardCompact: React.FC<MaterialCardCompactProps> = ({
  material,
  onPreview,
  onDownload,
  onBookmark,
  isBookmarked,
  labels,
}) => {
  // Get file icon
  const getFileIcon = () => {
    const fileType = (material as any).fileType;
    if (fileType?.icon) return fileType.icon;
    
    const mime = material.mimeType?.toLowerCase() || '';
    if (mime.includes('pdf')) return '📄';
    if (mime.includes('word')) return '📝';
    if (mime.includes('powerpoint')) return '📊';
    if (mime.includes('excel')) return '📈';
    if (mime.includes('image')) return '🖼️';
    if (mime.includes('video')) return '🎥';
    return '📄';
  };

  // Format file size
  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
    >
      {/* Header with Icon & Title */}
      <div className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-5xl flex-shrink-0">
            {getFileIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-2">
              {material.title || material.fileName}
            </h3>
            {material.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {material.description}
              </p>
            )}
          </div>
          {onBookmark && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmark(material.$id);
              }}
              className="flex-shrink-0 text-2xl hover:scale-110 transition-transform"
            >
              {isBookmarked ? '⭐' : '☆'}
            </button>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1.5">
            <span>📦</span>
            <span>{formatSize(material.fileSize || 0)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>📅</span>
            <span>{formatDate(material.$createdAt)}</span>
          </div>
          {material.uploader && (
            <div className="flex items-center gap-1.5">
              <span>👤</span>
              <span className="truncate max-w-[150px]">{material.uploader.name}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onPreview(material)}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>👁️</span>
            <span className="hidden sm:inline">{labels.preview}</span>
          </button>
          
          {onDownload && (
            <button
              onClick={() => onDownload(material)}
              className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>⬇️</span>
              <span className="hidden sm:inline">{labels.download}</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer Badge */}
      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400 truncate flex-1">
            {material.fileName}
          </span>
          {(material as any).fileType && (
            <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-md font-medium">
              {(material as any).fileType.nameEn || (material as any).fileType.nameAr}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MaterialCardCompact;
