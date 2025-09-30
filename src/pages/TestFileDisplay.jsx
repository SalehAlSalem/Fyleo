import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { DatabaseService } from '../config/DatabaseService.js';
import { NavBar } from '../components';

const TestFileDisplay = () => {
  const [filesByCategory, setFilesByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { slug: 'programming', name: 'البرمجة', domain: 'Programming' },
    { slug: 'data-structures', name: 'هياكل البيانات', domain: 'Data Structures' },
    { slug: 'web-development', name: 'تطوير الويب', domain: 'Web Development' },
    { slug: 'algorithms', name: 'الخوارزميات', domain: 'Algorithms' },
    { slug: 'databases', name: 'قواعد البيانات', domain: 'Databases' }
  ];

  // جلب جميع الملفات
  const fetchAllFiles = async () => {
    setLoading(true);
    try {
      const allFiles = await DatabaseService.getAllFiles();

      // تجميع الملفات حسب الفئة
      const grouped = {};
      categories.forEach(cat => {
        grouped[cat.slug] = allFiles.filter(file => 
          file.categorySlug === cat.slug || 
          file.category === cat.domain
        );
      });

      // إضافة فئة "الكل"
      grouped.all = allFiles;

      setFilesByCategory(grouped);
      console.log('📊 إحصائيات الملفات:', {
        total: allFiles.length,
        byCategory: Object.entries(grouped).map(([key, files]) => ({
          category: key,
          count: files.length
        }))
      });

    } catch (error) {
      console.error('❌ خطأ في جلب الملفات:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { user } = useAuth();
    if (user) {
      fetchAllFiles();
    }
  }, []);

  const renderFileCard = (file) => (
    <div key={file.id} className="bg-white rounded-lg shadow-md p-4 border">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-gray-900 truncate">
          {file.name || file.title || 'ملف بدون عنوان'}
        </h3>
        <div className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
          {file.provider === 'github' ? '🐙 GitHub' : 
           file.provider === 'supabase' ? '⚡ Supabase' : 
           '🔥 Firebase'}
        </div>
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        📁 {file.category || 'بدون فئة'} • 
        {file.size ? ` ${(file.size / 1024 / 1024).toFixed(2)}MB` : ' حجم غير محدد'}
      </div>
      
      <div className="text-xs text-gray-500 mb-3">
        👤 {file.uploaderName || 'مجهول'} • 
        📅 {file.uploadedAt?.toDate?.()?.toLocaleDateString('ar-SA') || 'تاريخ غير محدد'}
      </div>
      
      {file.description && (
        <p className="text-sm text-gray-700 mb-3">{file.description}</p>
      )}
      
      <div className="flex gap-2">
        {file.downloadURL && (
          <a
            href={file.downloadURL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
          >
            🔗 فتح الملف
          </a>
        )}
        
        <div className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded">
          ID: {file.id.substring(0, 8)}...
        </div>
        
        <div className={`px-3 py-1 text-xs rounded ${
          file.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {file.approved ? '✅ معتمد' : '⏳ في الانتظار'}
        </div>
      </div>
    </div>
  );

  const currentFiles = filesByCategory[selectedCategory] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-center mb-4">📂 اختبار عرض الملفات</h1>
          <p className="text-center text-gray-600 mb-6">
            فحص ظهور الملفات المرفوعة في جميع الفئات
          </p>

          {/* أزرار الفئات */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📋 الكل ({filesByCategory.all?.length || 0})
            </button>
            
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat.slug
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat.name} ({filesByCategory[cat.slug]?.length || 0})
              </button>
            ))}
          </div>

          {/* زر تحديث */}
          <div className="text-center mb-6">
            <button
              onClick={fetchAllFiles}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                loading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {loading ? '🔄 جاري التحديث...' : '🔄 تحديث الملفات'}
            </button>
          </div>

          {/* عرض الملفات */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">جاري تحميل الملفات...</p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold mb-4">
                📁 {selectedCategory === 'all' ? 'جميع الملفات' : 
                     categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                <span className="text-gray-500 font-normal"> ({currentFiles.length})</span>
              </h2>
              
              {currentFiles.length === 0 ? (
                <div className="text-center py-12 bg-gray-100 rounded-lg">
                  <div className="text-4xl mb-4">📂</div>
                  <p className="text-gray-600">لا توجد ملفات في هذه الفئة</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentFiles.map(renderFileCard)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestFileDisplay;