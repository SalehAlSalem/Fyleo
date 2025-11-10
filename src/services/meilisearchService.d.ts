/**
 * TypeScript declarations for Meilisearch Service
 */

export interface SearchOptions {
  limit?: number;
  sort?: string[];
}

export interface AdvancedSearchFilters {
  subjectId?: string;
  categoryIds?: string[];
  fileTypeId?: string;
  year?: string;
}

export interface AdvancedSearchOptions extends SearchOptions {
  index?: string;
}

export interface SearchResult<T> {
  hits: T[];
  estimatedTotalHits?: number;
  processingTimeMs?: number;
}

export interface GlobalSearchResults {
  categories: any[];
  subjects: any[];
  materials: any[];
  posts: any[];
}

export interface CategorySearchResults {
  subjects: any[];
  materials: any[];
  posts: any[];
}

export interface SubjectSearchResults {
  materials: any[];
  posts: any[];
}

declare const meilisearchService: {
  globalSearch(query: string, options?: SearchOptions): Promise<GlobalSearchResults>;
  
  searchInCategory(categoryId: string, query: string, options?: SearchOptions): Promise<CategorySearchResults>;
  
  searchInSubject(subjectId: string, query: string, options?: SearchOptions): Promise<SubjectSearchResults>;
  
  advancedSearch(
    query: string, 
    filters?: AdvancedSearchFilters, 
    options?: AdvancedSearchOptions
  ): Promise<SearchResult<any>>;
  
  autocomplete(query: string, index?: string, limit?: number): Promise<any[]>;
  
  healthCheck(): Promise<{ status: string }>;
  
  getIndexStats(indexName: string): Promise<any>;
};

export default meilisearchService;
