# 🏗️ FYLEO PROJECT - COMPREHENSIVE ARCHITECTURE PLAN

## 📋 PHASE 1: UNDERSTANDING THE ACTUAL SYSTEM

### Current Database Collections ACTUALLY Being Used:
```
✓ users (_pb_users_auth_)           - User accounts and auth
✓ materials                          - Study materials/lectures/Notes
✓ subjects                           - Academic subjects (التخصصات)
✓ categories                         - Material categories
✓ fileTypes                          - File type classifications
✓ material_ratings                   - User ratings for materials
✓ material_reports                   - Report issues with materials
✓ enrollments                        - Course/Subject enrollment tracking
```

### NOT Currently Used (In migrations but not in code):
- courses
- modules
- lessons
- lesson_progress
- discussions
- replies

---

## 🔴 CRITICAL ISSUES IDENTIFIED

### 1. **AUTHENTICATION PROBLEMS** ❌
- Login/Register pages exist but unclear if working
- Need to trace the OAuth flow completely
- Check: Are user credentials being saved properly?

### 2. **MATERIAL ORGANIZATION ISSUES** ❌
- Materials display WITHOUT filtering by subjects
- Users see ALL materials mixed together
- Should be: **Home Page → Select Subject → Browse Materials**

### 3. **MISSING MATERIAL PREVIEW** ❌
- User wants preview capability (not download prompt)
- Current: PDF viewer crashes on PocketBase files
- Solution needed: Proper file serving with preview

### 4. **LEADERBOARD PLACEMENT** ❌
- Should be ON HOME PAGE as motivational banner
- Not as separate page
- Shows top contributors in real-time

### 5. **MISSING SYSTEM FEATURES** ❌
- Categories not being used in material listing
- File type filtering not implemented
- Search functionality missing
- Subject-based navigation missing

---

## 🟢 SOLUTION PLAN (Step by Step)

### STEP 1: FIX AUTHENTICATION [PRIORITY: CRITICAL]
**Location:** `/frontend/src/app/login` and `/frontend/src/app/register`

**What needs to happen:**
1. User enters email + password
2. PocketBase auth service stores session token
3. Token persists in localStorage/cookies
4. Every API call includes the token
5. Dashboard shows authenticated user

**Verify:**
- [ ] Registration creates PocketBase auth user
- [ ] Login retrieves valid session token
- [ ] Token persists across page reloads
- [ ] Upload and Dashboard require valid token
- [ ] Logout clears token properly

---

### STEP 2: FIX MATERIAL ORGANIZATION [PRIORITY: HIGH]
**Current Problem:** All 396 materials shown without organization

**New Flow:**
```
Home Page
  ↓
Select Subject (انظمة قواعد البيانات، خوارزميات، etc.)
  ↓
View Materials in Subject (with filters by Category, FileType)
  ↓
Click Material → Get Direct Download Link (No Preview)
```

**Implementation:**
- Create Subject-based routing
- Add subject filtering in library
- Show materials count per subject on home
- Add search within subject

---

### STEP 3: ADD LEADERBOARD TO HOME PAGE [PRIORITY: MEDIUM]
**Location:** `/frontend/src/app/page.tsx` (Home page)

**What should show:**
- Top 5 contributors this week
- Top 5 by rating
- Real-time stats banner
- Motivational section

**NOT a separate page** - integrated into home

---

### STEP 4: IMPLEMENT PROPER FILE HANDLING [PRIORITY: HIGH]
**Current Issue:** PocketBase files don't preview, just prompt download

**Solution:**
```
Material → Get Download URL from PocketBase
         → Provide DIRECT DOWNLOAD LINK
         → No iframe/preview needed
```

**Implementation:**
- Use PocketBase file URL directly
- Add download button with file info
- Show file size and type

---

### STEP 5: CONNECT GPA CALCULATOR & LEADERBOARD [PRIORITY: MEDIUM]
- GPA Calculator: Keep as separate tool (standalone app)
- Leaderboard: Move to home page as widget

---

## 📊 DATABASE SCHEMA SUMMARY

### Materials Collection
```javascript
{
  id: "material_id",
  title: "Reference_Database-System-Concepts-6e",
  description: "Material description",
  subject: "subject_id",           // Link to subjects collection
  uploader: "user_id",             // Who uploaded it
  fileType: "9m26wcsoyfqitna",    // Books, Articles, Summaries, etc.
  category: ?, // Not actually used in frontend?
  file: "filename.pdf",            // Stored in PocketBase
  totalRatings: 0,
  averageRating: 0,
  downloads: 0,
  views: 0
}
```

### Subjects Collection
```javascript
{
  id: "gkjtsko9o39ox3s",
  nameAr: "انظمة قواعد البيانات",
  nameEn: "Database Systems",
  descriptionAr: "تصميم وإدارة قواعد البيانات",
  level: "3",
  creditHours: 3,
  isActive: true,
  tag: ""
}
```

---

## 🎯 IMPLEMENTATION ROADMAP

### Week 1: Foundation Fixes
- [ ] Debug & fix auth system completely
- [ ] Verify login/register flow
- [ ] Test token persistence

### Week 2: Frontend Restructure
- [ ] Create subject-based navigation
- [ ] Rewrite library page with subject filtering
- [ ] Add search functionality
- [ ] Fix file download URLs

### Week 3: Features & Polish
- [ ] Add leaderboard widget to home
- [ ] Implement subject browsing
- [ ] Add material statistics
- [ ] Polish UI/UX

### Week 4: Testing & Deployment
- [ ] Full integration testing
- [ ] Performance optimization
- [ ] User testing
- [ ] Deployment prep

---

## 🔍 DEBUGGING CHECKLIST

### Authentication
- [ ] User can register new account
- [ ] User can login with credentials
- [ ] Token is stored in browser
- [ ] Token is sent with requests
- [ ] Logout clears everything

### Materials
- [ ] All 396 materials load correctly
- [ ] Can filter by subject
- [ ] File download works
- [ ] Direct links are accessible
- [ ] File sizes display correctly

### Home Page
- [ ] Stats load (user count, material count)
- [ ] Trending materials show
- [ ] Leaderboard displays top users
- [ ] No console errors

### Overall System
- [ ] No broken links
- [ ] All pages accessible
- [ ] Responsive design works
- [ ] Arabic text displays correctly

---

## 📝 NEXT IMMEDIATE ACTIONS

1. **Trace login flow completely** - Add console logs at each step
2. **Check PocketBase for auth data** - Verify users are being created
3. **Test file URLs** - Can we access files directly?
4. **Understand subject relationships** - How are materials linked to subjects?
5. **Document actual API responses** - What does PocketBase actually return?

---

Last Updated: 2026-02-18
Status: Planning Phase - Ready for Implementation
