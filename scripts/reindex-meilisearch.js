/**
 * Re-index Meilisearch with minimal data
 * Deletes all documents and re-indexes with only essential fields
 */

import { MeiliSearch } from 'meilisearch';

const MEILISEARCH_HOST = 'https://minio97.chickenkiller.com/meili';
const MEILISEARCH_API_KEY = 'StrongSearchKey123';

const client = new MeiliSearch({
  host: MEILISEARCH_HOST,
  apiKey: MEILISEARCH_API_KEY
});

async function clearAndReindex() {
  console.log('🧹 Clearing all indexes...\n');

  const indexes = ['categories', 'subjects', 'materials_posts', 'posts', 'filetypes', 'educational_purposes'];

  for (const indexName of indexes) {
    try {
      const index = client.index(indexName);
      
      // Delete all documents
      console.log(`📝 Clearing ${indexName}...`);
      await index.deleteAllDocuments();
      console.log(`   ✅ ${indexName} cleared\n`);
    } catch (error) {
      console.log(`   ⚠️ ${indexName}: ${error.message}\n`);
    }
  }

  console.log('✅ All indexes cleared!');
  console.log('\n🔄 Now refresh the browser - it will automatically re-index with new simplified data!');
}

clearAndReindex().catch(console.error);
