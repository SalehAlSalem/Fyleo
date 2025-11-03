import { Client, Teams, Users, Query } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const teams = new Teams(client);
  const users = new Users(client);

  try {
    const { action, userId, teamId, membershipId, userIds } = JSON.parse(req.body);

    // Get all teams
    if (action === 'listTeams') {
      log('📋 Listing all teams...');
      const teamsList = await teams.list();
      log(`✅ Found ${teamsList.total} teams`);
      return res.json({ 
        success: true, 
        teams: teamsList.teams.map(t => ({
          $id: t.$id,
          name: t.name,
          total: t.total
        }))
      });
    }

    // Get teams for all users (bulk operation - FAST!)
    if (action === 'getAllUserTeams') {
      log(`📋 Getting teams for ${userIds?.length || 0} users (parallel)...`);
      
      if (!userIds || !Array.isArray(userIds)) {
        return res.json({ success: false, error: 'userIds array required' }, 400);
      }

      // Get all teams first
      const teamsList = await teams.list();
      
      // Build a map: userId -> teams[]
      const userTeamsMap = {};
      userIds.forEach(uid => {
        userTeamsMap[uid] = [];
      });

      // For each team, get all memberships (parallel)
      const teamMembershipsPromises = teamsList.teams.map(async (team) => {
        try {
          const memberships = await teams.listMemberships(team.$id);
          return {
            teamId: team.$id,
            teamName: team.name,
            memberships: memberships.memberships
          };
        } catch (err) {
          log(`⚠️ Could not get memberships for team ${team.$id}`);
          return { teamId: team.$id, teamName: team.name, memberships: [] };
        }
      });

      const allTeamMemberships = await Promise.all(teamMembershipsPromises);

      // Map memberships to users
      allTeamMemberships.forEach(({ teamId, teamName, memberships }) => {
        memberships.forEach(membership => {
          if (userTeamsMap[membership.userId] !== undefined) {
            userTeamsMap[membership.userId].push({
              teamId,
              teamName,
              membershipId: membership.$id,
              roles: membership.roles || []
            });
          }
        });
      });

      log(`✅ Got teams for ${Object.keys(userTeamsMap).length} users`);
      return res.json({ success: true, userTeamsMap });
    }

    // Add user to team
    if (action === 'add') {
      // Get user details
      const user = await users.get(userId);
      
      // Create membership directly WITHOUT invitation/confirmation
      // Use valid redirect URL (required by Appwrite)
      const membership = await teams.createMembership(
        teamId,
        ['member'], // roles
        undefined, // email - set to undefined to skip email invitation
        userId, // Pass userId to link directly
        undefined, // phone (optional)
        'https://cloud.appwrite.io/console', // Valid redirect URL (won't be used)
        user.name // user name
      );

      log(`✅ User ${userId} (${user.email}) added directly to team ${teamId}`);
      return res.json({ success: true, membership, message: 'تم إضافة المستخدم مباشرة' });
    } 
    
    // Remove user from team
    if (action === 'remove') {
      if (!membershipId) {
        return res.json({ success: false, error: 'membershipId is required' }, 400);
      }
      
      await teams.deleteMembership(teamId, membershipId);
      log(`✅ User removed from team ${teamId}`);
      return res.json({ success: true, message: 'تم إزالة المستخدم من الفريق' });
    }
    
    return res.json({ success: false, error: 'Invalid action. Use "listTeams", "add" or "remove"' }, 400);
  } catch (err) {
    error(`❌ Error: ${err.message}`);
    return res.json({ success: false, error: err.message }, 500);
  }
};
