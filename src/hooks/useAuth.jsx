import { useState, useEffect, createContext, useContext } from 'react';
import { account, ID, OAuthProvider } from '../config/appwrite';
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
      const session = await account.get();
      setUser(session);
      try {
        await usersService.create({ name: session.name, email: session.email });
      } catch (_) {}
      setLoading(false);
      return { success: true, user: session };
    } catch (error) {
      setUser(null);
      setLoading(false);
      return { success: false, user: null };
    }
  };

  const login = async (email, password) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const session = await account.get();
      setUser(session);
      
      // إضافة المستخدم إلى قاعدة البيانات إذا لم يكن موجوداً
      try {
        await usersService.create({ name: session.name, email: session.email });
      } catch (_) {
        // تجاهل الأخطاء إذا كان المستخدم موجوداً بالفعل
      }
      
      return { success: true, user: session };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (email, password, name) => {
    try {
      await account.create(ID.unique(), email, password, name);
      const loginResult = await login(email, password);
      
      // إرسال إيميل التحقق تلقائياً
      if (loginResult.success) {
        try {
          await account.createVerification(`${window.location.origin}/verify-email`);
        } catch (verifyError) {
          console.warn('Could not send verification email:', verifyError);
        }
      }
      
      return loginResult;
    } catch (error) {
      // إذا كان الحساب موجوداً بالفعل (409 Conflict)، حاول تسجيل الدخول
      if (error.code === 409 || error.message?.includes('already exists') || error.message?.includes('user_already_exists')) {
        console.log('⚠️ User already exists, attempting login...');
        const loginResult = await login(email, password);
        return loginResult;
      }
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      // حفظ علامة إن المستخدم بدأ OAuth
      localStorage.setItem('oauth_in_progress', 'true');
      localStorage.setItem('oauth_start_time', Date.now().toString());

      // استخدام createOAuth2Token لملاءمة Safari ITP
      // يرسل userId & secret في URL بدل cookies (Safari ITP يحظر cookies)
      await account.createOAuth2Token(
        OAuthProvider.Google,
        `${window.location.origin}/oauth-callback`,
        `${window.location.origin}/login?error=oauth_failed`
      );
      return { success: true };
    } catch (error) {
      console.error('Google OAuth error:', error);
      localStorage.removeItem('oauth_in_progress');
      localStorage.removeItem('oauth_start_time');
      return { success: false, error: error.message, message: 'فشل بدء التسجيل/تسجيل الدخول عبر Google' };
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

  const sendVerificationEmail = async () => {
    try {
      await account.createVerification(`${window.location.origin}/verify-email`);
      return { success: true };
    } catch (error) {
      console.error('Error sending verification email:', error);
      return { success: false, error: error.message };
    }
  };

  const verifyEmail = async (userId, secret) => {
    try {
      await account.updateVerification(userId, secret);
      return { success: true };
    } catch (error) {
      console.error('Error verifying email:', error);
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
    checkUserSession,
    sendVerificationEmail,
    verifyEmail
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