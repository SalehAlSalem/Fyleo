/**
 * MaterialCard - Ultra Creative Hybrid ✨🔥
 * NEXT-LEVEL design that breaks boundaries
 * 
 * 🎯 Professional + 💎 Glassmorphic + 🌈 Dynamic
 * ✨ Particle effects • 🌊 Liquid morphing • 🎭 Holographic
 * 🧲 Magnetic hover • 🌀 Ripple interactions • 🎨 Color shifting
 * 🔮 3D parallax • ⚡ Lightning fast • 🎪 Show-stopping animations
 */

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import type { Material } from '../../../../types/database';
// @ts-ignore
import { useAuth } from '../../../../hooks/useAuth';

interface MaterialCardHybridProps {
  material: Material;
  onPreview?: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

const getFileIcon = (mimeType?: string): string => {
  if (!mimeType) return '📄';
  const type = mimeType.toLowerCase();
  if (type.includes('pdf')) return '📄';
  if (type.includes('word')) return '📝';
  if (type.includes('powerpoint')) return '📊';
  if (type.includes('excel')) return '📈';
  if (type.includes('image')) return '🖼️';
  if (type.includes('video')) return '🎥';
  if (type.includes('audio')) return '🎵';
  return '📄';
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Smart gradient based on file type
const getThemeColors = (mimeType?: string) => {
  if (!mimeType) return {
    gradient: 'from-purple-500/20 via-pink-500/20 to-rose-500/20',
    glow: 'rgba(168, 85, 247, 0.3)',
    accent: 'bg-purple-500',
  };
  
  const type = mimeType.toLowerCase();
  if (type.includes('pdf')) return {
    gradient: 'from-red-500/20 via-orange-500/20 to-amber-500/20',
    glow: 'rgba(239, 68, 68, 0.3)',
    accent: 'bg-red-500',
  };
  if (type.includes('word')) return {
    gradient: 'from-blue-500/20 via-indigo-500/20 to-violet-500/20',
    glow: 'rgba(59, 130, 246, 0.3)',
    accent: 'bg-blue-500',
  };
  if (type.includes('powerpoint')) return {
    gradient: 'from-orange-500/20 via-amber-500/20 to-yellow-500/20',
    glow: 'rgba(249, 115, 22, 0.3)',
    accent: 'bg-orange-500',
  };
  if (type.includes('excel')) return {
    gradient: 'from-emerald-500/20 via-green-500/20 to-teal-500/20',
    glow: 'rgba(16, 185, 129, 0.3)',
    accent: 'bg-emerald-500',
  };
  if (type.includes('image')) return {
    gradient: 'from-pink-500/20 via-fuchsia-500/20 to-purple-500/20',
    glow: 'rgba(236, 72, 153, 0.3)',
    accent: 'bg-pink-500',
  };
  if (type.includes('video')) return {
    gradient: 'from-cyan-500/20 via-sky-500/20 to-blue-500/20',
    glow: 'rgba(6, 182, 212, 0.3)',
    accent: 'bg-cyan-500',
  };
  
  return {
    gradient: 'from-purple-500/20 via-pink-500/20 to-rose-500/20',
    glow: 'rgba(168, 85, 247, 0.3)',
    accent: 'bg-purple-500',
  };
};

export const MaterialCardHybrid: React.FC<MaterialCardHybridProps> = ({
  material,
  onPreview,
  onBookmark,
  isBookmarked = false,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);
  const [particles, setParticles] = React.useState<Array<{ x: number; y: number; id: number; delay: number }>>([]);
  
  // Enhanced mouse tracking with spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothMouseX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 150, damping: 20 });
  
  // Advanced 3D transforms with magnetic effect
  const rotateX = useTransform(smoothMouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(smoothMouseX, [-300, 300], [-15, 15]);
  const scale = useTransform([smoothMouseX, smoothMouseY], ([x, y]: any) => {
    const distance = Math.sqrt(x * x + y * y);
    return isHovered ? 1 + Math.min(distance / 1000, 0.05) : 1;
  });

  const icon = (material as any).fileType?.icon || getFileIcon(material.mimeType);
  const fileExtension = material.fileName?.split('.').pop()?.toUpperCase() || 'FILE';
  const fileSize = material.fileSize ? formatFileSize(material.fileSize) : '';
  
  // Theme colors based on file type
  const theme = getThemeColors(material.mimeType);
  const colors = {
    primary: theme.gradient.includes('blue') ? '#3b82f6' : 
             theme.gradient.includes('emerald') ? '#10b981' :
             theme.gradient.includes('pink') ? '#ec4899' :
             theme.gradient.includes('cyan') ? '#06b6d4' : '#a855f7',
    accent: theme.gradient.includes('indigo') ? '#6366f1' :
            theme.gradient.includes('teal') ? '#14b8a6' :
            theme.gradient.includes('fuchsia') ? '#d946ef' :
            theme.gradient.includes('sky') ? '#0ea5e9' : '#ec4899',
  };

  // 🎨 Generate particles on hover
  React.useEffect(() => {
    if (isHovered) {
      const particleArray = Array.from({ length: 12 }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        id: Date.now() + i,
        delay: Math.random() * 0.5,
      }));
      setParticles(particleArray);
    } else {
      setParticles([]);
    }
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  // 🌊 Create ripple effect on click
  const createRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newRipple = { x, y, id: Date.now() };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      style={{
        perspective: '1500px',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onClick={createRipple}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
      className="group relative h-full cursor-pointer"
    >
      {/* Main Card with Enhanced 3D */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative h-full rounded-3xl overflow-hidden"
      >
        {/* Multi-layer Glass Base */}
        <div
          className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30"
          style={{
            boxShadow: isHovered 
              ? `
                0 30px 80px -15px ${theme.glow},
                0 0 0 1px rgba(255,255,255,0.2),
                inset 0 1px 0 rgba(255,255,255,0.3)
              `
              : `0 15px 40px -10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)`,
            transition: 'box-shadow 0.4s ease',
          }}
        />

        {/* Holographic Foil Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `
              linear-gradient(115deg,
                transparent 0%,
                rgba(255,255,255,0.4) 40%,
                transparent 50%,
                rgba(255,255,255,0.4) 60%,
                transparent 100%)
            `,
            backgroundSize: '200% 200%',
          }}
          animate={isHovered ? {
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        {/* Animated Multi-color Mesh Gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`}
          animate={isHovered ? {
            opacity: [0.2, 0.4, 0.6, 0.4, 0.2],
            scale: [1, 1.1, 1.05, 1.1, 1],
            rotate: [0, 2, -2, 2, 0],
          } : { opacity: 0.2, scale: 1, rotate: 0 }}
          transition={{ duration: 4, repeat: isHovered ? Infinity : 0, ease: 'easeInOut' }}
        />

        {/* Advanced Mesh Gradient with 6 points */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(at 10% 10%, rgba(99, 102, 241, 0.3) 0px, transparent 50%),
              radial-gradient(at 90% 10%, rgba(168, 85, 247, 0.3) 0px, transparent 50%),
              radial-gradient(at 50% 50%, rgba(236, 72, 153, 0.2) 0px, transparent 50%),
              radial-gradient(at 90% 90%, rgba(59, 130, 246, 0.3) 0px, transparent 50%),
              radial-gradient(at 10% 90%, rgba(34, 197, 94, 0.2) 0px, transparent 50%),
              radial-gradient(at 50% 10%, rgba(251, 191, 36, 0.2) 0px, transparent 50%)
            `,
          }}
        />

        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute w-1 h-1 rounded-full ${theme.accent}`}
            initial={{ 
              x: `${particle.x}%`, 
              y: `${particle.y}%`,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              y: [particle.y + '%', (particle.y - 30) + '%'],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Ripple Effects */}
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full border-2"
            style={{
              left: `${ripple.x}%`,
              top: `${ripple.y}%`,
              borderColor: theme.glow,
            }}
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ 
              width: 300, 
              height: 300, 
              opacity: 0,
              x: -150,
              y: -150,
            }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 p-6 h-full flex flex-col">
          
          {/* Header Row */}
          <div className="flex items-start justify-between mb-4">
            
            {/* Floating Icon Orb with Advanced Liquid Animation */}
            <motion.div
              animate={isHovered ? {
                y: [-3, 3, -3],
                rotate: [0, 8, -8, 0],
                scale: [1, 1.15, 1.05, 1.15, 1],
              } : { y: 0, rotate: 0, scale: 1 }}
              transition={{ 
                duration: 3,
                repeat: isHovered ? Infinity : 0,
                ease: 'easeInOut'
              }}
              className="relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Pulsing Glow Rings */}
              <motion.div
                className={`absolute inset-0 rounded-3xl ${theme.accent}`}
                animate={isHovered ? { 
                  scale: [1, 1.4, 1.8],
                  opacity: [0.6, 0.3, 0],
                } : { scale: 1, opacity: 0 }}
                transition={{ 
                  duration: 1.5,
                  repeat: isHovered ? Infinity : 0,
                  ease: 'easeOut'
                }}
                style={{ filter: 'blur(20px)' }}
              />
              
              {/* Icon container with morphing border */}
              <motion.div
                className="w-20 h-20 rounded-3xl backdrop-blur-xl flex items-center justify-center text-4xl border-2 shadow-2xl relative overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateZ(40px)',
                }}
                animate={isHovered ? {
                  borderRadius: ['24px', '30px', '20px', '28px', '24px'],
                } : {}}
                transition={{ duration: 3, repeat: isHovered ? Infinity : 0 }}
              >
                {/* Animated rainbow shimmer */}
                <motion.div
                  className="absolute inset-0"
                  animate={isHovered ? { 
                    x: ['-200%', '200%'],
                    rotate: [0, 360],
                  } : { x: '-200%' }}
                  transition={{ 
                    duration: 2,
                    repeat: isHovered ? Infinity : 0,
                    ease: 'linear'
                  }}
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                    width: '50%',
                  }}
                />
                
                {/* Inner glow pulse */}
                <motion.div
                  className={`absolute inset-2 rounded-2xl ${theme.accent}`}
                  animate={isHovered ? {
                    opacity: [0, 0.2, 0],
                    scale: [0.8, 1.1, 0.8],
                  } : { opacity: 0 }}
                  transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
                  style={{ filter: 'blur(10px)' }}
                />
                
                <motion.span 
                  className="relative z-10"
                  animate={isHovered ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  } : {}}
                  transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
                >
                  {icon}
                </motion.span>
              </motion.div>
              
              {/* Orbiting particles around icon */}
              {isHovered && [0, 120, 240].map((angle, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full ${theme.accent}`}
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                  animate={{
                    x: [
                      Math.cos(angle * Math.PI / 180) * 40,
                      Math.cos((angle + 360) * Math.PI / 180) * 40,
                    ],
                    y: [
                      Math.sin(angle * Math.PI / 180) * 40,
                      Math.sin((angle + 360) * Math.PI / 180) * 40,
                    ],
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'linear',
                  }}
                />
              ))}
            </motion.div>

            {/* Bookmark Star - Morphing Magic */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onBookmark?.();
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.85, rotate: 180 }}
              className="relative w-12 h-12 rounded-2xl backdrop-blur-xl flex items-center justify-center border-2 transition-all duration-300 overflow-hidden"
              style={{
                background: isBookmarked 
                  ? 'rgba(251, 191, 36, 0.4)' 
                  : 'rgba(255, 255, 255, 0.15)',
                borderColor: isBookmarked 
                  ? 'rgba(251, 191, 36, 0.6)' 
                  : 'rgba(255, 255, 255, 0.3)',
                transform: 'translateZ(40px)',
              }}
            >
              {/* Pulsing background */}
              {isBookmarked && (
                <motion.div
                  className="absolute inset-0 bg-yellow-400"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              
              {/* Star with liquid animation */}
              <motion.span 
                className="text-2xl relative z-10"
                animate={isBookmarked ? { 
                  rotate: [0, 360],
                  scale: [1, 1.3, 1],
                } : {}}
                transition={{ duration: 0.6 }}
              >
                {isBookmarked ? '⭐' : '☆'}
              </motion.span>
              
              {/* Sparkle effect when bookmarked */}
              {isBookmarked && [0, 90, 180, 270].map((angle, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                  animate={{
                    x: Math.cos(angle * Math.PI / 180) * 20,
                    y: Math.sin(angle * Math.PI / 180) * 20,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.button>
          </div>

          {/* Floating Badges - Morphing Magic */}
          <div className="flex items-center gap-2 mb-4">
            {/* File type badge with flowing gradient */}
            <motion.span
              whileHover={{ scale: 1.08, y: -3 }}
              className="relative px-4 py-1.5 text-xs font-bold tracking-wider text-white shadow-lg backdrop-blur-md overflow-hidden"
              style={{
                transform: 'translateZ(15px)',
              }}
              animate={{
                borderRadius: ['16px', '20px', '12px', '18px', '16px'],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {/* Animated background gradient */}
              <motion.div
                className={`absolute inset-0 ${theme.accent}`}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{
                  backgroundSize: '200% 100%',
                }}
              />
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'linear-gradient(90deg, transparent, white, transparent)',
                }}
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              
              <span className="relative z-10">{fileExtension}</span>
            </motion.span>
            
            {/* Size badge with pulsing effect */}
            <motion.span
              whileHover={{ scale: 1.08, y: -3 }}
              className="relative px-3 py-1.5 rounded-xl text-xs font-medium backdrop-blur-md border border-white/40 overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                transform: 'translateZ(15px)',
              }}
              animate={{
                borderRadius: ['12px', '16px', '10px', '14px', '12px'],
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            >
              {/* Pulsing glow */}
              <motion.div
                className="absolute inset-0 bg-white"
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <span className="relative z-10 text-white/90">{fileSize}</span>
            </motion.span>
          </div>

          {/* Title with Shimmer Effect */}
          <motion.h3 
            className="relative text-xl font-bold mb-2 overflow-hidden"
            style={{
              color: 'rgba(0, 0, 0, 0.9)',
              transform: 'translateZ(20px)',
            }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Gradient shimmer sweep */}
            <motion.div
              className="absolute inset-0 opacity-40"
              style={{
                background: `linear-gradient(90deg, transparent, ${colors.primary}, ${colors.accent}, transparent)`,
              }}
              animate={{
                x: ['-200%', '200%'],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                repeatDelay: 1,
                ease: 'easeInOut'
              }}
            />
            <span className="relative z-10">
              {material.title || 'Untitled'}
            </span>
          </motion.h3>

          {/* Description with fade-in effect */}
          {material.description && (
            <motion.p 
              className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed"
              style={{ transform: 'translateZ(5px)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {material.description}
            </motion.p>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Action Buttons - Magnetic Hover Effect */}
          <div className="flex gap-3" style={{ transform: 'translateZ(20px)' }}>
            <motion.button
              onClick={onPreview}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.92 }}
              className="relative flex-1 py-3 px-5 rounded-2xl font-bold tracking-wide text-white shadow-2xl overflow-hidden"
            >
              {/* Animated mesh gradient background */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at 30% 50%, ${colors.primary}, ${colors.accent})`,
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              />
              
              {/* Pulsing glow */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle, ${colors.primary}80, transparent 70%)`,
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Shimmer sweep */}
              <motion.div
                className="absolute inset-0 opacity-50"
                style={{
                  background: 'linear-gradient(90deg, transparent, white, transparent)',
                }}
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'linear' }}
              />
              
              <span className="relative z-10">👁️ معاينة</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.92 }}
              className="relative p-3 rounded-2xl font-bold shadow-2xl overflow-hidden backdrop-blur-xl border-2 border-white/40"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              {/* Rotating gradient background */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    `linear-gradient(0deg, ${colors.accent}, transparent)`,
                    `linear-gradient(90deg, ${colors.accent}, transparent)`,
                    `linear-gradient(180deg, ${colors.accent}, transparent)`,
                    `linear-gradient(270deg, ${colors.accent}, transparent)`,
                    `linear-gradient(360deg, ${colors.accent}, transparent)`,
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              <span className="relative z-10 text-xl">⬇️</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
