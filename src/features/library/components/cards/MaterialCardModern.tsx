/**
 * MaterialCardModern - Creative & Modern Design 🎨
 * Clean design with gradient header and all required information
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { Material } from '../../../../types/database';

interface MaterialCardModernProps {
  material: Material;
  onPreview?: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

// Helper: Get file icon emoji
const getFileIcon = (mimeType?: string): string => {
  if (!mimeType) return '📄';
  const type = mimeType.toLowerCase();
  if (type.includes('pdf')) return '📄';
  if (type.includes('word')) return '📝';
  if (type.includes('powerpoint')) return '📊';
  if (type.includes('excel')) return '📈';
  if (type.includes('image')) return '🖼️';
  if (type.includes('video')) return '🎥';
  if (type.includes('audio')) return '🎵';
  if (type.includes('zip') || type.includes('rar')) return '📦';
  return '📄';
};

// Helper: Format file size
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '—';
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${mb.toFixed(1)} MB`;
};

// Helper: Format date (Gregorian)
const formatDate = (dateString?: string): string => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Helper: Get color theme
const getTheme = (mimeType?: string) => {
  if (!mimeType) return {
    primary: '#6366f1',
    secondary: '#8b5cf6',
  };
  
  const type = mimeType.toLowerCase();
  
  if (type.includes('pdf')) return {
    primary: '#ef4444',
    secondary: '#f97316',
  };
  
  if (type.includes('word')) return {
    primary: '#3b82f6',
    secondary: '#06b6d4',
  };
  
  if (type.includes('powerpoint')) return {
    primary: '#f59e0b',
    secondary: '#fb923c',
  };
  
  if (type.includes('excel')) return {
    primary: '#10b981',
    secondary: '#14b8a6',
  };
  
  if (type.includes('image')) return {
    primary: '#ec4899',
    secondary: '#f472b6',
  };
  
  if (type.includes('video')) return {
    primary: '#8b5cf6',
    secondary: '#a78bfa',
  };
  
  return {
    primary: '#6366f1',
    secondary: '#8b5cf6',
  };
};

export const MaterialCardModern: React.FC<MaterialCardModernProps> = ({
  material,
  onPreview,
  onBookmark,
  isBookmarked = false,
}) => {
  const [isFlipped, setIsFlipped] = React.useState(false);
  
  // Get uploader name (User object)
  const uploaderName = material.uploader?.name || 'Unknown';
  
  // Get file type from database (FileType object) or fallback to mime type
  const fileTypeData = (material as any).fileType;
  const icon = fileTypeData?.icon || getFileIcon(material.mimeType);
  const fileTypeName = fileTypeData?.nameEn || fileTypeData?.name || material.fileName?.split('.').pop()?.toUpperCase() || 'FILE';
  
  // Other computed values
  const fileExtension = material.fileName?.split('.').pop()?.toUpperCase() || 'FILE';
  const fileSize = formatFileSize(material.fileSize);
  const theme = getTheme(material.mimeType);
  
  // Download count
  const [downloadCount, setDownloadCount] = React.useState<number>(0);
  
  // Load download count
  React.useEffect(() => {
    const loadDownloadCount = async () => {
      try {
        const { downloadsService } = await import('../../../../services/appwriteService');
        const count = await downloadsService.getCountByFile(material.$id);
        setDownloadCount(count);
      } catch (error) {
        console.error('Error loading download count:', error);
      }
    };
    loadDownloadCount();
  }, [material.$id]);
  
  // Handle download
  const handleDownload = async () => {
    if (!material.fileId) return;
    
    // Record download
    try {
      const { downloadsService } = await import('../../../../services/appwriteService');
      await downloadsService.create(material.$id);
      setDownloadCount(prev => prev + 1);
    } catch (error) {
      console.error('Error recording download:', error);
    }
    
    // Download file
    const downloadUrl = material.viewURL || material.downloadURL;
    if (!downloadUrl) return;
    
    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = material.fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="h-full"
      style={{ perspective: '1000px' }}
    >
      <div
        className="relative w-full h-full transition-transform duration-700 preserve-3d"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ==================== FRONT SIDE ==================== */}
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="h-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            
            {/* Header - Gradient with Icon */}
            <div 
              className="relative p-6 pb-20"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
              }}
            >
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              
              {/* Bookmark Button */}
              <div className="absolute top-4 left-4">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookmark?.();
                  }}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2.5 rounded-xl shadow-lg transition-all ${
                    isBookmarked
                      ? 'bg-yellow-400 text-white'
                      : 'bg-white/90 text-gray-600 hover:bg-yellow-400 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{isBookmarked ? '⭐' : '☆'}</span>
                </motion.button>
              </div>

              {/* File Type Badge */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                  <span className="text-xl">{icon}</span>
                  <span className="text-sm font-bold" style={{ color: theme.primary }}>
                    {fileExtension}
                  </span>
                </div>
              </div>

              {/* Large Icon */}
              <div className="flex justify-center mt-8">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="text-8xl drop-shadow-2xl"
                >
                  {icon}
                </motion.div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 -mt-16 relative z-10">
              {/* Title Card */}
              <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-4 mb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 mb-2">
                  {material.title || 'بدون عنوان'}
                </h3>
                {material.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {material.description}
                  </p>
                )}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Publisher */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                    >
                      {uploaderName.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Publisher</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {uploaderName}
                  </div>
                </div>

                {/* Date */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">📅</span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Date</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDate(material.$createdAt)}
                  </div>
                </div>

                {/* File Size */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">💾</span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Size</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {fileSize}
                  </div>
                </div>

                {/* Downloads */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">⬇️</span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Downloads</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {downloadCount}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <motion.button
                  onClick={onPreview}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                  }}
                >
                  <span className="text-lg">👁️</span>
                  <span>Preview</span>
                </motion.button>

                <motion.button
                  onClick={() => setIsFlipped(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-lg"
                >
                  <span className="text-xl">ℹ️</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== BACK SIDE ==================== */}
        <div
          className="absolute inset-0"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div 
            className="h-full rounded-2xl shadow-xl p-6 text-white overflow-auto"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">File Details</h3>
              <motion.button
                onClick={() => setIsFlipped(false)}
                whileHover={{ scale: 1.1, rotate: -180 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-xl"
              >
                <span className="text-xl">↩️</span>
              </motion.button>
            </div>

            {/* Details */}
            <div className="space-y-3">
              {/* Title */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-xs opacity-80 mb-1">Title</div>
                <div className="font-semibold">{material.title || 'Untitled'}</div>
              </div>

              {/* Description */}
              {material.description && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-xs opacity-80 mb-1">Description</div>
                  <div className="text-sm leading-relaxed">{material.description}</div>
                </div>
              )}

              {/* File Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <div className="text-xs opacity-80 mb-1">File Name</div>
                  <div className="text-sm font-medium break-all">{material.fileName}</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <div className="text-xs opacity-80 mb-1">Type</div>
                  <div className="text-sm font-medium">{fileTypeName}</div>
                </div>
              </div>

              {/* Categories */}
              {((material as any).fileType || (material as any).educationalPurpose) && (
                <div className="grid grid-cols-2 gap-3">
                  {(material as any).fileType && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                      <div className="text-xs opacity-80 mb-1">File Type</div>
                      <div className="text-sm font-medium">{(material as any).fileType.nameEn || (material as any).fileType.name}</div>
                    </div>
                  )}

                  {(material as any).educationalPurpose && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                      <div className="text-xs opacity-80 mb-1">Purpose</div>
                      <div className="text-sm font-medium">{(material as any).educationalPurpose.nameEn}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Uploader Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl bg-white/20"
                  >
                    {uploaderName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs opacity-80">Uploaded by</div>
                    <div className="font-semibold">{uploaderName}</div>
                    <div className="text-xs opacity-80 mt-1">{formatDate(material.$createdAt)}</div>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <motion.button
                onClick={handleDownload}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white text-gray-900 font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <span className="text-xl">⬇️</span>
                <span>Download File</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
