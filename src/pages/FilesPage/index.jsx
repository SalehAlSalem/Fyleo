import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DatabaseService } from '../../config/DatabaseService';
import { useAuth } from '../../hooks/useAuth';

const FilesPage = () => {
  const { categoryId, subjectName } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState({
    totalFiles: 0,
    totalDownloads: 0,
    totalSize: 0
  });

  const decodedSubjectName = decodeURIComponent(subjectName);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching files for:', { categoryId, subjectName: decodedSubjectName });
        console.log('👤 Current user:', user);
        
        // جلب جميع الملفات من DatabaseService
        console.log('📡 Calling DatabaseService.getAllFiles()...');
        const filesResponse = await DatabaseService.getAllFiles();
        console.log('📦 Raw response from DatabaseService:', filesResponse);
        
        const allFiles = filesResponse.documents || [];
        console.log('📁 All files array:', allFiles);
        console.log('📊 Total files count:', allFiles.length);
        
        // حساب عدد التحميلات لكل ملف من جدول downloads
        const filesWithDownloads = await Promise.all(
          allFiles.map(async (file) => {
            try {
              // استخدام الدالة الموجودة في DatabaseService لحساب التحميلات
              const downloadCount = await DatabaseService.getFileDownloadCount(file.$id);
              return {
                ...file,
                downloads: downloadCount
              };
            } catch (error) {
              console.error(`Error getting download count for file ${file.$id}:`, error);
              return {
                ...file,
                downloads: 0
              };
            }
          })
        );
        
        if (filesWithDownloads.length > 0) {
          console.log('🔍 Sample file structure:', JSON.stringify(filesWithDownloads[0], null, 2));
          console.log('🔑 Available file properties:', Object.keys(filesWithDownloads[0]));
          console.log('📊 Downloads in first file:', filesWithDownloads[0].downloads);
          console.log('🏷️ File details for labels:', {
            fileTypeId: filesWithDownloads[0].fileTypeId,
            mimeType: filesWithDownloads[0].mimeType,
            subject: filesWithDownloads[0].subject,
            category: filesWithDownloads[0].category,
            title: filesWithDownloads[0].title || filesWithDownloads[0].name
          });
          console.log('📊 All files downloads:', filesWithDownloads.map(f => ({ 
            name: f.name || f.title, 
            downloads: f.downloads
          })));
        } else {
          console.log('⚠️ No files found in database');
        }
        
        // استخدام الملفات مع عدادات التحميل الصحيحة
        let visibleFiles = filesWithDownloads;
        
        // فلترة حسب الفئة - استخدام الاسم الصحيح للخاصية
        if (categoryId) {
          visibleFiles = visibleFiles.filter(file => 
            file.category === categoryId
          );
          console.log('Files after category filter:', visibleFiles.length);
        }
        
        // فلترة حسب الموضوع - استخدام الاسم الصحيح للخاصية
        if (subjectName && decodedSubjectName) {
          visibleFiles = visibleFiles.filter(file => 
            file.subject === decodedSubjectName
          );
          console.log('Files after subject filter:', visibleFiles.length);
        }
        
        // إظهار جميع الملفات بغض النظر عن حالة الاعتماد (للتجربة)
        // يمكن إضافة فلترة الاعتماد لاحقاً إذا لزم الأمر
        // const approvedFiles = visibleFiles.filter(file => 
        //   file.approved === true || (user && file.uploadedBy === user.email)
        // );
        
        console.log('Final visible files:', visibleFiles.length);
        
        setFiles(visibleFiles);
        setFilteredFiles(visibleFiles);
        
        // حساب الإحصائيات
        if (visibleFiles.length > 0) {
          const stats = {
            totalFiles: visibleFiles.length,
            totalDownloads: visibleFiles.reduce((sum, file) => sum + (file.downloads || 0), 0),
            totalSize: visibleFiles.reduce((sum, file) => sum + (file.size || file.fileSize || 0), 0)
          };
          setStatistics(stats);
          console.log('Statistics calculated:', stats);
          console.log('File downloads breakdown:', visibleFiles.map(file => ({ 
            name: file.title || file.fileName || 'Unknown',
            downloads: file.downloads || 0 
          })));
        } else {
          console.log('No files found - displaying empty state');
          setStatistics({ totalFiles: 0, totalDownloads: 0, totalSize: 0 });
        }
        
      } catch (err) {
        console.error('Error fetching files:', err);
        setError('فشل في تحميل الملفات');
      } finally {
        setLoading(false);
      }
    };

    if (categoryId && subjectName) {
      fetchFiles();
    }
  }, [categoryId, subjectName, user]);

  // تصفية الملفات حسب النوع
  useEffect(() => {
    if (selectedFileType === 'all') {
      setFilteredFiles(files);
    } else {
      const filtered = files.filter(file => {
        // استخدام fileTypeId المحفوظ في قاعدة البيانات
        const fileTypeId = file.fileTypeId || ''; // هذا هو المعرف المحفوظ الصحيح
        
        return fileTypeId === selectedFileType;
      });
      setFilteredFiles(filtered);
    }
  }, [files, selectedFileType]);

  // أنواع الملفات المتاحة للفلترة
  const fileTypes = [
    { id: 'all', name: 'جميع الملفات', icon: '📁' },
    { id: 'lectures', name: 'محاضرات', icon: '🎓' },
    { id: 'slides', name: 'سلايدات', icon: '�' },
    { id: 'books', name: 'كتب', icon: '📚' },
    { id: 'sheets', name: 'شيتات', icon: '�' },
    { id: 'exams', name: 'امتحانات', icon: '📝' },
    { id: 'projects', name: 'مشاريع', icon: '💼' },
    { id: 'videos', name: 'فيديوهات', icon: '�' },
    { id: 'notes', name: 'ملاحظات', icon: '�' }
  ];

  // تنسيق حجم الملف
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    try {
      // إذا كان التاريخ من Firestore
      if (dateString.toDate) {
        return dateString.toDate().toLocaleDateString('ar-SA');
      }
      return new Date(dateString).toLocaleDateString('ar-SA');
    } catch {
      return 'غير محدد';
    }
  };

  // معالج التحميل
  const handleDownload = async (file) => {
    try {
      console.log('📥 Download button clicked!');
      console.log('📂 File object:', file);
      
      // تسجيل التحميل
      if (user && file.$id) {
        try {
          await DatabaseService.createDownload({
            userId: user.$id,
            fileId: file.$id
          });
          console.log('✅ Download recorded');
          
          // تحديث عداد التحميلات في الملف
          await DatabaseService.incrementDownloadCount(file.$id);
          console.log('✅ Download count incremented');
          
          // تحديث العداد محلياً
          setStatistics(prev => ({
            ...prev,
            totalDownloads: prev.totalDownloads + 1
          }));
          
          // تحديث قائمة الملفات لإظهار العداد الجديد
          setFiles(prevFiles => prevFiles.map(f => 
            f.$id === file.$id 
              ? { ...f, downloads: (f.downloads || 0) + 1 }
              : f
          ));
          setFilteredFiles(prevFiles => prevFiles.map(f => 
            f.$id === file.$id 
              ? { ...f, downloads: (f.downloads || 0) + 1 }
              : f
          ));
          
        } catch (downloadError) {
          console.log('⚠️ Could not record download:', downloadError);
        }
      }

      // البحث عن رابط الملف في خصائص مختلفة
      const url = file.downloadURL || file.fileUrl || file.url || file.link || file.href;
      console.log('🔗 Download URL found:', url);
      
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name || file.title || 'file';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('✅ Download initiated successfully');
      } else {
        console.error('❌ No download URL found for file');
        console.log('🔗 URL sources check:', {
          downloadURL: file.downloadURL,
          fileUrl: file.fileUrl, 
          url: file.url,
          link: file.link,
          href: file.href
        });
        alert('رابط التحميل غير متوفر - تحقق من وحدة التحكم للتفاصيل');
      }
    } catch (error) {
      console.error('خطأ في التحميل:', error);
      alert('حدث خطأ في التحميل');
    }
  };

  // معالج العرض
  const handleView = (file) => {
    console.log('🔍 View button clicked!');
    console.log('📂 File object:', file);
    console.log('📂 File properties:', Object.keys(file));
    
    // للعرض، نستخدم viewURL أولاً، ثم downloadURL كبديل
    const viewUrl = file.viewURL || file.downloadURL || file.fileUrl || file.url || file.link || file.href;
    console.log('�️ View URL found:', viewUrl);
    console.log('🔗 URL sources check:', {
      viewURL: file.viewURL,
      downloadURL: file.downloadURL,
      fileUrl: file.fileUrl, 
      url: file.url,
      link: file.link,
      href: file.href
    });
    
    if (viewUrl) {
      console.log('✅ Opening file for viewing in new tab:', viewUrl);
      window.open(viewUrl, '_blank');
    } else {
      console.error('❌ No URL found for file viewing');
      alert('رابط عرض الملف غير متوفر - تحقق من وحدة التحكم للتفاصيل');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">جاري تحميل الملفات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-red-600 dark:text-red-400 mb-4 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 bg-gray-600 dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          ← العودة
        </button>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl">📁</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            ملفات {decodedSubjectName}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            الفئة: {categoryId}
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">إجمالي الملفات</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{statistics.totalFiles}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl">
              <span className="text-2xl">📁</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">إجمالي التحميلات</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{statistics.totalDownloads}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-xl">
              <span className="text-2xl">📥</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">الحجم الإجمالي</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{formatFileSize(statistics.totalSize)}</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-xl">
              <span className="text-2xl">💾</span>
            </div>
          </div>
        </div>
      </div>

      {/* File Type Filter */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">فلترة حسب نوع الملف</h3>
        <div className="flex flex-wrap gap-3">
          {fileTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedFileType(type.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                selectedFileType === type.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
            >
              <span className="text-lg">{type.icon}</span>
              <span className="font-medium">{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Files Grid */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            لا توجد ملفات متاحة حالياً
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            لم يتم العثور على ملفات في هذا القسم أو قد تحتاج إلى تسجيل الدخول لمشاهدة المحتوى.
          </p>
          {selectedFileType !== 'all' && (
            <button
              onClick={() => setSelectedFileType('all')}
              className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              عرض جميع الملفات
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map((file, index) => (
            <div
              key={file.id || file.$id || index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group aspect-square flex flex-col"
            >
              {/* File Icon/Preview */}
              <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-700 dark:to-gray-600 rounded-xl mb-4 flex items-center justify-center flex-shrink-0">
                {(file.mimeType || file.type)?.includes('image') ? (
                  <img 
                    src={file.viewURL || file.downloadURL || file.fileUrl || file.url || '/placeholder-image.svg'} 
                    alt={file.fileName || file.name} 
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (file.mimeType || file.type)?.includes('pdf') ? (
                  <span className="text-4xl">📄</span>
                ) : (file.mimeType || file.type)?.includes('video') ? (
                  <span className="text-4xl">🎥</span>
                ) : (file.mimeType || file.type)?.includes('audio') ? (
                  <span className="text-4xl">🎵</span>
                ) : file.fileTypeId === 'slides' ? (
                  <span className="text-4xl">📊</span>
                ) : file.fileTypeId === 'lectures' ? (
                  <span className="text-4xl">🎓</span>
                ) : file.fileTypeId === 'books' ? (
                  <span className="text-4xl">📚</span>
                ) : file.fileTypeId === 'sheets' ? (
                  <span className="text-4xl">📋</span>
                ) : file.fileTypeId === 'exams' ? (
                  <span className="text-4xl">📝</span>
                ) : file.fileTypeId === 'projects' ? (
                  <span className="text-4xl">💼</span>
                ) : file.fileTypeId === 'notes' ? (
                  <span className="text-4xl">📔</span>
                ) : (
                  <span className="text-4xl">📎</span>
                )}
                <div className="hidden w-full h-full items-center justify-center">
                  <span className="text-4xl">📎</span>
                </div>
              </div>

              {/* File Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 dark:text-white text-lg leading-tight line-clamp-2">
                    {file.title || file.name || file.fileName || 'ملف بدون اسم'}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>الحجم:</span>
                      <span>{formatFileSize(file.size || file.fileSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>النوع:</span>
                      <span className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-xs">
                        {file.fileTypeId === 'slides' ? 'سلايدات' :
                         file.fileTypeId === 'lectures' ? 'محاضرات' :
                         file.fileTypeId === 'books' ? 'كتب' :
                         file.fileTypeId === 'sheets' ? 'شيتات' :
                         file.fileTypeId === 'exams' ? 'امتحانات' :
                         file.fileTypeId === 'projects' ? 'مشاريع' :
                         file.fileTypeId === 'videos' ? 'فيديوهات' :
                         file.fileTypeId === 'notes' ? 'ملاحظات' :
                         file.fileTypeId || file.mimeType?.split('/')[1] || 'غير محدد'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>التاريخ:</span>
                      <span>{formatDate(file.$createdAt || file.uploadedAt || file.uploadDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>المادة:</span>
                      <span className="text-xs">{file.subject || file.category || 'غير محدد'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>التحميلات:</span>
                      <span className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded text-xs font-medium">
                        {file.downloads || 0} مرة
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => handleView(file)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition-colors duration-300 font-medium text-sm"
                  >
                    عرض
                  </button>
                  <button
                    onClick={() => handleDownload(file)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl transition-colors duration-300 font-medium text-sm"
                  >
                    تحميل
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default FilesPage;