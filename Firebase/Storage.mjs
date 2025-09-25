import { storage, db, auth } from '../Firebase/ClientApp.mjs';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Alternative file upload using Firebase Storage instead of Cloudinary
export const uploadFileToFirebaseStorage = async (file, metadata = {}) => {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const category = metadata.categorySlug || 'general';
    
    // Create a reference to the file location
    const storageRef = ref(storage, `files/${category}/${fileName}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Create a new document in Firestore
    const fileId = doc(collection(db, 'files')).id;
    
    const fileData = {
      id: fileId,
      name: file.name,
      category: metadata.category || null,
      categorySlug: metadata.categorySlug || null,
      downloadURL: downloadURL,
      fileName: fileName,
      size: file.size,
      type: file.type,
      storagePath: snapshot.ref.fullPath,
      // Firebase metadata
      bucket: snapshot.ref.bucket,
      generation: snapshot.metadata.generation,
      createdAt: serverTimestamp(),
      uploadedBy: auth.currentUser ? auth.currentUser.uid : null,
      approvedBy: null, // For admin approval workflow
      approved: false,   // Requires admin approval
      downloads: 0,
      bookmarkedBy: []
    };
    
    // Save to Firestore
    await setDoc(doc(db, 'files', fileId), fileData);
    
    console.log('File uploaded successfully to Firebase Storage:', {
      fileId,
      downloadURL,
      storagePath: snapshot.ref.fullPath
    });
    
    return {
      success: true,
      fileId,
      downloadURL,
      fileData
    };
    
  } catch (error) {
    console.error('Firebase Storage upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

// Helper function to delete file from Firebase Storage
export const deleteFileFromFirebaseStorage = async (storagePath) => {
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    console.log('File deleted successfully from Firebase Storage');
    return true;
  } catch (error) {
    console.error('Error deleting file from Firebase Storage:', error);
    throw error;
  }
};