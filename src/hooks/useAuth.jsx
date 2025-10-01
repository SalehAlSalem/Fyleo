import { useState, useEffect, createContext, useContext } from 'react';
import { account, ID, OAuthProvider } from '../config/appwrite';
import { DatabaseService } from '../config/DatabaseService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const session = await account.get();
      setUser(session);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      await account.createEmailSession(email, password);
      const session = await account.get();
      setUser(session);
      return { success: true, user: session };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (email, password, name) => {
    try {
      // إنشاء المستخدم في Appwrite Auth
      const authUser = await account.create(ID.unique(), email, password, name);
      
      // تسجيل الدخول بعد التسجيل
      const loginResult = await login(email, password);
      
      if (loginResult.success) {
        try {
          // حفظ بيانات المستخدم في Database Collection
          console.log('💾 Saving user to database...');
          const userDocument = await DatabaseService.createUser({
            name: name,
            email: email
            // بس الـ attributes الموجودة في Collection
          });
          
          console.log('✅ User saved to database:', userDocument);
        } catch (dbError) {
          console.error('❌ Failed to save user to database:', dbError);
          // لا نوقف التسجيل إذا فشل حفظ البيانات في القاعدة
        }
      }
      
      return loginResult;
    } catch (error) {
      console.error('❌ Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      // إنشاء Google OAuth session
      await account.createOAuth2Session(
        OAuthProvider.Google,
        `${window.location.origin}/dashboard`, // success redirect
        `${window.location.origin}/login?error=oauth_failed` // failure redirect
      );
      // ملاحظة: الـ redirect سيحدث تلقائياً، لذا لن نصل لهذا الجزء
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (email) => {
    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const updatedUser = await account.updateName(updates.name);
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const changePassword = async (newPassword, oldPassword) => {
    try {
      await account.updatePassword(newPassword, oldPassword);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getCurrentSession = async () => {
    try {
      const session = await account.getSession('current');
      return { success: true, session };
    } catch (error) {
      return { success: false, error: error.message };
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
    getCurrentSession,
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