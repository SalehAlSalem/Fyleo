import React, { useState } from 'react';
import { DatabaseService } from '../config/DatabaseService';
import { storage, STORAGE_BUCKET_ID } from '../config/appwrite';
import { ID } from 'appwrite';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const QuickUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const { user } = useAuth();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadResult(null);
  };

  const handleUpload = async () => {
    if (!file || !user) {
      alert('يرجى تسجيل الدخول واختيار ملف');
      return;
    }

    setUploading(true);
    try {
      console.log('🚀 Starting file upload...');
      
      // أولاً: رفع الملف إلى Appwrite Storage
      console.log('📤 Uploading to storage...');
      const fileDoc = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        file
      );
      console.log('📁 File uploaded to storage:', fileDoc);

      // ثانياً: إنشاء مستند في materials collection
      const materialData = {
        title: file.name.split('.')[0],
        fileName: file.name,
        fileId: fileDoc.$id,
        downloadURL: `https://cloud.appwrite.io/v1/storage/buckets/${STORAGE_BUCKET_ID}/files/${fileDoc.$id}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`,
        fileSize: file.size,
        fileType: file.type || 'application/octet-stream',
        uploaderId: user.$id,
        uploaderName: user.name || user.email,
        uploadedBy: user.name || user.email, // الـ attribute المطلوب الجديد
        category: 'computer-science-programming', // الـ attribute المطلوب
        categoryId: 'computer-science-programming',
        subject: 'test', // إضافة subject أيضاً
        subjectId: 'test',
        description: 'ملف تجريبي للاختبار'
      };

      console.log('📝 Creating material document...');
      const material = await DatabaseService.createMaterial(materialData);
      console.log('✅ Material created:', material);

      setUploadResult({
        success: true,
        material: material,
        downloadURL: materialData.downloadURL
      });

      alert('✅ تم رفع الملف بنجاح! يمكنك الآن اختبار التحميل.');
    } catch (error) {
      console.error('❌ Upload error:', error);
      setUploadResult({
        success: false,
        error: error.message
      });
      alert('❌ خطأ في رفع الملف: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            يجب تسجيل الدخول لرفع الملفات
          </p>
          <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
          📤 رفع ملف سريع للاختبار
        </h1>
        
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                اختر ملف للرفع
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {file && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>📁 اسم الملف: {file.name}</p>
                <p>📊 الحجم: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {uploading ? '⏳ جاري الرفع...' : '📤 رفع الملف'}
            </button>

            {uploadResult && (
              <div className={`p-4 rounded-lg ${uploadResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {uploadResult.success ? (
                  <div>
                    <p className="font-bold">✅ تم رفع الملف بنجاح!</p>
                    <p className="text-sm mt-1">يمكنك الآن اختبار التحميل</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold">❌ خطأ في الرفع</p>
                    <p className="text-sm mt-1">{uploadResult.error}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex gap-2">
              <Link
                to="/test-download"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-center transition-colors"
              >
                🧪 اختبار التحميل
              </Link>
              <Link
                to="/dashboard"
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-center transition-colors"
              >
                📊 لوحة التحكم
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickUpload;