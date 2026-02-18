# إعداد نظام التبليغ عن المواد (Material Reports)

## 🔴 خطوات إلزامية - يجب تنفيذها يدوياً في PocketBase Admin

### 1. تسجيل الدخول لـ PocketBase Admin UI
- افتح المتصفح واذهب إلى: https://pocketbase97.mooo.com/_/
- سجل دخول بحساب الإدارة

### 2. إنشاء Collection جديدة
اضغط على **"New collection"** ثم اختر **"Base collection"**

**اسم الـ Collection:**
```
material_reports
```

### 3. إضافة الحقول (Fields)

أضف الحقول التالية بالضبط:

#### 1️⃣ **material** (Relation)
- Type: `Relation`
- Collection: `materials`
- Max select: `1`
- Display fields: `title`
- Required: ✅

#### 2️⃣ **reporter** (Relation)
- Type: `Relation`
- Collection: `users`
- Max select: `1`
- Display fields: `email, name`
- Required: ✅

#### 3️⃣ **reason** (Select - Single)
- Type: `Select (single)`
- Values:
  ```
  inappropriate
  spam
  copyright
  malware
  fake
  other
  ```
- Display values (اختياري):
  - inappropriate → محتوى غير لائق
  - spam → إعلان أو رسائل مزعجة
  - copyright → انتهاك حقوق نشر
  - malware → ملف ضار أو فيروس
  - fake → محتوى مضلل أو مزيف
  - other → أخرى
- Required: ✅

#### 4️⃣ **details** (Text)
- Type: `Text`
- Max length: `1000`
- Required: ❌ (اختياري)

#### 5️⃣ **status** (Select - Single)
- Type: `Select (single)`
- Values:
  ```
  pending
  reviewing
  resolved
  rejected
  ```
- Display values:
  - pending → قيد الانتظار
  - reviewing → قيد المراجعة
  - resolved → تم الحل
  - rejected → مرفوض
- Default: `pending`
- Required: ✅

### 4. ضبط الصلاحيات (API Rules)

اذهب إلى تبويب **"API Rules"**:

#### List/Search Rule:
```javascript
// المستخدمون المسجلون يمكنهم رؤية بلاغاتهم فقط
@request.auth.id != "" && reporter.id = @request.auth.id
```

#### View Rule:
```javascript
// المستخدم يمكنه رؤية بلاغه
@request.auth.id != "" && reporter.id = @request.auth.id
```

#### Create Rule:
```javascript
// أي مستخدم مسجل يمكنه إنشاء بلاغ
@request.auth.id != "" && @request.data.reporter = @request.auth.id
```

#### Update Rule:
```javascript
// ممنوع التعديل للمستخدمين (فقط المسؤولون)
```

#### Delete Rule:
```javascript
// ممنوع الحذف للمستخدمين (فقط المسؤولون)
```

### 5. التحقق من النجاح
بعد الحفظ، افتح Terminal وشغل:
```bash
node scripts/check-pb.mjs
```

يجب أن ترى:
```
✓ material_reports (X سجل)
```

---

## 📝 استخدام النظام في الكود

### مثال على إرسال بلاغ:

```typescript
import { pb } from '@/lib/pocketbase'
import { useAuthStore } from '@/lib/auth-store'

const { user } = useAuthStore()

async function reportMaterial(materialId: string, reason: string, details?: string) {
  try {
    const report = await pb.collection('material_reports').create({
      material: materialId,
      reporter: user.id,
      reason: reason,
      details: details || '',
      status: 'pending'
    })
    
    console.log('✅ تم إرسال البلاغ:', report.id)
    return report
  } catch (error) {
    console.error('❌ خطأ في إرسال البلاغ:', error)
    throw error
  }
}
```

### مثال على عرض بلاغات المستخدم:

```typescript
async function getUserReports() {
  try {
    const reports = await pb.collection('material_reports').getFullList({
      filter: `reporter = "${user.id}"`,
      expand: 'material',
      sort: '-created'
    })
    
    return reports
  } catch (error) {
    console.error('❌ خطأ في تحميل البلاغات:', error)
    return []
  }
}
```

---

## ⚠️ ملاحظات هامة

1. **لا يمكن إنشاء Collection عبر API** - يجب استخدام Admin UI
2. **الـ Collection اسمه بالضبط**: `material_reports` (بدون مسافات)
3. **التأكد من نوع الحقول** - خصوصاً Relation و Select
4. **الصلاحيات مهمة** - لحماية البيانات من التلاعب

---

## 🎯 الخطوات التالية بعد الإنشاء

1. ✅ إنشاء Collection (هذا الملف)
2. 🔜 إنشاء صفحة Report UI في `/material/[id]`
3. 🔜 إنشاء Dashboard للبلاغات في `/dashboard/reports`
4. 🔜 إنشاء Admin Panel لمراجعة البلاغات

---

**تم إنشاء هذا الملف بواسطة:** GitHub Copilot
**التاريخ:** الآن
