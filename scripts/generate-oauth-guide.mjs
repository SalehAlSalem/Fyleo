#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'

/**
 * دليل إعداد Google OAuth مع PocketBase و Next.js
 * 
 * تم التحديث: فبراير 2026
 * المنصة: Fyleo
 */

const guide = `
# ✅ دليل إعداد Google OAuth مع PocketBase

## 1️⃣ إعداد Google Cloud Project

### الخطوة 1: إنشاء Google Cloud Project
1. اذهب إلى: https://console.cloud.google.com/
2. انقر على "Create Project"
3. اسم Project: "Fyleo"
4. انقر Create

### الخطوة 2: تفعيل Google+ API
1. ابحث عن "Google+ API"
2. انقر Enable
3. الانتظار 30 ثانية للتفعيل

### الخطوة 3: إنشاء OAuth Credentials
1. اذهب إلى "Credentials" في الشريط الجانبي
2. انقر "Create Credentials" → "OAuth 2.0 Client ID"
3. اختر "Web application"
4. في "Authorized redirect URIs" أضف:
   \`\`\`
   https://pocketbase97.mooo.com/api/oauth2-redirect
   https://pocketbase97.mooo.com/_/api/oauth2-redirect
   http://localhost:3000/auth/callback
   http://localhost:3001/auth/callback
   \`\`\`
5. انقر Create
6. **انسخ Client ID و Client Secret**

## 2️⃣ إعداد PocketBase

### في PocketBase Admin UI:
1. اذهب إلى: https://pocketbase97.mooo.com/_/
2. Collections → Users
3. API Rules:
   - Create: True (أو \`@request.data.email != ""\`)
   - Update: \`user = @request.auth.id || @request.auth.id = ""\`

### تفعيل Google OAuth:
1. Settings → OAuth2 Providers
2. انقر "Enable Google"
3. في "Google Client ID": ضع Client ID من أعلاه
4. في "Google Client Secret": ضع Secret من أعلاه
5. انقر Save

## 3️⃣ تحديث الكود الأمامي

### ملف: frontend/src/lib/auth-store.ts

تأكد من أن \`startOAuth\` تستخدم:
\`\`\`typescript
const redirectUrl = \`\${window.location.origin}/auth/callback\`
const state = (crypto as any)?.randomUUID?.() || Math.random().toString(36).slice(2)
\`\`\`

### ملف: frontend/src/app/auth/callback/page.tsx

يجب أن يحتوي على:
\`\`\`typescript
const code = searchParams.get('code')
const state = searchParams.get('state')

if (code && state) {
  const response = await fetch('/api/auth/oauth-callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, state, provider })
  })
}
\`\`\`

## 4️⃣ اختبر الآن

دخول الموقع: http://localhost:3000/login

سترى زر "Google Sign In" - انقر عليه واتبع التعليمات.

---

## 🐛 Troubleshooting

### المشكلة: "Invalid OAuth redirect URI"
**الحل:** تأكد من إضافة URI في Google Cloud Console تماماً كما في settings

### المشكلة: "CORS Error"
**الحل:** Google OAuth يتطلب HTTPS في الإنتاج، في التطوير http جاهز

### المشكلة: "User already exists"
**الحل:** هذا طبيعي - Google سيدخل باستخدام email موجود بالفعل

---

## 📝 ملفات يجب تحديثها

- \`frontend/src/lib/auth-store.ts\` ✅
- \`frontend/src/app/auth/callback/page.tsx\` ✅
- \`frontend/src/components/ui/oauth-buttons.tsx\` - تحتاج تحسين
`

async function main() {
  const outputPath = '/d/Storeg/Fyleo/GOOGLE_OAUTH_SETUP.md'
  await fs.writeFile(outputPath, guide, 'utf-8')
  console.log('✅ تم إنشاء دليل Google OAuth في GOOGLE_OAUTH_SETUP.md')
}

main()
