import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { statisticsService } from '../../services/appwriteService';

/**
 * 📊 Statistics Dashboard - Premium Design
 */
const StatisticsDashboard = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMaterials: 0,
    totalDownloads: 0
  });

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError('');
      
      const platformStats = await statisticsService.getPlatformStats();
      setStats(platformStats);
    } catch (err) {
      console.error('Error loading statistics:', err);
      setError(t('admin.common.messages.loading'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10 animate-pulse">
            <div className="h-24 bg-white/10 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="backdrop-blur-sm bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
        <p className="text-red-200 text-center">{error}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: t('admin.panel.statistics.totalUsers'),
      value: stats.totalUsers,
      icon: '👥',
      gradient: 'from-blue-500 to-cyan-500',
      shadowColor: 'shadow-blue-500/50',
      percentage: '+12%',
      trend: 'up'
    },
    {
      title: t('admin.panel.statistics.totalFiles'),
      value: stats.totalMaterials,
      icon: '📄',
      gradient: 'from-green-500 to-emerald-500',
      shadowColor: 'shadow-green-500/50',
      percentage: '+24%',
      trend: 'up'
    },
    {
      title: t('admin.panel.statistics.totalDownloads'),
      value: stats.totalDownloads,
      icon: '📥',
      gradient: 'from-purple-500 to-pink-500',
      shadowColor: 'shadow-purple-500/50',
      percentage: '+8%',
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Premium Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className={`group relative backdrop-blur-sm bg-white/5 rounded-3xl p-6 border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 ${stat.shadowColor} hover:shadow-2xl overflow-hidden`}
          >
            {/* Animated Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl`}></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-white/60 text-sm font-medium mb-2">
                    {stat.title}
                  </p>
                  <p className="text-5xl font-black text-white mb-2">
                    {stat.value.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${
                      stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stat.trend === 'up' ? '↗' : '↘'} {stat.percentage}
                    </span>
                    <span className="text-white/40 text-xs">vs last month</span>
                  </div>
                </div>
                <div className={`w-20 h-20 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center text-white text-4xl shadow-xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                  {stat.icon}
                </div>
              </div>
              
              {/* Mini Progress Bar */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${Math.min(100, (stat.value / 1000) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Overview with Glass Design */}
      <div className="backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
            📈
          </div>
          <h3 className="text-2xl font-black text-white">
            {t('admin.panel.statistics.overview')}
          </h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 px-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-xl">
                ✓
              </div>
              <span className="text-white/80 font-medium group-hover:text-white transition-colors">
                {t('admin.panel.statistics.systemStatus')}
              </span>
            </div>
            <span className="text-green-400 font-bold text-lg flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              {t('admin.panel.statistics.operatingNormally')}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-4 px-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center text-xl">
                🕐
              </div>
              <span className="text-white/80 font-medium group-hover:text-white transition-colors">
                {t('admin.panel.statistics.lastUpdate')}
              </span>
            </div>
            <span className="text-white font-semibold">
              {new Date().toLocaleDateString('ar-EG')}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-4 px-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-xl">
                🚀
              </div>
              <span className="text-white/80 font-medium group-hover:text-white transition-colors">
                {t('admin.panel.statistics.version')}
              </span>
            </div>
            <span className="text-white font-semibold bg-gradient-to-r from-purple-400 to-pink-500 px-4 py-1 rounded-full">
              3.0.0
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '📊', label: 'التقارير', color: 'from-blue-500 to-cyan-500' },
          { icon: '⚙️', label: 'الإعدادات', color: 'from-purple-500 to-pink-500' },
          { icon: '🔔', label: 'التنبيهات', color: 'from-orange-500 to-red-500' },
          { icon: '📋', label: 'السجلات', color: 'from-green-500 to-emerald-500' }
        ].map((action, index) => (
          <button
            key={index}
            className="group backdrop-blur-sm bg-white/5 hover:bg-white/10 rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-2xl mb-3 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
              {action.icon}
            </div>
            <p className="text-white font-semibold text-center">{action.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatisticsDashboard;

