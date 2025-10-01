import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  ModernButton, 
  ModernCard, 
  useTranslation,
  useTheme 
} from '../../components/modern/ModernComponents';
import ModernFooter from '../../components/modern/ModernFooter';
import { DatabaseService } from '../../config/DatabaseService';
import { StatsService } from '../../services/StatsService.js';

const ModernLandingPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [realStats, setRealStats] = useState({
    users: { number: 'تحميل...', label: 'مستخدم مسجل' },
    files: { number: 'تحميل...', label: 'ملف مرفوع' },
    uptime: { number: '99.9%', label: 'وقت التشغيل' },
    support: { number: '24/7', label: 'دعم فني' }
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        console.log('Loading stats once on page load...');
        setStatsLoading(true);
        const stats = await StatsService.getFormattedStatsWithCache();
        console.log('Stats loaded successfully:', stats);
        setRealStats(stats);
      } catch (error) {
        console.error('Error loading stats:', error);
        // في حالة الفشل، نحاول الحصول على آخر بيانات ناجحة
        const lastData = StatsService.getLastSuccessfulData();
        if (lastData) {
          console.log('Using last successful data:', lastData);
          setRealStats(lastData);
        } else {
          console.log('Using fallback data');
          setRealStats({
            users: { number: '0', label: 'مستخدم مسجل' },
            files: { number: '0', label: 'ملف مرفوع' },
            uptime: { number: '99.9%', label: 'وقت التشغيل' },
            support: { number: '24/7', label: 'دعم فني' }
          });
        }
      } finally {
        setStatsLoading(false);
      }
    };

    // تحميل مرة واحدة فقط عند فتح الموقع
    loadStats();
    
    // بدون تحديث تلقائي - فقط مرة واحدة
  }, []);

  // جلب الإحصائيات الحقيقية مع التحديث التلقائي - معطل مؤقتاً
  /*
  useEffect(() => {
    let isMounted = true;
    let intervalId = null;

    const loadRealStats = async () => {
      if (!isMounted) return;
      
      try {
        setStatsLoading(true);
        const stats = await StatsService.getFormattedStatsWithCache();
        if (isMounted && stats) {
          setRealStats(stats);
          console.log('✅ تم تحديث الإحصائيات:', stats);
        }
      } catch (error) {
        console.error('❌ خطأ في جلب الإحصائيات:', error);
        // استخدام القيم الافتراضية في حالة الخطأ
        if (isMounted) {
          setRealStats({
            users: { number: '1+', label: 'مستخدم مسجل' },
            files: { number: '0', label: 'ملف مرفوع' },
            uptime: { number: '99.8%', label: 'وقت التشغيل' },
            support: { number: '24/7', label: 'دعم فني' }
          });
        }
      } finally {
        if (isMounted) {
          setStatsLoading(false);
        }
      }
    };

    // تحميل الإحصائيات عند التحميل الأول
    loadRealStats();

    // تحديث الإحصائيات كل 3 دقائق (أقل تكراراً لتوفير الموارد)
    intervalId = setInterval(() => {
      if (isMounted) {
        loadRealStats();
      }
    }, 180000); // كل 3 دقائق

    // تنظيف عند إلغاء التركيب
    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);
  */

  const features = [
    {
      icon: '🚀',
      title: t('fastUpload'),
      description: t('fastUploadDesc'),
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: '🔒',
      title: t('secure'),
      description: t('secureDesc'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🌐',
      title: t('accessible'),
      description: t('accessibleDesc'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '📱',
      title: t('responsive'),
      description: t('responsiveDesc'),
      color: 'from-green-500 to-emerald-500'
    }
  ];

  // استخدام الإحصائيات الحقيقية أو الافتراضية
  const stats = realStats ? [
    { number: realStats.users.number, label: realStats.users.label },
    { number: realStats.files.number, label: realStats.files.label },
    { number: realStats.uptime.number, label: realStats.uptime.label },
    { number: realStats.support.number, label: realStats.support.label }
  ] : [
    { number: statsLoading ? '...' : '1+', label: t('users') },
    { number: statsLoading ? '...' : '0', label: t('files') },
    { number: '99.9%', label: t('uptime') },
    { number: '24/7', label: t('support') }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-0 left-1/4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          />
          <div 
            className="absolute top-0 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}
          />
          <div 
            className="absolute -bottom-8 left-1/3 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"
            style={{ transform: `translateY(${scrollY * 0.2}px)` }}
          />
        </div>

        <div className="container-modern relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Hero Badge */}
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-orange-100 to-purple-100 dark:from-orange-900/20 dark:to-purple-900/20 px-4 py-2 rounded-full text-sm font-medium text-orange-800 dark:text-orange-200 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span>{t('newFeature')}</span>
            </div>

            {/* Hero Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">
                {t('heroTitle')}
              </span>
              <br />
              <span className="text-gray-800 dark:text-gray-200">
                {t('heroSubtitle')}
              </span>
            </h1>

            {/* Hero Description */}
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('heroDescription')}
            </p>

            {/* Hero Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              {user ? (
                <Link to="/dashboard">
                  <ModernButton size="lg" className="px-8 py-4">
                    <span className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span>📊</span>
                      <span>{t('goToDashboard')}</span>
                    </span>
                  </ModernButton>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <ModernButton size="lg" className="px-8 py-4">
                      <span className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span>🚀</span>
                        <span>{t('getStarted')}</span>
                      </span>
                    </ModernButton>
                  </Link>
                  <Link to="/materials">
                    <ModernButton variant="ghost" size="lg" className="px-8 py-4">
                      <span className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span>📚</span>
                        <span>{t('exploreMaterials')}</span>
                      </span>
                    </ModernButton>
                  </Link>
                </>
              )}
            </div>

            {/* Hero Image/Demo */}
            <div className="relative max-w-4xl mx-auto">
              <div className="glass p-4 rounded-2xl shadow-2xl">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl">
                      📁
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      {t('previewPlaceholder')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container-modern">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('whyChooseUs')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('featuresDescription')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <ModernCard key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white text-2xl group-hover:rotate-12 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </ModernCard>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - إحصائيات حقيقية */}
      <section className="py-20">
        <div className="container-modern">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('ourNumbers')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('statsDescription')}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* مؤشر التحديث (مخفي) */}
          {statsLoading && (
            <div className="text-center mt-4">
              <div className="text-sm text-gray-500">
                <span className="animate-pulse">🔄 جاري تحديث الإحصائيات...</span>
              </div>
            </div>
          )}

          {/* زر اختبار مؤقت */}
          <div className="text-center mt-8">
            <button 
              onClick={async () => {
                console.log('🧪 اختبار Collections...');
                try {
                  // اختبار المستخدمين
                  console.log('📊 جاري فحص المستخدمين...');
                  const usersCount = await DatabaseService.getTotalUsersCount();
                  console.log('عدد المستخدمين الحالي:', usersCount);
                  
                  // اختبار الملفات
                  console.log('📊 جاري فحص الملفات...');
                  const filesCount = await DatabaseService.getTotalFilesCount();
                  console.log('عدد الملفات الحالي:', filesCount);
                  
                  // محاولة إضافة مستخدم
                  console.log('➕ محاولة إضافة مستخدم جديد...');
                  try {
                    const testUser = await DatabaseService.createUser({
                      name: 'مستخدم تجريبي',
                      email: `test${Date.now()}@example.com`,
                      university: 'جامعة تجريبية',
                      department: 'قسم تجريبي'
                    });
                    console.log('✅ تم إنشاء مستخدم بنجاح:', testUser.$id);
                    
                    // إعادة تحميل الإحصائيات
                    loadStats();
                  } catch (err) {
                    console.error('❌ فشل إنشاء المستخدم:', err);
                  }
                } catch (error) {
                  console.error('❌ خطأ في الاختبار:', error);
                }
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-bold transition-colors shadow-lg"
            >
              🧪 اختبار البيانات في Collections
            </button>
            <p className="text-sm text-gray-500 mt-2">
              افتح Console (F12) لمشاهدة النتائج
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500">
        <div className="container-modern text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            {t('readyToStart')}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('ctaDescription')}
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <ModernButton 
                  variant="secondary" 
                  size="lg" 
                  className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4"
                >
                  <span className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span>✨</span>
                    <span>{t('startFree')}</span>
                  </span>
                </ModernButton>
              </Link>
              <Link to="/login">
                <ModernButton 
                  variant="ghost" 
                  size="lg" 
                  className="text-white border-white hover:bg-white/10 px-8 py-4"
                >
                  {t('alreadyHaveAccount')}
                </ModernButton>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <ModernFooter />
    </div>
  );
};

export default ModernLandingPage;