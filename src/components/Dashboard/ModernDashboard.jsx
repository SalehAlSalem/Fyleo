import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { DatabaseService } from '../../config/DatabaseService';
import { StorageService } from '../../config/StorageService';
import { CategoryService, INITIAL_CATEGORIES } from '../../config/CategoryService';
import { DATABASE_ID, FILES_COLLECTION_ID } from '../../config/appwrite';
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
  const [downloadCounts, setDownloadCounts] = useState({}); // عدادات التحميل لكل ملف
  
  // State لرفع الملفات
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  
  // النظام الهرمي الجديد - ثلاث مستويات
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');
  
  // State لتعديل الملفات
  const [editingFile, setEditingFile] = useState(null);
  const [editCategory, setEditCategory] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editFileType, setEditFileType] = useState('');
  const [updating, setUpdating] = useState(false);
  
  // State للفلترة
  const [filterCategory, setFilterCategory] = useState(''); // فلتر حسب التصنيف
  
  // استخدام DatabaseService مباشرة بدون constructor
  // استخدام StorageService مباشرة بدون constructor

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    setLoadingFiles(true);
    try {
      console.log('📊 Fetching user files for user:', user.$id);
      // جلب ملفات المستخدم
      const filesResponse = await DatabaseService.getUserFiles(user.$id);
      console.log('📁 Raw files response:', filesResponse);
      const files = filesResponse.documents || []; // استخراج documents من الاستجابة
      setUserFiles(files);
      
      console.log('📊 Files fetched:', files.length, files); // للتطوير
      
      // حساب عدد التحميلات لكل ملف ديناميكياً
      const counts = {};
      console.log('🔍 Processing files for download counts:', files.length);
      
      for (const file of files) {
        try {
          console.log(`🔍 Getting count for file: ${file.$id} (${file.title})`);
          const count = await DatabaseService.getFileDownloadCount(file.$id);
          console.log(`✅ File ${file.title} has ${count} downloads`);
          counts[file.$id] = count;
        } catch (err) {
          console.error(`❌ Error getting download count for file ${file.$id}:`, err);
          counts[file.$id] = 0;
        }
      }
      console.log('🔍 Final download counts:', counts);
      setDownloadCounts(counts);
      
      // دعني أرى بنية البيانات الموجودة
      if (files.length > 0) {
        console.log('🔍 First file structure:', files[0]);
        console.log('🔍 First file keys:', Object.keys(files[0]));
        // دعني أطبع كل حقل بوضوح
        Object.keys(files[0]).forEach(key => {
          console.log(`🔹 ${key}:`, files[0][key]);
        });
      }
      
      // حساب الإحصائيات 
      // إجمالي التحميلات = كم مرة حملت أنا ملفات من النظام
      const totalDownloads = await DatabaseService.getUserDownloadedFilesCount(user.$id);
      
      const stats = {
        totalFiles: files.length,
        totalDownloads: totalDownloads,
        totalSize: files.reduce((sum, file) => sum + (file.fileSize || 0), 0)
      };
      console.log('📈 Calculated stats:', stats);
      setUserStats(stats);
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
      console.error('Full error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    } finally {
      setLoadingFiles(false);
    }
  };

  // دالة لإعادة تحميل الإحصائيات فقط
  const refreshStats = async () => {
    if (!user?.$id) return;
    try {
      // تحديث عدد التحميلات = كم مرة حملت أنا ملفات
      const totalDownloads = await DatabaseService.getUserDownloadedFilesCount(user.$id);
      setUserStats(prev => ({
        ...prev,
        totalDownloads: totalDownloads
      }));
    } catch (error) {
      console.error('❌ Error refreshing stats:', error);
    }
  };

  // دوال التحكم في النظام الهرمي
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubject(''); // إعادة تعيين المادة عند تغيير التصنيف
    setSelectedFileType(''); // إعادة تعيين نوع الملف
  };

  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject);
    setSelectedFileType(''); // إعادة تعيين نوع الملف عند تغيير المادة
  };

  const handleFileTypeChange = (fileType) => {
    setSelectedFileType(fileType);
  };

  // الحصول على البيانات للقوائم المنسدلة
  const categories = CategoryService.MAIN_CATEGORIES || [];
  const subjects = selectedCategory 
    ? categories.find(cat => cat.id === selectedCategory)?.subjects || []
    : [];
  const fileTypes = CategoryService.INITIAL_FILE_TYPES || [];

  // إضافة console.log للتطوير
  console.log('📊 Debug data:', {
    categoriesCount: categories.length,
    selectedCategory,
    subjectsCount: subjects.length,
    selectedSubject,
    fileTypesCount: fileTypes.length,
    selectedFileType,
    fileTypes
  });

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
    
    if (!uploadFile || !uploadTitle || !selectedCategory || !selectedSubject || !selectedFileType) {
      setUploadMessage('يرجى ملء جميع الحقول المطلوبة واختيار التصنيف والمادة ونوع الملف');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadMessage('');

    try {
      // رفع الملف إلى التخزين
      console.log('🚀 Starting upload process...');
      const fileData = await StorageService.uploadFile(uploadFile, {
        onProgress: (progress) => setUploadProgress(progress)
      });
      console.log('✅ File uploaded to storage:', fileData);

      // حفظ بيانات الملف في قاعدة البيانات
      const materialData = {
        // معرف الملف في Storage
        fileId: fileData.fileId,
        
        // معلومات الملف الأساسية
        title: uploadTitle,
        description: uploadDescription,
        
        // النظام الهرمي - بناءً على هيكل قاعدة البيانات
        category: selectedCategory,        // حقل category الموجود
        categoryId: selectedCategory,      // حقل categoryId الموجود
        subject: selectedSubject,          // حقل subject الموجود  
        subjectId: selectedSubject,        // حقل subjectId الموجود
        fileTypeId: selectedFileType,      // حقل fileTypeId الموجود
        
        // بيانات الملف
        uploadedBy: user.$id,              // حقل uploadedBy
        fileName: uploadFile.name,         // حقل fileName
        fileSize: uploadFile.size,         // حقل fileSize
        mimeType: uploadFile.type,         // حقل mimeType
        downloadURL: fileData.downloadURL, // حقل downloadURL
        viewURL: fileData.viewURL || fileData.downloadURL, // حقل viewURL
        
        // حقول إضافية (اختيارية)
        tags: null,
        semester: null,
        year: null
      };

      console.log('💾 Saving to database:', materialData);
      const dbResponse = await DatabaseService.createFile(materialData);
      console.log('✅ File saved to database:', dbResponse);
      
      // إعادة تعيين النموذج
      setUploadFile(null);
      setUploadTitle('');
      setUploadDescription('');
      setSelectedCategory('');
      setSelectedSubject('');
      setSelectedFileType('');
      setUploadMessage('✅ تم رفع الملف بنجاح!');
      
      // إعادة تحميل البيانات
      console.log('🔄 Refreshing user data...');
      await fetchUserData();
      console.log('✅ Data refreshed successfully');
      
    } catch (error) {
      console.error('❌ Upload error:', error);
      setUploadMessage(`❌ حدث خطأ أثناء رفع الملف: ${error.message || error}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteFile = async (fileId, fileName) => {
    if (!confirm(`هل أنت متأكد من حذف الملف "${fileName}"؟`)) return;
    
    try {
      // أولاً احصل على بيانات الملف من Database
      const fileData = await DatabaseService.getFileById(fileId);
      
      // احذف من Database
      await DatabaseService.deleteFile(fileId);
      
      // احذف من Storage باستخدام fileId المحفوظ في Database
      if (fileData.fileId) {
        await StorageService.deleteFile(fileData.fileId);
        console.log('✅ File deleted from Storage:', fileData.fileId);
      }
      
      await fetchUserData(); // إعادة تحميل البيانات
      setUploadMessage('✅ تم حذف الملف بنجاح من Database و Storage');
    } catch (error) {
      console.error('❌ Delete error:', error);
      setUploadMessage('❌ حدث خطأ أثناء حذف الملف');
    }
  };

  // دالة لفتح نموذج تعديل الملف
  const handleEditFile = (file) => {
    setEditingFile(file);
    setEditCategory(file.categoryId || file.category || '');
    setEditSubject(file.subjectId || file.subject || '');
    setEditFileType(file.fileTypeId || file.fileType || '');
  };

  // دالة لإغلاق نموذج التعديل
  const handleCancelEdit = () => {
    setEditingFile(null);
    setEditCategory('');
    setEditSubject('');
    setEditFileType('');
  };

  // الحصول على البيانات للقوائم المنسدلة في نموذج التعديل
  const editCategories = CategoryService.MAIN_CATEGORIES || [];
  const editSubjects = editCategory 
    ? editCategories.find(cat => cat.id === editCategory)?.subjects || []
    : [];
  const editFileTypes = CategoryService.INITIAL_FILE_TYPES || [];

  // دوال التحكم في نموذج التعديل
  const handleEditCategoryChange = (categoryId) => {
    setEditCategory(categoryId);
    setEditSubject(''); // إعادة تعيين المادة عند تغيير التصنيف
    setEditFileType(''); // إعادة تعيين نوع الملف
  };

  const handleEditSubjectChange = (subject) => {
    setEditSubject(subject);
    setEditFileType(''); // إعادة تعيين نوع الملف عند تغيير المادة
  };

  // تطبيق الفلتر على الملفات
  const filteredFiles = filterCategory 
    ? userFiles.filter(file => file.categoryId === filterCategory || file.category === filterCategory)
    : userFiles;

  // Debug للتعديل
  console.log('📝 Edit Debug data:', {
    editCategories: editCategories.length,
    editCategoriesFirst: editCategories[0],
    editCategory,
    editSubjects: editSubjects.length,
    editSubjectsFirst: editSubjects[0],
    editSubject,
    editFileTypes: editFileTypes.length,
    editFileTypesFirst: editFileTypes[0],
    editFileType
  });

  // دالة لحفظ تعديل الملف
  const handleUpdateFile = async (e) => {
    e.preventDefault();
    
    if (!editingFile || !editCategory || !editSubject || !editFileType) {
      setUploadMessage('❌ يرجى ملء جميع الحقول');
      return;
    }

    setUpdating(true);
    setUploadMessage('');

    try {
      // تحديث بيانات الملف في قاعدة البيانات
      await DatabaseService.updateFile(editingFile.$id, {
        categoryId: editCategory,
        subjectId: editSubject,
        fileTypeId: editFileType
      });

      setUploadMessage('✅ تم تحديث مكان الملف بنجاح');
      handleCancelEdit();
      await fetchUserData(); // إعادة تحميل البيانات
      
    } catch (error) {
      console.error('Error updating file:', error);
      setUploadMessage('❌ حدث خطأ أثناء تحديث الملف');
    } finally {
      setUpdating(false);
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

              {/* النظام الهرمي للتصنيف - ثلاث مستويات */}
              <div className="space-y-4">
                {/* المستوى الأول: التصنيف الرئيسي */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    التصنيف الرئيسي *
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">اختر التصنيف الرئيسي</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* المستوى الثاني: المادة (تظهر فقط بعد اختيار التصنيف) */}
                {selectedCategory && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      المادة *
                    </label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => handleSubjectChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">اختر المادة</option>
                      {subjects.map((subject, index) => (
                        <option key={index} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* المستوى الثالث: نوع الملف (يظهر فقط بعد اختيار المادة) */}
                {selectedSubject && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      نوع الملف *
                    </label>
                    <select
                      value={selectedFileType}
                      onChange={(e) => handleFileTypeChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">اختر نوع الملف</option>
                      {fileTypes.map((fileType) => (
                        <option key={fileType.id} value={fileType.id}>
                          {fileType.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
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
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>📁</span> ملفاتي ({filteredFiles.length} من {userFiles.length})
                </h2>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">جميع التصنيفات</option>
                  {editCategories && editCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon && typeof category.icon === 'string' ? category.icon + ' ' : ''}
                      {category.name && typeof category.name === 'string' ? category.name : 'تصنيف غير معروف'}
                    </option>
                  ))}
                </select>
              </div>
              <ModernButton 
                onClick={() => {
                  console.log('🧪 Testing database connection...');
                  console.log('User ID:', user?.$id);
                  console.log('Database ID:', DATABASE_ID);
                  console.log('Collection ID:', FILES_COLLECTION_ID);
                }}
                variant="outline"
                size="sm"
              >
                🧪 اختبار
              </ModernButton>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {loadingFiles ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <div key={file.$id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="text-2xl">📄</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {file.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.fileSize || file.size)} • {formatDate(file.$createdAt || file.uploadedAt)}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            {downloadCounts[file.$id] || 0} تحميل
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <ModernButton
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditFile(file)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          ✏️
                        </ModernButton>
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
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">📁</span>
                  {filterCategory ? (
                    <>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">لا توجد ملفات في هذا التصنيف</p>
                      <p className="text-sm text-gray-400">جرب تصنيف آخر أو ارفع ملفات جديدة!</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">لا توجد ملفات حتى الآن</p>
                      <p className="text-sm text-gray-400">ابدأ برفع أول ملف لك!</p>
                      {/* رسالة تصحيح */}
                      <div className="mt-4 p-2 bg-yellow-100 dark:bg-yellow-900 rounded text-xs">
                        تصحيح: عدد الملفات = {userFiles.length} | معرف المستخدم = {user?.$id}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </ModernCard>
        </div>
        
        {/* نموذج تعديل الملف */}
        {editingFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    تعديل مكان الملف: {editingFile.title}
                  </h2>
                  <button
                    onClick={handleCancelEdit}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleUpdateFile} className="space-y-6">
                  {/* التصنيف الرئيسي */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      التصنيف الرئيسي *
                    </label>
                    <select
                      value={editCategory}
                      onChange={(e) => handleEditCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="">اختر التصنيف</option>
                      {editCategories && editCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.icon && typeof category.icon === 'string' ? category.icon + ' ' : ''}
                          {category.name && typeof category.name === 'string' ? category.name : 'تصنيف غير معروف'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* المادة */}
                  {editCategory && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        المادة *
                      </label>
                      <select
                        value={editSubject}
                        onChange={(e) => handleEditSubjectChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="">اختر المادة</option>
                        {editSubjects && editSubjects.map((subject, index) => (
                          <option key={index} value={subject}>
                            {typeof subject === 'string' ? subject : 'مادة غير معروفة'}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* نوع الملف */}
                  {editSubject && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        نوع الملف *
                      </label>
                      <select
                        value={editFileType}
                        onChange={(e) => setEditFileType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="">اختر نوع الملف</option>
                        {editFileTypes && editFileTypes.map((fileType) => (
                          <option key={fileType.id} value={fileType.id}>
                            {fileType.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* رسالة التحديث */}
                  {uploadMessage && (
                    <ModernAlert
                      message={uploadMessage}
                      variant={uploadMessage.includes('✅') ? 'success' : 'error'}
                    />
                  )}

                  {/* أزرار التحكم */}
                  <div className="flex gap-3 pt-4">
                    <ModernButton
                      type="submit"
                      disabled={updating || !editCategory || !editSubject || !editFileType}
                      className="flex-1"
                    >
                      {updating ? '🔄 جاري التحديث...' : '💾 حفظ التعديل'}
                    </ModernButton>
                    <ModernButton
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={updating}
                      className="flex-1"
                    >
                      إلغاء
                    </ModernButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernDashboard;