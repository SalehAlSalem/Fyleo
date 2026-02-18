# 📖 نقل البيانات (Database Migrations)

## 📋 الحالة

القاعدة الجديدة تم تصميمها بشكل نظيف من الصفر مع التركيز على:
- ✅ نظام التقييمات
- ✅ نظام البلاغات  
- ✅ عرض الملفات
- ✅ العلاقات السليمة بين الجداول

---

## 🔄 الخطوة 1: إعادة تعيين قاعدة البيانات (إذا لزم الأمر)

إذا كان عندك بيانات قديمة تريد الاحتفاظ بها:

```bash
# احفظ نسخة احتياطية من البيانات القديمة
cd backend
cp pb_data/data.db pb_data/data.db.backup
```

لحذف البيانات القديمة واستئناف من جديد:
```bash
rm pb_data/data.db
# ابدأ PocketBase مجدداً سيعيد إنشاء قاعدة جديدة
```

---

## 🔧 الخطوة 2: تطبيق الـ Collections

### الطريقة 1: عبر PocketBase Admin UI (الأسهل)

1. افتح **http://localhost:8090/_/**
2. اذهب إلى **Settings** > **Users** > أنشئ حساب admin إذا لم يكن موجود
3. اذهب إلى **Collections**
4. أنشئ المجموعات التالية يدوياً:

#### Collections المطلوبة:

**1. categories**
- Text: `nameAr`, `nameEn`, `descriptionAr`, `descriptionEn`, `icon`, `color`, `slug`
- Number: `order`
- Checkbox: `isActive` (default: true)

**2. subjects**
- Text: `nameAr`, `nameEn`, `descriptionAr`, `code`
- Relation: `categoryId` → categories
- Number: `creditHours`, `level`
- Checkbox: `isActive` (default: true)

**3. fileTypes**
- Text: `nameAr`, `nameEn`, `mimeType`, `extension`, `icon`, `color`
- Checkbox: `allowedInBrowser` (default: false)

**4. materials**
- Text: `title`, `description`, `tags`
- File: `file` (تفعيل `allow_access_all`)
- Relation: `uploaderId` → _pb_users_auth_, `subjectId` → subjects, `fileTypeId` → fileTypes
- Number: `views` (default: 0), `downloads` (default: 0), `averageRating` (default: 0), `totalRatings` (default: 0)
- Checkbox: `isVerified` (default: false), `isPublic` (default: true)

**5. material_ratings**
- Relation: `materialId` → materials, `userId` → _pb_users_auth_
- Number: `rating` (validation: >= 1, <= 5)
- Text: `comment`
- Number: `helpful` (default: 0)
- **Unique:** `materialId + userId`

**6. material_reports**
- Relation: `materialId` → materials, `userId` → _pb_users_auth_, `reviewedById` → _pb_users_auth_
- Text: `reason` (select: inappropriate, spam, copyright, malware, other)
- Text: `details`, `reviewNotes`
- Text: `status` (select: open, reviewing, resolved, rejected) - default: "open"

**7. user_profiles** (اختياري)
- Relation: `userId` → _pb_users_auth_ (unique)
- Text: `bio`, `university`, `major`
- Number: `year`, `totalUploads` (default: 0), `totalRatings` (default: 0), `averageRating` (default: 0)

**8. posts** (للنقاشات - اختياري)
- Relation: `subjectId` → subjects, `userId` → _pb_users_auth_
- Text: `title`, `content`, `links`
- Number: `views` (default: 0)

---

## 📊 الخطوة 3: استيراد البيانات الأولية

شغّل `docs/SEED_DATA.js` في PocketBase console:

1. افتح **http://localhost:8090/_/**  
2. اذهب إلى **Logs** أو اضغط F12 واختر **Console**
3. انسخ محتوى `docs/SEED_DATA.js` وعجنه في console
4. اضغط Enter
5. يجب أن ترى: ✅ `انتهى ملء البيانات بنجاح!`

---

## ✅ الخطوة 4: التحقق

تأكد من أن البيانات تم إدخالها:

```javascript
// في console PocketBase
const categories = await pb.collection('categories').getList(1, 50)
console.log('Categories:', categories.items.length) // يجب أن تكون 5 على الأقل

const subjects = await pb.collection('subjects').getList(1, 50)
console.log('Subjects:', subjects.items.length) // يجب أن تكون 6 على الأقل

const fileTypes = await pb.collection('fileTypes').getList(1, 50)
console.log('File Types:', fileTypes.items.length) // يجب أن تكون 4 على الأقل
```

---

## 🚀 الخطوة 5: بدء Frontend

```bash
cd frontend
npm install
npm run dev
```

سيكون متاحاً على **http://localhost:3001**

---

## 🔑 Rules و Permissions (مهم!)

### لـ materials collection:

**List/Get Rules:**
```
isPublic = true || uploaderId = @request.auth.id
```

### لـ material_ratings collection:

**List/Get Rules:**
```
true
```

**Create Rules:**
```
userId = @request.auth.id
```

**Update Rules:**
```
userId = @request.auth.id
```

### لـ material_reports collection:

**Create Rules:**
```
userId = @request.auth.id
```

**Update Rules:** (للفريق الإداري فقط)
```
@request.auth.id != null
```

---

## 🔁 Migration من قاعدة قديمة

إذا كان عندك بيانات قديمة تريد نقلها:

```javascript
// استخرج البيانات القديمة
const oldRatings = await pb.collection('your_old_ratings').getFullList()

// أعد إدراجها في الجداول الجديدة
for (const rating of oldRatings) {
  await pb.collection('material_ratings').create({
    materialId: rating.materialId,
    userId: rating.userId,
    rating: rating.rate || 5,
    comment: rating.feedback || '',
  })
}
```

---

## 🐛 استكشاف الأخطاء

### Error: "Collection not found"
✓ تأكد من إنشاء Collections الأساسية أولاً

### Error: "Invalid relationship"
✓ تأكد من أن Collection الهدف موجود قبل إنشاء العلاقة

### Error: "Duplicate entry"
✓ تأكد من عدم إدراج نفس البيانات مرتين

### رسالة النجاح في console لا تؤثر على الـ UI
✓ استخدم http://localhost:8090/_ للتحقق مباشرة من Admin UI

---

## 📦 Export/Backup

للاحتفاظ بنسخة احتياطية من البيانات:

```bash
# Export كل Collections إلى JSON
cd backend
cp pb_data/data.db pb_backup_$(date +%Y%m%d).db

# أو استخدم PocketBase API
curl http://localhost:8090/api/collections \
  > pb_collections_backup.json
```

---

## ✨ ملاحظات مهمة

1. **Timestamps**: PocketBase يضيف تلقائياً `created` و `updated`
2. **User Auth**: `_pb_users_auth_` هي collection المستخدمين الافتراضية
3. **Cascade Delete**: فعّل `Cascade delete` للعلاقات حتى حذف مادة = حذف تقييماتها
4. **Indexes**: أضفنا indexes على الحقول الكثير الاستخدام (subject, uploader, rating)

---

**جاهز للبدء! 🎉**
