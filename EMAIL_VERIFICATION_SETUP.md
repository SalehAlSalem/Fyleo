# 📧 Email Verification Setup Guide - Appwrite

## ⚠️ تنبيه مهم: الكود جاهز لكن يحتاج إعداد في Appwrite!

الكود الذي أضفته **صحيح 100%** ويستخدم الـ API الصحيح:
```javascript
await account.createVerification(`${window.location.origin}/verify-email`);
```

**لكن** يجب تفعيل ميزة Email Templates في Appwrite أولاً!

---

## ✅ الكود الحالي (جاهز)

### في `ModernProfile.jsx`:
```javascript
const handleResendVerification = async () => {
  try {
    setSendingVerification(true);
    await account.createVerification(`${window.location.origin}/verify-email`);
    showMessage(`✅ ${t('profile.verificationSent')}`, 'success');
  } catch (error) {
    console.error('Error sending verification:', error);
    showMessage(`❌ ${t('profile.verificationError')}`, 'error');
  } finally {
    setSendingVerification(false);
  }
};
```

**هذا الكود صحيح ويستخدم**:
- ✅ `account.createVerification()` - الـ API الرسمي
- ✅ Redirect URL صحيح
- ✅ Error handling
- ✅ Loading state
- ✅ Success/Error messages

---

## 🔧 الإعداد المطلوب في Appwrite Console

### الخطوة 1: تفعيل Email Templates
1. اذهب إلى **Appwrite Console**
2. اختر مشروعك: **Fyleo** (ID: `68d9740b0012416cb71b`)
3. اذهب إلى **Auth** → **Settings**
4. ابحث عن **Email Templates** (Experimental)
5. فعّل **Email Verification Template**

---

### الخطوة 2: إعداد Email Template

#### في قسم **Email Verification**:

**Subject** (موضوع البريد):
```
Verify your email - Fyleo
```

**Body** (محتوى البريد):
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 32px; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Fyleo</div>
            <p style="color: #666;">منصة مشاركة الملفات التعليمية</p>
        </div>
        
        <h2 style="color: #333;">مرحباً {{name}}!</h2>
        
        <p style="color: #666; line-height: 1.6;">
            شكراً لتسجيلك في Fyleo. للبدء في استخدام المنصة، يرجى تأكيد بريدك الإلكتروني بالضغط على الزر أدناه:
        </p>
        
        <div style="text-align: center;">
            <a href="{{redirect}}" class="button">
                ✅ تأكيد البريد الإلكتروني
            </a>
        </div>
        
        <p style="color: #999; font-size: 14px; margin-top: 20px;">
            أو انسخ الرابط التالي في المتصفح:<br>
            <a href="{{redirect}}" style="color: #667eea;">{{redirect}}</a>
        </p>
        
        <div class="footer">
            <p>إذا لم تقم بإنشاء حساب في Fyleo، يمكنك تجاهل هذا البريد.</p>
            <p>© 2025 Fyleo - جامعة البلقاء التطبيقية</p>
        </div>
    </div>
</body>
</html>
```

**Variables المتاحة**:
- `{{name}}` - اسم المستخدم
- `{{redirect}}` - رابط التحقق (يتم إنشاؤه تلقائياً)
- `{{project}}` - اسم المشروع

---

### الخطوة 3: إعداد Redirect URL

في **Auth Settings**:
1. اذهب إلى **Security** → **Domains**
2. أضف الـ domains المسموحة:
   ```
   http://localhost:5173
   https://fyleo.vercel.app
   https://your-production-domain.com
   ```

---

