#!/usr/bin/env node
import admin from 'firebase-admin';
import fs from 'fs';

// Usage:
// Provide either GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_JSON as env var.
// Then run:
// node scripts/set_uploader_by_email.mjs --email user@example.com --uid TARGET_UID
// This will set uploaderUid = TARGET_UID and approved = true for all files where email == user@example.com

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const val = args[i+1] && !args[i+1].startsWith('--') ? args[i+1] : true;
      out[key] = val;
      if (val !== true) i++;
    }
  }
  return out;
}

async function main() {
  const opts = parseArgs();
  if (!opts.email || !opts.uid) {
    console.error('Missing required args. Usage: --email user@example.com --uid TARGET_UID');
    process.exit(1);
  }

  let serviceAccount = null;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const p = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (fs.existsSync(p)) {
      serviceAccount = JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  }
  if (!serviceAccount) {
    console.error('No service account provided. Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_JSON.');
    process.exit(1);
  }

  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  const db = admin.firestore();

  console.log(`Searching files with email == ${opts.email}...`);
  const filesRef = db.collection('files');
  const snapshot = await filesRef.where('email', '==', opts.email).get();
  console.log(`Found ${snapshot.size} documents.`);
  if (snapshot.empty) {
    process.exit(0);
  }

  const batch = db.batch();
  let count = 0;
  snapshot.docs.forEach((docSnap) => {
    const ref = docSnap.ref;
    batch.update(ref, { uploaderUid: opts.uid, approved: true });
    count++;
  });

  await batch.commit();
  console.log(`Updated ${count} documents: set uploaderUid=${opts.uid} and approved=true`);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
