import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ModernCard, ModernButton } from '@shared/ui/modern/ModernComponents';

const About = () => {
  const { t } = useTranslation();

  const features = [
    { icon: '📚', title: t('about.feature1'), desc: t('about.feature1Desc') },
    { icon: '🔍', title: t('about.feature2'), desc: t('about.feature2Desc') },
    { icon: '⚡', title: t('about.feature3'), desc: t('about.feature3Desc') },
    { icon: '🌐', title: t('about.feature4'), desc: t('about.feature4Desc') },
  ];

  const stats = [
    { icon: '👥', value: '1000+', label: t('about.users') },
    { icon: '📄', value: '5000+', label: t('about.files') },
    { icon: '📥', value: '10000+', label: t('about.downloads') },
    { icon: '⭐', value: '4.8', label: t('about.rating') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-gradient-to-br from-orange-500 via-purple-500 to-blue-500 rounded-3xl mb-6">
            <span className="text-6xl">📚</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('about.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <ModernCard key={index} className="p-6 text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </ModernCard>
          ))}
        </div>

        {/* Mission */}
        <ModernCard className="p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            🎯 {t('about.mission')}
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center max-w-3xl mx-auto">
            {t('about.missionText')}
          </p>
        </ModernCard>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            ✨ {t('about.features')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <ModernCard key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
        </div>

        {/* Team */}
        <ModernCard className="p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            👥 {t('about.team')}
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center max-w-3xl mx-auto mb-8">
            {t('about.teamText')}
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/materials">
              <ModernButton>
                📚 {t('about.exploreMaterials')}
              </ModernButton>
            </Link>
            <Link to="/signup">
              <ModernButton variant="outline">
                🚀 {t('about.joinUs')}
              </ModernButton>
            </Link>
          </div>
        </ModernCard>

        {/* Contact */}
        <ModernCard className="p-8 text-center bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            📧 {t('about.contactUs')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t('about.contactText')}
          </p>
          <a href="mailto:info@fyleo.com" className="text-blue-600 hover:underline font-semibold text-lg">
            info@fyleo.com
          </a>
        </ModernCard>

      </div>
    </div>
  );
};

export default About;

