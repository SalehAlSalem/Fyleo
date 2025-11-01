import { Client, Databases, Query } from 'node-appwrite';

/**
 * Appwrite Function: onMaterialDelete
 * Triggered when a material is deleted
 * Automatically deletes all related downloads and bookmarks
 */
export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');

  const databases = new Databases(client);

  try {
    // Parse the event data
    const payload = JSON.parse(req.body || '{}');
    const materialId = payload.$id;

    if (!materialId) {
      error('No material ID provided');
      return res.json({ success: false, error: 'No material ID' }, 400);
    }

    log(`🗑️ Material deleted: ${materialId}`);
    log('🔄 Cleaning up related data...');

    const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
    const DOWNLOADS_COLLECTION_ID = process.env.APPWRITE_DOWNLOADS_COLLECTION_ID;
    const BOOKMARKS_COLLECTION_ID = process.env.APPWRITE_BOOKMARKS_COLLECTION_ID;

    let deletedDownloads = 0;
    let deletedBookmarks = 0;

    // 1. Delete all downloads for this material
    try {
      const downloads = await databases.listDocuments(
        DATABASE_ID,
        DOWNLOADS_COLLECTION_ID,
        [Query.equal('fileId', materialId)]
      );

      for (const download of downloads.documents) {
        await databases.deleteDocument(
          DATABASE_ID,
          DOWNLOADS_COLLECTION_ID,
          download.$id
        );
        deletedDownloads++;
      }

      log(`✅ Deleted ${deletedDownloads} download records`);
    } catch (err) {
      error(`⚠️ Error deleting downloads: ${err.message}`);
    }

    // 2. Delete all bookmarks for this material
    try {
      const bookmarks = await databases.listDocuments(
        DATABASE_ID,
        BOOKMARKS_COLLECTION_ID,
        [Query.equal('fileId', materialId)]
      );

      for (const bookmark of bookmarks.documents) {
        await databases.deleteDocument(
          DATABASE_ID,
          BOOKMARKS_COLLECTION_ID,
          bookmark.$id
        );
        deletedBookmarks++;
      }

      log(`✅ Deleted ${deletedBookmarks} bookmark records`);
    } catch (err) {
      error(`⚠️ Error deleting bookmarks: ${err.message}`);
    }

    log(`✅ Cleanup complete for material ${materialId}`);
    log(`   - Downloads deleted: ${deletedDownloads}`);
    log(`   - Bookmarks deleted: ${deletedBookmarks}`);

    return res.json({
      success: true,
      materialId,
      deletedDownloads,
      deletedBookmarks
    });

  } catch (err) {
    error(`❌ Function error: ${err.message}`);
    return res.json({
      success: false,
      error: err.message
    }, 500);
  }
};
