# Meilisearch Sync Function

This Appwrite Function automatically syncs data changes from Appwrite to Meilisearch in real-time.

## 📋 Setup Instructions

### 1. Prerequisites

- Appwrite CLI installed
- Access to Appwrite Console
- Meilisearch server running at `https://minio97.chickenkiller.com/meili`

### 2. Deploy Function

From the project root directory:

```bash
cd appwrite-functions/sync-meilisearch
appwrite functions createDeployment \
  --functionId=sync-meilisearch \
  --activate=true \
  --entrypoint=src/main.js \
  --path=.
```

Or use the Appwrite Console:
1. Go to Functions → Create Function
2. Name: "Sync Meilisearch"
3. Runtime: Node.js 18
4. Upload this folder
5. Set entrypoint: `src/main.js`

### 3. Configure Environment Variables

In Appwrite Console → Functions → sync-meilisearch → Settings → Variables:

```env
MEILISEARCH_HOST=https://minio97.chickenkiller.com/meili
MEILISEARCH_MASTER_KEY=YourMasterKeyHere
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=68d9740b0012416cb71b
APPWRITE_API_KEY=YourAppwriteAPIKeyHere
DATABASE_ID=68d97982002b686c7151
SUBJECTS_COLLECTION_ID=subjects
CATEGORIES_COLLECTION_ID=categories
FILETYPES_COLLECTION_ID=filetypes
USERS_COLLECTION_ID=users
SUBJECT_CATEGORIES_COLLECTION_ID=subject_categories
```

⚠️ **Important**: Use the Meilisearch **MASTER KEY** (not the read-only search key) for write operations.

### 4. Configure Events

The function is triggered by these database events:

```json
[
  "databases.*.collections.materials.documents.*.create",
  "databases.*.collections.materials.documents.*.update",
  "databases.*.collections.materials.documents.*.delete",
  "databases.*.collections.posts.documents.*.create",
  "databases.*.collections.posts.documents.*.update",
  "databases.*.collections.posts.documents.*.delete",
  "databases.*.collections.subjects.documents.*.create",
  "databases.*.collections.subjects.documents.*.update",
  "databases.*.collections.subjects.documents.*.delete",
  "databases.*.collections.categories.documents.*.create",
  "databases.*.collections.categories.documents.*.update",
  "databases.*.collections.categories.documents.*.delete"
]
```

These are already configured in `appwrite.json`.

### 5. Test the Function

1. Create a test material in Appwrite Console
2. Check Function logs in Appwrite Console → Functions → sync-meilisearch → Logs
3. Verify the material appears in Meilisearch:
   ```bash
   curl https://minio97.chickenkiller.com/meili/indexes/materials_posts/search \
     -H "Authorization: Bearer StrongSearchKey123" \
     -d '{"q": "test"}'
   ```

## 🔍 How It Works

1. **Trigger**: Appwrite detects a database change (create/update/delete)
2. **Event**: Appwrite sends event to this function
3. **Enrich**: Function fetches related data (subject, fileType, uploader, categories)
4. **Sync**: Function updates Meilisearch index with enriched document
5. **Result**: Search results are immediately updated

## 📊 What Gets Synced

### Materials
- Title, description
- Subject name (enriched)
- Category IDs (from many-to-many relationship)
- FileType name (enriched)
- Uploader name (enriched)
- Year, creation date

### Posts
- Content text, link URL
- Subject name (enriched)
- Category IDs (from many-to-many relationship)
- Uploader name (enriched)
- Educational purpose ID, creation date

### Subjects
- Name (English & Arabic)
- Description (English & Arabic)
- Category IDs (from many-to-many relationship)
- Level, icon, active status

### Categories
- Name (English & Arabic)
- Description (English & Arabic)
- Icon, order, active status

## 🐛 Troubleshooting

### Function not triggering

1. Check Events are configured correctly
2. Verify function is enabled
3. Check function logs for errors

### Sync fails with authentication error

1. Verify `MEILISEARCH_MASTER_KEY` is correct (not the read-only key)
2. Verify `APPWRITE_API_KEY` has read permissions
3. Check function logs for detailed error

### Documents not appearing in search

1. Check if function execution succeeded in logs
2. Manually verify document in Meilisearch:
   ```bash
   curl https://minio97.chickenkiller.com/meili/indexes/materials_posts/documents/{documentId}
   ```
3. Re-run full indexing script if needed:
   ```bash
   node scripts/index-meilisearch.js
   ```

## 🔐 Security Notes

- ✅ Function uses **server-side** Meilisearch master key (not exposed to frontend)
- ✅ Function uses Appwrite API key with read-only permissions
- ✅ Function only syncs public data (no sensitive information)
- ✅ Function validates all inputs before syncing

## 📝 Logs

View function execution logs in:
- Appwrite Console → Functions → sync-meilisearch → Logs

Expected log output:
```
🔄 Meilisearch sync triggered
Event: databases.68d97982002b686c7151.collections.materials.documents.abc123.create
Collection: materials, Action: create
Document ID: abc123
📝 Adding document in Meilisearch
✅ Document synced to Meilisearch
```

## 🎯 Performance

- **Execution time**: ~1-3 seconds per document
- **Timeout**: 15 seconds (configurable)
- **Concurrent executions**: Unlimited
- **Cost**: Free tier covers most usage

## 🚀 Optional: Manual Sync

If you prefer not to use the auto-sync function, you can manually re-index data:

```bash
node scripts/index-meilisearch.js
```

This is useful for:
- Initial setup
- Recovery after downtime
- Bulk updates
- Debugging

## ✨ Benefits

- ✅ **Real-time**: Changes appear in search immediately
- ✅ **Automatic**: No manual intervention needed
- ✅ **Reliable**: Retries on failure
- ✅ **Auditable**: All operations logged
- ✅ **Scalable**: Handles high-volume changes

## 📚 References

- [Appwrite Functions Documentation](https://appwrite.io/docs/functions)
- [Meilisearch JavaScript Client](https://github.com/meilisearch/meilisearch-js)
- [node-appwrite SDK](https://github.com/appwrite/sdk-for-node)
