# 🛠️ دليل ميزات الإدارة المتقدمة - Appwrite Functions

## المشكلة الحالية:
Appwrite Client SDK **محدود** ولا يسمح بـ:
- ❌ حظر/إلغاء حظر المستخدمين (يحتاج Server SDK)
- ❌ إضافة مستخدمين موجودين إلى Teams (يحتاج Server SDK + Email invitation)

---

## ✅ الحل: استخدام Appwrite Functions

### 1️⃣ إنشاء Function لحظر المستخدمين

#### الخطوة 1: إنشاء Function في Appwrite Console
```
1. اذهب إلى: Appwrite Console → Functions
2. اضغط "Create Function"
3. اسم الFunction: block-user
4. Runtime: Node.js 18
5. Enable: ✅
```

#### الخطوة 2: كود الFunction
```javascript
// appwrite-functions/block-user/src/main.js
import { Client, Users } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const users = new Users(client);

  try {
    const { userId, block } = JSON.parse(req.body);

    if (!userId) {
      return res.json({ success: false, error: 'userId is required' }, 400);
    }

    // Update user status
    await users.updateStatus(userId, block);

    log(`User ${userId} ${block ? 'blocked' : 'unblocked'}`);
    return res.json({ success: true, blocked: block });
  } catch (err) {
    error(`Error: ${err.message}`);
    return res.json({ success: false, error: err.message }, 500);
  }
};
```

#### الخطوة 3: Environment Variables
في Appwrite Console → Functions → block-user → Settings → Variables:
```
APPWRITE_API_KEY = [Your API Key from Settings → API Keys]
```

---

### 2️⃣ إنشاء Function لإدارة Teams

#### الخطوة 1: إنشاء Function في Appwrite Console
```
1. اذهب إلى: Appwrite Console → Functions
2. اضغ "Create Function"
3. اسم الFunction: manage-team-membership
4. Runtime: Node.js 18
5. Enable: ✅
```

#### الخطوة 2: كود الFunction
```javascript
// appwrite-functions/manage-team-membership/src/main.js
import { Client, Teams, Users } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const teams = new Teams(client);
  const users = new Users(client);

  try {
    const { action, userId, teamId, membershipId } = JSON.parse(req.body);

    if (action === 'add') {
      // Get user email
      const user = await users.get(userId);
      
      // Create membership invitation
      const membership = await teams.createMembership(
        teamId,
        user.email,
        ['member'], // roles
        `${process.env.APP_URL}/teams/accept` // redirect URL after acceptance
      );

      log(`Invitation sent to user ${userId} for team ${teamId}`);
      return res.json({ success: true, membership });
    } 
    else if (action === 'remove') {
      await teams.deleteMembership(teamId, membershipId);
      log(`User removed from team ${teamId}`);
      return res.json({ success: true });
    }
    else {
      return res.json({ success: false, error: 'Invalid action' }, 400);
    }
  } catch (err) {
    error(`Error: ${err.message}`);
    return res.json({ success: false, error: err.message }, 500);
  }
};
```

#### الخطوة 3: Environment Variables
```
APPWRITE_API_KEY = [Your API Key]
APP_URL = https://fyleo.com (أو localhost في Development)
```

---

### 3️⃣ تعديل Frontend Code

#### في `appwriteService.js`:
```javascript
// استبدل functions الموجودة بهذه:

/**
 * Block/Unblock user via Appwrite Function
 */
async updateBlockStatus(userId, isBlocked) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APPWRITE_URL}/functions/[FUNCTION_ID]/executions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': import.meta.env.VITE_APPWRITE_PROJECT_ID
        },
        body: JSON.stringify({
          userId,
          block: isBlocked
        })
      }
    );

    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    
    console.log(`✅ User ${isBlocked ? 'blocked' : 'unblocked'}:`, userId);
    return result;
  } catch (error) {
    console.error('❌ Error updating block status:', error);
    throw error;
  }
},

/**
 * Add user to team via Appwrite Function
 */
async addToTeam(userId, teamId, roles = []) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APPWRITE_URL}/functions/[FUNCTION_ID]/executions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': import.meta.env.VITE_APPWRITE_PROJECT_ID
        },
        body: JSON.stringify({
          action: 'add',
          userId,
          teamId,
          roles
        })
      }
    );

    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    
    console.log('✅ User added to team:', { userId, teamId });
    return result;
  } catch (error) {
    console.error('❌ Error adding user to team:', error);
    throw error;
  }
},

/**
 * Remove user from team via Appwrite Function
 */
async removeFromTeam(teamId, membershipId) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APPWRITE_URL}/functions/[FUNCTION_ID]/executions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': import.meta.env.VITE_APPWRITE_PROJECT_ID
        },
        body: JSON.stringify({
          action: 'remove',
          teamId,
          membershipId
        })
      }
    );

    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    
    console.log('✅ User removed from team');
    return result;
  } catch (error) {
    console.error('❌ Error removing user from team:', error);
    throw error;
  }
}
```

---

## 🔑 إنشاء API Key

1. اذهب إلى: **Appwrite Console → Settings → API Keys**
2. اضغط **"Create API Key"**
3. الاسم: `Server Admin Key`
4. الصلاحيات المطلوبة:
   - ✅ `users.read`
   - ✅ `users.write`
   - ✅ `teams.read`
   - ✅ `teams.write`
5. احفظ الـ API Key (لن تظهر مرة أخرى!)

---

## 📝 خطوات التطبيق:

### الخطوة 1: إنشاء Functions
```bash
cd appwrite-functions
mkdir block-user manage-team-membership
# ضع الكود في كل folder
```

### الخطوة 2: Deploy Functions
```bash
# من Appwrite Console أو CLI
appwrite deploy function
```

### الخطوة 3: احصل على Function IDs
```
Console → Functions → block-user → Settings → Function ID
Console → Functions → manage-team-membership → Settings → Function ID
```

### الخطوة 4: حدث Frontend
```javascript
// استبدل [FUNCTION_ID] بالـ IDs الحقيقية
const BLOCK_USER_FUNCTION_ID = 'your-function-id-here';
const MANAGE_TEAM_FUNCTION_ID = 'your-function-id-here';
```

---

## ⚠️ بديل مؤقت (بدون Functions):

إذا كنت تريد حل مؤقت بدون Server Functions:

### 1. للحظر:
- استخدم حقل `blocked` في database (أضفه يدوياً)
- تحقق منه في login
- **لكن:** المستخدم يمكنه تجاوزه بـ OAuth

### 2. لـ Teams:
- أرسل دعوة بالإيميل يدوياً من Appwrite Console
- Console → Auth → Teams → [Team Name] → Members → Invite

---

## 📚 مصادر إضافية:

- [Appwrite Functions Docs](https://appwrite.io/docs/products/functions)
- [Server SDKs](https://appwrite.io/docs/sdks#server)
- [User Management API](https://appwrite.io/docs/references/cloud/server-nodejs/users)
- [Teams API](https://appwrite.io/docs/references/cloud/server-nodejs/teams)

---

## ✅ الخلاصة:

**ميزات الإدارة المتقدمة تحتاج:**
1. ✅ Appwrite Functions (Server-side)
2. ✅ API Key مع صلاحيات admin
3. ✅ Frontend يستدعي الFunctions عبر HTTP

**لا يمكن تنفيذها من Client SDK مباشرة!** 🔒
