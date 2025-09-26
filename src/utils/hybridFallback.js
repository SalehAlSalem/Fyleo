// نظام رفع هجين مع fallback محلي
import { auth, db } from '../../Firebase/ClientApp.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// محاكاة رفع محلي (للاختبار فقط)
const uploadToLocalSimulation = async (file, fileName, onProgress) => {
    return new Promise((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (onProgress) onProgress(progress);

            if (progress >= 100) {
                clearInterval(interval);
                const mockUrl = `https://mock-storage.fyleo.app/files/${fileName}`;
                resolve({
                    downloadURL: mockUrl,
                    storageProvider: 'local-simulation',
                    fileSize: file.size,
                    fileName: fileName,
                    isSimulation: true
                });
            }
        }, 200);
    });
};

export const uploadFileHybridFallback = async (file, metadata, onProgress) => {
    if (!file) {
        throw new Error('لا يوجد ملف للرفع');
    }

    if (!auth.currentUser) {
        throw new Error('يرجى تسجيل الدخول أولاً');
    }

    console.log('🚀 بدء رفع الملف:', file.name);

    try {
        // تجربة النظام الهجين أولاً
        const hasGitHub = import.meta.env.VITE_GITHUB_TOKEN && 
                         import.meta.env.VITE_GITHUB_TOKEN !== 'ghp_PLACEHOLDER_TOKEN_WILL_BE_SET_IN_VERCEL';
        
        const hasSupabase = import.meta.env.VITE_SUPABASE_URL && 
                           import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co';

        if (!hasGitHub && !hasSupabase) {
            console.log('⚠️ النظام الهجين غير متاح، استخدام المحاكاة المحلية (Simulation Mode)');
            const timestamp = Date.now();
            const fileName = `${timestamp}-${file.name}`;
            const uploadResult = await uploadToLocalSimulation(file, fileName, onProgress);

            const fileData = {
                name: file.name,
                originalName: file.name,
                size: file.size,
                type: file.type,
                downloadURL: uploadResult.downloadURL,
                storageProvider: 'local-simulation',
                storagePath: fileName,
                isSimulation: true,
                ...metadata,
                uploadedAt: serverTimestamp(),
                uploadedBy: auth.currentUser.uid,
                uploaderEmail: auth.currentUser.email,
                uploaderName: auth.currentUser.displayName || 'مستخدم',
                downloadCount: 0,
                viewCount: 0,
                approved: true
            };

            const docRef = await addDoc(collection(db, 'files'), fileData);
            console.log('💾 تم حفظ (محاكاة) البيانات في Firestore:', docRef.id);

            return {
                id: docRef.id,
                downloadURL: uploadResult.downloadURL,
                storageProvider: 'local-simulation',
                fileSize: file.size,
                isSimulation: true,
                ...fileData
            };
        }

        // إذا كان النظام الهجين متاح، استخدمه
        const { uploadFileHybrid } = await import('../../HybridStorage/index.mjs');
        const realResult = await uploadFileHybrid(file, metadata, onProgress);
        return { ...realResult, isSimulation: realResult.isSimulation ?? false };

    } catch (error) {
        console.error('❌ فشل رفع الملف:', error);
        throw new Error(`فشل رفع الملف: ${error.message}`);
    }
};