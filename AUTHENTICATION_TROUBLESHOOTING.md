# 🔧 دليل استكشاف أخطاء المصادقة وإصلاحها

## 🎯 المشكلة الرئيسية

**الأعراض**:
- المستخدم يسجل دخول بنجاح
- لديه صلاحية `admin` label
- لكن لا يستطيع الوصول للصفحات المحمية
- Console يظهر: `401 Unauthorized` و `User (role: guests) missing scopes`

**السبب الجذري**:
الجلسة (Session) لا تُحفظ أو لا تُرسل مع طلبات API

---

## ✅ الإصلاحات المُطبقة

### 1. تصحيح Appwrite Endpoint ✅
**الملف**: `.env`
```env
VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
```
**مهم جداً**: يجب أن يكون `cloud.appwrite.io` وليس `fra.cloud.appwrite.io`

### 2. تحسين authService.js ✅
**الملف**: `src/services/authService.js`

**التحسينات**:
- مسح الجلسات القديمة قبل إنشاء جلسة جديدة
- إضافة retry logic عند جلب بيانات المستخدم
- التحقق من الجلسة بعد الإنشاء
- logging شامل لكل خطوة

### 3. أداة تشخيص الجلسات ✅
**الملف**: `src/utils/sessionDebug.js`

**الاستخدام**:
```javascript
import { sessionDebug } from '../utils/sessionDebug';
await sessionDebug.checkSession();
```

### 4. صفحة اختبار الجلسة ✅
**المسار**: `/session-test`
**الملف**: `src/pages/SessionTest/SessionTestPage.jsx`

---

## 🧪 كيفية التشخيص

### الخطوة 1: افتح صفحة الاختبار
```
http://localhost:5173/session-test
```

### الخطوة 2: راقب النتائج
الصفحة ستختبر:
1. ✅ إعدادات Appwrite (endpoint, project)
2. ✅ وجود Cookies
3. ✅ المستخدم الحالي (account.get())
4. ✅ الجلسات النشطة
5. ✅ تفاصيل الجلسة الحالية

### الخطوة 3: افهم النتائج

#### ✅ كل شيء يعمل
```
✅ 1. إعدادات Appwrite
✅ 2. Cookies (Present)
✅ 3. المستخدم الحالي
✅ 4. الجلسات النشطة (1)
✅ 5. تفاصيل الجلسة
```

#### ❌ لا توجد جلسة (401)
```
✅ 1. إعدادات Appwrite
❌ 2. Cookies (None)
❌ 3. المستخدم الحالي (401 Unauthorized)
❌ 4. الجلسات النشطة (Failed)
❌ 5. تفاصيل الجلسة (Failed)
```
**الحل**: سجل دخول من جديد

#### ⚠️ Endpoint خاطئ
```
❌ 1. إعدادات Appwrite (endpoint wrong)
```
**الحل**: صحح `.env` وأعد تشغيل الخادم

---

## 🔍 خطوات استكشاف الأخطاء

### المشكلة: 401 Unauthorized بعد تسجيل الدخول

#### الخطوة 1: تحقق من الـ Endpoint
```bash
# افتح .env
cat .env | grep VITE_APPWRITE_URL

# يجب أن يكون:
VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
```

#### الخطوة 2: امسح بيانات المتصفح
```
1. افتح DevTools (F12)
2. Application → Clear storage
3. Clear site data
4. أغلق وافتح المتصفح من جديد
```

#### الخطوة 3: أعد تشغيل الخادم
```bash
# أوقف الخادم (Ctrl+C)
npm run dev
```

#### الخطوة 4: سجل دخول من جديد
```
1. اذهب إلى /login
2. افتح Console (F12)
3. سجل دخول
4. راقب السجلات:
   🔐 Attempting login for: ...
   🗑️ Cleared existing session
   ✅ Session created: ...
   ✅ User retrieved: ...
   📋 Active sessions: 1
```

#### الخطوة 5: تحقق من الـ Cookies
```
1. DevTools → Application → Cookies
2. ابحث عن: cloud.appwrite.io
3. يجب أن ترى: a_session_[project-id]
```

#### الخطوة 6: اختبر الصفحات المحمية
```
1. اذهب إلى /dashboard
2. يجب أن تدخل بدون redirect
3. اذهب إلى /admin
4. يجب أن تدخل إذا كان لديك admin label
```

---

## 🐛 مشاكل شائعة وحلولها

### المشكلة 1: Cookies لا تُحفظ

**الأعراض**:
- تسجيل الدخول ينجح
- لكن عند refresh الصفحة، المستخدم يُسجل خروج

**الأسباب المحتملة**:
1. Endpoint خاطئ
2. المتصفح يحجب cookies من third-party
3. HTTPS/HTTP mismatch

**الحلول**:
```bash
# 1. تحقق من الـ endpoint
echo $VITE_APPWRITE_URL
# يجب: https://cloud.appwrite.io/v1

# 2. تحقق من إعدادات المتصفح
# Chrome: Settings → Privacy → Cookies
# تأكد أن "Allow all cookies" مفعّل

# 3. تحقق من البروتوكول
# localhost يجب أن يكون http://
# production يجب أن يكون https://
```

### المشكلة 2: Session تُنشأ لكن account.get() يفشل

**الأعراض**:
```
✅ Session created: abc123
❌ User retrieved: Failed (401)
```

**السبب**:
تأخر في تطبيق الـ session على الـ client

**الحل**:
```javascript
// في authService.js - موجود بالفعل
// Retry logic with delay
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    user = await account.get();
    break;
  } catch (e) {
    await new Promise(r => setTimeout(r, 300));
  }
}
```

### المشكلة 3: Admin Panel لا يفتح رغم وجود admin label

**الأعراض**:
- المستخدم لديه admin label
- لكن يتم redirect من /admin

**الأسباب المحتملة**:
1. البريد الإلكتروني غير مؤكد
2. الجلسة غير نشطة

**الحل**:
```javascript
// في AdminGuard.jsx - موجود بالفعل
// التحقق من:
1. emailVerification === true
2. labels.includes('admin') === true
```

**خطوات الإصلاح**:
```
1. اذهب إلى Appwrite Console
2. Auth → Users → اختر المستخدم
3. تحقق من:
   - Email Verification: ✅
   - Labels: admin
4. إذا لم يكن مؤكد:
   - أرسل بريد تأكيد من Console
   - أو فعّل التأكيد يدوياً
```

---

## 📊 فحص الجلسة من Console

### طريقة سريعة للتحقق:

```javascript
// افتح Console في المتصفح (F12)

// 1. تحقق من الإعدادات
console.log('Endpoint:', import.meta.env.VITE_APPWRITE_URL);
console.log('Project:', import.meta.env.VITE_APPWRITE_PROJECT_ID);

// 2. تحقق من الـ cookies
console.log('Cookies:', document.cookie);

// 3. جرب جلب المستخدم
import { account } from './src/config/appwrite';
account.get()
  .then(user => console.log('✅ User:', user))
  .catch(err => console.error('❌ Error:', err));

// 4. اعرض الجلسات
account.listSessions()
  .then(sessions => console.log('📋 Sessions:', sessions))
  .catch(err => console.error('❌ Error:', err));
```

---

## 🔄 سيناريو الإصلاح الكامل

### إذا كان كل شيء لا يعمل، اتبع هذه الخطوات:

```bash
# 1. أوقف الخادم
Ctrl+C

# 2. تحقق من .env
cat .env | grep VITE_APPWRITE_URL
# يجب: https://cloud.appwrite.io/v1

# 3. إذا كان خاطئ، صححه
# افتح .env وعدّل:
VITE_APPWRITE_URL=https://cloud.appwrite.io/v1

# 4. امسح node_modules/.vite (cache)
rm -rf node_modules/.vite

# 5. أعد تشغيل الخادم
npm run dev

# 6. في المتصفح:
# - افتح DevTools (F12)
# - Application → Clear storage → Clear site data
# - أغلق المتصفح تماماً
# - افتحه من جديد

# 7. اذهب إلى /session-test
# - تحقق من جميع الاختبارات

# 8. إذا كانت الإعدادات صحيحة:
# - اذهب إلى /login
# - سجل دخول
# - راقب Console للتأكد من نجاح العملية

# 9. اختبر:
# - /dashboard → يجب أن يعمل
# - /admin → يجب أن يعمل (إذا كان لديك admin label)
```

---

## 🎯 Checklist النهائي

قبل أن تقول "لا يعمل"، تأكد من:

- [ ] `.env` يحتوي على `https://cloud.appwrite.io/v1`
- [ ] أعدت تشغيل الخادم بعد تعديل `.env`
- [ ] مسحت بيانات المتصفح (cookies + local storage)
- [ ] أغلقت وفتحت المتصفح من جديد
- [ ] سجلت دخول من جديد
- [ ] Console لا يظهر أخطاء في الإعدادات
- [ ] `/session-test` يظهر ✅ للاختبارات الأساسية
- [ ] Cookies موجودة في DevTools
- [ ] المستخدم لديه admin label في Appwrite Console
- [ ] البريد الإلكتروني مؤكد

---

## 📞 إذا استمرت المشكلة

إذا اتبعت جميع الخطوات ولا زالت المشكلة موجودة:

1. **افتح `/session-test`** وخذ screenshot للنتائج
2. **افتح Console** وخذ screenshot للأخطاء
3. **افتح DevTools → Network** وسجل طلب login
4. **افتح Appwrite Console** وتحقق من:
   - Project ID صحيح
   - User موجود
   - User له admin label
   - Email verified

---

## 🎉 علامات النجاح

عندما يعمل كل شيء بشكل صحيح، ستر ى:

### في Console:
```
🔧 Appwrite Client Configuration: { endpoint: "...", project: "..." }
🔐 Attempting login for: user@example.com
✅ Session created: abc123
✅ User retrieved: { id: "...", email: "...", verified: true }
📋 Active sessions: 1
```

### في `/session-test`:
```
✅ 1. إعدادات Appwrite
✅ 2. Cookies (Present)
✅ 3. المستخدم الحالي
✅ 4. الجلسات النشطة (1)
✅ 5. تفاصيل الجلسة
```

### في DevTools → Application → Cookies:
```
Name: a_session_68d9740b0012416cb71b
Domain: cloud.appwrite.io
Path: /
Expires: (future date)
HttpOnly: ✓
Secure: ✓
```

---

**آخر تحديث**: تم تطبيق جميع الإصلاحات في الكود
**الحالة**: ✅ جاهز للاختبار
