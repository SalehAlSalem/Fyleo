# 🚀 دليل متغيرات البيئة للاستضافة - Fyleo مع MinIO

## 📋 المتغيرات المطلوبة للاستضافة

### 🔥 **المتغيرات الأساسية (ضرورية)**

```bash
# 📡 Appwrite (قاعدة البيانات والمصادقة فقط)
VITE_APPWRITE_URL=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=68d9740b0012416cb71b
VITE_APPWRITE_DATABASE_ID=68d97982002b686c7151

# 🗄️ MinIO (التخزين الرئيسي)
VITE_MINIO_ENDPOINT=79.76.119.182
VITE_MINIO_PORT=9000
VITE_MINIO_USE_SSL=false
VITE_MINIO_ACCESS_KEY=minioadmin
VITE_MINIO_SECRET_KEY=minioadmin
VITE_MINIO_BUCKET_NAME=appwrite-storage

# 📁 Collections
VITE_APPWRITE_FILES_COLLECTION_ID=materials
VITE_APPWRITE_USERS_COLLECTION_ID=users
VITE_APPWRITE_BOOKMARKS_COLLECTION_ID=bookmarks
VITE_APPWRITE_DOWNLOADS_COLLECTION_ID=downloads
```

### 🎛️ **المتغيرات الاختيارية (للتحسين)**

```bash
# 📱 التطبيق
VITE_APP_NAME=Fyleo
VITE_APP_VERSION=3.0.0
NODE_ENV=production

# 📁 إعدادات الملفات
VITE_MAX_FILE_SIZE=104857600
VITE_ALLOWED_FILE_TYPES=pdf,doc,docx,ppt,pptx,xls,xlsx,txt,jpg,jpeg,png,gif,mp4,mp3,zip,rar

# 🎨 واجهة المستخدم
VITE_DEFAULT_LANGUAGE=ar
VITE_ENABLE_DARK_MODE=true
VITE_DEBUG_MODE=false
```

## 🌐 إعداد المتغيرات حسب منصة الاستضافة

### 📘 **Vercel**
1. اذهب إلى dashboard.vercel.com
2. اختر مشروعك
3. Settings → Environment Variables
4. أضف كل متغير على حدة:
```
Name: VITE_APPWRITE_URL
Value: https://fra.cloud.appwrite.io/v1

Name: VITE_APPWRITE_PROJECT_ID  
Value: 68d9740b0012416cb71b

Name: VITE_MINIO_ENDPOINT
Value: 79.76.119.182
```

### 📗 **Netlify**
1. اذهب إلى app.netlify.com
2. Site settings → Environment variables
3. أضف المتغيرات:
```
Key: VITE_APPWRITE_URL
Value: https://fra.cloud.appwrite.io/v1
```

### 📙 **GitHub Pages + Actions**
أنشئ ملف `.github/workflows/deploy.yml`:
```yaml
env:
  VITE_APPWRITE_URL: https://fra.cloud.appwrite.io/v1
  VITE_APPWRITE_PROJECT_ID: 68d9740b0012416cb71b
  VITE_MINIO_ENDPOINT: 79.76.119.182
```

## 🔐 الأمان والحماية

### ⚠️ **متغيرات حساسة (لا تضعها في الكود)**
```bash
# ❌ لا تضع هذه في GitHub
VITE_MINIO_ACCESS_KEY=minioadmin
VITE_MINIO_SECRET_KEY=minioadmin
```

### ✅ **متغيرات آمنة للعرض**
```bash
# ✅ آمنة للعرض العام
VITE_APPWRITE_URL=https://fra.cloud.appwrite.io/v1
VITE_MINIO_ENDPOINT=79.76.119.182
VITE_APP_NAME=Fyleo
```

## 🧪 اختبار المتغيرات

### 1. **التحقق من المتغيرات محلياً**
```bash
# في الكونسول
console.log('MinIO:', import.meta.env.VITE_MINIO_ENDPOINT)
console.log('Appwrite:', import.meta.env.VITE_APPWRITE_URL)
```

### 2. **صفحة اختبار**
أضف هذا الكود في `src/test-env.jsx`:
```javascript
export default function TestEnv() {
  return (
    <div style={{padding: '20px', fontFamily: 'monospace'}}>
      <h2>Environment Variables Test</h2>
      <ul>
        <li>MinIO Endpoint: {import.meta.env.VITE_MINIO_ENDPOINT}</li>
        <li>Appwrite URL: {import.meta.env.VITE_APPWRITE_URL}</li>
        <li>Project ID: {import.meta.env.VITE_APPWRITE_PROJECT_ID}</li>
        <li>App Name: {import.meta.env.VITE_APP_NAME}</li>
      </ul>
    </div>
  )
}
```

## 🚀 خطوات النشر

### 1. **تحضير الكود**
```bash
# تأكد من بناء المشروع
npm run build

# اختبر محلياً
npm run preview
```

### 2. **تحميل المتغيرات**
- انسخ من `.env.production`
- الصق في منصة الاستضافة
- تأكد من جميع المتغيرات

### 3. **اختبار النشر**
- تحقق من رفع الملفات
- اختبر تحميل الملفات  
- تأكد من حذف الملفات

## 🔧 استكشاف الأخطاء

### ❌ **مشاكل شائعة**

**1. خطأ: "MinIO Service not initialized"**
```bash
# تأكد من:
VITE_MINIO_ENDPOINT=79.76.119.182
VITE_MINIO_PORT=9000
```

**2. خطأ: "Appwrite configuration missing"**
```bash
# تأكد من:
VITE_APPWRITE_URL=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=68d9740b0012416cb71b
```

**3. خطأ: "Collection not found"**
```bash
# تأكد من:
VITE_APPWRITE_FILES_COLLECTION_ID=materials
VITE_APPWRITE_DATABASE_ID=68d97982002b686c7151
```

### ✅ **حلول سريعة**

**إعادة تشغيل Build:**
```bash
# احذف cache
rm -rf dist/
rm -rf node_modules/.vite/

# أعد البناء
npm run build
```

**التحقق من المتغيرات:**
```javascript
// في الكونسول
Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
```

## 📞 الدعم

إذا واجهت مشاكل:
1. تحقق من logs المتصفح (F12)
2. تأكد من وصول خادم MinIO (79.76.119.182:9000)
3. تحقق من اتصال Appwrite
4. راجع هذا الدليل

---
**✅ بهذه المتغيرات، موقعك سيعمل بالكامل مع MinIO كخدمة التخزين الرئيسية!**