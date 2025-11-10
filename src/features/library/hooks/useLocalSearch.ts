/**
 * 🔍 Local Search Handler Hook
 * Custom hook for managing local fuzzy search with Fuse.js
 * Provides search functionality without network requests
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
// @ts-ignore - localCache is a JS module
import localCache from '@/data/localCache';
// @ts-ignore - fuzzySearch is a JS module
import {
  createCategorySearch,
  createSubjectSearch,
  createMaterialSearch,
  createPostSearch,
  performFuzzySearch,
  generateSuggestions
} from '@/utils/fuzzySearch';

export interface SearchResults {
  categories: any[];
  subjects: any[];
  materials: any[];
  posts: any[];
}

export function useLocalSearch(categoryId?: string | null, subjectId?: string | null) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResults>({
    categories: [],
    subjects: [],
    materials: [],
    posts: []
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Initialize cache on mount
  useEffect(() => {
    if (!localCache.isInitialized()) {
      localCache.init()
        .then(() => {
          setIsInitialized(true);
          console.log('✅ Local cache initialized for search');
        })
        .catch((error: unknown) => {
          console.error('❌ Failed to initialize cache:', error);
        });
    } else {
      setIsInitialized(true);
    }
  }, []);

  // Create Fuse search instances with context filtering
  const searchInstances = useMemo(() => {
    if (!isInitialized) return null;

    // Filter data based on context
    let categories = localCache.getCategories();
    let subjects = localCache.getSubjects();
    let materials = localCache.getMaterials();
    let posts = localCache.getPosts();
    const links = localCache.getSubjectCategoryLinks();

    // Level 3: Inside a subject - only search materials and posts for this subject
    if (subjectId) {
      categories = [];
      subjects = [];
      materials = materials.filter((m: any) => m.subjectId === subjectId);
      posts = posts.filter((p: any) => p.subjectId === subjectId);
    }
    // Level 2: Inside a category - only search subjects, materials, and posts for this category
    else if (categoryId) {
      categories = [];
      
      // Get subject IDs linked to this category using many-to-many relationship
      const categoryLinks = links.filter((link: any) => link.categoryId === categoryId);
      const subjectIds = categoryLinks.map((link: any) => link.subjectId);
      
      // Filter subjects by IDs from links
      subjects = subjects.filter((s: any) => subjectIds.includes(s.$id));
      
      // Filter materials and posts by these subject IDs
      materials = materials.filter((m: any) => subjectIds.includes(m.subjectId));
      posts = posts.filter((p: any) => subjectIds.includes(p.subjectId));
    }
    // Level 1: Global search - search everything

    return {
      categorySearch: createCategorySearch(categories),
      subjectSearch: createSubjectSearch(subjects),
      materialSearch: createMaterialSearch(materials),
      postSearch: createPostSearch(posts)
    };
  }, [isInitialized, categoryId, subjectId]);

  // Perform search
  const search = useCallback((query: string) => {
    if (!query || query.length < 2) {
      setResults({ categories: [], subjects: [], materials: [], posts: [] });
      setSuggestions([]);
      return;
    }

    if (!searchInstances) {
      console.warn('Search instances not ready yet');
      return;
    }

    setIsSearching(true);

    try {
      // Perform fuzzy search
      const searchResults = performFuzzySearch(query, searchInstances, 10);

      // Update results
      setResults({
        categories: searchResults.categories,
        subjects: searchResults.subjects,
        materials: searchResults.materials,
        posts: searchResults.posts
      });

      // Generate suggestions if results are poor
      const totalResults =
        searchResults.categories.length +
        searchResults.subjects.length +
        searchResults.materials.length +
        searchResults.posts.length;

      if (totalResults < 3 && searchResults._raw) {
        const smartSuggestions = generateSuggestions(searchResults._raw, query);
        setSuggestions(smartSuggestions);
      } else {
        setSuggestions([]);
      }

      console.log('🔍 Search completed:', {
        query,
        totalResults,
        suggestions: suggestions.length
      });
    } catch (error) {
      console.error('Search error:', error);
      setResults({ categories: [], subjects: [], materials: [], posts: [] });
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchInstances]);

  return {
    isInitialized,
    isSearching,
    results,
    suggestions,
    search
  };
}
