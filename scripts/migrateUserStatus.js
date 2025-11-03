/**
 * Migration Script: Add status field to all existing users
 * Run once to ensure all users have a status field
 */

import { Client, Databases, Query } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_URL || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY); // You need to set this in .env

const databases = new Databases(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const USERS_COLLECTION_ID = process.env.VITE_APPWRITE_USERS_COLLECTION_ID;

async function migrateUserStatus() {
  try {
    console.log('🚀 Starting user status migration...');
    console.log(`📊 Database ID: ${DATABASE_ID}`);
    console.log(`📊 Collection ID: ${USERS_COLLECTION_ID}`);
    
    // Get all users
    const response = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.limit(1000)]
    );
    
    console.log(`📋 Found ${response.documents.length} users`);
    
    let updated = 0;
    let skipped = 0;
    let failed = 0;
    
    for (const user of response.documents) {
      try {
        // Check if user already has status field
        if (user.status !== undefined) {
          console.log(`⏭️  User ${user.$id} already has status: ${user.status}`);
          skipped++;
          continue;
        }
        
        // Add status field (default to true = active)
        await databases.updateDocument(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          user.$id,
          { status: true }
        );
        
        console.log(`✅ Updated user ${user.$id} with status: true`);
        updated++;
      } catch (err) {
        console.error(`❌ Failed to update user ${user.$id}:`, err.message);
        failed++;
      }
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`✅ Updated: ${updated}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📋 Total: ${response.documents.length}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateUserStatus();
