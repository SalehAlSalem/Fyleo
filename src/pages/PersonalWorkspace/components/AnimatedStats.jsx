import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useSpring, useTransform } from 'framer-motion';
import './AnimatedStats.css';

/**
 * Animated Statistics Bar - Ultra Premium Edition ✨
 * مستوحى من Landing Page & GPA Calculator
 * ⚡ Features:
 * - Counter animations with spring physics
 * - 3D hover effects with tilt
 * - Gradient glow effects
 * - Particle animations
 * - Glass morphism cards
 * - Floating sparkles on hover
 */
const AnimatedStats = ({ stats }) => {
  const { t } = useTranslation();

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  console.log('📊 AnimatedStats rendering with:', stats);

  const statsConfig = [
    {
      key: 'myFiles',
      label: t('workspace.myFiles'),
      icon: '📁',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      shadow: '0 10px 40px -10px rgba(59, 130, 246, 0.6)'
    },
    {
      key: 'myLinks',
      label: t('workspace.myLinks'),
      icon: '🔗',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      shadow: '0 10px 40px -10px rgba(139, 92, 246, 0.6)'
    },
    {
      key: 'downloads',
      label: t('workspace.downloads'),
      icon: '📥',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      shadow: '0 10px 40px -10px rgba(16, 185, 129, 0.6)'
    },
    {
      key: 'bookmarks',
      label: t('workspace.bookmarks'),
      icon: '⭐',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      shadow: '0 10px 40px -10px rgba(245, 158, 11, 0.6)'
    },
    {
      key: 'storageUsed',
      label: t('workspace.storageUsed'),
      icon: '💾',
      color: '#f97316',
      gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      shadow: '0 10px 40px -10px rgba(249, 115, 22, 0.6)',
      isStorage: true
    }
  ];

  return (
    <div className="stats-container">
      {statsConfig.map((stat, index) => (
        <StatCard 
          key={stat.key}
          stat={stat}
          value={stats[stat.key] || 0}
          index={index}
          formatFileSize={formatFileSize}
        />
      ))}
    </div>
  );
};

/**
 * Individual Stat Card Component - Premium 3D Effect
 */
const StatCard = ({ stat, value, index, formatFileSize }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [displayNumber, setDisplayNumber] = useState(0);
  
  // Spring animation for number
  const springValue = useSpring(0, { 
    stiffness: 100, 
    damping: 30,
    restDelta: 0.001
  });
  
  // Update spring and display value when value changes
  useEffect(() => {
    springValue.set(value);
    
    // Subscribe to spring changes to update display
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayNumber(Math.round(latest));
    });
    
    return unsubscribe;
  }, [value, springValue]);

  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        scale: 1.05,
        y: -8,
      }}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
        boxShadow: isHovered ? stat.shadow : '0 4px 15px rgba(0,0,0,0.1)',
      }}
    >
      {/* Ambient Glow Background */}
      <motion.div
        className="stat-glow"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${stat.color}30, transparent 70%)`,
        }}
        animate={isHovered ? {
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        } : { opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Animated Pattern */}
      <motion.div
        className="stat-pattern"
        style={{
          backgroundImage: `radial-gradient(circle at 10px 10px, ${stat.color}15 1px, transparent 0)`,
          backgroundSize: '20px 20px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '20px 20px'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Icon with 3D Effect */}
      <motion.div 
        className="stat-icon"
        style={{
          background: stat.gradient,
        }}
        animate={isHovered ? {
          rotate: [0, -10, 10, -5, 0],
          scale: [1, 1.2, 1],
        } : {}}
        transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0, repeatDelay: 1.5 }}
      >
        <span className="icon-emoji">{stat.icon}</span>
        
        {/* Icon Glow */}
        <motion.div
          className="icon-glow"
          style={{
            background: `radial-gradient(circle, ${stat.color}80, transparent 70%)`,
          }}
          animate={isHovered ? {
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.8, 0.4],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
      
      {/* Value with Counter Animation */}
      <div className="stat-value">
        <span
          className="stat-number"
          style={{
            color: stat.color,
          }}
        >
          {stat.isStorage ? formatFileSize(value) : displayNumber}
        </span>
        
        {/* Floating +1 on Hover */}
        {isHovered && !stat.isStorage && value > 0 && (
          <motion.span
            className="stat-plus"
            initial={{ opacity: 0, y: 0, x: 10 }}
            animate={{ opacity: [0, 1, 0], y: -20 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ color: stat.color }}
          >
            +
          </motion.span>
        )}
      </div>
      
      {/* Label */}
      <div className="stat-label">{stat.label}</div>
      
      {/* Floating Sparkles on Hover */}
      {isHovered && (
        <>
          <motion.div
            className="stat-sparkle"
            style={{ 
              top: '10%', 
              left: '20%',
              color: stat.color 
            }}
            animate={{
              y: [-5, -15, -5],
              opacity: [0, 1, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨
          </motion.div>
          <motion.div
            className="stat-sparkle"
            style={{ 
              bottom: '15%', 
              right: '15%',
              color: stat.color 
            }}
            animate={{
              y: [5, 15, 5],
              opacity: [0, 1, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            ⭐
          </motion.div>
        </>
      )}
      
      {/* Corner Accent */}
      <div 
        className="stat-corner"
        style={{
          background: `radial-gradient(circle, ${stat.color}40, transparent 70%)`,
        }}
      />
    </motion.div>
  );
};

export default AnimatedStats;
