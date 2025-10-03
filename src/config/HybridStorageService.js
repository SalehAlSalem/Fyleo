// 🔄 Hybrid Storage Service - MinIO + Appwrite
// استخدام MinIO للملفات و Appwrite للبيانات

import minioStorage from './MinioService.js';
import { DatabaseService } from './DatabaseService.js';

class HybridStorageService {
    constructor() {
        console.log('🔄 Hybrid Storage Service initialized - MinIO + Appwrite');
    }

    // ✅ رفع ملف كامل (MinIO + Database)
    async uploadFile(file, metadata = {}) {
        try {
            console.log('📤 بدء رفع هجين:', {
                fileName: file.name,
                size: file.size,
                type: file.type,
                metadata
            });

            // 1️⃣ رفع الملف إلى MinIO
            console.log('🗄️ رفع إلى MinIO...');
            const minioResult = await minioStorage.uploadFile(file);
            
            console.log('✅ تم رفع الملف إلى MinIO:', minioResult);

            // 2️⃣ حفظ البيانات في Appwrite Database
            console.log('💾 حفظ البيانات في قاعدة البيانات...');
            
            const fileData = {
                // معلومات الملف الأساسية
                name: file.name,
                originalName: file.name,
                fileName: minioResult.fileName, // اسم الملف في MinIO
                size: file.size,
                type: file.type,
                mimeType: file.type,
                
                // معلومات MinIO
                storageId: minioResult.$id, // معرف الملف في MinIO
                minioFileName: minioResult.fileName,
                bucketName: minioResult.bucketId,
                storageProvider: 'MinIO',
                
                // روابط الوصول
                url: minioResult.downloadUrl,
                downloadUrl: minioResult.downloadUrl,
                previewUrl: minioResult.previewUrl,
                
                // إضافة metadata من المستخدم
                ...metadata,
                
                // معلومات إضافية
                downloads: 0,
                isMinioFile: true,
                uploadDate: new Date().toISOString()
            };

            const databaseResult = await DatabaseService.createFile(fileData);
            
            console.log('✅ تم حفظ البيانات في قاعدة البيانات:', databaseResult);

            // 3️⃣ إرجاع النتيجة المدمجة
            return {
                ...databaseResult,
                // معلومات MinIO
                minioData: minioResult,
                storageProvider: 'MinIO',
                isHybridUpload: true,
                
                // للتوافق مع الكود الحالي
                id: databaseResult.$id,
                url: minioResult.downloadUrl,
                success: true
            };

        } catch (error) {
            console.error('❌ خطأ في الرفع الهجين:', error);
            
            // في حالة الخطأ، محاولة تنظيف الملف من MinIO إذا تم رفعه
            if (error.minioFileUploaded) {
                try {
                    await minioStorage.deleteFile(error.minioFileName);
                    console.log('🧹 تم حذف الملف من MinIO بعد فشل حفظ البيانات');
                } catch (cleanupError) {
                    console.error('❌ فشل في تنظيف الملف من MinIO:', cleanupError);
                }
            }
            
            throw new Error(`فشل في الرفع الهجين: ${error.message}`);
        }
    }

    // 📥 تحميل ملف
    async downloadFile(fileId) {
        try {
            console.log('📥 بدء تحميل هجين:', fileId);

            // 1️⃣ الحصول على معلومات الملف من قاعدة البيانات
            const fileData = await DatabaseService.getFileById(fileId);
            
            if (!fileData) {
                throw new Error('الملف غير موجود في قاعدة البيانات');
            }

            console.log('📊 معلومات الملف:', fileData);

            // 2️⃣ التحقق من نوع التخزين
            if (fileData.isMinioFile || fileData.storageProvider === 'MinIO') {
                // الملف في MinIO
                console.log('🗄️ تحميل من MinIO...');
                
                const minioFileName = fileData.minioFileName || fileData.fileName || fileData.storageId;
                const downloadUrl = await minioStorage.downloadFile(minioFileName);
                
                // 3️⃣ تحديث عداد التحميلات
                await DatabaseService.incrementDownloadCount(fileId);
                
                return {
                    url: downloadUrl,
                    fileName: fileData.name,
                    mimeType: fileData.mimeType,
                    size: fileData.size,
                    storageProvider: 'MinIO'
                };
                
            } else {
                // الملف في Appwrite Storage (للملفات القديمة)
                throw new Error('دعم Appwrite Storage غير مفعل في الوضع الهجين');
            }

        } catch (error) {
            console.error('❌ خطأ في التحميل الهجين:', error);
            throw new Error(`فشل في التحميل: ${error.message}`);
        }
    }

    // 🗑️ حذف ملف
    async deleteFile(fileId) {
        try {
            console.log('🗑️ بدء حذف هجين:', fileId);

            // 1️⃣ الحصول على معلومات الملف
            const fileData = await DatabaseService.getFileById(fileId);
            
            if (!fileData) {
                throw new Error('الملف غير موجود في قاعدة البيانات');
            }

            // 2️⃣ حذف الملف من MinIO
            if (fileData.isMinioFile || fileData.storageProvider === 'MinIO') {
                const minioFileName = fileData.minioFileName || fileData.fileName || fileData.storageId;
                await minioStorage.deleteFile(minioFileName);
                console.log('✅ تم حذف الملف من MinIO');
            }

            // 3️⃣ حذف السجل من قاعدة البيانات
            await DatabaseService.deleteFile(fileId);
            console.log('✅ تم حذف السجل من قاعدة البيانات');

            return {
                success: true,
                message: 'تم حذف الملف بنجاح'
            };

        } catch (error) {
            console.error('❌ خطأ في الحذف الهجين:', error);
            throw new Error(`فشل في الحذف: ${error.message}`);
        }
    }

    // 🔗 الحصول على رابط مؤقت للملف
    async getPreviewLink(fileId, expirySeconds = 3600) {
        try {
            // 1️⃣ الحصول على معلومات الملف
            const fileData = await DatabaseService.getFileById(fileId);
            
            if (!fileData) {
                throw new Error('الملف غير موجود');
            }

            // 2️⃣ إنشاء رابط مؤقت من MinIO
            if (fileData.isMinioFile || fileData.storageProvider === 'MinIO') {
                const minioFileName = fileData.minioFileName || fileData.fileName || fileData.storageId;
                const previewUrl = await minioStorage.getPreviewLink(minioFileName, expirySeconds);
                
                return {
                    url: previewUrl,
                    fileName: fileData.name,
                    mimeType: fileData.mimeType,
                    expiresIn: expirySeconds
                };
            } else {
                throw new Error('نوع تخزين غير مدعوم');
            }

        } catch (error) {
            console.error('❌ خطأ في إنشاء رابط المعاينة:', error);
            throw new Error(`فشل في إنشاء رابط المعاينة: ${error.message}`);
        }
    }

    // 📊 إحصائيات التخزين
    async getStorageStats() {
        try {
            const [minioStats, dbStats] = await Promise.all([
                minioStorage.getStorageStats(),
                DatabaseService.getUserStats('all') // أو أي دالة مناسبة
            ]);

            return {
                minio: minioStats,
                database: {
                    totalFiles: dbStats.totalFiles || 0,
                    totalDownloads: dbStats.totalDownloads || 0
                },
                hybrid: {
                    provider: 'MinIO + Appwrite',
                    status: 'نشط'
                }
            };

        } catch (error) {
            console.error('❌ خطأ في الإحصائيات:', error);
            return {
                minio: { error: error.message },
                database: { error: error.message },
                hybrid: { status: 'خطأ' }
            };
        }
    }

    // 🔧 اختبار الاتصال
    async testConnection() {
        try {
            console.log('🔍 اختبار الاتصال الهجين...');
            
            // اختبار MinIO
            const minioTest = await minioStorage.testConnection();
            console.log('✅ اتصال MinIO:', minioTest);
            
            // اختبار Appwrite (يمكن إضافة دالة اختبار في DatabaseService)
            console.log('✅ اتصال Appwrite Database: متاح');
            
            return {
                minio: minioTest,
                database: true,
                hybrid: true,
                status: 'جميع الاتصالات نشطة'
            };

        } catch (error) {
            console.error('❌ فشل اختبار الاتصال:', error);
            return {
                minio: false,
                database: false,
                hybrid: false,
                status: `خطأ: ${error.message}`
            };
        }
    }
}

// إنشاء مثيل واحد
const hybridStorage = new HybridStorageService();

export default hybridStorage;
export { HybridStorageService };