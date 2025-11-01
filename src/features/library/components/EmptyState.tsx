/**
 * EmptyState Component
 * Display when no content is available
 * Dumb component - receives all data via props
 */

import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`text-center py-16 ${className}`}>
      <div className="text-8xl mb-6">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
