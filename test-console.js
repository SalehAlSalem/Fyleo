// Test Meilisearch Connection - Simple Version
// Run this in browser console (F12)

console.log('🧪 Starting Meilisearch Connection Test...\n');

const MEILISEARCH_HOST = 'https://minio97.chickenkiller.com/meili';
const API_KEY = 'StrongSearchKey123';

// Test 1: Simple fetch without authorization
console.log('Test 1: Simple GET without auth');
fetch(`${MEILISEARCH_HOST}/health`)
  .then(r => {
    console.log('✅ Test 1 SUCCESS - Status:', r.status);
    return r.json();
  })
  .then(data => console.log('✅ Test 1 Data:', data))
  .catch(e => console.error('❌ Test 1 FAILED:', e.message));

// Wait 2 seconds before Test 2
setTimeout(() => {
  console.log('\nTest 2: GET with Authorization header');
  fetch(`${MEILISEARCH_HOST}/health`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  })
    .then(r => {
      console.log('✅ Test 2 SUCCESS - Status:', r.status);
      return r.json();
    })
    .then(data => console.log('✅ Test 2 Data:', data))
    .catch(e => console.error('❌ Test 2 FAILED:', e.message));
}, 2000);

// Wait 4 seconds before Test 3
setTimeout(() => {
  console.log('\nTest 3: POST request (search)');
  fetch(`${MEILISEARCH_HOST}/indexes/subjects/search`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ q: 'test', limit: 5 })
  })
    .then(r => {
      console.log('✅ Test 3 SUCCESS - Status:', r.status);
      return r.json();
    })
    .then(data => console.log('✅ Test 3 Data:', data))
    .catch(e => console.error('❌ Test 3 FAILED:', e.message));
}, 4000);

console.log('\n⏳ Tests running... Check results above in 6 seconds.\n');
