# 🚀 Deploy Meilisearch Proxy to Appwrite

## 📋 المتطلبات

- حساب Appwrite Cloud (مجاني)
- Appwrite CLI مثبت: `npm install -g appwrite`
- Project ID: `68d979280007a4dfd3db`

---

## 🔧 الخطوات

### 1️⃣ تسجيل الدخول إلى Appwrite CLI

```bash
appwrite login
```

سيفتح المتصفح - سجل دخول بحساب Appwrite

---

### 2️⃣ ربط المشروع

```bash
cd appwrite-functions/meilisearch-proxy
appwrite init function
```

**اختر:**
- Project: `Fyleo (68d979280007a4dfd3db)`
- Function ID: `meilisearch-proxy`
- Runtime: `Node.js 18.0`
- Entrypoint: `src/main.js`

---

### 3️⃣ إعداد Environment Variables

في Appwrite Console:

1. اذهب إلى: **Functions** → **meilisearch-proxy** → **Settings** → **Variables**
2. أضف:

```
MEILISEARCH_HOST = https://minio97.chickenkiller.com/meili
MEILISEARCH_API_KEY = StrongSearchKey123
```

---

### 4️⃣ Deploy Function

```bash
appwrite deploy function
```

**اختر:** `meilisearch-proxy`

سينشئ:
- Build Docker container
- Install dependencies
- Deploy function
- Generate Function ID

---

### 5️⃣ احصل على Function ID

بعد Deploy، ستحصل على:
```
✅ Function deployed successfully
Function ID: 6745abc123def456789
```

---

### 6️⃣ اختبر Function

```bash
# Health check test
curl -X POST \
  https://cloud.appwrite.io/v1/functions/[FUNCTION_ID]/executions \
  -H "Content-Type: application/json" \
  -H "X-Appwrite-Project: 68d979280007a4dfd3db" \
  -d '{
    "path": "/health",
    "method": "GET"
  }'
```

**النتيجة المتوقعة:**
```json
{
  "status": "available"
}
```

---

### 7️⃣ حدّث `.env` في المشروع

```env
# أضف هذه السطور في .env
VITE_MEILISEARCH_PROXY_MODE=true
VITE_MEILISEARCH_FUNCTION_ID=6745abc123def456789
VITE_MEILISEARCH_HOST=https://cloud.appwrite.io/v1/functions/6745abc123def456789/executions
```

---

### 8️⃣ أعد تشغيل Dev Server

```bash
npm run dev
```

---

### 9️⃣ اختبر من المتصفح

افتح Console في المتصفح:

```javascript
// Test health
fetch('https://cloud.appwrite.io/v1/functions/[FUNCTION_ID]/executions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Appwrite-Project': '68d979280007a4dfd3db'
  },
  body: JSON.stringify({
    path: '/health',
    method: 'GET'
  })
})
.then(r => r.json())
.then(console.log);
```

---

## ✅ التحقق من النجاح

يجب أن ترى في Console:

```
🔒 Using Appwrite Function Proxy Mode
✅ Meilisearch server is healthy
🔍 Meilisearch global search: "test"
✅ Search completed
```

---

## 🐛 Troubleshooting

### ❌ Error: "Function not found"
→ تأكد من Function ID صحيح في `.env`

### ❌ Error: "MEILISEARCH_API_KEY not configured"
→ أضف Environment Variables في Appwrite Console

### ❌ Error: "Unauthorized"
→ تأكد من `X-Appwrite-Project` header موجود

### ❌ Error: "CORS"
→ Function تتضمن CORS headers تلقائياً - تأكد من التحديث

---

## 📊 الفرق بين Dev و Production

| البيئة | الطريقة | الملف |
|--------|---------|-------|
| **Development** | Vite Proxy | `.env` |
| **Production** | Appwrite Function | `.env.production` |

### `.env` (Development):
```env
# استخدم Vite Proxy للسرعة
VITE_MEILISEARCH_HOST=http://localhost:5173/api/meili
VITE_MEILISEARCH_PROXY_MODE=false
```

### `.env.production` (Production):
```env
# استخدم Appwrite Function للأمان
VITE_MEILISEARCH_HOST=https://cloud.appwrite.io/v1/functions/[FUNCTION_ID]/executions
VITE_MEILISEARCH_PROXY_MODE=true
VITE_MEILISEARCH_FUNCTION_ID=[FUNCTION_ID]
```

---

## 🔄 التحديثات المستقبلية

لتحديث Function:

```bash
cd appwrite-functions/meilisearch-proxy
# عدّل src/main.js
appwrite deploy function
```

---

## 💰 التكلفة

**مجاناً حتى:**
- 2,000,000 executions/شهر
- 100 GB bandwidth/شهر

**بعد ذلك:**
- $0.40 لكل مليون execution
- $0.04 لكل GB bandwidth

**البحث العادي:**
- ~100 searches/يوم = 3000/شهر
- تكلفة = $0.00 (ضمن المجاني ✅)

---

## 📝 ملاحظات

- Function تشتغل على Appwrite Cloud (آمن ✅)
- API Key مخفي تماماً من المتصفح
- HTTPS مشفر تلقائياً
- Logging كامل في Appwrite Console
- يعمل من أي Domain بدون CORS issues

---

**✅ جاهز للاستخدام في Production!**
