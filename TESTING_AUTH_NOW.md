# 🧪 FYLEO AUTHENTICATION TEST GUIDE

## WHAT TO DO RIGHT NOW

### Step 1: Test in Browser (DO THIS FIRST)
1. Open your Fyleo app in browser
2. Go to `/register` page
3. Open DevTools (F12)
4. Go to Console tab
5. Enter test data:
   - Name: `Test User`
   - Email: `test@example.com` 
   - Password: `password123456` (8+ chars)
   - Confirm Password: `password123456`
6. Click Register button
7. **Watch the Console** for messages starting with 📝, ✅, or ❌

### Step 2: Check Console Output
After clicking Register, you should see one of these:

#### ✅ SUCCESS - Look for:
```
📝 Attempting registration to: https://pocketbase97.mooo.com
📧 Email: test@example.com
👤 Name: Test User
📤 Sending registration data: {...}
✅ Account created successfully
🔐 Auto-logging in...
✅ Registration and auto-login successful
```

#### ❌ FAILURE - Look for one of these errors:

**Error Type 1: Collection Not Found**
```
Error message: "error parsing collection name: 'users'"
Error message: "no such collection"
```
→ **FIX**: 'users' collection doesn't exist or is named differently

**Error Type 2: Auth Not Enabled**
```
Error message: "field passwordConfirm doesn't exist in collection"
Error message: "authorization failed"
```
→ **FIX**: 'users' collection exists but doesn't have auth enabled in PocketBase

**Error Type 3: Email Already Exists**
```
Error status: 409
Error message: "Failed to create user record"
```
→ **FIX**: That email is already registered (this is OK - means system works)

**Error Type 4: Permission Issue**
```
Error status: 403
Error message: "You are not allowed to access this resource"
```
→ **FIX**: PocketBase rules prevent user creation (admin must fix permissions)

---

### Step 3: Test Login (If Registration Works)
1. Go to `/login` page
2. Enter the same email: `test@example.com`
3. Enter the password: `password123456`
4. Open Console
5. Click Login button
6. Look for same success/failure messages

---

### Step 4: Check PocketBase Admin Dashboard
**You need admin access to check these:**
1. Go to PocketBase admin: https://pocketbase97.mooo.com/_/
2. Log in with admin credentials
3. Go to Collections section
4. Find the "users" collection
5. Check these settings:

#### ✓ Should Have These Fields:
- [ ] `email` (text field, required, unique)
- [ ] `password` (password field, required)  
- [ ] `name` (text field)
- [ ] `username` (text field)
- [ ] `emailVisibility` (checkbox/bool field)

#### ✓ Collection Should Show:
- [ ] **Type:** Auth collection (dropdown)
- [ ] **Auth fields** section with your auth fields configured
- [ ] **Rules** that allow user creation

---

### Alternative: If 'users' Collection Doesn't Have Auth...

Check if there's a different collection with auth already set up:
1. Look for collections named:
   - `_pb_users_auth_` (PocketBase internal)
   - `accounts`
   - `members`
   - `profiles`

2. If found, we need to update the code to use the correct collection name

---

## 📋 QUICK TROUBLESHOOTING

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| "no such collection" error | 'users' collection missing | Create 'users' collection in PocketBase |
| "field passwordConfirm doesn't exist" | Auth not enabled | Enable Auth on 'users' collection |
| Email already exists error | User already registered | Good sign! Try different email |
| "You are not allowed" error | PocketBase rules block creation | Ask admin to fix permissions |
| Blank screen after register | Token storage issue | Check browser localStorage |
| Can login but dashboard is empty | Auth working but data missing | Check enrollment/material setup |

---

## 🔧 CODE CHANGES MADE

Enhanced error logging has been added to make debugging easier:

### What Changed in `auth-store.ts`:
1. ✅ Added detailed console logging for every step
2. ✅ Logs error status codes (401, 400, 409, 403)
3. ✅ Logs error data objects
4. ✅ Provides user-friendly Arabic error messages
5. ✅ Can identify if issue is collection config or data

### Examples of New Messages:
```
Error type: TypeError
Error message: "error parsing collection name: 'users'"
Error status: 404
Error data: {code: 400, message: "error parsing collection name"}
```

This tells us exactly what's wrong:
- Status 400/404 = Collection naming issue
- Status 401/403 = Permission issue
- Status 409 = Email already exists

---

## 🎯 WHAT TO REPORT BACK

When you test, please tell me:

1. **Did registration succeed?** (yes/no)
   
2. **What error appears in Console?**
   - Copy the full error message
   - Include the error status code if shown
   
3. **Can you access PocketBase admin?**
   - Can you see the 'users' collection?
   - Is it marked as "Auth collection"?
   - What fields does it have?

4. **After any changes you make:**
   - Try again and report new results
   - Include console error messages

---

## 🚀 NEXT STEPS BASED ON FINDINGS

### If Registration Works:
- ✅ Auth is fixed!
- → Now we fix materials organization
- → Add subject filtering to library
- → Move leaderboard to home page

### If Registration Fails with "Collection Not Found":
- Create 'users' collection in PocketBase
- Make sure it has email, password fields
- Mark it as "Auth collection"
- Set rules to allow user creation
- Test again

### If Registration Fails with "Auth Not Enabled":
- Go to 'users' collection
- Click "Edit" or "Settings"
- Find "Auth Fields" section
- Add email (as identity field)
- Add password field
- Save changes
- Test again

### If Registration Fails with "Permission Denied":
- Admin needs to check collection rules
- Allow public user creation
- Check "Create" rule permissions

---

## 📱 BROWSER CONSOLE GUIDE

**To open console:**
- Windows/Linux: `F12` → Console tab
- Mac: `Cmd+Option+J`

**What you're looking for:**
- Messages starting with 📝, 🔐, 🌐 (normal flow)
- Messages starting with ❌ (errors)
- Code in RED is bad, code in BLACK is normal
- Warnings in YELLOW can be ignored

**Example good flow:**
```
📝 Attempting registration to: https://pocketbase97.mooo.com
📧 Email: test@example.com
👤 Name: Test User
📤 Sending registration data: {...}
✅ Account created successfully
🔐 Auto-logging in...
✅ Registration and auto-login successful
→ (You're redirected to /dashboard)
```

**Example bad flow:**
```
📝 Attempting registration to: https://pocketbase97.mooo.com
📤 Sending registration data: {...}
❌ Registration error occurred
Error type: Error
Error message: "error parsing collection name: 'users'"
Error status: 400
→ (Toast message shows: "خطأ في إعدادات قاعدة البيانات")
```

---

## 📞 FOR DEVELOPERS

If you're fixing PocketBase collections:

### Create 'users' Collection (if missing):
```
Name: users
Type: Auth collection ← Important!

Fields:
- email: text, required, unique ✓
- password: password, required ✓
- name: text
- username: text
- emailVisibility: boolean

Rules:
- Create: @request.auth.id = null ✓ (allow public registration)
- Read: @request.auth.id = id (users see own data)
```

### Update Existing 'users' Collection:
1. Go to Collections → users
2. Check "Type" is set to "Auth collection"
3. Check email field is marked as identity/auth field
4. Check password field exists and is type "password"
5. Under "Create" rule, make sure public can register

---

**Status:** Ready for user testing  
**Date:** 2025-02-18  
**Purpose:** Diagnose authentication system
