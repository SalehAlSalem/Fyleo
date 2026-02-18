# Database Schema Documentation

## 📊 Collections Overview

### 1. Users Collection (Extended)
**Collection Name:** `users` (PocketBase built-in)

**Additional Fields:**
- `role` (select): student | teacher | admin | moderator
- `bio` (text): نبذة عن المستخدم
- `avatar` (file): صورة الملف الشخصي
- `university` (text): الجامعة
- `major` (text): التخصص
- `year` (number): السنة الدراسية

---

### 2. Courses
**Collection Name:** `courses`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | text | ✅ | عنوان الكورس |
| slug | text | ✅ | رابط فريد |
| description | editor | ✅ | وصف الكورس |
| thumbnail | file | ❌ | صورة الكورس |
| instructor | relation(users) | ✅ | المعلم |
| category | select | ✅ | التصنيف |
| level | select | ✅ | المستوى |
| university | text | ❌ | الجامعة |
| semester | text | ❌ | الفصل الدراسي |
| credits | number | ❌ | الساعات المعتمدة |
| is_published | bool | ✅ | منشور؟ |
| enrollment_limit | number | ❌ | حد التسجيل |
| tags | json | ❌ | الوسوم |

---

### 3. Modules
**Collection Name:** `modules`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| course | relation(courses) | ✅ | الكورس |
| title | text | ✅ | عنوان الوحدة |
| description | editor | ❌ | وصف الوحدة |
| order | number | ✅ | الترتيب |
| is_published | bool | ✅ | منشور؟ |

---

### 4. Lessons
**Collection Name:** `lessons`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| module | relation(modules) | ✅ | الوحدة |
| title | text | ✅ | عنوان الدرس |
| content | editor | ✅ | المحتوى |
| type | select | ✅ | نوع الدرس |
| video_url | url | ❌ | رابط الفيديو |
| duration | number | ❌ | المدة بالدقائق |
| order | number | ✅ | الترتيب |
| attachments | file | ❌ | مرفقات |
| is_free | bool | ✅ | مجاني؟ |

**Lesson Types:**
- video
- text
- quiz
- assignment
- file
- interactive

---

### 5. Study Materials
**Collection Name:** `study_materials`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | text | ✅ | العنوان |
| description | editor | ❌ | الوصف |
| course | relation(courses) | ✅ | الكورس |
| uploader | relation(users) | ✅ | الرافع |
| type | select | ✅ | النوع |
| files | file | ✅ | الملفات |
| tags | json | ❌ | الوسوم |
| downloads | number | ✅ | عدد التحميلات |
| views | number | ✅ | المشاهدات |
| rating | number | ❌ | التقييم |
| is_verified | bool | ✅ | موثق؟ |

---

### 6. Enrollments
**Collection Name:** `enrollments`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| student | relation(users) | ✅ | الطالب |
| course | relation(courses) | ✅ | الكورس |
| status | select | ✅ | الحالة |
| progress | number | ✅ | التقدم % |
| enrolled_at | date | ✅ | تاريخ التسجيل |
| completed_at | date | ❌ | تاريخ الإكمال |

---

### 7. Lesson Progress
**Collection Name:** `lesson_progress`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| student | relation(users) | ✅ | الطالب |
| lesson | relation(lessons) | ✅ | الدرس |
| is_completed | bool | ✅ | مكتمل؟ |
| time_spent | number | ❌ | الوقت المستغرق |
| last_accessed | date | ✅ | آخر وصول |

---

### 8. Discussions
**Collection Name:** `discussions`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | text | ✅ | العنوان |
| content | editor | ✅ | المحتوى |
| course | relation(courses) | ✅ | الكورس |
| author | relation(users) | ✅ | الكاتب |
| type | select | ✅ | النوع |
| is_pinned | bool | ✅ | مثبت؟ |
| is_locked | bool | ✅ | مقفل؟ |
| views | number | ✅ | المشاهدات |
| tags | json | ❌ | الوسوم |

---

### 9. Replies
**Collection Name:** `replies`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| discussion | relation(discussions) | ✅ | الموضوع |
| author | relation(users) | ✅ | الكاتب |
| content | editor | ✅ | المحتوى |
| parent_reply | relation(replies) | ❌ | رد أساسي |
| is_solution | bool | ✅ | حل؟ |
| attachments | file | ❌ | مرفقات |

---

### 10. Reviews
**Collection Name:** `reviews`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| course | relation(courses) | ✅ | الكورس |
| student | relation(users) | ✅ | الطالب |
| rating | number | ✅ | التقييم (1-5) |
| comment | text | ❌ | التعليق |
| helpful_count | number | ✅ | مفيد |

---

## 🔗 Relationships

```
users
├── courses (instructor)
├── study_materials (uploader)
├── enrollments (student)
├── discussions (author)
├── replies (author)
└── reviews (student)

courses
├── modules
├── enrollments
├── study_materials
├── discussions
└── reviews

modules
└── lessons

lessons
└── lesson_progress

discussions
└── replies
```
