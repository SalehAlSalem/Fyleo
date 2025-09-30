# 🌐 دليل ربط متغيرات البيئة مع منصات الاستضافة
# Environment Variables Hosting Guide

## نظرة عامة | Overview

بما أن Appwrite يوفر جميع الخدمات المطلوبة (قاعدة البيانات، المصادقة، التخزين) في منصة واحدة، فإن ربط متغيرات البيئة أصبح أبسط بكثير من الأنظمة التقليدية التي تتطلب خدمات متعددة.

Since Appwrite provides all required services (database, authentication, storage) in one platform, connecting environment variables is much simpler than traditional systems requiring multiple services.

## 🚀 المتغيرات المطلوبة | Required Variables

### الأساسية (مطلوبة) | Essential (Required)
```bash
VITE_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
VITE_APPWRITE_PROJECT_ID="your_project_id"
VITE_APPWRITE_DATABASE_ID="your_database_id"
VITE_APPWRITE_USERS_COLLECTION_ID="users"
VITE_APPWRITE_MATERIALS_COLLECTION_ID="materials"
VITE_APPWRITE_STORAGE_BUCKET_ID="files"
```

### الإضافية (اختيارية) | Additional (Optional)
```bash
VITE_APP_NAME="Fyleo"
VITE_APP_VERSION="2.0.0"
VITE_ENABLE_ANALYTICS=false
VITE_AUTO_APPROVE=true
```

---

## 🌐 ربط مع منصات الاستضافة | Hosting Platform Integration

### 1. 🔷 Vercel

#### الطريقة الأولى: من لوحة التحكم
1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروع Fyleo
3. اذهب إلى **Settings** → **Environment Variables**
4. أضف كل متغير:

```bash
Name: VITE_APPWRITE_ENDPOINT
Value: https://cloud.appwrite.io/v1

Name: VITE_APPWRITE_PROJECT_ID  
Value: your_actual_project_id

Name: VITE_APPWRITE_DATABASE_ID
Value: your_actual_database_id

Name: VITE_APPWRITE_USERS_COLLECTION_ID
Value: users

Name: VITE_APPWRITE_MATERIALS_COLLECTION_ID
Value: materials

Name: VITE_APPWRITE_STORAGE_BUCKET_ID
Value: files
```

#### الطريقة الثانية: Vercel CLI
```bash
# تثبيت Vercel CLI
npm i -g vercel

# ربط المشروع
vercel link

# إضافة متغيرات البيئة
vercel env add VITE_APPWRITE_ENDPOINT production
vercel env add VITE_APPWRITE_PROJECT_ID production
vercel env add VITE_APPWRITE_DATABASE_ID production
vercel env add VITE_APPWRITE_USERS_COLLECTION_ID production
vercel env add VITE_APPWRITE_MATERIALS_COLLECTION_ID production
vercel env add VITE_APPWRITE_STORAGE_BUCKET_ID production

# إعادة النشر
vercel --prod
```

---

### 2. 🐙 GitHub Pages (مع GitHub Actions)

تم إعداد GitHub Actions في `.github/workflows/deploy.yml` مسبقاً.

#### إضافة GitHub Secrets:
1. اذهب إلى مشروع GitHub: `https://github.com/SalehAlSalem/Fyleo`
2. **Settings** → **Secrets and variables** → **Actions**
3. اضغط **New repository secret** لكل متغير:

```bash
Name: VITE_APPWRITE_ENDPOINT
Secret: https://cloud.appwrite.io/v1

Name: VITE_APPWRITE_PROJECT_ID
Secret: your_actual_project_id

Name: VITE_APPWRITE_DATABASE_ID  
Secret: your_actual_database_id

Name: VITE_APPWRITE_USERS_COLLECTION_ID
Secret: users

Name: VITE_APPWRITE_MATERIALS_COLLECTION_ID
Secret: materials

Name: VITE_APPWRITE_STORAGE_BUCKET_ID
Secret: files
```

---

### 3. 🟠 Netlify

#### من لوحة التحكم:
1. اذهب إلى [Netlify Dashboard](https://app.netlify.com/)
2. اختر موقع Fyleo
3. **Site settings** → **Environment variables**
4. اضغط **Add a variable** لكل متغير

#### باستخدام Netlify CLI:
```bash
# تثبيت Netlify CLI
npm install -g netlify-cli

# ربط الموقع
netlify link

# إضافة متغيرات البيئة
netlify env:set VITE_APPWRITE_ENDPOINT "https://cloud.appwrite.io/v1"
netlify env:set VITE_APPWRITE_PROJECT_ID "your_project_id"
netlify env:set VITE_APPWRITE_DATABASE_ID "your_database_id"
netlify env:set VITE_APPWRITE_USERS_COLLECTION_ID "users"
netlify env:set VITE_APPWRITE_MATERIALS_COLLECTION_ID "materials"
netlify env:set VITE_APPWRITE_STORAGE_BUCKET_ID "files"

# إعادة النشر
netlify deploy --prod
```

---

### 4. 🟣 Railway

```bash
# تثبيت Railway CLI
npm install -g @railway/cli

# تسجيل الدخول وربط المشروع
railway login
railway link

# إضافة متغيرات البيئة
railway variables set VITE_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
railway variables set VITE_APPWRITE_PROJECT_ID="your_project_id"
railway variables set VITE_APPWRITE_DATABASE_ID="your_database_id"
railway variables set VITE_APPWRITE_USERS_COLLECTION_ID="users"
railway variables set VITE_APPWRITE_MATERIALS_COLLECTION_ID="materials"
railway variables set VITE_APPWRITE_STORAGE_BUCKET_ID="files"

# نشر
railway up
```

---

## 🛠️ اختبار الاتصال | Connection Testing

### اختبار محلي:
```bash
# إنشاء ملف .env من المثال
cp .env.example .env

# تعديل القيم الحقيقية
nano .env

# اختبار محلي
npm run dev
```

### اختبار على الإنتاج:
```javascript
// إضافة هذا الكود في console المتصفح للاختبار
console.log('Appwrite Endpoint:', import.meta.env.VITE_APPWRITE_ENDPOINT);
console.log('Project ID:', import.meta.env.VITE_APPWRITE_PROJECT_ID);
console.log('Database ID:', import.meta.env.VITE_APPWRITE_DATABASE_ID);
```

---

## 🔧 نصائح التحسين | Optimization Tips

### 1. متغيرات البيئة حسب المرحلة:
```bash
# التطوير
VITE_APPWRITE_ENDPOINT="https://localhost/v1"  # للتطوير المحلي

# الإنتاج  
VITE_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"  # للإنتاج
```

### 2. استخدام متغيرات متعددة البيئات:
```bash
# إنتاج
VITE_APPWRITE_PROJECT_ID="fyleo-production"

# اختبار
VITE_APPWRITE_PROJECT_ID="fyleo-staging"

# تطوير
VITE_APPWRITE_PROJECT_ID="fyleo-development"
```

### 3. التحقق من المتغيرات:
```javascript
// في src/config/appwrite.js
if (!import.meta.env.VITE_APPWRITE_PROJECT_ID) {
  console.error('⚠️ VITE_APPWRITE_PROJECT_ID غير محدد!');
}
```

---

## 🚨 نصائح الأمان | Security Tips

### ✅ آمن (يمكن كشفه):
- `VITE_APPWRITE_ENDPOINT`
- `VITE_APPWRITE_PROJECT_ID`  
- `VITE_APPWRITE_DATABASE_ID`
- Collection IDs
- Bucket IDs

### ❌ غير آمن (لا تكشفه):
- API Keys
- Admin Keys
- Database Passwords
- خدمات أخرى غير Appwrite

---

## 📋 قائمة تحقق | Checklist

### قبل النشر:
- [ ] إنشاء مشروع Appwrite
- [ ] إعداد Database و Collections
- [ ] إعداد Storage Bucket
- [ ] إضافة متغيرات البيئة للمنصة
- [ ] اختبار الاتصال

### بعد النشر:
- [ ] تأكيد تحميل الصفحة
- [ ] اختبار تسجيل الدخول
- [ ] اختبار رفع الملفات
- [ ] فحص console للأخطاء

---

## 🆘 استكشاف الأخطاء | Troubleshooting

### خطأ "Project not found":
```bash
# تحقق من Project ID
console.log(import.meta.env.VITE_APPWRITE_PROJECT_ID);
```

### خطأ "Database not found":
```bash
# تحقق من Database ID
console.log(import.meta.env.VITE_APPWRITE_DATABASE_ID);
```

### خطأ في البناء:
```bash
# تأكد من أن جميع متغيرات VITE_ موجودة
npm run build
```

---

## 📞 الدعم | Support

إذا واجهت مشاكل:
1. تحقق من [Appwrite Console](https://cloud.appwrite.io)
2. راجع [Appwrite Documentation](https://appwrite.io/docs)
3. افتح issue في GitHub
4. تواصل مع [Appwrite Discord](https://discord.com/invite/GSeTUeA)

---

**تم إنشاء هذا الدليل بواسطة فريق Fyleo - جامعة البلقاء التطبيقية**