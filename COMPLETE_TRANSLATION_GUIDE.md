# 🌐 دليل الترجمة الكاملة لجميع الصفحات

## 📋 الحالة الحالية

### ✅ تم:
- نظام i18n مُعد بالكامل
- Navbar مترجم بالكامل
- ملفات الترجمة تحتوي على 100+ ترجمة

### ❌ المشكلة:
- محتوى الصفحات الداخلية لا يزال بلغة واحدة
- النصوص الثابتة داخل الصفحات لم تُترجم

---

## 🎯 الهدف

ترجمة **كل** نص في **كل** صفحة بحيث:
1. عند تبديل اللغة، تتغير **جميع** النصوص
2. لا يوجد أي نص ثابت بالعربي أو الإنجليزي
3. البيانات من قاعدة البيانات تُعرض باللغة الصحيحة

---

## 📝 قائمة الصفحات والحالة

### 🔥 أولوية عالية:

#### 1. Dashboard (`src/components/Dashboard/ModernDashboard.jsx`)
**الحالة**: ⏳ قيد التحديث

**النصوص التي تحتاج ترجمة**:
```javascript
// العناوين
"مرحباً" → t('dashboard.welcome')
"لوحة التحكم الشاملة" → t('dashboard.subtitle')

// الإحصائيات
"الملفات المفضلة" → t('dashboard.bookmarkedFiles')
"إجمالي التحميلات" → t('dashboard.totalDownloads')
"مساحة مستخدمة" → t('dashboard.storageUsed')

// رفع الملفات
"رفع ملف جديد" → t('dashboard.uploadNewFile')
"اختر التصنيف الرئيسي" → t('upload.selectCategory')
"اختر المادة" → t('upload.selectSubject')
"اختر نوع الملف" → t('upload.selectFileType')
"عنوان الملف" → t('upload.fileTitle')
"وصف الملف" → t('upload.fileDescription')

// الرسائل
"تم رفع الملف بنجاح" → t('upload.uploadSuccess')
"فشل تحميل البيانات" → t('common.error')
"تمت الإضافة إلى المفضلة" → t('messages.addedToBookmarks')
"تمت الإزالة من المفضلة" → t('messages.removedFromBookmarks')

// قائمة الملفات
"ملفاتي" → t('dashboard.myFiles')
"من" → t('dashboard.filesCount')
"تحميل" → t('dashboard.downloadCount')
"كل التصنيفات" → t('dashboard.allCategories')
```

**البيانات من DB**:
```javascript
// قبل
{cat.nameAr}
{subject.nameAr}
{fileType.nameAr}

// بعد
{getLocalizedValue(cat, 'name')}
{getLocalizedValue(subject, 'name')}
{getLocalizedValue(fileType, 'name')}
```

---

#### 2. Landing Page (`src/pages/LandingPage/NewModernLanding.jsx`)
**الحالة**: ❌ لم يبدأ

**النصوص التي تحتاج ترجمة**:
```javascript
// Hero Section
"Fyleo" → t('landing.heroTitle')
"منصة مشاركة الملفات التعليمية" → t('landing.heroSubtitle')
"شارك ملفاتك التعليمية..." → t('landing.heroDescription')
"ابدأ الآن مجاناً" → t('landing.getStarted')
"استكشف المواد" → t('landing.exploreMaterials')

// Features
"لماذا Fyleo؟" → t('landing.whyChooseUs')
"سريع وسهل" → t('landing.fastAndEasy')
"آمن وموثوق" → t('landing.secureAndReliable')
"منظم ومرتب" → t('landing.organizedAndSorted')

// Stats
"مستخدم مسجل" → t('dashboard.totalUsers')
"ملف مرفوع" → t('dashboard.filesUploaded')

// Footer
"عن Fyleo" → t('footer.aboutUs')
"روابط سريعة" → t('footer.quickLinks')
"تواصل معنا" → t('footer.contact')
```

---

#### 3. Materials Page (`src/pages/MaterialsPage/MaterialsPage.jsx`)
**الحالة**: ⏳ جزئي (تم تحديث بعض الأجزاء)

**النصوص التي تحتاج ترجمة**:
```javascript
// Search
"ابحث عن مادة مباشرة..." → t('materials.searchPlaceholder')
"لا توجد نتائج" → t('materials.noResults')

// Headers
"التصنيفات الأكاديمية" → t('materials.academicCategories')
"المواد" → t('materials.subjects')

// Breadcrumb
"الرئيسية" → t('nav.home')
```

**البيانات من DB**:
```javascript
// تم بالفعل - استخدام getLocalizedValue
{getLocalizedValue(category, 'name')}
{getLocalizedValue(subject, 'name')}
```

---

#### 4. Profile Page (`src/pages/ProfilePage/ModernProfile.jsx`)
**الحالة**: ❌ لم يبدأ

**النصوص التي تحتاج ترجمة**:
```javascript
// Header
"الملف الشخصي" → t('profile.title')
"إدارة حسابك ومعلوماتك الشخصية" → t('profile.subtitle')

// Profile Card
"تعديل الاسم" → t('profile.editName')
"حفظ" → t('common.save')
"إلغاء" → t('common.cancel')
"انضم في" → t('profile.joinedOn')
"تسجيل الخروج" → t('nav.logout')

// Stats
"ملف مرفوع" → t('dashboard.filesUploaded')
"تحميل" → t('dashboard.downloadCount')
"مساحة مستخدمة" → t('dashboard.storageUsed')

// Quick Links
"روابط سريعة" → t('profile.quickLinks')
"الرئيسية" → t('nav.home')
"المواد" → t('nav.materials')
"لوحة التحكم" → t('nav.dashboard')

// Account Info
"معلومات الحساب" → t('profile.accountInfo')
"معرف المستخدم" → t('profile.userId')
"البريد الإلكتروني" → t('profile.emailAddress')
"حالة التحقق" → t('profile.verificationStatus')
"موثق" → t('profile.verified')
"غير موثق" → t('profile.notVerified')
```

---

### ⚡ أولوية متوسطة:

#### 5. Login Page (`src/pages/login/AppwriteLogin.jsx`)
**النصوص**:
```javascript
"مرحباً بعودتك" → t('auth.welcomeBack')
"البريد الإلكتروني" → t('auth.email')
"كلمة المرور" → t('auth.password')
"تذكرني" → t('auth.rememberMe')
"نسيت كلمة المرور؟" → t('auth.forgotPassword')
"تسجيل الدخول" → t('nav.login')
"تسجيل الدخول بواسطة Google" → t('auth.signInWithGoogle')
"ليس لديك حساب؟" → t('auth.dontHaveAccount')
"إنشاء حساب" → t('nav.signup')
```

#### 6. Signup Page (`src/pages/signup/AppwriteSignup.jsx`)
**النصوص**:
```javascript
"ابدأ الآن" → t('auth.getStarted')
"الاسم" → t('auth.name')
"البريد الإلكتروني" → t('auth.email')
"كلمة المرور" → t('auth.password')
"إنشاء حساب" → t('auth.createAccount')
"إنشاء حساب بواسطة Google" → t('auth.signUpWithGoogle')
"لديك حساب بالفعل؟" → t('auth.alreadyHaveAccount')
"تسجيل الدخول" → t('nav.login')
```

---

### 📝 أولوية منخفضة:

#### 7. Admin Pages
- `src/pages/AdminPage/index.jsx`
- `src/pages/AdminPage/CategoriesManagement.jsx`
- `src/pages/AdminPage/SubjectsManagement.jsx`
- `src/pages/AdminPage/FileTypesManagement.jsx`

---

## 🔧 كيفية التحديث (خطوة بخطوة)

### الخطوة 1: استيراد الـ Hooks
```javascript
import { useTranslation } from 'react-i18next';
import { useLocalizedContent } from '../../hooks/useLocalizedContent';

function MyPage() {
  const { t } = useTranslation();
  const { getLocalizedValue } = useLocalizedContent();
  
  // ...
}
```

### الخطوة 2: استبدال النصوص الثابتة
```javascript
// قبل ❌
<h1>مرحباً، {user.name}</h1>
<p>لوحة التحكم الشاملة</p>
<button>رفع ملف</button>

// بعد ✅
<h1>{t('dashboard.welcome')}, {user.name}</h1>
<p>{t('dashboard.subtitle')}</p>
<button>{t('dashboard.uploadFile')}</button>
```

### الخطوة 3: استبدال بيانات DB
```javascript
// قبل ❌
<option value={cat.$id}>{cat.nameAr}</option>
<h2>{subject.nameAr}</h2>

// بعد ✅
<option value={cat.$id}>{getLocalizedValue(cat, 'name')}</option>
<h2>{getLocalizedValue(subject, 'name')}</h2>
```

### الخطوة 4: استبدال الرسائل
```javascript
// قبل ❌
setMessage('تم رفع الملف بنجاح');
setError('حدث خطأ');

// بعد ✅
setMessage(t('upload.uploadSuccess'));
setError(t('common.error'));
```

---

## 🧪 الاختبار

بعد تحديث كل صفحة:

### 1. اختبار التبديل
- افتح الصفحة
- اضغط على زر اللغة
- تحقق من تغيير **جميع** النصوص

### 2. اختبار البيانات
- تحقق من عرض أسماء التصنيفات/المواد باللغة الصحيحة
- تحقق من Dropdowns/Selects

### 3. اختبار الرسائل
- جرب رفع ملف → تحقق من رسالة النجاح
- جرب حذف ملف → تحقق من رسالة التأكيد
- جرب إضافة للمفضلة → تحقق من الرسالة

### 4. اختبار RTL
- اختر العربية
- تحقق من اتجاه الصفحة
- تحقق من عدم وجود مشاكل في التخطيط

---

## 📊 التقدم

### الحالة الإجمالية:
- ✅ Navbar: 100%
- ⏳ Dashboard: 30%
- ❌ Landing: 0%
- ⏳ Materials: 50%
- ❌ Profile: 0%
- ❌ Login: 0%
- ❌ Signup: 0%
- ❌ Admin: 0%

### المطلوب:
1. ✅ إكمال Dashboard
2. ✅ تحديث Landing Page
3. ✅ إكمال Materials Page
4. ✅ تحديث Profile Page
5. ✅ تحديث Login/Signup
6. ✅ تحديث Admin Pages
7. ✅ اختبار شامل

---

## 🎯 الأولوية

### اليوم:
1. **Dashboard** - الأكثر استخداماً
2. **Landing Page** - أول ما يراه المستخدم
3. **Materials Page** - صفحة رئيسية

### غداً:
4. **Profile Page**
5. **Login/Signup**
6. **Admin Pages**

---

**ابدأ بـ Dashboard الآن! 🚀**
