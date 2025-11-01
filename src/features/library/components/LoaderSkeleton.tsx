/**
 * LoaderSkeleton Component
 * Accessible loading skeletons for different content types
 */

import React from 'react';

interface LoaderSkeletonProps {
  variant?: 'card' | 'grid' | 'text' | 'list';
  count?: number;
  className?: string;
}

const LoaderSkeleton: React.FC<LoaderSkeletonProps> = ({
  variant = 'card',
  count = 1,
  className = '',
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={`bg-[#1a2332] rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 animate-pulse ${className}`}>
            {/* Header */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-center mb-3">
                <div className="w-24 h-24 rounded-xl bg-gray-700/50"></div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="h-6 bg-gray-700/50 rounded mb-3"></div>
              <div className="h-4 bg-gray-700/30 rounded mb-2"></div>
              <div className="h-4 bg-gray-700/30 rounded mb-4 w-3/4"></div>
              <div className="flex gap-2 mb-4">
                <div className="flex-1 h-16 bg-gray-700/50 rounded-lg"></div>
                <div className="flex-1 h-16 bg-gray-700/50 rounded-lg"></div>
              </div>
              <div className="h-10 bg-gray-700/50 rounded-xl"></div>
            </div>
            
            {/* Bottom line */}
            <div className="h-1 bg-gray-700/50"></div>
          </div>
        );

      case 'grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="bg-[#1a2332] rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 animate-pulse">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 border-b border-gray-700/50">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-24 h-24 rounded-xl bg-gray-700/50"></div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="h-6 bg-gray-700/50 rounded mb-3"></div>
                  <div className="h-4 bg-gray-700/30 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700/30 rounded mb-4 w-3/4"></div>
                  <div className="h-10 bg-gray-700/50 rounded-xl"></div>
                </div>
                <div className="h-1 bg-gray-700/50"></div>
              </div>
            ))}
          </div>
        );

      case 'text':
        return (
          <div className={`space-y-3 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-700/50 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700/30 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        );

      case 'list':
        return (
          <div className={`space-y-4 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl animate-pulse">
                <div className="w-12 h-12 bg-gray-700/50 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700/30 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div role="status" aria-live="polite" aria-label="Loading content">
      {renderSkeleton()}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoaderSkeleton;
