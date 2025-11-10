/**
 * Meilisearch Connection Test
 * 
 * Quick test to verify:
 * - Connection to Caddy reverse proxy
 * - HTTPS/SSL working
 * - Authorization header
 * - Index accessibility
 */

import { MeiliSearch } from 'meilisearch';

const MEILISEARCH_HOST = 'https://minio97.chickenkiller.com/meili';
const MEILISEARCH_API_KEY = 'StrongSearchKey123';

const client = new MeiliSearch({
  host: MEILISEARCH_HOST,
  apiKey: MEILISEARCH_API_KEY,
  headers: {
    'Authorization': `Bearer ${MEILISEARCH_API_KEY}`
  }
});

async function testConnection() {
  console.log('🧪 Testing Meilisearch Connection...\n');
  console.log(`📍 Host: ${MEILISEARCH_HOST}`);
  console.log(`🔑 Using API Key: ${MEILISEARCH_API_KEY.substring(0, 10)}...\n`);

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const health = await client.health();
    console.log('   ✅ Health:', health);

    // Test 2: Get Version
    console.log('\n2️⃣ Getting Meilisearch version...');
    const version = await client.getVersion();
    console.log('   ✅ Version:', version.pkgVersion);

    // Test 3: List Indexes
    console.log('\n3️⃣ Listing indexes...');
    const indexes = await client.getIndexes();
    console.log(`   ✅ Found ${indexes.results.length} indexes:`);
    indexes.results.forEach(idx => {
      console.log(`      - ${idx.uid} (${idx.primaryKey || 'no primary key'})`);
    });

    // Test 4: Test Search on materials_posts
    console.log('\n4️⃣ Testing search on materials_posts...');
    const materialsIndex = client.index('materials_posts');
    const searchResults = await materialsIndex.search('', { limit: 5 });
    console.log(`   ✅ Search successful! Found ${searchResults.hits.length} documents`);
    if (searchResults.hits.length > 0) {
      console.log(`      First document: "${searchResults.hits[0].title || searchResults.hits[0].nameEn}"`);
    }

    // Test 5: Get Index Stats
    console.log('\n5️⃣ Getting index statistics...');
    for (const idx of indexes.results) {
      const stats = await client.index(idx.uid).getStats();
      console.log(`   📊 ${idx.uid}: ${stats.numberOfDocuments} documents, ${stats.isIndexing ? 'indexing...' : 'ready'}`);
    }

    console.log('\n\n🎉 All tests passed! Meilisearch is working perfectly!');
    console.log('✅ HTTPS connection via Caddy reverse proxy');
    console.log('✅ SSL certificate valid');
    console.log('✅ Authorization working');
    console.log('✅ Indexes accessible');
    console.log('✅ Search functionality working');

  } catch (error) {
    console.error('\n❌ Connection test failed:', error.message);
    console.error('\nDetails:', error);
    
    console.log('\n🔍 Troubleshooting tips:');
    console.log('1. Verify Meilisearch is running: curl https://minio97.chickenkiller.com/meili/health');
    console.log('2. Check API key is correct');
    console.log('3. Verify CORS settings in Caddy config');
    console.log('4. Check firewall/proxy settings');
    
    process.exit(1);
  }
}

testConnection();
