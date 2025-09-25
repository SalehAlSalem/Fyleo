# 🚀 دليل إعداد النظام الهجين المجاني

## 📋 نظرة عامة
تم إنشاء نظام تخزين هجين مجاني 100% يستخدم:
- **GitHub**: للملفات الصغيرة (أقل من 25MB) - مجاني تماماً
- **Supabase**: للملفات الكبيرة (25MB - 100MB) - 1GB مجاني شهرياً

## 🔧 خطوات الإعداد

### 1. إعداد GitHub Token

1. اذهب إلى [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. اضغط "Generate new token (classic)"
3. أضف وصف: "Fyleo File Storage"
4. حدد الصلاحيات:
   - ✅ `repo` (كامل)
   - ✅ `contents:write`
5. انسخ الـ token واحفظه (لن تراه مرة أخرى!)

### 2. إعداد Supabase (اختياري - للملفات الكبيرة)

1. اذهب إلى [supabase.com](https://supabase.com) وأنشئ حساب مجاني
2. أنشئ مشروع جديد
3. اذهب إلى **Storage** > **Buckets**
4. أنشئ bucket جديد اسمه `files` (public)
5. من **Settings** > **API**، انسخ:
   - Project URL
   - anon public key

### 3. إعداد ملف البيئة

1. انسخ `.env.example` إلى `.env`
2. املأ القيم:

```env
# GitHub (مطلوب)
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
VITE_GITHUB_OWNER=SalehAlSalem  
VITE_GITHUB_REPO=Fyleo

# Supabase (اختياري - للملفات الكبيرة)
VITE_SUPABASE_URL=https://xxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🎯 كيف يعمل النظام

### الآلية الذكية:
- **ملف < 25MB** → رفع على GitHub مباشرة (مجاني تماماً)
- **ملف >= 25MB** → رفع على Supabase (1GB شهرياً مجاني)
- **ملف > 100MB** → رسالة خطأ (حد أقصى)

### المزايا:
- ✅ مجاني 100%
- ✅ سرعة عالية
- ✅ موثوقية GitHub
- ✅ احتياطي Supabase للملفات الكبيرة
- ✅ اختيار تلقائي للنظام الأنسب

## 📁 هيكل الملفات

```
uploads/
├── 1640995200000_document.pdf (GitHub)
├── 1640995201000_large-video.mp4 (Supabase)
└── 1640995202000_image.jpg (GitHub)
```

## 🔍 استكشاف الأخطاء

### خطأ GitHub Token:
- تأكد من صحة الـ token
- تأكد من صلاحيات `repo`

### خطأ Supabase:
- تأكد من إنشاء bucket اسمه `files`
- تأكد من أن الـ bucket عام (public)

### ملف كبير جداً:
- الحد الأقصى 100MB
- قسم الملف أو استخدم ضغط

## 🚀 تشغيل النظام

```bash
npm install
npm run dev
```

## 📊 مراقبة الاستخدام

- **GitHub**: لا حدود على الملفات الصغيرة
- **Supabase**: 1GB شهرياً (يمكن مراقبته من dashboard)

---

### 💡 نصائح:
- الصور والمستندات العادية → GitHub
- ملفات الفيديو الكبيرة → Supabase  
- استخدم ضغط الصور لتوفير المساحة

**النظام جاهز للاستخدام! 🎉**