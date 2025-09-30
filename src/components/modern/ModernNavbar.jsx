import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  ModernButton, 
  ThemeToggle, 
  LanguageToggle, 
  useTranslation 
} from '../modern/ModernComponents';

const ModernNavbar = () => {
  const { user, loading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { name: t('home'), path: '/', icon: '🏠' },
    { name: t('materials'), path: '/materials', icon: '📚' },
    { name: t('dashboard'), path: '/dashboard', icon: '📊', authRequired: true },
    { name: 'البروفايل', path: '/profile', icon: '👤', authRequired: true },
  ];

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        navigate('/');
      } else {
        console.error('Logout error:', result.error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className={`navbar-modern transition-all duration-300 ${scrolled ? 'shadow-modern' : ''}`}>
      <div className="container-modern">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-modern transform hover:scale-105 transition-transform duration-200">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                >
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold gradient-text">Fyleo</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">منصة الملفات</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navItems.map((item) => {
              if (item.authRequired && !user) return null;
              
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isActive 
                      ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <ThemeToggle />
            <LanguageToggle />
            
            {loading ? (
              <div className="w-8 h-8 rounded-full loading-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="relative group">
                  <button className="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                      {user.displayName?.[0] || user.email?.[0] || '👤'}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 glass border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-2">
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 rtl:space-x-reverse w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span>📊</span>
                        <span>{t('dashboard')}</span>
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 rtl:space-x-reverse w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span>👤</span>
                        <span>{t('profile')}</span>
                      </Link>
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 rtl:space-x-reverse w-full px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <span>🚪</span>
                        <span>{t('logout')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Link to="/login">
                  <ModernButton variant="ghost" size="sm">
                    {t('login')}
                  </ModernButton>
                </Link>
                <Link to="/signup">
                  <ModernButton variant="primary" size="sm">
                    {t('signup')}
                  </ModernButton>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg 
              className={`w-6 h-6 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 space-y-2 border-t border-gray-200 dark:border-gray-700 mt-4">
            {navItems.map((item) => {
              if (item.authRequired && !user) return null;
              
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive 
                      ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <ThemeToggle />
                <LanguageToggle />
              </div>
              
              {!loading && !user && (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <ModernButton variant="ghost" size="sm">
                      {t('login')}
                    </ModernButton>
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    <ModernButton variant="primary" size="sm">
                      {t('signup')}
                    </ModernButton>
                  </Link>
                </div>
              )}
            </div>

            {user && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                    {user.displayName?.[0] || user.email?.[0] || '👤'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {user.displayName || 'المستخدم'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <span>🚪</span>
                  <span>{t('logout')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ModernNavbar;