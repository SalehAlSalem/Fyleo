# Meilisearch Integration for Fyleo

## 🎯 Overview

Fyleo now uses **Meilisearch** for all search operations, replacing the previous Appwrite-based filtering system. This provides:

- ⚡ **Instant search** - Results appear as you type
- 🔍 **Typo tolerance** - Automatically handles 1-2 typos
- 🎯 **Relevance ranking** - Best results appear first
- 🚀 **Performance** - No more client-side filtering of large datasets
- 📊 **Advanced filtering** - Filter by category, subject, file type, year, etc.
- ✨ **Autocomplete** - Smart search suggestions

## 🏗️ Architecture

```
┌─────────────────┐
│   User Search   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Frontend UI   │
│  (React Query)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│         libraryApi.ts (searchApi)           │
│  • globalSearch()                           │
│  • searchInCategory()                       │
│  • searchInSubject()                        │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│      meilisearchService.js                  │
│  • Connects to Meilisearch server           │
│  • Handles all search operations            │
│  • Fallback to empty results if unavailable │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│      Meilisearch Server                     │
│  https://minio97.chickenkiller.com/meili    │
│  • Indexes: categories, subjects, materials │
│  • Typo tolerance enabled                   │
│  • Filtering & ranking configured           │
└─────────────────────────────────────────────┘
```

## 📁 Files Changed

### New Files
- `src/services/meilisearchService.js` - Meilisearch client and search functions
- `src/services/meilisearchService.d.ts` - TypeScript declarations
- `scripts/index-meilisearch.js` - Data indexing script
- `appwrite-functions/sync-meilisearch/` - Auto-sync function (optional)

### Modified Files
- `src/features/library/api/libraryApi.ts` - Search functions now use Meilisearch
- `package.json` - Added `meilisearch` dependency

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs the `meilisearch` package (already done).

### 2. Index Existing Data

Run the indexing script to populate Meilisearch with your existing Appwrite data:

```bash
node scripts/index-meilisearch.js
```

**Expected output:**
```
✅ Meilisearch server is healthy
✅ Found 257 subject-category links
✅ Added 4 categories
✅ Added 132 subjects
✅ Added 66 materials
✅ Added 8 posts
✅ All data has been indexed successfully!
```

**Index Statistics:**
- Categories: 4 documents
- Subjects: 132 documents
- Materials: 66 documents
- Posts: 8 documents

### 3. Test Search Functionality

Start the development server:

```bash
npm run dev
```

Navigate to the Library page and try searching. You should see:
- Instant results as you type
- Typo-tolerant search (e.g., "mathemtics" finds "mathematics")
- Results from categories, subjects, materials, and posts

### 4. (Optional) Deploy Auto-Sync Function

To keep Meilisearch automatically updated when data changes in Appwrite:

1. Navigate to the function directory:
   ```bash
   cd appwrite-functions/sync-meilisearch
   ```

2. Deploy to Appwrite:
   ```bash
   appwrite functions deploy sync-meilisearch
   ```

3. Set environment variables in Appwrite Console:
   - `MEILISEARCH_HOST`: `https://minio97.chickenkiller.com/meili`
   - `MEILISEARCH_MASTER_KEY`: Your master API key
   - `APPWRITE_API_KEY`: Your Appwrite API key
   - `DATABASE_ID`: Your database ID
   - All collection IDs

4. The function will automatically sync changes on:
   - Materials create/update/delete
   - Posts create/update/delete
   - Subjects create/update/delete
   - Categories create/update/delete

## 🔧 Configuration

### Meilisearch Server

- **Host**: `https://minio97.chickenkiller.com/meili`
- **API Key**: `StrongSearchKey123` (read-only, safe for frontend)
- **Port**: `7700` (internal)
- **SSL**: Enabled via Caddy reverse proxy

### Index Configuration

#### Categories Index
- **Searchable**: nameEn, nameAr, descriptionEn, descriptionAr
- **Filterable**: isActive, $id
- **Sortable**: order

#### Subjects Index
- **Searchable**: nameEn, nameAr, descriptionEn, descriptionAr
- **Filterable**: isActive, $id, categoryIds, level
- **Sortable**: nameEn, nameAr

#### Materials Index
- **Searchable**: title, description, subjectName, categoryNames
- **Filterable**: subjectId, categoryIds, fileTypeId, year, uploaderId, $id
- **Sortable**: $createdAt, title

#### Posts Index
- **Searchable**: contentText, linkURL, subjectName, categoryNames
- **Filterable**: subjectId, categoryIds, educationalPurposeId, uploaderId, $id
- **Sortable**: $createdAt

## 🔍 Search API Usage

### Global Search (Level 1)

Search across all collections:

```typescript
import { searchApi } from '@/features/library/api/libraryApi';

const results = await searchApi.globalSearch('physics');
// Returns: { categories, subjects, materials, posts }
```

### Category Search (Level 2)

Search within a specific category:

```typescript
const results = await searchApi.searchInCategory(categoryId, 'quantum');
// Returns: { subjects, materials, posts }
```

### Subject Search (Level 3)

Search within a specific subject:

```typescript
const results = await searchApi.searchInSubject(subjectId, 'mechanics');
// Returns: { materials, posts }
```

## 🎨 Features

### Typo Tolerance

Meilisearch automatically handles typos:
- 1 typo for words ≥4 characters
- 2 typos for words ≥8 characters

Examples:
- "physcs" → "physics"
- "matematics" → "mathematics"
- "enginering" → "engineering"

### Prefix Matching

Autocomplete as you type:
- "math" matches "mathematics", "mathematical", etc.
- "phy" matches "physics", "physical", etc.

### Relevance Ranking

Results are ranked by:
1. **Words** - All query words present
2. **Typo** - Fewer typos rank higher
3. **Proximity** - Words closer together rank higher
4. **Attribute** - Matches in title rank higher than description
5. **Sort** - Can sort by date or other fields
6. **Exactness** - Exact matches rank highest

## 📊 Monitoring

### Check Meilisearch Health

```bash
curl https://minio97.chickenkiller.com/meili/health
```

Expected response:
```json
{
  "status": "available"
}
```

### View Index Statistics

```bash
curl https://minio97.chickenkiller.com/meili/indexes
```

### Re-index Data

If data gets out of sync, re-run the indexing script:

```bash
node scripts/index-meilisearch.js
```

This will clear existing indexes and re-populate them with fresh data.

## 🛡️ Security

- **Frontend API Key**: `StrongSearchKey123` is **read-only** and safe for frontend use
- **Master Key**: Only used in Appwrite Functions for write operations (create, update, delete)
- **No sensitive data**: All indexed data is already public in Appwrite

## 🐛 Troubleshooting

### Search returns empty results

1. Check if Meilisearch server is healthy:
   ```bash
   curl https://minio97.chickenkiller.com/meili/health
   ```

2. Verify indexes exist:
   ```bash
   curl https://minio97.chickenkiller.com/meili/indexes
   ```

3. Re-index data:
   ```bash
   node scripts/index-meilisearch.js
   ```

### Search is slow

- Meilisearch should return results in <50ms
- Check network latency to the server
- Verify the server has enough resources

### Typos not working

- Typo tolerance is enabled for words ≥4 characters
- Check index settings in `meilisearchService.js`
- Re-configure indexes if needed

## 📚 Additional Resources

- [Meilisearch Documentation](https://docs.meilisearch.com/)
- [Meilisearch JavaScript Client](https://github.com/meilisearch/meilisearch-js)
- [Search API Reference](https://docs.meilisearch.com/reference/api/search.html)

## 🎉 Migration Complete!

Your Fyleo application is now powered by Meilisearch. Enjoy instant, typo-tolerant search! 🚀
