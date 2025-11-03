# Block User Function

## الوصف
Function لحظر وإلغاء حظر المستخدمين باستخدام Appwrite Server SDK

## المتطلبات
- Appwrite API Key مع صلاحيات `users.read` و `users.write`

## Environment Variables
```
APPWRITE_API_KEY = [Your API Key from Console → Settings → API Keys]
```

## الاستخدام

### Request Body:
```json
{
  "userId": "user-id-here",
  "block": true
}
```

### Response:
```json
{
  "success": true,
  "blocked": true
}
```

## Deployment

### من Appwrite Console:
1. Functions → Create Function
2. اسم: block-user
3. Runtime: Node.js 18
4. Upload code أو استخدم Git
5. Settings → Environment Variables → أضف APPWRITE_API_KEY

### من CLI:
```bash
appwrite deploy function
```

## Testing
```bash
curl -X POST https://cloud.appwrite.io/v1/functions/[FUNCTION_ID]/executions \
  -H "Content-Type: application/json" \
  -H "X-Appwrite-Project: [PROJECT_ID]" \
  -d '{"userId": "test-user-id", "block": true}'
```
