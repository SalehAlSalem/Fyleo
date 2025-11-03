# تحديثات Admin Content Management

## التاريخ: 3 نوفمبر 2025

### المشاكل التي تم حلها:

#### 1️⃣ مشكلة التاريخ الهجري
**المشكلة:** التواريخ كانت تظهر بالتقويم الهجري بدلاً من الميلادي

**الحل:**
```javascript
// قبل:
date.toLocaleDateString('ar-SA', { ... })

// بعد:
date.toLocaleDateString('ar-EG', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  calendar: 'gregory'  // ✅ تقويم ميلادي
})
```

**النتيجة:** الآن التواريخ تظهر بالتقويم الميلادي للعربي والإنجليزي

---

#### 2️⃣ مشكلة عرض المنشورات/الروابط
**المشكلة:** في تاب الروابط، المنشورات لم تكن تظهر بشكل صحيح - خاصة المنشورات النصية بدون روابط

**الحل:**
```javascript
// العنوان: يعرض النص أو الرابط أو "Post"
{activeTab === 'files' ? item.title : (item.contentText || item.linkURL || 'Post')}

// معاينة النص للمنشورات الطويلة
{item.contentText && activeTab === 'posts' && item.contentText.length > 50 && (
  <div className="item-description">
    {item.contentText.substring(0, 60)}...
  </div>
)}

// عرض الرابط إذا موجود
{item.linkURL && activeTab === 'posts' && (
  <a href={item.linkURL} target="_blank">
    {item.linkURL.substring(0, 50)}...
  </a>
)}
```

**النتيجة:** 
- المنشورات النصية: تعرض النص كامل في العنوان، وإذا كان طويل تعرض معاينة
- المنشورات مع روابط: تعرض النص في العنوان والرابط أسفله
- الروابط قابلة للضغط وتفتح في تاب جديد

---

#### 3️⃣ إضافة خيار عرض البوب اب كارد
**الميزة الجديدة:** زر لعرض تفاصيل الملفات والمنشورات في البوب اب كارد

**ما تم إضافته:**

1. **استيراد CardModal:**
```javascript
import CardModal from '../../features/library/components/CardModal';
```

2. **State للكارد:**
```javascript
const [modalMaterial, setModalMaterial] = useState(null);
const [modalPost, setModalPost] = useState(null);
const [isCardOpen, setIsCardOpen] = useState(false);
```

3. **دوال فتح الكارد:**
```javascript
// فتح كارد المواد
const openMaterialCard = async (file) => {
  let material = await materialsService.getById(file.$id);
  // إضافة اسم الرافع
  material = { ...material, uploaderName: uploaders[material.uploaderId] };
  // إضافة رابط العرض
  if (material.fileId) {
    const url = StorageService.getPublicURL(material.fileId);
    material = { ...material, viewURL: url };
  }
  setModalMaterial(material);
  setIsCardOpen(true);
};

// فتح كارد المنشورات
const openPostCard = async (post) => {
  const postData = await postsService.getById(post.$id);
  setModalPost({
    ...postData,
    uploaderName: uploaders[postData.uploaderId]
  });
  setIsCardOpen(true);
};
```

4. **زر العرض في الجدول:**
```javascript
<button
  onClick={() => activeTab === 'files' ? openMaterialCard(item) : openPostCard(item)}
  className="action-btn view-btn"
  title={i18n.language === 'ar' ? 'عرض' : 'View'}
>
  👁️
</button>
```

5. **الكومبوننت في النهاية:**
```javascript
{isCardOpen && (
  <CardModal
    material={modalMaterial}
    post={modalPost}
    onClose={closeCard}
    onRefresh={loadContent}
  />
)}
```

**النتيجة:**
- زر عرض (👁️) جديد قبل زر التعديل والحذف
- الضغط على الزر يفتح البوب اب كارد مع التفاصيل الكاملة
- الكارد يعرض:
  - للملفات: معلومات الملف، المعاينة، التحميل، الإشارة المرجعية
  - للمنشورات: النص، الرابط، اسم الرافع، المعلومات

---

## ملخص التغييرات:

### الملفات المعدلة:
1. ✅ `AdminContentManagement.jsx`
   - تصحيح التاريخ من هجري لميلادي
   - تحسين عرض المنشورات
   - إضافة state للكارد
   - إضافة دوال فتح الكارد
   - إضافة زر عرض في الجدول
   - إضافة CardModal component

2. ✅ `AdminContentManagement.css`
   - إضافة ستايل لزر العرض (.view-btn)
   - ألوان hover للوضع العادي والليلي

### اختبار المطلوب:

- [ ] تحقق من عرض التواريخ بالميلادي
- [ ] تحقق من عرض المنشورات النصية
- [ ] تحقق من عرض المنشورات مع روابط
- [ ] تحقق من زر العرض (👁️) للملفات
- [ ] تحقق من زر العرض للمنشورات
- [ ] تحقق من البوب اب كارد للملفات
- [ ] تحقق من البوب اب كارد للمنشورات

---

## الأزرار في الجدول الآن:

| الترتيب | الزر | الوظيفة |
|--------|------|----------|
| 1 | 👁️ | عرض البوب اب كارد |
| 2 | ✏️ | تعديل المحتوى |
| 3 | 🗑️ | حذف المحتوى |

---

**Status:** ✅ جاهز للاختبار
**التحديثات:** 3 مشاكل تم حلها + 1 ميزة جديدة
