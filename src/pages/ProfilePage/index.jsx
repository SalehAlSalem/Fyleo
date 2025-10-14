import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { DatabaseService } from '../../config/DatabaseService';
import { 
  ModernCard, 
  ModernButton, 
  ModernInput,
  ModernAlert,
  useTranslation 
} from '../../components/modern/ModernComponents';
import ModernProfile from './ModernProfile';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  
  const [userStats, setUserStats] = useState({
    totalFiles: 0,
    totalDownloads: 0,
    totalSize: 0,
    joinedDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // استخدام DatabaseService مباشرة بدون constructor

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // جلب ملفات المستخدم لحساب الإحصائيات
      const filesResponse = await DatabaseService.getUserFiles(user.$id);
      const files = filesResponse.documents || []; // استخراج documents من الاستجابة
      
      // حساب التحميلات = كم مرة حملت أنا ملفات من النظام
      const totalDownloads = await DatabaseService.getUserDownloadedFilesCount(user.$id);
      
      const stats = {
        totalFiles: files.length,
        totalDownloads: totalDownloads,
        totalSize: files.reduce((sum, file) => sum + (file.fileSize || 0), 0),
        joinedDate: user.$createdAt
      };
      
      setUserStats(stats);
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      setMessage('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      try {
        await logout();
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <ModernCard className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            غير مصرح بالدخول
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            يرجى تسجيل الدخول للوصول إلى الملف الشخصي
          </p>
          <ModernButton href="/login">
            تسجيل الدخول
          </ModernButton>
        </ModernCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            الملف الشخصي
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            معلوماتك الشخصية وإحصائياتك على المنصة
          </p>
        </div>

        {message && (
          <ModernAlert 
            variant={message.includes('✅') ? 'success' : 'error'}
            className="mb-6"
          >
            {message}
          </ModernAlert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* معلومات المستخدم */}
          <div className="lg:col-span-2">
            <ModernCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>👤</span> معلومات الحساب
                </h2>
                <ModernButton 
                  onClick={handleLogout}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  تسجيل الخروج
                </ModernButton>
              </div>
              
              <div className="space-y-6">
                {/* صورة المستخدم */}
                <div className="flex items-center space-x-6 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-3xl text-white font-bold">
                        {(user.name || user.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {user.name || 'مستخدم'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      عضو منذ {formatDate(userStats.joinedDate)}
                    </p>
                  </div>
                </div>

                {/* تفاصيل الحساب */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الاسم
                    </label>
                    <ModernInput 
                      value={user.name || 'غير محدد'} 
                      disabled 
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      البريد الإلكتروني
                    </label>
                    <ModernInput 
                      value={user.email} 
                      disabled 
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      معرف المستخدم
                    </label>
                    <ModernInput 
                      value={user.$id} 
                      disabled 
                      className="bg-gray-50 dark:bg-gray-800 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      تاريخ التسجيل
                    </label>
                    <ModernInput 
                      value={formatDate(user.$createdAt)} 
                      disabled 
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      آخر تحديث
                    </label>
                    <ModernInput 
                      value={formatDate(user.$updatedAt)} 
                      disabled 
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                  </div>
                </div>
              </div>
            </ModernCard>
          </div>

          {/* الإحصائيات */}
          <div className="space-y-6">
            
            {/* إحصائيات النشاط */}
            <ModernCard className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>📊</span> إحصائيات النشاط
              </h3>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 dark:text-blue-400">الملفات المرفوعة</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                          {userStats.totalFiles}
                        </p>
                      </div>
                      <span className="text-2xl">📁</span>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 dark:text-green-400">إجمالي التحميلات</p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                          {userStats.totalDownloads}
                        </p>
                      </div>
                      <span className="text-2xl">📥</span>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 dark:text-purple-400">حجم البيانات</p>
                        <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                          {formatFileSize(userStats.totalSize)}
                        </p>
                      </div>
                      <span className="text-2xl">💾</span>
                    </div>
                  </div>
                </div>
              )}
            </ModernCard>

            {/* روابط سريعة */}
            <ModernCard className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>🔗</span> روابط سريعة
              </h3>
              
              <div className="space-y-3">
                <ModernButton 
                  href="/dashboard"
                  variant="outline"
                  className="w-full justify-start"
                >
                  <span className="mr-2">🏠</span> لوحة التحكم
                </ModernButton>
                
                <ModernButton 
                  href="/materials"
                  variant="outline"
                  className="w-full justify-start"
                >
                  <span className="mr-2">📚</span> تصفح المواد
                </ModernButton>
                
                <ModernButton 
                  href="/uploads"
                  variant="outline"
                  className="w-full justify-start"
                >
                  <span className="mr-2">📤</span> ملفاتي المرفوعة
                </ModernButton>
              </div>
            </ModernCard>

            {/* معلومات المنصة */}
            <ModernCard className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>ℹ️</span> معلومات المنصة
              </h3>
              
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center justify-between">
                  <span>الإصدار:</span>
                  <span className="font-mono">3.0.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>النظام:</span>
                  <span>Appwrite</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>الحالة:</span>
                  <span className="text-green-600 dark:text-green-400">متصل</span>
                </div>
              </div>
            </ModernCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernProfile;