import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './AnimatedStats.css';

/**
 * Animated Statistics Bar
 * Numbers count up on load for dynamic feel
 */
const AnimatedStats = ({ stats }) => {
  const { t } = useTranslation();
  const [animatedStats, setAnimatedStats] = useState({
    myFiles: 0,
    myLinks: 0,
    downloads: 0,
    bookmarks: 0,
    storageUsed: 0
  });

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  useEffect(() => {
    // Animate numbers counting up
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setAnimatedStats({
        myFiles: Math.floor(stats.myFiles * easeOutQuart),
        myLinks: Math.floor(stats.myLinks * easeOutQuart),
        downloads: Math.floor(stats.downloads * easeOutQuart),
        bookmarks: Math.floor(stats.bookmarks * easeOutQuart),
        storageUsed: Math.floor(stats.storageUsed * easeOutQuart)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedStats(stats);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [stats]);

  const statsConfig = [
    {
      key: 'myFiles',
      label: t('workspace.myFiles'),
      icon: '📁',
      color: 'blue',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    },
    {
      key: 'myLinks',
      label: t('workspace.myLinks'),
      icon: '🔗',
      color: 'purple',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
    },
    {
      key: 'downloads',
      label: t('workspace.downloads'),
      icon: '📥',
      color: 'green',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      key: 'bookmarks',
      label: t('workspace.bookmarks'),
      icon: '⭐',
      color: 'yellow',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    },
    {
      key: 'storageUsed',
      label: t('workspace.storageUsed'),
      icon: '💾',
      color: 'orange',
      gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      isStorage: true
    }
  ];

  return (
    <div className="stats-container">
      {statsConfig.map((stat, index) => (
        <div 
          key={stat.key}
          className={`stat-card stat-${stat.color}`}
          style={{ 
            animationDelay: `${index * 0.1}s`,
            '--stat-gradient': stat.gradient
          }}
        >
          <div className="stat-icon-wrapper">
            <span className="stat-icon">{stat.icon}</span>
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {stat.isStorage 
                ? formatFileSize(animatedStats[stat.key])
                : animatedStats[stat.key].toLocaleString()
              }
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
          <div className="stat-glow"></div>
        </div>
      ))}
    </div>
  );
};

export default AnimatedStats;
