# 🎓 Fyleo - Modern Educational File Sharing Platform
### جامعة البلقاء التطبيقية | Al   Required configurations:
   - 🚀 **Appwrite**: Project ID, Database ID, and Collection IDs
   - 📁 **Storage**: Bucket ID for file uploads
   - 🔒 **Authentication**: Enable Email/Password and optional OAuth

4. **Deploy to hosting** (See [HOSTING_ENVIRONMENT_GUIDE.md](HOSTING_ENVIRONMENT_GUIDE.md))
   - 🔷 **Vercel**: One-click deployment with environment variables
   - 🐙 **GitHub Pages**: Automatic deployment via Actions
   - 🟠 **Netlify**: Simple drag-and-drop or Git integration
   - 🟣 **Railway**: Full-stack deployment

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Test the application**
   - Open `http://localhost:5173`
   - Test user registration and login
   - Upload files to verify Appwrite integration
   - Check all features work correctlyersity

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SalehAlSalem/Fyleo)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge)](https://fyleo.vercel.app/)

A modern, bilingual educational file sharing platform built with React and Firebase for AlBalqa Applied University students, featuring beautiful design, RTL support, and comprehensive file management.

## ✨ Features

### 🎨 Modern Design System
- **Beautiful UI**: Gradient-based design inspired by the logo colors (Orange → Purple → Blue)
- **Bilingual Support**: Full Arabic and English support with RTL/LTR switching
- **Dark/Light Themes**: Complete theme system with smooth transitions
- **Responsive Design**: Works perfectly on all devices and screen sizes
- **Accessibility**: WCAG compliant with keyboard navigation support

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





### Communication
To discuss about the project the you may reach out the maintainers on the discord or any other social channel.<br>
Don't hesistate to ask any doubt 😄

### How to Contribute
Try picking up some `good-first-issue` from the issue section and make [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) for them.

