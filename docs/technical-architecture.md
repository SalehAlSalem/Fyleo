# Technical Architecture (مقترح)

هذا المستند يشرح المكونات التقنية المختارة للمشروع، مع مبررات وتكامل.

القرار الرئيسي: استخدام Supabase (Free Tier) كـ Backend شامل

لماذا Supabase?
- يقدم Auth وPostgres وStorage ضمن خدمة واحدة.
- واجهة API جاهزة (REST/Realtime) مع مكتبات جافاسكربت سهلة الاستخدام.
- نموذج مجاني مناسب لبدء MVP، ويمكن التوسع لاحقاً.

مكونات النظام

1. Frontend
- React + Vite (الموجود حالياً في المشروع).
- UI: Tailwind CSS أو CSS Modules.
- Routing: react-router-dom.
- State: local state + optional Redux/Context للميزات المعقدة.

2. Backend (Supabase)
- Auth: Supabase Auth (Email + OAuth Google).
- Database: Postgres — جداول للمستخدمين، المساهمات، الملفات، ومراجعات.
- Storage: Supabase Storage لحفظ الملفات (PDFs) ومنح روابط التحميل.
- Functions (اختياري): Edge functions أو serverless endpoints للتحقق من الملفات أو تحويلها.

3. CI/CD وHosting
- Vercel أو Netlify للنشر التلقائي من GitHub.
- Environment: متغيرات VITE_ لربط Supabase URL وPublicKey.

4. Moderation workflow
- كل رفع يُضاف للحالة `pending` في جدول `submissions`.
- لوحة مشرف (protected route) تستعرض الملفات المعلقة وتسمح بالموافقة/الرفض.
- عند الموافقة: يتم نقل/نسخ السجل إلى `files`، ويتم منح المساهم حق الوصول الكامل.

5. قواعد منع التكرار
- عند رفع ملف جديد، نحسب الـhash (مثلاً SHA-256) ونقارن مع ملفات موجودة.
- كذلك نطابق عن طريق `filename` و`size` و`sourceURL` (إن وُجدت).

6. سجلات وأنشطة
- جدول `activity_log` يسجل كل عملية (upload, approve, download) مع من قام بها والوقت.

7. الأمان
- تحقق من حجم الملف ونوعه قبل القبول.
- مسح الملفات عن طريق virus-scan service إذا رغبت (اختياري لاحقاً).

مخطط مبدئي للجداول (موجز)
- users (id, email, name, role, created_at)
- submissions (id, user_id, title, subject, file_path, file_hash, type, status, created_at)
- files (id, submission_id, title, subject, storage_path, download_url, uploaded_at)
- activity_log (id, user_id, action, target_id, meta, created_at)

---

ملاحظة: إن رغبت أن أقدّم سكربت SQL لإنشاء الجداول في Supabase، أقدر أجهزه لك.