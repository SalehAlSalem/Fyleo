/**
 * Hooks Layer Exports
 * Centralized export for all custom hooks
 */

// Legacy hooks (still supported)
export {
  useCategories,
  useCategory,
  useCategorySubjects,
  useSubject,
  useSubjects,
  usePurposes,
  useMaterials,
  useMaterial,
  usePosts,
  useGlobalSearch,
  useCategorySearch,
  useSubjectSearch,
  useSubjectContent,
  usePrefetchCategory,
  usePrefetchSubject,
} from './useLibraryData';

// New Tiered Architecture Hooks (Recommended)
export {
  // Tier 1: Static Data (Cache Forever)
  useTier1Categories,
  useTier1FileTypes,
  useTier1Purposes,
  
  // Tier 2: Semi-Static Data (5-10 min cache)
  useTier2Subjects,
  
  // Tier 3: Dynamic Data (1-2 min cache)
  useTier3Materials,
  useTier3Posts,
  
  // Linked Data Hooks
  useCategoriesWithSubjects,
  useMaterialsBySubject,
  usePostsBySubject,
  useSubjectsByCategory,
  
  // Realtime Sync
  useRealtimeSync,
} from './useLibraryData';
