/**
 * MaterialCard Component
 * Dumb component - receives all data via props
 * Displays a material with file info and action buttons
 * Features 3D flip animation to show additional metadata
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { Material } from '../../../types/database';
// @ts-ignore - useAuth is a JSX file without type definitions
import { useAuth } from '../../../hooks/useAuth';
import './MaterialCard.css';

interface MaterialCardProps {
  material: Material;
  onPreview?: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  className?: string;
  labels: {
    fileSize: string;
    fileType: string;
    preview: string;
    download: string;
    bookmark: string;
    info: string;
    description: string;
    size: string;
    type: string;
    downloads: string;
    date: string;
    back: string;
  };
}

/**
 * Get file icon based on mime type
 */
const getFileIcon = (mimeType?: string): string => {
  if (!mimeType) return '📄';
  
  const type = mimeType.toLowerCase();
  if (type.includes('pdf')) return '📄';
  if (type.includes('word') || type.includes('document')) return '📝';
  if (type.includes('powerpoint') || type.includes('presentation')) return '📊';
  if (type.includes('excel') || type.includes('spreadsheet')) return '📈';
  if (type.includes('image')) return '🖼️';
  if (type.includes('video')) return '🎥';
  if (type.includes('audio')) return '🎵';
  if (type.includes('zip') || type.includes('archive')) return '📦';
  
  return '📄';
};

/**
 * Format file size
 */
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/**
 * Check if file type supports preview
 * Supports: images, PDFs, modern Office formats (.docx, .pptx, .xlsx)
 * Does NOT support: legacy formats (.doc, .ppt, .xls)
 */
const supportsPreview = (fileName?: string, mimeType?: string): boolean => {
  if (!fileName && !mimeType) return false;
  
  const name = fileName?.toLowerCase() || '';
  const mime = mimeType?.toLowerCase() || '';
  
  // Images
  if (mime.includes('image') || /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(name)) {
    return true;
  }
  
  // PDFs
  if (mime.includes('pdf') || name.endsWith('.pdf')) {
    return true;
  }
  
  // Modern Office formats (docx, pptx, xlsx)
  if (
    mime.includes('officedocument') ||
    /\.(docx|pptx|xlsx)$/i.test(name)
  ) {
    return true;
  }
  // Exclude legacy formats (.doc, .ppt, .xls)
  if (/\.(doc|ppt|xls)$/i.test(name) && !/x$/i.test(name)) {
    return false;
  }
  
  return false;
};

export const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onPreview,
  onBookmark,
  isBookmarked = false,
  className = '',
  labels
}) => {
  const { user } = useAuth();
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [downloadCount, setDownloadCount] = React.useState<number>(0);
  const [isBookmarkPending, setIsBookmarkPending] = React.useState(false);
  
  // Use fileType icon from database if available, otherwise fallback to mime type icon
  const icon = (material as any).fileType?.icon || getFileIcon(material.mimeType);
  const fileTypeName = (material as any).fileType?.nameEn || material.fileName?.split('.').pop()?.toUpperCase() || 'FILE';
  const fileSize = material.fileSize ? formatFileSize(material.fileSize) : '';
  const fileExtension = material.fileName?.split('.').pop()?.toUpperCase() || 'FILE';
  const canPreview = supportsPreview(material.fileName, material.mimeType);
  
  // Load download count from downloads collection
  React.useEffect(() => {
    const loadDownloadCount = async () => {
      try {
        const { downloadsService } = await import('../../../services/appwriteService');
        const count = await downloadsService.getCountByFile(material.$id);
        setDownloadCount(count);
      } catch (error) {
        console.error('Error loading download count:', error);
      }
    };
    loadDownloadCount();
  }, [material.$id]);
  
  const handleFlip = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsFlipped(!isFlipped);
  };
  
  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // ✅ Prevent multiple simultaneous requests
    if (isBookmarkPending) {
      console.log('⚠️ Bookmark request already in progress');
      return;
    }
    
    if (onBookmark) {
      setIsBookmarkPending(true);
      try {
        await onBookmark();
        console.log('✅ Bookmark toggled');
      } catch (error) {
        console.error('❌ Bookmark error:', error);
      } finally {
        // ✅ Small delay to prevent rapid clicks
        setTimeout(() => {
          setIsBookmarkPending(false);
        }, 300);
      }
    } else {
      console.error('❌ onBookmark callback not provided');
    }
  };
  
  /**
   * Handle download with blob for cross-origin URLs
   * Fetches file, converts to blob, creates temporary URL, triggers download
   */
  const handleDownload = async () => {
    // Check if user is authenticated
    if (!user) {
      alert(labels.download === 'تحميل' 
        ? 'يجب عليك تسجيل الدخول أولاً لتحميل الملفات' 
        : 'You must log in first to download files');
      return;
    }

    if (!material.fileId) return;
    
    // ✅ Get permanent public URL (no expiry)
    let downloadUrl = material.viewURL;
    if (!downloadUrl) {
      try {
        const { StorageService } = await import('../../../config/StorageService');
        downloadUrl = StorageService.getPublicURL(material.fileId);
      } catch (error) {
        console.error('❌ Could not generate public URL:', error);
        return;
      }
    }
    
    // ✅ SERVER-SIDE: Simply record the download
    // The Appwrite Function will automatically increment the counter
    try {
      const { downloadsService } = await import('../../../services/appwriteService');
      await downloadsService.create(material.$id);
      console.log('✅ Download recorded:', material.$id);
    } catch (error) {
      console.error('❌ Error recording download:', error);
    }
    
    // Download file
    if (!downloadUrl) {
      console.error('❌ No download URL available');
      return;
    }
    
    try {
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      // Convert to blob
      const blob = await response.blob();
      
      // Create temporary blob URL
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create temporary <a> element
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = material.fileName || 'download';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      // Fallback: open in new tab if blob download fails
      window.open(material.viewURL, '_blank');
    }
  };
  
  /**
   * Handle preview button click
   * Triggers the onPreview callback to open modal
   */
  const handlePreview = () => {
    if (onPreview) {
      onPreview();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`card-container perspective-1000 ${className}`}
    >
      <div
        className={`card-inner relative ${isFlipped ? 'flipped' : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
      {/* FRONT FACE */}
      <div 
        className="card-face card-front bg-white dark:bg-[#1a2332] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700/50"
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-4 border-b border-gray-300 dark:border-gray-700/50" style={{ height: '177px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {/* Top Row: Bookmark & Info */}
          <div className="flex items-start justify-between mb-3">
            <button
              onMouseDown={handleBookmarkClick}
              onClick={handleBookmarkClick}
              className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all shadow-lg z-[100] ${
                isBookmarked
                  ? 'bg-yellow-500/40 hover:bg-yellow-500/50'
                  : 'bg-gray-700/50 hover:bg-gray-700/70'
              }`}
              title={labels.bookmark}
              aria-label={labels.bookmark}
              type="button"
            >
              <span className="text-2xl" style={{ pointerEvents: 'none' }}>{isBookmarked ? '⭐' : '☆'}</span>
            </button>
            
            <button
              onTouchStart={handleFlip}
              onMouseDown={handleFlip}
              onClick={handleFlip}
              className="w-10 h-10 rounded-full bg-blue-500/30 hover:bg-blue-500/40 backdrop-blur-sm flex items-center justify-center transition-all shadow-lg z-[100]"
              title={labels.info}
              aria-label={labels.info}
              type="button"
            >
              <span className="text-2xl" style={{ pointerEvents: 'none' }}>ⓘ</span>
            </button>
          </div>

        {/* File Icon */}
        <div className="flex items-center justify-center flex-1">
          <div className="w-20 h-20 rounded-xl bg-gray-200/50 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center text-5xl border border-gray-300 dark:border-white/20">
            {icon}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-1 line-clamp-2 text-right">
          {material.title}
        </h3>

        {/* File Info Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-2 text-right">
            <div className="text-gray-600 dark:text-gray-400 text-xs mb-1">{labels.fileSize}</div>
            <div className="text-gray-900 dark:text-white font-medium">{fileSize}</div>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-2 text-right">
            <div className="text-gray-600 dark:text-gray-400 text-xs mb-1">{labels.fileType}</div>
            <div className="text-gray-900 dark:text-white font-medium">{fileTypeName}</div>
          </div>
        </div>

        {/* Uploader Info - Moved above action buttons */}
        <div className="bg-gray-100 dark:bg-gray-800/30 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-base">
              {((material as any).uploaderName || 
                (material as any).uploader?.name || 
                'Unknown User')[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-gray-900 dark:text-white text-xs font-semibold">
                {(material as any).uploaderName || 
                 (material as any).uploader?.name || 
                 'Unknown User'}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-[10px]">
                {new Date(material.$createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          {/* Preview Button - Only for supported file types */}
          {canPreview && onPreview && (
            <button
              onClick={handlePreview}
              className="flex-1 px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-sm text-center transition-all shadow-lg flex items-center justify-center gap-1 hover:shadow-2xl active:scale-95 transition-transform"
              type="button"
            >
              <span>👁️</span>
              <span>{labels.preview}</span>
            </button>
          )}

          {/* Download Button - Always visible */}
          <button
            onClick={handleDownload}
            className={`px-3 py-2.5 rounded-xl ${
              user 
                ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700' 
                : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 cursor-not-allowed'
            } text-white font-bold text-sm text-center transition-all shadow-lg flex items-center justify-center gap-1 hover:shadow-2xl active:scale-95 transition-transform ${
              canPreview ? 'flex-1' : 'w-full'
            }`}
            type="button"
            title={!user ? (labels.download === 'تحميل' ? 'يجب عليك تسجيل الدخول أولاً' : 'You must log in first') : ''}
          >
            <span>{user ? '📥' : '🔒'}</span>
            <span>{labels.download}</span>
          </button>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-orange-600"></div>
      </div>

      {/* BACK FACE */}
      <div 
        className="card-face card-back bg-white dark:bg-[#1a2332] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700/50"
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          position: 'absolute',
          width: '100%',
          height: '100%',
          transform: 'rotateY(180deg)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Back Header */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-4 border-b border-gray-300 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-3">
            <button
              onTouchStart={handleFlip}
              onMouseDown={handleFlip}
              onClick={handleFlip}
              className="w-10 h-10 rounded-full bg-purple-500/30 hover:bg-purple-500/40 backdrop-blur-sm flex items-center justify-center transition-all shadow-lg z-[100]"
              title={labels.back}
              aria-label={labels.back}
              type="button"
            >
              <span className="text-2xl" style={{ pointerEvents: 'none' }}>←</span>
            </button>
          </div>
          
          <h3 className="text-gray-900 dark:text-white font-bold text-lg text-center">{labels.info}</h3>
        </div>

        {/* Back Content - Description Focused */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Description - Expanded to fill space */}
          {material.description ? (
            <div className="bg-gray-100 dark:bg-gray-800/30 rounded-lg p-4 flex-1 flex flex-col">
              <h4 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-3 flex items-center gap-2">
                <span>📝</span>
                <span>{labels.description}</span>
              </h4>
              <p className="text-gray-900 dark:text-white text-sm leading-relaxed overflow-y-auto flex-1">
                {material.description}
              </p>
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-800/30 rounded-lg p-4 flex-1 flex items-center justify-center">
              <p className="text-gray-600 dark:text-gray-500 text-sm italic">
                {labels.description ? 'No description available' : 'لا يوجد وصف'}
              </p>
            </div>
          )}

          {/* File Details Grid - Compact at bottom */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-gray-100 dark:bg-gray-800/30 rounded-lg p-2">
              <div className="text-gray-600 dark:text-gray-400 text-xs">{labels.size}</div>
              <div className="text-gray-900 dark:text-white text-sm font-bold">{fileSize}</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800/30 rounded-lg p-2">
              <div className="text-gray-600 dark:text-gray-400 text-xs">{labels.type}</div>
              <div className="text-gray-900 dark:text-white text-sm font-bold">{fileExtension}</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800/30 rounded-lg p-2">
              <div className="text-gray-600 dark:text-gray-400 text-xs">{labels.downloads}</div>
              <div className="text-gray-900 dark:text-white text-sm font-bold">
                {downloadCount}
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800/30 rounded-lg p-2">
              <div className="text-gray-600 dark:text-gray-400 text-xs">{labels.date}</div>
              <div className="text-gray-900 dark:text-white text-sm font-bold">
                {new Date(material.$createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
      </div>
      </div>
    </motion.div>
  );
};

export default MaterialCard;
