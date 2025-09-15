import { db } from '../Firebase/ClientApp.mjs';
import { collection, doc, setDoc } from 'firebase/firestore';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Main upload function
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Combined function to upload to Cloudinary and save to Firestore
export const uploadFileToCloudinaryAndFirestore = async (file, metadata = {}) => {
  try {
    // Upload to Cloudinary
    const cloudinaryResponse = await uploadToCloudinary(file);
    
    // Create a new document in Firestore
    const fileId = doc(collection(db, 'files')).id;
    
    // Prepare file metadata
    const fileData = {
      name: file.name,
      secure_url: cloudinaryResponse.secure_url,
      public_id: cloudinaryResponse.public_id,
      format: cloudinaryResponse.format,
      resource_type: cloudinaryResponse.resource_type,
      bytes: cloudinaryResponse.bytes,
      width: cloudinaryResponse.width,
      height: cloudinaryResponse.height,
      folder: cloudinaryResponse.folder,
      createdAt: new Date().toISOString(),
      ...metadata,
      approved: false // Default to false until moderator approves
    };

    // Save to Firestore
    await setDoc(doc(db, 'files', fileId), fileData);

    return {
      id: fileId,
      ...fileData
    };
  } catch (error) {
    console.error('Error in upload process:', error);
    throw error;
  }
};

// React hook for file upload with progress
export const useCloudinaryUpload = (onProgress) => {
  const uploadFile = async (file, metadata = {}) => {
    return await uploadFileToCloudinaryAndFirestore(file, metadata);
  };

  return {
    uploadFile
  };
};