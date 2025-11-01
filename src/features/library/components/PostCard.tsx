/**
 * PostCard Component
 * Displays a post with text content and optional link
 * Matches MaterialCard design
 */

import React from 'react';
import { motion } from 'framer-motion';
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

/**
 * Format date in Gregorian calendar
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  // Always use Gregorian calendar (en-US locale)
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`relative bg-white dark:bg-[#1a2332] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700/50 ${className}`}
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-4 border-b border-gray-300 dark:border-gray-700/50" style={{ height: '177px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Link Icon */}
        <div className="w-20 h-20 rounded-xl bg-gray-200/50 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center text-5xl border border-gray-300 dark:border-white/20">
          🔗
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Text Content */}
        {hasText && (
          <div className="mb-4">
            <p className="text-gray-900 dark:text-white text-sm leading-relaxed line-clamp-4 text-right">
              {post.contentText}
            </p>
          </div>
        )}

        {/* Link Info */}
        {hasLink && (
          <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3 mb-4">
            <div className="text-gray-600 dark:text-gray-400 text-xs mb-2 text-right">
              {isArabic ? 'الرابط' : 'Link'}
            </div>
            <div className="text-blue-600 dark:text-blue-400 text-sm font-medium truncate text-right" dir="ltr">
              {post.linkURL}
            </div>
          </div>
        )}

        {/* Uploader Info */}
        <div className="bg-gray-100 dark:bg-gray-800/30 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
              {((post as any).uploaderName || 
                (post as any).uploader?.name || 
                'Unknown User')[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-gray-900 dark:text-white text-sm font-bold">
                {(post as any).uploaderName || 
                 (post as any).uploader?.name || 
                 'Unknown User'}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                {formatDate(post.$createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {hasLink && (
          <a
            href={post.linkURL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-3 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold text-sm text-center transition-all shadow-lg"
          >
            <span className="flex items-center justify-center gap-2">
              <span>🔗</span>
              <span>{isArabic ? 'فتح الرابط' : 'Open Link'}</span>
            </span>
          </a>
        )}

        {/* View Post Button (if no link) */}
        {!hasLink && onView && (
          <button
            onClick={onView}
            className="w-full px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-sm text-center transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <span>👁️</span>
            <span>{labels.viewPost}</span>
          </button>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="h-1 bg-gradient-to-r from-green-600 via-teal-600 to-blue-600"></div>
    </motion.div>
  );
};

export default PostCard;
