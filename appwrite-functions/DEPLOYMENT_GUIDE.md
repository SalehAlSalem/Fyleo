# 🚀 Appwrite Functions Deployment Guide

## Overview
This guide explains how to deploy the server-side counter functions to Appwrite.

---

## Functions to Deploy

### 1. onDownloadCreate Function
**Purpose**: Automatically increment `downloadscounter` when a download is created.

**Trigger**: `databases.downloads.documents.*.create`

**Environment Variables Required**:
- `APPWRITE_FUNCTION_ENDPOINT` (auto-provided)
- `APPWRITE_FUNCTION_PROJECT_ID` (auto-provided)
- `APPWRITE_API_KEY` (you must create)
- `DATABASE_ID`
- `MATERIALS_COLLECTION_ID`

---

### 2. onBookmarkToggle Function
**Purpose**: Automatically increment/decrement `bookmarkscounter` when bookmarks are created/deleted.

**Triggers**: 
- `databases.bookmarks.documents.*.create`
- `databases.bookmarks.documents.*.delete`

**Environment Variables Required**:
- `APPWRITE_FUNCTION_ENDPOINT` (auto-provided)
- `APPWRITE_FUNCTION_PROJECT_ID` (auto-provided)
- `APPWRITE_API_KEY` (you must create)
- `DATABASE_ID`
- `MATERIALS_COLLECTION_ID`
- `USERS_COLLECTION_ID`

---

## Deployment Steps

### Step 1: Create API Key
1. Go to Appwrite Console → Settings → API Keys
2. Create new API Key with name: `Functions API Key`
3. Grant permissions:
   - `databases.read`
   - `databases.write`
4. Copy the API Key (you'll need it later)

---

### Step 2: Deploy onDownloadCreate Function

#### Via Appwrite Console:
1. Go to **Functions** → **Create Function**
2. **Name**: `onDownloadCreate`
3. **Runtime**: Node.js 18.0
4. **Events**: Add trigger `databases.downloads.documents.*.create`
5. **Environment Variables**:
   ```
   APPWRITE_API_KEY=your_api_key_here
   DATABASE_ID=your_database_id
   MATERIALS_COLLECTION_ID=materials
   ```
6. **Upload Code**:
   - Zip the `onDownloadCreate` folder
   - Upload via Console or CLI

#### Via Appwrite CLI:
```bash
cd appwrite-functions/onDownloadCreate
appwrite functions create \
  --functionId onDownloadCreate \
  --name "On Download Create" \
  --runtime node-18.0 \
  --events "databases.downloads.documents.*.create" \
  --execute role:all

appwrite functions createDeployment \
  --functionId onDownloadCreate \
  --entrypoint index.js \
  --code .

appwrite functions updateVariables \
  --functionId onDownloadCreate \
  --key APPWRITE_API_KEY \
  --value your_api_key_here

appwrite functions updateVariables \
  --functionId onDownloadCreate \
  --key DATABASE_ID \
  --value your_database_id

appwrite functions updateVariables \
  --functionId onDownloadCreate \
  --key MATERIALS_COLLECTION_ID \
  --value materials
```

---

### Step 3: Deploy onBookmarkToggle Function

#### Via Appwrite Console:
1. Go to **Functions** → **Create Function**
2. **Name**: `onBookmarkToggle`
3. **Runtime**: Node.js 18.0
4. **Events**: Add triggers:
   - `databases.bookmarks.documents.*.create`
   - `databases.bookmarks.documents.*.delete`
5. **Environment Variables**:
   ```
   APPWRITE_API_KEY=your_api_key_here
   DATABASE_ID=your_database_id
   MATERIALS_COLLECTION_ID=materials
   USERS_COLLECTION_ID=users
   ```
6. **Upload Code**:
   - Zip the `onBookmarkToggle` folder
   - Upload via Console or CLI

#### Via Appwrite CLI:
```bash
cd appwrite-functions/onBookmarkToggle
appwrite functions create \
  --functionId onBookmarkToggle \
  --name "On Bookmark Toggle" \
  --runtime node-18.0 \
  --events "databases.bookmarks.documents.*.create" "databases.bookmarks.documents.*.delete" \
  --execute role:all

appwrite functions createDeployment \
  --functionId onBookmarkToggle \
  --entrypoint index.js \
  --code .

appwrite functions updateVariables \
  --functionId onBookmarkToggle \
  --key APPWRITE_API_KEY \
  --value your_api_key_here

appwrite functions updateVariables \
  --functionId onBookmarkToggle \
  --key DATABASE_ID \
  --value your_database_id

appwrite functions updateVariables \
  --functionId onBookmarkToggle \
  --key MATERIALS_COLLECTION_ID \
  --value materials

appwrite functions updateVariables \
  --functionId onBookmarkToggle \
  --key USERS_COLLECTION_ID \
  --value users
```

---

## Step 4: Add Counter Attributes to Collections

### materials Collection:
Add these attributes if they don't exist:
- `downloadscounter` (integer, default: 0)
- `bookmarkscounter` (integer, default: 0)

### users Collection:
Add this attribute if it doesn't exist:
- `bookmarkscounter` (integer, default: 0)

---

## Step 5: Test the Functions

### Test Downloads:
1. Download a material from the frontend
2. Check Appwrite Console → Functions → onDownloadCreate → Executions
3. Verify the material's `downloadscounter` increased by 1

### Test Bookmarks:
1. Bookmark a material from the frontend
2. Check Appwrite Console → Functions → onBookmarkToggle → Executions
3. Verify the material's `bookmarkscounter` increased by 1
4. Unbookmark the material
5. Verify the counter decreased by 1

---

## Troubleshooting

### Function not triggering:
- Check the event trigger is correct
- Verify the collection IDs match
- Check function logs in Appwrite Console

### Permission errors:
- Verify API Key has correct permissions
- Check environment variables are set correctly

### Counter not updating:
- Check function execution logs
- Verify attribute names match exactly
- Ensure attributes exist in collections

---

## Migration Script (Optional)

If you have existing data, run this script to initialize counters:

```javascript
// Run this in Appwrite Console → Database → Run Query
import { Client, Databases, Query } from 'node-appwrite';

const client = new Client()
  .setEndpoint('YOUR_ENDPOINT')
  .setProject('YOUR_PROJECT_ID')
  .setKey('YOUR_API_KEY');

const databases = new Databases(client);

async function migrateCounters() {
  // Get all materials
  const materials = await databases.listDocuments(
    'DATABASE_ID',
    'materials',
    [Query.limit(1000)]
  );

  for (const material of materials.documents) {
    // Count downloads
    const downloads = await databases.listDocuments(
      'DATABASE_ID',
      'downloads',
      [Query.equal('fileId', material.$id), Query.limit(1)]
    );

    // Count bookmarks
    const bookmarks = await databases.listDocuments(
      'DATABASE_ID',
      'bookmarks',
      [Query.equal('fileId', material.$id), Query.limit(1)]
    );

    // Update material
    await databases.updateDocument(
      'DATABASE_ID',
      'materials',
      material.$id,
      {
        downloadscounter: downloads.total,
        bookmarkscounter: bookmarks.total
      }
    );

    console.log(`✅ Updated ${material.title}: ${downloads.total} downloads, ${bookmarks.total} bookmarks`);
  }
}

migrateCounters();
```

---

## ✅ Deployment Checklist

- [ ] API Key created with correct permissions
- [ ] onDownloadCreate function deployed
- [ ] onBookmarkToggle function deployed
- [ ] Environment variables configured
- [ ] Counter attributes added to collections
- [ ] Functions tested and working
- [ ] Frontend updated to use counter attributes
- [ ] Migration script run (if needed)

---

## 🎉 Success!

Once deployed, your counters will be automatically managed by the server!
- Downloads are tracked accurately
- Bookmarks are synced in real-time
- No client-side calculation needed
- Bulletproof and reliable

**The frontend simply reads `downloadscounter` and `bookmarkscounter` - that's it!**
