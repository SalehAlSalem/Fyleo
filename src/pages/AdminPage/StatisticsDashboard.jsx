import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { statisticsService } from '../../services/appwriteService';
import { ModernCard, ModernSkeleton, ModernAlert } from '@shared/ui/modern/ModernComponents';

/**
 * 📊 Statistics Dashboard
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
          <ModernCard key={i} className="p-6">
            <ModernSkeleton lines={3} />
          </ModernCard>
        ))}
      </div>
    );
  }

  if (error) {
    return <ModernAlert type="error">{error}</ModernAlert>;
  }

  const statCards = [
    {
      title: t('admin.panel.statistics.totalUsers'),
      value: stats.totalUsers,
      icon: '👥',
      color: 'bg-blue-500'
    },
    {
      title: t('admin.panel.statistics.totalFiles'),
      value: stats.totalMaterials,
      icon: '📄',
      color: 'bg-green-500'
    },
    {
      title: t('admin.panel.statistics.totalDownloads'),
      value: stats.totalDownloads,
      icon: '📥',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <ModernCard key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className={`w-16 h-16 rounded-full ${stat.color} flex items-center justify-center text-white text-3xl`}>
                {stat.icon}
              </div>
            </div>
          </ModernCard>
        ))}
      </div>

      <ModernCard className="p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          {t('admin.panel.statistics.overview')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">{t('admin.panel.statistics.systemStatus')}</span>
            <span className="text-green-600 font-semibold">✓ {t('admin.panel.statistics.operatingNormally')}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">{t('admin.panel.statistics.lastUpdate')}</span>
            <span className="text-gray-800 dark:text-white">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-600 dark:text-gray-400">{t('admin.panel.statistics.version')}</span>
            <span className="text-gray-800 dark:text-white">3.0.0</span>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};

export default StatisticsDashboard;

