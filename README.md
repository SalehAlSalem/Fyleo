# 🚀 Fyleo Platform

> منصة تعليمية حديثة مستوحاة من StudoCu وCourseHero، تركز على **نظام التقييمات** و**البلاغات** و**عرض الملفات داخل المتصفح**.

## 🎯 المميزات الرئيسية

✅ **نظام تقييمات متقدم** - قيّم المواد من 1 إلى 5 مع التعليقات  
✅ **نظام بلاغات** - أبلغ عن محتوى غير مناسب  
✅ **عرض ملفات مدمج** - شاهد PDFs والصور مباشرة في المتصفح  
✅ **OAuth2 عام النطاق** - تسجيل دخول عبر جوجل/جيثب على أي جهاز  
✅ **مكتبة قوية** - بحث وفلترة وترتيب المواد  
✅ **تحميل سهل** - اسحب وأسقط الملفات أو اختر من جهازك  

---

## 📋 متطلبات التشغيل

### Backend
- **PocketBase** (ملقى على: https://pocketbase97.mooo.com)
  - SQL-based database سهل الاستخدام
  - OAuth2 مدمج
  - API تلقائي

### Frontend
- **Node.js 18+**
- **npm** أو **yarn**

---

## 🛠️ التثبيت السريع

### 1. استنساخ المشروع
```bash
git clone <repo-url>
cd Fyleo
```

### 2. تثبيت المكتبات (Frontend)
```bash
cd frontend
npm install
# إضافة react-pdf
npm install react-pdf pdfjs-dist
```

### 3. متغيرات البيئة (Frontend)
أنشئ ملف `.env.local` في مجلد `frontend/`:

```env
NEXT_PUBLIC_POCKETBASE_URL=https://pocketbase97.mooo.com
```

### 4. بدء Server التطوير
```bash
npm run dev
```

Frontend سيكون متاحاً على **http://localhost:3001**

---

## 🗂️ هيكل قاعدة البيانات

### Collections الأساسية

#### 1. **categories** - التصنيفات
```json
{
  "nameAr": "الرياضيات",
  "nameEn": "Mathematics",
  "icon": "📐",
  "color": "#3b82f6",
  "slug": "mathematics",
  "order": 1
}
```

#### 2. **subjects** - المواد الدراسية
```json
{
  "nameAr": "حساب التفاضل والتكامل",
  "categoryId": "...",
  "code": "MATH101",
  "creditHours": 4,
  "level": "1"
}
```

#### 3. **fileTypes** - أنواع الملفات
```json
{
  "nameAr": "ملف PDF",
  "extension": "pdf",
  "mimeType": "application/pdf",
  "allowedInBrowser": true
}
```

#### 4. **materials** - المواد (الملفات المرفوعة)
```json
{
  "title": "ملخص الفصل 5",
  "description": "...",
  "file": "...", // مرجع الملف
  "uploaderId": "...",
  "subjectId": "...",
  "averageRating": 4.5,
  "totalRatings": 12,
  "downloads": 153
}
```

#### 5. **material_ratings** - التقييمات ⭐
```json
{
  "materialId": "...",
  "userId": "...",
  "rating": 5,
  "comment": "ملخص رائع وشامل!",
  "helpful": 0
}
```

#### 6. **material_reports** - البلاغات 🚩
```json
{
  "materialId": "...",
  "userId": "...",
  "reason": "inappropriate", // inappropriate, spam, copyright, malware, other
  "details": "المحتوى يحتوي على كلمات نابية",
  "status": "open" // open, reviewing, resolved, rejected
}
```

---

## 📱 صفحات التطبيق

### أساسية
- **`/`** - الصفحة الرئيسية (هيرو + إحصائيات)
- **`/library`** - مكتبة المواد (بحث + فلترة + ترتيب)
- **`/material/[id]`** - تفاصيل المادة + عرض + تقييمات + بلاغات
- **`/upload`** - رفع مادة جديدة
- **`/login`** - تسجيل الدخول (OAuth + email/password)
- **`/register`** - إنشاء حساب
- **`/auth/callback`** - معالج OAuth callback

---

## 🔐 التوثيق (OAuth)

### Google OAuth Setup
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com)
2. أنشئ OAuth 2.0 Client ID (Web application)
3. أضف Authorized redirect URIs:
   - `http://localhost:3001/auth/callback` (تطوير)
   - `https://fyleo.example.com/auth/callback` (إنتاج)
4. ضع Client ID في PocketBase OAuth settings

---

## 🚀 البدء السريع

```bash
# 1. جهز البيانات الأولية
# افتح PocketBase console وشغل docs/SEED_DATA.js

# 2. ابدأ Frontend
cd frontend
npm run dev

# 3. افتح http://localhost:3001
# اختبر: المكتبة → اختر مادة → اقرأ التقييمات
```

---

## 🔄 عملية Upload

```
المستخدم → يختار ملف + معلومات
   ↓
مصادقة (تسجيل دخول)
   ↓
رفع إلى PocketBase (File storage)
   ↓
حفظ البيانات في collection materials
   ↓
ظهور المادة في المكتبة
   ↓
يقيمها ويبلغ عنها المستخدمون
```

---

## 📊 نموذج البيانات

```
Users
├── Created materials
├── Created ratings
├── Created reports
└── Profile data

Materials
├── Subject
├── File Type
├── Ratings (1 to many)
├── Reports (1 to many)
└── Uploader (User)

Categories
└── Subjects (1 to many)
```

---

## 🧪 اختبار الميزات

### 1. تقييم مادة
```
1. سجل دخول
2. اذهب للمكتبة
3. فتح أي مادة
4. اختر عدد النجوم + اكتب تعليق
5. اضغط "حفظ التقييم"
```

### 2. بلاغ مادة
```
1. فتح أي مادة
2. اضغط زر "بلاغ"
3. اختر السبب + اكتب تفاصيل
4. اضغط "إرسال البلاغ"
```

### 3. عرض PDF
```
1. رفع ملف PDF
2. افتح تفاصيل المادة
3. سترى معاين PDF مع:
   - أزرار التنقل (صفحة سابقة/تالية)
   - تكبير/تصغير
   - زر تحميل
```

---

## 📁 هيكل المشروع

```
Fyleo/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx (مع Navbar)
│   │   │   ├── page.tsx (الرئيسية)
│   │   │   ├── library/
│   │   │   │   └── page.tsx (المكتبة)
│   │   │   ├── material/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx (تفاصيل + تقييمات + بلاغات)
│   │   │   ├── upload/
│   │   │   │   └── page.tsx (نموذج الرفع)
│   │   │   ├── auth/
│   │   │   │   └── callback/page.tsx (OAuth handler)
│   │   │   └── login/register/
│   │   ├── components/
│   │   │   ├── Navbar.tsx (تنقل عام)
│   │   │   ├── PDFViewer.tsx (عارض PDF)
│   │   │   └── ui/ (shadcn components)
│   │   ├── lib/
│   │   │   ├── pocketbase.ts (عميل PocketBase)
│   │   │   ├── auth-store.ts (Zustand store)
│   │   │   └── utils.ts
│   │   └── styles/
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
├── backend/
│   ├── pb_migrations/ (نقل DB)
│   │   ├── 1738598400_users_extend.js
│   │   ├── ...
│   │   └── core_schema.sql (جديد!)
│   └── ...
├── docs/
│   ├── DATABASE.md
│   ├── SETUP.md
│   └── SEED_DATA.js (بيانات اختبار)
└── README.md (هذا الملف)
```

---

## 🐛 استكشاف الأخطاء

### "OAuth callback failed"
- ✓ تأكد من إضافة callback URL إلى Google Console
- ✓ تأكد من صحة POCKETBASE_URL في .env.local

### "لا توجد مواد"
- ✓ شغل SEED_DATA.js في PocketBase console
- ✓ أنشئ subjects قبل محاولة الرفع

### "PDF لم يظهر"
- ✓ تأكد من رفع ملف PDF فعلي (ليس صورة للـ PDF)
- ✓ جرّب متصفح آخر

---

## 📈 الخطوات التالية (Phase 2)

- [ ] لوحة تحكم الإدارة
- [ ] إحصائيات متقدمة
- [ ] تصنيفات مستخدم
- [ ] قوائم المحفوظات
- [ ] الإخطارات الفورية
- [ ] تطبيق الهاتف

---

## 📞 الدعم

للمساعدة أو الإبلاغ عن مشاكل، أنشئ issue عبر GitHub.

---

**بُني مع ❤️ بـ Next.js + PocketBase + Tailwind CSS**


## 📚 نظرة عامة

منصة تعليمية متكاملة مبنية على PocketBase، تجمع أفضل ميزات:
- **StudoCu** - مشاركة الملاحظات والمواد الدراسية
- **CourseHero** - المحتوى التعليمي والحلول
- **Open edX** - إدارة الكورسات والتعليم الإلكتروني
- **Moodle** - نظام إدارة التعلم
- **Canvas** - منصة التعليم الحديثة

## 🏗️ البنية التقنية

### Backend
- **PocketBase** - قاعدة بيانات و API و Authentication
- **Node.js** - خدمات إضافية
- **SQLite** - قاعدة البيانات

### Frontend
- **Next.js 14** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI Components

## 🚀 الميزات الرئيسية

### 1. إدارة المستخدمين
- تسجيل دخول آمن
- أدوار متعددة (طالب، معلم، مشرف)
- ملفات شخصية

### 2. إدارة الكورسات
- إنشاء وتنظيم الكورسات
- وحدات ودروس
- تتبع التقدم

### 3. المحتوى التعليمي
- رفع ومشاركة الملفات
- مكتبة المواد الدراسية
- محتوى تفاعلي

### 4. التفاعل
- منتديات النقاش
- الأسئلة والأجوبة
- التقييمات والمراجعات

### 5. التقييم
- اختبارات تفاعلية
- واجبات منزلية
- نتائج وشهادات

## 📁 هيكل المشروع

```
fyleo/
├── backend/                    # PocketBase Backend
│   ├── pb_migrations/         # Database migrations
│   ├── pb_hooks/              # PocketBase hooks
│   └── pocketbase             # PocketBase executable
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/               # App Router
│   │   ├── components/        # React Components
│   │   ├── lib/               # Utilities
│   │   └── types/             # TypeScript Types
│   └── public/                # Static files
├── docs/                       # Documentation
└── docker-compose.yml         # Docker setup
```

## 🛠️ التثبيت

```bash
# Clone the repository
git clone https://github.com/SalehAlSalem/Fyleo.git
cd Fyleo

# Install dependencies
cd frontend
npm install

# Start development
npm run dev
```

## 📝 الترخيص

MIT License
