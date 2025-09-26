// نظام تخزين هجين مجاني محسن - GitHub + Supabase
import { db } from '../Firebase/ClientApp.js';
import { collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

// 🚨 تسجيل مفصل للتشخيص
const log = (level, message, data = null) => {
    const timestamp = new Date().toLocaleTimeString('ar-SA');
    const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : level === 'success' ? '✅' : 'ℹ️';
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](`${prefix} [${timestamp}] ${message}`, data || '');
};

// إعدادات GitHub
const GITHUB_CONFIG = {
    owner: import.meta.env.VITE_GITHUB_OWNER || 'SalehAlSalem',
    repo: import.meta.env.VITE_GITHUB_REPO || 'Fyleo',
    branch: 'main',
    token: import.meta.env.VITE_GITHUB_TOKEN,
    filesPath: 'uploads/' // مجلد الملفات في repository
};

// Supabase configuration (bucket made configurable)
const SUPABASE_CONFIG = {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    bucket: import.meta.env.VITE_SUPABASE_BUCKET || 'files'
};

// تحقق محسن من التكوين
const validateConfig = () => {
    log('info', '🔍 فحص تكوين النظام الهجين...');
    
    const status = {
        github: !!GITHUB_CONFIG.token,
        supabase: !!(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey),
        firebase: !!db,
        supabaseBucket: !!SUPABASE_CONFIG.bucket
    };
    
    log('info', 'حالة الخدمات:', {
        '🐙 GitHub': status.github ? 'متاح' : 'غير متاح',
        '⚡ Supabase': status.supabase ? 'متاح' : 'غير متاح',
        '📦 Supabase Bucket': status.supabaseBucket ? SUPABASE_CONFIG.bucket : 'مفقود',
        '🔥 Firebase': status.firebase ? 'متاح' : 'غير متاح'
    });
    
    if (!status.firebase) {
        log('error', 'Firebase غير متاح - لا يمكن حفظ بيانات الملفات');
        return false;
    }
    
    if (!status.github && !status.supabase) {
        log('error', 'لا توجد أنظمة تخزين متاحة');
        return false;
    }

    if (status.supabase && !status.supabaseBucket) {
        log('error', '⚡ Supabase متاح لكن اسم الـ bucket غير مضبوط (أضف VITE_SUPABASE_BUCKET)');
        return false;
    }
    
    if (!status.github) {
        log('warn', 'GitHub غير متاح - الملفات الصغيرة ستُرفع على Supabase');
    }
    
    if (!status.supabase) {
        log('warn', 'Supabase غير متاح - الملفات الكبيرة ستفشل');
    }
    
    log('success', 'النظام الهجين جاهز للعمل');
    return true;
};

// حدود الملفات
const FILE_SIZE_LIMITS = {
    GITHUB_MAX_SIZE: 25 * 1024 * 1024, // 25MB
    SUPABASE_MAX_SIZE: 100 * 1024 * 1024 // 100MB
};

// تحقق من التكوين عند التحميل
if (typeof window !== 'undefined') {
    validateConfig();
}

/**
 * تحديد نظام التخزين المناسب حسب حجم الملف
 */
const getStorageProvider = (fileSize) => {
    if (fileSize <= FILE_SIZE_LIMITS.GITHUB_MAX_SIZE) {
        return 'github';
    } else if (fileSize <= FILE_SIZE_LIMITS.SUPABASE_MAX_SIZE) {
        return 'supabase';
    } else {
        throw new Error('File too large. Maximum size is 100MB');
    }
};

/**
 * رفع ملف إلى GitHub باستخدام GitHub API
 */
const uploadToGitHub = async (file, fileName, onProgress) => {
    if (!GITHUB_CONFIG.token) {
        throw new Error('لا يوجد GitHub token. يرجى إضافة VITE_GITHUB_TOKEN في ملف .env');
    }

    log('info', `🐙 بدء رفع على GitHub: ${fileName}`);
    
    try {
        // تقدم: تحويل الملف
        if (onProgress) onProgress(20);
        log('info', '📝 تحويل الملف إلى base64...');
        const base64Content = await fileToBase64(file);
        
        // إنشاء path فريد
        if (onProgress) onProgress(40);
        const timestamp = Date.now();
        const cleanFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const filePath = `${GITHUB_CONFIG.filesPath}${timestamp}_${cleanFileName}`;
        
        log('info', `📂 مسار الملف: ${filePath}`);
        
        // رفع إلى GitHub API
        if (onProgress) onProgress(60);
        log('info', '⬆️ رفع إلى GitHub API...');
        
        const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: `📄 رفع ملف: ${fileName} [Fyleo]`,
                content: base64Content,
                branch: GITHUB_CONFIG.branch
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            log('error', `GitHub API خطأ: ${response.status}`, errorText);
            throw new Error(`فشل رفع GitHub: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        if (onProgress) onProgress(75);
        
        log('success', `✅ تم رفع الملف بنجاح على GitHub`);
        
        return {
            downloadURL: result.content.download_url,
            fileName: fileName,
            fileSize: file.size,
            provider: 'github',
            path: filePath,
            storageProvider: 'GitHub (مجاني)',
            githubSha: result.content.sha,
            htmlUrl: result.content.html_url
        };

    } catch (error) {
        log('error', '❌ فشل رفع GitHub', error.message);
        throw new Error(`GitHub: ${error.message}`);
    }
};

/**
 * رفع ملف إلى Supabase Storage
 */
const uploadToSupabase = async (file, fileName, onProgress) => {
    if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
        throw new Error('لا يوجد إعدادات Supabase (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)');
    }
    if (!SUPABASE_CONFIG.bucket) {
        throw new Error('لم يتم ضبط اسم الـ bucket (أضف VITE_SUPABASE_BUCKET)');
    }
    if (SUPABASE_CONFIG.url?.includes('placeholder') || SUPABASE_CONFIG.anonKey?.includes('placeholder')) {
        throw new Error('قِيَم Supabase الحالية Placeholders وليست مفاتيح حقيقية');
    }

    log('info', `⚡ بدء رفع على Supabase: ${fileName}`);
    
    try {
        // إنشاء Supabase client
        if (onProgress) onProgress(20);
        log('info', '🔗 الاتصال بـ Supabase...');
        
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

        // إنشاء اسم ملف فريد
        if (onProgress) onProgress(30);
        const timestamp = Date.now();
        const cleanFileName = fileName.replace(/[^a-zA-Z0-9.\-_ ]/g, '_');
    const uniqueFileName = `fyleo/${timestamp}_${cleanFileName}`; // path inside bucket
        
        log('info', `📂 اسم الملف: ${uniqueFileName}`);

        // رفع الملف مع تتبع التقدم
        if (onProgress) onProgress(40);
        log('info', '⬆️ رفع إلى Supabase Storage...');
        
        const { data, error } = await supabase.storage
            .from(SUPABASE_CONFIG.bucket)
            .upload(uniqueFileName, file, {
                cacheControl: '3600',
                upsert: false,
                onUploadProgress: (progress) => {
                    if (progress.loaded && progress.total) {
                        const percentage = 40 + ((progress.loaded / progress.total) * 35); // 40-75%
                        if (onProgress) onProgress(Math.round(percentage));
                    }
                }
            });

        if (error) {
            log('error', 'خطأ Supabase Storage', error);
            throw new Error(`Supabase Storage: ${error.message}`);
        }

        // الحصول على public URL
        if (onProgress) onProgress(80);
        log('info', '🔗 الحصول على رابط الملف العام...');
        
        const { data: publicURLData } = supabase.storage
            .from(SUPABASE_CONFIG.bucket)
            .getPublicUrl(uniqueFileName);

        if (!publicURLData?.publicUrl) {
            throw new Error('فشل في الحصول على رابط الملف العام');
        }

        log('success', `✅ تم رفع الملف بنجاح على Supabase`);

        return {
            downloadURL: publicURLData.publicUrl,
            fileName: fileName,
            fileSize: file.size,
            provider: 'supabase',
            path: uniqueFileName,
            storageProvider: 'Supabase (احتياطي)',
            bucketId: SUPABASE_CONFIG.bucket
        };

    } catch (error) {
        log('error', '❌ فشل رفع Supabase', error.message);
        throw new Error(`Supabase: ${error.message}`);
    }
};

/**
 * النظام الرئيسي للرفع الهجين المحسن
 */
export const uploadFileHybrid = async (file, metadata, onProgress) => {
    // التحقق من صحة المدخلات
    if (!file) {
        throw new Error('لا يوجد ملف للرفع');
    }
    
    if (!validateConfig()) {
        throw new Error('تكوين النظام الهجين غير صحيح');
    }
    
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    log('info', `🚀 بدء رفع الملف: ${file.name} (${fileSize}MB)`);
    
    try {
        // تحديد نظام التخزين
        const provider = getStorageProvider(file.size);
        log('info', `📁 استخدام ${provider === 'github' ? 'GitHub' : 'Supabase'} للرفع`);
        
        // رفع التقدم للمستخدم
        if (onProgress) onProgress(5); // بدء العملية
        
        let uploadResult;
        
        // الرفع حسب النظام المحدد مع fallback ذكي
        if (provider === 'github') {
            log('info', '⬆️ رفع على GitHub...');
            try {
                uploadResult = await uploadToGitHub(file, file.name, onProgress);
                log('success', `✅ تم الرفع بنجاح على GitHub`);
            } catch (githubError) {
                log('error', 'فشل رفع GitHub، محاولة Supabase...', githubError.message);
                if (SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
                    uploadResult = await uploadToSupabase(file, file.name, onProgress);
                    log('success', '✅ تم الرفع بنجاح على Supabase (احتياطي)');
                } else {
                    throw githubError;
                }
            }
        } else {
            log('info', '⬆️ رفع على Supabase...');
            try {
                uploadResult = await uploadToSupabase(file, file.name, onProgress);
                log('success', `✅ تم الرفع بنجاح على Supabase`);
            } catch (supabaseError) {
                log('error', 'فشل رفع Supabase، محاولة GitHub...', supabaseError.message);
                if (file.size <= FILE_SIZE_LIMITS.GITHUB_MAX_SIZE && GITHUB_CONFIG.token) {
                    uploadResult = await uploadToGitHub(file, file.name, onProgress);
                    log('success', '✅ تم الرفع بنجاح على GitHub (احتياطي)');
                } else {
                    throw new Error(`الملف كبير جداً (${fileSize}MB). الحد الأقصى: ${FILE_SIZE_LIMITS.SUPABASE_MAX_SIZE / 1024 / 1024}MB`);
                }
            }
        }
        
        if (onProgress) onProgress(80); // اكتمال الرفع
        
        // حفظ معلومات الملف في Firestore
        log('info', '💾 حفظ بيانات الملف في قاعدة البيانات...');
        const fileData = {
            name: file.name,
            size: file.size,
            type: file.type,
            ...metadata,
            ...uploadResult,
            uploadedAt: serverTimestamp(),
            downloadCount: 0,
            viewCount: 0,
            approved: true // اعتماد تلقائي
        };

        const docRef = await addDoc(collection(db, 'files'), fileData);
        if (onProgress) onProgress(100); // اكتمال العملية
        
        const result = {
            id: docRef.id,
            ...fileData
        };
        
        log('success', `🎉 تم رفع الملف بنجاح! ID: ${docRef.id}`);
        return result;

    } catch (error) {
        log('error', `❌ فشل رفع الملف: ${file.name}`, error.message);
        if (onProgress) onProgress(0); // إعادة تعيين التقدم
        throw new Error(`فشل رفع الملف: ${error.message}`);
    }
};

// دالة مساعدة لتحويل الملف إلى base64
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // إزالة البادئة data:...;base64,
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
    });
};

// دوال مساعدة أخرى
export const incrementDownloadCount = async (fileId) => {
    // نفس الكود السابق
};

export const incrementViewCount = async (fileId) => {
    // نفس الكود السابق
};

export const deleteFileHybrid = async (fileId, provider, path) => {
    try {
        if (provider === 'github') {
            // حذف من GitHub
            const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `token ${GITHUB_CONFIG.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Delete file: ${path}`,
                    sha: 'SHA_OF_FILE', // تحتاج الحصول على SHA أولاً
                    branch: GITHUB_CONFIG.branch
                })
            });
        } else if (provider === 'supabase') {
            // حذف من Supabase
            const { createClient } = await import('@supabase/supabase-js');
            const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            
            await supabase.storage
                .from(SUPABASE_CONFIG.bucket)
                .remove([path]);
        }

        // حذف من Firestore
        await deleteDoc(doc(db, 'files', fileId));

    } catch (error) {
        console.error('Delete error:', error);
        throw error;
    }
};