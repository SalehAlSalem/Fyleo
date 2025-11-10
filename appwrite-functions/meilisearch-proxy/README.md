# Meilisearch Proxy - Appwrite Cloud Function

## 🎯 الغرض

Function آمنة تعمل كـ **Proxy** بين المتصفح و Meilisearch، تخفي الـ API Key من المستخدمين.

---

## 🔧 الإعداد

### 1. إنشاء Function في Appwrite Console

```bash
# عبر Appwrite Console:
1. Functions → Create Function
2. Name: meilisearch-proxy
3. Runtime: Node.js 18
4. Execute Access: Any
5. Upload الملفات من هذا المجلد
```

### 2. إعداد Environment Variables

في Function Settings → Variables:

```
MEILISEARCH_HOST=https://minio97.chickenkiller.com/meili
MEILISEARCH_API_KEY=StrongSearchKey123
```

### 3. Deploy

```bash
# من Appwrite Console:
- اضغط Deploy
- انتظر حتى ينتهي Build
```

---

## 📡 الاستخدام

### من المتصفح (JavaScript):

```javascript
// GET request (health check)
const response = await fetch(
  'https://fyleo.appwrite.network/v1/functions/[FUNCTION_ID]/executions',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: '/health',
      method: 'GET'
    })
  }
);
const data = await response.json();
console.log(data); // { status: 'available' }
```

```javascript
// POST request (search)
const response = await fetch(
  'https://fyleo.appwrite.network/v1/functions/[FUNCTION_ID]/executions',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: '/indexes/materials_posts/search',
      method: 'POST',
      body: {
        q: 'mathematics',
        limit: 10
      }
    })
  }
);
const results = await response.json();
```

---

## 🔒 الأمان

### ✅ مزايا:

1. **API Key مخفي تماماً** - لا يظهر في المتصفح أبداً
2. **HTTPS فقط** - كل الاتصالات مشفرة
3. **CORS مهيأ** - يعمل من أي Domain
4. **Logging كامل** - تتبع كل الطلبات

### ⚠️ ملاحظات:

- الـ Function تشتغل على Appwrite Cloud (آمن ✅)
- لا يوجد rate limiting (ممكن تضيفه لاحقاً)
- مجانية لحد 2M executions/شهر

---

## 🧪 اختبار

### Test Script:

```javascript
// test-proxy.js
const FUNCTION_ID = 'YOUR_FUNCTION_ID';
const ENDPOINT = `https://fyleo.appwrite.network/v1/functions/${FUNCTION_ID}/executions`;

async function testProxy() {
  // Test 1: Health check
  console.log('🧪 Testing health check...');
  const health = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: '/health', method: 'GET' })
  });
  console.log('Health:', await health.json());

  // Test 2: Search
  console.log('🧪 Testing search...');
  const search = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: '/indexes/materials_posts/search',
      method: 'POST',
      body: { q: 'test', limit: 5 }
    })
  });
  console.log('Search results:', await search.json());
}

testProxy();
```

---

## 🚀 التكامل مع الكود

بعد Deploy، عدّل `.env`:

```env
# قبل (Vite Proxy):
VITE_MEILISEARCH_HOST=http://localhost:5173/api/meili

# بعد (Appwrite Function):
VITE_MEILISEARCH_HOST=https://fyleo.appwrite.network/v1/functions/[FUNCTION_ID]/executions
VITE_MEILISEARCH_PROXY_MODE=true
```

---

## 📊 الأداء

| الطريقة | الوقت | الأمان | التكلفة |
|---------|-------|--------|---------|
| Vite Proxy (Dev) | ~10ms | ⚠️ | مجاني |
| Direct HTTPS | ~50ms | ❌ API Key ظاهر | مجاني |
| **Appwrite Function** | **~100ms** | ✅ آمن تماماً | مجاني (2M/شهر) |

---

## 🐛 Troubleshooting

### Error: "MEILISEARCH_API_KEY not configured"
→ تأكد من إضافة Environment Variables في Function Settings

### Error: "Invalid JSON"
→ تأكد من إرسال `Content-Type: application/json`

### Error: 429 Too Many Requests
→ وصلت لـ Rate Limit (نادر جداً)

---

## 📝 To-Do (اختياري)

- [ ] إضافة Rate Limiting
- [ ] إضافة Caching layer
- [ ] إضافة Request validation
- [ ] إضافة Metrics/Analytics
- [ ] إضافة IP Whitelist

---

**✅ جاهزة للاستخدام!**
