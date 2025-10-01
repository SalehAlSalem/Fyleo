import React, { useState, useEffect } from 'react';
import { DatabaseService } from '../config/DatabaseService.js';
import { CategoryService } from '../config/CategoryService.js';

const DebugFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        console.log('🔍 Fetching all files from database...');
        const response = await DatabaseService.getAllFiles();
        const allFiles = response.documents || [];
        
        console.log('📊 All files from database:', allFiles);
        console.log('📊 Sample file structure:', allFiles[0]);
        
        setFiles(allFiles);
      } catch (error) {
        console.error('❌ Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الملفات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">🔍 فحص بيانات الملفات المرفوعة</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">📊 إحصائيات عامة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{files.length}</div>
              <div className="text-sm text-gray-600">إجمالي الملفات</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {files.filter(f => f.approved).length}
              </div>
              <div className="text-sm text-gray-600">ملفات معتمدة</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {files.filter(f => !f.approved).length}
              </div>
              <div className="text-sm text-gray-600">في الانتظار</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">🗂️ تجميع حسب التصنيف</h2>
          <div className="space-y-2">
            {Object.entries(
              files.reduce((acc, file) => {
                const category = file.category || 'غير محدد';
                acc[category] = (acc[category] || 0) + 1;
                return acc;
              }, {})
            ).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium">{category}</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">📋 تفاصيل جميع الملفات</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-right">العنوان</th>
                  <th className="px-4 py-2 text-right">التصنيف</th>
                  <th className="px-4 py-2 text-right">categoryId</th>
                  <th className="px-4 py-2 text-right">المادة</th>
                  <th className="px-4 py-2 text-right">subjectId</th>
                  <th className="px-4 py-2 text-right">نوع الملف</th>
                  <th className="px-4 py-2 text-right">fileTypeId</th>
                  <th className="px-4 py-2 text-right">معتمد</th>
                  <th className="px-4 py-2 text-right">ID</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, index) => (
                  <tr key={file.id || index} className="border-b">
                    <td className="px-4 py-2 text-right">{file.title || file.name || 'بدون عنوان'}</td>
                    <td className="px-4 py-2 text-right">{file.category || 'غير محدد'}</td>
                    <td className="px-4 py-2 text-right">{file.categoryId || 'غير محدد'}</td>
                    <td className="px-4 py-2 text-right">{file.subject || 'غير محدد'}</td>
                    <td className="px-4 py-2 text-right">{file.subjectId || 'غير محدد'}</td>
                    <td className="px-4 py-2 text-right">{file.fileType || 'غير محدد'}</td>
                    <td className="px-4 py-2 text-right">{file.fileTypeId || 'غير محدد'}</td>
                    <td className="px-4 py-2 text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        file.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {file.approved ? '✅' : '⏳'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right text-xs text-gray-500">
                      {file.id?.substring(0, 8)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugFiles;