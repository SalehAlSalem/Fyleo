# Missing Collections Setup Guide

## ❌ Collections المفقودة

### 1. material_reports Collection

هذا الـ collection ضروري لنظام البلاغات ولكنه غير موجود حالياً في PocketBase.

## 🔧 كيفية إنشاء material_reports Collection يدوياً

### الخطوة 1: الدخول إلى PocketBase Admin

افتح المتصفح واذهب إلى:
```
https://pocketbase97.mooo.com/_/
```

### الخطوة 2: إنشاء Collection جديد

1. اضغط على "Collections" من القائمة الجانبية
2. اضغط على "+ New collection"
3. اختر Type: "Base collection"
4. اكتب Name: `material_reports`

### الخطوة 3: إضافة الـ Fields

أضف الـ fields التالية:

#### Field 1: material
- Name: `material`
- Type: **Relation**
- Required: ✅ Yes
- Collection: `materials`
- Cascade delete: ✅ Yes
- Min select: 1
- Max select: 1

#### Field 2: user
- Name: `user`
- Type: **Relation**
- Required: ✅ Yes
- Collection: `users`
- Cascade delete: ❌ No
- Min select: 1
- Max select: 1

#### Field 3: reason
- Name: `reason`
- Type: **Select (single)**
- Required: ✅ Yes
- Values:
  - inappropriate
  - spam
  - copyright
  - malware
  - other

#### Field 4: details
- Name: `details`
- Type: **Text**
- Required: ❌ No
- Min length: 0
- Max length: 1000

#### Field 5: status
- Name: `status`
- Type: **Select (single)**
- Required: ✅ Yes
- Values:
  - open
  - reviewing
  - resolved
  - rejected

### الخطوة 4: تكوين API Rules

في نفس صفحة الـ collection، اذهب إلى تبويب "API rules":

#### List Rule:
```
@request.auth.id != ""
```

#### View Rule:
```
@request.auth.id != ""
```

#### Create Rule:
```
@request.auth.id != ""
```

#### Update Rule:
```
user = @request.auth.id
```

#### Delete Rule:
```
user = @request.auth.id
```

### الخطوة 5: حفظ التغييرات

اضغط على "Save changes" في أعلى الصفحة.

---

## ✅ التحقق من النجاح

بعد إنشاء الـ collection، يمكنك التحقق بتشغيل:

```bash
node scripts/check-collections.mjs
```

يجب أن ترى:
```
✅ material_reports     - 0 سجلات
```

---

## 🔄 Automated Script (Requires Admin Credentials)

إذا كنت تملك بيانات الـ admin، يمكنك تشغيل:

```bash
node scripts/create-reports-collection.mjs
```

لكن يجب تحديث بيانات الدخول في السكريبت أولاً:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

---

## 📝 ملاحظات

- بدون هذا الـ collection، نظام البلاغات في صفحة المتيريال لن يعمل
- يمكن للمستخدمين رؤية زر "بلاغ" لكن إرسال البلاغ سيفشل
- جميع الأكواد الأخرى جاهزة وتنتظر فقط إنشاء هذا الـ collection

---

## 🚀 البدائل السريعة

إذا كنت تريد تعطيل ميزة البلاغات مؤقتاً، يمكنك:

1. فتح ملف: `frontend/src/app/material/[id]/page.tsx`
2. البحث عن: `<Button` مع `onClick={() => setShowReportForm`
3. تعطيل الزر أو إخفاءه

لكن الأفضل هو إنشاء الـ collection كما هو موضح أعلاه.
