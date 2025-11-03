# 🚀 دليل رفع Appwrite Functions خطوة بخطوة

## 📋 الإعداد المطلوب

تم إنشاء Function جاهزة:
- ✅ `block-user` - لحظر/إلغاء حظر المستخدمين
- ✅ `manage-team-membership` - لإدارة الفرق (إضافة/إزالة)

---

## 🔑 الخطوة 1: إنشاء API Key

### 1.1 اذهب إلى Appwrite Console
```
https://cloud.appwrite.io/console/project-68d9740b0012416cb71b
```

### 1.2 اذهب إلى Settings → API Keys
```
https://cloud.appwrite.io/console/project-68d9740b0012416cb71b/settings/keys
```

### 1.3 اضغط "Create API Key"
- **Name**: `Server Admin Functions`
- **Expiration**: Never (أو حسب رغبتك)
- **Scopes** (الصلاحيات المطلوبة):
  - ✅ `users.read`
  - ✅ `users.write`
  - ✅ `teams.read`
  - ✅ `teams.write`

### 1.4 احفظ الـ API Key
⚠️ **مهم جداً:** انسخ الـ API Key الآن! لن تظهر مرة أخرى.

```
مثال: 1a2b3c4d5e6f7g8h9i0j...
```

---

## 📦 الخطوة 2: رفع Function الأولى (block-user)

### 2.1 اذهب إلى Functions
```
https://cloud.appwrite.io/console/project-68d9740b0012416cb71b/functions
```

### 2.2 اضغط "Create Function"
- **Function ID**: `block-user` (أو اتركه يتم توليده تلقائياً)
- **Name**: `Block User`
- **Runtime**: `Node.js 18.0`
- **Execute access**: `Any` (أو حسب احتياجك)

### 2.3 رفع الكود

#### الطريقة 1: Manual Upload (الأسهل)
1. اضغط على الFunction الجديدة
2. اذهب إلى **Deployments** tab
3. اضغط **"Create deployment"**
4. اختر **"Manual"**
5. ارفع المجلد: `appwrite-functions/block-user/`
   - ✅ `src/main.js`
   - ✅ `package.json`
6. **Entrypoint**: `src/main.js`
7. **Build commands**: `npm install`
8. اضغط **"Create"**

#### الطريقة 2: من Git
1. اربط الrepo مع Appwrite
2. حدد المسار: `appwrite-functions/block-user`
3. Branch: `main`

### 2.4 إضافة Environment Variables
1. اذهب إلى **Settings** tab
2. اضغط **"Add variable"**
3. أضف:
   - **Key**: `APPWRITE_API_KEY`
   - **Value**: [الصق الـ API Key من الخطوة 1.4]
4. احفظ

### 2.5 تفعيل الFunction
- اذهب إلى **Settings**
- تأكد أن **"Enabled"** مفعل ✅

### 2.6 احفظ الـ Function ID
```
مثال: 674727a50031e12345678
```
سنحتاجه لاحقاً في الـ Frontend! 📝

---

## 📦 الخطوة 3: رفع Function الثانية (manage-team-membership)

### كرر نفس خطوات الخطوة 2، لكن بـ:
- **Function ID**: `manage-team-membership`
- **Name**: `Manage Team Membership`
- **Runtime**: `Node.js 18.0`
- **Upload folder**: `appwrite-functions/manage-team-membership/`
- **Environment Variables**:
  - `APPWRITE_API_KEY` = [نفس الKey من الخطوة 1]

⚡ **ملاحظة:** المستخدمين يُضافون **مباشرة بدون دعوة أو إيميل**!

### احفظ الـ Function ID الثانية
```
مثال: 674727b600421abcdefgh
```

---

## ✅ الخطوة 4: التحقق من نجاح الرفع

### 4.1 تحقق من Logs
1. اذهب لكل Function
2. اضغط **"Executions"** tab
3. جرب تشغيل يدوي:
   - اضغط **"Execute now"**
   - Body:
   ```json
   {
     "userId": "test",
     "block": true
   }
   ```
4. تحقق من الـ Logs - يجب أن ترى خطأ (لأن test user غير موجود) لكن Function تعمل ✅

---

## 🔌 الخطوة 5: ربط Frontend بالـ Functions

### 5.1 أضف Function IDs في `.env`
```bash
# في الملف: .env أو .env.local
VITE_BLOCK_USER_FUNCTION_ID=674727a50031e12345678
VITE_MANAGE_TEAM_FUNCTION_ID=674727b600421abcdefgh
```

### 5.2 حدّث `appwriteService.js`
سأقوم بتحديث الملف تلقائياً بعد أن تعطيني الـ Function IDs! 

---

## 🧪 الخطوة 6: الاختبار

### 6.1 اختبر حظر المستخدم
1. اذهب لصفحة Admin → Users Management
2. اختر مستخدم
3. اضغط Block/Unblock
4. تحقق من Console logs
5. جرب تسجيل دخول المستخدم (يجب أن يتم منعه)

### 6.2 اختبر إضافة لـ Team
1. اذهب لصفحة Admin → Users Management
2. اختر مستخدم
3. اضغط "Add to Reviewer Team"
4. ⚡ **المستخدم يُضاف فوراً بدون دعوة!**
5. اعمل Refresh للصفحة - ستشاهد الفريق ظهر عند المستخدم

---

## 📊 الخطوة 7: مراقبة Performance

### في Appwrite Console:
```
Functions → [Function Name] → Executions
```
ستشاهد:
- ✅ عدد التنفيذات
- ⏱️ زمن التنفيذ
- 📝 Logs
- ❌ Errors (إن وجدت)

---

## ⚠️ مشاكل شائعة وحلولها

### 1️⃣ Function تفشل بـ "API Key invalid"
**الحل:**
- تأكد من نسخ الـ API Key كامل
- تأكد من الصلاحيات الصحيحة
- تأكد من إضافة الـ Variable في Settings

### 2️⃣ "Module not found: node-appwrite"
**الحل:**
- تأكد من Build commands: `npm install`
- تأكد من `package.json` موجود

### 3️⃣ Frontend لا يستطيع استدعاء الFunction
**الحل:**
- تأكد من Function ID صحيح
- تأكد من Execute access = "Any"
- تحقق من CORS settings

### 4️⃣ المستخدم لم يُضَف للفريق
**الحل:**
- تحقق من Function Logs للأخطاء
- تأكد من userId صحيح
- تأكد من teamId موجود
- تحقق من صلاحيات الـ API Key

---

## 🎯 الخلاصة

بعد اتباع هذه الخطوات، ستكون لديك:
- ✅ Function لحظر المستخدمين
- ✅ Function لإدارة Teams
- ✅ API Key آمن
- ✅ Frontend متصل بالـ Functions
- ✅ نظام Admin كامل يعمل!

---

## 📞 الخطوة التالية

بعد رفع الFunctions وحفظ الـ IDs، أرسلها لي:
```
Block User Function ID: _______
Manage Team Function ID: _______
```

وسأقوم بتحديث الـ Frontend تلقائياً! 🚀

---

## 📚 موارد إضافية

- [Appwrite Functions Docs](https://appwrite.io/docs/products/functions)
- [Node.js Runtime](https://appwrite.io/docs/products/functions/runtimes#node)
- [Server SDK](https://appwrite.io/docs/sdks#server)
- [Users API](https://appwrite.io/docs/references/cloud/server-nodejs/users)
- [Teams API](https://appwrite.io/docs/references/cloud/server-nodejs/teams)
