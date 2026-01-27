/**
 * MaterialCard Component - Creative & Stunning Design  
 * تصميم كريتيف ومبهر مع ألوان وحركات احترافية
 * Smart effects - No heavy blur, optimized performance
 */

import React from 'react';
import { motion, useMotionValue } from 'framer-motion';
import type { Material, FileType } from '../../../types/database';
// @ts-ignore
import { useAuth } from '../../../hooks/useAuth';
import './MaterialCard.css';

interface MaterialCardProps {
  material: Material & { fileType?: FileType };
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

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onBookmark,
  isBookmarked = false,
  className = '',
  labels,
}) => {
  const { user } = useAuth();
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  // Use fileType icon if available, otherwise fallback to mimeType
  const fileIcon = material.fileType?.icon || getFileIcon(material.mimeType);
  const fileTypeName = material.fileType?.nameAr || material.fileType?.nameEn || material.fileName?.split('.').pop()?.toUpperCase() || 'FILE';
  const fileSize = material.fileSize ? formatFileSize(material.fileSize) : 'Unknown';
  // Preview is always available via PreviewPage
  const downloadCount = material.downloadCount || 0;

  // Mouse tracking for subtle 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handlePreview = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Generate URL if not available
    let previewUrl = material.viewURL || material.downloadURL || '';
    if (!previewUrl && material.fileId) {
      try {
        const { StorageService } = await import('../../../config/StorageService');
        previewUrl = StorageService.getPublicURL(material.fileId);
      } catch (error) {
        console.warn('Could not generate URL:', error);
      }
    }

    if (!previewUrl) {
      alert('رابط المعاينة غير متوفر / Preview URL not available');
      return;
    }

    // Navigate to dedicated preview page
    const params = new URLSearchParams({
      url: previewUrl,
      name: material.fileName || material.title || 'Document',
      type: material.mimeType || '',
    });
    window.location.href = `/preview?${params.toString()}`;
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      alert(labels.download === 'تحميل' ? 'يجب عليك تسجيل الدخول أولاً' : 'You must log in first');
      return;
    }
    
    try {
      // Get download URL
      let downloadUrl = material.viewURL || material.downloadURL;
      if (!downloadUrl && material.fileId) {
        const { StorageService } = await import('../../../config/StorageService');
        downloadUrl = StorageService.getPublicURL(material.fileId);
      }
      
      if (!downloadUrl) {
        alert('رابط التحميل غير متوفر / Download URL not available');
        return;
      }

      // Record download
      try {
        const { downloadsService } = await import('../../../services/appwriteService');
        await downloadsService.create(material.$id);
        console.log('✅ Download recorded:', material.$id);
      } catch (error) {
        console.error('❌ Error recording download:', error);
      }

      // Force download using fetch + blob
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
        console.log('✅ Download started:', material.fileName);
      } catch (fetchError) {
        console.warn('Fetch failed, trying direct download:', fetchError);
        // Fallback: direct download
        window.open(downloadUrl, '_blank');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('فشل التحميل / Download failed');
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBookmark) onBookmark();
  };

  return (
    <motion.div
      className={`card-container group relative w-full h-[540px] ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ perspective: 1500 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="card-flipper relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{ duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }}
      >
        {/* FRONT FACE */}
        <div
          className="card-face card-front absolute w-full h-full bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
        >
          <div className="relative h-full flex flex-col">
            {/* Header */}
            <div className="relative p-5 bg-gradient-to-r from-cyan-50 via-blue-50 to-sky-50 dark:from-cyan-900/10 dark:via-blue-900/10 dark:to-sky-900/10 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between gap-3">
                {/* Bookmark */}
                <motion.button
                  onClick={handleBookmark}
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg overflow-hidden ${
                    isBookmarked 
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                      : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800'
                  }`}
                  whileHover={{ scale: 1.15, rotate: isBookmarked ? [0, -10, 10, -10, 0] : 0 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  title={labels.bookmark}
                  type="button"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/30"
                    initial={{ scale: 0, opacity: 1 }}
                    whileHover={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="text-2xl relative z-10">{isBookmarked ? '⭐' : '☆'}</span>
                </motion.button>

                {/* Info Button */}
                <motion.button
                  onClick={handleFlip}
                  className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg overflow-hidden"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  title={labels.info}
                  type="button"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                    animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="text-2xl relative z-10 text-white">ℹ️</span>
                </motion.button>
              </div>
            </div>

            {/* File Icon */}
            <div className="flex items-center justify-center py-10">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  animate={isHovered ? {
                    boxShadow: [
                      "0 0 20px rgba(6, 182, 212, 0.35)",
                      "0 0 40px rgba(59, 130, 246, 0.45)",
                      "0 0 20px rgba(6, 182, 212, 0.35)",
                    ],
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <motion.div
                  className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-cyan-100 via-blue-100 to-sky-100 dark:from-cyan-900/30 dark:via-blue-900/30 dark:to-sky-900/30 flex items-center justify-center text-6xl border-2 border-cyan-400/60 dark:border-cyan-500/40 shadow-2xl"
                  whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.span
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {fileIcon}
                  </motion.span>
                </motion.div>
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex-1 px-5 py-4 flex flex-col gap-3">
              <h3 
                className="text-gray-900 dark:text-white font-black text-lg leading-snug line-clamp-2"
                style={{ minHeight: '3.5rem', maxHeight: '3.5rem' }}
              >
                {material.title || material.fileName || 'Untitled'}
              </h3>

              {(material as any).uploaderName && (
                <motion.div 
                  className="relative bg-gradient-to-r from-cyan-50 via-blue-50 to-sky-50 dark:from-cyan-900/20 dark:via-blue-900/20 dark:to-sky-900/20 rounded-2xl p-3 border border-cyan-200/50 dark:border-cyan-600/30 mt-auto"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-sky-500 flex items-center justify-center text-white font-bold text-sm shadow-lg"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 300, duration: 0.6 }}
                    >
                      {(material as any).uploaderName?.[0]?.toUpperCase() || '?'}
                    </motion.div>
                    <p className="flex-1 text-gray-900 dark:text-white font-semibold text-sm truncate">
                      {(material as any).uploaderName || 'Unknown'}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 px-5 pb-5">
              <CreativeButton
                onClick={handlePreview}
                gradient="from-cyan-600 via-blue-600 to-sky-600"
                icon="👁️"
                label={labels.preview || 'معاينة'}
                flex={true}
              />
              
              <CreativeButton
                onClick={handleDownload}
                gradient={user ? "from-orange-600 via-red-600 to-orange-600" : "from-gray-500 to-gray-600"}
                icon={user ? '📥' : '🔒'}
                label={labels.download}
                flex={true}
                disabled={!user}
              />
            </div>

            <motion.div 
              className="h-2 bg-gradient-to-r from-cyan-600 via-blue-500 to-sky-500"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% 100%' }}
            />
          </div>
        </div>

        {/* BACK FACE */}
        <BackFace
          material={material}
          labels={labels}
          fileSize={fileSize}
          fileTypeName={fileTypeName}
          downloadCount={downloadCount}
          onFlip={() => setIsFlipped(false)}
        />
      </motion.div>
    </motion.div>
  );
};

const CreativeButton: React.FC<{
  onClick: (e: React.MouseEvent) => void;
  gradient: string;
  icon: string;
  label: string;
  flex?: boolean;
  full?: boolean;
  disabled?: boolean;
}> = ({ onClick, gradient, icon, label, flex, full, disabled }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-5 py-3 rounded-2xl bg-gradient-to-r ${gradient} text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 overflow-hidden ${flex ? 'flex-1' : ''} ${full ? 'w-full' : ''} ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
      whileHover={!disabled ? { scale: 1.05, y: -3 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      type="button"
      disabled={disabled}
    >
      {!disabled && (
        <motion.div
          className="absolute inset-0"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          }}
        />
      )}
      <span className="relative z-10">{icon}</span>
      <span className="relative z-10">{label}</span>
    </motion.button>
  );
};

const BackFace: React.FC<{
  material: Material & { fileType?: FileType };
  labels: any;
  fileSize: string;
  fileTypeName: string;
  downloadCount: number;
  onFlip: () => void;
}> = ({ material, labels, fileSize, fileTypeName, downloadCount, onFlip }) => {
  return (
    <div
      className="card-face card-back absolute w-full h-full bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700"
      style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)',
      }}
    >
      <div className="h-full flex flex-col">
        <div className="relative bg-gradient-to-r from-cyan-50 via-blue-50 to-sky-50 dark:from-cyan-900/10 dark:via-blue-900/10 dark:to-sky-900/10 p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <motion.button
              onClick={(e) => { e.stopPropagation(); onFlip(); }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.15, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
              title={labels.back}
              type="button"
            >
              <span className="text-2xl text-white">←</span>
            </motion.button>
          </div>
          <h3 className="text-gray-900 dark:text-white font-bold text-lg text-center">{labels.info}</h3>
        </div>

        <div className="flex-1 p-5 overflow-y-auto">
          {material.description ? (
            <motion.div 
              className="bg-white/70 dark:bg-gray-800/50 rounded-2xl p-4 mb-4 border-2 border-cyan-200/50 dark:border-cyan-600/30 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-cyan-600 dark:text-cyan-400 text-sm font-semibold mb-2 flex items-center gap-2">
                <span>📝</span>
                <span>{labels.description}</span>
              </h4>
              <p className="text-gray-900 dark:text-white text-sm leading-relaxed">{material.description}</p>
            </motion.div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-800/30 rounded-2xl p-4 mb-4 flex items-center justify-center">
              <p className="text-gray-500 text-sm italic">
                {labels.description ? 'No description available' : 'لا يوجد وصف'}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <DetailBox icon="📏" label={labels.size} value={fileSize} color="cyan" />
            <DetailBox icon="📄" label={labels.type} value={fileTypeName} color="blue" />
            <DetailBox icon="⬇️" label={labels.downloads} value={downloadCount.toString()} color="green" />
            <DetailBox icon="📅" label={labels.date} value={new Date(material.$createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} color="orange" />
          </div>
        </div>

        <motion.div 
          className="h-2 bg-gradient-to-r from-cyan-600 via-blue-500 to-sky-500"
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: '200% 100%' }}
        />
      </div>
    </div>
  );
};

const DetailBox: React.FC<{ icon: string; label: string; value: string; color: string }> = ({ icon, label, value, color }) => {
  const colors: any = {
    cyan: { bg: 'from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20', border: 'border-cyan-300 dark:border-cyan-600/30', text: 'text-cyan-700 dark:text-cyan-400' },
    blue: { bg: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20', border: 'border-blue-300 dark:border-blue-600/30', text: 'text-blue-700 dark:text-blue-400' },
    green: { bg: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20', border: 'border-green-300 dark:border-green-600/30', text: 'text-green-700 dark:text-green-400' },
    orange: { bg: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20', border: 'border-orange-300 dark:border-orange-600/30', text: 'text-orange-700 dark:text-orange-400' },
  };

  const c = colors[color];

  return (
    <motion.div 
      className={`bg-gradient-to-br ${c.bg} rounded-xl p-3 border-2 ${c.border} shadow-sm`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <div className={`${c.text} text-xs font-medium`}>{label}</div>
      </div>
      <div className="text-gray-900 dark:text-white font-bold text-sm">{value}</div>
    </motion.div>
  );
};

export default MaterialCard;
