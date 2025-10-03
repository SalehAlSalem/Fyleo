// 🔍 فحص متغيرات البيئة في المتصفح
// استخدم هذا الكود في console المتصفح للتحقق من المتغيرات

console.log('🚀 فحص متغيرات البيئة - Fyleo MinIO Integration');
console.log('================================================');

// المتغيرات المطلوبة
const requiredVars = {
  // Appwrite (قاعدة البيانات والمصادقة)
  'VITE_APPWRITE_URL': import.meta.env.VITE_APPWRITE_URL,
  'VITE_APPWRITE_PROJECT_ID': import.meta.env.VITE_APPWRITE_PROJECT_ID,
  'VITE_APPWRITE_DATABASE_ID': import.meta.env.VITE_APPWRITE_DATABASE_ID,
  
  // MinIO (التخزين الرئيسي)
  'VITE_MINIO_ENDPOINT': import.meta.env.VITE_MINIO_ENDPOINT,
  'VITE_MINIO_PORT': import.meta.env.VITE_MINIO_PORT,
  'VITE_MINIO_BUCKET_NAME': import.meta.env.VITE_MINIO_BUCKET_NAME,
  
  // Collections
  'VITE_APPWRITE_FILES_COLLECTION_ID': import.meta.env.VITE_APPWRITE_FILES_COLLECTION_ID,
  'VITE_APPWRITE_USERS_COLLECTION_ID': import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
};

// المتغيرات الاختيارية
const optionalVars = {
  'VITE_APP_NAME': import.meta.env.VITE_APP_NAME,
  'VITE_APP_VERSION': import.meta.env.VITE_APP_VERSION,
  'VITE_MAX_FILE_SIZE': import.meta.env.VITE_MAX_FILE_SIZE,
  'VITE_ALLOWED_FILE_TYPES': import.meta.env.VITE_ALLOWED_FILE_TYPES,
  'VITE_DEFAULT_LANGUAGE': import.meta.env.VITE_DEFAULT_LANGUAGE,
  'VITE_ENABLE_DARK_MODE': import.meta.env.VITE_ENABLE_DARK_MODE,
};

let missingCount = 0;
let optionalMissing = 0;

console.log('\n📋 المتغيرات المطلوبة:');
console.log('-------------------');

Object.entries(requiredVars).forEach(([key, value]) => {
  if (!value) {
    console.log(`❌ مفقود: ${key}`);
    missingCount++;
  } else {
    // إخفاء القيم الحساسة
    const displayValue = key.includes('KEY') || key.includes('SECRET') ? '****' : value;
    console.log(`✅ موجود: ${key} = ${displayValue}`);
  }
});

console.log('\n📋 المتغيرات الاختيارية:');
console.log('---------------------');

Object.entries(optionalVars).forEach(([key, value]) => {
  if (!value) {
    console.log(`⚠️ اختياري مفقود: ${key}`);
    optionalMissing++;
  } else {
    console.log(`✅ موجود: ${key} = ${value}`);
  }
});

console.log('\n📊 ملخص النتائج:');
console.log('===============');

if (missingCount === 0) {
  console.log('🎉 جميع المتغيرات المطلوبة موجودة!');
  console.log('✅ النظام جاهز للعمل');
} else {
  console.log(`❌ ${missingCount} متغير مطلوب مفقود`);
  console.log('⚠️ يجب إضافة المتغيرات المفقودة');
}

if (optionalMissing > 0) {
  console.log(`⚠️ ${optionalMissing} متغير اختياري مفقود (لا يؤثر على العمل)`);
}

// اختبار الاتصال
console.log('\n🔗 روابط مهمة:');
console.log('=============');
console.log(`MinIO Console: http://${import.meta.env.VITE_MINIO_ENDPOINT || '79.76.119.182'}:9001`);
console.log(`Appwrite Console: ${import.meta.env.VITE_APPWRITE_URL || 'https://fra.cloud.appwrite.io/v1'}`);

// اختبار سريع للخدمات
console.log('\n🧪 اختبار سريع للخدمات:');
console.log('========================');

// اختبار MinIO
if (import.meta.env.VITE_MINIO_ENDPOINT) {
  const minioUrl = `http://${import.meta.env.VITE_MINIO_ENDPOINT}:${import.meta.env.VITE_MINIO_PORT || 9000}`;
  console.log(`MinIO: محاولة الاتصال بـ ${minioUrl}`);
  
  fetch(minioUrl, { method: 'HEAD', mode: 'no-cors' })
    .then(() => console.log('✅ MinIO: يبدو أن الخادم يعمل'))
    .catch(() => console.log('❌ MinIO: خطأ في الاتصال'));
}

// اختبار Appwrite
if (import.meta.env.VITE_APPWRITE_URL) {
  console.log(`Appwrite: محاولة الاتصال بـ ${import.meta.env.VITE_APPWRITE_URL}`);
  
  fetch(`${import.meta.env.VITE_APPWRITE_URL}/health`, { method: 'GET' })
    .then(response => {
      if (response.ok) {
        console.log('✅ Appwrite: الخدمة تعمل بشكل صحيح');
      } else {
        console.log('⚠️ Appwrite: استجابة غير متوقعة');
      }
    })
    .catch(() => console.log('❌ Appwrite: خطأ في الاتصال'));
}

console.log('\n💡 نصائح:');
console.log('========');
console.log('1. إذا كانت المتغيرات موجودة لكن النظام لا يعمل، تحقق من الشبكة');
console.log('2. تأكد من أن خادم MinIO (79.76.119.182) يعمل ويقبل الاتصالات');
console.log('3. راجع console للأخطاء الأخرى');
console.log('4. استخدم F12 → Network لمراقبة طلبات الشبكة');

export default function checkEnvironment() {
  return {
    requiredVars,
    optionalVars,
    missingCount,
    optionalMissing,
    isReady: missingCount === 0
  };
}