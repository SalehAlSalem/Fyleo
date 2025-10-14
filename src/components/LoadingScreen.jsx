import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * 🎨 Modern Loading Screen with Dark Theme
 * Matches the application's visual identity with smooth animations
 */
const LoadingScreen = () => {
  const { t } = useTranslation();
  const [loadingStage, setLoadingStage] = useState(0);
  const [progress, setProgress] = useState(0);

  const stages = [
    { key: 'loading.initializing', icon: '🚀' },
    { key: 'loading.connectingDatabase', icon: '🔗' },
    { key: 'loading.loadingResources', icon: '📦' },
    { key: 'loading.almostReady', icon: '✨' }
  ];

  useEffect(() => {
    // Simulate loading stages
    const stageInterval = setInterval(() => {
      setLoadingStage(prev => {
        if (prev < stages.length - 1) return prev + 1;
        return prev;
      });
    }, 800);

    // Smooth progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 95) return prev + 1;
        return prev;
      });
    }, 30);

    return () => {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center p-8 max-w-md">
        {/* Fyleo Logo with Pulse Animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 opacity-50 blur-xl animate-pulse"></div>
            
            {/* Logo Container */}
            <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <div className="text-6xl font-black text-white animate-pulse-slow">
                F
              </div>
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
          Fyleo
        </h1>
        <p className="text-purple-200 text-lg mb-8 font-medium">
          {t('landing.heroSubtitle') || 'جامعة البلقاء التطبيقية'}
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
            </div>
          </div>
          <p className="text-purple-300 text-sm mt-2 font-semibold">
            {progress}%
          </p>
        </div>

        {/* Loading Stage Indicator */}
        <div className="space-y-2">
          {stages.map((stage, index) => (
            <div
              key={stage.key}
              className={`flex items-center justify-center gap-3 transition-all duration-500 ${
                index === loadingStage
                  ? 'opacity-100 scale-100'
                  : index < loadingStage
                  ? 'opacity-50 scale-95'
                  : 'opacity-30 scale-90'
              }`}
            >
              <span className="text-2xl">{stage.icon}</span>
              <span className={`text-sm font-medium ${
                index === loadingStage
                  ? 'text-white'
                  : 'text-gray-400'
              }`}>
                {t(stage.key) || stage.key}
              </span>
              {index === loadingStage && (
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-200"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce animation-delay-400"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Subtle Footer */}
        <div className="mt-12 text-xs text-gray-500">
          <p>{t('footer.madeWithLove') || 'صُنع بحب بواسطة'} Saleh Al-Salem</p>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;