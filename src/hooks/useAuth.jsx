import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/authService';
import { usersService } from '../services/appwriteService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const result = await authService.getCurrentUser();
      
      if (result.success) {
        console.log('✅ User session retrieved:', result.user);
        setUser(result.user);
        
        // Ensure user exists in database (important for OAuth users)
        if (result.user && result.user.email) {
          try {
            console.log('🔍 Checking if user exists in database...');
            const existingUser = await usersService.getByEmail(result.user.email);
            
            if (!existingUser) {
              console.log('💾 Creating user record in database for OAuth user...');
              await usersService.create({
                name: result.user.name || result.user.email.split('@')[0],
                email: result.user.email
              });
              console.log('✅ User record created successfully');
            } else {
              console.log('✅ User already exists in database');
            }
          } catch (dbError) {
            console.error('⚠️ Database operation failed:', dbError);
            // Don't fail the session check if database operation fails
            // User can still use the app with auth session
          }
        }
      } else {
        console.log('ℹ️ No active session');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Session check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: 'login_failed', message: error.message };
    }
  };

  const signup = async (email, password, name) => {
    try {
      const result = await authService.register(email, password, name);
      
      if (result.success) {
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Signup error:', error);
      return { success: false, error: 'signup_failed', message: error.message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await authService.loginWithGoogle();
      return result;
    } catch (error) {
      console.error('❌ Google login error:', error);
      return { success: false, error: 'oauth_failed', message: error.message };
    }
  };

  const logout = async () => {
    try {
      const result = await authService.logout();
      
      if (result.success) {
        setUser(null);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Logout error:', error);
      return { success: false, error: 'logout_failed', message: error.message };
    }
  };

  const resetPassword = async (email) => {
    try {
      const result = await authService.sendPasswordRecovery(email);
      return result;
    } catch (error) {
      console.error('❌ Password reset error:', error);
      return { success: false, error: 'reset_failed', message: error.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const result = await authService.updateName(updates.name);
      
      if (result.success) {
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Update profile error:', error);
      return { success: false, error: 'update_failed', message: error.message };
    }
  };

  const changePassword = async (newPassword, oldPassword) => {
    try {
      const result = await authService.updatePassword(newPassword, oldPassword);
      return result;
    } catch (error) {
      console.error('❌ Change password error:', error);
      return { success: false, error: 'password_change_failed', message: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    loginWithGoogle,
    signup,
    logout,
    resetPassword,
    updateProfile,
    changePassword,
    checkUserSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;