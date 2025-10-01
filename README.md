# 🎓 Fyleo - Modern Educational File Sharing Platform
### منصة تعليمية حديثة لمشاركة الملفات | Modern Educational Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SalehAlSalem/Fyleo)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge)](https://fyleo.appwrite.network/)

منصة تعليمية حديثة ثنائية اللغة لمشاركة الملفات مبنية بتقنية React و Appwrite، تتميز بتصميم جميل ودعم كامل للغة العربية وإدارة شاملة للملفات.

## ✨ المميزات | Features

- 🔐 **نظام مصادقة آمن** - Appwrite Authentication with Google OAuth
- 📁 **رفع وتنزيل الملفات** - Advanced File Management with Appwrite Storage
- 🌍 **دعم ثنائي اللغة** - Arabic/English Support with RTL
- 📱 **تصميم متجاوب** - Responsive Design for all devices
- 🌙 **الوضع المظلم** - Dark/Light Theme Support
- 🎨 **واجهة حديثة** - Modern UI with Tailwind CSS
- 🔒 **أمان محسن** - Enhanced Security with Appwrite
- ⚡ **أداء سريع** - Fast Performance with Vite
- 📚 **إدارة المفضلة** - Bookmark Management System
- 📊 **تتبع التحميلات** - Download Analytics & History
- 🔍 **بحث متقدم** - Advanced Search & Filtering

## 🔧 التقنيات المستخدمة | Tech Stack

- **Frontend Framework**: React 18.2.0 with Vite
- **Backend**: Appwrite (Database, Storage, Authentication)
- **Styling**: Tailwind CSS with Custom Design System
- **Authentication**: Appwrite Auth + Google OAuth
- **File Management**: Appwrite Storage with Advanced Validation
- **State Management**: React Context & Custom Hooks
- **Routing**: React Router DOM
- **Icons & UI**: Custom Components with Emoji Integration

## 🚀 البدء السريع | Quick Start

### متطلبات النظام | Prerequisites
- Node.js 16+ 
- npm أو yarn
- حساب Appwrite

### خطوات التثبيت | Installation Steps

1. **استنساخ المشروع | Clone Repository**
   ```bash
   git clone https://github.com/SalehAlSalem/Fyleo.git
   cd Fyleo
   ```

2. **تثبيت المكتبات | Install Dependencies**
   ```bash
   npm install
   ```

3. **إعداد متغيرات البيئة | Environment Setup**
   ```bash
   cp env_example.txt .env
   ```
   
   املأ المتغيرات في `.env`:
   ```env
   VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your_project_id
   VITE_APPWRITE_DATABASE_ID=fyleo_db
   VITE_APPWRITE_FILES_COLLECTION_ID=files
   VITE_APPWRITE_BOOKMARKS_COLLECTION_ID=bookmarks
   VITE_APPWRITE_DOWNLOADS_COLLECTION_ID=downloads
   VITE_APPWRITE_PROFILES_COLLECTION_ID=user_profiles
   VITE_APPWRITE_STORAGE_BUCKET_ID=files
   ```

4. **إعداد Appwrite | Appwrite Configuration**
   
   📖 **دليل الإعداد الكامل متوفر في:** [APPWRITE_SETUP_GUIDE.md](APPWRITE_SETUP_GUIDE.md)
   
   - � **Appwrite**: إنشاء مشروع جديد وإعداد قواعد البيانات
   - � **Storage**: تكوين bucket للملفات
   - � **Authentication**: تفعيل Email/Password + Google OAuth
   - 🏗️ **Collections**: إنشاء جميع الـ collections المطلوبة

5. **تشغيل التطبيق | Start Development Server**
   ```bash
   npm run dev
   ```

6. **اختبار التطبيق | Test the Application**
   - افتح `http://localhost:5173`
   - جرب تسجيل مستخدم جديد أو الدخول بـ Google
   - اختبر رفع الملفات
   - تحقق من جميع الميزات

## 📁 هيكل المشروع | Project Structure

```
src/
├── components/          # مكونات قابلة للإعادة
│   ├── Dashboard/       # مكونات لوحة التحكم
│   ├── NavBar/          # شريط التنقل
│   ├── Footer/          # تذييل الصفحة
│   └── ...
├── config/              # إعدادات وخدمات
│   ├── appwrite.js      # تكوين Appwrite
│   ├── DatabaseService.js  # خدمة قاعدة البيانات
│   └── StorageService.js    # خدمة التخزين
├── hooks/               # React Hooks مخصصة
│   └── useAuth.jsx      # إدارة المصادقة
├── pages/               # صفحات التطبيق
│   ├── login/           # صفحة تسجيل الدخول
│   ├── signup/          # صفحة التسجيل
│   └── ...
└── styles/              # ملفات التصميم
```

## 🎨 نظام التصميم | Design System

### الألوان | Color Palette
- **Primary**: Gradient from Orange → Purple → Blue
- **Secondary**: Modern grays with proper contrast
- **Accent**: Complementary colors for CTAs
- **Dark Mode**: Full support with smooth transitions

### التايبوجرافي | Typography
- **Arabic**: Monument Extended (Custom Font)
- **English**: System fonts with fallbacks
- **Sizes**: Responsive typography scale
- **Weight**: Multiple weights for hierarchy

## 🔐 نظام المصادقة | Authentication System

### الميزات المتاحة | Available Features
- ✅ Email/Password Registration & Login
- ✅ Google OAuth Integration
- ✅ Session Management
- ✅ Profile Management
- ✅ Password Reset (via Appwrite)
- ✅ Account Verification

### الحماية | Security Features
- 🔒 Secure password requirements
- 🛡️ CSRF protection via Appwrite
- 🔑 JWT token management
- 🚫 Rate limiting and abuse prevention

## 📁 إدارة الملفات | File Management

### أنواع الملفات المدعومة | Supported File Types
- 📄 **Documents**: PDF, DOC, DOCX, TXT
- 📊 **Presentations**: PPT, PPTX
- 🖼️ **Images**: JPG, JPEG, PNG, GIF
- 📦 **Archives**: ZIP, RAR

### ميزات التحكم | Control Features
- ✅ File validation (type & size)
- ✅ Auto category detection
- ✅ Upload progress tracking
- ✅ Multiple file upload support
- ✅ Download analytics
- ✅ Bookmark system

## 🚀 النشر | Deployment

### منصات مدعومة | Supported Platforms
- **Vercel**: One-click deployment
- **Netlify**: Git integration
- **Railway**: Full-stack hosting
- **GitHub Pages**: Static hosting

### إعدادات الإنتاج | Production Setup
1. Update environment variables for production
2. Configure OAuth redirect URLs
3. Set up custom domain in Appwrite
4. Enable security headers
5. Configure CDN for static assets

### 🔐 Authentication & Security
- **Firebase Authentication**: Secure user management with Google Sign-In
- **Email/Password**: Traditional authentication method
- **Password Reset**: Secure password recovery system
- **Protected Routes**: Route-based access control

### � File Management
- **Firebase Storage**: Reliable cloud storage with security rules
- **Smart Upload**: Progress tracking and error handling
- **File Categories**: Organized by subject areas
- **Search & Filter**: Advanced search capabilities
- **PDF Viewer**: Integrated document viewer

### 🌐 Internationalization
- **Complete i18n**: All text supports Arabic and English
- **RTL Support**: Perfect right-to-left layout for Arabic
- **Language Switching**: Instant language switching with persistence
- **Contextual Translation**: Smart translation based on user preference

## � Tech Stack

- ⚛️ **React 18** with Vite
- � **Appwrite** (Backend-as-a-Service) - Database, Auth & Storage
- 🎨 **Tailwind CSS** for styling
- 📱 **Responsive Design**
- 🌙 **Dark Mode Support**
- 🌍 **RTL Support** (Arabic/English)
- 📄 **PDF Viewer** integration

## � Backend Architecture

**Fyleo** uses **Appwrite** as the primary Backend-as-a-Service (BaaS):

### � Appwrite Authentication
- Email/Password authentication
- Google OAuth integration  
- Anonymous users support
- Session management

### � Appwrite Database
- File metadata storage
- User profiles and preferences
- Categories and subjects management
- Download/view statistics

### � Appwrite Storage
- Secure file upload and storage
- Multiple file format support
- Built-in file optimization
- Access control and permissions

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/SalehAlSalem/Fyleo.git
   cd Fyleo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Appwrite** (See [APPWRITE_SETUP.md](APPWRITE_SETUP.md) for detailed guide)
   ```bash
   cp .env.example .env
   # Edit .env with your Appwrite credentials
   ```
   
   Required configurations:
   - � **Appwrite**: Project ID, Database ID, and Collection IDs
   - � **Storage**: Bucket ID for file uploads
   - 🔒 **Authentication**: Enable Email/Password and optional OAuth

4. **Start development server**
   ```bash
   npm run dev
   # or use the test script
   ./start-test.bat  # Windows
   ./test-deploy.sh  # Linux/Mac
   ```

5. **Test hybrid storage**
   - Open `http://localhost:5173`
   - Login and go to Dashboard
   - Click "🚀 اختبار النظام الهجين" to test storage
   - Upload files to verify GitHub/Supabase integration

## 🌐 Live Demo

**Primary (Vercel)**: https://fyleo.vercel.app ⚡  
**Backup (GitHub Pages)**: https://salehalsalem.github.io/Fyleo/

## 🚀 Quick Deploy

| Platform | Speed | Ease | Click to Deploy |
|----------|-------|------|----------------|
| **Vercel** ⭐ | ⚡⚡⚡ | 🟢 Easiest | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SalehAlSalem/Fyleo) |
| GitHub Pages | ⚡⚡ | 🟡 Medium | [Setup Guide](./HOSTING_ENVIRONMENT_GUIDE.md) |
| Netlify | ⚡⚡⚡ | 🟢 Easy | [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/SalehAlSalem/Fyleo) |
| Railway | ⚡⚡ | 🟡 Medium | [Railway Guide](./HOSTING_ENVIRONMENT_GUIDE.md#4--railway) |

## 💝 Cost Breakdown

| Service | Free Tier | Usage |
|---------|-----------|-------|
| **Appwrite Cloud** | 75k requests/month | All backend services (DB, Auth, Storage) |
| **Vercel** | 100GB bandwidth | Website hosting |
| **GitHub Pages** | Unlimited | Alternative hosting |
| **Netlify** | 100GB bandwidth | Alternative hosting |
| **Total Cost** | **$0/month** | **Production ready!** |

> **💡 الميزة الكبيرة:** خدمة واحدة (Appwrite) تحل محل 3-4 خدمات منفصلة!

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ by [SalehAlSalem](https://github.com/SalehAlSalem)**

Welcome to the College Resource Sharing Website! This platform is designed to facilitate the sharing of educational resources among college students. Whether you need lecture notes, study guides, practice exams, or any other material, this website is here to help you.

## Overview

Every year we require notes and previous year questions to study for our exams and for this we contact many people and sometimes we don't get the resources at the right time.
<br>
So to cope up with that we are building this resource sharing webiste to help the students so that they get the right resources at the right time.
<br>
More deatils of the project our provided at this [Notion Link](https://grey-soybean-258.notion.site/Resource-Sharing-da954660ddf44771895d56321195aae4).

## Tech Stack
- It's powered by [React](https://react.dev/),
- It uses [Tailwind](https://tailwindcss.com) CSS framework,
- It is build and deployed with [Vite](https://vitejs.dev/)

##### Prerequistes
- Configuration of [Git](https://docs.github.com/en/get-started/quickstart/set-up-git) in your system.
- IDE (recommendation: VSCode)
- Nothing else you are good to go!!

## Run Locally

#### Follow the steps mentioned below to setup the project locally on your computer

1. Fork the repository by clicking on `Fork` option on top right of the main repository (or clone directly from https://github.com/SalehAlSalem/Fyleo).
2. Open Command Prompt/Terminal on your local computer.
3. Clone the forked repository by adding your own GitHub username in place of `<username>`.

```bash
    git clone https://github.com/SalehAlSalem/Fyleo.git
```
4. Navigate to the resource-sharing directory.

```bash
    cd Fyleo
```

5. Install all resource-sharing dependencies. 

```bash
    npm install
```
    
6. Run the website locally.

```bash
    npm run dev
```

7. Access the live development server at [localhost:5173](http://localhost:5173).

### Local environment variables

Create a `.env.local` file in the project root and add the following values (replace with your keys):

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_AUTO_APPROVE=true

Note: For quick development you can set `VITE_AUTO_APPROVE=true` so uploads show immediately. In production, set it to `false` and use an admin workflow to approve uploads.

### Vercel / Deployment notes

- Add the same env vars in the Vercel dashboard (do NOT commit them to source control).
- Ensure Firestore rules allow the client-side behavior you expect, or implement a server-side endpoint to accept Cloudinary webhooks and write metadata securely.

### Admin scripts

Two helper scripts are provided to fix legacy Firestore documents:

- `scripts/approve_all_files.mjs` — Set `approved=true` for all files where it's missing.
- `scripts/set_uploader_by_email.mjs` — Set `uploaderUid` and approve by matching an email address.

Run them locally with a Firebase service account (set `GOOGLE_APPLICATION_CREDENTIALS` env var) using:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS='C:\path\to\service-account.json'
node .\scripts\set_uploader_by_email.mjs --email you@example.com --uid YOUR_FIREBASE_UID
```

### Migrate existing PDF/DOCX uploaded via `/image/upload` -> `/raw/upload`

If some older files were uploaded using the image endpoint (so their public links don't open for PDFs), use the migration helper to re-upload them to Cloudinary `raw/upload` and update Firestore documents.

Requirements (run locally):
- Node.js
- Firebase service account JSON file
- Environment variables:
    - `GOOGLE_APPLICATION_CREDENTIALS` (path to service account JSON)
    - `CLOUDINARY_CLOUD_NAME`
    - `CLOUDINARY_UPLOAD_PRESET`

Run example (PowerShell):

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS='C:\path\to\service-account.json'
$env:CLOUDINARY_CLOUD_NAME='your_cloud_name'
$env:CLOUDINARY_UPLOAD_PRESET='fyleo_unsigned_preset'
node .\scripts\migrate_image_to_raw.mjs
```

The script will:
- scan `files` collection for docs whose `secure_url` used `/image/upload` and appear to be PDFs/DOCs,
- download each file, re-upload to Cloudinary `raw/upload`, and update the Firestore document with the new `secure_url` and `resource_type: 'raw'`.

## 📞 التواصل | Contact

للاستفسارات والدعم الفني:
- 📧 **الإيميل**: fyleo.bawa3neh.97@gmail.com
- 🐙 **GitHub**: https://github.com/SalehAlSalem/Fyleo
- 🌐 **الموقع الرسمي**: https://fyleo.appwrite.network

### كيفية المساهمة | How to Contribute
نرحب بمساهماتكم! يمكنكم اختيار إحدى المسائل من قسم Issues وإرسال Pull Request.

**Built with ❤️ using Appwrite & React**

