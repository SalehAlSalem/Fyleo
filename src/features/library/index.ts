/**
 * Library Feature - Main Export
 * Feature-Sliced Design (FSD) Architecture
 * 
 * This is the public API of the Library feature.
 * Only export what other features need to use.
 */

// Pages
export { LibraryPage } from './pages';

// Components (if needed by other features)
export {
  CategoryCard,
  SubjectCard,
  MaterialCard,
  SearchBar,
  PurposeTabs,
  LoaderSkeleton,
  Breadcrumb,
  EmptyState,
  ErrorState,
} from './components';

// Hooks (if needed by other features)
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
  useSubjectContent,
} from './hooks';

// API (usually not exported, but available if needed)
export {
  categoriesApi,
  subjectsApi,
  purposesApi,
  materialsApi,
  postsApi,
  searchApi,
} from './api';
