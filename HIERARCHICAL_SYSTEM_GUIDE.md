# 🎯 دليل التطبيق - النظام الهرمي الجديد

## 📋 ما تم إنجازه:

### ✅ 1. Database Schema الجديد
- **Categories Collection**: التصنيفات الرئيسية (10 تصنيفات)
- **Subjects Collection**: المواد الفرعية (مرتبطة بالتصنيفات)
- **FileTypes Collection**: أنواع الملفات (8 أنواع)
- **Materials Collection**: تحديث لدعم النظام الهرمي

### ✅ 2. Services الجديدة
- **CategoryService**: خدمة شاملة للتعامل مع النظام الهرمي
- **DatabaseService**: محدث لدعم الـ References الجديدة
- **StorageService**: يعمل بنفس الطريقة السابقة

### ✅ 3. UI Components الجديدة
- **CategoriesPage**: صفحة عرض التصنيفات الرئيسية
- **SubjectsPage**: صفحة عرض المواد حسب التصنيف
- **HierarchicalMaterialsPage**: صفحة عرض الملفات حسب المادة
- **HierarchicalUploadForm**: نموذج رفع محدث للنظام الهرمي

---

## 🚀 خطوات التطبيق:

### المرحلة 1: إعداد Database (إجباري)

1. **اذهب إلى Appwrite Console**:
   https://cloud.appwrite.io → مشروعك → Databases → Database: 68d97982002b686c7151

2. **أنشئ Collections الجديدة** باستخدام الدليل:
   📄 `appwrite-collections-setup.md`

3. **أدخل البيانات الأولية**:
   ```javascript
   // في Console المتصفح على صفحة التطبيق
   import('./scripts/initializeHierarchicalData.js')
     .then(module => module.initializeData());
   ```

### المرحلة 2: تحديث الكود

4. **إضافة Routes جديدة** في `App.jsx`:
   ```jsx
   import CategoriesPage from './pages/CategoriesPage';
   import SubjectsPage from './pages/SubjectsPage';
   import HierarchicalMaterialsPage from './pages/HierarchicalMaterialsPage';

   // في Routes
   <Route path="/categories" element={<CategoriesPage />} />
   <Route path="/subjects/:categoryId" element={<SubjectsPage />} />
   <Route path="/materials/:categoryId/:subjectId" element={<HierarchicalMaterialsPage />} />
   ```

5. **تحديث Navigation** في NavBar:
   ```jsx
   <Link to="/categories">📚 تصفح المواد</Link>
   ```

6. **استبدال Upload Form** في Dashboard:
   ```jsx
   import HierarchicalUploadForm from './HierarchicalUploadForm';
   // استبدال uploadform.jsx بـ HierarchicalUploadForm
   ```

### المرحلة 3: اختبار النظام

7. **اختبار رفع الملفات**:
   - افتح Dashboard → Upload
   - اختر التصنيف → المادة → نوع الملف
   - ارفع ملف واختبر النظام

8. **اختبار التصفح**:
   - اذهب إلى `/categories`
   - انقر على تصنيف → تظهر المواد
   - انقر على مادة → تظهر الملفات

---

## 🗂️ بنية النظام الجديد:

```
التصنيف الرئيسي (Category)
├── المادة 1 (Subject)
│   ├── محاضرات (Lectures)
│   ├── سلايدات (Slides)
│   ├── كتب (Books)
│   └── امتحانات (Exams)
├── المادة 2 (Subject)
│   ├── شيتات (Sheets)
│   ├── مشاريع (Projects)
│   └── فيديوهات (Videos)
└── ...
```

---

## 📱 User Journey الجديد:

### للطالب:
1. يدخل `/categories` → يرى التصنيفات الـ 10
2. ينقر على تصنيف → يرى المواد في هذا التصنيف
3. ينقر على مادة → يرى الملفات مصنفة حسب النوع
4. يمكن فلترة الملفات حسب النوع أو البحث

### لرافع الملفات:
1. يدخل Dashboard → Upload
2. يختار التصنيف الرئيسي
3. يختار المادة (تظهر حسب التصنيف)
4. يختار نوع الملف
5. يرفع الملف مع البيانات الإضافية

---

## ⚙️ Backwards Compatibility:

النظام الجديد متوافق مع النظام القديم:
- الملفات القديمة ستظهر في "غير مصنف"
- يمكن تحديث الملفات القديمة تدريجياً
- روابط المواد القديمة ستعمل

---

## 🔧 ملفات التكوين المطلوبة:

### Environment Variables جديدة:
```
VITE_APPWRITE_CATEGORIES_COLLECTION_ID=categories
VITE_APPWRITE_SUBJECTS_COLLECTION_ID=subjects  
VITE_APPWRITE_FILE_TYPES_COLLECTION_ID=fileTypes
```

### الملفات المحدثة:
- ✅ `src/config/appwrite.js` - إضافة Collection IDs
- ✅ `src/config/CategoryService.js` - خدمة النظام الهرمي
- ✅ `src/pages/CategoriesPage/index.jsx` - صفحة التصنيفات
- ✅ `src/pages/SubjectsPage/index.jsx` - صفحة المواد
- ✅ `src/pages/HierarchicalMaterialsPage/index.jsx` - صفحة الملفات
- ✅ `src/components/Dashboard/HierarchicalUploadForm.jsx` - نموذج الرفع

### الملفات الجديدة:
- 📄 `database-schema-new.md` - مخطط قاعدة البيانات
- 📄 `appwrite-collections-setup.md` - دليل إعداد Collections
- 📄 `scripts/initializeHierarchicalData.js` - سكريبت البيانات الأولية

---

## 🎯 النتيجة النهائية:

بدل أن تكون الملفات مبعثرة، ستصبح منظمة هكذا:

```
📚 الرياضيات والعلوم الأساسية
├── 🔢 التفاضل والتكامل (1)
│   ├── 📖 محاضرات (15 ملف)
│   ├── 📊 سلايدات (8 ملفات)
│   ├── 📝 امتحانات (5 ملفات)
│   └── 📋 شيتات (3 ملفات)
├── 🔢 الجبر الخطي
│   ├── 📖 محاضرات (12 ملف)
│   └── 📚 كتب (2 كتاب)
└── ...

💻 علوم الحاسوب والبرمجة  
├── ⚙️ البرمجة بلغة الكينونة
│   ├── 📖 محاضرات (20 ملف)
│   ├── 🗂️ مشاريع (8 مشاريع)
│   └── 🎥 فيديوهات (5 فيديوهات)
└── ...
```

**النتيجة**: موقع منظم ومرتب وسهل الاستخدام! 🎉