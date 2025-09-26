// نظام تخزين هجين مجاني - GitHub + Supabase
import { db } from '../Firebase/ClientApp.js';
import { collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

// إعدادات GitHub
const GITHUB_CONFIG = {
    owner: import.meta.env.VITE_GITHUB_OWNER || 'SalehAlSalem',
    repo: import.meta.env.VITE_GITHUB_REPO || 'Fyleo',
    branch: 'main',
    token: import.meta.env.VITE_GITHUB_TOKEN,
    filesPath: 'uploads/' // مجلد الملفات في repository
};

// إعدادات Supabase
const SUPABASE_CONFIG = {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    bucket: 'fyleo-files' // اسم bucket مُحدث
};

// تحقق من التكوين
const validateConfig = () => {
    const issues = [];
    
    if (!GITHUB_CONFIG.token) {
        issues.push('❌ VITE_GITHUB_TOKEN missing - GitHub uploads will fail');
    }
    
    if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
        issues.push('❌ Supabase config missing - Large file uploads will fail');
    }
    
    if (issues.length > 0) {
        console.warn('🚨 Hybrid Storage Configuration Issues:', issues);
        return false;
    }
    
    console.log('✅ Hybrid Storage: All configurations valid');
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
    try {
        // فحص وجود GitHub token
        if (!GITHUB_CONFIG.token) {
            throw new Error('GitHub token is required. Please set VITE_GITHUB_TOKEN in your .env file');
        }

        // تحويل الملف إلى base64
        const base64Content = await fileToBase64(file);
        
        // إنشاء path فريد للملف
        const filePath = `${GITHUB_CONFIG.filesPath}${Date.now()}_${fileName}`;
        
        // رفع إلى GitHub
        const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Upload file: ${fileName}`,
                content: base64Content,
                branch: GITHUB_CONFIG.branch
            })
        });

        if (!response.ok) {
            throw new Error(`GitHub upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        
        // إرجاع URL للملف
        return {
            downloadURL: result.content.download_url,
            fileName: fileName,
            fileSize: file.size,
            provider: 'github',
            path: filePath
        };

    } catch (error) {
        console.error('GitHub upload error:', error);
        throw error;
    }
};

/**
 * رفع ملف إلى Supabase Storage
 */
const uploadToSupabase = async (file, fileName, onProgress) => {
    try {
        // فحص وجود Supabase configuration
        if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
            throw new Error('Supabase configuration is required. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
        }

        // تحتاج تثبيت Supabase client أولاً
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

        // إنشاء اسم ملف فريد
        const uniqueFileName = `${Date.now()}_${fileName}`;

        // رفع الملف
        const { data, error } = await supabase.storage
            .from(SUPABASE_CONFIG.bucket)
            .upload(uniqueFileName, file, {
                onUploadProgress: (progress) => {
                    const percentage = (progress.loaded / progress.total) * 100;
                    onProgress?.(percentage);
                }
            });

        if (error) {
            throw error;
        }

        // الحصول على public URL
        const { data: publicURLData } = supabase.storage
            .from(SUPABASE_CONFIG.bucket)
            .getPublicUrl(uniqueFileName);

        return {
            downloadURL: publicURLData.publicUrl,
            fileName: fileName,
            fileSize: file.size,
            provider: 'supabase',
            path: uniqueFileName
        };

    } catch (error) {
        console.error('Supabase upload error:', error);
        throw error;
    }
};

/**
 * النظام الرئيسي للرفع الهجين
 */
export const uploadFileHybrid = async (file, metadata, onProgress) => {
    try {
        // تحديد نظام التخزين المناسب
        const provider = getStorageProvider(file.size);
        
        console.log(`Using ${provider} for file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

        let uploadResult;

        // الرفع حسب النظام المحدد مع fallback
        if (provider === 'github') {
            uploadResult = await uploadToGitHub(file, file.name, onProgress);
        } else {
            try {
                uploadResult = await uploadToSupabase(file, file.name, onProgress);
            } catch (supabaseError) {
                console.warn('Supabase upload failed, trying GitHub as fallback:', supabaseError.message);
                
                // إذا كان الملف صغير بما يكفي، جرب GitHub
                if (file.size <= FILE_SIZE_LIMITS.GITHUB_MAX_SIZE) {
                    uploadResult = await uploadToGitHub(file, file.name, onProgress);
                } else {
                    throw new Error(`File too large for fallback. Original error: ${supabaseError.message}`);
                }
            }
        }

        // حفظ معلومات الملف في Firestore
        const fileData = {
            ...metadata,
            ...uploadResult,
            uploadedAt: serverTimestamp(),
            downloadCount: 0,
            viewCount: 0
        };

        const docRef = await addDoc(collection(db, 'files'), fileData);

        return {
            id: docRef.id,
            ...fileData
        };

    } catch (error) {
        console.error('Hybrid upload error:', error);
        throw error;
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