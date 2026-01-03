/**
 * Content Helpers - Sorting, Grouping, and View Utilities
 * Smart data transformation for Library Level 3
 */

import type { Material, Post, FileType, EducationalPurpose } from '../../../types/database';

// ===== TYPES =====

export type SortBy = 'date' | 'name' | 'size' | 'downloads' | 'uploader';
export type SortOrder = 'asc' | 'desc';
export type GroupBy = 'type' | 'date' | 'uploader' | 'purpose' | 'none';
export type ViewMode = 'grid' | 'list' | 'compact';

export interface EnrichedMaterial extends Material {
  fileType?: FileType;
  purpose?: EducationalPurpose;
}

export interface EnrichedPost extends Post {
  fileType?: FileType;
  purpose?: EducationalPurpose;
}

export type EnrichedContent = EnrichedMaterial | EnrichedPost;

export interface GroupedData {
  groupName: string;
  groupIcon: string;
  items: EnrichedContent[];
}

// ===== LABELS =====

export const getSortLabel = (sortBy: SortBy, order: SortOrder, isArabic: boolean): string => {
  const labels = {
    date: { asc: { en: 'Oldest First', ar: 'الأقدم أولاً' }, desc: { en: 'Newest First', ar: 'الأحدث أولاً' } },
    name: { asc: { en: 'A → Z', ar: 'أ → ي' }, desc: { en: 'Z → A', ar: 'ي → أ' } },
    size: { asc: { en: 'Smallest', ar: 'الأصغر' }, desc: { en: 'Largest', ar: 'الأكبر' } },
    downloads: { asc: { en: 'Least Popular', ar: 'الأقل تحميلاً' }, desc: { en: 'Most Popular', ar: 'الأكثر تحميلاً' } },
    uploader: { asc: { en: 'A → Z', ar: 'أ → ي' }, desc: { en: 'Z → A', ar: 'ي → أ' } },
  };
  
  return labels[sortBy][order][isArabic ? 'ar' : 'en'];
};

export const getGroupLabel = (groupBy: GroupBy, isArabic: boolean): string => {
  const labels = {
    type: { en: 'File Type', ar: 'نوع الملف' },
    date: { en: 'Date', ar: 'التاريخ' },
    uploader: { en: 'Uploader', ar: 'الناشر' },
    purpose: { en: 'Purpose', ar: 'الغرض' },
    none: { en: 'No Grouping', ar: 'بدون تجميع' },
  };
  
  return labels[groupBy][isArabic ? 'ar' : 'en'];
};

// ===== SORTING =====

export const sortContent = (
  content: EnrichedContent[],
  sortBy: SortBy,
  order: SortOrder
): EnrichedContent[] => {
  const sorted = [...content].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime();
        break;

      case 'name':
        const nameA = 'title' in a ? a.title : a.contentText || '';
        const nameB = 'title' in b ? b.title : b.contentText || '';
        comparison = nameA.localeCompare(nameB);
        break;

      case 'size':
        const sizeA = 'fileSize' in a ? a.fileSize : 0;
        const sizeB = 'fileSize' in b ? b.fileSize : 0;
        comparison = sizeA - sizeB;
        break;

      case 'downloads':
        const downloadsA = 'downloadCount' in a ? (a.downloadCount || 0) : 0;
        const downloadsB = 'downloadCount' in b ? (b.downloadCount || 0) : 0;
        comparison = downloadsA - downloadsB;
        break;

      case 'uploader':
        const uploaderA = (a as any).uploaderName || '';
        const uploaderB = (b as any).uploaderName || '';
        comparison = uploaderA.localeCompare(uploaderB);
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
};

// ===== GROUPING =====

export const groupContent = (
  content: EnrichedContent[],
  groupBy: GroupBy,
  isArabic: boolean
): GroupedData[] => {
  if (groupBy === 'none') {
    return [{
      groupName: isArabic ? 'جميع الملفات' : 'All Files',
      groupIcon: '📁',
      items: content,
    }];
  }

  const groups: Record<string, EnrichedContent[]> = {};

  content.forEach((item) => {
    let key: string;

    switch (groupBy) {
      case 'type':
        // Special handling for Posts/Links without fileType
        if (!('fileSize' in item)) {
          // It's a Post
          if (item.fileType) {
            key = isArabic ? item.fileType.nameAr : item.fileType.nameEn;
          } else {
            // Post without fileType - show as "Links & Posts"
            key = isArabic ? 'روابط ومنشورات' : 'Links & Posts';
          }
        } else {
          // It's a Material
          key = item.fileType ? (isArabic ? item.fileType.nameAr : item.fileType.nameEn) : (isArabic ? 'غير مصنف' : 'Uncategorized');
        }
        break;

      case 'date':
        const date = new Date(item.$createdAt);
        key = date.toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long' });
        break;

      case 'uploader':
        key = (item as any).uploaderName || (isArabic ? 'غير معروف' : 'Unknown');
        break;

      case 'purpose':
        key = item.purpose ? (isArabic ? item.purpose.nameAr : item.purpose.nameEn) : (isArabic ? 'غير مصنف' : 'Uncategorized');
        break;

      default:
        key = isArabic ? 'أخرى' : 'Other';
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  });

  // Convert to array and sort group names
  return Object.entries(groups)
    .map(([groupName, items]) => ({
      groupName,
      groupIcon: groups[groupName][0] ? getGroupIcon(groups[groupName][0], groupBy) : '📁',
      items,
    }))
    .sort((a, b) => a.groupName.localeCompare(b.groupName));
};

const getGroupIcon = (item: EnrichedContent, groupBy: GroupBy): string => {
  switch (groupBy) {
    case 'type':
      return item.fileType?.icon || '📄';
    case 'date':
      return '📅';
    case 'uploader':
      return '👤';
    case 'purpose':
      return item.purpose?.icon || '📑';
    default:
      return '📦';
  }
};
