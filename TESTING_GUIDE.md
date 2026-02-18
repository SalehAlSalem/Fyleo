# 🧪 دليل اختبار منصة Fyleo

دليل شامل لاختبار جميع ميزات المنصة.

---

## 📋 قائمة الاختبارات السريعة

### ✅ Pre-Launch Checklist

- [ ] Build production ينجح
- [ ] Dev server يعمل
- [ ] لا توجد أخطاء TypeScript
- [ ] لا توجد أخطاء Console
- [ ] جميع الصفحات تحمل
- [ ] الـ navigation يعمل

---

## 🔍 اختبارات تفصيلية

### 1. اختبار نظام المصادقة

#### 1.1 التسجيل بالإيميل

**Steps:**
1. افتح: http://localhost:3001/register
2. أدخل البيانات:
   - الاسم: "أحمد محمد"
   - Email: "test@example.com"
   - Password: "12345678"
   - Confirm: "12345678"
3. اضغط "إنشاء حساب"

**Expected:**
- ✅ رسالة نجاح "تم إنشاء الحساب بنجاح"
- ✅ Redirect إلى /dashboard
- ✅ اسم المستخدم يظهر في Navbar
- ✅ زر "تسجيل خروج" يظهر

**Test Cases:**
- [ ] ✅ التسجيل بنجاح
- [ ] ❌ كلمات المرور غير متطابقة
- [ ] ❌ كلمة مرور أقل من 8 أحرف
- [ ] ❌ إيميل مستخدم بالفعل

---

#### 1.2 تسجيل الدخول

**Steps:**
1. افتح: http://localhost:3001/login
2. أدخل Email المسجل
3. أدخل Password
4. اضغط "تسجيل الدخول"

**Expected:**
- ✅ Redirect إلى /dashboard
- ✅ Session محفوظة (hard refresh = still logged in)

**Test Cases:**
- [ ] ✅ دخول ناجح
- [ ] ❌ إيميل خاطئ
- [ ] ❌ كلمة مرور خاطئة
- [ ] ✅ "Remember me" يعمل

---

#### 1.3 OAuth (Google/GitHub)

**Steps:**
1. افتح /login أو /register
2. اضغط "Continue with Google"
3. وافق على الصلاحيات
4. انتظر Redirect

**Expected:**
- ✅ Redirect إلى /auth/callback
- ✅ معالجة الـ code
- ✅ حفظ Session
- ✅ Redirect إلى /dashboard
- ✅ Profile picture يظهر (إن وجد)

**Test Cases:**
- [ ] Google OAuth
- [ ] GitHub OAuth
- [ ] إلغاء OAuth (Cancel)
- [ ] Errors handling

---

#### 1.4 تسجيل الخروج

**Steps:**
1. اضغط على اسمك في Navbar
2. اختر "تسجيل خروج"

**Expected:**
- ✅ Redirect إلى /
- ✅ Navbar يتحول إلى "تسجيل الدخول"
- ✅ لا يمكن الوصول لـ /dashboard

---

### 2. اختبار الصفحة الرئيسية

#### 2.1 Hero Section

**Steps:**
1. افتح: http://localhost:3001

**Check:**
- [ ] عنوان "تعلم وشارك بحرية" يظهر
- [ ] زر "استكشف المواد" يعمل
- [ ] زر "ابدأ الآن" يعمل (برابط صحيح)

---

#### 2.2 Stats Section

**Check:**
- [ ] عدد المستخدمين يظهر
- [ ] عدد المواد (397) يظهر
- [ ] عدد الموادا الدراسية (132) يظهر
- [ ] عدد التقييمات يظهر

---

#### 2.3 Categories Section

**Check:**
- [ ] 8 بطاقات تظهر
- [ ] كل بطاقة تحتوي على:
  - [ ] Emoji icon
  - [ ] الاسم بالعربي
  - [ ] الاسم بالإنجليزي
  - [ ] Hover effect
- [ ] الضغط على بطاقة يفتح `/category/[slug]`

**إذا لم تظهر:**
- جرب Hard Refresh (Ctrl+Shift+R)
- افتح Console وابحث عن أخطاء
- تحقق من `console.log('Categories loaded:...')`

---

#### 2.4 Trending Materials

**Check:**
- [ ] 6 مواد تظهر
- [ ] كل مادة تحتوي على:
  - [ ] العنوان
  - [ ] الوصف
  - [ ] التقييم
  - [ ] عدد التحميلات
- [ ] الضغط يفتح `/material/[id]`

---

### 3. اختبار المكتبة

#### 3.1 عرض الكاتيجوريات

**Steps:**
1. افتح: http://localhost:3001/library

**Check:**
- [ ] 8 categories cards تظهر
- [ ] كل بطاقة clickable
- [ ] Hover effects تعمل

---

#### 3.2 اختيار Category

**Steps:**
1. اضغط على أي category (مثلاً "كلية الهندسة")

**Check:**
- [ ] القائمة تتحول لعرض Subjects
- [ ] Breadcrumb يظهر: Home > [Category Name]
- [ ] زر "رجوع" يعمل
- [ ] عدد Subjects يظهر

---

#### 3.3 اختيار Subject

**Steps:**
1. اضغط على أي subject (مثلاً "فيزياء")

**Check:**
- [ ] Materials list تظهر
- [ ] Breadcrumb: Home > [Category] > [Subject]
- [ ] Search box يظهر
- [ ] Sort dropdown يعمل
- [ ] Pagination تظهر (إن وجدت مواد كثيرة)

---

#### 3.4 فلترة وترتيب

**Test Cases:**
- [ ] Search بالعنوان: "ملخص"
- [ ] Sort by: "الأحدث"
- [ ] Sort by: "التقييم"
- [ ] Sort by: "التحميلات"
- [ ] Next page

---

### 4. اختبار صفحة المادة

#### 4.1 فتح المادة

**Steps:**
1. من /library، اضغط على أي مادة

**Check:**
- [ ] الصفحة تحمل: `/material/[id]`
- [ ] العنوان يظهر
- [ ] الوصف يظهر (إن وجد)
- [ ] التقييم والتحميلات تظهر

---

#### 4.2 معاينة الملف

**Check (للـ PDF):**
- [ ] PDFViewer يظهر
- [ ] PDF يحمل داخل الصفحة
- [ ] زر "تحميل مباشر" يعمل
- [ ] يمكن scroll في PDF

**Check (لغير PDF):**
- [ ] رسالة "لا يمكن معاينة..."
- [ ] زر "تحميل الملف" يظهر

---

#### 4.3 معلومات المادة

**Check:**
- [ ] المادة الدراسية تظهر (nameAr + nameEn)
- [ ] Level و Credit Hours تظهر
- [ ] نوع الملف يظهر (icon + name)
- [ ] اسم الرافع يظهر
- [ ] صورة أو initial للرافع
- [ ] Email الرافع (إن متاح)

---

#### 4.4 نظام التقييمات

**Test (مستخدم مسجل):**

**Steps:**
1. اختر عدد نجوم (1-5)
2. اكتب تعليق (اختياري)
3. اضغط "حفظ التقييم"

**Check:**
- [ ] رسالة نجاح
- [ ] التقييم يضاف للقائمة
- [ ] متوسط التقييم يتحدث
- [ ] يمكن تحديث التقييم

**Test (مستخدم غير مسجل):**
- [ ] قسم التقييم لا يظهر أو
- [ ] Redirect إلى /login

---

#### 4.5 نظام البلاغات

**Steps:**
1. اضغط زر "بلاغ"
2. اختر سبب (مثلاً "محتوى غير مناسب")
3. اكتب تفاصيل (اختياري)
4. اضغط "إرسال البلاغ"

**Expected (إذا كان collection موجود):**
- ✅ رسالة "تم إرسال البلاغ بنجاح"
- ✅ النموذج يختفي

**Expected (إذا كان collection مفقود):**
- ❌ خطأ 404 أو 403
- ⚠️ راجع: `docs/SETUP_MISSING_COLLECTIONS.md`

---

### 5. اختبار صفحة التخصص

#### 5.1 فتح صفحة التخصص

**Steps:**
1. من `/`، اضغط على أي تخصص في Categories section
   أو من `/library` اضغط على category card

**Check:**
- [ ] الصفحة: `/category/[slug]`
- [ ] Header بـ gradient يظهر
- [ ] اسم التخصص (عربي + إنجليزي)
- [ ] الـ icon
- [ ] Breadcrumbs: Home > [Category]

---

#### 5.2 Subjects Grid

**Check:**
- [ ] جميع Subjects للتخصص تظهر
- [ ] كل بطاقة تحتوي على:
  - [ ] اسم المادة
  - [ ] Level
  - [ ] Credit Hours
  - [ ] عدد المواد المتاحة
- [ ] الضغط يفتح قائمة المواد

---

#### 5.3 Materials Section

**Check:**
- [ ] قائمة المواد (لكل Subjects في التخصص)
- [ ] فلترة حسب Subject تعمل
- [ ] الضغط على مادة يفتح `/material/[id]`

---

### 6. اختبار رفع المواد

#### 6.1 الوصول (Protected)

**Test (غير مسجل):**
- افتح `/upload`
- **Expected**: Redirect إلى `/login`

**Test (مسجل):**
- افتح `/upload`
- **Expected**: الصفحة تظهر

---

#### 6.2 نموذج الرفع

**Steps:**
1. أدخل عنوان: "اختبار رفع مادة"
2. أدخل وصف (اختياري)
3. اختر Subject من القائمة
4. اختر ملف (PDF مثلاً)
5. اضغط "رفع المادة"

**Check:**
- [ ] رسالة "جاري الرفع..."
- [ ] Progress bar (إن وجد)
- [ ] رسالة نجاح
- [ ] Redirect إلى `/library?success=...`

---

#### 6.3 Validation

**Test Cases:**
- [ ] ❌ عنوان فارغ
- [ ] ❌ بدون اختيار Subject
- [ ] ❌ بدون ملف
- [ ] ✅ جميع الحقول صحيحة

---

### 7. اختبار باقي الصفحات

#### 7.1 Dashboard

**Steps:**
1. سجل دخول
2. افتح `/dashboard`

**Check:**
- [ ] رسالة ترحيب مع اسم المستخدم
- [ ] إحصائيات المستخدم
- [ ] قائمة المواد المرفوعة (إن وجدت)
- [ ] Quick actions

---

#### 7.2 GPA Calculator

**Steps:**
1. افتح `/gpa-calculator`

**Check:**
- [ ] الصفحة تحمل
- [ ] حقول إدخال الدرجات
- [ ] زر "حساب المعدل"
- [ ] النتيجة تظهر

---

#### 7.3 Leaderboard

**Steps:**
1. افتح `/leaderboard`

**Check:**
- [ ] الصفحة تحمل
- [ ] قائمة المتصدرين
- [ ] الترتيب حسب النقاط/التقييم

---

### 8. اختبار Navbar

#### 8.1 Navigation Links

**Check:**
- [ ] "الرئيسية" → `/`
- [ ] "المكتبة" → `/library`
- [ ] "رفع مادة" → `/upload`
- [ ] Logo → `/`

---

#### 8.2 حالة المستخدم

**Check (غير مسجل):**
- [ ] "تسجيل الدخول" يظهر
- [ ] "إنشاء حساب" يظهر

**Check (مسجل):**
- [ ] اسم المستخدم يظهر
- [ ] Dropdown menu يعمل:
  - [ ] Dashboard
  - [ ] الإعدادات
  - [ ] تسجيل خروج

---

#### 8.3 Mobile Menu

**Steps:**
1. صغر الشاشة < 768px
2. اضغط Hamburger menu

**Check:**
- [ ] Menu يفتح
- [ ] جميع الروابط تظهر
- [ ] Close button يعمل

---

### 9. اختبار Responsive Design

#### 9.1 Desktop (> 1024px)

**Check:**
- [ ] Grid columns واضحة
- [ ] Sidebar (إن وجد)
- [ ] Navbar كامل

---

#### 9.2 Tablet (768px - 1024px)

**Check:**
- [ ] Grid يتقلص
- [ ] Navbar يتكيف
- [ ] لا overflow

---

#### 9.3 Mobile (< 768px)

**Check:**
- [ ] Stack layout
- [ ] Hamburger menu
- [ ] Touch-friendly buttons
- [ ] لا horizontal scroll

---

### 10. اختبار Performance

#### 10.1 Load Times

**Measure:**
- [ ] Home page < 3s
- [ ] Library page < 3s
- [ ] Material page < 4s (PDF loading)

**Tools:**
- Chrome DevTools → Network
- Lighthouse

---

#### 10.2 Build Production

**Steps:**
```bash
cd frontend
npm run build
```

**Check:**
- [ ] Build ينجح بدون أخطاء
- [ ] No TypeScript errors
- [ ] No lint warnings
- [ ] Bundle size معقول

---

### 11. اختبار Error Handling

#### 11.1 404 Page

**Steps:**
1. افتح: http://localhost:3001/nonexistent

**Check:**
- [ ] صفحة 404 مخصصة
- [ ] رابط للـ Home

---

#### 11.2 API Errors

**Test:**
- [ ] Material غير موجود → رسالة خطأ
- [ ] Network error → رسالة واضحة
- [ ] Permission denied → redirect أو رسالة

---

### 12. اختبار Security

#### 12.1 Protected Routes

**Test:**
- افتح `/upload` بدون login → Redirect
- افتح `/dashboard` بدون login → Redirect

---

#### 12.2 CRUD Operations

**Check:**
- [ ] لا يمكن حذف مواد الآخرين
- [ ] لا يمكن تعديل تقييمات الآخرين
- [ ] File upload له حد أقصى

---

## 🐛 التبليغ عن Bugs

إذا وجدت مشكلة:

1. افتح DevTools Console
2. التقط screenshot
3. سجل الـ steps للتكرار
4. افتح Issue على GitHub أو
5. أرسل تقرير مفصل

### تنسيق التقرير:

```markdown
**الصفحة**: /material/123
**المشكلة**: PDF لا يحمل
**Steps**:
1. فتح المادة
2. انتظار 10 ثواني
3. PDF spinner لا ينتهي

**Console Errors**:
```
[Error log here]
```

**Browser**: Chrome 120
**OS**: Windows 11
```

---

## ✅ Final Checklist

قبل الإطلاق:

- [ ] جميع الاختبارات أعلاه نجحت
- [ ] Build production نجح
- [ ] لا أخطاء في Console
- [ ] تم إنشاء `material_reports` collection
- [ ] OAuth مكوّن في PocketBase
- [ ] Permissions صحيحة
- [ ] التوثيق محدث
- [ ] Backup للبيانات

---

## 🚀 مستعد للإطلاق!

إذا نجحت جميع الاختبارات:

```bash
# Deploy
npm run build
npm start

# أو استخدم platform مثل Vercel
vercel deploy
```

---

*دليل الاختبار - Version 1.0*  
*آخر تحديث: يناير 2025*
