/**
 * Type declarations for StorageService.js
 */

export interface UploadOptions {
  title?: string;
  description?: string;
  subjectId?: string;
  fileTypeId?: string;
  educationalPurposeId?: string;
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  fileId: string;
  downloadURL: string;
  viewURL: string;
  previewURL: string;
  fileName: string;
  size: number;
  mimeType: string;
}

export const StorageService: {
  uploadFile(file: File, options?: UploadOptions): Promise<UploadResult>;
  deleteFile(fileId: string): Promise<boolean>;
  getPublicURL(fileId: string): string;
  getFileDownload(fileId: string): Promise<string | null>;
  getFileView(fileId: string): string;
  getFilePreview(fileId: string): string;
  isValidFileType(mimeType: string): boolean;
  isValidFileSize(size: number): boolean;
};
