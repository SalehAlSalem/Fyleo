/**
 * useMeilisearchSync Hook
 * 
 * Initializes Meilisearch synchronization on app startup
 * - Performs initial indexing if needed
 * - Sets up realtime listeners
 * - Handles cleanup on unmount
 */

import { useEffect, useState, useRef } from 'react';
import { meilisearchSyncManager } from '../services/meilisearchSync';

const MEILISEARCH_ENABLED = import.meta.env.VITE_MEILISEARCH_ENABLED !== 'false';

export function useMeilisearchSync(options = {}) {
  const {
    autoStart = true,
    skipIfComplete = true,
    onProgress = null,
    onComplete = null,
    onError = null
  } = options;

  const [status, setStatus] = useState({
    isIndexing: false,
    isReady: false,
    error: null,
    progress: null
  });

  const isInitialized = useRef(false);

  useEffect(() => {
    // Skip if Meilisearch is disabled
    if (!MEILISEARCH_ENABLED) {
      console.warn('⚠️ Meilisearch sync disabled in environment variables');
      return;
    }

    // Prevent double initialization in strict mode
    if (isInitialized.current || !autoStart) {
      return;
    }

    isInitialized.current = true;

    async function initializeSync() {
      try {
        console.log('🚀 Initializing Meilisearch sync...');
        
        // ✅ Mark as ready immediately - Don't wait for indexing!
        setStatus({
          isIndexing: true,
          isReady: true,  // ✅ البحث يعمل فوراً!
          error: null,
          progress: null
        });

        // ✅ Perform indexing in background (non-blocking)
        const isComplete = meilisearchSyncManager.isIndexingComplete();
        
        if (!isComplete || !skipIfComplete) {
          console.log('📊 Performing initial indexing (background)...');
          
          // Run indexing in background without blocking
          meilisearchSyncManager.performInitialIndexing({
            skipIfComplete,
            onProgress: (progressData) => {
              setStatus(prev => ({ ...prev, progress: progressData }));
              if (onProgress) {
                onProgress(progressData);
              }
            }
          }).then(result => {
            if (result.success) {
              console.log('✅ Background indexing completed');
              setStatus(prev => ({ ...prev, isIndexing: false }));
            } else {
              console.warn('⚠️ Background indexing failed:', result.error);
              // Don't break the app - search still works!
            }
          }).catch(error => {
            console.warn('⚠️ Background indexing error:', error);
            // Don't break the app - search still works!
          });
        } else {
          console.log('✅ Initial indexing already complete');
          setStatus(prev => ({ ...prev, isIndexing: false }));
        }

        // Initialize realtime sync
        console.log('👂 Setting up realtime listeners...');
        const realtimeSuccess = await meilisearchSyncManager.initialize();

        if (!realtimeSuccess) {
          console.warn('⚠️ Realtime sync setup failed, but continuing...');
        }

        setStatus({
          isIndexing: false,
          isReady: true,
          error: null,
          progress: null
        });

        if (onComplete) {
          onComplete();
        }

        console.log('✅ Meilisearch sync fully initialized');

      } catch (error) {
        console.error('❌ Failed to initialize Meilisearch sync:', error);
        
        // Check if it's a CORS/network error
        const isCorsError = error.message && (
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError') ||
          error.message.includes('CORS')
        );

        if (isCorsError) {
          console.log('');
          console.log('═══════════════════════════════════════════════════════════');
          console.log('⚠️  MEILISEARCH CORS CONFIGURATION NEEDED');
          console.log('═══════════════════════════════════════════════════════════');
          console.log('');
          console.log('The Meilisearch server is not accessible from your browser');
          console.log('due to CORS (Cross-Origin Resource Sharing) restrictions.');
          console.log('');
          console.log('🔧 QUICK FIX:');
          console.log('');
          console.log('1. SSH into your server');
          console.log('2. Edit Caddyfile: sudo nano /etc/caddy/Caddyfile');
          console.log('3. Update Access-Control-Allow-Origin to include:');
          console.log('   "http://localhost:5174, http://localhost:5173"');
          console.log('4. Reload Caddy: sudo systemctl reload caddy');
          console.log('');
          console.log('📖 Full instructions: See CORS_FIX_GUIDE.md');
          console.log('');
          console.log('💡 Note: Search from Node.js scripts works fine');
          console.log('   (run: node scripts/test-meilisearch-connection.js)');
          console.log('');
          console.log('═══════════════════════════════════════════════════════════');
          console.log('');
        }
        
        setStatus({
          isIndexing: false,
          isReady: false,
          error: isCorsError ? 'CORS configuration needed on server' : error.message,
          progress: null
        });

        if (onError) {
          onError(error);
        }
      }
    }

    initializeSync();

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up Meilisearch sync...');
      meilisearchSyncManager.cleanup();
    };
  }, [autoStart, skipIfComplete, onProgress, onComplete, onError]);

  return status;
}

/**
 * Manual sync trigger hook
 */
export function useMeilisearchManualSync() {
  const [status, setStatus] = useState({
    isIndexing: false,
    success: false,
    error: null
  });

  const triggerIndexing = async (options = {}) => {
    try {
      setStatus({ isIndexing: true, success: false, error: null });

      const result = await meilisearchSyncManager.performInitialIndexing({
        skipIfComplete: false,
        ...options
      });

      setStatus({
        isIndexing: false,
        success: result.success,
        error: result.error || null
      });

      return result;
    } catch (error) {
      setStatus({
        isIndexing: false,
        success: false,
        error: error.message
      });
      throw error;
    }
  };

  return {
    triggerIndexing,
    ...status
  };
}

export default useMeilisearchSync;
