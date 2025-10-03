// 🧪 اختبار الخدمة الهجينة MinIO + Appwrite
// تشغيل هذا الملف للتأكد من عمل النظام

import minioStorage from '../src/config/MinioService.js';
import hybridStorage from '../src/config/HybridStorageService.js';

async function testMinIOConnection() {
    console.log('🔍 اختبار اتصال MinIO...');
    
    try {
        // اختبار اتصال MinIO
        const connectionTest = await minioStorage.testConnection();
        console.log('✅ نتيجة اختبار MinIO:', connectionTest);
        
        // الحصول على إحصائيات التخزين
        const stats = await minioStorage.getStorageStats();
        console.log('📊 إحصائيات MinIO:', stats);
        
        // اختبار الخدمة الهجينة
        const hybridTest = await hybridStorage.testConnection();
        console.log('✅ نتيجة اختبار الخدمة الهجينة:', hybridTest);
        
        console.log('\n🎉 جميع الاختبارات نجحت!');
        console.log('📋 المطلوب للتشغيل الكامل:');
        console.log('1. تعديل Access Key و Secret Key في ملف .env');
        console.log('2. التأكد من تشغيل خادم MinIO على 79.76.119.182:9000');
        console.log('3. وجود bucket باسم "appwrite-storage"');
        
    } catch (error) {
        console.error('❌ فشل الاختبار:', error);
        console.log('\n🔧 حلول المشاكل المحتملة:');
        console.log('1. تحقق من صحة Access Key و Secret Key');
        console.log('2. تأكد من وصول الشبكة إلى خادم MinIO');
        console.log('3. تحقق من إعدادات CORS في MinIO');
        console.log('4. تأكد من وجود bucket "appwrite-storage"');
    }
}

// تشغيل الاختبار
testMinIOConnection();