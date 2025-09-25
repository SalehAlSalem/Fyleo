# 🚀 دليل النشر على GitHub Pages

## 📋 خطوات النشر التلقائي

### 1. إعداد GitHub Secrets

اذهب إلى repository settings > Secrets and variables > Actions وأضف:

#### Firebase Configuration:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

#### Hybrid Storage Configuration:
```
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
VITE_GITHUB_OWNER=SalehAlSalem
VITE_GITHUB_REPO=Fyleo
VITE_SUPABASE_URL=https://xxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI...
```

### 2. تفعيل GitHub Pages

1. اذهب إلى Settings > Pages
2. في Source، اختر "GitHub Actions"
3. احفظ الإعدادات

### 3. النشر التلقائي

- ✅ النشر يحدث تلقائياً عند push إلى main branch
- ✅ يمكن تشغيله يدوياً من Actions tab
- ✅ البناء والنشر يتم في أقل من 5 دقائق

### 4. رابط الموقع

بعد النشر الأول، سيكون الموقع متاح على:
```
https://salehalsalem.github.io/Fyleo/
```

## 🔧 مميزات النشر

- ✅ **نشر تلقائي**: كل push يؤدي لنشر جديد
- ✅ **بناء سريع**: Node.js 18 مع npm cache
- ✅ **أمان**: المتغيرات محمية في GitHub Secrets
- ✅ **SSL مجاني**: HTTPS تلقائياً
- ✅ **CDN سريع**: توزيع عالمي من GitHub

## 📊 مراقبة النشر

- تابع العملية في **Actions** tab
- رسائل البناء تظهر في كل commit
- لوق مفصل لكل خطوة

## 🚨 استكشاف الأخطاء

### خطأ في البناء:
- تحقق من صحة GitHub Secrets
- تأكد من وجود جميع المتغيرات المطلوبة

### خطأ في النشر:
- تأكد من تفعيل GitHub Pages
- تحقق من صلاحيات repository

---

**الموقع جاهز للنشر! 🎉**

بمجرد push هذا الكود، سيبدأ النشر تلقائياً.