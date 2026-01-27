/**
 * MaterialCard - Gradient Dynamic Style 🌈
 * Bold colors with dynamic gradients
 * Focus: Vibrant colors, energy, playfulness
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { Material } from '../../../../types/database';
// @ts-ignore
import { useAuth } from '../../../../hooks/useAuth';

interface MaterialCardGradientProps {
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

// Dynamic gradient based on file type
const getGradient = (mimeType?: string): string => {
  if (!mimeType) return 'from-purple-500 via-pink-500 to-red-500';
  const type = mimeType.toLowerCase();
  if (type.includes('pdf')) return 'from-red-500 via-orange-500 to-yellow-500';
  if (type.includes('word')) return 'from-blue-500 via-indigo-500 to-purple-500';
  if (type.includes('powerpoint')) return 'from-orange-500 via-red-500 to-pink-500';
  if (type.includes('excel')) return 'from-green-500 via-emerald-500 to-teal-500';
  if (type.includes('image')) return 'from-pink-500 via-purple-500 to-indigo-500';
  if (type.includes('video')) return 'from-cyan-500 via-blue-500 to-indigo-500';
  return 'from-purple-500 via-pink-500 to-red-500';
};

export const MaterialCardGradient: React.FC<MaterialCardGradientProps> = ({
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
  const gradient = getGradient(material.mimeType);

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -10 }}
      animate={{ opacity: 1, rotateY: 0 }}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative h-full"
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Card Container */}
      <div className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        
        {/* Animated Gradient Header */}
        <motion.div
          className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-br ${gradient}`}
          animate={isHovered ? { 
            opacity: [0.8, 1, 0.8],
            scale: [1, 1.1, 1]
          } : { opacity: 0.8, scale: 1 }}
          transition={{ 
            duration: 2,
            repeat: isHovered ? Infinity : 0,
            ease: 'easeInOut'
          }}
        />

        {/* Overlay Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)`
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-6 h-full flex flex-col">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            {/* Animated Icon Orb */}
            <motion.div
              animate={isHovered ? { 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1]
              } : { rotate: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-3xl border border-white/20 shadow-2xl"
            >
              {icon}
            </motion.div>

            {/* Bookmark Star */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onBookmark?.();
              }}
              whileHover={{ scale: 1.2, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              className={`w-10 h-10 rounded-full backdrop-blur-xl flex items-center justify-center border transition-all duration-300 ${
                isBookmarked
                  ? 'bg-yellow-500/40 border-yellow-400 shadow-lg shadow-yellow-500/50'
                  : 'bg-white/10 border-white/20 hover:bg-white/20'
              }`}
            >
              <span className="text-xl">{isBookmarked ? '⭐' : '☆'}</span>
            </motion.button>
          </div>

          {/* File Type Badge - Floating */}
          <motion.div
            animate={isHovered ? { y: -2, x: 2 } : { y: 0, x: 0 }}
            className="inline-flex items-center gap-2 mb-3 self-start"
          >
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wider bg-gradient-to-r ${gradient} text-white shadow-lg`}>
              {fileExtension}
            </span>
            <span className="text-xs font-medium text-white/60 backdrop-blur-sm bg-white/5 px-2 py-1 rounded-full">
              {fileSize}
            </span>
          </motion.div>

          {/* Title - Bold & Dynamic */}
          <motion.h3
            animate={isHovered ? { x: 4 } : { x: 0 }}
            className="text-xl font-extrabold text-white mb-2 line-clamp-2 leading-tight drop-shadow-lg"
          >
            {material.title}
          </motion.h3>

          {/* Description */}
          {material.description && (
            <p className="text-sm text-white/70 mb-4 line-clamp-2 leading-relaxed">
              {material.description}
            </p>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Action Buttons - Vibrant */}
          <div className="flex gap-3">
            <motion.button
              onClick={onPreview}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r ${gradient} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              {labels.preview}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white text-xl hover:bg-white/20 transition-all duration-300"
            >
              ↓
            </motion.button>
          </div>
        </div>

        {/* Shine Effect on Hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={isHovered ? { 
            x: ['-100%', '100%']
          } : { x: '-100%' }}
          transition={{ 
            duration: 0.8,
            ease: 'easeInOut'
          }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            width: '50%',
          }}
        />
      </div>

      {/* 3D Shadow */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-3xl"
        animate={isHovered ? { 
          opacity: 0.8,
          y: 10,
          x: -5,
          scale: 0.95
        } : { 
          opacity: 0.4,
          y: 5,
          x: 0,
          scale: 1
        }}
        className={`bg-gradient-to-br ${gradient} blur-xl`}
      />
    </motion.div>
  );
};
