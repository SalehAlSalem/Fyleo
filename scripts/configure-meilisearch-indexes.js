/**
 * Meilisearch Index Configuration Script
 * 
 * Updates index settings for optimal search performance
 * Run this once to configure all indexes properly
 */

import { MeiliSearch } from 'meilisearch';

// Meilisearch Configuration (Caddy Reverse Proxy with HTTPS + SSL)
const MEILISEARCH_HOST = 'https://minio97.chickenkiller.com/meili';
const MEILISEARCH_API_KEY = 'StrongSearchKey123';

const client = new MeiliSearch({
  host: MEILISEARCH_HOST,
  apiKey: MEILISEARCH_API_KEY,
  headers: {
    'Authorization': `Bearer ${MEILISEARCH_API_KEY}`
  }
});

const indexConfigurations = {
  'materials_posts': {
    searchableAttributes: [
      'title',
      'description',
    ],
    filterableAttributes: [],
    sortableAttributes: [
      '$createdAt',
    ],
    rankingRules: [
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness',
    ],
    displayedAttributes: ['$id', 'title', 'description', '$createdAt'],
    pagination: {
      maxTotalHits: 2000,
    },
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 4,
        twoTypos: 8,
      },
    },
  },
  'posts': {
    searchableAttributes: [
      'title',
      'contentText',
    ],
    filterableAttributes: [],
    sortableAttributes: [
      '$createdAt',
    ],
    rankingRules: [
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness',
    ],
    displayedAttributes: ['$id', 'title', 'contentText', '$createdAt'],
    pagination: {
      maxTotalHits: 2000,
    },
    typoTolerance: {
      enabled: true,
    },
  },
  'subjects': {
    searchableAttributes: [
      'nameEn',
      'nameAr',
      'descriptionEn',
      'descriptionAr',
    ],
    filterableAttributes: [
      'categoryIds',
      'level',
      'isActive',
      'order',
    ],
    sortableAttributes: [
      'nameEn',
      'nameAr',
      'order',
    ],
    displayedAttributes: ['*'],
    pagination: {
      maxTotalHits: 1000,
    },
    typoTolerance: {
      enabled: true,
    },
  },
  'categories': {
    searchableAttributes: [
      'nameEn',
      'nameAr',
      'descriptionEn',
      'descriptionAr',
    ],
    filterableAttributes: [
      'isActive',
      'order',
    ],
    sortableAttributes: [
      'nameEn',
      'nameAr',
      'order',
    ],
    displayedAttributes: ['*'],
    pagination: {
      maxTotalHits: 500,
    },
    typoTolerance: {
      enabled: true,
    },
  },
  'filetypes': {
    searchableAttributes: [
      'nameEn',
      'nameAr',
    ],
    filterableAttributes: [
      'educationalPurposeId',
      'isActive',
    ],
    sortableAttributes: [
      'nameEn',
      'nameAr',
    ],
    displayedAttributes: ['*'],
    pagination: {
      maxTotalHits: 200,
    },
    typoTolerance: {
      enabled: true,
    },
  },
  'educational_purposes': {
    searchableAttributes: [
      'nameEn',
      'nameAr',
      'descriptionEn',
      'descriptionAr',
    ],
    filterableAttributes: [
      'isActive',
      'order',
    ],
    sortableAttributes: [
      'nameEn',
      'nameAr',
      'order',
    ],
    displayedAttributes: ['*'],
    pagination: {
      maxTotalHits: 200,
    },
    typoTolerance: {
      enabled: true,
    },
  },
};

async function updateIndexSettings() {
  console.log('🔧 Updating Meilisearch index settings...\n');

  try {
    // Check health
    const health = await client.health();
    console.log('✅ Meilisearch is healthy:', health);

    for (const [indexName, config] of Object.entries(indexConfigurations)) {
      console.log(`\n📝 Configuring index: ${indexName}`);
      
      try {
        const index = client.index(indexName);
        
        // Update settings
        const task = await index.updateSettings(config);
        console.log(`   ⏳ Update task enqueued: ${task.taskUid}`);
        
        // Wait a bit for the task to complete (tasks are usually fast)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log(`   ✅ Settings update initiated successfully`);
        
      } catch (error) {
        console.error(`   ❌ Error updating ${indexName}:`, error.message);
      }
    }

    console.log('\n✅ All index settings updated successfully!');
    
  } catch (error) {
    console.error('\n❌ Failed to update index settings:', error);
    throw error;
  }
}

// Run the script
updateIndexSettings()
  .then(() => {
    console.log('\n🎉 Index configuration complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Configuration failed:', error);
    process.exit(1);
  });
