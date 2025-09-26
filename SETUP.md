# 🚀 دليل الإعداد السريع - Fyleo Setup Guide

## 🎯 النظام الهجين للتخزين - Hybrid Storage System

يستخدم **Fyleo** نظام تخزين هجين ذكي لتوفير المال والتكاليف:

### 📁 GitHub Storage (مجاني)
- **الملفات الصغيرة** (أقل من 25 ميجا)
- مجاني بالكامل
- سريع وموثوق

### 📁 Supabase Storage (1GB مجاني شهرياً)
- **الملفات الكبيرة** (25-100 ميجا)
- 1 جيجا مجاني كل شهر
- احتياطي موثوق

---

## ⚙️ خطوات الإعداد

### 1️⃣ Firebase (للمصادقة والبيانات فقط)

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. أنشئ مشروع جديد
3. فعل **Authentication** → **Google Sign-In**
4. فعل **Firestore Database**
5. انسخ إعدادات المشروع إلى `.env`

### 2️⃣ GitHub Token (للملفات الصغيرة)

1. اذهب إلى [GitHub Settings](https://github.com/settings/tokens)
2. اضغط **Generate new token (classic)**
3. أعطه صلاحية **repo**
4. انسخ التوكن إلى `.env`

### 3️⃣ Supabase (للملفات الكبيرة)

1. اذهب إلى [Supabase Dashboard](https://app.supabase.com/projects)
2. أنشئ مشروع جديد
3. اذهب إلى **Storage** → أنشئ bucket اسمه **fyleo-files**
4. انسخ **URL** و **anon key** إلى `.env`

### 4️⃣ تشغيل المشروع

```bash
# انسخ ملف الإعدادات
cp .env.example .env

# حدث الإعدادات بالقيم الحقيقية
# ثم شغل المشروع
npm run dev
```

---

## 🧪 اختبار رفع الملفات

### ملفات صغيرة (< 25MB)
- ستُرفع على **GitHub** مجاناً
- ستظهر رسالة: "تم الرفع على GitHub"

### ملفات كبيرة (25-100MB)
- ستُرفع على **Supabase**
- ستظهر رسالة: "تم الرفع على Supabase"

### الملفات الكبيرة جداً (> 100MB)
- ستظهر رسالة خطأ تطلب تقسيم الملف

---

## 🛠️ استكشاف الأخطاء

### خطأ في Firebase
```
Error: Firebase configuration missing
```
**الحل**: تأكد من إعدادات Firebase في `.env`

### خطأ في GitHub
```
Error: GitHub token invalid
```
**الحل**: تأكد من صحة GitHub Token

### خطأ في Supabase
```
Error: Supabase connection failed
```
**الحل**: تأكد من URL و anon key في Supabase

---

## 📊 مراقبة الاستخدام

### GitHub (مجاني)
- بدون حدود للملفات الصغيرة
- مراقب في GitHub Repository

### Supabase (1GB شهرياً)
- راقب الاستخدام في Supabase Dashboard
- ستحصل على تنبيه عند الاقتراب من الحد

---

## 🎉 جاهز للتشغيل!

بعد إعداد كل شيء، المشروع سيعمل على:
**http://localhost:5173**

---

*جامعة البلقاء التطبيقية - AlBalqa Applied University*