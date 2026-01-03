/**
 * Library Data Hooks
 * Custom hooks using React Query for server state management
 */

import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import {
  categoriesApi,
  subjectsApi,
  purposesApi,
  materialsApi,
  postsApi,
  searchApi,
  getAllSubjects,
  getAllMaterials,
  getAllPosts,
  fileTypesApi,
  educationalPurposesApi
} from '../api';
import type { Category, Subject, Material, Post, EducationalPurpose } from '../../../types/database';
import * as appwriteConfig from '../../../config/appwrite';
import { cacheManager } from '../utils/indexedDB';

// @ts-ignore - appwrite.js is not typed
const client = appwriteConfig.client;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

/**
 * Query Keys
 */
export const libraryKeys = {
  all: ['library'] as const,
  categories: {
    all: ['library', 'categories'] as const,
    list: () => [...libraryKeys.categories.all, 'list'] as const,
    detail: (id: string) => [...libraryKeys.categories.all, 'detail', id] as const,
    subjects: (id: string) => [...libraryKeys.categories.all, 'subjects', id] as const,
  },
  subjects: {
    all: ['library', 'subjects'] as const,
    list: () => [...libraryKeys.subjects.all, 'list'] as const,
    detail: (id: string) => [...libraryKeys.subjects.all, 'detail', id] as const,
  },
  purposes: {
    all: ['library', 'purposes'] as const,
    list: () => [...libraryKeys.purposes.all, 'list'] as const,
  },
  materials: {
    all: ['library', 'materials'] as const,
    bySubject: (subjectId: string, purposeId?: string) =>
      [...libraryKeys.materials.all, 'bySubject', subjectId, purposeId] as const,
    detail: (id: string) => [...libraryKeys.materials.all, 'detail', id] as const,
  },
  posts: {
    all: ['library', 'posts'] as const,
    bySubject: (subjectId: string, purposeId?: string) =>
      [...libraryKeys.posts.all, 'bySubject', subjectId, purposeId] as const,
  },
  search: {
    all: ['library', 'search'] as const,
    global: (query: string) => [...libraryKeys.search.all, 'global', query] as const,
  },
};

/**
 * Categories Hooks
 */

/**
 * Get all categories
 */
export function useCategories(): UseQueryResult<Category[], Error> {
  return useQuery({
    queryKey: libraryKeys.categories.list(),
    queryFn: () => categoriesApi.getAll(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Get category by ID
 */
export function useCategory(id: string | undefined): UseQueryResult<Category, Error> {
  return useQuery({
    queryKey: libraryKeys.categories.detail(id || ''),
    queryFn: () => categoriesApi.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get subjects for a category
 */
export function useCategorySubjects(categoryId: string | undefined): UseQueryResult<Subject[], Error> {
  return useQuery({
    queryKey: libraryKeys.categories.subjects(categoryId || ''),
    queryFn: () => categoriesApi.getSubjects(categoryId!),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Prefetch category on hover
 */
export function usePrefetchCategory() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: libraryKeys.categories.detail(id),
      queryFn: () => categoriesApi.getById(id),
      staleTime: 5 * 60 * 1000,
    });
  };
}

/**
 * Subjects Hooks
 */

/**
 * Get subject by ID
 */
export function useSubject(id: string | undefined): UseQueryResult<Subject, Error> {
  return useQuery({
    queryKey: libraryKeys.subjects.detail(id || ''),
    queryFn: () => subjectsApi.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get all subjects
 */
export function useSubjects(): UseQueryResult<Subject[], Error> {
  return useQuery({
    queryKey: libraryKeys.subjects.list(),
    queryFn: () => subjectsApi.getAll(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Prefetch subject on hover
 */
export function usePrefetchSubject() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: libraryKeys.subjects.detail(id),
      queryFn: () => subjectsApi.getById(id),
      staleTime: 5 * 60 * 1000,
    });
  };
}

/**
 * Educational Purposes Hooks
 */

/**
 * Get all educational purposes
 */
export function usePurposes(): UseQueryResult<EducationalPurpose[], Error> {
  return useQuery({
    queryKey: libraryKeys.purposes.list(),
    queryFn: () => purposesApi.getAll(),
    staleTime: 15 * 60 * 1000, // 15 minutes (rarely changes)
  });
}

/**
 * Materials Hooks
 */

/**
 * Get materials by subject and optional purpose
 */
export function useMaterials(
  subjectId: string | undefined,
  purposeId?: string
): UseQueryResult<Material[], Error> {
  // ✨ Treat 'all' as undefined to fetch all content without purpose filter
  const actualPurposeId = purposeId === 'all' ? undefined : purposeId;
  
  return useQuery({
    queryKey: libraryKeys.materials.bySubject(subjectId || '', actualPurposeId),
    queryFn: () => materialsApi.getBySubject(subjectId!, actualPurposeId),
    enabled: !!subjectId,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

/**
 * Get material by ID
 */
export function useMaterial(id: string | undefined): UseQueryResult<Material, Error> {
  return useQuery({
    queryKey: libraryKeys.materials.detail(id || ''),
    queryFn: () => materialsApi.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Posts Hooks
 */

/**
 * Get posts by subject and optional purpose
 */
export function usePosts(
  subjectId: string | undefined,
  purposeId?: string
): UseQueryResult<Post[], Error> {
  // ✨ Treat 'all' as undefined to fetch all content without purpose filter
  const actualPurposeId = purposeId === 'all' ? undefined : purposeId;
  
  return useQuery({
    queryKey: libraryKeys.posts.bySubject(subjectId || '', actualPurposeId),
    queryFn: () => postsApi.getBySubject(subjectId!, actualPurposeId),
    enabled: !!subjectId,
    staleTime: 2 * 60 * 1000, // 2 minutes (more dynamic)
  });
}

/**
 * Search Hooks
 */

/**
 * Global search - Level 1 (search everything)
 */
export function useGlobalSearch(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: libraryKeys.search.global(query),
    queryFn: () => searchApi.globalSearch(query),
    enabled: enabled && query.length >= 2,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Category search - Level 2 (search subjects in category)
 */
export function useCategorySearch(
  categoryId: string | undefined,
  query: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['search', 'category', categoryId, query],
    queryFn: () => searchApi.searchInCategory(categoryId!, query),
    enabled: enabled && !!categoryId && query.length >= 2,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Subject search - Level 3 (search materials and posts in subject)
 */
export function useSubjectSearch(
  subjectId: string | undefined,
  query: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['search', 'subject', subjectId, query],
    queryFn: () => searchApi.searchInSubject(subjectId!, query),
    enabled: enabled && !!subjectId && query.length >= 2,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Combined content hook (Materials + Posts)
 */
export function useSubjectContent(
  subjectId: string | undefined,
  purposeId?: string
) {
  const materialsQuery = useMaterials(subjectId, purposeId);
  const postsQuery = usePosts(subjectId, purposeId);

  return {
    materials: materialsQuery.data || [],
    posts: postsQuery.data || [],
    isLoading: materialsQuery.isLoading || postsQuery.isLoading,
    isError: materialsQuery.isError || postsQuery.isError,
    error: materialsQuery.error || postsQuery.error,
  };
}

/**
 * ========================================
 * 🎯 TIERED CACHING HOOKS (NEW)
 * ========================================
 * Optimized hooks using the Hybrid Tiered Caching Architecture
 * - Tier 1: Static data (Cache Forever) - IndexedDB + React Query
 * - Tier 2: Semi-static data (5-10 min) - React Query only
 * - Tier 3: Dynamic data (1-2 min) - React Query only
 */

/**
 * 🟩 TIER 1: Get all categories (IndexedDB + React Query)
 * Replaces old useCategories() with optimized version
 */
export function useTier1Categories(): UseQueryResult<Category[], Error> {
  return useQuery({
    queryKey: ['tier1', 'categories'],
    queryFn: () => categoriesApi.getAll(),
    staleTime: Infinity, // Never stale
    gcTime: Infinity, // Never garbage collected
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

/**
 * 🟩 TIER 1: Get categories WITH subjects count (optimized)
 * Uses "Load All + Link Client-Side" strategy
 */
export function useCategoriesWithSubjects() {
  return useQuery({
    queryKey: ['tier1', 'categoriesWithSubjects'],
    queryFn: () => categoriesApi.getAllWithSubjectsCount(),
    staleTime: 5 * 60 * 1000, // 5 minutes (subjects may change)
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

/**
 * 🟩 TIER 1: Get all file types (IndexedDB + React Query)
 */
export function useTier1FileTypes(): UseQueryResult<any[], Error> {
  return useQuery({
    queryKey: ['tier1', 'fileTypes'],
    queryFn: () => fileTypesApi.getAll(),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

/**
 * 🟩 TIER 1: Get all educational purposes (IndexedDB + React Query)
 */
export function useTier1Purposes(): UseQueryResult<EducationalPurpose[], Error> {
  return useQuery({
    queryKey: ['tier1', 'purposes'],
    queryFn: () => educationalPurposesApi.getAll(),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

/**
 * 🟨 TIER 2: Get ALL subjects (React Query cache only)
 */
export function useTier2Subjects(): UseQueryResult<Subject[], Error> {
  return useQuery<Subject[], Error>({
    queryKey: ['tier2', 'subjects'],
    queryFn: getAllSubjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}

/**
 * 🟦 TIER 3: Get ALL materials (React Query cache only)
 */
export function useTier3Materials(): UseQueryResult<Material[], Error> {
  return useQuery<Material[], Error>({
    queryKey: ['tier3', 'materials'],
    queryFn: getAllMaterials,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

/**
 * 🟦 TIER 3: Get ALL posts (React Query cache only)
 */
export function useTier3Posts(): UseQueryResult<Post[], Error> {
  return useQuery<Post[], Error>({
    queryKey: ['tier3', 'posts'],
    queryFn: getAllPosts,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

/**
 * 🔗 Get subjects for a specific category (using Many-to-Many links)
 * Now uses subject_categories collection instead of categoryId field
 */
export function useSubjectsByCategory(categoryId: string | undefined) {
  const { data: allSubjects, isLoading: subjectsLoading, error: subjectsError } = useTier2Subjects();
  
  // Query subject-category links
  const { data: links, isLoading: linksLoading, error: linksError } = useQuery({
    queryKey: ['subject-categories', 'by-category', categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      
      // @ts-ignore - appwriteService.js is not typed
      const appwriteService = (await import('../../../services/appwriteService')).default;
      return appwriteService.subjectCategories.getByCategory(categoryId);
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const filteredSubjects = useMemo(() => {
    if (!allSubjects || !links || !categoryId) return [];
    
    const subjectIds = links.map((link: any) => link.subjectId);
    return allSubjects.filter(s => subjectIds.includes(s.$id));
  }, [allSubjects, links, categoryId]);

  return {
    data: filteredSubjects,
    isLoading: subjectsLoading || linksLoading,
    error: subjectsError || linksError,
  };
}

/**
 * 🔗 Get materials for a specific subject (filtered client-side)
 */
export function useMaterialsBySubject(subjectId: string | undefined) {
  const { data: materials, isLoading, error } = useTier3Materials();

  const filteredMaterials = useMemo(() => {
    if (!materials || !subjectId) return [];
    return materials.filter(m => m.subjectId === subjectId);
  }, [materials, subjectId]);

  return {
    data: filteredMaterials,
    isLoading,
    error,
  };
}

/**
 * 🔗 Get posts for a specific subject (filtered client-side)
 */
export function usePostsBySubject(subjectId: string | undefined) {
  const { data: posts, isLoading, error } = useTier3Posts();

  const filteredPosts = useMemo(() => {
    if (!posts || !subjectId) return [];
    return posts.filter(p => p.subjectId === subjectId);
  }, [posts, subjectId]);

  return {
    data: filteredPosts,
    isLoading,
    error,
  };
}

/**
 * ========================================
 * 🔄 REALTIME SYNC (NEW)
 * ========================================
 * Listens to Appwrite Realtime events and invalidates caches
 */

/**
 * 🔄 Subscribe to realtime updates for all collections
 * Add this hook to your App component to enable automatic sync
 */
export function useRealtimeSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('🔄 Starting Realtime Sync...');

    // Subscribe to Categories changes (Tier 1)
    const categoriesUnsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${import.meta.env.VITE_APPWRITE_CATEGORIES_COLLECTION_ID}.documents`,
      (response: any) => {
        console.log('🔔 Categories updated:', response.events);
        queryClient.invalidateQueries({ queryKey: ['tier1', 'categories'] });
        queryClient.invalidateQueries({ queryKey: ['tier1', 'categoriesWithSubjects'] });
        cacheManager.clear('categories');
      }
    );

    // Subscribe to FileTypes changes (Tier 1)
    const fileTypesUnsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${import.meta.env.VITE_APPWRITE_FILE_TYPES_COLLECTION_ID}.documents`,
      (response: any) => {
        console.log('🔔 FileTypes updated:', response.events);
        queryClient.invalidateQueries({ queryKey: ['tier1', 'fileTypes'] });
        cacheManager.clear('fileTypes');
      }
    );

    // Subscribe to Educational Purposes changes (Tier 1)
    const purposesUnsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${import.meta.env.VITE_APPWRITE_EDUCATIONAL_PURPOSES_COLLECTION_ID}.documents`,
      (response: any) => {
        console.log('🔔 Educational Purposes updated:', response.events);
        queryClient.invalidateQueries({ queryKey: ['tier1', 'purposes'] });
        cacheManager.clear('educationalPurposes');
      }
    );

    // Subscribe to Subjects changes (Tier 2)
    const subjectsUnsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${import.meta.env.VITE_APPWRITE_SUBJECTS_COLLECTION_ID}.documents`,
      (response: any) => {
        console.log('🔔 Subjects updated:', response.events);
        queryClient.invalidateQueries({ queryKey: ['tier2', 'subjects'] });
        queryClient.invalidateQueries({ queryKey: ['tier1', 'categoriesWithSubjects'] });
      }
    );

    // Subscribe to Materials changes (Tier 3)
    const materialsUnsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${import.meta.env.VITE_APPWRITE_FILES_COLLECTION_ID}.documents`,
      (response: any) => {
        console.log('🔔 Materials updated:', response.events);
        queryClient.invalidateQueries({ queryKey: ['tier3', 'materials'] });
      }
    );

    // Subscribe to Posts changes (Tier 3)
    const postsUnsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID}.documents`,
      (response: any) => {
        console.log('🔔 Posts updated:', response.events);
        queryClient.invalidateQueries({ queryKey: ['tier3', 'posts'] });
      }
    );

    // Cleanup subscriptions on unmount
    return () => {
      console.log('🛑 Stopping Realtime Sync...');
      categoriesUnsubscribe();
      fileTypesUnsubscribe();
      purposesUnsubscribe();
      subjectsUnsubscribe();
      materialsUnsubscribe();
      postsUnsubscribe();
    };
  }, [queryClient]);
}
