/**
 * MaterialCard - Glassmorphic Floating Style 💎
 * Modern blur effects with floating elements
 * Focus: Transparency, depth, layering
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { Material } from '../../../../types/database';
// @ts-ignore
import { useAuth } from '../../../../hooks/useAuth';

interface MaterialCardGlassProps {
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

export const MaterialCardGlass: React.FC<MaterialCardGlassProps> = ({
  material,
  onPreview,
  onBookmark,
  isBookmarked = false,
  labels
}) => {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = React.useState(false);
  const icon = (material as any).fileType?.icon || getFileIcon(material.mimeType);
  const fileSize = material.fileSize ? formatFileSize(material.fileSize) : '';
  const fileExtension = material.fileName?.split('.').pop()?.toUpperCase() || 'FILE';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03, y: -12 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative h-full"
      style={{ perspective: '1000px' }}
    >
      {/* Glass Card Container */}
      <div 
        className="relative h-full rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
          }}
        />

        {/* Floating Icon - Top Right */}
        <motion.div
          animate={isHovered ? { y: -5, x: 5, rotate: 5 } : { y: 0, x: 0, rotate: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-4 right-4 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl z-10"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {icon}
        </motion.div>

        {/* Bookmark - Floating Glass Button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onBookmark?.();
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center z-20"
          style={{
            background: isBookmarked 
              ? 'rgba(251, 191, 36, 0.3)' 
              : 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <span className="text-xl">{isBookmarked ? '⭐' : '☆'}</span>
        </motion.button>

        {/* Content Area */}
        <div className="relative p-6 pt-24 h-full flex flex-col">
          {/* File Badge */}
          <div className="inline-flex items-center gap-2 mb-3 self-start">
            <span 
              className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              {fileExtension}
            </span>
            <span className="text-xs text-white/60">{fileSize}</span>
          </div>

          {/* Title - Frosted Glass */}
          <h3 
            className="text-lg font-bold mb-2 line-clamp-2 p-3 rounded-xl -mx-3"
            style={{
              background: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              backdropFilter: isHovered ? 'blur(10px)' : 'none',
              transition: 'all 0.3s ease',
              color: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            {material.title}
          </h3>

          {/* Description */}
          {material.description && (
            <p className="text-sm mb-4 line-clamp-2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {material.description}
            </p>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Glass Actions */}
          <div className="flex gap-2">
            <motion.button
              onClick={onPreview}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-3 rounded-xl font-semibold text-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
              }}
            >
              {labels.preview}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
              }}
            >
              ↓
            </motion.button>
          </div>
        </div>

        {/* Light Reflection Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />
      </div>

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-2xl"
        animate={isHovered ? { opacity: 1, scale: 1.05 } : { opacity: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(168, 85, 247, 0.4))',
          filter: 'blur(20px)',
        }}
      />
    </motion.div>
  );
};
