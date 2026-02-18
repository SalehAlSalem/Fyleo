# 🔐 حل المشكلة: PocketBase Permission Rules

## المشكلة

عند تحمیل المواد أو البیانات الأخرى، تظهر رسائل خطأ **403 Forbidden - Only admins can perform this action**.

هذا يعني أن `material_ratings` و `material_reports` collections لا تملك **Access Rules** صحیحة للمستخدمین العادیین.

### الأسباب:
- Collections بشكل افتراضي (default) تحتاج admin access فقط
- لا توجد قواعد (rules) تسمح للمستخدمین بقراءة/كتابة البیانات

---

## الحل (خطوات يدوية)

### 1️⃣ دخول PocketBase Admin Panel

```
URL: https://pocketbase97.mooo.com/_/
```

> استخدم بيانات Admin المسجلة لديك

---

### 2️⃣ تحديث Collection Rules

اذهب لكل collection وحدث Rules كالتالي:

#### **material_ratings Collection**

**التبويب: Collections > material_ratings**

اضبط الـ **Access Control Rules**:

```
List Rule:    @request.method = "GET"
View Rule:    @request.method = "GET"
Create Rule:  @request.auth.id != ""
Update Rule:  user = @request.auth.id
Delete Rule:  user = @request.auth.id
```

**شرح:**
- `List` و `View`: أي شخص يمكنه قراءة البيانات
- `Create`: أي مستخدم مسجل يمكنه إضافة تقييم
- `Update`: فقط من كتب التقييم يمكنه تعديله
- `Delete`: فقط من كتبه يمكنه حذفه

---

#### **material_reports Collection**

**التبويب: Collections > material_reports**

```
List Rule:    @request.auth.id != ""
View Rule:    @request.auth.id != ""
Create Rule:  @request.auth.id != ""
Update Rule:  user = @request.auth.id
Delete Rule:  user = @request.auth.id
```

**شرح:**
- فقط مستخدمون مسجلون يمكنهم رؤية/إضافة البلاغات
- كل مستخدم يمكنه تعديل/حذف بلاغاته فقط

---

#### **bookmarks Collection (إن وجدت)**

```
List Rule:    user = @request.auth.id
View Rule:    user = @request.auth.id
Create Rule:  @request.auth.id != ""
Update Rule:  user = @request.auth.id
Delete Rule:  user = @request.auth.id
```

---

#### **materials Collection**

```
List Rule:    @request.method = "GET"
View Rule:    @request.method = "GET"
Create Rule:  @request.auth.id != ""
Update Rule:  uploader = @request.auth.id
Delete Rule:  uploader = @request.auth.id
```

---

#### **posts Collection**

```
List Rule:    @request.method = "GET"
View Rule:    @request.method = "GET"
Create Rule:  @request.auth.id != ""
Update Rule:  uploader = @request.auth.id
Delete Rule:  uploader = @request.auth.id
```

---

#### **subjects, categories, fileTypes (للقراءة فقط)**

```
List Rule:    @request.method = "GET"
View Rule:    @request.method = "GET"
Create Rule:  (leave empty = admin only)
Update Rule:  (leave empty = admin only)
Delete Rule:  (leave empty = admin only)
```

---

## 3️⃣ خطوات التطبيق في PocketBase Admin

1. **اذهب إلى Admin Panel**: https://pocketbase97.mooo.com/_/
2. **اختر Collection من القائمة اليسرى**
3. **ابحث عن "Access Control"** أو **"API Rules"** جزء
4. **أنسخ Rules من الأعلى لكل حقل**:
   - List Rule
   - View Rule  
   - Create Rule
   - Update Rule
   - Delete Rule
5. **اضغط Save**

---

## 4️⃣ التحقق من النجاح

بعد تطبيق الـ Rules:

✅ المواد ستظهر في المكتبة  
✅ يمكن تقييم المواد  
✅ يمكن إضافة تقارير عن مشاكل  
✅ لا توجد رسائل خطأ 403  

---

## 🚨 ملاحظات مهمة

### Rule Syntax شرح:
- `@request.method = "GET"` → السماح للقراءة لأي شخص
- `@request.auth.id != ""` → المستخدم يجب أن يكون مسجل دخول
- `user = @request.auth.id` → فقط المستخدم الذي أنشأ السجل
- `uploader = @request.auth.id` → فقط من رفع المادة
- `(empty)` → Admin فقط

### حقول Relations:
- `user` ← المستخدم الذي أنشأ/يملك السجل
- `uploader` ← من رفع المادة
- `material` ← المادة المرتبطة

---

## الملف: `scripts/fix-permissions.mjs`

إذا كان لديك credentials Admin، يمكنك تشغيل:

```bash
node scripts/fix-permissions.mjs
```

لكن قد تحتاج لتحديث البيانات أولاً:
- تحقق من `.env.local` أو `package.json`
- أضف credentials Admin

---

## الأخطاء الشائعة

### ❌ خطأ: "Cannot save collection"
**السبب:** Syntax خاطئ في Rules  
**الحل:** استخدم القوالب المثالية من الأعلى

### ❌ خطأ: "Field does not exist"
**السبب:** اسم الحقل مكتوب خطأ (مثل `userId` بدل `user`)  
**الحل:** استخدم أسماء الحقول الصحيحة:
- `user` ← لا `userId`
- `material` ← لا `materialId`
- `uploader` ← لا `uploaderId`

### ❌ رسالة 403 تظهر أيضاً بعد التحديث
**السبب:** احتفظ browser بـ cache  
**الحل:**
```
1. امسح browser cache (Ctrl+Shift+Delete)
2. أعید تحميل الصفحة
3. أو افتح في incognito/private tab
```

---

## ملخص التالي

بعد تطبيق هذه الـ Rules:
✨ جميع الأخطاء 403 ستختفي  
✨ المستخدمون يمكنهم التفاعل مع المادة  
✨ التقييمات والبلاغات ستعمل  
✨ الأمان محفوظ (كل مستخدم يرى ويعدل فقط بياناته)

---

**آخر تحديث**: 2025-02-18  
**الحالة**: تحتاج تحديث يدوي في PocketBase Admin Panel
