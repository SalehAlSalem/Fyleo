import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { 
  ModernButton, 
  ThemeToggle
} from '../modern/ModernComponents';
import './ModernNavbar.css';

const ModernNavbar = ({ showUserMenu, setShowUserMenu }) => {
  const { user, loading, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navbarRef = useRef(null);

  // iOS Safari Fix - Force navbar to stay fixed
  useEffect(() => {
    if (navbarRef.current) {
      const navbar = navbarRef.current;
      navbar.style.position = 'fixed';
      navbar.style.top = '0';
      navbar.style.left = '0';
      navbar.style.right = '0';
      navbar.style.transform = 'translateZ(0)';
      navbar.style.webkitTransform = 'translateZ(0)';
      navbar.style.webkitBackfaceVisibility = 'hidden';
      navbar.style.backfaceVisibility = 'hidden';
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside - only on mobile
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      // Only close on mobile (screen width < 768px)
      if (window.innerWidth < 768 && !event.target.closest('.navbar-modern')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close mobile menu on scroll (no body overflow lock)
  useEffect(() => {
    if (!isOpen) return;
    const closeOnScroll = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('scroll', closeOnScroll, { passive: true });
    window.addEventListener('wheel', closeOnScroll, { passive: true });
    window.addEventListener('touchmove', closeOnScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', closeOnScroll);
      window.removeEventListener('wheel', closeOnScroll);
      window.removeEventListener('touchmove', closeOnScroll);
    };
  }, [isOpen]);

  // Allow interaction inside the mobile menu without instant close
  // (Scroll-to-close handled on window only)

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // Check if user is admin
  const isAdmin = user?.labels?.includes('admin');

  // Close user menu when clicking outside or scrolling
  useEffect(() => {
    if (!showUserMenu) return;
    
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    
    const handleScroll = () => {
      setShowUserMenu(false);
    };
    
    // Use setTimeout to allow button clicks to register first
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, [showUserMenu]);


  // Navigation items
  const navItems = [
    { name: t('nav.home'), path: '/', icon: '🏠' },
    { name: t('nav.materials'), path: '/library', icon: '📚' },
    { name: t('nav.gpaCalculator'), path: '/gpa-calculator', icon: '🎓' },
    { name: t('nav.workspace'), path: '/workspace', icon: '💼', authRequired: true },
    { name: t('nav.admin'), path: '/admin', icon: '⚙️', authRequired: true, adminOnly: true },
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
    <nav 
      ref={navbarRef}
      className={`navbar-modern fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg' 
          : 'bg-white dark:bg-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[1fr_auto] md:grid-cols-[300px_1fr_300px] items-center h-12 md:h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group md:w-[300px] w-auto flex-none justify-self-start logo" dir="ltr">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-orange-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <svg 
                viewBox="0 0 24 24" 
                className="w-4 h-4 md:w-6 md:h-6 text-white"
                fill="currentColor"
              >
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <span className="text-base md:text-xl font-bold gradient-text hidden sm:block whitespace-nowrap overflow-hidden text-ellipsis font-en">Fyleo</span>
          </Link>

          {/* Desktop Navigation - Material Tailwind Style */}
          <div className="hidden md:flex items-center justify-center md:justify-self-center min-w-0">
            {navItems.map((item) => {
              if (item.authRequired && !user) return null;
              if (item.adminOnly && !isAdmin) return null;
              
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item flex items-center ${isActive ? 'gap-2 px-4' : 'gap-0 px-3'} py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                    isActive 
                      ? 'text-white bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 shadow-lg' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="text-lg leading-none flex-shrink-0">{item.icon}</span>
                  <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 will-change-transform ${isActive ? 'max-w-[10rem] opacity-100 translate-y-0 ml-2' : 'max-w-0 opacity-0 translate-y-1'}`}>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Section - Fixed Width */}
          <div className="hidden md:flex items-center gap-1 gap-fixed w-[300px] min-w-[300px] justify-end md:justify-self-end flex-none" dir="ltr">
            <div className="navbar-tools flex items-center gap-1 gap-fixed flex-none font-en">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            
            {loading ? (
              <div className="w-8 h-8 rounded-full loading-pulse"></div>
            ) : user ? (
              <div className="flex items-center" dir="ltr">
                <div className="relative" ref={userMenuRef}>
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold hover:shadow-lg transition-all duration-200 flex-shrink-0"
                    style={{ fontSize: '16px', lineHeight: '16px', padding: 0 }}
                    aria-label="User Profile"
                  >
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                      {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '👤'}
                    </span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 z-[60] animate-slideDown border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                          <span style={{ fontSize: '20px', lineHeight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                            {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '👤'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{user.name || 'User'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                      
                      {/* Logout Button */}
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLogout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 text-sm font-medium cursor-pointer"
                        type="button"
                      >
                        <span className="text-lg">🚪</span>
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 justify-end flex-none font-en">
                <Link to="/login">
                  <button className="auth-btn auth-btn-login">
                    {t('nav.login')}
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="auth-btn auth-btn-signup">
                    {t('nav.signup')}
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: Theme, Language & Profile Buttons */}
          <div className="md:hidden flex items-center justify-center gap-1 col-start-2 justify-self-center">
            <ThemeToggle />
            <LanguageSwitcher />
            
            {/* Mobile Profile Button */}
            {!loading && user && (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold hover:shadow-lg transition-all duration-200 flex-shrink-0"
                  style={{ fontSize: '16px', lineHeight: '16px', padding: 0 }}
                  aria-label="User Profile"
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '👤'}
                  </span>
                </button>

                {/* Mobile User Menu Dropdown - Opens BELOW the button */}
                {showUserMenu && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 z-[60] animate-slideDown border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        <span style={{ fontSize: '20px', lineHeight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                          {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '👤'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{user.name || 'User'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="space-y-2">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-sm font-medium"
                        >
                          <span className="text-lg">⚙️</span>
                          <span>{t('nav.admin')}</span>
                        </Link>
                      )}
                      
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 text-sm font-medium"
                      >
                        <span className="text-lg">🚪</span>
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ModernNavbar;