# 🔄 Subject-Categories Migration Guide

## Overview
تم تحويل العلاقة بين المواد والفئات من **One-to-Many** إلى **Many-to-Many** لدعم المواد التي تنتمي لعدة فئات.

## ✅ Completed Changes

### 1. Environment Variables
**✅ Added to `.env` and `.env.example`:**
```bash
VITE_APPWRITE_SUBJECT_CATEGORIES_COLLECTION_ID="subject_categories"
```

### 2. Appwrite Configuration
**✅ Updated `src/config/appwrite.js`:**
```javascript
export const SUBJECT_CATEGORIES_COLLECTION_ID = 
  import.meta.env.VITE_APPWRITE_SUBJECT_CATEGORIES_COLLECTION_ID || 'subject_categories';
```

### 3. New Service: `subjectCategoriesService`
**✅ Added to `src/services/appwriteService.js`:**

#### Methods:
- `getBySubject(subjectId)` - Get all categories for a subject
- `getByCategory(categoryId)` - Get all subjects in a category
- `create(subjectId, categoryId)` - Link subject to category (with duplicate prevention)
- `remove(linkId)` - Remove specific link
- `removeAllBySubject(subjectId)` - Remove all links for a subject (cascade delete)
- `removeAllByCategory(categoryId)` - Remove all links for a category (cascade delete)

#### Example Usage:
```javascript
import appwriteService from '@/services/appwriteService';

// Get all categories for a subject
const links = await appwriteService.subjectCategories.getBySubject(subjectId);

// Get all subjects in a category
const subjects = await appwriteService.subjectCategories.getByCategory(categoryId);

// Link subject to category
await appwriteService.subjectCategories.create(subjectId, categoryId);

// Remove link
await appwriteService.subjectCategories.remove(linkId);
```

### 4. TypeScript Declarations
**✅ Added to `src/services/appwriteService.d.ts`:**
```typescript
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
```

### 5. Admin Panel Updates
**✅ Updated `src/pages/AdminPage/SubjectsManagement.jsx`:**

#### Changes:
- ❌ Removed: `categoryId` from `formData`
- ✅ Added: `selectedCategories` array state
- ✅ Added: `subjectCategoryLinks` cache for filtering
- ✅ Replaced: Single category dropdown → Multi-select with tags UI
- ✅ Updated: `handleSubmit` to create/delete links on save
- ✅ Updated: `handleEdit` to load existing category links
- ✅ Updated: `handleDelete` to cascade delete links
- ✅ Updated: Category filter to use link-based queries
- ✅ Updated: Subject cards to display all categories as badges

#### UI Features:
- 🏷️ Selected categories shown as tags with "×" remove button
- ➕ Dropdown to add new categories (filters out already selected)
- 📊 Category filter buttons show accurate subject counts
- ⚠️ Validation: At least one category must be selected
- 🔄 Automatic reload of links after create/edit/delete

### 6. Library API Updates
**✅ Updated `src/features/library/api/libraryApi.ts`:**

#### Changes:
- ✅ Imported `appwriteService` for accessing `subjectCategories`
- ✅ Updated `categoriesApi.getSubjects()`:
  - Now fetches links via `getByCategory(categoryId)`
  - Extracts subject IDs from links
  - Queries subjects by ID list instead of `categoryId` field
- ✅ Updated `categoriesApi.getAllWithSubjectsCount()`:
  - Counts subjects via links instead of filtering by `categoryId`
  - Uses Promise.all for parallel link fetching
- ✅ Updated `searchApi.searchInCategory()`:
  - Filters subjects using links before searching materials/posts

### 7. Library Hooks Updates
**✅ Updated `src/features/library/hooks/useLibraryData.ts`:**

#### Changes:
- ✅ Updated `useSubjectsByCategory()`:
  - Added new React Query for fetching subject-category links
  - Filters subjects client-side using link-derived subject IDs
  - Combines loading states from both subjects and links queries
  - 5-minute cache for links (same as subjects)

### 8. Library Navigation Updates
**✅ Updated `src/features/library/pages/LibraryPage.tsx`:**

#### Changes:
- ✅ Updated `handleSubjectClick()`:
  - If `categoryId` exists in URL → use it (normal case)
  - If no `categoryId` → fetch subject's categories via `getBySubject()`
  - Uses first category for URL if subject has multiple
  - Error handling for subjects with no categories

## Required Database Setup

### ⚠️ TODO: Create Collection in Appwrite Console

1. Go to **Databases** → **Create Collection**
2. **Collection ID**: `subject_categories`
3. **Name**: Subject Categories

### Attributes:
| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| `subjectId` | String | 36 | ✅ Yes | - | No |
| `categoryId` | String | 36 | ✅ Yes | - | No |

### Indexes:
| Key | Type | Attributes | Order |
|-----|------|------------|-------|
| `subject_idx` | key | `subjectId` | ASC |
| `category_idx` | key | `categoryId` | ASC |
| `unique_link` | unique | `subjectId`, `categoryId` | ASC, ASC |

### Permissions:
- **Read**: `Any`
- **Create**: `role:admin`, `role:content_manager`
- **Update**: `role:admin`, `role:content_manager`
- **Delete**: `role:admin`, `role:content_manager`

## ⚠️ TODO: Data Migration

### Migration Script (Run Once):
```javascript
// Migrate existing categoryId to subject_categories links
import appwriteService from './src/services/appwriteService';

async function migrateSubjectCategories() {
  try {
    const subjects = await appwriteService.subjects.getAll();
    let migrated = 0;
    let errors = 0;
    
    for (const subject of subjects) {
      if (subject.categoryId) {
        try {
          await appwriteService.subjectCategories.create(
            subject.$id, 
            subject.categoryId
          );
          migrated++;
          console.log(`✅ Migrated: ${subject.nameEn}`);
        } catch (error) {
          errors++;
          console.error(`❌ Error migrating ${subject.nameEn}:`, error);
        }
      }
    }
    
    console.log(`\n✅ Migration Complete:`);
    console.log(`   - Migrated: ${migrated} subjects`);
    console.log(`   - Errors: ${errors}`);
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run migration
migrateSubjectCategories();
```

### Migration Steps:
1. ✅ **Backup Database** (via Appwrite Console)
2. ⚠️ **Test Migration** on 5-10 subjects first
3. ⚠️ **Run Full Migration** on all subjects
4. ⚠️ **Verify** all subjects have at least one link
5. ⚠️ **Optional:** Remove `categoryId` field from `subjects` collection (after confirming everything works)

## Testing Checklist

### ⚠️ TODO: Test All Features
- [ ] **Admin Panel - Create**:
  - [ ] Can select multiple categories
  - [ ] Tags show correctly
  - [ ] Can remove category via "×" button
  - [ ] Validation prevents saving without categories
  - [ ] Links created successfully in database

- [ ] **Admin Panel - Edit**:
  - [ ] Existing categories load correctly
  - [ ] Can add new categories
  - [ ] Can remove existing categories
  - [ ] Changes saved correctly (old links deleted, new links created)

- [ ] **Admin Panel - Delete**:
  - [ ] Subject deleted successfully
  - [ ] All links cascade deleted
  - [ ] No orphaned links remain

- [ ] **Admin Panel - Filter**:
  - [ ] "All" shows all subjects
  - [ ] "Uncategorized" shows subjects with no links
  - [ ] Category filters show correct subjects
  - [ ] Subject counts accurate on filter buttons

- [ ] **Library - Navigation**:
  - [ ] Subject appears under all linked categories
  - [ ] Click subject → navigates correctly
  - [ ] Breadcrumbs show correct category
  - [ ] URL format: `/library/{categoryId}/{subjectId}`

- [ ] **Library - Search**:
  - [ ] Global search finds subjects with multiple categories
  - [ ] Category search filters correctly by links
  - [ ] Search results show all relevant subjects

- [ ] **Library - Display**:
  - [ ] Category subject counts accurate
  - [ ] Explorer shows subjects in correct categories
  - [ ] Same subject can appear in multiple categories

## Architecture Changes

### Before (One-to-Many):
```
Category (1) ────────> (N) Subject
                categoryId field
```

### After (Many-to-Many):
```
Category (N) ←───→ subject_categories ←───→ (N) Subject
                   subjectId + categoryId
```

### Benefits:
- ✅ Subjects can belong to multiple categories
- ✅ Better content organization and discoverability
- ✅ More flexible categorization
- ✅ Cascade delete maintains referential integrity
- ✅ Duplicate prevention in link creation

### Considerations:
- ⚠️ Slightly higher query overhead (need link lookup)
- ⚠️ Migration required for existing data
- ⚠️ Old `categoryId` field may need removal after migration
- ⚠️ Navigation URL uses first category (if multiple)

## Rollback Plan

If issues occur:
1. Keep old `categoryId` field in `subjects` collection
2. Disable new multi-select UI in admin
3. Use `categoryId` as fallback in library filters
4. Delete `subject_categories` collection

## Performance Notes

- Link queries cached for 5 minutes (React Query)
- Admin panel caches all links on load
- Parallel queries for multiple subjects (Promise.all)
- Query limits: 100 for subjects, 1000 for categories

## Code Quality

- ✅ 0 TypeScript errors
- ✅ 0 ESLint errors (except CSS Tailwind warnings - normal)
- ✅ Full TypeScript declarations
- ✅ Error handling in all service methods
- ✅ Console logging for debugging
- ✅ Consistent code patterns with existing services

---

**Status**: ✅ **Backend Complete** | ⚠️ **Database Setup Required** | ⚠️ **Migration Required**  
**Next Steps**:  
1. Create `subject_categories` collection in Appwrite Console
2. Run data migration script
3. Test all features end-to-end
4. Deploy to production

**Estimated Time**: 30-45 minutes (setup + migration + testing)
