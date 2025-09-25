import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Node 18+: global fetch and FormData are available
// Usage:
// $env:GOOGLE_APPLICATION_CREDENTIALS='C:\path\to\service-account.json'
// $env:CLOUDINARY_CLOUD_NAME='drgdqi5ac'
// $env:CLOUDINARY_UPLOAD_PRESET='fyleo_unsigned_preset'
// node .\scripts\migrate_image_to_raw.mjs

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
if (!cloudName || !uploadPreset) {
  console.error('CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET must be set in env');
  process.exit(1);
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS to your Firebase service account JSON path');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

// file extensions we consider as non-image document files
const docExts = ['pdf','doc','docx','zip','rar','7z','txt','csv','xlsx','ppt','pptx'];

const isImageUploadUrl = (url) => typeof url === 'string' && url.includes('/image/upload/');
const extFromUrl = (url) => {
  try {
    const parts = url.split('?')[0].split('/');
    const name = parts[parts.length-1] || '';
    return name.split('.').pop().toLowerCase();
  } catch (e) {
    return '';
  }
};

const tempDir = path.join(__dirname, '.tmp_migrate');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

async function downloadToFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.promises.writeFile(destPath, buffer);
  return destPath;
}

async function uploadRawToCloudinary(filePath, filename, folder) {
  const form = new FormData();
  const fileStream = await fs.promises.readFile(filePath);
  const blob = new Blob([fileStream]);
  form.append('file', blob, filename);
  form.append('upload_preset', uploadPreset);
  form.append('resource_type', 'raw');
  if (folder) form.append('folder', folder);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;
  const res = await fetch(uploadUrl, { method: 'POST', body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(`Cloudinary upload failed: ${JSON.stringify(data)}`);
  return data;
}

(async () => {
  console.log('Starting migration: image-upload -> raw for document files');
  const filesCol = db.collection('files');
  const snapshot = await filesCol.get();
  console.log(`Total docs in files: ${snapshot.size}`);
  let migrated = 0;
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const secure = data.secure_url || data.url || null;
    if (!secure) continue;
    if (!isImageUploadUrl(secure)) continue; // only those that used image/upload
    const ext = extFromUrl(secure);
    if (!docExts.includes(ext)) continue; // skip images or unknown

    try {
      const filename = data.name || `file.${ext}`;
      const tmpPath = path.join(tempDir, `${doc.id}.${ext}`);
      console.log(`Downloading ${secure} -> ${tmpPath}`);
      await downloadToFile(secure, tmpPath);
      console.log('Uploading to Cloudinary raw endpoint...');
      const cloudRes = await uploadRawToCloudinary(tmpPath, filename, data.folder || data.categorySlug || undefined);
      console.log('Uploaded:', cloudRes.secure_url);
      // update Firestore doc
      const update = {
        secure_url: cloudRes.secure_url,
        public_id: cloudRes.public_id,
        resource_type: cloudRes.resource_type || 'raw',
        format: cloudRes.format || null,
        bytes: cloudRes.bytes || null,
        width: cloudRes.width || null,
        height: cloudRes.height || null,
        migrated_from_image_upload: true,
        migrated_at: admin.firestore.FieldValue.serverTimestamp(),
      };
      await filesCol.doc(doc.id).update(update);
      migrated++;
      // remove tmp
      try { await fs.promises.unlink(tmpPath); } catch (e) {}
    } catch (err) {
      console.error('Failed to migrate doc', doc.id, err.message || err);
    }
  }
  console.log(`Migration complete. Total migrated: ${migrated}`);
  process.exit(0);
})().catch(err => { console.error(err); process.exit(1); });
