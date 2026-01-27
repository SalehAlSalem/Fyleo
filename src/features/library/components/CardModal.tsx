/**
 * CardModal Component
 * Instagram-style modal for displaying Material or Post cards in full view
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MaterialCard from './MaterialCard';
import PostCard from './PostCard';
import type { Material } from '../../../types/database';

interface Post {
  $id: string;
  contentText?: string;
  linkURL?: string;
  $createdAt: string;
  $updatedAt: string;
  uploaderId: string;
  subjectId: string;
  uploaderName?: string;
}

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  material?: Material;
  post?: Post;
  onMaterialPreview?: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  materialLabels?: {
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
  postLabels?: {
    link: string;
    viewPost: string;
  };
}

const CardModal: React.FC<CardModalProps> = ({
  isOpen,
  onClose,
  material,
  post,
  onMaterialPreview,
  onBookmark,
  isBookmarked,
  materialLabels,
  postLabels,
}) => {
  // Close on ESC key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-16 left-0 right-0 bottom-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all z-10 text-white text-2xl"
              aria-label="Close"
            >
              ×
            </button>

            {/* Card Content */}
            <div className="transform scale-100">
              {material && materialLabels ? (
                <MaterialCard
                  material={material}
                  onBookmark={onBookmark}
                  isBookmarked={isBookmarked}
                  labels={materialLabels}
                  className="shadow-2xl"
                />
              ) : post && postLabels ? (
                <PostCard
                  post={post}
                  labels={postLabels}
                  className="shadow-2xl"
                />
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CardModal;
