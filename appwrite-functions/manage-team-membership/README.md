# Manage Team Membership Function

## الوصف
Function لإضافة وإزالة المستخدمين من Teams **مباشرة بدون دعوة** باستخدام Appwrite Server SDK

⚡ **المستخدم يُضاف للفريق فوراً بدون الحاجة لقبول دعوة**

## المتطلبات
- Appwrite API Key مع صلاحيات `users.read`, `teams.read`, `teams.write`

## Environment Variables
```
APPWRITE_API_KEY = [Your API Key from Console → Settings → API Keys]
```

**ملاحظة:** لا حاجة لـ `APP_URL` لأن المستخدم يُضاف مباشرة بدون دعوة

## الاستخدام

### إضافة مستخدم لـ Team:
```json
{
  "action": "add",
  "userId": "user-id-here",
  "teamId": "team-id-here"
}
```

### إزالة مستخدم من Team:
```json
{
  "action": "remove",
  "teamId": "team-id-here",
  "membershipId": "membership-id-here"
}
```

### Response:
```json
{
  "success": true,
  "membership": { ... }
}
```

## ملاحظات مهمة
- ✅ **المستخدم يُضاف مباشرة للفريق بدون دعوة أو إيميل**
- ✅ **لا يحتاج المستخدم موافقة أو قبول**
- ⚡ الإضافة فورية - المستخدم يصبح عضو في الفريق مباشرة
- للإزالة، تحتاج `membershipId` (يمكن الحصول عليه من `teams.listMemberships()`)

## Deployment

### من Appwrite Console:
1. Functions → Create Function
2. اسم: manage-team-membership
3. Runtime: Node.js 18
4. Upload code أو استخدم Git
5. Settings → Environment Variables → أضف APPWRITE_API_KEY و APP_URL

### من CLI:
```bash
appwrite deploy function
```

## Testing
```bash
# إضافة مستخدم
curl -X POST https://cloud.appwrite.io/v1/functions/[FUNCTION_ID]/executions \
  -H "Content-Type: application/json" \
  -H "X-Appwrite-Project: [PROJECT_ID]" \
  -d '{"action": "add", "userId": "test-user-id", "teamId": "reviewer-team"}'

# إزالة مستخدم
curl -X POST https://cloud.appwrite.io/v1/functions/[FUNCTION_ID]/executions \
  -H "Content-Type: application/json" \
  -H "X-Appwrite-Project: [PROJECT_ID]" \
  -d '{"action": "remove", "teamId": "reviewer-team", "membershipId": "membership-id"}'
```
