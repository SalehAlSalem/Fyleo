# ✅ Meilisearch Proxy - Appwrite Function

## 📦 ما تم إنشاؤه:

```
appwrite-functions/meilisearch-proxy/
├── src/
│   └── main.js              # Function الرئيسية
├── appwrite.json            # إعدادات Function
├── package.json             # Dependencies
├── README.md                # دليل الاستخدام
├── DEPLOY_GUIDE.md          # دليل Deploy مفصّل
├── test-local.js            # اختبار محلي
└── .gitignore
```

---

## 🎯 الوظيفة:

**Meilisearch Proxy** تعمل كـ:
- 🔒 **Proxy آمن** - تخفي API Key من المتصفح
- 🚀 **Fast** - استجابة سريعة (~100ms)
- 🌐 **CORS Ready** - تعمل من أي Domain
- 📊 **Logging** - تتبع كل الطلبات
- 💰 **Free** - 2M executions مجاناً

---

## 🔧 كيف تعمل:

```
المتصفح                 Appwrite Function              Meilisearch
  |                           |                              |
  |---> POST /executions ---->|                              |
       body: { path, method } |                              |
                              |---> HTTPS + API Key -------->|
                              |    (مخفي من المتصفح)         |
                              |<--- Response ----------------<|
  |<--- Results -------------<|
```

---

## 🚀 الخطوات التالية:

### 1. Install Appwrite CLI
```bash
npm install -g appwrite
```

### 2. Deploy Function
```bash
cd appwrite-functions/meilisearch-proxy
appwrite login
appwrite deploy function
```

### 3. Configure Environment Variables
في Appwrite Console → Function Settings → Variables:
```
MEILISEARCH_HOST=https://minio97.chickenkiller.com/meili
MEILISEARCH_API_KEY=StrongSearchKey123
```

### 4. Get Function ID
بعد Deploy:
```
✅ Function deployed
Function ID: 6745abc123def456789
```

### 5. Update .env
```env
VITE_MEILISEARCH_PROXY_MODE=true
VITE_MEILISEARCH_FUNCTION_ID=6745abc123def456789
VITE_MEILISEARCH_HOST=https://cloud.appwrite.io/v1/functions/[FUNCTION_ID]/executions
```

### 6. Restart & Test
```bash
npm run dev
```

---

## 📊 الفرق بين الطرق:

| الطريقة | السرعة | الأمان | Dev/Prod |
|---------|--------|--------|----------|
| **Vite Proxy** | ⚡ ~10ms | ⚠️ Dev only | Dev |
| **Direct HTTPS** | ⚡ ~50ms | ❌ API Key ظاهر | ❌ |
| **Appwrite Function** | ✅ ~100ms | ✅ API Key مخفي | ✅ Prod |

---

## 🧪 اختبار محلي (قبل Deploy):

```bash
cd appwrite-functions/meilisearch-proxy
npm install
node test-local.js
```

**النتيجة المتوقعة:**
```
🧪 Testing Meilisearch Proxy Function
📥 Request: {"path":"/health","method":"GET"}
📝 Log: 📡 Proxying GET https://minio97.chickenkiller.com/meili/health
📝 Log: ✅ Meilisearch response: 200
📤 Response:
Status: 200
Body: { "status": "available" }
✅ Test completed successfully
```

---

## 🔒 الأمان:

### ✅ ما يحميه:
- API Key **مخفي تماماً** من المتصفح
- HTTPS **مشفر** تلقائياً
- **لا يمكن** للمستخدمين رؤية الـ API Key (حتى في Network tab)

### ⚠️ ما لا يحميه:
- Rate limiting (يمكن إضافته لاحقاً)
- IP restrictions (يمكن إضافته لاحقاً)

---

## 💰 التكلفة:

**Appwrite Free Tier:**
- 2,000,000 executions/شهر مجاناً
- 100 GB bandwidth/شهر مجاناً

**تقدير:**
- 100 بحث/يوم = 3,000/شهر
- مع البحث أثناء الكتابة = ~30,000/شهر
- **لا يزال ضمن المجاني ✅**

---

## 📝 ملاحظات مهمة:

1. **للتطوير:** استخدم Vite Proxy (أسرع)
2. **للإنتاج:** استخدم Appwrite Function (أآمن)
3. **الـ Function** تعمل على Appwrite Cloud (لا تحتاج سيرفر)
4. **مدعومة** من Appwrite بالكامل (99.9% uptime)

---

## 🐛 Troubleshooting:

### Function لا تعمل؟
```bash
# تحقق من Logs في Appwrite Console
Functions → meilisearch-proxy → Logs
```

### API Key مش مخفي؟
```bash
# تأكد من:
1. MEILISEARCH_PROXY_MODE=true في .env
2. Function ID صحيح
3. Environment Variables مضافة في Function
```

### بطيء جداً؟
```bash
# استخدم Vite Proxy للتطوير
VITE_MEILISEARCH_PROXY_MODE=false
VITE_MEILISEARCH_HOST=http://localhost:5173/api/meili
```

---

## 📚 المراجع:

- [Appwrite Functions Docs](https://appwrite.io/docs/functions)
- [Meilisearch API Reference](https://docs.meilisearch.com/reference/api)
- [Deploy Guide](./DEPLOY_GUIDE.md)
- [README](./README.md)

---

**✅ جاهز للاستخدام! ابدأ بـ Deploy!** 🚀
