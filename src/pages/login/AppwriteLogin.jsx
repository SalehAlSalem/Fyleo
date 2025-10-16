import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { 
  ModernButton, 
  ModernInput, 
  ModernCard,
  ModernAlert,
  useTheme 
} from '../../components/modern/ModernComponents';

const AppwriteLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const { user, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t('common.error'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(email, password, rememberMe);
      if (result.success) {
        navigate('/dashboard');
      } else {
        switch (result.error) {
          case 'user_invalid_credentials':
            setError(t('common.error'));
            break;
          case 'user_not_found':
            setError(t('common.error'));
            break;
          case 'user_blocked':
            setError(t('common.error'));
            break;
          default:
            setError(t('common.error'));
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      await loginWithGoogle();
      // الـ redirect سيحصل تلقائياً إلى /oauth-callback
      // لا نحتاج navigate هنا
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.message || t('common.error'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <ModernCard className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('auth.welcomeBack')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('landing.heroSubtitle')}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('auth.email')}
            </label>
            <ModernInput
              type="email"
              placeholder={t('auth.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('auth.password')}
            </label>
            <ModernInput
              type="password"
              placeholder={t('auth.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="mr-2 text-sm text-gray-600 dark:text-gray-400">
                {t('auth.rememberMe')}
              </span>
            </label>
            <Link 
              to="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              {t('auth.forgotPassword')}
            </Link>
          </div>

          {error && (
            <ModernAlert variant="error">
              {error}
            </ModernAlert>
          )}

          <ModernButton
            type="submit"
            className="w-full"
            loading={loading}
          >
            {t('nav.login')}
          </ModernButton>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">{t('common.or') || 'أو'}</span>
            </div>
          </div>

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
            {t('auth.signInWithGoogle')}
          </ModernButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('auth.dontHaveAccount')}{' '}
            <Link 
              to="/signup" 
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              {t('nav.signup')}
            </Link>
          </p>
        </div>
      </ModernCard>
    </div>
  );
};

export default AppwriteLogin;