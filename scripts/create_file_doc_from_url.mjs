import admin from 'firebase-admin';

// Usage:
// $env:GOOGLE_APPLICATION_CREDENTIALS='C:\path\to\service-account.json'
// node .\scripts\create_file_doc_from_url.mjs --url "https://.../file.pdf" --name "My PDF" --category "CP-DSA" --uploaderUid YOUR_UID --approved true

const argv = {};
for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg.startsWith('--')) {
    const key = arg.slice(2);
    const val = process.argv[i+1] && !process.argv[i+1].startsWith('--') ? process.argv[i+1] : 'true';
    argv[key] = val;
    if (process.argv[i+1] && !process.argv[i+1].startsWith('--')) i++;
  }
}

if (!argv.url) {
  console.error('Usage: --url <cloudinary_url> [--name <title>] [--category <category>] [--uploaderUid <uid>] [--approved <true|false>]');
  process.exit(1);
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Please set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path');
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db = admin.firestore();

const inferResourceType = (url) => {
  const u = url.toLowerCase();
  if (u.includes('/raw/upload/')) return 'raw';
  if (u.includes('/video/upload/')) return 'video';
  if (u.includes('/image/upload/')) return 'image';
  // fallback to extension
  const path = u.split('?')[0];
  const ext = path.split('.').pop();
  const rawExts = ['pdf','doc','docx','zip','rar','7z','txt','csv','xlsx','ppt','pptx'];
  if (rawExts.includes(ext)) return 'raw';
  return 'raw';
};

const publicIdFromUrl = (url) => {
  try {
    // attempt to extract the segment after /upload/v{version}/ and before extension
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    const after = parts[1];
    // remove querystring
    const clean = after.split('?')[0];
    // drop version if present
    const tokens = clean.split('/');
    if (tokens[0].startsWith('v') && tokens.length > 1) tokens.shift();
    const filename = tokens.join('/');
    const withoutExt = filename.split('.').slice(0, -1).join('.');
    return withoutExt;
  } catch (e) {
    return null;
  }
};

(async () => {
  const url = argv.url;
  const name = argv.name || url.split('/').pop();
  const category = argv.category || '';
  const uploaderUid = argv.uploaderUid || null;
  const approved = (typeof argv.approved !== 'undefined') ? (String(argv.approved).toLowerCase() === 'true') : false;

  const resource_type = inferResourceType(url);
  const public_id = publicIdFromUrl(url);

  const fileData = {
    name,
    secure_url: url,
    public_id,
    resource_type,
    category,
    approved,
    uploaderUid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    const ref = db.collection('files').doc();
    await ref.set(fileData);
    console.log('Created document with id:', ref.id);
    process.exit(0);
  } catch (err) {
    console.error('Failed to create Firestore document:', err);
    process.exit(1);
  }
})();
