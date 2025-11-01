/**
 * Appwrite Function: onDownloadCreate
 * Trigger: downloads.*.create
 * 
 * This function automatically increments the downloadscounter
 * on the material document whenever a new download is recorded.
 */

import { Client, Databases, Query } from 'node-appwrite';

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
    const downloadDoc = payload;
    
    log('📥 New download created:', downloadDoc.$id);
    log('📄 File ID:', downloadDoc.fileId);

    // Get the material document
    const material = await databases.getDocument(
      process.env.DATABASE_ID,
      process.env.MATERIALS_COLLECTION_ID,
      downloadDoc.fileId
    );

    log('📊 Current downloads counter:', material.downloadscounter || 0);

    // Increment the downloads counter
    const newCounter = (material.downloadscounter || 0) + 1;
    
    await databases.updateDocument(
      process.env.DATABASE_ID,
      process.env.MATERIALS_COLLECTION_ID,
      downloadDoc.fileId,
      {
        downloadscounter: newCounter
      }
    );

    log('✅ Downloads counter updated to:', newCounter);

    return res.json({
      success: true,
      fileId: downloadDoc.fileId,
      newCounter: newCounter
    });

  } catch (err) {
    error('❌ Error in onDownloadCreate:', err.message);
    return res.json({
      success: false,
      error: err.message
    }, 500);
  }
};
