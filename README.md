<div align="center">
  <img src="./public/fyleo-logo.svg" alt="Fyleo Logo" width="200" height="200">
  
  # Fyleo
  
  ### A modern educational platform for students to share and access course materials
  
  [![Ko-fi](https://img.shields.io/badge/Support%20on-Ko--fi-FF5E5B?style=flat&logo=ko-fi&logoColor=white)](https://ko-fi.com/bawa3neh_97)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
  [![Made with ❤️ by Saleh AlSalem](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red)](https://github.com/SalehAlSalem)
  
</div>

---

A comprehensive educational materials sharing platform featuring a hierarchical content organization system with intelligent search capabilities.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Appwrite Functions](#appwrite-functions)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

Fyleo is a comprehensive educational materials sharing platform built with React and Appwrite. The platform provides a three-tiered hierarchical navigation system (Categories → Subjects → Materials) with advanced features including file preview, download tracking, bookmark management, and real-time search capabilities. The platform supports both Arabic (RTL) and English languages with full internationalization.

### Key Objectives

- Provide students with organized access to educational materials
- Enable intelligent search and discovery of content
- Track engagement through downloads and bookmarks
- Support multiple file formats with in-browser preview
- Maintain user privacy and data security
- Deliver responsive experience across all devices including iOS Safari

## Features

### Authentication & Authorization
- User registration with email verification
- Secure login with session management
- OAuth integration (Google, GitHub, Facebook)
- Admin role-based access control
- Account deletion with data cleanup

### Library System
- **Three-Level Navigation**: Categories → Subjects → Materials
- **Smart Search**: Global spotlight-style search with real-time results
- **Purpose-Based Filtering**: Dynamic tabs based on educational purposes (e.g., Lectures, Labs, Assignments)
- **File Preview**: In-browser preview for PDF, DOCX, images, and videos
- **Download Management**: Track downloads per material with authentication requirement
- **Bookmark System**: Save materials for quick access with counter tracking

### Content Management
- Material upload with metadata (title, description, file type, educational purpose)
- Post creation for announcements and discussions
- Category and subject management (admin)
- File type and purpose configuration (admin)

### User Features
- Personal workspace dashboard
- GPA calculator with course management
- Profile management
- Download and bookmark history
- Language switching (Arabic/English)

### Technical Features
- Server-side rendering optimization
- Image lazy loading and code splitting
- React Query caching with stale-while-revalidate
- Hardware-accelerated UI for iOS Safari
- Dark mode support
- Responsive design (mobile-first approach)
- PWA capabilities

## Technology Stack

### Frontend
- **React 18.2.0**: UI library with hooks and concurrent features
- **Vite 4.3.2**: Build tool and development server
- **React Router DOM 6.11.2**: Client-side routing with nested routes
- **TypeScript 5.0.0**: Type safety for critical components
- **TailwindCSS 3.3.2**: Utility-first CSS framework
- **Framer Motion 10.0.0**: Animation library for smooth transitions

### State Management
- **TanStack React Query 5.0.0**: Server state management with caching
- **React Context API**: Global state for authentication and language

### Backend as a Service
- **Appwrite 21.3.0**: Cloud-hosted BaaS for authentication, database, and storage
- **Appwrite Functions**: Serverless functions for background tasks

### Internationalization
- **i18next 23.0.0**: Internationalization framework
- **react-i18next 13.0.0**: React bindings for i18next
- **i18next-browser-languagedetector**: Automatic language detection

### File Handling
- **pdfjs-dist 3.8.162**: PDF rendering in browser
- **docx-preview 0.3.7**: Microsoft Word document preview
- **react-pdf**: PDF viewer component with pagination

### External Storage
- **MinIO**: Self-hosted S3-compatible object storage for large files
- **Pre-signed URLs**: Secure temporary access to private files

### Development Tools
- **ESLint**: Code linting with React and hooks rules
- **Prettier**: Code formatting with consistent style
- **Husky**: Git hooks for pre-commit checks
- **PostCSS**: CSS processing with Autoprefixer

## Architecture

### Design Pattern: Feature-Sliced Design (FSD)

The project follows Feature-Sliced Design methodology for maintainability and scalability:

```
src/
├── app/              # Application initialization layer
│   ├── App.jsx       # Root component with providers
│   └── main.jsx      # Entry point
├── features/         # Feature layer (business logic)
│   └── library/      # Library feature module
│       ├── api/      # Appwrite API calls
│       ├── hooks/    # React Query hooks
│       ├── components/  # Feature-specific components
│       └── pages/    # Feature pages
├── shared/           # Shared layer (reusable code)
│   ├── ui/           # UI components (buttons, modals, navbar)
│   ├── lib/          # Utility functions
│   ├── styles/       # Global styles
│   └── i18n/         # Internationalization config
├── pages/            # Legacy pages (being migrated to features)
├── services/         # Shared services (auth, storage, hierarchy)
├── config/           # Configuration files (Appwrite client)
├── hooks/            # Shared hooks (useAuth, useScrollAnimation)
├── contexts/         # React contexts (LanguageContext)
└── types/            # TypeScript type definitions
```

### Data Flow Architecture

1. **API Layer**: Centralized Appwrite SDK calls in `api/` directories
2. **Query Layer**: React Query hooks manage server state with caching
3. **Component Layer**: Presentational components receive data via props
4. **Page Layer**: Orchestrates data fetching and component composition

### Database Schema

#### Collections

**users**: User profiles and metadata
- userId (string): Appwrite Auth user ID
- username (string): Display name
- email (string): User email
- role (string): 'admin' or 'student'
- createdAt (datetime): Account creation timestamp

**categories**: Top-level content organization
- name (string): Category name
- nameAr (string): Arabic name
- icon (string): Icon identifier
- color (string): Hex color code
- description (string): Category description

**subjects**: Second-level content organization
- categoryId (string): Parent category reference
- name (string): Subject name
- nameAr (string): Arabic name
- code (string): Subject code (e.g., CS101)
- creditHours (integer): Course credit hours
- level (string): Academic level

**materials**: Educational content files
- subjectId (string): Parent subject reference
- title (string): Material title
- description (string): Material description
- fileUrl (string): MinIO file URL or Appwrite file ID
- fileType (string): File extension
- educationalPurpose (string): Purpose ID reference
- uploadedBy (string): User ID reference
- viewsCounter (integer): View count
- downloadscounter (integer): Download count
- bookmarkscounter (integer): Bookmark count
- createdAt (datetime): Upload timestamp

**bookmarks**: User saved materials
- userId (string): User reference
- materialId (string): Material reference
- createdAt (datetime): Bookmark timestamp

**downloads**: Download tracking
- userId (string): User reference
- materialId (string): Material reference
- downloadedAt (datetime): Download timestamp

**posts**: Announcements and discussions
- subjectId (string): Subject reference
- userId (string): Author reference
- title (string): Post title
- content (string): Post content (Markdown)
- educationalPurpose (string): Purpose reference
- createdAt (datetime): Post creation timestamp

**educationalPurposes**: Purpose categories
- name (string): Purpose name
- nameAr (string): Arabic name
- icon (string): Icon identifier
- order (integer): Display order

**fileTypes**: File type definitions
- extension (string): File extension (e.g., pdf, docx)
- mimeType (string): MIME type
- icon (string): Icon identifier
- previewable (boolean): Can be previewed in browser

### iOS Safari Compatibility

The application implements hardware acceleration techniques to fix position:fixed scrolling issues on iOS Safari:

- CSS transforms with `translateZ(0)` for GPU rendering
- `-webkit-backface-visibility: hidden` for rendering optimization
- `will-change: transform` for performance hints
- `-webkit-overflow-scrolling: touch` for momentum scrolling
- JavaScript-enforced inline styles for critical elements

## Installation

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Appwrite Cloud account (or self-hosted Appwrite instance)
- MinIO server (for external storage)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fyleo.git
   cd fyleo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```env
   # Appwrite Configuration
   VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your_project_id
   VITE_APPWRITE_DATABASE_ID=your_database_id
   
   # Collection IDs
   VITE_APPWRITE_USERS_COLLECTION_ID=users
   VITE_APPWRITE_MATERIALS_COLLECTION_ID=materials
   VITE_APPWRITE_BOOKMARKS_COLLECTION_ID=bookmarks
   VITE_APPWRITE_DOWNLOADS_COLLECTION_ID=downloads
   VITE_APPWRITE_CATEGORIES_COLLECTION_ID=categories
   VITE_APPWRITE_SUBJECTS_COLLECTION_ID=subjects
   VITE_APPWRITE_FILE_TYPES_COLLECTION_ID=fileTypes
   VITE_APPWRITE_POSTS_COLLECTION_ID=posts
   VITE_APPWRITE_EDUCATIONAL_PURPOSES_COLLECTION_ID=educationalPurposes
   
   # Storage Configuration
   VITE_APPWRITE_STORAGE_BUCKET_ID=files
   
   # MinIO Configuration
   VITE_MINIO_ENDPOINT=your_minio_domain
   VITE_MINIO_PORT=poort
   VITE_MINIO_USE_SSL=true
   VITE_MINIO_ACCESS_KEY=your_minio_access_key
   VITE_MINIO_SECRET_KEY=your_minio_secret_key
   VITE_MINIO_BUCKET_NAME=fyleo-files
   
   # Function IDs
   VITE_VALIDATE_LINK_FUNCTION_ID=validate-link
   VITE_MINIO_PRESIGN_FUNCTION_ID=minio-presign
   
   # OAuth Configuration
   VITE_APPWRITE_SUCCESS_URL=https://yourdomain.com/oauth/callback
   VITE_APPWRITE_FAILURE_URL=https://yourdomain.com/login
   
   # API Keys (for external services)
   VITE_LINKPREVIEW_API_KEY=your_linkpreview_api_key
   ```

4. **Set up Appwrite project**

   - Create a new project in Appwrite Console
   - Create database with collections matching your schema
   - Configure storage bucket with appropriate permissions
   - Set up OAuth providers (Google, GitHub, Facebook)
   - Deploy Appwrite Functions (see [Appwrite Functions](#appwrite-functions))

5. **Set up MinIO storage**

   - Install and configure MinIO server
   - Create bucket: `fyleo-files`
   - Configure CORS policy for browser uploads
   - Set appropriate access policies

6. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Configuration

### Vite Configuration

The `vite.config.js` includes:
- Path aliases for clean imports (`@`, `@app`, `@shared`, `@features`)
- Code splitting for vendor, router, appwrite, and query libraries
- Source maps enabled for debugging
- Port 5173 with host mode enabled

### TailwindCSS Configuration

Custom configuration in `tailwind.config.js`:
- Extended color palette with brand colors
- Custom animations (fade-in, slide-up, scale-in)
- RTL plugin for Arabic support
- Typography plugin for rich text

### ESLint Configuration

Linting rules in `.eslintrc.cjs`:
- React hooks rules enforced
- Prettier integration for formatting
- React refresh plugin for HMR
- Consistent code style across team

## Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Appwrite (if configured)
npm run deploy

# Lint code
npm run lint

# Format code with Prettier
npm run format
```

### Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes following FSD structure**
   - Add API calls in `api/` directory
   - Create React Query hooks in `hooks/`
   - Build UI components in `components/`
   - Compose pages in `pages/`

3. **Test changes locally**
   ```bash
   npm run dev
   ```

4. **Build production bundle**
   ```bash
   npm run build
   ```

5. **Commit with descriptive message**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

### Adding New Features

Follow Feature-Sliced Design methodology:

1. Create feature directory in `src/features/feature-name/`
2. Add API layer: `api/featureApi.ts`
3. Add hooks layer: `hooks/useFeatureData.ts`
4. Add components: `components/FeatureComponent.tsx`
5. Add pages: `pages/FeaturePage.tsx`
6. Export public API: `index.ts`

### Code Style Guidelines

- Use functional components with hooks
- Prefer TypeScript for new components
- Follow React Query patterns for server state
- Use TailwindCSS for styling
- Add JSDoc comments for complex functions
- Keep components under 300 lines
- Extract reusable logic to custom hooks

## Deployment

### Production Build

```bash
npm run build
```

This creates optimized production files in `dist/` directory with:
- Minified JavaScript bundles
- Code splitting for faster loading
- Optimized CSS with unused styles removed
- Source maps for debugging

### Deployment Platforms

#### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy automatically on push to main branch

#### Netlify

1. Connect GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables in Netlify dashboard
4. Configure `_redirects` file for SPA routing:
   ```
   /*    /index.html   200
   ```

#### Static Hosting (Apache/Nginx)

1. Build production bundle: `npm run build`
2. Upload `dist/` contents to web server
3. Configure server for SPA routing:

   **Nginx:**
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

   **Apache (.htaccess):**
   ```apache
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

### Post-Deployment Checklist

- [ ] Verify all environment variables are set correctly
- [ ] Test authentication flow (login, signup, OAuth)
- [ ] Check file upload and download functionality
- [ ] Validate search functionality
- [ ] Test on multiple devices and browsers (especially iOS Safari)
- [ ] Verify RTL layout for Arabic language
- [ ] Check all Appwrite Functions are deployed and active
- [ ] Monitor error logs and performance metrics
- [ ] Set up analytics and error tracking
- [ ] Configure CDN for static assets (optional)

## Appwrite Functions

The platform uses serverless Appwrite Functions for background tasks and event-driven operations.

### Function: onDownloadCreate

**Purpose**: Automatically increment `downloadscounter` when a download is created.

**Trigger**: `databases.downloads.documents.*.create`

**Environment Variables**:
- `APPWRITE_API_KEY`: Server API key with database write permissions
- `DATABASE_ID`: Database identifier
- `MATERIALS_COLLECTION_ID`: Materials collection identifier

**Deployment**:
```bash
cd appwrite-functions/onDownloadCreate
npm install
zip -r function.zip .
# Upload via Appwrite Console or CLI
```

### Function: onBookmarkToggle

**Purpose**: Increment/decrement `bookmarkscounter` when bookmarks are created or deleted.

**Triggers**: 
- `databases.bookmarks.documents.*.create`
- `databases.bookmarks.documents.*.delete`

**Environment Variables**:
- `APPWRITE_API_KEY`: Server API key
- `DATABASE_ID`: Database identifier
- `MATERIALS_COLLECTION_ID`: Materials collection identifier
- `USERS_COLLECTION_ID`: Users collection identifier

### Function: validate-link

**Purpose**: Validate and extract metadata from URLs for link preview.

**Trigger**: Manual invocation from frontend

**Environment Variables**:
- `LINKPREVIEW_API_KEY`: API key for link preview service

### Function: delete-user

**Purpose**: Delete user account and all associated data (bookmarks, downloads, materials).

**Trigger**: Manual invocation from user settings

**Environment Variables**:
- `APPWRITE_API_KEY`: Server API key
- `DATABASE_ID`: Database identifier
- `USERS_COLLECTION_ID`: Users collection identifier
- `BOOKMARKS_COLLECTION_ID`: Bookmarks collection identifier
- `DOWNLOADS_COLLECTION_ID`: Downloads collection identifier
- `MATERIALS_COLLECTION_ID`: Materials collection identifier

### Function: minio-presign

**Purpose**: Generate pre-signed URLs for secure MinIO file access.

**Trigger**: Manual invocation from frontend

**Environment Variables**:
- `MINIO_ENDPOINT`: MinIO server endpoint
- `MINIO_PORT`: MinIO server port
- `MINIO_ACCESS_KEY`: MinIO access key
- `MINIO_SECRET_KEY`: MinIO secret key
- `MINIO_USE_SSL`: Use SSL for MinIO connections
- `MINIO_BUCKET_NAME`: MinIO bucket name

### Deploying Functions

Detailed deployment guide available in `appwrite-functions/DEPLOYMENT_GUIDE.md`

1. Create API key in Appwrite Console with required permissions
2. Configure environment variables for each function
3. Deploy via Appwrite Console or CLI
4. Test function execution with sample events
5. Monitor logs for errors

## Project Structure

```
fyleo/
├── public/                  # Static assets
│   └── locales/            # Translation files
│       ├── ar/             # Arabic translations
│       └── en/             # English translations
├── src/
│   ├── app/                # Application layer
│   │   ├── App.jsx         # Root component
│   │   └── main.jsx        # Entry point
│   ├── features/           # Feature modules (FSD)
│   │   └── library/        # Library feature
│   │       ├── api/        # API calls
│   │       ├── hooks/      # React Query hooks
│   │       ├── components/ # Components
│   │       └── pages/      # Pages
│   ├── shared/             # Shared resources
│   │   ├── ui/             # UI components
│   │   │   ├── modern/     # Modern components
│   │   │   └── cards/      # Card components
│   │   ├── lib/            # Utilities
│   │   ├── styles/         # Global styles
│   │   └── i18n/           # i18n config
│   ├── pages/              # Legacy pages
│   │   ├── AdminPage/      # Admin dashboard
│   │   ├── GPACalculatorPage/ # GPA calculator
│   │   ├── LandingPage/    # Homepage
│   │   ├── login/          # Login page
│   │   ├── signup/         # Signup page
│   │   └── PersonalWorkspace/ # User dashboard
│   ├── services/           # Business logic services
│   │   ├── appwriteService.js # Appwrite wrapper
│   │   ├── authService.js  # Authentication
│   │   ├── fileTypeService.js # File handling
│   │   └── hierarchyService.js # Hierarchy logic
│   ├── config/             # Configuration
│   │   ├── appwrite.js     # Appwrite client
│   │   └── constants.js    # App constants
│   ├── hooks/              # Shared hooks
│   │   ├── useAuth.jsx     # Authentication hook
│   │   └── useScrollAnimation.jsx # Scroll effects
│   ├── contexts/           # React contexts
│   │   └── LanguageContext.jsx # Language state
│   └── types/              # TypeScript definitions
│       └── database.ts     # Database types
├── appwrite-functions/     # Serverless functions
│   ├── onDownloadCreate/   # Download counter
│   ├── onBookmarkToggle/   # Bookmark counter
│   ├── validate-link/      # Link validation
│   ├── delete-user/        # User deletion
│   └── minio-presign/      # MinIO URL signing
├── scripts/                # Utility scripts
│   └── cleanupOrphanedBookmarks.js
├── .env                    # Environment variables
├── .env.example            # Example environment file
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # TailwindCSS config
├── tsconfig.json           # TypeScript config
└── README.md               # This file
```

## Contributing

We welcome contributions from the community. Please follow these guidelines:

### Reporting Issues

- Search existing issues before creating a new one
- Provide detailed description with steps to reproduce
- Include browser/OS information
- Add screenshots for UI issues

### Pull Requests

1. Fork the repository
2. Create feature branch from `main`
3. Follow code style guidelines
4. Add tests for new functionality
5. Update documentation as needed
6. Submit PR with clear description

### Development Guidelines

- Write clean, readable code with comments
- Follow FSD architecture patterns
- Use TypeScript for new components
- Add PropTypes for JavaScript components
- Test on multiple browsers including iOS Safari
- Ensure RTL layout works correctly
- Update translations for both languages

## Support the Project

If you find this project helpful, consider supporting the developer:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support%20Me-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/bawa3neh_97)

Your support helps maintain and improve this project!

## License

This project is licensed under the MIT License. All rights reserved.

For questions or support, please contact the development team.

---

Made with ❤️ by [Saleh Al-Salem](https://github.com/SalehAlSalem)

Built with React and Appwrite.
