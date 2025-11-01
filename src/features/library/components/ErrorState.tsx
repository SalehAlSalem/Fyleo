/**
 * ErrorState Component
 * Display when an error occurs
 * Dumb component - receives all data via props
 */

import React from 'react';

interface ErrorStateProps {
  title: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
  retryLabel = 'Try Again',
  className = '',
}) => {
  return (
    <div className={`text-center py-16 ${className}`}>
      <div className="text-8xl mb-6">⚠️</div>
      <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">
        {title}
      </h3>
      {message && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          {message}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorState;
