/**
 * SubjectCard Component - Ultra Creative & Premium ✨
 * تصميم كريتيف متقدم مستوحى من Landing Page & GPA Calculator
 * ⚡ Features:
 * - 3D Tilt effects with mouse tracking
 * - Animated level badges with glow
 * - Glass morphism stats cards
 * - Floating particles and sparkles
 * - Gradient text animations
 * - Spring-based interactions
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { Subject } from '../../../types/database';

interface SubjectCardProps {
  subject: Subject;
  onClick: () => void;
  className?: string;
  nameKey: 'nameAr' | 'nameEn';
  descriptionKey: 'descriptionAr' | 'descriptionEn';
  creditHoursLabel: string;
  levelLabel: string;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  onClick,
  className = '',
  nameKey,
  descriptionKey,
  creditHoursLabel,
  levelLabel,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Color scheme based on level with richer palette
  const getLevelColor = (level?: number) => {
    if (!level) return '#6366f1'; // indigo
    const colors = [
      '#ef4444', // red - Level 1
      '#f97316', // orange - Level 2
      '#eab308', // yellow - Level 3
      '#22c55e', // green - Level 4
      '#06b6d4', // cyan - Level 5
      '#6366f1', // indigo - Level 6
      '#8b5cf6', // purple - Level 7
      '#ec4899', // pink - Level 8
    ];
    return colors[(level - 1) % colors.length];
  };

  const levelColor = getLevelColor(subject.level);
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <motion.div
      className={`group relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Ambient Glow Background */}
      <div
        className="absolute inset-0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 20%, ${levelColor}70, transparent 60%)`,
        }}
      />
      
      {/* Premium Card Container */}
      <motion.div
        className="relative bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-3xl p-6 md:p-8 shadow-xl border border-gray-200 dark:border-gray-700 cursor-pointer overflow-hidden"
        whileHover={{ 
          scale: 1.01,
          y: -2
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Gradient Overlay Effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${levelColor}05, ${levelColor}10, ${levelColor}05)`,
          }}
        />
        


        {/* Premium Level Badge - 3D & Glowing */}
        <div className="flex items-center justify-center mb-6" style={{ transform: 'translateZ(50px)' }}>
          <motion.div 
            className="relative"
            whileHover={{ 
              scale: 1.15, 
              rotate: [0, 360],
            }}
            transition={{ rotate: { duration: 0.8, ease: 'easeInOut' } }}
          >
            {/* Multi-layer Glow Effect */}
            <motion.div
              className="absolute inset-0 rounded-full blur-2xl"
              style={{
                background: `radial-gradient(circle, ${levelColor}80, transparent 70%)`,
              }}
              animate={isHovered ? {
                scale: [1, 1.4, 1],
                opacity: [0.6, 1, 0.6],
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            

            
            {/* Main Badge */}
            <div 
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-2xl border-4 backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, ${levelColor}ee, ${levelColor}dd)`,
                borderColor: 'white',
                boxShadow: `0 10px 40px -10px ${levelColor}80, inset 0 2px 10px rgba(255,255,255,0.3)`,
              }}
            >
              {/* Inner Shine */}
              <div 
                className="absolute inset-2 rounded-full blur-md opacity-40"
                style={{
                  background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent 60%)`
                }}
              />
              
              <span 
                className="text-3xl md:text-4xl font-black text-white relative z-10 drop-shadow-lg"
              >
                {subject.level || '?'}
              </span>
            </div>
            
            {/* Floating Sparkles */}
            {isHovered && (
              <>
                <motion.div
                  className="absolute text-xl"
                  animate={{
                    y: [-30, -40, -30],
                    x: [-10, 10, -10],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ top: -20, left: '50%', marginLeft: -10 }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="absolute text-lg"
                  animate={{
                    y: [30, 40, 30],
                    x: [10, -10, 10],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  style={{ bottom: -20, right: '50%', marginRight: -10 }}
                >
                  ⭐
                </motion.div>
              </>
            )}
          </motion.div>
        </div>

        {/* Title with Advanced Gradient & Underline */}
        <h3
          className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-3 text-center leading-tight line-clamp-2 min-h-[3.5rem]"
        >
          {subject[nameKey]}
        </h3>

        {/* Description with Fade */}
        <motion.p 
          className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center mb-6 line-clamp-3 min-h-[4rem]"
          style={{
            transform: 'translateZ(20px)',
          }}
        >
          {subject[descriptionKey] || ''}
        </motion.p>

        {/* Stats Grid - Premium Glass Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6" style={{ transform: 'translateZ(40px)' }}>
          {/* Credit Hours Card */}
          <motion.div 
            className="relative rounded-2xl p-4 text-center border-2 shadow-xl overflow-hidden backdrop-blur-md"
            style={{
              background: `linear-gradient(135deg, ${levelColor}12, ${levelColor}22)`,
              borderColor: `${levelColor}35`,
            }}
            whileHover={{ 
              scale: 1.08, 
              y: -3,
              borderColor: `${levelColor}60`,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {/* Animated Pattern */}
            <motion.div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 10px 10px, ${levelColor}60 1px, transparent 0)`,
                backgroundSize: '20px 20px',
              }}
              animate={{
                backgroundPosition: ['0px 0px', '20px 20px'],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />
            
            <div 
              className="text-3xl mb-2 relative z-10"
            >
              ⏱️
            </div>
            
            <div 
              className="text-3xl md:text-4xl font-black mb-1 relative z-10"
              style={{ color: levelColor }}
            >
              {subject.creditHours || 0}
            </div>
            
            <div className="text-xs md:text-sm text-gray-700 dark:text-gray-300 font-bold relative z-10">
              {creditHoursLabel}
            </div>
            
            {/* Glow Corner */}
            <div 
              className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-30"
              style={{
                background: `radial-gradient(circle, ${levelColor}, transparent 70%)`
              }}
            />
          </motion.div>

          {/* Level Card */}
          <motion.div 
            className="relative rounded-2xl p-4 text-center border-2 shadow-xl overflow-hidden backdrop-blur-md"
            style={{
              background: `linear-gradient(135deg, ${levelColor}20, ${levelColor}35)`,
              borderColor: `${levelColor}50`,
            }}
            whileHover={{ 
              scale: 1.08, 
              y: -3,
              borderColor: `${levelColor}80`,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundImage: [
                  `linear-gradient(90deg, transparent, ${levelColor}30, transparent)`,
                ],
                backgroundPosition: ['-100% 0', '200% 0'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <motion.div 
              className="text-3xl mb-2 relative z-10"
              animate={isHovered ? {
                rotate: [0, 10, -10, 0],
              } : {}}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2.5 }}
            >
              🎯
            </motion.div>
            
            <motion.div 
              className="text-3xl md:text-4xl font-black mb-1 relative z-10"
              style={{ color: levelColor }}
              whileHover={{
                scale: 1.15,
                textShadow: `0 0 25px ${levelColor}90`,
              }}
            >
              {subject.level || '?'}
            </motion.div>
            
            <div className="text-xs md:text-sm text-gray-700 dark:text-gray-300 font-bold relative z-10">
              {levelLabel}
            </div>
            
            {/* Glow Corner */}
            <div 
              className="absolute bottom-0 left-0 w-16 h-16 rounded-full blur-2xl opacity-40"
              style={{
                background: `radial-gradient(circle, ${levelColor}, transparent 70%)`
              }}
            />
          </motion.div>
        </div>

        {/* Premium Action Button with Advanced Effects */}
        <motion.button
          className="relative w-full px-6 py-4 rounded-2xl text-white font-black text-base md:text-lg shadow-2xl flex items-center justify-center gap-3 overflow-hidden group/btn"
          style={{
            background: `linear-gradient(135deg, ${levelColor}ee, ${levelColor}dd)`,
            transform: 'translateZ(50px)',
          }}
          whileHover={{ 
            scale: 1.05, 
            y: -4,
            boxShadow: `0 25px 50px -12px ${levelColor}70`,
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          {/* Multi-layer Shine Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut',
            }}
          />
          
          {/* Pulsing Background */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `radial-gradient(circle, ${levelColor}ff 0%, transparent 70%)`,
              opacity: 0,
            }}
            whileHover={{
              opacity: [0, 0.4, 0],
              scale: [0.8, 1.6],
            }}
            transition={{ duration: 1 }}
          />
          
          {/* Button Content */}
          <span className="relative z-10 flex items-center gap-3">
            <motion.span
              className="text-2xl"
              animate={isHovered ? {
                rotate: [0, 15, -15, 0],
                scale: [1, 1.3, 1],
              } : {}}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            >
              📖
            </motion.span>
            <span className="flex items-center gap-2">
              {isHovered && <span className="animate-pulse">✨</span>}
              {nameKey === 'nameAr' ? 'عرض المحتوى' : 'View Content'}
              <motion.span
                animate={isHovered ? { x: [0, 4, 0] } : {}}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </span>
          
          {/* Inner Glow on Hover */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover/btn:opacity-100 pointer-events-none"
            style={{
              boxShadow: `inset 0 0 40px ${levelColor}90, 0 0 50px ${levelColor}70`,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </motion.div>
      
      {/* Corner Sparkles */}
      <motion.div
        className="absolute -top-3 -right-3 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${levelColor}dd, transparent 70%)`,
        }}
        animate={isHovered ? {
          scale: [1, 1.6, 1],
          opacity: [0, 0.8, 0],
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      <motion.div
        className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${levelColor}bb, transparent 70%)`,
        }}
        animate={isHovered ? {
          scale: [1, 1.4, 1],
          opacity: [0, 0.7, 0],
        } : {}}
        transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
      />
    </motion.div>
  );
};

export default SubjectCard;
