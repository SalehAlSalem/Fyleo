import { account, ID, OAuthProvider } from '../config/appwrite';
import { usersService } from './appwriteService';

/**
 * 🔐 Authentication Service
 * Handles all authentication operations
 */

export const authService = {
  /**
   * Login with email and password
   */
  async login(email, password) {
    try {
      console.log('🔐 Attempting login for:', email);
      
      // Delete any existing sessions first
      try {
        await account.deleteSession('current');
        console.log('🗑️ Cleared existing session');
      } catch (e) {
        // No existing session, that's fine
        console.log('ℹ️ No existing session to clear');
      }
      
      // Create email session
      const sessionResponse = await account.createEmailPasswordSession(email, password);
      console.log('✅ Session created:', sessionResponse.$id);
      
      // Get user account with retry logic
      let user = null;
      const maxRetries = 3;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          user = await account.get();
          console.log('✅ User retrieved:', {
            id: user.$id,
            email: user.email,
            verified: user.emailVerification
          });
          break;
        } catch (e) {
          console.warn(`⚠️ Retry ${attempt}/${maxRetries} failed:`, e.message);
          if (attempt === maxRetries) throw e;
          await new Promise(r => setTimeout(r, 300));
        }
      }
      
      // Verify session is working
      const sessions = await account.listSessions();
      console.log('📋 Active sessions:', sessions.total);
      
      return { success: true, user };
    } catch (error) {
      console.error('❌ Login error:', {
        type: error.type,
        code: error.code,
        message: error.message
      });
      return { 
        success: false, 
        error: error.type || error.code || 'login_failed',
        message: error.message 
      };
    }
  },

  /**
   * Register new user with email verification
   */
  async register(email, password, name) {
    try {
      // Create auth account
      const authUser = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      
      console.log('✅ Auth account created:', authUser);
      
      // Auto-login after registration
      const loginResult = await this.login(email, password);
      
      if (loginResult.success) {
        try {
          console.log('🔥🔥🔥 REGISTRATION: About to call usersService.create() 🔥🔥🔥');
          console.log('📝 User data:', { name, email });
          
          // Create user record in database
          const userRecord = await usersService.create({
            name: name,
            email: email
          });
          
          console.log('✅✅✅ User record created in database:', userRecord);
          console.log('✅ Document ID in users collection:', userRecord.$id);
          
          // Send verification email
          try {
            await this.sendEmailVerification();
            console.log('✅ Verification email sent');
          } catch (verifyError) {
            console.warn('⚠️ Failed to send verification email:', verifyError);
            // Don't fail registration if email sending fails
          }
        } catch (dbError) {
          console.error('⚠️ Failed to create user record:', dbError);
          // Don't fail registration if database record creation fails
        }
      }
      
      return loginResult;
    } catch (error) {
      console.error('❌ Registration error:', error);
      return { 
        success: false, 
        error: error.type || error.code || 'registration_failed',
        message: error.message 
      };
    }
  },

  /**
   * Login with Google OAuth
   * استخدام createOAuth2Token - الحل الصحيح لـ Safari ITP
   */
  async loginWithGoogle() {
    try {
      console.log('🔐 Starting Google OAuth with Token method...');
      
      // حفظ علامة إن المستخدم بدأ OAuth
      localStorage.setItem('oauth_in_progress', 'true');
      localStorage.setItem('oauth_start_time', Date.now().toString());
      
      // استخدام createOAuth2Token بدل createOAuth2Session
      // هذا يرسل userId و secret في الـ URL بدل cookies
      await account.createOAuth2Token(
        OAuthProvider.Google,
        `${window.location.origin}/oauth-callback`,
        `${window.location.origin}/login?error=oauth_failed`
      );
      
      return { success: true };
    } catch (error) {
      console.error('❌ Google OAuth error:', error);
      localStorage.removeItem('oauth_in_progress');
      localStorage.removeItem('oauth_start_time');
      return { 
        success: false, 
        error: error.type || 'oauth_failed',
        message: error.message 
      };
    }
  },

  /**
   * Logout current user
   */
  async logout() {
    try {
      await account.deleteSession('current');
      return { success: true };
    } catch (error) {
      console.error('❌ Logout error:', error);
      return { 
        success: false, 
        error: error.type || 'logout_failed',
        message: error.message 
      };
    }
  },

  /**
   * Get current session
   */
  async getCurrentUser() {
    try {
      console.log('🔍 Checking current user session...');
      const user = await account.get();
      console.log('✅ Current user found:', {
        id: user.$id,
        email: user.email,
        verified: user.emailVerification,
        labels: user.labels
      });
      return { success: true, user };
    } catch (error) {
      if (error.code === 401 || error.status === 401) {
        console.log('ℹ️ No active session (401)');
        return { success: false, error: 'no_session' };
      }
      console.error('❌ Get current user error:', {
        type: error.type,
        code: error.code,
        message: error.message
      });
      return { 
        success: false, 
        error: error.type || 'session_error',
        message: error.message 
      };
    }
  },

  /**
   * Update user name
   */
  async updateName(name) {
    try {
      const updatedUser = await account.updateName(name);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('❌ Update name error:', error);
      return { 
        success: false, 
        error: error.type || 'update_failed',
        message: error.message 
      };
    }
  },

  /**
   * Update user email
   */
  async updateEmail(email, password) {
    try {
      const updatedUser = await account.updateEmail(email, password);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('❌ Update email error:', error);
      return { 
        success: false, 
        error: error.type || 'update_failed',
        message: error.message 
      };
    }
  },

  /**
   * Update user password
   */
  async updatePassword(newPassword, oldPassword) {
    try {
      await account.updatePassword(newPassword, oldPassword);
      return { success: true };
    } catch (error) {
      console.error('❌ Update password error:', error);
      return { 
        success: false, 
        error: error.type || 'update_failed',
        message: error.message 
      };
    }
  },

  /**
   * Send password recovery email
   */
  async sendPasswordRecovery(email) {
    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );
      return { success: true };
    } catch (error) {
      console.error('❌ Password recovery error:', error);
      return { 
        success: false, 
        error: error.type || 'recovery_failed',
        message: error.message 
      };
    }
  },

  /**
   * Complete password recovery
   */
  async completePasswordRecovery(userId, secret, password) {
    try {
      await account.updateRecovery(userId, secret, password, password);
      return { success: true };
    } catch (error) {
      console.error('❌ Complete password recovery error:', error);
      return { 
        success: false, 
        error: error.type || 'recovery_failed',
        message: error.message 
      };
    }
  },

  /**
   * Create anonymous session
   */
  async createAnonymousSession() {
    try {
      const session = await account.createAnonymousSession();
      return { success: true, session };
    } catch (error) {
      console.error('❌ Anonymous session error:', error);
      return { 
        success: false, 
        error: error.type || 'session_failed',
        message: error.message 
      };
    }
  },

  /**
   * Verify email
   */
  async sendEmailVerification() {
    try {
      await account.createVerification(
        `${window.location.origin}/verify-email`
      );
      return { success: true };
    } catch (error) {
      console.error('❌ Email verification error:', error);
      return { 
        success: false, 
        error: error.type || 'verification_failed',
        message: error.message 
      };
    }
  },

  /**
   * Complete email verification
   */
  async completeEmailVerification(userId, secret) {
    try {
      await account.updateVerification(userId, secret);
      return { success: true };
    } catch (error) {
      console.error('❌ Complete email verification error:', error);
      return { 
        success: false, 
        error: error.type || 'verification_failed',
        message: error.message 
      };
    }
  }
};

export default authService;
