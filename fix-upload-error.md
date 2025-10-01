# 🛠️ إصلاح مشكلة رفع الملفات - CORS Error

## المشكلة:
```
Access to XMLHttpRequest at 'https://fyleo.appwrite.network/v1/storage/buckets/files/files' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

## السبب:
1. **bucket ID خطأ** - URL يجب أن يكون `/storage/buckets/{BUCKET_ID}/files` وليس `/storage/buckets/files/files`
2. **أذونات bucket غير صحيحة**

## كيفية إصلاح المشكلة:

### 1. التحقق من bucket ID الصحيح:
1. اذهب إلى [Appwrite Console](https://cloud.appwrite.io)
2. اختر مشروعك `68d9740b0012416cb71b`
3. اذهب إلى **Storage** في الجانب الأيسر
4. انسخ **Bucket ID** الصحيح (ليس `files68d979d3000337e899ad`)

### 2. تحديث ملف .env:
```env
# الصق bucket ID الجديد هنا
VITE_APPWRITE_STORAGE_BUCKET_ID=YOUR_CORRECT_BUCKET_ID
```

### 3. التحقق من أذونات Bucket:
في Appwrite Console > Storage > Bucket Settings:

**Permissions المطلوبة:**
- Read access: `role:all` أو `role:member`
- Create access: `role:all` أو `role:member`  
- Update access: `role:all` أو `role:member`
- Delete access: `role:all` أو `role:member`

### 4. إعدادات CORS (إذا لزم الأمر):
في Appwrite Console > Settings > Platforms:
- اضف `http://localhost:5173` في Allowed Origins

## 🔧 إنشاء bucket جديد (إذا لم يوجد):

1. في Appwrite Console > Storage
2. اضغط **Create Bucket**
3. Bucket Name: `files`
4. Bucket ID: `files` (أو اتركه فارغ لإنشاء معرف تلقائي)
5. **Permissions:** اضبط كما هو مذكور أعلاه
6. Maximum File Size: `104857600` (100MB)
7. Allowed File Extensions: `pdf,doc,docx,ppt,pptx,jpg,jpeg,png,gif,txt,zip,rar`
8. **Compression:** معطل
9. **Encryption:** معطل (للتطوير)
10. **Antivirus:** معطل (للتطوير)

## 🧪 اختبار الإصلاح:
بعد تحديث bucket ID في .env:
1. أعد تشغيل `npm run dev`
2. جرب رفع ملف
3. تحقق من Console للتأكد من عدم وجود أخطاء CORS

---
**ملاحظة:** تأكد من أن Bucket ID في .env متطابق مع ID في Appwrite Console.