/**
 * Type declarations for appwriteService.js
 */

export interface Material {
  $id: string;
  title: string;
  description?: string;
  fileId: string;
  fileName: string;
  fileSize: number;
  downloadURL?: string;
  viewURL?: string;
  uploaderId: string;
  subjectId: string;
  fileTypeId: string;
  tags?: string[] | null;
  $createdAt: string;
  $updatedAt: string;
}

export interface Post {
  $id: string;
  subjectId: string;
  uploaderId: string;
  contentText?: string;
  linkURL?: string;
  educationalPurposeId?: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface Bookmark {
  $id: string;
  userId: string;
  fileId: string;
  $createdAt: string;
}

export interface Download {
  $id: string;
  userId: string;
  fileId: string;
  downloadedAt: string;
}

export const materialsService: {
  create(data: Partial<Material>): Promise<Material>;
  update(id: string, data: Partial<Material>): Promise<Material>;
  delete(id: string): Promise<boolean>;
  getById(id: string): Promise<Material>;
  list(filters?: any): Promise<Material[]>;
};

export const postsService: {
  create(data: Partial<Post>): Promise<Post>;
  update(id: string, data: Partial<Post>): Promise<Post>;
  delete(id: string): Promise<boolean>;
  getById(id: string): Promise<Post>;
  list(filters?: any): Promise<Post[]>;
};

export const bookmarksService: {
  create(fileId: string): Promise<Bookmark>;
  getByUser(userId: string, limit?: number): Promise<Bookmark[]>;
  getByUserAndFile(userId: string, fileId: string): Promise<Bookmark | null>;
  delete(bookmarkId: string): Promise<boolean>;
  toggle(fileId: string): Promise<{ bookmarked: boolean; bookmarkId: string | null }>;
  isBookmarked(fileId: string): Promise<boolean>;
  list(): Promise<Bookmark[]>;
};

export const downloadsService: {
  create(fileId: string): Promise<Download>;
  getCountByFile(fileId: string): Promise<number>;
  list(): Promise<Download[]>;
};

export const fileTypesService: {
  list(): Promise<any[]>;
  getById(id: string): Promise<any>;
};

export const educationalPurposesService: {
  list(): Promise<any[]>;
  getById(id: string): Promise<any>;
};

export interface SubjectCategoryLink {
  $id: string;
  subjectId: string;
  categoryId: string;
  $createdAt?: string;
  $updatedAt?: string;
}

export const subjectCategoriesService: {
  getBySubject(subjectId: string): Promise<SubjectCategoryLink[]>;
  getByCategory(categoryId: string): Promise<SubjectCategoryLink[]>;
  create(subjectId: string, categoryId: string): Promise<SubjectCategoryLink>;
  remove(linkId: string): Promise<boolean>;
  removeAllBySubject(subjectId: string): Promise<number>;
  removeAllByCategory(categoryId: string): Promise<number>;
};

declare const appwriteService: {
  materials: typeof materialsService;
  posts: typeof postsService;
  bookmarks: typeof bookmarksService;
  downloads: typeof downloadsService;
  fileTypes: typeof fileTypesService;
  educationalPurposes: typeof educationalPurposesService;
  subjectCategories: typeof subjectCategoriesService;
  [key: string]: any;
};

export default appwriteService;
