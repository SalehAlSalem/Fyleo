import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../Firebase/ClientApp.js';
import { uploadFileHybrid } from '../../HybridStorage/index.mjs';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const TestUploadSystem = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [systemStatus, setSystemStatus] = useState({});

  // فحص حالة النظام
  const checkSystemStatus = () => {
    const status = {
      firebase: !!auth && !!db,
      github: !!import.meta.env.VITE_GITHUB_TOKEN,
      supabase: !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY),
      user: !!auth?.currentUser
    };
    setSystemStatus(status);
    return status;
  };

  // إنشاء ملف اختبار
  const createTestFile = (name, sizeKB = 10) => {
    const content = 'A'.repeat(sizeKB * 1024);
    return new File([content], name, { type: 'text/plain' });
  };

  // اختبار رفع ملف صغير (GitHub)
  const testSmallFileUpload = async () => {
    const testFile = createTestFile('test_small_file.txt', 5); // 5KB
    
    try {
      const result = await uploadFileHybrid(testFile, {
        title: 'ملف اختبار صغير',
        description: 'اختبار النظام الهجين - ملف صغير',
        category: 'Programming',
        categorySlug: 'programming',
        uploadedBy: auth.currentUser.uid,
        uploaderEmail: auth.currentUser.email,
        uploaderName: auth.currentUser.displayName || 'مختبر النظام',
        approved: true,
        fileType: 'text/plain'
      }, (progress) => {
        console.log(`GitHub Progress: ${progress}%`);
      });

      return {
        success: true,
        fileId: result.id,
        provider: result.provider,
        url: result.downloadURL,
        message: `✅ تم رفع الملف الصغير بنجاح على ${result.storageProvider || result.provider}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `❌ فشل رفع الملف الصغير: ${error.message}`
      };
    }
  };

  // اختبار جلب الملفات من قاعدة البيانات
  const testFetchFiles = async () => {
    try {
      const filesRef = collection(db, 'files');
      const q = query(
        filesRef, 
        where('uploadedBy', '==', auth.currentUser.uid),
        orderBy('uploadedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const files = [];
      
      querySnapshot.forEach((doc) => {
        files.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setUploadedFiles(files);
      return {
        success: true,
        count: files.length,
        message: `✅ تم جلب ${files.length} ملف من قاعدة البيانات`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `❌ فشل جلب الملفات: ${error.message}`
      };
    }
  };

  // تشغيل جميع الاختبارات
  const runAllTests = async () => {
    if (!auth?.currentUser) {
      alert('يرجى تسجيل الدخول أولاً');
      return;
    }

    setIsRunning(true);
    setTestResults([]);
    
    const results = [];
    
    // 1. فحص حالة النظام
    results.push({
      test: 'فحص حالة النظام',
      ...checkSystemStatus(),
      message: 'تم فحص حالة جميع الخدمات'
    });

    // 2. اختبار رفع ملف صغير
    results.push({
      test: 'رفع ملف صغير (GitHub)',
      ...(await testSmallFileUpload())
    });

    // 3. اختبار جلب الملفات
    results.push({
      test: 'جلب الملفات من قاعدة البيانات',
      ...(await testFetchFiles())
    });

    setTestResults(results);
    setIsRunning(false);
  };

  useEffect(() => {
    checkSystemStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-center mb-4">🧪 اختبار النظام الهجين</h1>
          <p className="text-center text-gray-600 mb-6">جامعة البلقاء التطبيقية - Fyleo Testing Suite</p>
          
          {/* حالة النظام */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-lg text-center ${systemStatus.firebase ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div className="text-2xl mb-2">🔥</div>
              <div className="font-semibold">Firebase</div>
              <div className="text-sm">{systemStatus.firebase ? 'متصل' : 'غير متصل'}</div>
            </div>
            
            <div className={`p-4 rounded-lg text-center ${systemStatus.github ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div className="text-2xl mb-2">🐙</div>
              <div className="font-semibold">GitHub</div>
              <div className="text-sm">{systemStatus.github ? 'متاح' : 'غير متاح'}</div>
            </div>
            
            <div className={`p-4 rounded-lg text-center ${systemStatus.supabase ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold">Supabase</div>
              <div className="text-sm">{systemStatus.supabase ? 'متاح' : 'غير متاح'}</div>
            </div>
            
            <div className={`p-4 rounded-lg text-center ${systemStatus.user ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div className="text-2xl mb-2">👤</div>
              <div className="font-semibold">المستخدم</div>
              <div className="text-sm">{systemStatus.user ? 'مسجل دخول' : 'غير مسجل'}</div>
            </div>
          </div>

          {/* زر تشغيل الاختبارات */}
          <div className="text-center mb-6">
            <button
              onClick={runAllTests}
              disabled={isRunning || !systemStatus.user}
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
                isRunning 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : systemStatus.user
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-red-400 cursor-not-allowed'
              }`}
            >
              {isRunning ? '🔄 جاري تشغيل الاختبارات...' : '🚀 تشغيل جميع الاختبارات'}
            </button>
          </div>

          {/* نتائج الاختبارات */}
          {testResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">📊 نتائج الاختبارات:</h2>
              {testResults.map((result, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">{result.test}</div>
                    <div className={`px-3 py-1 rounded text-sm ${
                      result.success ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}>
                      {result.success ? '✅ نجح' : '❌ فشل'}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">{result.message}</div>
                  {result.fileId && (
                    <div className="mt-2 text-xs text-blue-600">File ID: {result.fileId}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* الملفات المرفوعة */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">📁 الملفات المرفوعة ({uploadedFiles.length}):</h2>
              <div className="grid gap-4">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{file.name || file.title}</div>
                        <div className="text-sm text-gray-600">{file.category} • {file.provider}</div>
                        <div className="text-xs text-gray-500">
                          {file.uploadedAt?.toDate?.()?.toLocaleString('ar-SA') || 'تاريخ غير محدد'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">ID: {file.id}</div>
                        {file.downloadURL && (
                          <a 
                            href={file.downloadURL} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 text-xs hover:underline"
                          >
                            🔗 فتح الملف
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestUploadSystem;