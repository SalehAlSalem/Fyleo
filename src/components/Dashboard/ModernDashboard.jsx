import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, orderBy, getDocs, doc, deleteDoc } from 'firebase/firestore';
// تمت إزالة Firebase Storage؛ نستخدم فقط Firestore + النظام الهجين الخارجي
import { auth, db } from '../../../Firebase/ClientApp.js';
import { 
  ModernCard, 
  ModernButton, 
  ModernInput,
  ModernAlert,
  useTranslation 
} from '../modern/ModernComponents';
import ModernUploadForm from './ModernUploadForm';

const ModernDashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [userFiles, setUserFiles] = useState([]);
  const [userStats, setUserStats] = useState({
    totalFiles: 0,
    totalDownloads: 0,
    totalSize: 0
  });
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserFiles();
    }
  }, [user]);

  const fetchUserFiles = async () => {
    if (!user) return;
    
    setLoadingFiles(true);
    try {
      const filesRef = collection(db, 'files');
      const q = query(
        filesRef,
        where('uploadedBy', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const filesList = [];
      let totalSize = 0;
      let totalDownloads = 0;
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        filesList.push({
          id: doc.id,
          ...data
        });
        totalSize += data.size || 0;
        totalDownloads += data.downloads || 0;
      });

      setUserFiles(filesList);
      setUserStats({
        totalFiles: filesList.length,
        totalDownloads,
        totalSize
      });
    } catch (error) {
      console.error('Error fetching user files:', error);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleDeleteFile = async (fileId, fileName) => {
    if (!confirm(`هل أنت متأكد من حذف الملف "${fileName}"؟`)) return;
    setDeleteLoading(fileId);
    try {
      // حذف من Firestore فقط (ملفات التخزين الخارجية لا تحذف تلقائياً هنا)
      await deleteDoc(doc(db, 'files', fileId));
      setUserFiles(prev => prev.filter(file => file.id !== fileId));
      setUserStats(prev => ({ ...prev, totalFiles: prev.totalFiles - 1 }));
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('حدث خطأ أثناء حذف الملف');
    } finally {
      setDeleteLoading(null);
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
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ar-SA');
  };

  const tabs = [
    { id: 'overview', name: 'نظرة عامة', icon: '📊' },
    { id: 'upload', name: 'رفع ملف', icon: '📤' },
    { id: 'files', name: 'ملفاتي', icon: '📁' },
    { id: 'settings', name: 'الإعدادات', icon: '⚙️' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-pulse w-12 h-12 rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container-modern py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
              {user.displayName?.[0] || user.email?.[0] || '👤'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                مرحباً، {user.displayName || user.email?.split('@')[0]}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                لوحة التحكم الخاصة بك
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 rtl:space-x-reverse">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <span className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <ModernCard className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <span className="text-2xl">📁</span>
                  </div>
                  <div className="mr-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي الملفات</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {userStats.totalFiles}
                    </p>
                  </div>
                </div>
              </ModernCard>

              <ModernCard className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <span className="text-2xl">📥</span>
                  </div>
                  <div className="mr-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي التحميلات</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {userStats.totalDownloads}
                    </p>
                  </div>
                </div>
              </ModernCard>

              <ModernCard className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                    <span className="text-2xl">💾</span>
                  </div>
                  <div className="mr-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">المساحة المستخدمة</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatFileSize(userStats.totalSize)}
                    </p>
                  </div>
                </div>
              </ModernCard>
            </div>

            {/* Recent Files */}
            <ModernCard className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                الملفات الحديثة
              </h2>
              {loadingFiles ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : userFiles.length > 0 ? (
                <div className="space-y-4">
                  {userFiles.slice(0, 5).map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
                          📄
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {file.category} • {formatDate(file.createdAt)}
                          </p>
                        </div>
                      </div>
                      <ModernButton size="sm" variant="secondary">
                        عرض
                      </ModernButton>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl mb-2 block">📄</span>
                  <p className="text-gray-600 dark:text-gray-400">لم ترفع أي ملفات بعد</p>
                </div>
              )}
            </ModernCard>
          </div>
        )}

        {activeTab === 'upload' && (
          <ModernUploadForm onUploadSuccess={fetchUserFiles} />
        )}

        {activeTab === 'files' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ملفاتي ({userFiles.length})
              </h2>
            </div>

            {loadingFiles ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ModernCard key={i} className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                    </div>
                  </ModernCard>
                ))}
              </div>
            ) : userFiles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userFiles.map((file) => (
                  <ModernCard key={file.id} className="p-6">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-xl">
                          📄
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate">
                          {file.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                          <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {file.category}
                          </span>
                          {file.size && (
                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {formatFileSize(file.size)}
                            </span>
                          )}
                          <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {formatDate(file.createdAt)}
                          </span>
                        </div>
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <ModernButton
                            size="sm"
                            onClick={() => window.open(file.downloadURL, '_blank')}
                          >
                            عرض
                          </ModernButton>
                          <ModernButton
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteFile(file.id, file.name)}
                            loading={deleteLoading === file.id}
                            disabled={deleteLoading === file.id}
                          >
                            حذف
                          </ModernButton>
                        </div>
                      </div>
                    </div>
                  </ModernCard>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  لا توجد ملفات
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  لم ترفع أي ملفات بعد. ابدأ برفع أول ملف لك!
                </p>
                <ModernButton onClick={() => setActiveTab('upload')}>
                  <span className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span>📤</span>
                    <span>رفع ملف جديد</span>
                  </span>
                </ModernButton>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <ModernCard className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                معلومات الحساب
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الاسم
                  </label>
                  <ModernInput
                    type="text"
                    value={user.displayName || ''}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    البريد الإلكتروني
                  </label>
                  <ModernInput
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
              </div>
            </ModernCard>

            <ModernCard className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                إحصائيات الاستخدام
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {userStats.totalFiles}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">ملف مرفوع</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {formatFileSize(userStats.totalSize)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">مساحة مستخدمة</div>
                </div>
              </div>
            </ModernCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernDashboard;