/**
 * Database Types for Fyleo Platform
 * Based on Appwrite Collections Schema
 */

// Base Appwrite Document
export interface AppwriteDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions?: string[];
}

// User
export interface User extends AppwriteDocument {
  name: string;
  email: string;
}

// User Profile
export interface UserProfile extends AppwriteDocument {
  userId: string;
  bio?: string;
  profilePicture?: string;
  website?: string;
  dateOfBirth?: string;
  location?: string;
  gender?: string;
  university?: string;
  major?: string;
  semester?: string;
}

// Category
export interface Category extends AppwriteDocument {
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  icon: string;
  color: string;
  order?: number;
  isActive: boolean;
  slug?: string;
  // Computed fields (not in DB)
  subjectsCount?: number;
  materialsCount?: number;
  subjects?: Subject[];
}

// Subject
export interface Subject extends AppwriteDocument {
  categoryId: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  creditHours: number;
  level: number;
  prerequisite?: string;
  isActive: boolean;
  // Computed fields (not in DB)
  materialsCount?: number;
  postsCount?: number;
  category?: Category;
  materials?: Material[];
  recentFiles?: Material[];
}

// Educational Purpose
export interface EducationalPurpose extends AppwriteDocument {
  nameAr: string;
  nameEn: string;
  icon: string;
  isLinkAllowed: boolean;
  order?: number;
  isActive?: boolean;
}

// File Type
export interface FileType extends AppwriteDocument {
  name: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  color: string;
  allowedFormats: string[];
  educationalPurposeId?: string;
}

// Material
export interface Material extends AppwriteDocument {
  uploaderId: string;
  title: string;
  description?: string;
  fileId: string;
  fileName: string;
  fileSize: number;
  mimeType?: string;
  downloadURL?: string;
  viewURL?: string;
  subjectId: string;
  categoryId?: string;
  fileTypeId: string;
  educationalPurposeId?: string;
  tags?: string[];
  semester?: string;
  year?: string;
  downloads?: number;
  downloadCount?: number;
  // Computed fields
  uploader?: User;
  subject?: Subject;
  fileType?: FileType;
  educationalPurpose?: EducationalPurpose;
}

// Post
export interface Post extends AppwriteDocument {
  subjectId: string;
  uploaderId: string;
  contentText?: string;
  linkURL?: string;
  educationalPurposeId?: string;
  // Computed fields
  uploader?: User;
  subject?: Subject;
  educationalPurpose?: EducationalPurpose;
}

// Bookmark
export interface Bookmark extends AppwriteDocument {
  userId: string;
  fileId: string;
}

// Download
export interface Download extends AppwriteDocument {
  userId: string;
  fileId: string;
  downloadedAt?: string;
}

// Unified Content Item (Material or Post)
export interface ContentItem {
  id: string;
  type: 'material' | 'post';
  title: string;
  description?: string;
  icon: string;
  meta: {
    uploader?: string;
    uploaderName?: string;
    fileSize?: number;
    createdAt: string;
    fileType?: string;
    educationalPurpose?: string;
  };
  actions: {
    canView: boolean;
    canDownload: boolean;
    canOpenLink: boolean;
    viewURL?: string;
    downloadURL?: string;
    linkURL?: string;
  };
  original: Material | Post;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface SearchResults {
  categories: Category[];
  subjects: Subject[];
  materials: Material[];
  posts: Post[];
}

// API Query Parameters
export interface MaterialsQueryParams {
  subjectId?: string;
  educationalPurposeId?: string;
  fileTypeId?: string;
  page?: number;
  limit?: number;
  q?: string;
}

export interface PostsQueryParams {
  subjectId?: string;
  educationalPurposeId?: string;
  page?: number;
  limit?: number;
  q?: string;
}

export interface SearchQueryParams {
  q: string;
  limit?: number;
}

// Localized Content Helper Type
export interface LocalizedField {
  nameAr?: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
}

export type Locale = 'ar' | 'en';
