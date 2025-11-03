import { Client, Users } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const users = new Users(client);

  try {
    const body = JSON.parse(req.body);
    const { operation, userId, block, userIds } = body;

    // Operation: Get status for all users from Auth
    if (operation === 'getUsersStatus') {
      log(`� Getting Auth status for ${userIds?.length || 0} users`);
      
      if (!userIds || !Array.isArray(userIds)) {
        return res.json({ success: false, error: 'userIds array required' }, 400);
      }

      // Use Promise.all for parallel execution (much faster!)
      const statusPromises = userIds.map(async (uid) => {
        try {
          const authUser = await users.get(uid);
          return { uid, status: authUser.status };
        } catch (err) {
          log(`⚠️ Could not get user ${uid}: ${err.message}`);
          return { uid, status: true }; // Default to active if error
        }
      });

      const results = await Promise.all(statusPromises);
      
      const statusMap = {};
      results.forEach(({ uid, status }) => {
        statusMap[uid] = status;
      });
      
      log(`✅ Got status for ${Object.keys(statusMap).length} users (parallel)`);
      return res.json({ success: true, statusMap });
    }

    // Default operation: Block/Unblock user
    log(`📝 Block/Unblock Request: userId=${userId}, block=${block}`);

    if (!userId) {
      error('userId is required');
      return res.json({ success: false, error: 'userId is required' }, 400);
    }

    // Update user status in Auth (true = active, false = blocked)
    await users.updateStatus(userId, !block);
    log(`✅ Auth status updated: User ${userId} ${block ? 'blocked' : 'unblocked'}`);

    return res.json({ success: true, blocked: block, status: !block });
  } catch (err) {
    error(`Error: ${err.message}`);
    return res.json({ success: false, error: err.message }, 500);
  }
};
