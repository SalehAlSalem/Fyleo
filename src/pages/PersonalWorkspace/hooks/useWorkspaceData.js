/**
 * Personal Workspace Data Hooks
 * Uses React Query + Realtime Sync (similar to Library system)
 * 
 * Benefits:
 * - No page reloads needed
 * - Automatic sync when data changes
 * - Local state updates
 * - Optimistic updates
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { materialsService, postsService, bookmarksService, downloadsService } from '../../../services/appwriteService';
import { client } from '../../../config/appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const FILES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_FILES_COLLECTION_ID;
const POSTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID;
const BOOKMARKS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_BOOKMARKS_COLLECTION_ID;
const DOWNLOADS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_DOWNLOADS_COLLECTION_ID;

/**
 * Query Keys
 */
export const workspaceKeys = {
  all: ['workspace'],
  materials: (userId) => ['workspace', 'materials', userId],
  posts: (userId) => ['workspace', 'posts', userId],
  bookmarks: (userId) => ['workspace', 'bookmarks', userId],
  downloads: (userId) => ['workspace', 'downloads', userId],
};

/**
 * Get user's materials/files
 */
export function useUserMaterials(userId) {
  return useQuery({
    queryKey: workspaceKeys.materials(userId),
    queryFn: () => materialsService.getByUploader(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Get user's posts/links
 */
export function useUserPosts(userId) {
  return useQuery({
    queryKey: workspaceKeys.posts(userId),
    queryFn: () => postsService.getByUploader(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Get user's bookmarks
 */
export function useUserBookmarks(userId) {
  return useQuery({
    queryKey: workspaceKeys.bookmarks(userId),
    queryFn: () => bookmarksService.getByUser(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Get user's downloads
 */
export function useUserDownloads(userId) {
  return useQuery({
    queryKey: workspaceKeys.downloads(userId),
    queryFn: () => downloadsService.getByUser(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * 🔄 Realtime Sync for Personal Workspace
 * Automatically updates data when changes occur in Appwrite
 */
export function useWorkspaceRealtimeSync(userId) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    console.log('🔄 Starting Workspace Realtime Sync for user:', userId);

    // Subscribe to Materials/Files changes
    const materialsUnsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${FILES_COLLECTION_ID}.documents`,
      (response) => {
        console.log('🔔 Materials updated:', response.events);
        // Check if it's the current user's file
        const payload = response.payload;
        if (payload.uploaderId === userId) {
          console.log('✅ Current user\'s file updated, refreshing...');
          queryClient.invalidateQueries({ queryKey: workspaceKeys.materials(userId) });
        }
      }
    );

    // Subscribe to Posts/Links changes
    const postsUnsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${POSTS_COLLECTION_ID}.documents`,
      (response) => {
        console.log('🔔 Posts updated:', response.events);
        const payload = response.payload;
        if (payload.uploaderId === userId) {
          console.log('✅ Current user\'s post updated, refreshing...');
          queryClient.invalidateQueries({ queryKey: workspaceKeys.posts(userId) });
        }
      }
    );

    // Subscribe to Bookmarks changes
    const bookmarksUnsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${BOOKMARKS_COLLECTION_ID}.documents`,
      (response) => {
        console.log('🔔 Bookmarks updated:', response.events);
        const payload = response.payload;
        if (payload.userId === userId) {
          console.log('✅ Current user\'s bookmark updated, refreshing...');
          queryClient.invalidateQueries({ queryKey: workspaceKeys.bookmarks(userId) });
        }
      }
    );

    // Subscribe to Downloads changes
    const downloadsUnsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${DOWNLOADS_COLLECTION_ID}.documents`,
      (response) => {
        console.log('🔔 Downloads updated:', response.events);
        const payload = response.payload;
        if (payload.userId === userId) {
          console.log('✅ Current user\'s download updated, refreshing...');
          queryClient.invalidateQueries({ queryKey: workspaceKeys.downloads(userId) });
        }
      }
    );

    // Cleanup subscriptions
    return () => {
      console.log('🛑 Stopping Workspace Realtime Sync...');
      materialsUnsubscribe();
      postsUnsubscribe();
      bookmarksUnsubscribe();
      downloadsUnsubscribe();
    };
  }, [userId, queryClient]);
}

/**
 * Get all workspace data at once
 */
export function useWorkspaceData(userId) {
  const materials = useUserMaterials(userId);
  const posts = useUserPosts(userId);
  const bookmarks = useUserBookmarks(userId);
  const downloads = useUserDownloads(userId);

  console.log('🔍 useWorkspaceData Debug:', {
    userId,
    materials: { data: materials.data, loading: materials.isLoading, error: materials.error },
    posts: { data: posts.data, loading: posts.isLoading, error: posts.error },
    bookmarks: { data: bookmarks.data, loading: bookmarks.isLoading, error: bookmarks.error },
    downloads: { data: downloads.data, loading: downloads.isLoading, error: downloads.error },
  });

  return {
    materials: materials.data || [],
    posts: posts.data || [],
    bookmarks: bookmarks.data || [],
    downloads: downloads.data || [],
    isLoading: materials.isLoading || posts.isLoading || bookmarks.isLoading || downloads.isLoading,
    isError: materials.isError || posts.isError || bookmarks.isError || downloads.isError,
    error: materials.error || posts.error || bookmarks.error || downloads.error,
  };
}
