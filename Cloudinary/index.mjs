import { db } from '../Firebase/ClientApp.mjs';
import { collection, doc, setDoc } from 'firebase/firestore';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!cloudName || !uploadPreset) {
  // Fail fast when env vars are missing to avoid silent failures on client
  // We can't throw at import time in some bundlers, so expose a helpful console error.
  // Consumers should still handle thrown errors from uploadToCloudinary.
  // eslint-disable-next-line no-console
  console.error('Cloudinary env vars missing. Ensure VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET are set.');
}

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

    const text = await response.text();
    // Try to parse JSON body if possible
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text };
    }

    if (!response.ok) {
      const err = new Error(`Cloudinary upload failed: ${response.status} ${response.statusText}`);
      err.status = response.status;
      err.body = data;
      // eslint-disable-next-line no-console
      console.error('Cloudinary upload error:', err);
      throw err;
    }

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