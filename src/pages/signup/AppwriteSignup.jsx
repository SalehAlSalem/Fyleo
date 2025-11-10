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
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
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

    if (!agreedToTerms) {
      setError('يجب الموافقة على شروط الخدمة وسياسة الخصوصية');
      return;
    }

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
    <div className="flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8" style={{ minHeight: '100vh' }}>
      <ModernCard className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            إنشاء حساب جديد
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            انضم إلى مجتمع Fyleo التعليمي
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
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

          <div className="space-y-4">
            <div className="flex items-start">
              <input
                id="terms-agreement"
                type="checkbox"
                className="h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <label htmlFor="terms-agreement" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {t('signup.legalCheckbox.agreeText')}{' '}
                <Link to="/terms-of-service" target="_blank" className="font-medium text-blue-600 hover:underline">
                  {t('signup.legalCheckbox.terms')}
                </Link>{' '}
                {t('signup.legalCheckbox.and')}{' '}
                <Link to="/privacy-policy" target="_blank" className="font-medium text-blue-600 hover:underline">
                  {t('signup.legalCheckbox.privacy')}
                </Link>
              </label>
            </div>

          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <p>• كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل</p>
            <p>• يُفضل استخدام أحرف كبيرة وصغيرة وأرقام ورموز</p>
          </div>

          <ModernButton
            type="submit"
            className="w-full"
            loading={loading}
            disabled={!agreedToTerms || loading}
          >
            إنشاء الحساب
          </ModernButton>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">أو</span>
            </div>
          </div>

          <ModernButton
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignup}
            disabled={!agreedToTerms || loading}
          >
            <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            المتابعة مع Google
          </ModernButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            لديك حساب بالفعل؟{' '}
            <Link 
              to="/login" 
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
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
