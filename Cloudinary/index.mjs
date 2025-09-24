import { db, auth } from '../Firebase/ClientApp.mjs';
import { collection, doc, setDoc, serverTimestamp, updateDoc, increment } from 'firebase/firestore';

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
  // Optional: if caller provided a folder, it should be present on the file object as file._folder
  if (file && file._folder) {
    // Cloudinary expects a 'folder' field in the form data
    formData.append('folder', file._folder);
  }

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
    // Attach requested folder to file temporarily so uploadToCloudinary can read it
    if (metadata && metadata.categorySlug) {
      // clone file-like objects may be read-only; attach a non-enumerable property if possible
      try {
        file._folder = metadata.categorySlug;
      } catch (e) {
        // ignore if we cannot attach
      }
    }
    const cloudinaryResponse = await uploadToCloudinary(file);
    
    // Create a new document in Firestore
    const fileId = doc(collection(db, 'files')).id;
    
    // Prepare file metadata; avoid including undefined fields (Firestore rejects undefined)
    const rawFileData = {
      name: file && file.name ? file.name : null,
      category: metadata && metadata.category ? metadata.category : null,
      categorySlug: metadata && metadata.categorySlug ? metadata.categorySlug : null,
      secure_url: cloudinaryResponse && cloudinaryResponse.secure_url ? cloudinaryResponse.secure_url : null,
      public_id: cloudinaryResponse && cloudinaryResponse.public_id ? cloudinaryResponse.public_id : null,
      format: cloudinaryResponse && cloudinaryResponse.format ? cloudinaryResponse.format : null,
      resource_type: cloudinaryResponse && cloudinaryResponse.resource_type ? cloudinaryResponse.resource_type : null,
      bytes: cloudinaryResponse && typeof cloudinaryResponse.bytes !== 'undefined' ? cloudinaryResponse.bytes : null,
      width: cloudinaryResponse && typeof cloudinaryResponse.width !== 'undefined' ? cloudinaryResponse.width : null,
      height: cloudinaryResponse && typeof cloudinaryResponse.height !== 'undefined' ? cloudinaryResponse.height : null,
      // cloudinaryResponse.folder may be undefined; include only when defined
      folder: typeof cloudinaryResponse !== 'undefined' && typeof cloudinaryResponse.folder !== 'undefined' ? cloudinaryResponse.folder : undefined,
  // Use Firestore serverTimestamp to keep server-side consistent timestamps
  createdAt: serverTimestamp(),
      uploaderUid: (auth && auth.currentUser) ? auth.currentUser.uid : null,
      ...metadata,
      approved: false // Default to false until moderator approves
    };

    // Helper: remove keys with undefined values because Firestore doesn't accept undefined
    const cleanObject = (obj) => {
      const out = {};
      Object.keys(obj).forEach((k) => {
        if (typeof obj[k] !== 'undefined') {
          out[k] = obj[k];
        }
      });
      return out;
    };

    const fileData = cleanObject(rawFileData);

    // Save to Firestore (best-effort). If saving fails, return result with firestoreSaved=false
    try {
      await setDoc(doc(db, 'files', fileId), fileData);
      // Award 1 point to uploader if uploaderUid is present
      try {
        if (fileData.uploaderUid) {
          const userRef = doc(db, 'users', fileData.uploaderUid);
          await updateDoc(userRef, { points: increment(1) });
        }
      } catch (ptsErr) {
        // Non-fatal: log point update failure
        // eslint-disable-next-line no-console
        console.warn('Failed to update user points for uploader', ptsErr);
      }
      return {
        id: fileId,
        ...fileData,
        firestoreSaved: true
      };
  } catch (fireErr) {
      // eslint-disable-next-line no-console
      console.error('Cloudinary: uploaded but failed to save to Firestore', {
        message: fireErr && fireErr.message,
        code: fireErr && fireErr.code,
        stack: fireErr && fireErr.stack,
        raw: fireErr
      });
      const errObj = {
        message: fireErr && fireErr.message ? String(fireErr.message) : String(fireErr),
        code: fireErr && fireErr.code ? String(fireErr.code) : undefined,
      };
      return {
        id: fileId,
        ...fileData,
        firestoreSaved: false,
        firestoreError: errObj
      };
    }
  } catch (error) {
    console.error('Error in upload process:', error);
    throw error;
  }
};

// Separate helper to attempt saving metadata to Firestore later (retry)
export const saveMetadataToFirestore = async (fileData) => {
  try {
    const id = fileData.id || doc(collection(db, 'files')).id;
    // ensure we don't store undefined in the saved object
    const toSave = cleanObject({ ...fileData, createdAt: fileData.createdAt || serverTimestamp() });
    await setDoc(doc(db, 'files', id), toSave);
    return { ok: true, id };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('saveMetadataToFirestore error', {
      message: err && err.message,
      code: err && err.code,
      stack: err && err.stack,
      raw: err
    });
    const errorObj = {
      message: err && err.message ? String(err.message) : String(err),
      code: err && err.code ? String(err.code) : undefined,
    };
    return { ok: false, error: errorObj };
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