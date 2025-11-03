/**
 * Appwrite Functions Integration
 * 
 * Uses Appwrite SDK to call Functions with authenticated session
 */

import { Functions } from 'appwrite';
import { client } from '../config/appwrite'; // Use shared client with session

const BLOCK_USER_FUNCTION_ID = import.meta.env.VITE_BLOCK_USER_FUNCTION_ID || null;
const MANAGE_TEAM_FUNCTION_ID = import.meta.env.VITE_MANAGE_TEAM_FUNCTION_ID || null;

// Initialize Functions service with shared authenticated client
const functions = new Functions(client);

// Debug: Log function IDs
console.log('🔍 Function IDs Check:');
console.log('BLOCK_USER_FUNCTION_ID:', BLOCK_USER_FUNCTION_ID);
console.log('MANAGE_TEAM_FUNCTION_ID:', MANAGE_TEAM_FUNCTION_ID);
console.log('Functions Configured:', !!(BLOCK_USER_FUNCTION_ID && MANAGE_TEAM_FUNCTION_ID));

/**
 * Check if Functions are configured
 */
export const areFunctionsConfigured = () => {
  return !!(BLOCK_USER_FUNCTION_ID && MANAGE_TEAM_FUNCTION_ID);
};

/**
 * Get users Auth status
 * @param {string[]} userIds - Array of user IDs
 * @returns {Promise<Object>} Map of userId -> status (true = active, false = blocked)
 */
export const getUsersStatus = async (userIds) => {
  if (!BLOCK_USER_FUNCTION_ID) {
    throw new Error('Block User Function not configured. Add VITE_BLOCK_USER_FUNCTION_ID to .env');
  }

  try {
    console.log('� Getting Auth status for', userIds.length, 'users...');
    
    // Use Appwrite SDK to execute function (includes authentication)
    const execution = await functions.createExecution(
      BLOCK_USER_FUNCTION_ID,
      JSON.stringify({ operation: 'getUsersStatus', userIds }),
      false // async = false, wait for completion
    );
    
    // Parse response
    const responseBody = JSON.parse(execution.responseBody);
    
    if (!responseBody.success) {
      throw new Error(responseBody.error || 'Failed to get users status');
    }
    
    console.log(`✅ Got status for ${Object.keys(responseBody.statusMap).length} users`);
    return responseBody.statusMap;
  } catch (error) {
    console.error('❌ Error getting users status:', error);
    throw error;
  }
};

/**
 * Block/Unblock user via Appwrite Function
 * @param {string} userId - User ID to block/unblock
 * @param {boolean} block - true to block, false to unblock
 * @returns {Promise<Object>}
 */
export const blockUser = async (userId, block) => {
  if (!BLOCK_USER_FUNCTION_ID) {
    throw new Error('Block User Function not configured. Add VITE_BLOCK_USER_FUNCTION_ID to .env');
  }

  try {
    // Use Appwrite SDK to execute function (includes authentication)
    const execution = await functions.createExecution(
      BLOCK_USER_FUNCTION_ID,
      JSON.stringify({ userId, block }),
      false // async = false, wait for completion
    );
    
    // Parse response
    const responseBody = JSON.parse(execution.responseBody);
    
    if (!responseBody.success) {
      throw new Error(responseBody.error || 'Function execution failed');
    }
    
    return responseBody;
  } catch (error) {
    console.error('❌ Error blocking user:', error);
    throw error;
  }
};

/**
 * Get all teams from Appwrite
 * @returns {Promise<Array>}
 */
export const getAllTeams = async () => {
  if (!MANAGE_TEAM_FUNCTION_ID) {
    throw new Error('Manage Team Function not configured. Add VITE_MANAGE_TEAM_FUNCTION_ID to .env');
  }

  try {
    console.log('📋 Getting all teams...');
    
    const execution = await functions.createExecution(
      MANAGE_TEAM_FUNCTION_ID,
      JSON.stringify({ action: 'listTeams' }),
      false
    );
    
    const responseBody = JSON.parse(execution.responseBody);
    
    if (!responseBody.success) {
      throw new Error(responseBody.error || 'Failed to get teams');
    }
    
    console.log(`✅ Got ${responseBody.teams.length} teams`);
    return responseBody.teams;
  } catch (error) {
    console.error('❌ Error getting teams:', error);
    throw error;
  }
};

/**
 * Get teams for all users (bulk operation)
 * @param {string[]} userIds - Array of user IDs
 * @returns {Promise<Object>} Map of userId -> teams[]
 */
export const getAllUserTeams = async (userIds) => {
  if (!MANAGE_TEAM_FUNCTION_ID) {
    throw new Error('Manage Team Function not configured. Add VITE_MANAGE_TEAM_FUNCTION_ID to .env');
  }

  try {
    console.log('📋 Getting teams for', userIds.length, 'users (bulk)...');
    
    const execution = await functions.createExecution(
      MANAGE_TEAM_FUNCTION_ID,
      JSON.stringify({ action: 'getAllUserTeams', userIds }),
      false
    );
    
    const responseBody = JSON.parse(execution.responseBody);
    
    if (!responseBody.success) {
      throw new Error(responseBody.error || 'Failed to get user teams');
    }
    
    console.log(`✅ Got teams for ${Object.keys(responseBody.userTeamsMap).length} users`);
    return responseBody.userTeamsMap;
  } catch (error) {
    console.error('❌ Error getting user teams:', error);
    throw error;
  }
};

/**
 * Add user to team via Appwrite Function
 * @param {string} userId - User ID to add
 * @param {string} teamId - Team ID
 * @returns {Promise<Object>}
 */
export const addUserToTeam = async (userId, teamId) => {
  if (!MANAGE_TEAM_FUNCTION_ID) {
    throw new Error('Manage Team Function not configured. Add VITE_MANAGE_TEAM_FUNCTION_ID to .env');
  }

  try {
    // Use Appwrite SDK to execute function (includes authentication)
    const execution = await functions.createExecution(
      MANAGE_TEAM_FUNCTION_ID,
      JSON.stringify({ action: 'add', userId, teamId }),
      false // async = false, wait for completion
    );
    
    // Parse response
    const responseBody = JSON.parse(execution.responseBody);
    
    if (!responseBody.success) {
      throw new Error(responseBody.error || 'Function execution failed');
    }
    
    return responseBody;
  } catch (error) {
    console.error('❌ Error adding user to team:', error);
    throw error;
  }
};

/**
 * Remove user from team via Appwrite Function
 * @param {string} teamId - Team ID
 * @param {string} membershipId - Membership ID
 * @returns {Promise<Object>}
 */
export const removeUserFromTeam = async (teamId, membershipId) => {
  if (!MANAGE_TEAM_FUNCTION_ID) {
    throw new Error('Manage Team Function not configured. Add VITE_MANAGE_TEAM_FUNCTION_ID to .env');
  }

  try {
    // Use Appwrite SDK to execute function (includes authentication)
    const execution = await functions.createExecution(
      MANAGE_TEAM_FUNCTION_ID,
      JSON.stringify({ action: 'remove', teamId, membershipId }),
      false // async = false, wait for completion
    );
    
    // Parse response
    const responseBody = JSON.parse(execution.responseBody);
    
    if (!responseBody.success) {
      throw new Error(responseBody.error || 'Function execution failed');
    }
    
    return responseBody;
  } catch (error) {
    console.error('❌ Error removing user from team:', error);
    throw error;
  }
};
