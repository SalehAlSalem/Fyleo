import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, Bell, ChevronDown } from 'lucide-react';
import AnimatedLogo from '../AnimatedLogo';
import DarkMode from '../DarkMode';
import { useAuth } from '../../hooks/useAuth.jsx';
import './ModernNavBar.css';

const ModernNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'الرئيسية', path: '/' },
    { name: 'المواد', path: '/materials' },
    { name: 'الدورات', path: '/courses' },
    { name: 'المجتمع', path: '/community' },
    { name: 'حول', path: '/about' },
  ];

  return (
    <nav className={`modern-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/" className="logo-link">
            <AnimatedLogo />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-menu desktop-only">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Search Bar */}
        <div className="navbar-search desktop-only">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="ابحث عن مادة..."
              className="search-input"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {/* Dark Mode Toggle */}
          <div className="action-item">
            <DarkMode />
          </div>

          {/* Notifications (for authenticated users) */}
          {user && (
            <div className="action-item">
              <button className="notification-btn">
                <Bell size={20} />
                <span className="notification-badge">3</span>
              </button>
            </div>
          )}

          {/* User Menu or Auth Buttons */}
          {loading ? (
            <div className="loading-spinner"></div>
          ) : user ? (
            <div className="user-menu">
              <button className="user-menu-trigger">
                <div className="user-avatar">
                  <User size={18} />
                </div>
                <span className="user-name">{user.name}</span>
                <ChevronDown size={16} />
              </button>
              
              <div className="user-dropdown">
                <Link to="/dashboard" className="dropdown-item">
                  <User size={16} />
                  لوحة التحكم
                </Link>
                <Link to="/profile" className="dropdown-item">
                  الملف الشخصي
                </Link>
                <Link to="/settings" className="dropdown-item">
                  الإعدادات
                </Link>
                <div className="dropdown-divider"></div>
                <button onClick={logout} className="dropdown-item logout">
                  تسجيل الخروج
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-ghost">
                تسجيل الدخول
              </Link>
              <Link to="/signup" className="btn-primary">
                إنشاء حساب
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle mobile-only"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {/* Mobile Search */}
          <div className="mobile-search">
            <div className="search-container">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="ابحث عن مادة..."
                className="search-input"
              />
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="mobile-nav-links">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Auth Section */}
          {!user && (
            <div className="mobile-auth">
              <Link
                to="/login"
                className="mobile-auth-btn secondary"
                onClick={() => setIsMenuOpen(false)}
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/signup"
                className="mobile-auth-btn primary"
                onClick={() => setIsMenuOpen(false)}
              >
                إنشاء حساب
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default ModernNavBar;