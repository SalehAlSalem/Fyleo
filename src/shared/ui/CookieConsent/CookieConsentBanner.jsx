import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CookieConsentBanner.css';

const CookieConsentBanner = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted
    const hasAccepted = localStorage.getItem('cookieConsentAccepted');
    
    if (!hasAccepted) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    // Save acceptance to localStorage
    localStorage.setItem('cookieConsentAccepted', 'true');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    // Hide banner with animation
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent-banner">
      <div className="cookie-consent-container">
        <div className="cookie-consent-content">
          {/* Icon */}
          <div className="cookie-icon">
            🍪
          </div>

          {/* Message */}
          <div className="cookie-message">
            <p>
              {t('cookieConsent.message', 'باستمرارك في تصفح هذا الموقع، فإنك توافق على استخدامنا لملفات تعريف الارتباط وعلى')}{' '}
              <Link to="/terms-of-service" className="cookie-link">
                {t('cookieConsent.terms', 'شروط الخدمة')}
              </Link>{' '}
              {t('cookieConsent.and', 'و')}{' '}
              <Link to="/privacy-policy" className="cookie-link">
                {t('cookieConsent.privacy', 'سياسة الخصوصية')}
              </Link>{' '}
              {t('cookieConsent.messageSuffix', 'الخاصة بنا.')}
            </p>
          </div>

          {/* Accept Button */}
          <button 
            onClick={handleAccept}
            className="cookie-accept-btn"
            aria-label={t('cookieConsent.accept', 'موافق')}
          >
            {t('cookieConsent.accept', 'موافق')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
