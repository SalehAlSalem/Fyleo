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
      console.log('🔍 User session retrieved:', session);
      setUser(session);
      
      // إذا كان المستخدم مسجل، احفظه في Database
      if (session && session.email) {
        try {
          console.log('🔍 Checking if user exists in database:', session.email);
          
          // تحقق إذا كان المستخدم موجود في Database
          const existingUser = await DatabaseService.getUserByEmail(session.email);
          console.log('🔍 Existing user check result:', existingUser);
          
          if (!existingUser) {
            // إذا لم يكن موجود، أنشئ سجل جديد
            console.log('💾 Creating new user in database...');
            console.log('💾 User data to save:', {
              name: session.name || session.email,
              email: session.email
            });
            
            const newUser = await DatabaseService.createUser({
              name: session.name || session.email,
              email: session.email
            });
            
            console.log('✅ User saved to database:', newUser);
          } else {
            console.log('✅ User already exists in database');
          }
        } catch (dbError) {
          console.error('❌ Database operation failed:', dbError);
          console.error('❌ Error details:', {
            name: dbError.name,
            message: dbError.message,
            code: dbError.code,
            type: dbError.type
          });
        }
      } else {
        console.log('⚠️ No session or email found');
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
      
      // بعد النجاح، الـ redirect سيحدث تلقائياً
      // وسيتم استدعاء checkUserSession في useEffect
      return { success: true };
    } catch (error) {
      console.error('Google OAuth error:', error);
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