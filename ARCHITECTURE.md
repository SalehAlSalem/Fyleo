# Architecture Documentation

## Overview

Fyleo follows Feature-Sliced Design (FSD) methodology combined with modern React patterns for building scalable and maintainable applications. This document provides an in-depth explanation of the architectural decisions and patterns used throughout the codebase.

## Design Principles

### 1. Feature-Sliced Design (FSD)

FSD is an architectural methodology that organizes code by business features rather than technical layers. Each feature is self-contained with its own API layer, hooks, components, and pages.

**Benefits:**
- Clear separation of concerns
- Easy to locate and modify feature code
- Reduced coupling between features
- Scalable structure as the app grows

**Structure:**
```
features/
  feature-name/
    api/        # External API calls
    hooks/      # Data fetching and business logic
    components/ # UI components
    pages/      # Page-level components
    index.ts    # Public API
```

### 2. Separation of Concerns

**API Layer** (`api/`)
- Centralized location for all external service calls
- Uses Appwrite SDK for backend operations
- Returns raw data without UI logic
- Easy to mock for testing

**Hooks Layer** (`hooks/`)
- Wraps API calls with React Query
- Manages caching, loading states, and error handling
- Provides consistent data fetching patterns
- Enables automatic background refetching

**Component Layer** (`components/`)
- Presentational components that receive data via props
- No direct API calls or business logic
- Reusable across different pages
- Focus on UI rendering and user interactions

**Page Layer** (`pages/`)
- Orchestrates data fetching using hooks
- Composes UI using components
- Handles routing and navigation
- Manages page-level state

### 3. Shared Resources

The `shared/` directory contains code used across multiple features:

```
shared/
  ui/           # Reusable UI components
  lib/          # Utility functions
  styles/       # Global styles and themes
  i18n/         # Internationalization config
```

## Data Flow Architecture

### Request Flow

```
User Action → Component → Hook → API → Appwrite → Response
                ↓                           ↓
              UI Update ← React Query Cache ← Data
```

1. **User triggers action** (e.g., clicks search button)
2. **Component calls hook** (e.g., `useSearch(query)`)
3. **Hook executes API function** (e.g., `searchApi.globalSearch()`)
4. **API makes Appwrite SDK call** (e.g., `databases.listDocuments()`)
5. **Appwrite returns data** (documents, files, or errors)
6. **React Query caches response** (with configurable TTL)
7. **Hook returns data to component** (with loading/error states)
8. **Component updates UI** (renders results or error message)

### State Management Strategy

#### Server State (React Query)
- Used for all data from Appwrite (database, storage, auth)
- Automatic caching with configurable stale time
- Background refetching on window focus
- Optimistic updates for better UX
- Error retry with exponential backoff

**Configuration:**
```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutes
      cacheTime: 10 * 60 * 1000,       // 10 minutes
      refetchOnWindowFocus: true,
      retry: 2
    }
  }
});
```

#### Client State (React Context)
- Used for UI state that needs to be shared globally
- Authentication state (`useAuth` hook)
- Language preference (`LanguageContext`)
- Theme preference (dark/light mode)

#### Local State (useState)
- Component-specific state (form inputs, modal visibility)
- Temporary UI state (hover effects, animations)
- Does not persist across page reloads

## Component Architecture

### Component Hierarchy

```
App.jsx (Root)
├── Providers (QueryClientProvider, LanguageContext)
├── Router (BrowserRouter)
│   ├── Layout Components (Navbar, Footer)
│   └── Routes
│       ├── Public Routes (Landing, Login, Signup)
│       ├── Protected Routes (Library, Workspace, Admin)
│       └── OAuth Callback Route
```

### Component Patterns

#### Presentational Components
Pure components that receive all data via props:

```javascript
// MaterialCard.tsx
interface MaterialCardProps {
  material: Material;
  onDownload: (id: string) => void;
  onBookmark: (id: string) => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onDownload,
  onBookmark
}) => {
  // UI rendering only
};
```

#### Container Components
Components that fetch data and pass to presentational components:

```javascript
// LibraryPage.tsx
const LibraryPage: React.FC = () => {
  const { data: categories } = useCategories();
  const { data: subjects } = useSubjects();
  
  return (
    <>
      {categories.map(category => (
        <CategoryCard
          key={category.$id}
          category={category}
        />
      ))}
    </>
  );
};
```

#### Higher-Order Components (HOCs)
Components that wrap other components to add functionality:

```javascript
// AdminGuard.jsx
const AdminGuard = ({ children }) => {
  const { user, isAdmin } = useAuth();
  
  if (!isAdmin) return <Navigate to="/" />;
  
  return children;
};
```

## Routing Architecture

### Route Structure

```
/                           # Landing page (public)
/login                      # Login page (public)
/signup                     # Signup page (public)
/library                    # Library root (public)
/library/:categoryId        # Category view (public)
/library/:categoryId/:subjectId  # Subject view (public)
/workspace                  # User dashboard (protected)
/admin                      # Admin panel (admin only)
/gpa-calculator             # GPA calculator (public)
/oauth/callback             # OAuth redirect handler
/verify-email               # Email verification
/forgot-password            # Password reset
```

### Protected Routes

Routes are protected using a custom `ProtectedRoute` component:

```javascript
<Route
  path="/workspace"
  element={
    <ProtectedRoute>
      <PersonalWorkspace />
    </ProtectedRoute>
  }
/>
```

### Dynamic Routes

The library feature uses nested dynamic routes:

```javascript
<Route path="/library" element={<LibraryPage />}>
  <Route index element={<CategoryGrid />} />
  <Route path=":categoryId" element={<SubjectGrid />} />
  <Route path=":categoryId/:subjectId" element={<MaterialList />} />
</Route>
```

## Database Architecture

### Collection Relationships

```
categories (1) ──→ (N) subjects
subjects (1) ──→ (N) materials
subjects (1) ──→ (N) posts
users (1) ──→ (N) materials (uploadedBy)
users (1) ──→ (N) bookmarks
users (1) ──→ (N) downloads
materials (1) ──→ (N) bookmarks
materials (1) ──→ (N) downloads
educationalPurposes (1) ──→ (N) materials
educationalPurposes (1) ──→ (N) posts
```

### Indexing Strategy

**Performance Indexes:**
- `materials.subjectId` (for subject page queries)
- `materials.educationalPurpose` (for purpose filtering)
- `bookmarks.userId` (for user bookmark lists)
- `downloads.userId` (for user download history)
- `subjects.categoryId` (for category page queries)

**Compound Indexes:**
- `materials.(subjectId, educationalPurpose)` (for filtered material queries)
- `bookmarks.(userId, materialId)` (for checking bookmark status)

### Query Optimization

**Pagination:**
```javascript
databases.listDocuments(
  DATABASE_ID,
  MATERIALS_COLLECTION_ID,
  [
    Query.equal('subjectId', subjectId),
    Query.limit(25),
    Query.offset(page * 25),
    Query.orderDesc('$createdAt')
  ]
);
```

**Selective Field Retrieval:**
```javascript
// Only fetch needed fields to reduce payload size
Query.select(['$id', 'title', 'fileType', 'downloadscounter'])
```

## Storage Architecture

### Hybrid Storage Strategy

**Appwrite Storage:**
- User profile images
- Small documents (< 10MB)
- Files needing built-in permissions

**MinIO Storage:**
- Large course materials (> 10MB)
- Video files
- High-volume downloads

### File Access Flow

**Appwrite Files:**
```
User Request → StorageService.getFileView()
             → storage.getFileView(bucketId, fileId)
             → Direct URL
```

**MinIO Files:**
```
User Request → Execute minio-presign function
             → MinIO generates pre-signed URL (7-day expiry)
             → Frontend caches URL
             → Direct download from MinIO
```

### Security Model

**Appwrite Storage Permissions:**
```javascript
// Public read, authenticated write
Permission.read(Role.any()),
Permission.write(Role.users())
```

**MinIO Security:**
- Pre-signed URLs with expiration (7 days)
- Serverless function validates user session before signing
- CORS policy restricts origins

## Authentication Architecture

### Authentication Flow

**Standard Login:**
```
User submits form → authService.login()
                  → account.createEmailSession()
                  → Session token stored in cookie
                  → Fetch user data
                  → Update AuthContext
                  → Redirect to dashboard
```

**OAuth Login:**
```
User clicks OAuth button → account.createOAuth2Session()
                         → Redirect to provider (Google/GitHub/Facebook)
                         → Provider authenticates
                         → Redirect to /oauth/callback
                         → Fetch user data
                         → Create/update user profile
                         → Redirect to dashboard
```

### Session Management

- Sessions stored in HTTP-only cookies by Appwrite
- Frontend checks session on app load
- Automatic session refresh on API calls
- Logout clears session cookie and local state

### Role-Based Access Control

```javascript
const { user, isAdmin } = useAuth();

// Admin routes protected by AdminGuard
{isAdmin && <Link to="/admin">Admin Panel</Link>}

// Download restricted to authenticated users
if (!user) {
  alert('You must log in to download');
  return;
}
```

## Internationalization Architecture

### i18next Configuration

**Language Detection Priority:**
1. User preference (stored in localStorage)
2. Browser language setting
3. Default to Arabic (RTL)

**Translation Loading:**
- Lazy loading via i18next-http-backend
- Separate namespace files in `public/locales/`
- Fallback to key name if translation missing

**RTL Support:**
```javascript
// Automatically applied via dir attribute
<html dir={i18n.dir()} lang={i18n.language}>
```

### Translation Structure

```
locales/
  ar/
    translation.json    # Arabic translations
    common.json         # Common terms
  en/
    translation.json    # English translations
    common.json         # Common terms
```

**Usage in Components:**
```javascript
const { t, i18n } = useTranslation();

<h1>{t('welcome')}</h1>
<button onClick={() => i18n.changeLanguage('en')}>
  English
</button>
```

## Performance Optimization

### Code Splitting

**Route-based splitting:**
```javascript
const AdminPage = lazy(() => import('./pages/AdminPage'));

<Route
  path="/admin"
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <AdminPage />
    </Suspense>
  }
/>
```

**Vendor chunking (Vite config):**
```javascript
manualChunks: {
  vendor: ['react', 'react-dom'],
  router: ['react-router-dom'],
  appwrite: ['appwrite'],
  query: ['@tanstack/react-query']
}
```

### Image Optimization

- Lazy loading with `loading="lazy"` attribute
- Responsive images with `srcset`
- WebP format with fallbacks
- Blur-up placeholders during load

### Caching Strategy

**React Query Cache:**
- Stale time: 5 minutes (data considered fresh)
- Cache time: 10 minutes (data kept in memory)
- Background refetch on window focus
- Automatic garbage collection

**Service Worker (PWA):**
- Cache static assets (CSS, JS, fonts)
- Network-first strategy for API calls
- Offline fallback page

### Bundle Size Optimization

- Tree shaking unused code
- Minification with Terser
- CSS purging with PurgeCSS (TailwindCSS)
- Compression (Gzip/Brotli) on server

## Error Handling Architecture

### Error Boundaries

```javascript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log to error reporting service
    console.error(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### API Error Handling

```javascript
// In React Query hooks
const { data, error, isError } = useQuery({
  queryKey: ['materials', subjectId],
  queryFn: () => materialsApi.getBySubject(subjectId),
  onError: (error) => {
    if (error.code === 401) {
      // Redirect to login
    } else if (error.code === 404) {
      // Show not found message
    } else {
      // Show generic error
    }
  }
});
```

### User-Facing Error Messages

- Localized error messages via i18next
- Toast notifications for transient errors
- Error state components for persistent errors
- Retry buttons for recoverable errors

## Security Architecture

### Input Validation

- Client-side validation with Zod schemas
- Server-side validation in Appwrite Functions
- Sanitization of user-generated content
- XSS prevention with DOMPurify

### Authentication Security

- HTTP-only cookies for session tokens
- CSRF protection via Appwrite SDK
- OAuth 2.0 for third-party authentication
- Password strength requirements enforced

### Data Access Control

**Appwrite Permissions:**
```javascript
// User can only modify their own documents
Permission.read(Role.any()),
Permission.update(Role.user(userId)),
Permission.delete(Role.user(userId))

// Admin has full access
Permission.write(Role.label('admin'))
```

### API Security

- Rate limiting on Appwrite endpoints
- Function execution limits
- API key rotation policy
- Environment variable encryption

## Testing Strategy

### Unit Testing
- Jest for utility functions
- React Testing Library for components
- Mock API calls with MSW (Mock Service Worker)

### Integration Testing
- Test feature workflows end-to-end
- Mock Appwrite SDK responses
- Verify data flow through layers

### E2E Testing
- Playwright or Cypress for user flows
- Test critical paths (login, upload, download)
- Cross-browser testing

## Deployment Architecture

### Build Process

```
Source Code → Vite Build → Optimization → Output (dist/)
                              ↓
                     - Code Splitting
                     - Minification
                     - Tree Shaking
                     - CSS Purging
                     - Source Maps
```

### Environment Configuration

**Development:**
- Hot module replacement (HMR)
- Source maps enabled
- Verbose error messages
- Mock data for testing

**Production:**
- Minified bundles
- Optimized assets
- Error tracking enabled
- Analytics enabled

### CI/CD Pipeline

1. **Commit** → Git push to repository
2. **Build** → Install dependencies, run build
3. **Test** → Run unit and integration tests
4. **Lint** → Check code style and quality
5. **Deploy** → Upload to hosting platform
6. **Verify** → Smoke tests on production

## Monitoring and Observability

### Application Monitoring
- Error tracking (Sentry or similar)
- Performance monitoring (Web Vitals)
- User analytics (Google Analytics or Plausible)

### Logging Strategy
- Client-side errors logged to console
- API errors logged with context
- User actions tracked for debugging

### Performance Metrics
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Time to Interactive (TTI)

---

This architecture provides a solid foundation for scalable, maintainable, and performant application development.
