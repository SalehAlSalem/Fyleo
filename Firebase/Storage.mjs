import { storage, db, auth } from '../Firebase/ClientApp.mjs';
import { ref, uploadBytes, getDownloadURL, deleteObject, uploadBytesResumable } from "firebase/storage";
import { collection, doc, setDoc, serverTimestamp, updateDoc, increment, getDoc, deleteDoc } from 'firebase/firestore';

// Main file upload function using Firebase Storage
export const uploadFileToFirebaseStorage = async (file, metadata = {}, onProgress = null) => {
  try {
    if (!file) {
      throw new Error('لم يتم تحديد ملف للرفع');
    }

    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${timestamp}_${randomString}_${cleanFileName}`;
    
    const category = metadata.categorySlug || 'general';
    
    // Create a reference to the file location
    const storageRef = ref(storage, `files/${category}/${fileName}`);
    
    console.log('بدء رفع الملف إلى Firebase Storage:', {
      fileName,
      category,
      size: file.size,
      type: file.type
    });

    // Upload with progress monitoring
    let snapshot;
    if (onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      snapshot = await new Promise((resolve, reject) => {
        uploadTask.on('state_changed', 
          (progress) => {
            const percent = (progress.bytesTransferred / progress.totalBytes) * 100;
            onProgress(percent);
          },
          (error) => reject(error),
          () => resolve(uploadTask.snapshot)
        );
      });
    } else {
      snapshot = await uploadBytes(storageRef, file);
    }
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Create a new document in Firestore
    const fileId = doc(collection(db, 'files')).id;
    
    // Get current user
    const currentUser = auth.currentUser;
    
    const fileData = {
      id: fileId,
      name: file.name,
      originalName: file.name,
      fileName: fileName,
      category: metadata.category || 'عام',
      categorySlug: metadata.categorySlug || 'general',
      downloadURL: downloadURL,
      secure_url: downloadURL, // For compatibility with existing code
      size: file.size,
      bytes: file.size, // For compatibility with existing code
      type: file.type,
      format: fileExtension,
      storagePath: snapshot.ref.fullPath,
      // Firebase metadata
      bucket: snapshot.ref.bucket,
      generation: snapshot.metadata.generation,
      // Firestore fields
      createdAt: serverTimestamp(),
      uploadedBy: currentUser ? currentUser.uid : null,
      uploaderName: currentUser ? (currentUser.displayName || currentUser.email) : 'مجهول',
      approvedBy: null,
      approved: true, // Auto-approve for now, can be changed later
      downloads: 0,
      bookmarkedBy: [],
      views: 0,
      // Additional metadata
      description: metadata.description || '',
      tags: metadata.tags || [],
      public: metadata.public !== false, // Default to public
    };
    
    // Save to Firestore
    await setDoc(doc(db, 'files', fileId), fileData);
    
    console.log('تم رفع الملف بنجاح إلى Firebase Storage:', {
      fileId,
      downloadURL,
      storagePath: snapshot.ref.fullPath
    });
    
    return {
      success: true,
      fileId,
      downloadURL,
      secure_url: downloadURL,
      fileData,
      storagePath: snapshot.ref.fullPath
    };
    
  } catch (error) {
    console.error('خطأ في رفع الملف إلى Firebase Storage:', error);
    throw new Error(`فشل الرفع: ${error.message}`);
  }
};

// Function to increment download count
export const incrementDownloadCount = async (fileId) => {
  try {
    const fileRef = doc(db, 'files', fileId);
    await updateDoc(fileRef, {
      downloads: increment(1)
    });
  } catch (error) {
    console.error('خطأ في تحديث عدد التحميلات:', error);
  }
};

// Function to increment view count
export const incrementViewCount = async (fileId) => {
  try {
    const fileRef = doc(db, 'files', fileId);
    await updateDoc(fileRef, {
      views: increment(1)
    });
  } catch (error) {
    console.error('خطأ في تحديث عدد المشاهدات:', error);
  }
};

// Helper function to delete file from Firebase Storage
export const deleteFileFromFirebaseStorage = async (storagePath, fileId = null) => {
  try {
    // Delete from Firebase Storage
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    
    // Delete from Firestore if fileId provided
    if (fileId) {
      await deleteDoc(doc(db, 'files', fileId));
    }
    
    console.log('تم حذف الملف بنجاح من Firebase Storage');
    return true;
  } catch (error) {
    console.error('خطأ في حذف الملف من Firebase Storage:', error);
    throw error;
  }
};

// Get file by ID
export const getFileById = async (fileId) => {
  try {
    const fileRef = doc(db, 'files', fileId);
    const fileSnap = await getDoc(fileRef);
    
    if (fileSnap.exists()) {
      return { id: fileSnap.id, ...fileSnap.data() };
    } else {
      throw new Error('الملف غير موجود');
    }
  } catch (error) {
    console.error('خطأ في جلب الملف:', error);
    throw error;
  }
};

// Legacy function for compatibility with existing Cloudinary code
export const uploadFileToCloudinaryAndFirestore = uploadFileToFirebaseStorage;