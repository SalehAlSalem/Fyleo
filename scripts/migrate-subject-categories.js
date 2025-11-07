/**
 * 🔄 Data Migration Script: CategoryId → Subject_Categories
 * 
 * This script migrates existing subject.categoryId relationships
 * to the new Many-to-Many subject_categories collection.
 * 
 * ⚠️ IMPORTANT: 
 * 1. Backup your database before running
 * 2. Create subject_categories collection first
 * 3. Test on a few subjects before running on all data
 */

import appwriteService from './src/services/appwriteService.js';

// Configuration
const DRY_RUN = false; // Set to true to test without writing to database
const TEST_LIMIT = null; // Set to a number (e.g., 5) to test on limited subjects

async function migrateSubjectCategories() {
  console.log('🔄 Starting Subject-Categories Migration...\n');
  
  if (DRY_RUN) {
    console.log('⚠️  DRY RUN MODE - No data will be written\n');
  }
  
  if (TEST_LIMIT) {
    console.log(`⚠️  TEST MODE - Processing only ${TEST_LIMIT} subjects\n`);
  }

  try {
    // Fetch all subjects
    console.log('📥 Fetching subjects...');
    const allSubjects = await appwriteService.subjects.getAll();
    const subjects = TEST_LIMIT ? allSubjects.slice(0, TEST_LIMIT) : allSubjects;
    console.log(`✅ Found ${subjects.length} subjects\n`);

    // Statistics
    let stats = {
      total: subjects.length,
      withCategory: 0,
      withoutCategory: 0,
      migrated: 0,
      alreadyExists: 0,
      errors: 0,
      errorDetails: []
    };

    // Process each subject
    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];
      const progress = `[${i + 1}/${subjects.length}]`;
      
      console.log(`${progress} Processing: ${subject.nameEn}`);

      // Check if subject has categoryId
      if (!subject.categoryId || subject.categoryId === '') {
        console.log(`   ⚠️  No categoryId - skipping`);
        stats.withoutCategory++;
        continue;
      }

      stats.withCategory++;

      // In DRY_RUN mode, just log what would happen
      if (DRY_RUN) {
        console.log(`   Would create: subjectId=${subject.$id}, categoryId=${subject.categoryId}`);
        stats.migrated++;
        continue;
      }

      // Check if link already exists
      try {
        const existingLinks = await appwriteService.subjectCategories.getBySubject(subject.$id);
        const linkExists = existingLinks.some(link => link.categoryId === subject.categoryId);
        
        if (linkExists) {
          console.log(`   ℹ️  Link already exists - skipping`);
          stats.alreadyExists++;
          continue;
        }

        // Create the link
        await appwriteService.subjectCategories.create(subject.$id, subject.categoryId);
        console.log(`   ✅ Migrated successfully`);
        stats.migrated++;
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        stats.errors++;
        stats.errorDetails.push({
          subject: subject.nameEn,
          subjectId: subject.$id,
          categoryId: subject.categoryId,
          error: error.message
        });
      }

      // Small delay to avoid rate limits
      if (i < subjects.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total subjects processed: ${stats.total}`);
    console.log(`  - With categoryId:      ${stats.withCategory}`);
    console.log(`  - Without categoryId:   ${stats.withoutCategory}`);
    console.log(`  - Successfully migrated: ${stats.migrated}`);
    console.log(`  - Already existed:       ${stats.alreadyExists}`);
    console.log(`  - Errors:                ${stats.errors}`);
    console.log('='.repeat(50));

    // Print error details if any
    if (stats.errors > 0) {
      console.log('\n❌ ERROR DETAILS:');
      stats.errorDetails.forEach((detail, index) => {
        console.log(`\n${index + 1}. Subject: ${detail.subject}`);
        console.log(`   Subject ID: ${detail.subjectId}`);
        console.log(`   Category ID: ${detail.categoryId}`);
        console.log(`   Error: ${detail.error}`);
      });
    }

    // Final status
    console.log('\n' + '='.repeat(50));
    if (stats.errors === 0) {
      console.log('✅ MIGRATION COMPLETED SUCCESSFULLY!');
    } else {
      console.log('⚠️  MIGRATION COMPLETED WITH ERRORS');
      console.log('   Please review the errors above and fix manually.');
    }
    console.log('='.repeat(50));

    // Next steps
    if (!DRY_RUN && stats.migrated > 0) {
      console.log('\n📝 NEXT STEPS:');
      console.log('1. ✅ Verify links in Appwrite Console (subject_categories collection)');
      console.log('2. ✅ Test the application thoroughly');
      console.log('3. ✅ Verify all subjects appear under correct categories');
      console.log('4. ⚠️  Optional: Remove categoryId field from subjects collection');
      console.log('      (Only after confirming everything works!)');
    }

  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error);
    console.error('Migration aborted.');
    process.exit(1);
  }
}

// Run the migration
console.log('╔═══════════════════════════════════════════════╗');
console.log('║   Subject-Categories Migration Script        ║');
console.log('║   One-to-Many → Many-to-Many                  ║');
console.log('╚═══════════════════════════════════════════════╝\n');

migrateSubjectCategories()
  .then(() => {
    console.log('\n✅ Script finished.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
