#!/usr/bin/env node
import admin from 'firebase-admin';
import fs from 'fs';

// Usage:
// 1) Place your service account JSON somewhere safe and set GOOGLE_APPLICATION_CREDENTIALS to its path, OR
// 2) Set environment variable FIREBASE_SERVICE_ACCOUNT_JSON containing the JSON string.
// Then run: node scripts/approve_all_files.mjs

async function main() {
  try {
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

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    const db = admin.firestore();
    console.log('Connected to Firestore. Scanning files collection...');

    const filesRef = db.collection('files');
    // Query documents where approved == false OR where approved field is missing
    const snapshot = await filesRef.where('approved', '==', false).get();
    console.log(`Found ${snapshot.size} documents with approved==false.`);

    if (snapshot.empty) {
      console.log('Nothing to update. Exiting.');
      process.exit(0);
    }

    const batchSize = 500; // Firestore batch limit
    let batch = db.batch();
    let count = 0;
    let batches = 0;

    for (const docSnap of snapshot.docs) {
      const ref = docSnap.ref;
      batch.update(ref, { approved: true });
      count++;
      if (count % batchSize === 0) {
        await batch.commit();
        batches++;
        console.log(`Committed batch ${batches}, updated ${count} docs so far.`);
        batch = db.batch();
      }
    }

    // commit remaining
    if (count % batchSize !== 0) {
      await batch.commit();
      batches++;
      console.log(`Committed final batch ${batches}, total updated ${count}.`);
    }

    console.log('All done.');
    process.exit(0);
  } catch (err) {
    console.error('Error updating documents:', err);
    process.exit(1);
  }
}

main();
