import { account } from '../config/appwrite';

/**
 * 🔍 Session Debugging Utility
 * Helps diagnose authentication and session issues
 */

export const sessionDebug = {
  /**
   * Check if user has active session
   */
  async checkSession() {
    console.log('🔍 === SESSION DEBUG START ===');
    
    try {
      // Try to get current user
      const user = await account.get();
      console.log('✅ Active session found:', {
        userId: user.$id,
        email: user.email,
        name: user.name,
        emailVerification: user.emailVerification,
        labels: user.labels
      });
      
      // Check cookies
      const cookies = document.cookie;
      console.log('🍪 Cookies:', cookies ? 'Present' : 'None');
      
      return { hasSession: true, user };
    } catch (error) {
      console.error('❌ No active session:', {
        code: error.code,
        type: error.type,
        message: error.message
      });
      
      // Check cookies even on error
      const cookies = document.cookie;
      console.log('🍪 Cookies:', cookies ? 'Present but invalid' : 'None');
      
      return { hasSession: false, error };
    } finally {
      console.log('🔍 === SESSION DEBUG END ===');
    }
  },

  /**
   * List all active sessions
   */
  async listSessions() {
    try {
      const sessions = await account.listSessions();
      console.log('📋 Active sessions:', sessions);
      return sessions;
    } catch (error) {
      console.error('❌ Failed to list sessions:', error);
      return null;
    }
  },

  /**
   * Get session details
   */
  async getSessionDetails() {
    try {
      const session = await account.getSession('current');
      console.log('📄 Current session details:', session);
      return session;
    } catch (error) {
      console.error('❌ Failed to get session details:', error);
      return null;
    }
  }
};

export default sessionDebug;
