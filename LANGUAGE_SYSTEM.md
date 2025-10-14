# 🌐 نظام اللغات الشامل - Fyleo

## 📋 نظرة عامة

تم إنشاء نظام لغات متكامل يدعم **العربية** و **الإنجليزية** بشكل كامل مع:
- ✅ تبديل فوري بين اللغتين
- ✅ جلب البيانات الصحيحة من قاعدة البيانات حسب اللغة
- ✅ تغيير اتجاه الصفحة (RTL/LTR) تلقائياً
- ✅ حفظ اللغة المختارة في localStorage

---

## 🏗️ البنية

### 1. **LanguageContext** (`src/contexts/LanguageContext.jsx`)

**الوظائف الرئيسية**:

```javascript
const { 
  language,           // اللغة الحالية: 'ar' أو 'en'
  setLanguage,        // تغيير اللغة
  toggleLanguage,     // التبديل بين اللغتين
  t,                  // ترجمة النصوص الثابتة
  getFieldName,       // الحصول على اسم الحقل حسب اللغة
  getLocalizedValue,  // الحصول على القيمة المترجمة من الكائن
  isRTL,             // هل اللغة من اليمين لليسار؟
  isArabic,          // هل اللغة عربية؟
  isEnglish          // هل اللغة إنجليزية؟
} = useLanguage();
```

---

## 📖 كيفية الاستخدام

### 1️⃣ **ترجمة النصوص الثابتة**

```javascript
import { useLanguage } from '../contexts/LanguageContext';

function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('home')}</h1>           {/* الرئيسية / Home */}
      <button>{t('login')}</button>  {/* تسجيل الدخول / Login */}
    </div>
  );
}
```

---

### 2️⃣ **جلب البيانات من قاعدة البيانات**

#### مثال: عرض اسم التصنيف

```javascript
import { useLanguage } from '../contexts/LanguageContext';

function CategoryCard({ category }) {
  const { getLocalizedValue } = useLanguage();
  
  return (
    <div>
      <h2>{getLocalizedValue(category, 'name')}</h2>
      <p>{getLocalizedValue(category, 'description')}</p>
    </div>
  );
}
```

**كيف يعمل**:
- إذا كانت اللغة عربية: يجلب `nameAr` و `descriptionAr`
- إذا كانت اللغة إنجليزية: يجلب `nameEn` و `descriptionEn`

---

### 3️⃣ **استخدام في Queries**

```javascript
import { useLanguage } from '../contexts/LanguageContext';

function SubjectsList() {
  const { getFieldName } = useLanguage();
  
  // سيرجع 'nameAr' أو 'nameEn' حسب اللغة
  const nameField = getFieldName('name');
  
  // استخدام في الفلترة أو الترتيب
  const sortedSubjects = subjects.sort((a, b) => 
    a[nameField].localeCompare(b[nameField])
  );
  
  return (
    <div>
      {sortedSubjects.map(subject => (
        <div key={subject.$id}>
          {subject[nameField]}
        </div>
      ))}
    </div>
  );
}
```

---

### 4️⃣ **التبديل بين اللغات**

```javascript
import { useLanguage } from '../contexts/LanguageContext';

function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <button onClick={toggleLanguage}>
      {language === 'ar' ? '🇸🇦 عربي' : '🇬🇧 EN'}
    </button>
  );
}
```

---

## 🗃️ قاعدة البيانات

### البنية المطلوبة للـ Collections

كل collection يجب أن يحتوي على حقول مزدوجة:

#### **Categories**
```javascript
{
  $id: "...",
  nameAr: "علوم الحاسوب",
  nameEn: "Computer Science",
  descriptionAr: "تخصص علوم الحاسوب",
  descriptionEn: "Computer Science Major",
  icon: "💻",
  color: "#3B82F6"
}
```

#### **Subjects**
```javascript
{
  $id: "...",
  nameAr: "برمجة متقدمة",
  nameEn: "Advanced Programming",
  descriptionAr: "مادة البرمجة المتقدمة",
  descriptionEn: "Advanced Programming Course",
  categoryId: "..."
}
```

#### **File Types**
```javascript
{
  $id: "...",
  nameAr: "ملف PDF",
  nameEn: "PDF File",
  icon: "📄",
  allowedFormats: "pdf"
}
```

---

## 🎨 المكونات المحدثة

### ✅ تم تحديثها:
1. ✅ `ModernNavbar` - القائمة الرئيسية
2. ✅ `MaterialsPage` - صفحة المواد
3. ✅ `App.jsx` - إضافة LanguageProvider

### 🔄 يجب تحديثها:
- [ ] `ModernDashboard` - لوحة التحكم
- [ ] `ProfilePage` - صفحة البروفايل
- [ ] `AdminPage` - لوحة الإدارة
- [ ] `MaterialDetailPage` - تفاصيل الملف

---

## 📝 قائمة الترجمات المتاحة

### Navigation
- `home` - الرئيسية / Home
- `materials` - المواد / Materials
- `dashboard` - لوحة التحكم / Dashboard
- `profile` - الملف الشخصي / Profile
- `admin` - لوحة الإدارة / Admin Panel
- `login` - تسجيل الدخول / Login
- `signup` - إنشاء حساب / Sign Up
- `logout` - تسجيل الخروج / Logout

### Common
- `search` - بحث / Search
- `filter` - تصفية / Filter
- `upload` - رفع / Upload
- `download` - تحميل / Download
- `delete` - حذف / Delete
- `edit` - تعديل / Edit
- `save` - حفظ / Save
- `cancel` - إلغاء / Cancel

### Messages
- `uploadSuccess` - تم رفع الملف بنجاح / File uploaded successfully
- `uploadError` - حدث خطأ أثناء رفع الملف / Error uploading file
- `deleteSuccess` - تم حذف الملف بنجاح / File deleted successfully

**وأكثر من 50+ ترجمة أخرى!**

---

## 🔧 إضافة ترجمات جديدة

لإضافة ترجمة جديدة، عدّل ملف `LanguageContext.jsx`:

```javascript
const translations = {
  ar: {
    // ... الترجمات الموجودة
    myNewKey: 'النص بالعربي',
  },
  en: {
    // ... الترجمات الموجودة
    myNewKey: 'Text in English',
  }
};
```

ثم استخدمها:
```javascript
const { t } = useLanguage();
<h1>{t('myNewKey')}</h1>
```

---

## 🎯 أمثلة عملية

### مثال 1: صفحة المواد

```javascript
import { useLanguage } from '../contexts/LanguageContext';

function MaterialsPage() {
  const { t, getLocalizedValue } = useLanguage();
  const [categories, setCategories] = useState([]);
  
  return (
    <div>
      <h1>{t('materials')}</h1>
      
      {categories.map(category => (
        <div key={category.$id}>
          <h2>{getLocalizedValue(category, 'name')}</h2>
          <p>{getLocalizedValue(category, 'description')}</p>
        </div>
      ))}
    </div>
  );
}
```

### مثال 2: نموذج رفع ملف

```javascript
import { useLanguage } from '../contexts/LanguageContext';

function UploadForm() {
  const { t, getLocalizedValue } = useLanguage();
  const [categories, setCategories] = useState([]);
  
  return (
    <form>
      <label>{t('selectCategory')}</label>
      <select>
        <option value="">{t('selectCategory')}</option>
        {categories.map(cat => (
          <option key={cat.$id} value={cat.$id}>
            {getLocalizedValue(cat, 'name')}
          </option>
        ))}
      </select>
      
      <button type="submit">{t('upload')}</button>
    </form>
  );
}
```

### مثال 3: رسائل النجاح/الخطأ

```javascript
import { useLanguage } from '../contexts/LanguageContext';

function FileUpload() {
  const { t } = useLanguage();
  const [message, setMessage] = useState('');
  
  const handleUpload = async () => {
    try {
      await uploadFile();
      setMessage(t('uploadSuccess')); // ✅ تم رفع الملف بنجاح
    } catch (error) {
      setMessage(t('uploadError'));   // ❌ حدث خطأ أثناء رفع الملف
    }
  };
  
  return (
    <div>
      {message && <p>{message}</p>}
      <button onClick={handleUpload}>{t('upload')}</button>
    </div>
  );
}
```

---

## 🚀 الخطوات التالية

### للمطورين:
1. ✅ استخدم `useLanguage()` في كل مكون
2. ✅ استخدم `t()` للنصوص الثابتة
3. ✅ استخدم `getLocalizedValue()` لبيانات قاعدة البيانات
4. ✅ تأكد من وجود `nameAr` و `nameEn` في كل collection

### للإدارة:
1. ✅ عند إضافة تصنيف جديد: املأ `nameAr` و `nameEn`
2. ✅ عند إضافة مادة جديدة: املأ `nameAr` و `nameEn`
3. ✅ عند إضافة نوع ملف: املأ `nameAr` و `nameEn`

---

## 🎉 النتيجة النهائية

- ✅ **تبديل فوري**: اضغط على زر اللغة → يتغير كل شيء
- ✅ **اتجاه صحيح**: عربي (RTL) ← إنجليزي (LTR)
- ✅ **بيانات صحيحة**: يجلب الحقول الصحيحة من قاعدة البيانات
- ✅ **تجربة سلسة**: لا حاجة لإعادة تحميل الصفحة

---

**آخر تحديث**: 2025-10-15  
**الإصدار**: 1.0  
**المطور**: Saleh Al-Salem
