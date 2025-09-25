# 🚀 Fyleo - Free Hybrid File Storage Platform

[![Deploy Status](https://github.com/SalehAlSalem/Fyleo/actions/workflows/deploy.yml/badge.svg)](https://github.com/SalehAlSalem/Fyleo/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge)](https://salehalsalem.github.io/Fyleo/)

## 🌟 Features

### 💾 Free Hybrid Storage System
- **Small Files (<25MB)**: GitHub Storage (100% Free)
- **Large Files (25-100MB)**: Supabase Storage (1GB Free Monthly)
- **Smart Routing**: Automatic selection based on file size
- **Fallback Support**: GitHub backup if Supabase fails

### 🔐 Complete Authentication
- Firebase Authentication
- User dashboard and file management
- Role-based access control

### 📱 Modern UI/UX
- Responsive design with Tailwind CSS
- Dark/Light mode support
- Real-time upload progress
- PDF viewer integration

### 🚀 Production Ready
- Automated CI/CD with GitHub Actions
- Environment-based configuration
- SSL-enabled deployment
- Optimized build process

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Storage**: GitHub API + Supabase Storage
- **Deployment**: GitHub Pages + Actions
- **File Handling**: React PDF Viewer

## ⚡ Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/SalehAlSalem/Fyleo.git
   cd Fyleo
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Fill in your API keys (see HYBRID_STORAGE_SETUP.md)
   ```

3. **Development**
   ```bash
   npm run dev
   ```

## 📖 Documentation

- [🔧 Hybrid Storage Setup Guide](./HYBRID_STORAGE_SETUP.md)
- [🚀 Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [📋 Environment Variables](./env_example.txt)

## 🌐 Live Demo

Visit: **https://salehalsalem.github.io/Fyleo/**

## 💝 Cost Breakdown

| Service | Free Tier | Usage |
|---------|-----------|-------|
| GitHub Storage | Unlimited (files <25MB) | Small files, documents, images |
| Supabase Storage | 1GB/month | Large files, videos |
| Firebase Auth | 10,000 users | User authentication |
| Firestore | 1GB storage | File metadata |
| GitHub Pages | Unlimited | Website hosting |
| **Total Cost** | **$0/month** | **Production ready!** |

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

