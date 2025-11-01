# Documentation Index

Complete documentation for Fyleo platform.

## Core Documentation

### [README.md](./README.md)
Main project documentation covering:
- Project overview and features
- Technology stack
- Installation instructions
- Configuration guide
- Development workflow
- Deployment instructions
- Appwrite Functions overview
- Project structure

### [ARCHITECTURE.md](./ARCHITECTURE.md)
In-depth architectural documentation:
- Feature-Sliced Design (FSD) methodology
- Data flow and state management
- Component architecture patterns
- Routing and navigation structure
- Database schema and relationships
- Storage architecture (Appwrite + MinIO)
- Authentication flow
- Internationalization setup
- Performance optimization strategies
- Error handling and security

### [API.md](./API.md)
Complete API reference:
- Frontend API layer (library, auth, database, storage)
- Appwrite services integration
- React Query hooks documentation
- Appwrite Functions specifications
- External APIs (LinkPreview, MinIO)
- Error codes and rate limits

### [DEPLOYMENT.md](./DEPLOYMENT.md)
Production deployment guide:
- Pre-deployment checklist
- Appwrite Cloud configuration
- MinIO server setup
- Frontend deployment (Vercel, Netlify, static hosting)
- Appwrite Functions deployment
- Post-deployment verification
- Monitoring and maintenance
- Troubleshooting guide

### [CONTRIBUTING.md](./CONTRIBUTING.md)
Contribution guidelines:
- Code of conduct
- Development environment setup
- Git workflow and branch strategy
- Coding standards (JavaScript, TypeScript, React)
- Commit message conventions
- Pull request process
- Testing guidelines
- Documentation standards

## Feature Documentation

### [src/features/library/README.md](./src/features/library/README.md)
Library feature documentation:
- Three-level navigation system
- FSD architecture implementation
- API layer structure
- React Query hooks
- Component specifications
- Smart search functionality

### [src/features/library/TIERED_ARCHITECTURE.md](./src/features/library/TIERED_ARCHITECTURE.md)
Detailed explanation of the three-tier library system:
- Level 1: Category explorer
- Level 2: Subject browser
- Level 3: Material viewer
- Data flow between levels

### [src/features/library/CACHING_SYSTEM.md](./src/features/library/CACHING_SYSTEM.md)
React Query caching strategy:
- Cache configuration
- Prefetching patterns
- Stale-while-revalidate approach
- Performance optimization

## Function Documentation

### [appwrite-functions/DEPLOYMENT_GUIDE.md](./appwrite-functions/DEPLOYMENT_GUIDE.md)
Appwrite Functions deployment:
- Function overview (onDownloadCreate, onBookmarkToggle, etc.)
- Environment variable configuration
- Deployment steps (CLI and Console)
- Testing and verification

### [appwrite-functions/delete-user/README.md](./appwrite-functions/delete-user/README.md)
User deletion function:
- Functionality overview
- Security considerations
- Implementation details

## Quick Start

### For Developers

1. **Clone and install:**
   ```bash
   git clone <repository-url>
   cd fyleo
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Fill in Appwrite credentials
   - Configure MinIO settings

3. **Start development:**
   ```bash
   npm run dev
   ```

4. **Read architecture documentation:**
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - Understand the codebase structure
   - [src/features/library/README.md](./src/features/library/README.md) - Main feature overview

5. **Follow contribution guidelines:**
   - [CONTRIBUTING.md](./CONTRIBUTING.md) - Coding standards and workflow

### For Deployment

1. **Review deployment checklist:**
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide

2. **Configure Appwrite:**
   - Set up database collections
   - Configure storage buckets
   - Deploy Appwrite Functions

3. **Deploy frontend:**
   - Build production bundle: `npm run build`
   - Deploy to hosting platform (Vercel/Netlify)
   - Configure environment variables

4. **Verify deployment:**
   - Run post-deployment tests
   - Check all features work correctly
   - Monitor for errors

### For Contributors

1. **Set up development environment:**
   - [CONTRIBUTING.md](./CONTRIBUTING.md#getting-started) - Setup instructions

2. **Understand code structure:**
   - [ARCHITECTURE.md](./ARCHITECTURE.md#feature-sliced-design-fsd) - FSD methodology

3. **Follow coding standards:**
   - [CONTRIBUTING.md](./CONTRIBUTING.md#coding-standards) - Style guide

4. **Submit changes:**
   - [CONTRIBUTING.md](./CONTRIBUTING.md#pull-request-process) - PR workflow

## Technology Stack Summary

### Frontend
- **Framework:** React 18.2.0
- **Build Tool:** Vite 4.3.2
- **Routing:** React Router DOM 6.11.2
- **State Management:** TanStack React Query 5.0.0
- **Styling:** TailwindCSS 3.3.2
- **Animation:** Framer Motion 10.0.0
- **i18n:** i18next 23.0.0

### Backend
- **BaaS:** Appwrite 21.3.0 (Cloud)
- **Storage:** MinIO (Self-hosted)
- **Functions:** Appwrite Serverless Functions (Node.js 18)

### Development
- **Language:** JavaScript, TypeScript
- **Linting:** ESLint + Prettier
- **Git Hooks:** Husky

## Key Features

### User Features
- Three-level hierarchical library (Categories → Subjects → Materials)
- Global spotlight search
- File preview (PDF, DOCX, images, videos)
- Download tracking and bookmarks
- Personal workspace dashboard
- GPA calculator
- Multi-language support (Arabic RTL + English)

### Technical Features
- Feature-Sliced Design architecture
- Server state management with React Query
- Authentication with OAuth support
- Role-based access control
- Hardware-accelerated UI for iOS Safari
- Responsive design (mobile-first)
- Dark mode support

### Admin Features
- Category and subject management
- Material approval system
- User management
- Analytics and statistics

## Support and Resources

### Getting Help
- Check documentation in this index
- Search closed issues on GitHub
- Open new issue with question label

### Reporting Issues
- Use GitHub Issues
- Provide detailed description
- Include browser/OS information
- Add screenshots if applicable

### Security
- Report security vulnerabilities privately
- Do not disclose in public issues

---

**Last Updated:** 2024

**Project Status:** Production Ready

**License:** Proprietary (Al-Balqa Applied University)
