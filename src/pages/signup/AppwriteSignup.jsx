import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { 
  ModernButton, 
  ModernInput, 
  ModernCard,
  ModernAlert,
  useTheme 
} from '@shared/ui/modern/ModernComponents';

const AppwriteSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { user, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();

  useEffect(() => {
    if (user) {
      navigate('/workspace');
    }
  }, [user, navigate]);

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return false;
    }

    if (formData.password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('البريد الإلكتروني غير صحيح');
      return false;
    }

    return true;
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await loginWithGoogle();
      if (result?.success) return; // سيتم التحويل عبر OAuth تلقائياً
      setError(result?.message || 'فشل بدء التسجيل/تسجيل الدخول عبر Google');
    } catch (error) {
      setError('فشل التسجيل عبر Google');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      console.log('🔵 Starting signup process...');
      const result = await signup(formData.email, formData.password, formData.name);
      console.log('📊 Signup result:', result);
      
      if (result.success) {
        console.log('✅ Signup successful, navigating to workspace...');
        navigate('/workspace');
      } else {
        console.error('❌ Signup failed:', result.error);
        // التحقق من نوع الخطأ
        if (result.error?.includes('already exists') || result.error?.includes('user_already_exists') || result.error === 'user_already_exists') {
          setError('البريد الإلكتروني مستخدم بالفعل. جاري تسجيل الدخول...');
          // إعطاء وقت لعرض الرسالة ثم المحاولة مرة أخرى
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else if (result.error?.includes('invalid_password') || result.error === 'user_invalid_password') {
          setError('كلمة المرور ضعيفة جداً');
        } else if (result.error?.includes('invalid_email') || result.error === 'user_invalid_email') {
          setError('البريد الإلكتروني غير صحيح');
        } else {
          setError('حدث خطأ أثناء إنشاء الحساب: ' + result.error);
        }
      }
    } catch (error) {
      console.error('💥 Signup exception:', error);
      setError('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['ضعيفة جداً', 'ضعيفة', 'متوسطة', 'قوية', 'قوية جداً'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];

  return (
    <div className="relative flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 dark:from-gray-900 dark:via-green-900/20 dark:to-gray-800 px-4 py-8 overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-green-400/30 dark:bg-green-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400/30 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
        
        {/* Sparkles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `sparkle ${3 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0
            }}
          >
            {['✨', '⭐', '🌟', '💫'][Math.floor(Math.random() * 4)]}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .bg-300\% { background-size: 300% 300%; }
        .animate-gradient { animation: gradient 3s ease infinite; }
      `}</style>

      <ModernCard className="w-full max-w-md relative backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 shadow-2xl border border-white/20 dark:border-gray-700/50 animate-fade-in">
        <div className="text-center mb-8">
          {/* Animated Welcome Icon */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-4xl shadow-2xl transform hover:rotate-12 transition-transform duration-500">
              🚀
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black mb-3 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            احصل على أقصى استفادة من حياتك التعليمية
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium">انضم لآلاف الطلاب المتميزين 🌟</p>
        </div>

        {/* Google Sign Up - الخيار الموصى به في الأعلى */}
        <div className="space-y-3 mb-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
            <ModernButton
              type="button"
              variant="outline"
              className="relative w-full py-3 border-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all transform hover:scale-[1.02] hover:shadow-xl"
              onClick={handleGoogleSignup}
              disabled={loading}
            >
            <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-semibold">المتابعة مع Google</span>
            </ModernButton>
          </div>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">أو</span>
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الاسم الكامل
            </label>
            <ModernInput
              type="text"
              name="name"
              placeholder="أدخل اسمك الكامل"
              value={formData.name}
              onChange={handleInputChange}
              required
              autoComplete="name"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              البريد الإلكتروني
            </label>
            <ModernInput
              type="email"
              name="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="email"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              كلمة المرور
            </label>
            <ModernInput
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="أدخل كلمة مرور قوية"
              value={formData.password}
              onChange={handleInputChange}
              required
              autoComplete="new-password"
              className="w-full"
            />
            <div className="mt-2 text-right">
              <button
                type="button"
                className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400"
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              </button>
            </div>
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${strengthColors[passwordStrength - 1] || 'bg-gray-300'}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {strengthLabels[passwordStrength - 1] || 'ضعيفة جداً'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              تأكيد كلمة المرور
            </label>
            <ModernInput
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="أعد كتابة كلمة المرور"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              autoComplete="new-password"
              className="w-full"
            />
            <div className="mt-2 text-right">
              <button
                type="button"
                className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400"
                onClick={() => setShowConfirmPassword(v => !v)}
              >
                {showConfirmPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              </button>
            </div>
          </div>

          {error && (
            <ModernAlert variant="error">
              {error}
            </ModernAlert>
          )}

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500 animate-gradient bg-300%"></div>
            <ModernButton
              type="submit"
              className="relative w-full py-3.5 rounded-full font-bold text-lg bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 hover:from-green-700 hover:via-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all shadow-xl"
              loading={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري إنشاء الحساب...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>🎉</span>
                  الموافقة والانضمام
                  <span className="text-xl transform group-hover:translate-x-1 transition-transform">→</span>
                </span>
              )}
            </ModernButton>
          </div>

          {/* نص الشروط مثل LinkedIn - بدون checkbox */}
          <div className="text-center text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            بالنقر على "الموافقة والانضمام"، فإنك توافق على{' '}
            <Link to="/terms-of-service" target="_blank" className="text-blue-600 hover:underline font-medium">
              اتفاقية المستخدم
            </Link>
            {' '}و{' '}
            <Link to="/privacy-policy" target="_blank" className="text-blue-600 hover:underline font-medium">
              سياسة الخصوصية
            </Link>
            {' '}الخاصة بـ Fyleo.
          </div>
        </form>

        <div className="mt-6 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            لديك حساب في Fyleo؟{' '}
            <Link 
              to="/login" 
              className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </ModernCard>
    </div>
  );
};

export default AppwriteSignup;
