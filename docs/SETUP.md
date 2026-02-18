# 🚀 دليل الإعداد الكامل لـ Fyleo

---

## المسار السريع (5 دقائق)

```bash
# 1. استنساخ
git clone <repo-url>
cd Fyleo

# 2. تثبيت Frontend
cd frontend
npm install
npm install react-pdf pdfjs-dist  # للـ PDF viewer

# 3. إعدادات البيئة
cat > .env.local << EOF
NEXT_PUBLIC_POCKETBASE_URL=https://pocketbase97.mooo.com
EOF

# 4. بدء التطوير
npm run dev

# النتيجة: http://localhost:3001 ✅
```

---

## الإعداد الكامل خطوة بخطوة

### 1️⃣ متطلبات النظام

```bash
# تحقق من الإصدارات
node --version        # >= 18.0.0
npm --version         # >= 9.0.0
git --version         # >= 2.0.0
```

إذا لم يكن مثبتاً:
- **Node.js**: https://nodejs.org/ (اختر LTS)
- **Git**: https://git-scm.com/

---

### 2️⃣ استنساخ المشروع

```bash
cd ~/Projects  # أو أي مجلد تفضله
git clone <repo-url> Fyleo
cd Fyleo
```

---

### 3️⃣ إعداد Frontend

#### أ) تثبيت المكتبات
```bash
cd frontend
npm install
```

#### ب) المكتبات الإضافية (للـ PDF)
```bash
npm install react-pdf pdfjs-dist
```

#### ج) متغيرات البيئة

أنشئ `.env.local`:
```bash
cat > .env.local << EOF
# PocketBase Core
NEXT_PUBLIC_POCKETBASE_URL=https://pocketbase97.mooo.com

# Optional: Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
EOF
```

#### د) اختبار البناء
```bash
npm run type-check  # تحقق من TypeScript
npm run build       # بناء الإصدار النهائي
```

---

### 4️⃣ إعداد قاعدة البيانات (PocketBase)

#### ✅ Backend موجود بالفعل
```
https://pocketbase97.mooo.com
- Collections جاهزة
- OAuth2 مفعّل
- API متاح
```

---

### 5️⃣ بدء التطوير

```bash
cd frontend
npm run dev
```

افتح **http://localhost:3001** في المتصفح ✅

---

## 🧪 الاختبار الأول

1. **المكتبة:** http://localhost:3001/library
2. **تسجيل الدخول:** http://localhost:3001/login
3. **الرفع:** http://localhost:3001/upload

---

## ✅ Checklist الإشعال

- [ ] تثبيت Node.js 18+
- [ ] استنساخ المشروع
- [ ] `npm install` في frontend/
- [ ] `npm install react-pdf pdfjs-dist`
- [ ] إنشاء `.env.local`
- [ ] بدء `npm run dev`
- [ ] زيارة http://localhost:3001/

**انتهيت؟ تابع docs/MIGRATIONS.md لإعداد البيانات! 🎉**
