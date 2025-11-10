/**
 * SyncStatusIndicator Component
 * 
 * Displays Meilisearch sync status in a subtle corner badge
 * Shows indexing progress and realtime sync status
 */

import React from 'react';
import { Loader2, Database, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useMeilisearchManualSync } from '@/hooks/useMeilisearchSync';

const SyncStatusIndicator = ({ status, showDetails = false }) => {
  const { triggerIndexing, isIndexing: isManualIndexing } = useMeilisearchManualSync();
  
  const { isIndexing, isReady, error, progress } = status;

  // Don't show anything if ready and no errors
  if (isReady && !error && !showDetails) {
    return null;
  }

  const handleManualSync = async () => {
    try {
      await triggerIndexing({ skipIfComplete: false });
    } catch (err) {
      console.error('Manual sync failed:', err);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 flex items-start gap-3">
        {/* Status Icon */}
        <div className="flex-shrink-0">
          {isIndexing ? (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          ) : error ? (
            <XCircle className="w-5 h-5 text-red-500" />
          ) : isReady ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <Database className="w-5 h-5 text-gray-400" />
          )}
        </div>

        {/* Status Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {isIndexing ? 'Indexing Search...' : error ? 'Sync Error' : isReady ? 'Search Ready' : 'Initializing...'}
            </span>
          </div>

          {/* Progress Bar */}
          {isIndexing && progress && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>{progress.collectionName}</span>
                <span>{progress.percentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {progress.processed} / {progress.total} documents
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {error}
            </p>
          )}

          {/* Manual Sync Button */}
          {(error || (isReady && showDetails)) && (
            <button
              onClick={handleManualSync}
              disabled={isManualIndexing}
              className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isManualIndexing ? 'animate-spin' : ''}`} />
              {isManualIndexing ? 'Re-syncing...' : 'Re-sync Search'}
            </button>
          )}
        </div>

        {/* Close Button (if showing details) */}
        {showDetails && isReady && !error && (
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('hide-sync-status'))}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default SyncStatusIndicator;
