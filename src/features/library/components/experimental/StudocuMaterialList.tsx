/**
 * StudocuMaterialList - Studocu-inspired Material List
 * Clean list view with thumbnails and metadata
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { Material } from '../../../../types/database';

interface StudocuMaterialListProps {
  materials: Material[];
  onPreview: (material: Material) => void;
  onDownload?: (material: Material) => void;
  onBookmark?: (materialId: string) => void;
  bookmarkedIds: Set<string>;
  viewMode: 'grid' | 'list' | 'compact';
}

export const StudocuMaterialList: React.FC<StudocuMaterialListProps> = ({
  materials,
  onPreview,
  onDownload,
  onBookmark,
  bookmarkedIds,
  viewMode,
}) => {
  // Get file icon
  const getFileIcon = (material: Material) => {
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
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((material, index) => (
          <motion.div
            key={material.$id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="group relative bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          >
            {/* Gradient Glow on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
            
            {/* Header */}
            <div className="relative p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3">
                {/* Icon with Glow */}
                <div className="relative text-4xl flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-xl group-hover:blur-2xl group-hover:from-blue-400/50 group-hover:to-purple-400/50 transition-all duration-500"></div>
                  <div className="relative transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {getFileIcon(material)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {material.title || material.fileName}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <span className="transform group-hover:scale-105 transition-transform duration-300">
                      🕒 {formatDate(material.$createdAt)}
                    </span>
                    <span>•</span>
                    <span className="font-semibold transform group-hover:scale-105 transition-transform duration-300">
                      📦 {formatSize(material.fileSize || 0)}
                    </span>
                  </p>
                </div>
                
                {onBookmark && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookmark(material.$id);
                    }}
                    className="text-xl transform hover:scale-125 active:scale-95 transition-transform duration-200"
                  >
                    {bookmarkedIds.has(material.$id) ? '⭐' : '☆'}
                  </button>
                )}
              </div>
            </div>

            {/* Body */}
            {material.description && (
              <div className="relative p-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {material.description}
                </p>
                
                {/* Metadata Badges */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {(material as any).fileType && (
                    <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 rounded-md text-xs font-medium transform group-hover:scale-105 transition-transform duration-300">
                      {(material as any).fileType.nameEn || (material as any).fileType.nameAr}
                    </span>
                  )}
                  
                  {material.downloads > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-300 rounded-md text-xs font-bold transform group-hover:scale-110 transition-all duration-300">
                      ⬇️
                      <motion.span
                        key={material.downloads}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="tabular-nums"
                      >
                        {material.downloads}
                      </motion.span>
                    </span>
                  )}
                  
                  {material.uploader?.name && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium transform group-hover:translate-x-1 transition-transform duration-300">
                      👤 {material.uploader.name}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="relative p-3 bg-gray-50 dark:bg-gray-900/50 flex gap-2">
              <button
                onClick={() => onPreview(material)}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                Preview
              </button>
              {onDownload && (
                <button
                  onClick={() => onDownload(material)}
                  className="px-3 py-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-900 dark:text-white text-sm font-medium rounded-lg transform hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                >
                  ⬇️
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // List & Compact Views
  return (
    <div className="space-y-2">
      {materials.map((material, index) => (
        <motion.div
          key={material.$id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.02 }}
          className="group relative bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all overflow-hidden"
        >
          {/* Animated Gradient Background on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 transition-all duration-300"></div>
          
          <div className={`relative flex items-center gap-4 ${viewMode === 'list' ? 'p-4' : 'p-3'}`}>
            {/* Icon with Animated Glow */}
            <div className={`relative flex-shrink-0 ${viewMode === 'list' ? 'text-5xl' : 'text-3xl'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl group-hover:blur-2xl group-hover:from-blue-400/40 group-hover:to-purple-400/40 transition-all duration-500"></div>
              <div className="relative transform group-hover:scale-110 transition-transform duration-300">
                {getFileIcon(material)}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 ${viewMode === 'list' ? 'text-base mb-1' : 'text-sm'}`}>
                {material.title || material.fileName}
              </h3>
              
              {viewMode === 'list' && material.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
                  {material.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                {/* Animated Date */}
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                  🕒 {formatDate(material.$createdAt)}
                </span>
                
                <span>•</span>
                
                {/* Animated Size */}
                <span className="transform group-hover:scale-105 transition-transform duration-300 font-semibold">
                  📦 {formatSize(material.fileSize || 0)}
                </span>
                
                {material.uploader && (
                  <>
                    <span>•</span>
                    <span className="truncate max-w-[120px] transform group-hover:translate-x-1 transition-transform duration-300">
                      👤 {material.uploader.name}
                    </span>
                  </>
                )}
                
                {/* Animated Downloads Count */}
                {material.downloads > 0 && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 font-bold text-green-600 dark:text-green-400 transform group-hover:scale-110 transition-all duration-300">
                      ⬇️
                      <motion.span
                        key={material.downloads}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="tabular-nums"
                      >
                        {material.downloads}
                      </motion.span>
                    </span>
                  </>
                )}
                {(material as any).fileType && (
                  <>
                    <span>•</span>
                    <span className="px-2 py-0.5 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 rounded-md transform group-hover:scale-105 transition-transform duration-300 font-medium">
                      {(material as any).fileType.nameEn || (material as any).fileType.nameAr}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {onBookmark && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookmark(material.$id);
                  }}
                  className="text-xl transform hover:scale-125 active:scale-95 transition-transform duration-200"
                >
                  {bookmarkedIds.has(material.$id) ? '⭐' : '☆'}
                </button>
              )}
              
              <button
                onClick={() => onPreview(material)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg transform hover:scale-105 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
              >
                View
              </button>
              
              {onDownload && (
                <button
                  onClick={() => onDownload(material)}
                  className="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
                >
                  ⬇️
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StudocuMaterialList;
