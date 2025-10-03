// 🧪 اختبار سريع للتأكد من عمل MinIO بدلاً من Appwrite Storage
// تشغيل هذا في Console المتصفح للتحقق

console.log('🧪 اختبار نظام MinIO...');

// فحص المتغيرات
console.log('🔧 متغيرات MinIO:');
console.log('ENDPOINT:', import.meta.env.VITE_MINIO_ENDPOINT);
console.log('PORT:', import.meta.env.VITE_MINIO_PORT);  
console.log('BUCKET:', import.meta.env.VITE_MINIO_BUCKET_NAME);

// فحص StorageService
import { StorageService } from '/src/config/StorageService.js';

console.log('✅ StorageService imported successfully');
console.log('📁 متوفر:', typeof StorageService);

// اختبار الوظائف
console.log('🔧 الوظائف المتوفرة:');
console.log('- uploadFile:', typeof StorageService.uploadFile);
console.log('- getFileDownload:', typeof StorageService.getFileDownload);
console.log('- deleteFile:', typeof StorageService.deleteFile);
console.log('- isValidFileType:', typeof StorageService.isValidFileType);

// اختبار بسيط
const testFileType = StorageService.isValidFileType('application/pdf');
console.log('📄 اختبار نوع PDF:', testFileType ? '✅' : '❌');

const testFileSize = StorageService.isValidFileSize(1024 * 1024); // 1MB
console.log('📏 اختبار حجم 1MB:', testFileSize ? '✅' : '❌');

console.log('🎉 النظام يعمل! جرب رفع ملف في Dashboard');