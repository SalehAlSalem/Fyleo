import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  ModernButton, 
  ModernInput, 
  ModernCard,
  ModernAlert,
  useTranslation,
  useTheme 
} from '../../components/modern/ModernComponents';

const ModernSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return false;
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await signup(formData.email, formData.password, formData.name);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      setError('حدث خطأ أثناء إنشاء الحساب. تحقق من البيانات وحاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');

    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Google signup error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setError('حدث خطأ أثناء إنشاء الحساب بـ Google');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <ModernCard className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 rtl:space-x-reverse mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-modern">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-7 h-7 text-white"
                  fill="currentColor"
                >
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </div>
              <div className="text-right rtl:text-left">
                <div className="text-2xl font-bold gradient-text">Fyleo</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">منصة الملفات</div>
              </div>
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {t('signup')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              انضم إلى منصة Fyleo واستمتع بأفضل خدمات مشاركة الملفات
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <ModernAlert type="error" className="mb-6">
              {error}
            </ModernAlert>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-6">
            <ModernInput
              type="text"
              name="name"
              label="الاسم الكامل"
              placeholder="أدخل اسمك الكامل"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={loading}
              icon="👤"
            />

            <ModernInput
              type="email"
              name="email"
              label="البريد الإلكتروني"
              placeholder="أدخل بريدك الإلكتروني"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={loading}
              icon="📧"
            />

            <ModernInput
              type="password"
              name="password"
              label="كلمة المرور"
              placeholder="أدخل كلمة مرور قوية"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={loading}
              icon="🔒"
            />

            <ModernInput
              type="password"
              name="confirmPassword"
              label="تأكيد كلمة المرور"
              placeholder="أعد إدخال كلمة المرور"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              disabled={loading}
              icon="🔒"
            />

            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
              />
              <label className="mr-2 text-sm text-gray-600 dark:text-gray-400">
                أوافق على{' '}
                <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                  شروط الخدمة
                </a>{' '}
                و{' '}
                <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                  سياسة الخصوصية
                </a>
              </label>
            </div>

            <ModernButton
              type="submit"
              size="lg"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد'}
            </ModernButton>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                أو
              </span>
            </div>
          </div>

          {/* Google Signup */}
          <ModernButton
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={handleGoogleSignup}
            disabled={loading}
          >
            <span className="flex items-center space-x-2 rtl:space-x-reverse">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>إنشاء حساب بـ Google</span>
            </span>
          </ModernButton>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              لديك حساب بالفعل؟{' '}
              <Link
                to="/login"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-500 font-medium transition-colors"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </ModernCard>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            بإنشاء حساب، أنت توافق على{' '}
            <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
              شروط الخدمة
            </a>{' '}
            و{' '}
            <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
              سياسة الخصوصية
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModernSignup;