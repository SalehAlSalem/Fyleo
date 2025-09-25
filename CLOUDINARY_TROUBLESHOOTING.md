# حل مشكلة Cloudinary "Customer is marked as untrusted"

## المشكلة
عند محاولة الوصول إلى الملفات المُرفوعة على Cloudinary، تظهر رسالة خطأ:
```
HTTP ERROR 401
Customer is marked as untrusted
```

## الأسباب المحتملة والحلول

### 1. حساب Cloudinary جديد وغير مُفعّل
**الحل:**
- قم بتسجيل الدخول إلى [Cloudinary Console](https://cloudinary.com/console)
- تحقق من حالة الحساب في Dashboard
- قم بتفعيل الحساب عبر البريد الإلكتروني إذا لم يتم بعد

### 2. لم يتم إضافة معلومات الفواتير
**الحل:**
- اذهب إلى Settings > Billing
- أضف معلومات بطاقة ائتمان صالحة
- حتى لو كنت تستخدم الخطة المجانية، قد يطلب Cloudinary معلومات الفواتير للتحقق

### 3. تجاوز حدود الاستخدام
**الحل:**
- تحقق من استخدامك الحالي في Dashboard
- ترقية الخطة إذا لزم الأمر
- أو انتظار حتى التجديد الشهري

### 4. مشكلة في Upload Preset
**الحل:**
- اذهب إلى Settings > Upload
- تحقق من وجود Upload Preset بالاسم: `fyleo_unsigned`
- إذا لم يكن موجوداً، قم بإنشائه:
  - Upload preset name: `fyleo_unsigned`
  - Signing Mode: Unsigned
  - Resource type: Auto
  - Folder: اتركه فارغ أو استخدم `academics`

### 5. إعدادات الأمان
**الحل:**
- اذهب إلى Settings > Security
- تحقق من إعدادات Delivery restrictions
- تأكد من أن Public access مُفعّل

## خطوات التحقق السريع

1. **تحقق من حالة الحساب:**
   ```
   https://cloudinary.com/console/media_library
   ```

2. **اختبار Upload بسيط:**
   - جرب رفع صورة صغيرة من Media Library
   - إذا نجح، المشكلة في Upload Preset
   - إذا فشل، المشكلة في الحساب نفسه

3. **اختبار Upload Preset:**
   - استخدم curl لاختبار Upload:
   ```bash
   curl -X POST https://api.cloudinary.com/v1_1/drgdqi5ac/image/upload \
     -F "file=@test.jpg" \
     -F "upload_preset=fyleo_unsigned"
   ```

## Upload Preset جديد (إذا احتجت إنشاء واحد)

إذا لم يكن Upload Preset موجوداً، اتبع هذه الخطوات:

1. اذهب إلى Settings > Upload Presets
2. اضغط على "Add upload preset"
3. املأ الحقول:
   - **Preset name:** `fyleo_unsigned`
   - **Signing mode:** Unsigned
   - **Resource type:** Auto-detect
   - **Access control:** Public read
   - **Allowed formats:** اتركه فارغ (كل الأنواع)
   - **Folder:** `academics` (اختياري)

## الحل المؤقت

إذا استمرت المشكلة، يمكنك استخدام Firebase Storage بدلاً من Cloudinary:

1. فعّل Firebase Storage في Console
2. عدّل دالة الرفع لاستخدام Firebase Storage
3. احتفظ بـ Cloudinary للصور فقط

## Contact Support

إذا لم تنجح الحلول أعلاه، تواصل مع دعم Cloudinary:
- https://support.cloudinary.com
- أو من داخل Dashboard > Help & Support