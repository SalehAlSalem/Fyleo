import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import DatabaseService from '../../services/databaseService';
import StorageService from '../../services/storageService';
import { 
  ModernCard, 
  ModernButton, 
  ModernInput,
  ModernAlert,
  useTranslation 
} from '../modern/ModernComponents';

const ModernDashboard = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  
  // State للملفات والإحصائيات
  const [userFiles, setUserFiles] = useState([]);
  const [userStats, setUserStats] = useState({
    totalFiles: 0,
    totalDownloads: 0,
    totalSize: 0
  });
  const [loadingFiles, setLoadingFiles] = useState(true);
  
  // State لرفع الملفات
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');
  
  const databaseService = new DatabaseService();
  const storageService = new StorageService();

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    setLoadingFiles(true);
    try {
      // جلب ملفات المستخدم
      const files = await databaseService.getUserMaterials(user.$id);
      setUserFiles(files);
      
      // حساب الإحصائيات
      const stats = {
        totalFiles: files.length,
        totalDownloads: files.reduce((sum, file) => sum + (file.downloadCount || 0), 0),
        totalSize: files.reduce((sum, file) => sum + (file.size || 0), 0)
      };
      setUserStats(stats);
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      if (!uploadTitle) {
        setUploadTitle(file.name.split('.')[0]);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadFile || !uploadTitle || !uploadCategory) {
      setUploadMessage('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadMessage('');

    try {
      // رفع الملف إلى التخزين
      const fileData = await storageService.uploadFile(uploadFile, {
        onProgress: (progress) => setUploadProgress(progress)
      });

      // حفظ بيانات الملف في قاعدة البيانات
      const materialData = {
        title: uploadTitle,
        description: uploadDescription,
        category: uploadCategory,
        fileUrl: fileData.fileUrl,
        fileName: uploadFile.name,
        fileType: uploadFile.type,
        size: uploadFile.size,
        uploadedBy: user.$id,
        uploaderName: user.name || user.email
      };

      await databaseService.createMaterial(materialData);
      
      // إعادة تعيين النموذج
      setUploadFile(null);
      setUploadTitle('');
      setUploadDescription('');
      setUploadCategory('');
      setUploadMessage('✅ تم رفع الملف بنجاح!');
      
      // إعادة تحميل البيانات
      await fetchUserData();
      
    } catch (error) {
      console.error('❌ Upload error:', error);
      setUploadMessage('❌ حدث خطأ أثناء رفع الملف');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteFile = async (fileId, fileName) => {
    if (!confirm(`هل أنت متأكد من حذف الملف "${fileName}"؟`)) return;
    
    try {
      await databaseService.deleteMaterial(fileId);
      await fetchUserData(); // إعادة تحميل البيانات
      setUploadMessage('✅ تم حذف الملف بنجاح');
    } catch (error) {
      console.error('❌ Delete error:', error);
      setUploadMessage('❌ حدث خطأ أثناء حذف الملف');
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
    return date.toLocaleDateString('ar-SA');
  };

  const categories = [
    { value: 'mathematics', label: 'الرياضيات' },
    { value: 'physics', label: 'الفيزياء' },
    { value: 'chemistry', label: 'الكيمياء' },
    { value: 'biology', label: 'الأحياء' },
    { value: 'computer-science', label: 'علوم الحاسوب' },
    { value: 'engineering', label: 'الهندسة' },
    { value: 'languages', label: 'اللغات' },
    { value: 'literature', label: 'الأدب' },
    { value: 'history', label: 'التاريخ' },
    { value: 'geography', label: 'الجغرافيا' },
    { value: 'economics', label: 'الاقتصاد' },
    { value: 'other', label: 'أخرى' }
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>غير مصرح له بالدخول</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              مرحباً، {user.name || user.email}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              لوحة التحكم الشاملة - رفع وإدارة ملفاتك
            </p>
          </div>
          <ModernButton 
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            تسجيل الخروج
          </ModernButton>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ModernCard className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📁</span>
                </div>
              </div>
              <div className="mr-5">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  إجمالي الملفات
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {userStats.totalFiles}
                </p>
              </div>
            </div>
          </ModernCard>

          <ModernCard className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📥</span>
                </div>
              </div>
              <div className="mr-5">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  إجمالي التحميلات
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {userStats.totalDownloads}
                </p>
              </div>
            </div>
          </ModernCard>

          <ModernCard className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💾</span>
                </div>
              </div>
              <div className="mr-5">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  حجم البيانات
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatFileSize(userStats.totalSize)}
                </p>
              </div>
            </div>
          </ModernCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* قسم رفع الملفات */}
          <ModernCard className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span>📤</span> رفع ملف جديد
            </h2>
            
            {uploadMessage && (
              <ModernAlert 
                variant={uploadMessage.includes('✅') ? 'success' : 'error'}
                className="mb-4"
              >
                {uploadMessage}
              </ModernAlert>
            )}
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  اختر الملف *
                </label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {uploadFile && (
                  <p className="text-sm text-gray-500 mt-1">
                    الملف المحدد: {uploadFile.name} ({formatFileSize(uploadFile.size)})
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عنوان الملف *
                </label>
                <ModernInput
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="أدخل عنوان الملف"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  التصنيف *
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">اختر التصنيف</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الوصف (اختياري)
                </label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="أدخل وصف للملف"
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {uploading && uploadProgress > 0 && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                  <p className="text-sm text-center mt-1 text-gray-600 dark:text-gray-400">
                    {uploadProgress}% مكتمل
                  </p>
                </div>
              )}

              <ModernButton
                type="submit"
                disabled={uploading || !uploadFile}
                className="w-full"
              >
                {uploading ? '🔄 جاري الرفع...' : '📤 رفع الملف'}
              </ModernButton>
            </form>
          </ModernCard>

          {/* قسم الملفات المرفوعة */}
          <ModernCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>📁</span> ملفاتي ({userFiles.length})
              </h2>
              <ModernButton 
                onClick={fetchUserData}
                variant="outline"
                size="sm"
                disabled={loadingFiles}
              >
                {loadingFiles ? '🔄' : '↻'} تحديث
              </ModernButton>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {loadingFiles ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : userFiles.length > 0 ? (
                userFiles.map((file) => (
                  <div key={file.$id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="text-2xl">📄</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {file.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            {file.downloadCount || 0} تحميل
                          </p>
                        </div>
                      </div>
                      <ModernButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteFile(file.$id, file.title)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        🗑️
                      </ModernButton>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">📁</span>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">لا توجد ملفات حتى الآن</p>
                  <p className="text-sm text-gray-400">ابدأ برفع أول ملف لك!</p>
                </div>
              )}
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;