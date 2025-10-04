// 🗄️ MinIO Storage Service - استبدال كامل لـ Appwrite Storage
// يحل محل Appwrite Storage بالكامل ويستخدم MinIO على VPS الخاص

class MinioStorageService {
    constructor() {
        this.endpoint = import.meta.env.VITE_MINIO_ENDPOINT;
        this.port = parseInt(import.meta.env.VITE_MINIO_PORT) || 9000;
        this.useSSL = import.meta.env.VITE_MINIO_USE_SSL === 'true';
        this.accessKey = import.meta.env.VITE_MINIO_ACCESS_KEY;
        this.secretKey = import.meta.env.VITE_MINIO_SECRET_KEY;
        this.bucketName = import.meta.env.VITE_MINIO_BUCKET_NAME || 'appwrite-storage';
        
        // بناء Base URL - استخدام متغيرات البيئة
        const protocol = this.useSSL ? 'https' : 'http';
        this.baseUrl = `${protocol}://minio97.chickenkiller.com:${this.port}`;
        this.bucketUrl = `${protocol}://minio97.chickenkiller.com:${this.port}/${this.bucketName}`;

        console.log('🗄️ MinIO Service initialized (Pure MinIO - No Appwrite Storage):', {
            endpoint: this.endpoint,
            port: this.port,
            bucket: this.bucketName,
            baseUrl: this.baseUrl
        });
    }

    // ✅ رفع ملف - متوافق مع Appwrite Storage API
    async uploadFile(file, options = {}) {
        try {
            console.log('📤 رفع ملف إلى MinIO:', {
                fileName: file.name,
                size: file.size,
                type: file.type
            });

            // إنشاء اسم فريد للملف
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 8);
            const uniqueFileName = `${timestamp}-${randomString}-${file.name}`;
            
            // رابط الرفع
            const uploadUrl = `${this.bucketUrl}/${uniqueFileName}`;
            
            // رفع الملف باستخدام PUT مع إعدادات CORS
            const response = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                },
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`رفع الملف فشل: ${response.status} ${response.statusText}`);
            }

            console.log('✅ تم رفع الملف بنجاح إلى MinIO');

            // إرجاع البيانات بنفس تنسيق Appwrite Storage
            return {
                // متوافق مع Appwrite Storage API
                $id: uniqueFileName, // استخدام الاسم الكامل كمعرف
                bucketId: this.bucketName,
                name: file.name,
                signature: uniqueFileName, // الاسم الكامل للملف في MinIO
                mimeType: file.type,
                sizeOriginal: file.size,
                chunksTotal: 1,
                chunksUploaded: 1,
                
                // حقول إضافية مطلوبة للتطبيق
                fileId: uniqueFileName, // استخدام الاسم الكامل كمعرف
                fileName: file.name,
                fileSize: file.size,
                downloadURL: this.getFileUrl(uniqueFileName),
                viewURL: this.getFileUrl(uniqueFileName),
                previewURL: this.getFileUrl(uniqueFileName),
                
                // معلومات MinIO
                storageProvider: 'MinIO',
                uploadedAt: new Date().toISOString(),
                
                // للتوافق مع الكود الحالي
                success: true
            };

        } catch (error) {
            console.error('❌ خطأ في رفع الملف:', error);
            throw new Error(`فشل في رفع الملف: ${error.message}`);
        }
    }

    // 📥 تحميل ملف - رابط مباشر
    async getFileDownload(fileId, fileName = null) {
        try {
            // إنشاء رابط التحميل المباشر
            const actualFileName = fileName || `${fileId}.${this.guessExtension(fileId)}`;
            const downloadUrl = this.getFileUrl(actualFileName);
            
            console.log('📥 رابط التحميل:', downloadUrl);
            return downloadUrl;

        } catch (error) {
            console.error('❌ خطأ في إنشاء رابط التحميل:', error);
            throw new Error(`فشل في إنشاء رابط التحميل: ${error.message}`);
        }
    }

    // �️ معاينة ملف - رابط مباشر
    async getFilePreview(fileId, width = 400, height = 400, gravity = 'center', quality = 100, fileName = null) {
        try {
            // إنشاء رابط المعاينة المباشر
            const actualFileName = fileName || `${fileId}.${this.guessExtension(fileId)}`;
            const previewUrl = this.getFileUrl(actualFileName);
            
            console.log('👁️ رابط المعاينة:', previewUrl);
            return previewUrl;

        } catch (error) {
            console.error('❌ خطأ في إنشاء رابط المعاينة:', error);
            throw new Error(`فشل في إنشاء رابط المعاينة: ${error.message}`);
        }
    }

    // 👀 عرض ملف - رابط مباشر
    async getFileView(fileId, fileName = null) {
        try {
            // إنشاء رابط العرض المباشر
            const actualFileName = fileName || `${fileId}.${this.guessExtension(fileId)}`;
            const viewUrl = this.getFileUrl(actualFileName);
            
            console.log('👀 رابط العرض:', viewUrl);
            return viewUrl;

        } catch (error) {
            console.error('❌ خطأ في إنشاء رابط العرض:', error);
            throw new Error(`فشل في إنشاء رابط العرض: ${error.message}`);
        }
    }

    // �️ حذف ملف
    async deleteFile(fileId, fileName = null) {
        try {
            console.log('🗑️ حذف الملف من MinIO:', { fileId, fileName });
            
            // استخدام اسم الملف المعطى أو بناء اسم من fileId
            let actualFileName;
            if (fileName) {
                // إذا كان اسم الملف معطى، استخدمه مباشرة
                actualFileName = fileName;
            } else {
                // إذا لم يكن، حاول بناء اسم من fileId
                actualFileName = `${fileId}.${this.guessExtension(fileId)}`;
            }
            
            console.log('🎯 اسم الملف المستخدم للحذف:', actualFileName);
            const deleteUrl = `${this.bucketUrl}/${actualFileName}`;
            console.log('🔗 رابط الحذف:', deleteUrl);
            
            const response = await fetch(deleteUrl, {
                method: 'DELETE'
            });

            if (!response.ok && response.status !== 404) {
                console.error('❌ فشل الحذف:', {
                    status: response.status,
                    statusText: response.statusText,
                    url: deleteUrl
                });
                throw new Error(`حذف الملف فشل: ${response.status} ${response.statusText}`);
            }
            
            console.log('✅ تم حذف الملف بنجاح من MinIO');
            return { success: true };

        } catch (error) {
            console.error('❌ خطأ في حذف الملف:', error);
            throw new Error(`فشل في حذف الملف: ${error.message}`);
        }
    }

    // � معلومات الملف
    async getFile(fileId, fileName = null) {
        try {
            const actualFileName = fileName || `${fileId}.${this.guessExtension(fileId)}`;
            const fileUrl = this.getFileUrl(actualFileName);
            
            const response = await fetch(fileUrl, {
                method: 'HEAD'
            });

            if (!response.ok) {
                throw new Error(`الملف غير موجود: ${response.status}`);
            }
            
            return {
                $id: fileId,
                bucketId: this.bucketName,
                name: actualFileName,
                signature: actualFileName,
                mimeType: response.headers.get('content-type') || 'application/octet-stream',
                sizeOriginal: parseInt(response.headers.get('content-length') || '0'),
                chunksTotal: 1,
                chunksUploaded: 1,
                $createdAt: response.headers.get('last-modified'),
                $updatedAt: response.headers.get('last-modified')
            };

        } catch (error) {
            console.error('❌ خطأ في الحصول على معلومات الملف:', error);
            throw new Error(`فشل في الحصول على معلومات الملف: ${error.message}`);
        }
    }

    // 🔧 دوال مساعدة

    // الحصول على رابط الملف المباشر
    getFileUrl(fileName) {
        return `${this.bucketUrl}/${fileName}`;
    }

    // تخمين امتداد الملف من النوع
    guessExtension(fileId) {
        // يمكن تحسين هذا لاحقاً بحفظ الامتدادات في قاعدة البيانات
        return 'bin'; // امتداد افتراضي
    }

    // فحص اتصال MinIO
    async testConnection() {
        try {
            console.log('🔍 فحص اتصال MinIO...');
            
            const testUrl = this.bucketUrl;
            
            const response = await fetch(testUrl, {
                method: 'GET'
            });
            
            // حتى لو كان 403 أو 404، فهذا يعني أن الخادم يرد
            if (response.status < 500) {
                console.log('✅ اتصال MinIO ناجح!');
                return {
                    success: true,
                    endpoint: this.endpoint,
                    bucket: this.bucketName,
                    status: 'متصل'
                };
            } else {
                throw new Error(`خطأ خادم: ${response.status}`);
            }

        } catch (error) {
            console.error('❌ فشل اتصال MinIO:', error);
            return {
                success: false,
                endpoint: this.endpoint,
                bucket: this.bucketName,
                status: `خطأ: ${error.message}`
            };
        }
    }

    // إحصائيات التخزين
    async getStorageStats() {
        return {
            provider: 'MinIO',
            endpoint: this.endpoint,
            bucket: this.bucketName,
            note: 'التخزين على الخادم الخاص - مساحة كبيرة متاحة'
        };
    }
}

// إنشاء مثيل واحد من الخدمة
const minioStorage = new MinioStorageService();

export default minioStorage;
export { MinioStorageService };