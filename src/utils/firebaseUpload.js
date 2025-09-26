// نظام رفع مؤقت باستخدام Firebase Storage فقط
import { auth, storage, db } from '../../Firebase/ClientApp.js';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const uploadFileTemporary = async (file, metadata, onProgress) => {
    if (!file) {
        throw new Error('لا يوجد ملف للرفع');
    }

    if (!auth.currentUser) {
        throw new Error('يرجى تسجيل الدخول أولاً');
    }

    if (!storage) {
        throw new Error('خدمة التخزين غير متاحة');
    }

    console.log('🚀 بدء رفع الملف:', file.name);

    try {
        // إنشاء مرجع للملف في Firebase Storage
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name}`;
        const storageRef = ref(storage, `uploads/${fileName}`);

        // رفع الملف مع تتبع التقدم
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    // تحديث التقدم
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (onProgress) {
                        onProgress(Math.round(progress));
                    }
                    console.log(`📊 التقدم: ${Math.round(progress)}%`);
                },
                (error) => {
                    console.error('❌ خطأ في الرفع:', error);
                    reject(error);
                },
                async () => {
                    try {
                        // الحصول على رابط التحميل
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log('✅ تم الرفع بنجاح، الرابط:', downloadURL);

                        // حفظ بيانات الملف في Firestore
                        const fileData = {
                            name: file.name,
                            originalName: file.name,
                            size: file.size,
                            type: file.type,
                            downloadURL: downloadURL,
                            storageProvider: 'firebase',
                            storagePath: fileName,
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
                        console.log('💾 تم حفظ البيانات في Firestore:', docRef.id);

                        resolve({
                            id: docRef.id,
                            downloadURL: downloadURL,
                            storageProvider: 'firebase',
                            fileSize: file.size,
                            ...fileData
                        });
                    } catch (error) {
                        console.error('❌ خطأ في حفظ البيانات:', error);
                        reject(error);
                    }
                }
            );
        });

    } catch (error) {
        console.error('❌ فشل رفع الملف:', error);
        throw new Error(`فشل رفع الملف: ${error.message}`);
    }
};