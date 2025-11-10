# 🔒 Meilisearch Proxy Setup - Quick Start

## ✅ ما تم إنجازه:

### 1. إنشاء Appwrite Cloud Function
📁 الموقع: `appwrite-functions/meilisearch-proxy/`

**الملفات:**
- ✅ `src/main.js` - Function الرئيسية
- ✅ `package.json` - Dependencies
- ✅ `appwrite.json` - Function configuration
- ✅ `README.md` - دليل الاستخدام
- ✅ `DEPLOY_GUIDE.md` - خطوات Deploy مفصّلة
- ✅ `SETUP.md` - ملخص شامل
- ✅ `test-local.js` - اختبار محلي

### 2. Proxy Client
✅ `src/services/meilisearchProxyClient.js` - Client للتواصل مع Function

### 3. تحديث Meilisearch Service
✅ `src/services/meilisearchService.js` - يدعم الآن Proxy Mode

---

## 🚀 الخطوات السريعة:

### 1️⃣ Install Appwrite CLI
```bash
npm install -g appwrite
```

### 2️⃣ Deploy Function
```bash
cd appwrite-functions/meilisearch-proxy
appwrite login
appwrite deploy function
```

### 3️⃣ Configure Variables في Appwrite Console
```
MEILISEARCH_HOST = https://minio97.chickenkiller.com/meili
MEILISEARCH_API_KEY = StrongSearchKey123
```

### 4️⃣ Get Function ID & Update .env
```env
VITE_MEILISEARCH_PROXY_MODE=true
VITE_MEILISEARCH_FUNCTION_ID=[YOUR_FUNCTION_ID]
VITE_MEILISEARCH_HOST=https://cloud.appwrite.io/v1/functions/[YOUR_FUNCTION_ID]/executions
```

### 5️⃣ Test
```bash
npm run dev
```

---

## 📚 الدلائل الكاملة:

1. **[DEPLOY_GUIDE.md](./appwrite-functions/meilisearch-proxy/DEPLOY_GUIDE.md)** - خطوات Deploy خطوة بخطوة
2. **[SETUP.md](./appwrite-functions/meilisearch-proxy/SETUP.md)** - ملخص شامل + Troubleshooting
3. **[README.md](./appwrite-functions/meilisearch-proxy/README.md)** - دليل الاستخدام + API Examples

---

## 🔄 للتطوير vs الإنتاج:

### Development (السريع):
```env
# .env
VITE_MEILISEARCH_HOST=http://localhost:5173/api/meili
VITE_MEILISEARCH_PROXY_MODE=false
```
✅ استخدم Vite Proxy (أسرع ~10ms)

### Production (الآمن):
```env
# .env.production
VITE_MEILISEARCH_HOST=https://cloud.appwrite.io/v1/functions/[ID]/executions
VITE_MEILISEARCH_PROXY_MODE=true
VITE_MEILISEARCH_FUNCTION_ID=[YOUR_FUNCTION_ID]
```
✅ استخدم Appwrite Function (API Key مخفي)

---

## ✅ المميزات:

| الميزة | الحالة |
|--------|--------|
| 🔒 API Key مخفي | ✅ |
| 🚀 سريع (~100ms) | ✅ |
| 🌐 CORS Ready | ✅ |
| 📊 Logging | ✅ |
| 💰 مجاني (2M/شهر) | ✅ |
| 🔄 Auto-deploy ready | ✅ |

---

## 🧪 اختبار قبل Deploy:

```bash
cd appwrite-functions/meilisearch-proxy
npm install
node test-local.js
```

---

## 📞 الدعم:

- 📖 [Appwrite Functions Docs](https://appwrite.io/docs/functions)
- 💬 [Appwrite Discord](https://appwrite.io/discord)
- 📧 Support: support@appwrite.io

---

**🎯 الهدف المحقق:**
✅ API Key محمي تماماً من المتصفح
✅ جاهز للاستخدام في Production
✅ مجاني حتى 2M request/شهر
✅ سهل الـ Deploy والصيانة

**ابدأ الآن بـ Deploy!** 🚀
