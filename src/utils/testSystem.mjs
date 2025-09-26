import { uploadFileHybrid } from '../../../HybridStorage/index.mjs';

// 🧪 اختبار النظام الهجين - Hybrid Storage Test
export const testHybridStorage = async () => {
  console.log('🚀 بدء اختبار النظام الهجين...');
  
  // إنشاء ملف تجريبي صغير (GitHub)
  const smallFile = new File(['هذا ملف اختبار صغير للتأكد من عمل GitHub Storage'], 'test-small.txt', {
    type: 'text/plain'
  });
  
  // إنشاء ملف تجريبي كبير (Supabase)
  const largeContent = 'A'.repeat(30 * 1024 * 1024); // 30MB
  const largeFile = new File([largeContent], 'test-large.txt', {
    type: 'text/plain'
  });
  
  try {
    console.log('📁 اختبار رفع الملف الصغير على GitHub...');
    const smallResult = await uploadFileHybrid(
      smallFile,
      'test-files',
      (progress) => console.log(`GitHub Progress: ${progress}%`),
      'test-user-123'
    );
    console.log('✅ نجح رفع الملف الصغير:', smallResult);
    
    console.log('📁 اختبار رفع الملف الكبير على Supabase...');
    const largeResult = await uploadFileHybrid(
      largeFile,
      'test-files',
      (progress) => console.log(`Supabase Progress: ${progress}%`),
      'test-user-123'
    );
    console.log('✅ نجح رفع الملف الكبير:', largeResult);
    
    return {
      success: true,
      github: smallResult,
      supabase: largeResult
    };
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 🔍 اختبار حالة الاتصال
export const testConnections = async () => {
  const results = {
    firebase: false,
    github: false,
    supabase: false
  };
  
  // اختبار Firebase
  try {
    const { auth } = await import('../../../Firebase/ClientApp.js');
    results.firebase = !!auth;
    console.log('🔥 Firebase:', results.firebase ? '✅ متصل' : '❌ غير متصل');
  } catch (error) {
    console.error('❌ خطأ Firebase:', error.message);
  }
  
  // اختبار GitHub
  try {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    const owner = import.meta.env.VITE_GITHUB_OWNER;
    const repo = import.meta.env.VITE_GITHUB_REPO;
    
    if (token && owner && repo) {
      results.github = true;
      console.log('🐙 GitHub:', '✅ مُعد بشكل صحيح');
    } else {
      console.log('🐙 GitHub:', '❌ إعدادات ناقصة');
    }
  } catch (error) {
    console.error('❌ خطأ GitHub:', error.message);
  }
  
  // اختبار Supabase
  try {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (url && key) {
      results.supabase = true;
      console.log('⚡ Supabase:', '✅ مُعد بشكل صحيح');
    } else {
      console.log('⚡ Supabase:', '❌ إعدادات ناقصة');
    }
  } catch (error) {
    console.error('❌ خطأ Supabase:', error.message);
  }
  
  return results;
};

// 📊 عرض معلومات النظام
export const showSystemInfo = () => {
  console.log('📊 معلومات النظام:');
  console.log('==================');
  console.log('🎯 المشروع: Fyleo v2.0.0');
  console.log('🏫 الجامعة: جامعة البلقاء التطبيقية');
  console.log('🌐 النظام: هجين (GitHub + Supabase)');
  console.log('🔥 Firebase: المصادقة والبيانات فقط');
  console.log('📁 GitHub: ملفات < 25MB (مجاني)');
  console.log('📁 Supabase: ملفات 25-100MB (1GB شهرياً)');
  console.log('==================');
};

// تشغيل الاختبارات تلقائياً في وضع التطوير
if (import.meta.env.DEV) {
  setTimeout(() => {
    showSystemInfo();
    testConnections();
  }, 2000);
}