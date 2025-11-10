/**
 * Test Meilisearch Proxy Function locally
 * Simulates how Appwrite Function will work
 */

import handler from './src/main.js';

// Mock Appwrite Function context
const mockContext = {
  req: {
    method: 'POST',
    body: JSON.stringify({
      path: '/health',
      method: 'GET'
    })
  },
  res: {
    json: (data, status = 200, headers = {}) => {
      console.log('\n📤 Response:');
      console.log('Status:', status);
      console.log('Headers:', headers);
      console.log('Body:', JSON.stringify(data, null, 2));
      return { data, status, headers };
    }
  },
  log: (...args) => {
    console.log('📝 Log:', ...args);
  },
  error: (...args) => {
    console.error('❌ Error:', ...args);
  }
};

// Set environment variables
process.env.MEILISEARCH_HOST = 'https://minio97.chickenkiller.com/meili';
process.env.MEILISEARCH_API_KEY = 'StrongSearchKey123';

console.log('🧪 Testing Meilisearch Proxy Function\n');
console.log('📥 Request:', mockContext.req.body);

// Run handler
handler(mockContext)
  .then(() => {
    console.log('\n✅ Test completed successfully');
  })
  .catch(error => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
