/**
 * React Query Client Configuration
 * Centralized configuration for data fetching and caching
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 15 minutes (زيادة من 5 إلى 15 دقيقة)
      staleTime: 15 * 60 * 1000,
      // Cache time: 30 minutes (زيادة من 10 إلى 30 دقيقة)
      gcTime: 30 * 60 * 1000,
      // Retry failed requests 2 times (تقليل من 3 إلى 2)
      retry: 2,
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus: false (توفير كبير!)
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      // Retry delay: 1 second
      retryDelay: 1000,
    },
  },
});

// Query Keys Factory
export const queryKeys = {
  // Categories
  categories: {
    all: ['categories'] as const,
    list: () => [...queryKeys.categories.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.categories.all, 'detail', id] as const,
    subjects: (id: string) => [...queryKeys.categories.all, 'subjects', id] as const,
  },
  
  // Subjects
  subjects: {
    all: ['subjects'] as const,
    list: () => [...queryKeys.subjects.all, 'list'] as const,
    byCategory: (categoryId: string) => [...queryKeys.subjects.all, 'byCategory', categoryId] as const,
    detail: (id: string) => [...queryKeys.subjects.all, 'detail', id] as const,
    purposes: (id: string) => [...queryKeys.subjects.all, 'purposes', id] as const,
    search: (id: string, query: string) => 
      [...queryKeys.subjects.all, 'search', id, query] as const,
  },
  
  // Educational Purposes
  purposes: {
    all: ['purposes'] as const,
    list: () => [...queryKeys.purposes.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.purposes.all, 'detail', id] as const,
  },
  
  // Materials
  materials: {
    all: ['materials'] as const,
    list: (params: Record<string, any>) => 
      [...queryKeys.materials.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.materials.all, 'detail', id] as const,
  },
  
  // Posts
  posts: {
    all: ['posts'] as const,
    list: (params: Record<string, any>) => 
      [...queryKeys.posts.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.posts.all, 'detail', id] as const,
  },
  
  // Search
  search: {
    all: ['search'] as const,
    global: (query: string) => [...queryKeys.search.all, 'global', query] as const,
  },
  
  // Bookmarks
  bookmarks: {
    all: ['bookmarks'] as const,
    list: (userId: string) => [...queryKeys.bookmarks.all, 'list', userId] as const,
  },
};

// Prefetch helpers
export const prefetchHelpers = {
  /**
   * Prefetch subject details on hover
   */
  prefetchSubject: async (subjectId: string) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.subjects.detail(subjectId),
      // Query function will be defined in hooks
    });
  },
  
  /**
   * Prefetch category subjects on hover
   */
  prefetchCategorySubjects: async (categoryId: string) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.categories.subjects(categoryId),
      // Query function will be defined in hooks
    });
  },
};
