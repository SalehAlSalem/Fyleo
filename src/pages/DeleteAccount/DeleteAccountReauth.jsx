import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { account } from '../../config/appwrite';
import { 
  ModernButton, 
  ModernInput, 
  ModernCard,
  ModernAlert
} from '@shared/ui/modern/ModernComponents';

/**
 * صفحة إعادة تسجيل الدخول لحذف الحساب
 * يجب على المستخدم تسجيل الدخول مرة أخرى للتأكيد
 */
const DeleteAccountReauth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // إذا لم يكن هناك user، ارجع للصفحة الرئيسية
  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // تسجيل دخول بالإيميل والباسورد
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // حذف الـ session الحالية أولاً
      console.log('🗑️ Deleting current session...');
      try {
        await account.deleteSession('current');
        console.log('✅ Current session deleted');
      } catch (e) {
        console.log('ℹ️ No session to delete or already deleted');
      }
      
      // إنشاء session جديدة
      console.log('🔐 Creating new session...');
      await account.createEmailPasswordSession(email, password);
      console.log('✅ New session created');
      
      // إذا نجح، انتقل لصفحة التأكيد النهائي
      navigate('/delete-account/confirm', { 
        state: { authenticated: true, method: 'email' }
      });
      
    } catch (error) {
      console.error('❌ Re-authentication error:', error);
      if (error.code === 401) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else {
        setError('حدث خطأ في تسجيل الدخول: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // تسجيل دخول بـ Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      // حفظ state للعودة بعد OAuth (قبل أي شيء!)
      sessionStorage.setItem('deleteAccountFlow', 'true');
      console.log('💾 Saved deleteAccountFlow flag');
      
      // استخدام loginWithGoogle العادي (متوافق مع Safari)
      const result = await loginWithGoogle();
      
      if (!result.success) {
        setError(result.message || 'حدث خطأ في تسجيل الدخول بـ Google');
        sessionStorage.removeItem('deleteAccountFlow');
        setLoading(false);
      }
      // إذا نجح، سيتم redirect تلقائياً
    } catch (error) {
      console.error('❌ Google login error:', error);
      setError('حدث خطأ في تسجيل الدخول بـ Google');
      sessionStorage.removeItem('deleteAccountFlow');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <ModernCard className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
            تأكيد هويتك
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            للمتابعة في حذف حسابك، يجب عليك تسجيل الدخول مرة أخرى
          </p>
        </div>

        {/* Warning Box */}
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                تحذير هام
              </p>
              <p className="text-xs text-red-700 dark:text-red-300">
                بعد تسجيل الدخول، ستتمكن من حذف حسابك نهائياً. هذا الإجراء لا يمكن التراجع عنه.
              </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              البريد الإلكتروني
            </label>
            <ModernInput
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <ModernInput
                type={showPassword ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <ModernAlert variant="error">
              {error}
            </ModernAlert>
          )}

          <ModernButton
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            loading={loading}
          >
            تسجيل الدخول والمتابعة
          </ModernButton>
        </form>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">أو</span>
          </div>
        </div>

        {/* Google Login */}
        <ModernButton
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          تسجيل الدخول بـ Google
        </ModernButton>

        {/* Cancel Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/profile')}
            className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            إلغاء وعودة للملف الشخصي
          </button>
        </div>
      </ModernCard>
    </div>
  );
};

export default DeleteAccountReauth;

