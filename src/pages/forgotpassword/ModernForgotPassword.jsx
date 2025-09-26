import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../Firebase/ClientApp.js';
import { 
  ModernButton, 
  ModernInput, 
  ModernCard, 
  ModernAlert,
  useTranslation,
  useTheme 
} from '../../components/modern/ModernComponents';

const ModernForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError(t('emailRequired', 'البريد الإلكتروني مطلوب', 'Email is required'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (error) {
      console.error('Password reset error:', error);
      switch (error.code) {
        case 'auth/user-not-found':
          setError(t('userNotFound', 'المستخدم غير موجود', 'User not found'));
          break;
        case 'auth/invalid-email':
          setError(t('invalidEmail', 'البريد الإلكتروني غير صحيح', 'Invalid email address'));
          break;
        case 'auth/too-many-requests':
          setError(t('tooManyRequests', 'طلبات كثيرة جداً، حاول لاحقاً', 'Too many requests, try again later'));
          break;
        default:
          setError(t('resetError', 'حدث خطأ، حاول مرة أخرى', 'An error occurred, please try again'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 p-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="blob-container">
            <div className="blob blob-1 animate-blob-spin bg-gradient-to-r from-primary-400/20 to-secondary-400/20"></div>
            <div className="blob blob-2 animate-blob-bounce bg-gradient-to-r from-secondary-400/20 to-accent-400/20 animation-delay-2000"></div>
          </div>
        </div>

        <ModernCard className="w-full max-w-md relative z-10">
          <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
              <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('emailSent', 'تم إرسال البريد الإلكتروني', 'Email Sent')}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {t('resetEmailSent', 
                'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. تحقق من صندوق الوارد وصندوق الرسائل المرفوضة.',
                'A password reset link has been sent to your email. Check your inbox and spam folder.'
              )}
            </p>

            <div className="space-y-4">
              <Link to="/login" className="block">
                <ModernButton variant="primary" className="w-full">
                  {t('backToLogin', 'العودة لتسجيل الدخول', 'Back to Login')}
                </ModernButton>
              </Link>

              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
                className="w-full text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
              >
                {t('sendAnother', 'إرسال رسالة أخرى', 'Send Another Email')}
              </button>
            </div>
          </div>
        </ModernCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="blob-container">
          <div className="blob blob-1 animate-blob-spin bg-gradient-to-r from-primary-400/20 to-secondary-400/20"></div>
          <div className="blob blob-2 animate-blob-bounce bg-gradient-to-r from-secondary-400/20 to-accent-400/20 animation-delay-2000"></div>
          <div className="blob blob-3 animate-blob-pulse bg-gradient-to-r from-accent-400/20 to-primary-400/20 animation-delay-4000"></div>
        </div>
      </div>

      <ModernCard className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('forgotPassword', 'نسيت كلمة المرور؟', 'Forgot Password?')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t('forgotPasswordDesc', 
              'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور.',
              'Enter your email and we\'ll send you a password reset link.'
            )}
          </p>
        </div>

        {error && (
          <ModernAlert variant="error" className="mb-6">
            {error}
          </ModernAlert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <ModernInput
            type="email"
            placeholder={t('email', 'البريد الإلكتروني', 'Email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            }
          />

          <ModernButton
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full modern-button-glow"
          >
            {loading ? (
              t('sending', 'جاري الإرسال...', 'Sending...')
            ) : (
              t('sendResetLink', 'إرسال رابط الإعادة', 'Send Reset Link')
            )}
          </ModernButton>
        </form>

        <div className="mt-8 text-center">
          <Link 
            to="/login" 
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 font-medium"
          >
            {t('backToLogin', 'العودة لتسجيل الدخول', 'Back to Login')}
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t('noAccount', 'ليس لديك حساب؟', "Don't have an account?")}{' '}
            <Link 
              to="/signup" 
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 font-medium"
            >
              {t('signup', 'إنشاء حساب', 'Sign Up')}
            </Link>
          </p>
        </div>
      </ModernCard>
    </div>
  );
};

export default ModernForgotPassword;