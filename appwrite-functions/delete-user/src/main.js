import { Client, Users } from 'node-appwrite';

/**
 * Appwrite Function: Delete User Account
 * 
 * This function deletes a user account from Appwrite Auth
 * Can only be called by the user themselves (authenticated)
 * 
 * Environment Variables Required:
 * - APPWRITE_FUNCTION_API_KEY (auto-provided by Appwrite)
 * - APPWRITE_FUNCTION_PROJECT_ID (auto-provided by Appwrite)
 */

export default async ({ req, res, log, error }) => {
  try {
    // Get user ID from request (Appwrite automatically provides this)
    const userId = req.headers['x-appwrite-user-id'];
    
    if (!userId) {
      error('No user ID provided - user must be authenticated');
      return res.json({
        success: false,
        error: 'Authentication required'
      }, 401);
    }

    log(`🗑️ Delete request for user: ${userId}`);

    // Initialize Appwrite client with API key (server-side)
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

    const users = new Users(client);

    // Delete the user
    log(`🗑️ Deleting user from Auth: ${userId}`);
    await users.delete(userId);
    log(`✅ User deleted successfully: ${userId}`);

    return res.json({
      success: true,
      message: 'User account deleted successfully',
      userId: userId
    });

  } catch (err) {
    error(`❌ Error deleting user: ${err.message}`);
    return res.json({
      success: false,
      error: err.message
    }, 500);
  }
};
