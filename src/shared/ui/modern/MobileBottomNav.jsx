import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import './ModernNavbar.css';

const MobileBottomNav = ({ onProfileClick, showUserMenu, onSearchClick, showSearch, onNavigate }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navRef = useRef(null);

  // Fix iOS Safari bottom nav position - force hardware acceleration
  useEffect(() => {
    if (!navRef.current) return;
    
    // Force hardware acceleration on iOS Safari
    const nav = navRef.current;
    nav.style.position = 'fixed';
    nav.style.bottom = '0';
    nav.style.left = '0';
    nav.style.right = '0';
    nav.style.transform = 'translateZ(0)';
    nav.style.webkitTransform = 'translateZ(0)';
    nav.style.webkitBackfaceVisibility = 'hidden';
    nav.style.backfaceVisibility = 'hidden';
    
    let lastHeight = window.innerHeight;
    
    const updateNavPosition = () => {
      if (!navRef.current) return;
      
      const currentHeight = window.innerHeight;
      
      // Only update if height actually changed (address bar show/hide)
      if (Math.abs(currentHeight - lastHeight) > 50) {
        lastHeight = currentHeight;
        
        // Maintain hardware acceleration
        navRef.current.style.transform = 'translateZ(0)';
        navRef.current.style.webkitTransform = 'translateZ(0)';
      }
    };

    updateNavPosition();

    // Listen only to resize (when address bar appears/disappears)
    window.addEventListener('resize', updateNavPosition);
    window.addEventListener('orientationchange', updateNavPosition);

    return () => {
      window.removeEventListener('resize', updateNavPosition);
      window.removeEventListener('orientationchange', updateNavPosition);
    };
  }, []);

  // Scroll to top when clicking on the same page
  const handleNavClick = (path) => {
    if (location.pathname === path) {
      // إذا كنا بنفس الصفحة، ارفع للفوق
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (onNavigate) {
      onNavigate();
    }
  };

  // Right side items (على اليمين): الرئيسية + المكتبة
  const rightItems = [
    { name: t('nav.home'), path: '/', icon: '🏠' },
    { name: t('nav.materials'), path: '/library', icon: '📚' },
  ];
  
  // Left side items (على اليسار): الحاسبة + (الورك سبيس أو تسجيل الدخول)
  const leftItems = [
    { name: t('nav.gpaCalculator'), path: '/gpa-calculator', icon: '🎓' },
    // إذا مسجل: الورك سبيس، إذا مش مسجل: تسجيل الدخول
    user 
      ? { name: t('nav.workspace'), path: '/workspace', icon: '💼' }
      : { name: t('nav.login'), path: '/login', icon: '🔑' }
  ];

  return (
    <div className="mobile-bottom-nav-wrapper md:hidden" ref={navRef}>
      {/* Navigation Bar - Simple centered layout */}
      <div className="mobile-bottom-nav">
        {/* Right Side: Home + Library */}
        <div className="nav-section right">
          {rightItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                aria-label={item.name}
              >
                <span className="icon">{item.icon}</span>
                {isActive && <span className="active-indicator"></span>}
              </Link>
            );
          })}
        </div>

        {/* Center: Search Button */}
        <div className="nav-center">
          <button
            onClick={onSearchClick}
            className="center-search-btn"
            aria-label={t('nav.search')}
          >
            <div className={`search-circle ${showSearch ? 'active' : ''}`}>
              <svg 
                className="search-icon" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
          </button>
        </div>

        {/* Left Side: Calculator + Workspace */}
        <div className="nav-section left">
          {leftItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                aria-label={item.name}
              >
                <span className="icon">{item.icon}</span>
                {isActive && <span className="active-indicator"></span>}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileBottomNav;
