/**
 * PostCard Component - Creative & Stunning Design
 * تصميم كريتيف ومبهر للبوستات
 * Smart effects - Optimized performance
 */

import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { Post } from '../../../types/database';

interface PostCardProps {
  post: Post;
  onView?: () => void;
  className?: string;
  labels: {
    link: string;
    viewPost: string;
  };
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const PostCard: React.FC<PostCardProps> = ({
  post,
  onView,
  className = '',
  labels,
}) => {
  const hasLink = post.linkURL && post.linkURL.trim() !== '';
  const hasText = post.contentText && post.contentText.trim() !== '';
  const isArabic = document.documentElement.dir === 'rtl';
  const [isHovered, setIsHovered] = React.useState(false);

  // Mouse tracking for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-150, 150], [3, -3]);
  const rotateY = useTransform(mouseX, [-150, 150], [-3, 3]);

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

  return (
    <motion.div
      className={`group relative ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ perspective: 1500 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700"
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Radial gradient on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.15), transparent 70%)',
          }}
        />

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          initial={{ x: '-100%', y: '-100%' }}
          animate={isHovered ? { x: '100%', y: '100%' } : { x: '-100%', y: '-100%' }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            background: 'linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%)',
          }}
        />

        {/* Header with icon */}
        <div className="relative bg-gradient-to-r from-green-50 via-teal-50 to-blue-50 dark:from-green-900/10 dark:via-teal-900/10 dark:to-blue-900/10 p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center" style={{ minHeight: '150px' }}>
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Icon glow using box-shadow */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              animate={isHovered ? {
                boxShadow: [
                  "0 0 20px rgba(16, 185, 129, 0.3)",
                  "0 0 40px rgba(20, 184, 166, 0.4)",
                  "0 0 20px rgba(16, 185, 129, 0.3)",
                ],
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            <motion.div
              className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/40 dark:to-teal-900/40 flex items-center justify-center text-6xl border-2 border-green-300 dark:border-green-700 shadow-xl"
              whileHover={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📌
              </motion.span>
            </motion.div>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Post Title */}
          {post.title && (
            <h3 className="text-gray-900 dark:text-white font-black text-xl mb-4 leading-tight">
              {post.title}
            </h3>
          )}

          {/* Text Content */}
          {hasText && (
            <motion.div 
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-4 mb-4 border-2 border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-900 dark:text-white text-sm leading-relaxed line-clamp-4" dir={isArabic ? 'rtl' : 'ltr'}>
                {post.contentText}
              </p>
            </motion.div>
          )}

          {/* Link Info - Creative card */}
          {hasLink && (
            <motion.div 
              className="relative bg-gradient-to-r from-green-50 via-teal-50 to-blue-50 dark:from-green-900/20 dark:via-teal-900/20 dark:to-blue-900/20 rounded-2xl p-4 mb-4 border-2 border-green-200/50 dark:border-green-700/30 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              {/* Animated gradient border effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(90deg, rgba(16,185,129,0.3), rgba(20,184,166,0.3), rgba(59,130,246,0.3))',
                }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <div className="relative flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl"
                >
                  🔗
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="text-green-600 dark:text-green-400 text-xs font-semibold mb-1">{labels.link}</div>
                  <a
                    href={post.linkURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline truncate block transition-colors duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {post.linkURL}
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* Uploader Info - Creative card */}
          {(post.uploader || (post as any).uploaderName) && (
            <motion.div 
              className="relative bg-gradient-to-r from-green-50 via-teal-50 to-emerald-50 dark:from-green-900/20 dark:via-teal-900/20 dark:to-emerald-900/20 rounded-2xl p-4 mb-4 border-2 border-green-200/50 dark:border-green-700/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 via-teal-100 to-emerald-100 dark:from-green-900/40 dark:via-teal-900/40 dark:to-emerald-900/40 flex items-center justify-center text-green-700 dark:text-green-300 font-bold shadow-md border-2 border-green-200/50 dark:border-green-700/30"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, duration: 0.6 }}
                >
                  {((post as any).uploaderName || post.uploader?.name)?.[0]?.toUpperCase() || '?'}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 dark:text-white font-semibold text-sm truncate">
                    {(post as any).uploaderName || post.uploader?.name || 'Unknown'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    {formatDate(post.$createdAt)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* View Button - Creative design */}
          {onView && (
            <motion.button
              onClick={onView}
              className="relative w-full px-5 py-3.5 rounded-2xl bg-gradient-to-r from-green-600 via-teal-600 to-green-600 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 overflow-hidden"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              type="button"
            >
              {/* Shine effect on button */}
              <motion.div
                className="absolute inset-0"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                }}
              />
              <span className="relative z-10 text-xl">👀</span>
              <span className="relative z-10">{labels.viewPost}</span>
            </motion.button>
          )}
        </div>

        {/* Bottom accent - Animated gradient */}
        <motion.div 
          className="h-2 bg-gradient-to-r from-green-600 via-teal-500 to-blue-500"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: '200% 100%' }}
        />
      </motion.div>
    </motion.div>
  );
};

export default PostCard;
