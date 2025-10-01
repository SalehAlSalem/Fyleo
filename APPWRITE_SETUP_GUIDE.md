# دليل إعداد Appwrite شامل 🚀

## مقدمة

هذا الدليل يشرح كيفية إعداد مشروع Appwrite للتطبيق مع دعم Google OAuth والملفات وقواعد البيانات.

## 1. إنشاء مشروع Appwrite جديد

### الخطوة 1: إنشاء حساب Appwrite
1. اذهب إلى [Appwrite Cloud](https://cloud.appwrite.io/)
2. قم بإنشاء حساب جديد أو تسجيل الدخول
3. انقر على "Create Project"
4. أدخل اسم المشروع (مثل: "Fyleo")
5. اختر المنطقة الجغرافية الأقرب لك

### الخطوة 2: الحصول على معرفات المشروع
بعد إنشاء المشروع، ستحصل على:
- **Project ID**: معرف المشروع الفريد
- **API Endpoint**: عنوان API الخاص بالمشروع

## 2. إعداد قاعدة البيانات

### إنشاء Database
1. اذهب إلى قسم "Databases" في لوحة التحكم
2. انقر على "Create Database"
3. أدخل معرف قاعدة البيانات: `fyleo_db`
4. أدخل اسم قاعدة البيانات: `Fyleo Database`

### إنشاء Collections

#### أ. Collection الملفات (files)
```json
{
  "id": "files",
  "name": "Files",
  "attributes": [
    {
      "key": "name",
      "type": "string",
      "size": 255,
      "required": true
    },
    {
      "key": "description",
      "type": "string",
      "size": 1000,
      "required": false
    },
    {
      "key": "fileId",
      "type": "string",
      "size": 255,
      "required": true
    },
    {
      "key": "fileName",
      "type": "string",
      "size": 255,
      "required": true
    },
    {
      "key": "fileSize",
      "type": "integer",
      "required": true
    },
    {
      "key": "fileType",
      "type": "string",
      "size": 100,
      "required": true
    },
    {
      "key": "category",
      "type": "string",
      "size": 100,
      "required": true
    },
    {
      "key": "subject",
      "type": "string",
      "size": 100,
      "required": true
    },
    {
      "key": "semester",
      "type": "string",
      "size": 50,
      "required": false
    },
    {
      "key": "uploaderId",
      "type": "string",
      "size": 255,
      "required": true
    },
    {
      "key": "uploaderName",
      "type": "string",
      "size": 255,
      "required": true
    },
    {
      "key": "downloadCount",
      "type": "integer",
      "required": false,
      "default": 0
    },
    {
      "key": "tags",
      "type": "string",
      "size": 500,
      "required": false,
      "array": true
    },
    {
      "key": "isPublic",
      "type": "boolean",
      "required": true,
      "default": true
    }
  ],
  "indexes": [
    {
      "key": "category_idx",
      "type": "key",
      "attributes": ["category"]
    },
    {
      "key": "subject_idx",
      "type": "key",
      "attributes": ["subject"]
    },
    {
      "key": "uploader_idx",
      "type": "key",
      "attributes": ["uploaderId"]
    }
  ],
  "permissions": [
    "read(\"any\")",
    "create(\"users\")",
    "update(\"users\")",
    "delete(\"users\")"
  ]
}
```

#### ب. Collection المفضلة (bookmarks)
```json
{
  "id": "bookmarks",
  "name": "Bookmarks",
  "attributes": [
    {
      "key": "userId",
      "type": "string",
      "size": 255,
      "required": true
    },
    {
      "key": "fileId",
      "type": "string",
      "size": 255,
      "required": true
    }
  ],
  "indexes": [
    {
      "key": "user_idx",
      "type": "key",
      "attributes": ["userId"]
    },
    {
      "key": "unique_bookmark",
      "type": "unique",
      "attributes": ["userId", "fileId"]
    }
  ],
  "permissions": [
    "read(\"users\")",
    "create(\"users\")",
    "delete(\"users\")"
  ]
}
```

#### ج. Collection التحميلات (downloads)
```json
{
  "id": "downloads",
  "name": "Downloads",
  "attributes": [
    {
      "key": "userId",
      "type": "string",
      "size": 255,
      "required": true
    },
    {
      "key": "fileId",
      "type": "string",
      "size": 255,
      "required": true
    },
    {
      "key": "downloadedAt",
      "type": "datetime",
      "required": true
    }
  ],
  "indexes": [
    {
      "key": "user_idx",
      "type": "key",
      "attributes": ["userId"]
    },
    {
      "key": "file_idx",
      "type": "key",
      "attributes": ["fileId"]
    }
  ],
  "permissions": [
    "read(\"users\")",
    "create(\"users\")"
  ]
}
```

#### د. Collection ملفات المستخدمين (user_profiles)
```json
{
  "id": "user_profiles",
  "name": "User Profiles",
  "attributes": [
    {
      "key": "userId",
      "type": "string",
      "size": 255,
      "required": true
    },
    {
      "key": "bio",
      "type": "string",
      "size": 500,
      "required": false
    },
    {
      "key": "university",
      "type": "string",
      "size": 255,
      "required": false
    },
    {
      "key": "major",
      "type": "string",
      "size": 255,
      "required": false
    },
    {
      "key": "semester",
      "type": "string",
      "size": 50,
      "required": false
    },
    {
      "key": "socialLinks",
      "type": "string",
      "size": 1000,
      "required": false
    }
  ],
  "indexes": [
    {
      "key": "user_unique",
      "type": "unique",
      "attributes": ["userId"]
    }
  ],
  "permissions": [
    "read(\"any\")",
    "create(\"users\")",
    "update(\"users\")"
  ]
}
```

## 3. إعداد التخزين (Storage)

### إنشاء Bucket
1. اذهب إلى قسم "Storage" في لوحة التحكم
2. انقر على "Create Bucket"
3. أدخل معرف Bucket: `files`
4. أدخل اسم Bucket: `Files Bucket`
5. ضع الحد الأقصى لحجم الملف: `104857600` (100MB)
6. أضف أنواع الملفات المسموحة:
   ```
   application/pdf
   application/msword
   application/vnd.openxmlformats-officedocument.wordprocessingml.document
   application/vnd.ms-powerpoint
   application/vnd.openxmlformats-officedocument.presentationml.presentation
   text/plain
   image/jpeg
   image/png
   image/gif
   application/zip
   application/x-rar-compressed
   ```

### إعدادات الأمان للـ Bucket
في صفحة إعدادات Bucket، اضبط الـ permissions:
```
read("any")
create("users")
update("users")
delete("users")
```

## 4. إعداد Google OAuth

### الخطوة 1: إنشاء مشروع Google Cloud
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. فعل Google+ API

### الخطوة 2: إعداد OAuth 2.0
1. اذهب إلى "APIs & Services" > "Credentials"
2. انقر على "Create Credentials" > "OAuth 2.0 Client IDs"
3. اختر "Web application"
4. أضف النطاقات المسموحة:
   ```
   http://localhost:3000
   http://localhost:5173
   https://yourdomain.com
   ```
5. أضف URIs إعادة التوجيه:
   ```
   http://localhost:3000/auth/google/callback
   http://localhost:5173/auth/google/callback
   https://yourdomain.com/auth/google/callback
   ```

### الخطوة 3: تكوين OAuth في Appwrite
1. اذهب إلى "Auth" > "Settings" في لوحة تحكم Appwrite
2. ابحث عن "Google" في قائمة OAuth providers
3. أدخل:
   - **App ID**: Google Client ID
   - **App Secret**: Google Client Secret

## 5. متغيرات البيئة

أنشئ ملف `.env` في جذر المشروع:

```env
# Appwrite Configuration
VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here

# Database Configuration
VITE_APPWRITE_DATABASE_ID=fyleo_db

# Collections
VITE_APPWRITE_FILES_COLLECTION_ID=files
VITE_APPWRITE_BOOKMARKS_COLLECTION_ID=bookmarks
VITE_APPWRITE_DOWNLOADS_COLLECTION_ID=downloads
VITE_APPWRITE_PROFILES_COLLECTION_ID=user_profiles

# Storage Configuration
VITE_APPWRITE_STORAGE_BUCKET_ID=files

# OAuth Configuration (optional - handled by Appwrite)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## 6. تجربة التطبيق

### قبل البدء
1. تأكد من تثبيت Dependencies:
```bash
npm install appwrite
```

2. تشغيل التطبيق:
```bash
npm run dev
```

### اختبار الوظائف
1. **تسجيل الدخول**: جرب تسجيل الدخول باستخدام Google OAuth
2. **رفع الملفات**: اختبر رفع ملف جديد
3. **تصفح الملفات**: تأكد من ظهور الملفات في قائمة التصفح
4. **المفضلة**: أضف ملف للمفضلة
5. **التحميل**: جرب تحميل ملف

## 7. نصائح للأمان

### أ. إعدادات الأمان العامة
1. تفعيل Rate Limiting في إعدادات المشروع
2. تعيين حد أقصى لحجم الملفات
3. فلترة أنواع الملفات المسموحة

### ب. صلاحيات قاعدة البيانات
تأكد من ضبط الصلاحيات بدقة:
- المستخدمون المسجلون فقط يمكنهم إنشاء/تعديل/حذف بياناتهم
- القراءة متاحة للجميع للملفات العامة

### ج. أمان التخزين
- تحديد أنواع الملفات المسموحة
- فحص الملفات قبل الرفع
- تشفير الملفات الحساسة

## 8. استكشاف الأخطاء

### أخطاء شائعة وحلولها

#### خطأ في الاتصال بـ Appwrite
```
Solution: تحقق من VITE_APPWRITE_URL و VITE_APPWRITE_PROJECT_ID
```

#### فشل في OAuth
```
Solution: تحقق من إعدادات Google OAuth وURLs إعادة التوجيه
```

#### فشل في رفع الملفات
```
Solution: تحقق من صلاحيات Storage Bucket وأنواع الملفات المسموحة
```

#### خطأ في قاعدة البيانات
```
Solution: تحقق من معرفات Collections والصلاحيات
```

## 9. تطوير المشروع

### إضافة ميزات جديدة
1. **نظام التقييم**: إضافة تقييم للملفات
2. **التعليقات**: نظام تعليقات على الملفات
3. **الإشعارات**: تنبيهات للمستخدمين
4. **البحث المتقدم**: فلاتر بحث متقدمة

### تحسين الأداء
1. **Caching**: تخزين مؤقت للبيانات
2. **Lazy Loading**: تحميل البيانات عند الحاجة
3. **Image Optimization**: ضغط الصور
4. **CDN**: استخدام CDN للملفات الثابتة

## 10. النشر (Deployment)

### إعداد النطاق
1. أضف نطاقك في إعدادات Appwrite
2. حدّث OAuth redirect URLs
3. حدّث متغيرات البيئة

### متغيرات الإنتاج
```env
VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=production_project_id
# ... باقي المتغيرات
```

---

## مساعدة إضافية

- [وثائق Appwrite الرسمية](https://appwrite.io/docs)
- [دليل OAuth في Appwrite](https://appwrite.io/docs/client/account#accountCreateOAuth2Session)
- [مجتمع Appwrite Discord](https://discord.gg/GSeTUeA)

🎉 **مبروك! أصبح تطبيقك جاهزاً للاستخدام مع Appwrite**