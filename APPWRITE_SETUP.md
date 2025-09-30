# 🚀 Appwrite Setup Guide - دليل إعداد Appwrite

## نظرة عامة | Overview

يستخدم موقع Fyleo خدمة Appwrite كخدمة Backend-as-a-Service (BaaS) لإدارة قاعدة البيانات والمصادقة والتخزين.

Fyleo uses Appwrite as the Backend-as-a-Service (BaaS) for database management, authentication, and storage.

## 📋 خطوات الإعداد | Setup Steps

### 1. إنشاء حساب Appwrite | Create Appwrite Account

1. اذهب إلى [Appwrite Cloud](https://cloud.appwrite.io)
2. أنشئ حساباً جديداً أو سجل الدخول
3. أنشئ مشروعاً جديداً باسم "Fyleo"

### 2. إعداد قاعدة البيانات | Database Setup

#### إنشاء Database:
- اذهب إلى **Databases** في لوحة التحكم
- أنشئ database جديد باسم `fyleo-db`
- احفظ Database ID

#### إنشاء Collections:

##### Collection 1: Users
```json
{
  "name": "users",
  "attributes": [
    {"key": "name", "type": "string", "size": 255, "required": true},
    {"key": "email", "type": "string", "size": 255, "required": true},
    {"key": "avatar", "type": "string", "size": 2048, "required": false},
    {"key": "role", "type": "string", "size": 50, "default": "user"},
    {"key": "uploadCount", "type": "integer", "default": 0},
    {"key": "downloadCount", "type": "integer", "default": 0}
  ]
}
```

##### Collection 2: Materials
```json
{
  "name": "materials",
  "attributes": [
    {"key": "title", "type": "string", "size": 255, "required": true},
    {"key": "description", "type": "string", "size": 2048, "required": false},
    {"key": "category", "type": "string", "size": 100, "required": true},
    {"key": "subject", "type": "string", "size": 100, "required": false},
    {"key": "fileId", "type": "string", "size": 255, "required": true},
    {"key": "fileName", "type": "string", "size": 255, "required": true},
    {"key": "fileType", "type": "string", "size": 50, "required": true},
    {"key": "fileSize", "type": "integer", "required": true},
    {"key": "uploaderId", "type": "string", "size": 255, "required": true},
    {"key": "uploaderName", "type": "string", "size": 255, "required": true},
    {"key": "downloadCount", "type": "integer", "default": 0},
    {"key": "viewCount", "type": "integer", "default": 0},
    {"key": "approved", "type": "boolean", "default": false},
    {"key": "tags", "type": "string", "size": 1000, "array": true}
  ]
}
```

### 3. إعداد التخزين | Storage Setup

1. اذهب إلى **Storage** في لوحة التحكم
2. أنشئ bucket جديد باسم `files`
3. اضبط الإعدادات:
   - **Maximum File Size**: 100MB
   - **Allowed File Extensions**: pdf,doc,docx,ppt,pptx,xls,xlsx,jpg,jpeg,png,gif
   - **Encryption**: Enabled
   - **Antivirus**: Enabled

### 4. إعداد المصادقة | Authentication Setup

1. اذهب إلى **Auth** في لوحة التحكم
2. فعّل الطرق التالية:
   - ✅ **Email/Password**
   - ✅ **Google OAuth** (اختياري)
   - ✅ **Anonymous** (للزوار)

### 5. إعداد الصلاحيات | Permissions Setup

#### Database Permissions:
```javascript
// Users Collection
Read: ["user:*"]
Write: ["user:*"]
Update: ["user:*"]
Delete: ["user:*"]

// Materials Collection  
Read: ["any"]
Write: ["user:*"]
Update: ["user:*"]
Delete: ["user:*"]
```

#### Storage Permissions:
```javascript
// Files Bucket
Read: ["any"]
Write: ["user:*"]
Update: ["user:*"] 
Delete: ["user:*"]
```

### 6. متغيرات البيئة | Environment Variables

انسخ الملف `.env.example` إلى `.env` وأضف القيم التالية:

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
VITE_APPWRITE_PROJECT_ID="your_project_id_here"
VITE_APPWRITE_DATABASE_ID="your_database_id_here"
VITE_APPWRITE_USERS_COLLECTION_ID="users"
VITE_APPWRITE_MATERIALS_COLLECTION_ID="materials"
VITE_APPWRITE_STORAGE_BUCKET_ID="files"
```

### 7. اختبار الاتصال | Test Connection

```bash
npm install
npm run dev
```

افتح المتصفح على `http://localhost:5173` وتأكد من:
- تحميل الصفحة بدون أخطاء
- إمكانية التسجيل وتسجيل الدخول
- رفع الملفات يعمل بشكل صحيح

## 🔧 استكشاف الأخطاء | Troubleshooting

### خطأ في الاتصال:
- تأكد من صحة `VITE_APPWRITE_ENDPOINT`
- تأكد من صحة `VITE_APPWRITE_PROJECT_ID`

### خطأ في قاعدة البيانات:
- تأكد من إنشاء Database و Collections
- تأكد من صحة Collection IDs

### خطأ في التخزين:
- تأكد من إنشاء Storage Bucket
- تأكد من صحة `VITE_APPWRITE_STORAGE_BUCKET_ID`

### خطأ في الصلاحيات:
- تأكد من ضبط Permissions بشكل صحيح
- تأكد من أن المستخدمين يمكنهم القراءة والكتابة

## 📖 الموارد المفيدة | Useful Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [React with Appwrite Guide](https://appwrite.io/docs/quick-starts/react)
- [Appwrite Database Tutorial](https://appwrite.io/docs/databases)
- [Appwrite Storage Guide](https://appwrite.io/docs/storage)

## 🆘 الدعم | Support

إذا واجهت أي مشاكل، يمكنك:
- فتح issue في المشروع
- مراجعة [Appwrite Community](https://appwrite.io/discord)
- التواصل مع فريق التطوير

---

**تم إنشاء هذا الدليل من قبل فريق Fyleo - جامعة البلقاء التطبيقية**