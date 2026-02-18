# 🎓 Fyleo - منصة تبادل المواد التعليمية

منصة تعليمية عربية لمشاركة واستكشاف المواد الدراسية من المجتمع.

---

## ✨ النظرة العامة

**Fyleo** هي منصة تعليمية شاملة تمكّن الطلاب من:
- 📚 استكشاف آلاف المواد الدراسية
- ⭐ تقييم المواد ومراجعتها
- 📤 رفع ومشاركة ملاحظاتهم وملخصاتهم
- 🎯 التصفح حسب التخصص الجامعي والمادة
- 🔍 البحث والفلترة المتقدمة

---

## 🚀 البدء السريع

### المتطلبات:
- Node.js 18+
- npm أو yarn
- حساب PocketBase (موجود بالفعل: https://pocketbase97.mooo.com)

### التثبيت:

```bash
# 1. استنساخ المشروع (إذا لم يكن موجوداً)
git clone <repository-url>
cd Fyleo

# 2. تثبيت Dependencies
cd frontend
npm install

# 3. إنشاء ملف .env.local
echo "NEXT_PUBLIC_POCKETBASE_URL=https://pocketbase97.mooo.com" > .env.local

# 4. تشغيل السيرفر
npm run dev
```

السيرفر سيعمل على: http://localhost:3001

---

## 📁 البنية الأساسية

```
Fyleo/
├── frontend/                    # Next.js Frontend
│   ├── src/
│   │   ├── app/                # App Router Pages
│   │   │   ├── page.tsx        # الصفحة الرئيسية
│   │   │   ├── library/        # صفحة المكتبة
│   │   │   ├── material/[id]/  # صفحة تفاصيل المادة
│   │   │   ├── category/[slug]/ # صفحة التخصص
│   │   │   ├── upload/         # صفحة رفع المواد
│   │   │   ├── login/          # تسجيل الدخول
│   │   │   └── register/       # التسجيل
│   │   ├── components/         # React Components
│   │   │   ├── Navbar.tsx
│   │   │   ├── PDFViewer.tsx
│   │   │   └── ui/             # UI Components
│   │   ├── lib/                # Utilities
│   │   │   ├── pocketbase.ts   # PocketBase client
│   │   │   └── auth-store.ts   # Authentication store
│   │   └── hooks/              # Custom Hooks
│   └── package.json
├── backend/                     # PocketBase Migrations
│   └── pb_migrations/
├── scripts/                     # Utility Scripts
│   ├── check-collections.mjs
│   └── create-reports-collection.mjs
├── docs/                        # التوثيق
│   ├── DATABASE.md
│   ├── SETUP.md
│   └── SETUP_MISSING_COLLECTIONS.md
└── README_COMPLETE.md          # هذا الملف
```

---

## 🗄️ نموذج البيانات

### المصطلحات الصحيحة:

| المصطلح العربي | المصطلح الإنجليزي | Collection | العدد |
|----------------|-------------------|------------|-------|
| التخصصات الجامعية | Categories | `categories` | 8 |
| المواد الدراسية | Subjects | `subjects` | 132 |
| الملفات التعليمية | Materials | `materials` | 397 |
| أنواع الملفات | File Types | `fileTypes` | 6 |
| التقييمات | Ratings | `material_ratings` | 1+ |
| البلاغات | Reports | `material_reports` | - |

### العلاقات:

```
Categories (1) ─────> (N) Subjects
Subjects (1) ───────> (N) Materials
Materials (1) ──────> (N) Ratings
Materials (1) ──────> (N) Reports
Users (1) ──────────> (N) Materials (uploader)
```

---

## 🎯 الميزات الرئيسية

### 1. نظام المصادقة
- ✅ Email + Password
- ✅ OAuth (Google, GitHub)
- ✅ Session Management
- ✅ Auto Token Refresh

### 2. استكشاف المواد
- ✅ عرض المواد بشكل هرمي: Categories → Subjects → Materials
- ✅ البحث والفلترة
- ✅ الترتيب حسب: الأحدث، التقييم، التحميلات
- ✅ Pagination

### 3. عرض تفاصيل المادة
- ✅ معاينة PDF مباشرة
- ✅ تحميل الملفات
- ✅ عرض معلومات المادة والرافع
- ✅ نظام التقييمات (1-5 نجوم)
- ✅ نظام البلاغات

### 4. رفع المواد
- ✅ نموذج رفع سهل
- ✅ دعم: PDF, Word, PowerPoint, صور
- ✅ Validation كامل
- ✅ ربط بالمادة الدراسية

### 5. صفحات إضافية
- ✅ Dashboard
- ✅ GPA Calculator
- ✅ Leaderboard
- ✅ Home Page (Hero + Categories + Trending)

---

## ⚙️ التكنولوجيا المستخدمة

### Frontend:
- **Framework**: Next.js 14.2.35 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **PDF Viewer**: react-pdf

### Backend:
- **PocketBase**: https://pocketbase97.mooo.com
  - Real-time Database
  - Authentication
  - File Storage
  - API Rules

### Tools:
- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier (optional)

---

## 🔐 المصادقة والأمان

### Authentication Flow:

```
1. المستخدم يدخل Email + Password
   ↓
2. PocketBase يتحقق من البيانات
   ↓
3. إرجاع Token + User Object
   ↓
4. حفظ في localStorage
   ↓
5. Auto-refresh قبل انتهاء الصلاحية
```

### OAuth Flow:

```
1. المستخدم يضغط "Continue with Google/GitHub"
   ↓
2. Redirect إلى Provider
   ↓
3. المستخدم يوافق
   ↓
4. Redirect إلى /auth/callback
   ↓
5. التحقق من Code
   ↓
6. حفظ Session
```

---

## 📝 API Documentation

### PocketBase Collections:

#### 1. `categories` (التخصصات)
```ts
{
  id: string
  nameAr: string      // "كلية الهندسة"
  nameEn: string      // "Engineering"
  slug: string        // "engineering"
  icon: string        // "🎓" (emoji)
  color: string       // "#3B82F6" (hex)
  order: number       // 1, 2, 3...
}
```

#### 2. `subjects` (المواد الدراسية)
```ts
{
  id: string
  nameAr: string          // "فيزياء عامة"
  nameEn: string          // "General Physics"
  category: string        // relation to categories
  level: string           // "1", "2", "3"...
  creditHours: number     // 3
  isActive: boolean
}
```

#### 3. `materials` (الملفات)
```ts
{
  id: string
  title: string               // "ملخص الفصل 5"
  description: string
  file: string                // filename
  uploader: string            // relation to users
  subject: string             // relation to subjects
  fileType: string            // relation to fileTypes
  averageRating: number       // 4.5
  totalRatings: number        // 10
  downloads: number           // 50
  views: number              // 200
  created: string            // ISO date
}
```

#### 4. `material_ratings` (التقييمات)
```ts
{
  id: string
  material: string    // relation
  user: string        // relation
  rating: number      // 1-5
  comment: string     // optional
  created: string
}
```

---

## 🐛 استكشاف الأخطاء

### مشاكل شائعة:

#### 1. السيرفر لا يعمل على 3000
```bash
# استخدم port آخر
npm run dev -- -p 3001
```

#### 2. OAuth redirect_uri mismatch
- تحقق من أن redirect_uri في PocketBase admin يطابق:
  ```
  http://localhost:3001/auth/callback
  ```

#### 3. "You are not allowed to perform this action"
- تحقق من API Rules في PocketBase
- راجع: [`POCKETBASE_PERMISSIONS.md`](POCKETBASE_PERMISSIONS.md)

#### 4. Categories لا تظهر في الصفحة الرئيسية
- تحقق من Console للأخطاء
- تأكد من أن `categories` collection يحتوي على بيانات
- جرب:
  ```bash
  node scripts/check-collections.mjs
  ```

---

## 📦 Build للإنتاج

```bash
# 1. Build
cd frontend
npm run build

# 2. تشغيل Production Server
npm start
```

### Docker (اختياري):

```bash
# Build Image
docker build -t fyleo-frontend -f frontend/Dockerfile .

# Run Container
docker run -p 3000:3000 fyleo-frontend
```

---

## ⚠️ خطوة مهمة: إنشاء `material_reports` Collection

**هذا الـ collection مفقود حالياً وضروري لعمل نظام البلاغات.**

### الطريقة السريعة (5 دقائق):

1. افتح: https://pocketbase97.mooo.com/_/
2. سجل دخول بحساب Admin
3. Collections → New collection
4. اتبع الخطوات في: [`docs/SETUP_MISSING_COLLECTIONS.md`](docs/SETUP_MISSING_COLLECTIONS.md)

---

## 🧪 الاختبار

### التحقق من Collections:
```bash
node scripts/check-collections.mjs
```

### Build Test:
```bash
cd frontend
npm run build
```

### Manual Testing Checklist:

- [ ] الصفحة الرئيسية تحمل
- [ ] Categories تظهر (8 بطاقات)
- [ ] الضغط على category يفتح صفحة التخصص
- [ ] المكتبة تعرض المواد
- [ ] معاينة PDF تعمل
- [ ] تسجيل الدخول يعمل
- [ ] OAuth يعمل (Google/GitHub)
- [ ] رفع ملف يعمل
- [ ] التقييم يحفظ
- [ ] البلاغ يرسل (بعد إنشاء collection)

---

## 📊 الإحصائيات

| البند | العدد |
|------|------|
| صفحات | 10 |
| Components | 8+ |
| Collections | 6/7 (1 مفقود) |
| Materials | 397 |
| Subjects | 132 |
| Categories | 8 |
| Lines of Code | ~5,000+ |

---

## 🤝 المساهمة

للمساهمة في المشروع:

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

---

## 📚 التوثيق الإضافي

- [`PLATFORM_STATUS.md`](PLATFORM_STATUS.md) - حالة المنصة الكاملة
- [`ARCHITECTURE_PLAN.md`](ARCHITECTURE_PLAN.md) - خطة البنية
- [`FIELD_MIGRATION_COMPLETE.md`](FIELD_MIGRATION_COMPLETE.md) - تصحيح الأسماء
- [`POCKETBASE_PERMISSIONS.md`](POCKETBASE_PERMISSIONS.md) - الصلاحيات
- [`docs/DATABASE.md`](docs/DATABASE.md) - Database Schema
- [`docs/SETUP_MISSING_COLLECTIONS.md`](docs/SETUP_MISSING_COLLECTIONS.md) - إنشاء Collections مفقودة

---

## 🎯 Roadmap

### Phase 1 (مكتمل ✅):
- [x] نظام المصادقة
- [x] عرض واستكشاف المواد
- [x] رفع المواد
- [x] التقييمات
- [x] التصميم الاحترافي

### Phase 2 (قادم):
- [ ] إشعارات real-time
- [ ] نظام النقاط والجوائز
- [ ] Discussion forums
- [ ] Admin dashboard
- [ ] Analytics

### Phase 3 (مستقبلي):
- [ ] Mobile app
- [ ] AI recommendations
- [ ] Video materials support
- [ ] Live collaboration

---

## 📜 License

هذا المشروع مفتوح المصدر. يمكنك استخدامه وتعديله حسب احتياجاتك.

---

## 💬 الدعم

للأسئلة أو المساعدة:
- افتح Issue على GitHub
- أرسل email: [your-email]
- راجع التوثيق في `/docs`

---

## 🎉 شكر خاص

- **Next.js Team** - فريم ورك رائع
- **PocketBase** - Backend سريع وسهل
- **Tailwind CSS** - تصميم احترافي
- **المجتمع العربي** - الدعم والإلهام

---

**🚀 المنصة جاهزة للإطلاق! ابدأ الآن واستكشف المواد.**

---

## 📞 Contact

- **Website**: Coming soon
- **GitHub**: [Repository URL]
- **Email**: support@fyleo.com

---

*صُنع بـ ❤️ للمجتمع العربي التعليمي*
