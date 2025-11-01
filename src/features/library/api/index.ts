/**
 * API Layer Exports
 * Centralized export for all API services
 */

// Legacy APIs (still supported)
export {
  categoriesApi,
  subjectsApi,
  purposesApi,
  materialsApi,
  postsApi,
  searchApi,
} from './libraryApi';

// New Tiered Architecture APIs
export {
  fileTypesApi,
  educationalPurposesApi,
  getAllSubjects,
  getAllMaterials,
  getAllPosts,
} from './libraryApi';
