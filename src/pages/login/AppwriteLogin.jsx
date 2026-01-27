import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  ModernButton, 
  ModernInput, 
  ModernCard,
  ModernAlert,
  useTranslation,
  useTheme 
} from '@shared/ui/modern/ModernComponents';

const AppwriteLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { user, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();

  useEffect(() => {
    if (user) {
      navigate('/workspace');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(email, password, rememberMe);
      if (result.success) {
        navigate('/workspace');
      } else {
        switch (result.error) {
          case 'user_invalid_credentials':
            setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            break;
          case 'user_not_found':
            setError('المستخدم غير موجود');
            break;
          case 'user_blocked':
          case 'account_blocked':
            setError('⛔ تم حظر حسابك. يرجى التواصل مع الإدارة عبر البريد الإلكتروني.');
            break;
          default:
            setError(result.message || 'حدث خطأ أثناء تسجيل الدخول');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await loginWithGoogle();
      if (result?.success) return; // سيتم التحويل عبر OAuth تلقائياً
      setError(result?.message || 'فشل بدء تسجيل الدخول بـ Google');
    } catch (error) {
      setError('فشل تسجيل الدخول بـ Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-800 px-4 py-8 overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/30 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/30 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-500/40 dark:bg-blue-400/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          50% { transform: translateY(-100px) translateX(50px); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
      `}</style>

      <ModernCard className="w-full max-w-md relative backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 shadow-2xl border border-white/20 dark:border-gray-700/50 animate-fade-in">
        <div className="text-center mb-8">
          {/* Logo Animation */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-4xl shadow-2xl transform hover:rotate-12 transition-transform duration-500">
              📚
            </div>
          </div>
          
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient bg-300%">
            تسجيل الدخول
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            ابق على اطلاع بعالمك التعليمي ✨
          </p>
        </div>

        {/* Google Sign In - الخيار الموصى به في الأعلى */}
        <div className="space-y-3 mb-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
            <ModernButton
              type="button"
              variant="outline"
              className="relative w-full py-3 border-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all transform hover:scale-[1.02] hover:shadow-xl"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
            <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            تسجيل الدخول بواسطة Google
            </ModernButton>
          </div>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 font-semibold">أو</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              البريد الإلكتروني
            </label>
            <ModernInput
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              كلمة المرور
            </label>
            <ModernInput
              type={showPassword ? 'text' : 'password'}
              placeholder="أدخل كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <Link 
              to="/forgot-password" 
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>

          {error && (
            <ModernAlert variant="error">
              {error}
            </ModernAlert>
          )}

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500 animate-gradient bg-300%"></div>
            <ModernButton
              type="submit"
              className="relative w-full py-3 rounded-full font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transform hover:scale-[1.02] transition-all shadow-xl"
              loading={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري التسجيل...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  تسجيل الدخول
                  <span className="text-xl transform group-hover:translate-x-1 transition-transform">→</span>
                </span>
              )}
            </ModernButton>
          </div>
        </form>

        <div className="mt-6 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            جديد في Fyleo؟{' '}
            <Link 
              to="/signup" 
              className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              انضم الآن
            </Link>
          </p>
        </div>
      </ModernCard>
    </div>
  );
};

export default AppwriteLogin;
