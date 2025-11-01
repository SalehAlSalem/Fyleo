# Delete User Account Function

## 📋 الوصف

Appwrite Function لحذف حساب المستخدم من Auth بشكل كامل.

## 🚀 كيفية النشر

### 1. بناء الـ tar.gz file:

```bash
cd appwrite-functions/delete-user
npm run build
```

سيتم إنشاء ملف: `delete-user-function.tar.gz`

### 2. رفع على Appwrite Console:

1. افتح **Appwrite Console**
2. اذهب إلى **Functions**
3. اضغط **Create Function**
4. اختر:
   - **Runtime:** Node.js 18+
   - **Name:** Delete User Account
   - **Execute Access:** Users (Any authenticated user)
5. في قسم **Deployment**:
   - اختر **Manual**
   - ارفع ملف `delete-user-function.tar.gz`
   - اضغط **Deploy**

### 3. الإعدادات:

**Environment Variables:**
- ✅ `APPWRITE_FUNCTION_API_KEY` - يتم توفيرها تلقائياً
- ✅ `APPWRITE_FUNCTION_PROJECT_ID` - يتم توفيرها تلقائياً
- ✅ `APPWRITE_FUNCTION_ENDPOINT` - يتم توفيرها تلقائياً

**Permissions:**
- Execute Access: **Users** (أي مستخدم مسجل دخول)

---

## 🔧 كيفية الاستخدام من Frontend

### في ملف DeleteAccountConfirm.jsx:

```javascript
// Step 7: حذف الحساب من Auth باستخدام Function
try {
  const response = await fetch(
    'https://cloud.appwrite.io/v1/functions/[FUNCTION_ID]/executions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': import.meta.env.VITE_APPWRITE_PROJECT_ID,
        'X-Appwrite-JWT': (await account.createJWT()).jwt
      }
    }
  );
  
  const result = await response.json();
  console.log('✅ User deleted from Auth:', result);
} catch (error) {
  console.error('❌ Error calling delete function:', error);
}
```

---

## 📊 Response Format

### Success:
```json
{
  "success": true,
  "message": "User account deleted successfully",
  "userId": "user_id_here"
}
```

### Error:
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## ⚠️ ملاحظات مهمة

1. **الحذف نهائي:** لا يمكن التراجع عن حذف الحساب
2. **يجب المصادقة:** المستخدم يجب أن يكون مسجل دخول
3. **حذف البيانات أولاً:** احذف بيانات المستخدم من Database قبل استدعاء هذه Function
4. **API Key:** تأكد من أن Function لديها API Key صحيح

---

## 🔐 الأمان

- ✅ يتطلب مصادقة (JWT Token)
- ✅ المستخدم يحذف نفسه فقط (لا يمكن حذف مستخدمين آخرين)
- ✅ Server-side execution (آمن)

---

## 📝 Logs

الـ Function تسجل:
- 🗑️ طلب الحذف
- ✅ نجاح الحذف
- ❌ الأخطاء

يمكنك مراجعة الـ Logs من Appwrite Console → Functions → Executions
