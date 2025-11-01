/**
 * Appwrite Function: onBookmarkToggle
 * Triggers: bookmarks.*.create, bookmarks.*.delete
 * 
 * This function automatically increments/decrements the bookmarkscounter
 * on both the material document and user document when bookmarks are toggled.
 */

import { Client, Databases } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  try {
    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    
    // Parse the event payload
    const payload = JSON.parse(req.body || '{}');
    const bookmarkDoc = payload;
    const eventType = req.headers['x-appwrite-event'];
    
    log('🔖 Bookmark event:', eventType);
    log('📄 File ID:', bookmarkDoc.fileId);
    log('👤 User ID:', bookmarkDoc.userId);

    // Determine if this is a create or delete event
    const isCreate = eventType.includes('.create');
    const increment = isCreate ? 1 : -1;
    
    log(`${isCreate ? '➕' : '➖'} ${isCreate ? 'Adding' : 'Removing'} bookmark`);

    // Update material's bookmark counter
    try {
      const material = await databases.getDocument(
        process.env.DATABASE_ID,
        process.env.MATERIALS_COLLECTION_ID,
        bookmarkDoc.fileId
      );

      const newMaterialCounter = Math.max(0, (material.bookmarkscounter || 0) + increment);
      
      await databases.updateDocument(
        process.env.DATABASE_ID,
        process.env.MATERIALS_COLLECTION_ID,
        bookmarkDoc.fileId,
        {
          bookmarkscounter: newMaterialCounter
        }
      );

      log('✅ Material bookmark counter updated to:', newMaterialCounter);
    } catch (err) {
      error('⚠️ Error updating material counter:', err.message);
    }

    // Update user's bookmark counter (if users collection has bookmarkscounter)
    try {
      const user = await databases.getDocument(
        process.env.DATABASE_ID,
        process.env.USERS_COLLECTION_ID,
        bookmarkDoc.userId
      );

      const newUserCounter = Math.max(0, (user.bookmarkscounter || 0) + increment);
      
      await databases.updateDocument(
        process.env.DATABASE_ID,
        process.env.USERS_COLLECTION_ID,
        bookmarkDoc.userId,
        {
          bookmarkscounter: newUserCounter
        }
      );

      log('✅ User bookmark counter updated to:', newUserCounter);
    } catch (err) {
      error('⚠️ Error updating user counter:', err.message);
    }

    return res.json({
      success: true,
      action: isCreate ? 'increment' : 'decrement',
      fileId: bookmarkDoc.fileId,
      userId: bookmarkDoc.userId
    });

  } catch (err) {
    error('❌ Error in onBookmarkToggle:', err.message);
    return res.json({
      success: false,
      error: err.message
    }, 500);
  }
};
