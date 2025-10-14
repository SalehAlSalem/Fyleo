# 🚀 Fyleo Platform - Complete Rebuild Documentation

## ✅ What Has Been Rebuilt

### 1. **Complete Service Layer** (`src/services/`)

#### `appwriteService.js` - Main Service Layer
Comprehensive service layer for all Appwrite collections:

- **Categories Service**: CRUD operations for categories
- **Subjects Service**: CRUD operations for subjects with category filtering
- **File Types Service**: Management of file types
- **Materials Service**: Complete material management with search and filtering
- **Users Service**: User management
- **User Profiles Service**: Profile management
- **Bookmarks Service**: Bookmark toggle and management
- **Downloads Service**: Download tracking
- **Storage Service**: File upload/download with Appwrite Storage
- **Statistics Service**: Platform and user statistics

#### `authService.js` - Authentication Service
Complete authentication system:
- Email/password login
- User registration
- Google OAuth
- Password recovery
- Email verification
- Session management

#### `hierarchyService.js` - Hierarchical Data Service
Manages the Category → Subject → Material hierarchy:
- Complete hierarchy fetching
- Category hierarchy with subjects and materials
- Subject hierarchy with materials
- Material hierarchy with parent data
- Search across hierarchy
- Breadcrumb generation

### 2. **Updated Authentication** (`src/hooks/useAuth.jsx`)

Completely refactored to use the new service layer:
- Clean separation of concerns
- Better error handling
- Automatic user record creation in database
- Session persistence

### 3. **New Pages**

#### `MaterialsPage.jsx`
Dynamic materials browsing with three views:
- **Categories View**: Shows all categories with counts
- **Subjects View**: Shows subjects within a category
- **Materials View**: Shows materials within a subject
- Breadcrumb navigation
- Real-time data from Appwrite

#### `MaterialDetailPage.jsx`
Individual material view with:
- Full material information
- Download functionality
- Bookmark toggle
- View/preview option
- Category and subject info
- Upload metadata

#### `AdminPanel.jsx`
Complete admin dashboard with tabs for:
- Statistics
- Categories management
- Subjects management
- Materials management
- File types management
- Users management

#### `CategoriesAdmin.jsx`
Full CRUD for categories:
- Create/Edit/Delete categories
- Arabic and English names
- Icon and color customization
- Order management
- Active/Inactive toggle

#### `SubjectsAdmin.jsx`
Full CRUD for subjects:
- Create/Edit/Delete subjects
- Link to categories
- Credit hours and level
- Prerequisites
- Filter by category

#### `FileUploadForm.jsx`
Complete file upload system:
- Upload to Appwrite Storage
- Progress tracking
- Dynamic category/subject dropdowns
- File metadata
- Tags, semester, year
- Auto-linking to materials collection

### 4. **Updated Routes** (`src/App.jsx`)

New routing structure:
```
/materials                          → Categories view
/materials/:categoryId              → Subjects view
/materials/:categoryId/:subjectId   → Materials view
/material/:materialId               → Material detail
/upload                             → File upload
/admin                              → Admin panel
```

## 🗄️ Database Structure

### Collections (Appwrite)

1. **categories** (id: `categories`)
   - nameAr, nameEn
   - descriptionAr, descriptionEn
   - icon, color, order
   - isActive

2. **subjects** (id: `subjects`)
   - nameAr, nameEn
   - descriptionAr, descriptionEn
   - categoryId (relation)
   - creditHours, level, prerequisite
   - isActive

3. **materials** (id: `materials`)
   - title, description
   - categoryId, subjectId, fileTypeId (relations)
   - fileId, uploaderId
   - fileName, fileSize, mimeType
   - downloadURL, viewURL
   - downloadCount
   - tags, semester, year

4. **fileTypes** (id: `filetypes`)
   - name, nameAr, nameEn
   - icon, color
   - allowedFormats

5. **users** (id: `users`)
   - name, email

6. **user_profiles** (id: `user_profiles`)
   - userId (relation)
   - bio, profilePicture, website
   - dateOfBirth, location, gender
   - university, major, semester

7. **bookmarks** (id: `bookmarks`)
   - userId, fileId (relations)

8. **downloads** (id: `downloads`)
   - userId, fileId (relations)

## 🔧 Configuration

### Environment Variables (`.env`)
```env
VITE_APPWRITE_URL=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=68d9740b0012416cb71b
VITE_APPWRITE_DATABASE_ID=68d97982002b686c7151
VITE_APPWRITE_USERS_COLLECTION_ID=users
VITE_APPWRITE_FILES_COLLECTION_ID=materials
VITE_APPWRITE_BOOKMARKS_COLLECTION_ID=bookmarks
VITE_APPWRITE_DOWNLOADS_COLLECTION_ID=downloads
VITE_APPWRITE_PROFILES_COLLECTION_ID=user_profiles
VITE_APPWRITE_STORAGE_BUCKET_ID=files
VITE_APPWRITE_CATEGORIES_COLLECTION_ID=categories
VITE_APPWRITE_SUBJECTS_COLLECTION_ID=subjects
VITE_APPWRITE_FILE_TYPES_COLLECTION_ID=filetypes
```

## 📋 How to Use

### 1. **For Users**

#### Browse Materials:
1. Go to `/materials`
2. Click on a category
3. Click on a subject
4. Click on a material to view details
5. Download or bookmark materials

#### Upload Files:
1. Login to your account
2. Go to `/upload`
3. Select file
4. Fill in details (title, category, subject, etc.)
5. Submit

### 2. **For Admins**

#### Manage Categories:
1. Go to `/admin`
2. Click "التصنيفات" tab
3. Add/Edit/Delete categories

#### Manage Subjects:
1. Go to `/admin`
2. Click "المواد الدراسية" tab
3. Add/Edit/Delete subjects
4. Link subjects to categories

#### Manage Materials:
1. Go to `/admin`
2. Click "الملفات" tab
3. View all uploaded materials
4. Edit or delete materials

## 🔄 Data Flow

### Upload Flow:
```
User selects file
  ↓
File uploaded to Appwrite Storage
  ↓
Get download/view URLs
  ↓
Create material record in database
  ↓
Link to category, subject, file type
  ↓
Success - redirect to dashboard
```

### Download Flow:
```
User clicks download
  ↓
Record download in downloads collection
  ↓
Increment material download count
  ↓
Open download URL
```

### Hierarchy Flow:
```
Categories (root level)
  ↓
Subjects (filtered by categoryId)
  ↓
Materials (filtered by subjectId)
```

## 🎯 Key Features Implemented

✅ **Authentication**
- Email/password login
- User registration
- Google OAuth ready
- Session management
- Auto user record creation

✅ **Hierarchical System**
- Categories → Subjects → Materials
- Dynamic data loading
- Breadcrumb navigation
- Counts and statistics

✅ **File Management**
- Upload to Appwrite Storage
- Progress tracking
- File metadata
- Download tracking
- View/preview

✅ **Bookmarks**
- Toggle bookmark
- View bookmarked materials
- User-specific bookmarks

✅ **Admin Panel**
- Full CRUD for categories
- Full CRUD for subjects
- Materials management
- Statistics dashboard

✅ **Search & Filter**
- Search materials
- Filter by category
- Filter by subject
- Tag-based filtering

## 🐛 Known Issues & Solutions

### Issue: Import errors for ModernComponents
**Solution**: All components are properly exported from `ModernComponents.jsx`

### Issue: Database connection
**Solution**: Verify `.env` file has correct Appwrite credentials

### Issue: File upload fails
**Solution**: 
1. Check storage bucket exists in Appwrite
2. Verify bucket permissions allow file creation
3. Check file size limits (max 100MB)

## 🚀 Next Steps

1. **Test all features** with real data
2. **Add more file types** in Appwrite
3. **Create initial categories and subjects** via admin panel
4. **Configure Appwrite permissions** for collections
5. **Set up storage bucket** with proper permissions
6. **Test file upload** end-to-end
7. **Verify download tracking** works correctly

## 📝 Notes

- All services use async/await for better error handling
- Components use ModernComponents for consistent UI
- All database operations go through service layer
- File uploads use Appwrite Storage (not MinIO)
- Hierarchy is fully dynamic from database
- No hardcoded data - everything from Appwrite

## 🔐 Security Considerations

- API keys should never be committed to git
- Use Appwrite permissions for collection access
- Validate file types and sizes on upload
- Sanitize user inputs
- Use HTTPS for all API calls

---

**Built with**: React, Vite, Appwrite, TailwindCSS
**Version**: 3.0.0
**Last Updated**: 2025
