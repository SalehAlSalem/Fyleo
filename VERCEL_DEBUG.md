# 🚨 Vercel Deployment Debug Guide

## مشكلة الشاشة البيضاء في Vercel

### ✅ الإصلاحات المُطبقة:

#### 1. **إصلاح مسار القاعدة**
```javascript
// vite.config.js - مُحدث
base: process.env.GITHUB_PAGES ? '/Fyleo/' : '/',
```
- ✅ Vercel: `/` (مسار جذر)
- ✅ GitHub Pages: `/Fyleo/` (مسار فرعي)

#### 2. **معالجة أخطاء Firebase**
```javascript
// Firebase/ClientApp.js - مُحسن
- تحقق من المتغيرات المطلوبة
- معالج للأخطاء مع fallback
- رسائل تحذير واضحة
```

#### 3. **Vercel Configuration**
```json
// vercel.json - موجود
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 🔍 **تشخيص المشكلة في Vercel:**

#### **افتح Developer Tools وتحقق من:**
1. **Console Errors**:
   ```
   F12 → Console Tab
   ```
   - ابحث عن رسائل خطأ حمراء
   - Firebase initialization errors
   - Import/Export errors

2. **Network Tab**:
   ```
   F12 → Network Tab → Reload
   ```
   - تحقق من 404 errors
   - فشل تحميل JS/CSS files

3. **Sources Tab**:
   ```
   F12 → Sources → Main thread
   ```
   - تحقق من وجود main.jsx
   - App.jsx loading

### 🚀 **المتغيرات المطلوبة في Vercel:**

#### **Environment Variables** (في Vercel Dashboard):
```
VITE_FIREBASE_API_KEY=your_actual_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# للنظام الهجين (اختياري)
VITE_GITHUB_TOKEN=your_github_token
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### 🔧 **إصلاحات إضافية:**

#### **إذا استمرت المشكلة:**
1. **تحقق من Vercel Build Logs**:
   ```
   Vercel Dashboard → Project → Deployments → View Build
   ```

2. **إعادة Deploy يدوياً**:
   ```
   Vercel Dashboard → Project → Deployments → Redeploy
   ```

3. **تحقق من Function Logs**:
   ```
   Vercel Dashboard → Project → Functions Tab
   ```

### 📱 **الاختبار الآن:**

#### **الرابط**: https://fyleo.vercel.app

#### **ما يجب أن تراه:**
- 🔄 شاشة تحميل عربية
- ✅/⚠️ رسائل في Console
- 🏠 الصفحة الرئيسية بدون أخطاء

#### **إذا كانت شاشة بيضاء:**
- افتح F12 → Console
- ابحث عن الأخطاء الحمراء
- شارك الأخطاء للمساعدة

---

*تم التحديث: 26 سبتمبر 2025*
*جامعة البلقاء التطبيقية*