/**
 * CategoryCard Component - Optimized & Smooth ✨
 * تصميم محسّن للأداء
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Category } from '../../../types/database';

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
  onHover?: () => void;
  className?: string;
  nameKey: 'nameAr' | 'nameEn';
  descriptionKey: 'descriptionAr' | 'descriptionEn';
  subjectsLabel: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onClick,
  onHover,
  className = '',
  nameKey,
  descriptionKey,
  subjectsLabel,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const { t } = useTranslation();
  
  // Extract color from category
  const categoryColor = category.icon ? '#8b5cf6' : '#3b82f6';

  return (
    <motion.div
      className={`group relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => {
        setIsHovered(true);
        if (onHover) onHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Modern Card - Homepage Style */}
      <motion.div
        className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 cursor-pointer overflow-hidden"
        whileHover={{ scale: 1.01, y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {/* Subtle Glow on Hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${categoryColor}10, transparent 70%)`,
          }}
        />

        {/* Icon with Advanced 3D Effect & Particles */}
        <div className="text-center mb-6 relative">

          
          <div className="relative inline-block">
            {/* Glow Effect */}
            <div
              className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300"
              style={{
                boxShadow: `0 0 30px ${categoryColor}60`,
              }}
            />
            
            {/* Icon Container with Glass Effect */}
            <motion.div 
              className="relative w-24 h-24 md:w-28 md:h-28 rounded-3xl flex items-center justify-center text-5xl md:text-6xl shadow-lg border backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, ${categoryColor}20, ${categoryColor}40)`,
                borderColor: `${categoryColor}60`,
              }}
              whileHover={{ 
                scale: 1.05,
              }}
              transition={{ duration: 0.2 }}
            >
              {/* Inner Glow */}
              <div 
                className="absolute inset-2 rounded-2xl blur-sm opacity-50"
                style={{
                  background: `radial-gradient(circle, ${categoryColor}40, transparent 70%)`
                }}
              />
              <span className="relative z-10 drop-shadow-lg">{category.icon || '📚'}</span>
            </motion.div>
            
            {/* Orbiting Sparkles */}
            {isHovered && (
              <>
                <motion.div
                  className="absolute text-2xl"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  style={{
                    top: '50%',
                    left: '50%',
                    marginTop: -50,
                    marginLeft: -50,
                  }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="absolute text-xl"
                  animate={{
                    rotate: -360,
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  style={{
                    top: '50%',
                    left: '50%',
                    marginTop: 30,
                    marginLeft: 40,
                  }}
                >
                  ⭐
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Title with Gradient Animation & Text Effects */}
        <motion.h3 
          className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-3 text-center leading-tight relative"
          style={{
            transform: 'translateZ(30px)',
          }}
          whileHover={{
            scale: 1.05,
          }}
        >
          {/* Animated Gradient on Hover */}
          <motion.span
            className="relative inline-block"
            animate={isHovered ? {
              backgroundImage: [
                `linear-gradient(to right, ${categoryColor}, ${categoryColor}cc)`,
                `linear-gradient(to right, ${categoryColor}cc, ${categoryColor}, ${categoryColor}cc)`,
                `linear-gradient(to right, ${categoryColor}, ${categoryColor}cc)`,
              ],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              WebkitBackgroundClip: isHovered ? 'text' : 'unset',
              WebkitTextFillColor: isHovered ? 'transparent' : 'inherit',
              backgroundClip: isHovered ? 'text' : 'unset',
            }}
          >
            {category[nameKey]}
          </motion.span>
          
          {/* Decorative Underline */}
          <motion.div 
            className="absolute -bottom-1 left-1/2 h-1 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${categoryColor}, transparent)`,
            }}
            initial={{ width: 0, x: '-50%' }}
            animate={isHovered ? { width: '100%' } : { width: 0 }}
            transition={{ duration: 0.4 }}
          />
        </motion.h3>

        {/* Description with Fade Effect */}
        <motion.p 
          className="text-base md:text-lg text-gray-600 dark:text-gray-400 text-center mb-6 line-clamp-2 min-h-[3rem]"
          style={{
            transform: 'translateZ(20px)',
          }}
        >
          {category[descriptionKey] || ''}
        </motion.p>

        {/* Premium Stats Card with Glass & Glow */}
        <div className="mb-6" style={{ transform: 'translateZ(40px)' }}>
          <motion.div 
            className="relative rounded-2xl p-5 text-center border-2 shadow-xl overflow-hidden backdrop-blur-sm"
            style={{
              background: `linear-gradient(135deg, ${categoryColor}15, ${categoryColor}25)`,
              borderColor: `${categoryColor}40`,
            }}
            whileHover={{ 
              scale: 1.05,
              borderColor: `${categoryColor}70`,
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated Background Pattern */}
            <motion.div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 20px 20px, ${categoryColor}40 2px, transparent 0)`,
                backgroundSize: '40px 40px',
              }}
              animate={{
                backgroundPosition: ['0px 0px', '40px 40px'],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Icon with Bounce */}
            <motion.div 
              className="text-4xl mb-3"
              animate={isHovered ? {
                y: [0, -10, 0],
                rotate: [0, 10, -10, 0],
              } : {}}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            >
              📚
            </motion.div>
            
            {/* Counter with Number Animation */}
            <motion.div 
              className="text-4xl md:text-5xl font-black mb-2 relative"
              style={{ color: categoryColor }}
              whileHover={{
                scale: 1.1,
                textShadow: `0 0 20px ${categoryColor}80`,
              }}
            >
              {category.subjectsCount || 0}
              
              {/* Floating +1 Animation on Hover */}
              {isHovered && (
                <motion.span
                  className="absolute -top-4 -right-4 text-xl font-bold"
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 0], y: -20, scale: 1 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ color: categoryColor }}
                >
                  +
                </motion.span>
              )}
            </motion.div>
            
            {/* Label */}
            <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-bold">
              {subjectsLabel}
            </div>
          </motion.div>
        </div>

        {/* Premium Action Button with Multiple Layers */}
        <motion.button
          className="relative w-full px-6 py-4 rounded-2xl text-white font-black text-base md:text-lg shadow-2xl flex items-center justify-center gap-3 overflow-hidden group/btn"
          style={{
            background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}dd)`,
            transform: 'translateZ(60px)',
          }}
          whileHover={{ 
            scale: 1.05, 
            y: -3,
            boxShadow: `0 20px 40px -10px ${categoryColor}60`,
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          {/* Animated Shine Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'linear',
            }}
          />
          
          {/* Ripple Effect Background */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `radial-gradient(circle, ${categoryColor}ff 0%, transparent 70%)`,
              opacity: 0,
            }}
            whileHover={{
              opacity: [0, 0.3, 0],
              scale: [0.8, 1.5],
            }}
            transition={{ duration: 0.8 }}
          />
          
          {/* Button Content */}
          <span className="relative z-10 flex items-center gap-3">
            <motion.span
              className="text-2xl"
              animate={isHovered ? {
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.2, 1],
              } : {}}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              🚀
            </motion.span>
            <span className="flex items-center gap-2">
              {isHovered ? '✨ ' : ''}{t('materials.exploreNow', 'استكشف الآن')}
              <motion.span
                animate={isHovered ? { x: [0, 5, 0] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </span>
          
          {/* Glow on Hover */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover/btn:opacity-100 pointer-events-none"
            style={{
              boxShadow: `inset 0 0 30px ${categoryColor}80, 0 0 40px ${categoryColor}60`,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </motion.div>
      
      {/* Corner Accent Decorations */}
      <motion.div
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${categoryColor}, transparent)`,
        }}
        animate={isHovered ? {
          scale: [1, 1.5, 1],
          opacity: [0, 1, 0],
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      <motion.div
        className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${categoryColor}aa, transparent)`,
        }}
        animate={isHovered ? {
          scale: [1, 1.5, 1],
          opacity: [0, 0.8, 0],
        } : {}}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
    </motion.div>
  );
};

export default CategoryCard;
