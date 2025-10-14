# 🎯 Fyleo Platform - Setup Guide

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Appwrite account (cloud.appwrite.io)
- Modern web browser

## 🚀 Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Appwrite

#### A. Create Appwrite Project
1. Go to https://cloud.appwrite.io
2. Create new project: "Fyleo"
3. Copy Project ID: `68d9740b0012416cb71b`

#### B. Create Database
1. In Appwrite Console, go to "Databases"
2. Create database: "fyleo-db"
3. Database ID: `68d97982002b686c7151`

#### C. Create Collections

**Collection 1: categories**
- Collection ID: `categories`
- Attributes:
  - `nameAr` (string, 255, required)
  - `nameEn` (string, 255, required)
  - `descriptionAr` (string, 1000)
  - `descriptionEn` (string, 1000)
  - `icon` (string, 10)
  - `color` (string, 20)
  - `order` (integer)
  - `isActive` (boolean, default: true)
- Indexes: None required
- Permissions: 
  - Read: Any
  - Create/Update/Delete: Users (or specific admin role)

**Collection 2: subjects**
- Collection ID: `subjects`
- Attributes:
  - `nameAr` (string, 255, required)
  - `nameEn` (string, 255, required)
  - `descriptionAr` (string, 1000)
  - `descriptionEn` (string, 1000)
  - `categoryId` (string, 255, required)
  - `creditHours` (integer, default: 3)
  - `level` (integer, default: 1)
  - `prerequisite` (string, 255)
  - `isActive` (boolean, default: true)
- Indexes:
  - `categoryId_idx` on `categoryId` (for filtering)
- Permissions: Same as categories

**Collection 3: filetypes**
- Collection ID: `filetypes`
- Attributes:
  - `name` (string, 100, required)
  - `nameAr` (string, 100, required)
  - `nameEn` (string, 100, required)
  - `icon` (string, 10)
  - `color` (string, 20)
  - `allowedFormats` (string[], array)
- Permissions: Read: Any

**Collection 4: materials**
- Collection ID: `materials`
- Attributes:
  - `title` (string, 500, required)
  - `description` (string, 2000)
  - `categoryId` (string, 255, required)
  - `subjectId` (string, 255, required)
  - `fileTypeId` (string, 255, required)
  - `fileId` (string, 255, required)
  - `uploaderId` (string, 255, required)
  - `fileName` (string, 500, required)
  - `fileSize` (integer, required)
  - `mimeType` (string, 100)
  - `downloadURL` (string, 1000, required)
  - `viewURL` (string, 1000)
  - `downloadCount` (integer, default: 0)
  - `tags` (string[], array)
  - `semester` (string, 50)
  - `year` (integer)
- Indexes:
  - `categoryId_idx` on `categoryId`
  - `subjectId_idx` on `subjectId`
  - `uploaderId_idx` on `uploaderId`
  - `title_search` on `title` (fulltext for search)
- Permissions:
  - Read: Any
  - Create: Users
  - Update/Delete: Document owner or admin

**Collection 5: users**
- Collection ID: `users`
- Attributes:
  - `name` (string, 255, required)
  - `email` (string, 255, required, unique)
- Indexes:
  - `email_idx` on `email` (unique)
- Permissions:
  - Read: Any
  - Create: Users
  - Update/Delete: Document owner

**Collection 6: user_profiles**
- Collection ID: `user_profiles`
- Attributes:
  - `userId` (string, 255, required)
  - `bio` (string, 1000)
  - `profilePicture` (string, 500)
  - `website` (string, 500)
  - `dateOfBirth` (string, 50)
  - `location` (string, 255)
  - `gender` (string, 20)
  - `university` (string, 255)
  - `major` (string, 255)
  - `semester` (string, 50)
- Indexes:
  - `userId_idx` on `userId` (unique)
- Permissions:
  - Read: Any
  - Create/Update: Users
  - Delete: Document owner

**Collection 7: bookmarks**
- Collection ID: `bookmarks`
- Attributes:
  - `userId` (string, 255, required)
  - `fileId` (string, 255, required)
- Indexes:
  - `userId_idx` on `userId`
  - `fileId_idx` on `fileId`
  - `user_file_idx` on `userId,fileId` (unique)
- Permissions:
  - Read/Create/Delete: Users (own documents)

**Collection 8: downloads**
- Collection ID: `downloads`
- Attributes:
  - `userId` (string, 255, required)
  - `fileId` (string, 255, required)
- Indexes:
  - `userId_idx` on `userId`
  - `fileId_idx` on `fileId`
- Permissions:
  - Read: Users (own documents)
  - Create: Users

#### D. Create Storage Bucket
1. Go to "Storage" in Appwrite Console
2. Create bucket: "files"
3. Bucket ID: `files`
4. Settings:
   - Maximum File Size: 100MB (104857600 bytes)
   - Allowed File Extensions: `pdf,doc,docx,ppt,pptx,xls,xlsx,txt,jpg,jpeg,png,gif,webp,mp4,mov,avi`
   - Permissions:
     - Read: Any
     - Create: Users
     - Update/Delete: File owner

#### E. Enable Authentication
1. Go to "Auth" in Appwrite Console
2. Enable Email/Password authentication
3. (Optional) Enable Google OAuth
4. Configure email templates if needed

### 3. Environment Configuration

Create `.env` file in project root:

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

### 4. Seed Initial Data

#### A. Create File Types (via Appwrite Console)

1. **PDF Documents**
   - name: "PDF"
   - nameAr: "ملف PDF"
   - nameEn: "PDF Document"
   - icon: "📄"
   - color: "#EF4444"
   - allowedFormats: ["pdf"]

2. **Word Documents**
   - name: "Word"
   - nameAr: "مستند Word"
   - nameEn: "Word Document"
   - icon: "📝"
   - color: "#3B82F6"
   - allowedFormats: ["doc", "docx"]

3. **PowerPoint**
   - name: "PowerPoint"
   - nameAr: "عرض تقديمي"
   - nameEn: "PowerPoint"
   - icon: "📊"
   - color: "#F59E0B"
   - allowedFormats: ["ppt", "pptx"]

4. **Excel**
   - name: "Excel"
   - nameAr: "جدول بيانات"
   - nameEn: "Excel Sheet"
   - icon: "📈"
   - color: "#10B981"
   - allowedFormats: ["xls", "xlsx"]

5. **Images**
   - name: "Image"
   - nameAr: "صورة"
   - nameEn: "Image"
   - icon: "🖼️"
   - color: "#8B5CF6"
   - allowedFormats: ["jpg", "jpeg", "png", "gif", "webp"]

#### B. Create Sample Categories

1. **Computer Science**
   - nameAr: "علوم الحاسوب"
   - nameEn: "Computer Science"
   - descriptionAr: "مواد علوم الحاسوب والبرمجة"
   - descriptionEn: "Computer Science and Programming"
   - icon: "💻"
   - color: "#3B82F6"
   - order: 1
   - isActive: true

2. **Mathematics**
   - nameAr: "الرياضيات"
   - nameEn: "Mathematics"
   - descriptionAr: "مواد الرياضيات والإحصاء"
   - descriptionEn: "Mathematics and Statistics"
   - icon: "🔢"
   - color: "#10B981"
   - order: 2
   - isActive: true

3. **Engineering**
   - nameAr: "الهندسة"
   - nameEn: "Engineering"
   - descriptionAr: "مواد الهندسة"
   - descriptionEn: "Engineering Courses"
   - icon: "⚙️"
   - color: "#F59E0B"
   - order: 3
   - isActive: true

#### C. Create Sample Subjects

For Computer Science category:

1. **Programming 1**
   - nameAr: "البرمجة 1"
   - nameEn: "Programming 1"
   - descriptionAr: "مقدمة في البرمجة"
   - descriptionEn: "Introduction to Programming"
   - categoryId: [Computer Science category ID]
   - creditHours: 3
   - level: 1
   - isActive: true

2. **Data Structures**
   - nameAr: "هياكل البيانات"
   - nameEn: "Data Structures"
   - descriptionAr: "هياكل البيانات والخوارزميات"
   - descriptionEn: "Data Structures and Algorithms"
   - categoryId: [Computer Science category ID]
   - creditHours: 3
   - level: 2
   - prerequisite: "Programming 1"
   - isActive: true

### 5. Run the Application

```bash
npm run dev
```

The application should now be running at `http://localhost:5173`

## ✅ Testing Checklist

### Authentication
- [ ] Register new user
- [ ] Login with email/password
- [ ] Logout
- [ ] Session persists on page reload

### Materials Browsing
- [ ] View all categories at `/materials`
- [ ] Click category to see subjects
- [ ] Click subject to see materials
- [ ] Breadcrumb navigation works

### File Upload
- [ ] Login as user
- [ ] Go to `/upload`
- [ ] Select file
- [ ] Fill form (category, subject, etc.)
- [ ] Upload succeeds
- [ ] File appears in materials list

### Material Detail
- [ ] Click on a material
- [ ] View material details
- [ ] Download file
- [ ] Bookmark material
- [ ] View file (if supported)

### Admin Panel
- [ ] Login as admin
- [ ] Go to `/admin`
- [ ] View statistics
- [ ] Create new category
- [ ] Edit category
- [ ] Delete category
- [ ] Create new subject
- [ ] Edit subject
- [ ] Delete subject

### Bookmarks
- [ ] Bookmark a material
- [ ] Go to `/bookmarks`
- [ ] See bookmarked materials
- [ ] Remove bookmark

### Downloads
- [ ] Download a material
- [ ] Go to `/downloads`
- [ ] See download history

## 🐛 Troubleshooting

### Issue: "Cannot connect to Appwrite"
**Solution**: 
- Check `.env` file has correct endpoint and project ID
- Verify Appwrite project is active
- Check network connection

### Issue: "Collection not found"
**Solution**:
- Verify all collections are created in Appwrite
- Check collection IDs match `.env` file
- Ensure database ID is correct

### Issue: "Permission denied"
**Solution**:
- Check collection permissions in Appwrite Console
- Ensure user is authenticated
- Verify storage bucket permissions

### Issue: "File upload fails"
**Solution**:
- Check file size (max 100MB)
- Verify file type is allowed
- Check storage bucket exists
- Verify bucket permissions

### Issue: "No categories/subjects showing"
**Solution**:
- Seed initial data via Appwrite Console
- Check `isActive` field is true
- Verify collection permissions allow read

## 📞 Support

For issues or questions:
1. Check console for error messages
2. Verify Appwrite Console for data
3. Review `REBUILD_DOCUMENTATION.md`
4. Check network tab in browser DevTools

---

**Ready to go!** 🚀 Start by creating your first category and subject in the admin panel.
