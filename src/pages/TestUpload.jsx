import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import StorageService from '../services/storageService';

const TestUploadSystem = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const testUpload = async () => {
    if (!isAuthenticated) {
      setResult('❌ يرجى تسجيل الدخول أولاً');
      return;
    }

    setLoading(true);
    setResult('جاري الاختبار...');

    try {
      // إنشاء ملف اختبار
      const testContent = 'هذا ملف اختبار من نظام Fyleo';
      const testFile = new File([testContent], 'test-file.txt', { type: 'text/plain' });

      // رفع الملف
      const uploadResult = await StorageService.uploadFile(testFile);
      
      setResult(`✅ نجح! تم رفع الملف بـ ID: ${uploadResult.id}`);
    } catch (error) {
      setResult(`❌ فشل: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-4">🧪 اختبار رفع الملفات</h1>
          
          <div className="text-center mb-6">
            <p>المستخدم: {user?.email || 'غير مسجل دخول'}</p>
            <p>الحالة: {isAuthenticated ? '✅ مسجل دخول' : '❌ غير مسجل'}</p>
          </div>

          <div className="text-center mb-6">
            <button
              onClick={testUpload}
              disabled={loading || !isAuthenticated}
              className={`px-6 py-3 rounded-lg font-semibold ${
                loading || !isAuthenticated
                  ? 'bg-gray-300 text-gray-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? '🔄 جاري الاختبار...' : '📤 اختبار رفع ملف'}
            </button>
          </div>

          {result && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-bold mb-2">النتيجة:</h3>
              <p className="text-sm">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestUploadSystem;
