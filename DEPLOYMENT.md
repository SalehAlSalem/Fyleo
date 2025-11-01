# Deployment Guide

Comprehensive guide for deploying Fyleo to production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Appwrite Configuration](#appwrite-configuration)
- [MinIO Configuration](#minio-configuration)
- [Frontend Deployment](#frontend-deployment)
- [Appwrite Functions Deployment](#appwrite-functions-deployment)
- [Post-Deployment Verification](#post-deployment-verification)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Accounts
- Appwrite Cloud account or self-hosted instance
- MinIO server (self-hosted or cloud)
- Vercel/Netlify account (or any static hosting)
- Domain name with DNS access (optional but recommended)
- GitHub repository for CI/CD

### Required Tools
- Node.js 16.x or higher
- npm 8.x or higher
- Git
- Appwrite CLI (for function deployment)

### Install Appwrite CLI

```bash
npm install -g appwrite-cli
```

Initialize Appwrite CLI:
```bash
appwrite login
appwrite init project
```

## Pre-Deployment Checklist

### 1. Environment Variables

Ensure all required environment variables are set:

```env
# Appwrite Configuration
VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=production_project_id
VITE_APPWRITE_DATABASE_ID=production_database_id

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

# Storage
VITE_APPWRITE_STORAGE_BUCKET_ID=files

# MinIO Configuration
VITE_MINIO_ENDPOINT=your-minio-endpoint.com
VITE_MINIO_PORT=9000
VITE_MINIO_USE_SSL=true
VITE_MINIO_BUCKET_NAME=fyleo-files

# Function IDs
VITE_VALIDATE_LINK_FUNCTION_ID=validate-link
VITE_MINIO_PRESIGN_FUNCTION_ID=minio-presign

# OAuth
VITE_APPWRITE_SUCCESS_URL=https://yourdomain.com/oauth/callback
VITE_APPWRITE_FAILURE_URL=https://yourdomain.com/login

# External APIs
VITE_LINKPREVIEW_API_KEY=your_api_key
```

### 2. Code Quality Checks

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint -- --fix

# Format code
npm run format

# Type check (if using TypeScript)
npx tsc --noEmit
```

### 3. Build Test

```bash
# Create production build
npm run build

# Test production build locally
npm run preview
```

Verify the build completes without errors and preview works correctly.

### 4. Security Audit

```bash
# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix (if needed, review changes carefully)
npm audit fix --force
```

## Appwrite Configuration

### 1. Create Production Project

1. Go to Appwrite Console: https://cloud.appwrite.io
2. Click "Create Project"
3. Name: "Fyleo Production"
4. Copy the Project ID for environment variables

### 2. Configure Database

#### Create Database

1. Go to "Databases" → "Create Database"
2. Name: "fyleo-production"
3. Database ID: Use auto-generated or custom
4. Copy Database ID for environment variables

#### Create Collections

**users Collection:**
```json
{
  "name": "users",
  "permissions": [
    "read(\"any\")",
    "create(\"users\")",
    "update(\"user:{userId}\")",
    "delete(\"user:{userId}\")"
  ],
  "attributes": [
    {"key": "userId", "type": "string", "size": 255, "required": true},
    {"key": "username", "type": "string", "size": 255, "required": true},
    {"key": "email", "type": "string", "size": 255, "required": true},
    {"key": "role", "type": "string", "size": 50, "default": "student"},
    {"key": "createdAt", "type": "datetime", "required": true}
  ],
  "indexes": [
    {"key": "userId", "type": "unique", "attributes": ["userId"]},
    {"key": "email", "type": "unique", "attributes": ["email"]}
  ]
}
```

**categories Collection:**
```json
{
  "name": "categories",
  "permissions": [
    "read(\"any\")",
    "create(\"label:admin\")",
    "update(\"label:admin\")",
    "delete(\"label:admin\")"
  ],
  "attributes": [
    {"key": "name", "type": "string", "size": 255, "required": true},
    {"key": "nameAr", "type": "string", "size": 255, "required": true},
    {"key": "icon", "type": "string", "size": 100, "required": false},
    {"key": "color", "type": "string", "size": 50, "required": false},
    {"key": "description", "type": "string", "size": 1000, "required": false},
    {"key": "order", "type": "integer", "min": 0, "default": 0}
  ],
  "indexes": [
    {"key": "order", "type": "key", "attributes": ["order"]}
  ]
}
```

**subjects Collection:**
```json
{
  "name": "subjects",
  "permissions": [
    "read(\"any\")",
    "create(\"label:admin\")",
    "update(\"label:admin\")",
    "delete(\"label:admin\")"
  ],
  "attributes": [
    {"key": "categoryId", "type": "string", "size": 255, "required": true},
    {"key": "name", "type": "string", "size": 255, "required": true},
    {"key": "nameAr", "type": "string", "size": 255, "required": true},
    {"key": "code", "type": "string", "size": 50, "required": true},
    {"key": "creditHours", "type": "integer", "min": 0, "default": 3},
    {"key": "level", "type": "string", "size": 100, "required": false}
  ],
  "indexes": [
    {"key": "categoryId", "type": "key", "attributes": ["categoryId"]},
    {"key": "code", "type": "unique", "attributes": ["code"]}
  ]
}
```

**materials Collection:**
```json
{
  "name": "materials",
  "permissions": [
    "read(\"any\")",
    "create(\"users\")",
    "update(\"user:{uploadedBy}\")",
    "delete(\"user:{uploadedBy}\")"
  ],
  "attributes": [
    {"key": "subjectId", "type": "string", "size": 255, "required": true},
    {"key": "title", "type": "string", "size": 500, "required": true},
    {"key": "description", "type": "string", "size": 2000, "required": false},
    {"key": "fileUrl", "type": "string", "size": 1000, "required": true},
    {"key": "fileType", "type": "string", "size": 50, "required": true},
    {"key": "educationalPurpose", "type": "string", "size": 255, "required": true},
    {"key": "uploadedBy", "type": "string", "size": 255, "required": true},
    {"key": "viewsCounter", "type": "integer", "min": 0, "default": 0},
    {"key": "downloadscounter", "type": "integer", "min": 0, "default": 0},
    {"key": "bookmarkscounter", "type": "integer", "min": 0, "default": 0},
    {"key": "createdAt", "type": "datetime", "required": true}
  ],
  "indexes": [
    {"key": "subjectId", "type": "key", "attributes": ["subjectId"]},
    {"key": "educationalPurpose", "type": "key", "attributes": ["educationalPurpose"]},
    {"key": "uploadedBy", "type": "key", "attributes": ["uploadedBy"]},
    {"key": "subject_purpose", "type": "key", "attributes": ["subjectId", "educationalPurpose"]}
  ]
}
```

**bookmarks Collection:**
```json
{
  "name": "bookmarks",
  "permissions": [
    "read(\"user:{userId}\")",
    "create(\"users\")",
    "delete(\"user:{userId}\")"
  ],
  "attributes": [
    {"key": "userId", "type": "string", "size": 255, "required": true},
    {"key": "materialId", "type": "string", "size": 255, "required": true},
    {"key": "createdAt", "type": "datetime", "required": true}
  ],
  "indexes": [
    {"key": "userId", "type": "key", "attributes": ["userId"]},
    {"key": "user_material", "type": "unique", "attributes": ["userId", "materialId"]}
  ]
}
```

**downloads Collection:**
```json
{
  "name": "downloads",
  "permissions": [
    "read(\"user:{userId}\")",
    "create(\"users\")"
  ],
  "attributes": [
    {"key": "userId", "type": "string", "size": 255, "required": true},
    {"key": "materialId", "type": "string", "size": 255, "required": true},
    {"key": "downloadedAt", "type": "datetime", "required": true}
  ],
  "indexes": [
    {"key": "userId", "type": "key", "attributes": ["userId"]},
    {"key": "materialId", "type": "key", "attributes": ["materialId"]}
  ]
}
```

**posts Collection:**
```json
{
  "name": "posts",
  "permissions": [
    "read(\"any\")",
    "create(\"users\")",
    "update(\"user:{userId}\")",
    "delete(\"user:{userId}\")"
  ],
  "attributes": [
    {"key": "subjectId", "type": "string", "size": 255, "required": true},
    {"key": "userId", "type": "string", "size": 255, "required": true},
    {"key": "title", "type": "string", "size": 500, "required": true},
    {"key": "content", "type": "string", "size": 10000, "required": true},
    {"key": "educationalPurpose", "type": "string", "size": 255, "required": false},
    {"key": "createdAt", "type": "datetime", "required": true}
  ],
  "indexes": [
    {"key": "subjectId", "type": "key", "attributes": ["subjectId"]},
    {"key": "userId", "type": "key", "attributes": ["userId"]}
  ]
}
```

**educationalPurposes Collection:**
```json
{
  "name": "educationalPurposes",
  "permissions": [
    "read(\"any\")",
    "create(\"label:admin\")",
    "update(\"label:admin\")",
    "delete(\"label:admin\")"
  ],
  "attributes": [
    {"key": "name", "type": "string", "size": 255, "required": true},
    {"key": "nameAr", "type": "string", "size": 255, "required": true},
    {"key": "icon", "type": "string", "size": 100, "required": false},
    {"key": "order", "type": "integer", "min": 0, "default": 0}
  ],
  "indexes": [
    {"key": "order", "type": "key", "attributes": ["order"]}
  ]
}
```

**fileTypes Collection:**
```json
{
  "name": "fileTypes",
  "permissions": [
    "read(\"any\")",
    "create(\"label:admin\")",
    "update(\"label:admin\")",
    "delete(\"label:admin\")"
  ],
  "attributes": [
    {"key": "extension", "type": "string", "size": 50, "required": true},
    {"key": "mimeType", "type": "string", "size": 255, "required": true},
    {"key": "icon", "type": "string", "size": 100, "required": false},
    {"key": "previewable", "type": "boolean", "default": false}
  ],
  "indexes": [
    {"key": "extension", "type": "unique", "attributes": ["extension"]}
  ]
}
```

### 3. Configure Storage

1. Go to "Storage" → "Create Bucket"
2. Name: "files"
3. Bucket ID: "files"
4. Permissions:
   - Read: `any`
   - Create: `users`
   - Update: `user:{uploadedBy}`
   - Delete: `user:{uploadedBy}`, `label:admin`
5. File Size Limit: 50 MB
6. Allowed File Extensions: pdf, docx, doc, pptx, ppt, xlsx, xls, jpg, jpeg, png, gif, mp4, mp3, zip, rar
7. Compression: Enabled (for images)
8. Encryption: Enabled

### 4. Configure Authentication

#### Enable Auth Methods

1. Go to "Auth" → "Settings"
2. Enable Email/Password authentication
3. Configure Email Templates (verification, password reset)

#### OAuth Providers

**Google OAuth:**
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/YOUR_PROJECT_ID`
4. Copy Client ID and Secret
5. In Appwrite Console: Auth → OAuth2 → Google → Enable
6. Paste Client ID and Secret

**GitHub OAuth:**
1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Create new OAuth App
3. Authorization callback URL: `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/github/YOUR_PROJECT_ID`
4. Copy Client ID and Secret
5. In Appwrite Console: Auth → OAuth2 → GitHub → Enable
6. Paste Client ID and Secret

**Facebook OAuth:** (Similar process to Google)

#### Security Settings

1. Enable password strength requirements (minimum 8 characters)
2. Enable email verification requirement
3. Set session duration: 365 days
4. Enable rate limiting (default 60 requests/minute)

### 5. Create API Keys

1. Go to "Settings" → "API Keys"
2. Create key: "Functions API Key"
3. Scopes:
   - `databases.read`
   - `databases.write`
   - `users.read`
   - `storage.read`
   - `storage.write`
4. Expiration: Never (or set long duration)
5. Copy the API key (store securely, you won't see it again)

### 6. Configure Platform

1. Go to "Settings" → "Platforms"
2. Add Web Platform
3. Name: "Fyleo Production"
4. Hostname: `yourdomain.com` (or `*.yourdomain.com` for subdomains)
5. Add additional hostnames if needed

## MinIO Configuration

### 1. Install MinIO

**Linux/macOS:**
```bash
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
sudo mv minio /usr/local/bin/
```

**Docker:**
```bash
docker run -p 9000:9000 -p 9001:9001 \
  --name minio \
  -e "MINIO_ROOT_USER=admin" \
  -e "MINIO_ROOT_PASSWORD=strongpassword" \
  -v /mnt/data:/data \
  minio/minio server /data --console-address ":9001"
```

### 2. Start MinIO Server

```bash
export MINIO_ROOT_USER=admin
export MINIO_ROOT_PASSWORD=strongpassword
minio server /data --console-address ":9001"
```

MinIO API: http://localhost:9000
MinIO Console: http://localhost:9001

### 3. Create Bucket

1. Open MinIO Console: http://localhost:9001
2. Login with root credentials
3. Go to "Buckets" → "Create Bucket"
4. Name: `fyleo-files`
5. Versioning: Enabled (optional)
6. Object Locking: Disabled

### 4. Configure CORS

1. Select bucket → "Access" → "CORS"
2. Add CORS rule:

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://yourdomain.com"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

### 5. Create Access Keys

1. Go to "Identity" → "Service Accounts"
2. Create new service account
3. Name: "fyleo-app"
4. Policy: Read/Write for `fyleo-files` bucket
5. Copy Access Key and Secret Key
6. Add to environment variables

### 6. Enable HTTPS

**Using Let's Encrypt:**
```bash
# Install Certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d minio.yourdomain.com

# Configure MinIO to use certificate
export MINIO_OPTS="--certs-dir=/etc/letsencrypt/live/minio.yourdomain.com"
```

Update environment variable:
```env
VITE_MINIO_USE_SSL=true
```

## Frontend Deployment

### Option 1: Vercel (Recommended)

#### Setup

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

#### Configuration

Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

#### Environment Variables

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add all variables from `.env` file
3. Deploy again to apply variables

### Option 2: Netlify

#### Setup

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login:
```bash
netlify login
```

3. Initialize:
```bash
netlify init
```

4. Deploy:
```bash
netlify deploy --prod
```

#### Configuration

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

### Option 3: Static Hosting (Apache/Nginx)

#### Build

```bash
npm run build
```

#### Upload

Upload `dist/` contents to web server using FTP, SCP, or rsync:

```bash
rsync -avz dist/ user@server:/var/www/html/
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root /var/www/html;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Appwrite Functions Deployment

### 1. onDownloadCreate Function

```bash
cd appwrite-functions/onDownloadCreate

# Install dependencies
npm install

# Create deployment package
zip -r function.zip .

# Deploy via CLI
appwrite functions create \
  --functionId onDownloadCreate \
  --name "On Download Create" \
  --runtime node-18.0 \
  --events "databases.downloads.documents.*.create" \
  --execute any

appwrite functions createDeployment \
  --functionId onDownloadCreate \
  --entrypoint "index.js" \
  --code ./function.zip

# Set environment variables
appwrite functions updateVariables \
  --functionId onDownloadCreate \
  --key APPWRITE_API_KEY \
  --value "your_api_key"

appwrite functions updateVariables \
  --functionId onDownloadCreate \
  --key DATABASE_ID \
  --value "your_database_id"

appwrite functions updateVariables \
  --functionId onDownloadCreate \
  --key MATERIALS_COLLECTION_ID \
  --value "materials"
```

### 2. onBookmarkToggle Function

```bash
cd appwrite-functions/onBookmarkToggle

npm install
zip -r function.zip .

appwrite functions create \
  --functionId onBookmarkToggle \
  --name "On Bookmark Toggle" \
  --runtime node-18.0 \
  --events "databases.bookmarks.documents.*.create" "databases.bookmarks.documents.*.delete" \
  --execute any

appwrite functions createDeployment \
  --functionId onBookmarkToggle \
  --entrypoint "index.js" \
  --code ./function.zip

# Set environment variables
appwrite functions updateVariables \
  --functionId onBookmarkToggle \
  --key APPWRITE_API_KEY \
  --value "your_api_key"

# ... (add all required variables)
```

### 3. validate-link Function

```bash
cd appwrite-functions/validate-link

npm install
zip -r function.zip .

appwrite functions create \
  --functionId validate-link \
  --name "Validate Link" \
  --runtime node-18.0 \
  --execute any

appwrite functions createDeployment \
  --functionId validate-link \
  --entrypoint "index.js" \
  --code ./function.zip

# Set environment variables
appwrite functions updateVariables \
  --functionId validate-link \
  --key LINKPREVIEW_API_KEY \
  --value "your_api_key"
```

### 4. delete-user Function

```bash
cd appwrite-functions/delete-user

npm install
zip -r function.zip .

appwrite functions create \
  --functionId delete-user \
  --name "Delete User" \
  --runtime node-18.0 \
  --execute users

appwrite functions createDeployment \
  --functionId delete-user \
  --entrypoint "src/main.js" \
  --code ./function.zip

# Set environment variables (similar to above)
```

### 5. minio-presign Function

```bash
cd appwrite-functions/minio-presign

npm install
zip -r function.zip .

appwrite functions create \
  --functionId minio-presign \
  --name "MinIO Presign" \
  --runtime node-18.0 \
  --execute users

appwrite functions createDeployment \
  --functionId minio-presign \
  --entrypoint "index.js" \
  --code ./function.zip

# Set environment variables
appwrite functions updateVariables \
  --functionId minio-presign \
  --key MINIO_ENDPOINT \
  --value "minio.yourdomain.com"

# ... (add all MinIO config variables)
```

## Post-Deployment Verification

### 1. Functionality Testing

**Authentication:**
- [ ] User registration works
- [ ] Email verification sent and works
- [ ] Login with email/password works
- [ ] OAuth login (Google/GitHub/Facebook) works
- [ ] Logout works
- [ ] Password reset works

**Library System:**
- [ ] Categories display correctly
- [ ] Subjects display under categories
- [ ] Materials display under subjects
- [ ] Search functionality works
- [ ] Purpose tabs filter correctly
- [ ] File preview works for all supported types

**User Features:**
- [ ] Download tracking works (counter increments)
- [ ] Bookmark toggle works (counter updates)
- [ ] User workspace displays correctly
- [ ] GPA calculator works
- [ ] Profile editing works
- [ ] Account deletion works

**Admin Features:**
- [ ] Admin panel accessible only to admin users
- [ ] Category management works
- [ ] Subject management works
- [ ] Material approval/rejection works
- [ ] User management works

### 2. Performance Testing

```bash
# Using Lighthouse
npm install -g lighthouse

lighthouse https://yourdomain.com --view
```

Target scores:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90

### 3. Cross-Browser Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] iOS Safari (iPhone)
- [ ] Chrome Android

### 4. Mobile Responsiveness

Test on different screen sizes:
- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px+)
- [ ] Large screens (1920px+)

### 5. Security Testing

- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] XSS protection working
- [ ] CSRF protection working
- [ ] SQL injection prevention (Appwrite handles this)
- [ ] Rate limiting active
- [ ] API keys not exposed in frontend code

## Monitoring and Maintenance

### 1. Error Tracking

**Sentry Integration:**

```bash
npm install @sentry/react @sentry/tracing
```

In `src/main.jsx`:
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your_sentry_dsn",
  environment: import.meta.env.MODE,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### 2. Analytics

**Plausible Analytics (Privacy-friendly):**

Add to `index.html`:
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

### 3. Uptime Monitoring

Use services like:
- UptimeRobot (free tier available)
- Pingdom
- StatusCake

Monitor:
- Main website
- Appwrite endpoint
- MinIO endpoint

### 4. Backup Strategy

**Database Backups:**
- Appwrite Cloud: Automatic daily backups
- Self-hosted: Set up cron job for backups

**Storage Backups:**
- MinIO: Configure bucket replication
- Regular snapshots of storage volumes

### 5. Log Monitoring

**Appwrite Logs:**
1. Go to Functions → Select Function → Logs
2. Monitor for errors and performance issues

**Frontend Logs:**
- Use Sentry for error aggregation
- Monitor console errors in production

## Troubleshooting

### Issue: White Screen After Deployment

**Causes:**
- Incorrect base path in Vite config
- Missing environment variables
- Build errors not caught during build

**Solutions:**
```bash
# Check build output
npm run build

# Check for console errors in browser
# Verify all environment variables are set
# Check Vite config base path
```

### Issue: OAuth Not Working

**Causes:**
- Incorrect redirect URIs
- OAuth credentials not set
- CORS issues

**Solutions:**
1. Verify redirect URIs in OAuth provider settings
2. Check OAuth credentials in Appwrite Console
3. Ensure platform hostname is set correctly in Appwrite

### Issue: Functions Not Triggering

**Causes:**
- Incorrect event name
- Missing permissions
- Function deployment failed

**Solutions:**
```bash
# Check function logs
appwrite functions listExecutions --functionId your-function-id

# Verify event names match exactly
# Check function has proper permissions
# Redeploy function
```

### Issue: File Upload Fails

**Causes:**
- File size exceeds limit
- Missing storage permissions
- CORS issues

**Solutions:**
1. Check file size limit in Appwrite storage bucket settings
2. Verify storage bucket permissions allow user uploads
3. Check CORS configuration in storage settings

### Issue: Slow Performance

**Solutions:**
1. Enable caching on CDN
2. Optimize images (use WebP, proper sizing)
3. Check React Query cache settings
4. Enable Gzip/Brotli compression
5. Use code splitting for large routes

---

This deployment guide covers all aspects of deploying Fyleo to production. Follow the steps carefully and test thoroughly after each stage.
