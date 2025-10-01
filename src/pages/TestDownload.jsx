import React, { useState, useEffect } from 'react';
import { DatabaseService } from '../config/DatabaseService';
import { useAuth } from '../hooks/useAuth';

const TestDownload = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadFiles = async () => {
      console.log('🔍 Loading files for test...');
      try {
        // استخدام Collection ID المباشر
        const response = await DatabaseService.listDocuments('68d9a9df0011be68c03f');
        console.log('📁 Files response:', response);
        console.log('📁 Files count:', response.documents?.length || 0);
        
        if (response.documents && response.documents.length > 0) {
          setFiles(response.documents.slice(0, 3)); // أول 3 ملفات فقط للاختبار
          console.log('✅ Files loaded for test:', response.documents.slice(0, 3));
        } else {
          console.log('⚠️ No files found in materials collection');
        }
        setLoading(false);
      } catch (error) {
        console.error('❌ Error loading files:', error);
        setLoading(false);
      }
    };

    loadFiles();
  }, []);

  const handleDownload = async (file) => {
    console.log('🔍 Testing download with file:', file);
    
    try {
      // تسجيل التحميل
      if (user) {
        await DatabaseService.createDownload({
          userId: user.$id,
          fileId: file.$id
        });
        console.log('✅ Download recorded');
      }
      
      // تحميل مباشر
      const link = document.createElement('a');
      link.href = file.downloadURL;
      link.download = file.fileName || 'file';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('✅ Download attempted');
    } catch (error) {
      console.error('❌ Download error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">جاري تحميل الملفات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
          🧪 اختبار التحميل
        </h1>
        
        <div className="max-w-2xl mx-auto space-y-4">
          {files.map((file) => (
            <div key={file.$id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {file.title || file.fileName}
              </h3>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                <p>📁 {file.fileName}</p>
                <p>🔗 {file.downloadURL ? 'رابط متوفر' : 'لا يوجد رابط'}</p>
              </div>
              
              <div className="space-y-2">
                {/* زر التحميل العادي */}
                <button
                  onClick={() => handleDownload(file)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  📥 تحميل عادي (JavaScript)
                </button>
                
                {/* زر التحميل المباشر */}
                <a
                  href={file.downloadURL}
                  download={file.fileName || 'file'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-center no-underline font-bold border-2 border-orange-400"
                  onClick={(e) => {
                    console.log('🔗 Direct download clicked');
                    if (user) {
                      DatabaseService.createDownload({
                        userId: user.$id,
                        fileId: file.$id
                      }).catch(err => console.error('Error recording:', err));
                    }
                  }}
                >
                  🔗 تحميل مباشر (HTML LINK)
                </a>
                
                {/* رابط مباشر فقط */}
                <a
                  href={file.downloadURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-center no-underline"
                >
                  🌐 فتح الرابط في تبويب جديد
                </a>
              </div>
            </div>
          ))}
        </div>
        
        {files.length === 0 && (
          <div className="text-center">
            <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 px-6 py-4 rounded-lg inline-block">
              <p className="text-lg font-bold mb-2">⚠️ لا توجد ملفات للاختبار</p>
              <p className="text-sm">تحتاج إلى رفع ملفات أولاً لاختبار التحميل</p>
              <div className="mt-4 space-y-2 text-xs">
                <p>💡 اذهب إلى لوحة التحكم → رفع ملف</p>
                <p>📂 أو اذهب إلى صفحة المواد ورفع ملف هناك</p>
                <p>🔄 ثم عد لهذه الصفحة لاختبار التحميل</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestDownload;