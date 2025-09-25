// Firebase Storage redirect for backward compatibility
import { uploadFileToFirebaseStorage } from '../Firebase/Storage.mjs';

export const uploadToCloudinary = async (file, metadata = {}) => {
  const result = await uploadFileToFirebaseStorage(file, metadata);
  return {
    secure_url: result.downloadURL,
    public_id: result.fileId,
    resource_type: 'raw',
    format: file.name.split('.').pop(),
    bytes: file.size
  };
};

export const uploadFileToCloudinaryAndFirestore = uploadFileToFirebaseStorage;
