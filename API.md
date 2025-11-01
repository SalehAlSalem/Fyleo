# API Reference

This document provides comprehensive information about the API layer, services, and Appwrite Functions used in Fyleo.

## Table of Contents

- [Frontend API Layer](#frontend-api-layer)
- [Appwrite Services](#appwrite-services)
- [React Query Hooks](#react-query-hooks)
- [Appwrite Functions](#appwrite-functions)
- [External APIs](#external-apis)

## Frontend API Layer

### Library API (`src/features/library/api/libraryApi.ts`)

Centralized API calls for the library feature using Appwrite SDK.

#### Categories API

**`categoriesApi.getAll()`**
```typescript
async function getAll(): Promise<Category[]>
```
Fetch all categories with sorting by order.

**Returns:** Array of category documents

**Example:**
```javascript
const categories = await categoriesApi.getAll();
```

---

**`categoriesApi.getById(id: string)`**
```typescript
async function getById(id: string): Promise<Category>
```
Fetch single category by ID.

**Parameters:**
- `id`: Category document ID

**Returns:** Category document

**Throws:** Error if category not found

---

**`categoriesApi.getSubjects(categoryId: string)`**
```typescript
async function getSubjects(categoryId: string): Promise<Subject[]>
```
Fetch all subjects belonging to a category.

**Parameters:**
- `categoryId`: Parent category ID

**Returns:** Array of subject documents

---

#### Subjects API

**`subjectsApi.getById(id: string)`**
```typescript
async function getById(id: string): Promise<Subject>
```
Fetch single subject by ID with related category data.

**Parameters:**
- `id`: Subject document ID

**Returns:** Subject document with nested category

---

**`subjectsApi.getAll()`**
```typescript
async function getAll(): Promise<Subject[]>
```
Fetch all subjects across all categories.

**Returns:** Array of subject documents

---

#### Materials API

**`materialsApi.getBySubject(subjectId: string, purposeId?: string)`**
```typescript
async function getBySubject(
  subjectId: string,
  purposeId?: string
): Promise<Material[]>
```
Fetch materials for a subject, optionally filtered by educational purpose.

**Parameters:**
- `subjectId`: Subject document ID
- `purposeId` (optional): Educational purpose ID for filtering

**Returns:** Array of material documents sorted by creation date

**Example:**
```javascript
// Get all materials for subject
const materials = await materialsApi.getBySubject('subject123');

// Get only lecture materials
const lectures = await materialsApi.getBySubject('subject123', 'lectures');
```

---

**`materialsApi.getById(id: string)`**
```typescript
async function getById(id: string): Promise<Material>
```
Fetch single material by ID with metadata.

**Parameters:**
- `id`: Material document ID

**Returns:** Material document

---

**`materialsApi.search(query: string)`**
```typescript
async function search(query: string): Promise<Material[]>
```
Search materials by title or description.

**Parameters:**
- `query`: Search string (minimum 2 characters)

**Returns:** Array of matching material documents

**Example:**
```javascript
const results = await materialsApi.search('database systems');
```

---

#### Posts API

**`postsApi.getBySubject(subjectId: string, purposeId?: string)`**
```typescript
async function getBySubject(
  subjectId: string,
  purposeId?: string
): Promise<Post[]>
```
Fetch posts for a subject, optionally filtered by purpose.

**Parameters:**
- `subjectId`: Subject document ID
- `purposeId` (optional): Educational purpose filter

**Returns:** Array of post documents

---

#### Educational Purposes API

**`purposesApi.getAll()`**
```typescript
async function getAll(): Promise<EducationalPurpose[]>
```
Fetch all educational purposes (e.g., Lectures, Labs, Assignments).

**Returns:** Array of purpose documents sorted by order

---

#### Global Search API

**`searchApi.globalSearch(query: string)`**
```typescript
async function globalSearch(query: string): Promise<SearchResults>
```
Perform global search across categories, subjects, and materials.

**Parameters:**
- `query`: Search string

**Returns:** Object with arrays of matching categories, subjects, and materials

**Example:**
```javascript
const { categories, subjects, materials } = await searchApi.globalSearch('CS');
```

---

## Appwrite Services

### Authentication Service (`src/services/authService.js`)

**`login(email: string, password: string)`**
```javascript
async function login(email, password): Promise<Session>
```
Create email session for user login.

**Parameters:**
- `email`: User email address
- `password`: User password

**Returns:** Session object

**Throws:** Error if credentials invalid

---

**`signup(email: string, password: string, name: string)`**
```javascript
async function signup(email, password, name): Promise<User>
```
Create new user account and send verification email.

**Parameters:**
- `email`: User email
- `password`: Password (minimum 8 characters)
- `name`: Display name

**Returns:** User object

---

**`logout()`**
```javascript
async function logout(): Promise<void>
```
Delete current session and log out user.

---

**`getCurrentUser()`**
```javascript
async function getCurrentUser(): Promise<User | null>
```
Get currently authenticated user.

**Returns:** User object or null if not authenticated

---

**`sendVerificationEmail()`**
```javascript
async function sendVerificationEmail(): Promise<void>
```
Send email verification link to current user.

---

**`resetPassword(email: string)`**
```javascript
async function resetPassword(email): Promise<void>
```
Send password reset email.

**Parameters:**
- `email`: User email address

---

**`createOAuth2Session(provider: string)`**
```javascript
async function createOAuth2Session(provider): Promise<void>
```
Initiate OAuth2 authentication flow.

**Parameters:**
- `provider`: OAuth provider ('google', 'github', 'facebook')

**Redirects:** User to provider authentication page

---

### Database Service (`src/config/DatabaseService.js`)

**`listDocuments(collectionId: string, queries?: Query[])`**
```javascript
async function listDocuments(collectionId, queries = []): Promise<DocumentList>
```
List documents from collection with optional queries.

**Parameters:**
- `collectionId`: Collection identifier
- `queries`: Array of Appwrite Query objects

**Returns:** Object with documents array and total count

**Example:**
```javascript
const { documents, total } = await DatabaseService.listDocuments(
  MATERIALS_COLLECTION_ID,
  [
    Query.equal('subjectId', 'subject123'),
    Query.limit(25)
  ]
);
```

---

**`getDocument(collectionId: string, documentId: string)`**
```javascript
async function getDocument(collectionId, documentId): Promise<Document>
```
Get single document by ID.

**Parameters:**
- `collectionId`: Collection identifier
- `documentId`: Document ID

**Returns:** Document object

---

**`createDocument(collectionId: string, data: object, permissions?: string[])`**
```javascript
async function createDocument(
  collectionId,
  data,
  permissions = []
): Promise<Document>
```
Create new document in collection.

**Parameters:**
- `collectionId`: Collection identifier
- `data`: Document data object
- `permissions`: Array of permission strings

**Returns:** Created document object

**Example:**
```javascript
const bookmark = await DatabaseService.createDocument(
  BOOKMARKS_COLLECTION_ID,
  {
    userId: user.$id,
    materialId: material.$id
  },
  [
    Permission.read(Role.user(user.$id)),
    Permission.delete(Role.user(user.$id))
  ]
);
```

---

**`updateDocument(collectionId: string, documentId: string, data: object)`**
```javascript
async function updateDocument(
  collectionId,
  documentId,
  data
): Promise<Document>
```
Update existing document.

**Parameters:**
- `collectionId`: Collection identifier
- `documentId`: Document ID to update
- `data`: Updated fields

**Returns:** Updated document object

---

**`deleteDocument(collectionId: string, documentId: string)`**
```javascript
async function deleteDocument(collectionId, documentId): Promise<void>
```
Delete document from collection.

**Parameters:**
- `collectionId`: Collection identifier
- `documentId`: Document ID to delete

---

### Storage Service (`src/config/StorageService.js`)

**`uploadFile(file: File, permissions?: string[])`**
```javascript
async function uploadFile(file, permissions = []): Promise<File>
```
Upload file to Appwrite storage bucket.

**Parameters:**
- `file`: File object from input
- `permissions`: Array of permission strings

**Returns:** Uploaded file object with ID

**Example:**
```javascript
const uploadedFile = await StorageService.uploadFile(
  selectedFile,
  [
    Permission.read(Role.any()),
    Permission.delete(Role.user(user.$id))
  ]
);
```

---

**`getFileView(fileId: string)`**
```javascript
function getFileView(fileId): string
```
Get public URL for file view.

**Parameters:**
- `fileId`: File document ID

**Returns:** URL string for file access

---

**`getFileDownload(fileId: string)`**
```javascript
function getFileDownload(fileId): string
```
Get download URL for file.

**Parameters:**
- `fileId`: File document ID

**Returns:** URL string for file download

---

**`deleteFile(fileId: string)`**
```javascript
async function deleteFile(fileId): Promise<void>
```
Delete file from storage.

**Parameters:**
- `fileId`: File document ID

---

### Hierarchy Service (`src/services/hierarchyService.js`)

**`getCategoryHierarchy(categoryId: string)`**
```javascript
async function getCategoryHierarchy(categoryId): Promise<CategoryHierarchy>
```
Get category with all nested subjects and their materials.

**Parameters:**
- `categoryId`: Category document ID

**Returns:** Category object with nested subjects array

---

**`getSubjectMaterials(subjectId: string, options?: object)`**
```javascript
async function getSubjectMaterials(
  subjectId,
  { purposeId, limit, offset } = {}
): Promise<Material[]>
```
Get materials for subject with filtering and pagination.

**Parameters:**
- `subjectId`: Subject document ID
- `options.purposeId`: Filter by educational purpose
- `options.limit`: Maximum results
- `options.offset`: Pagination offset

**Returns:** Array of material documents

---

## React Query Hooks

### Library Hooks (`src/features/library/hooks/useLibraryData.ts`)

**`useCategories()`**
```typescript
function useCategories(): UseQueryResult<Category[]>
```
Fetch all categories with React Query.

**Returns:**
- `data`: Array of categories
- `isLoading`: Loading state
- `error`: Error object if failed

**Cache:** 5 minutes stale time

**Example:**
```javascript
const { data: categories, isLoading, error } = useCategories();

if (isLoading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;

return categories.map(cat => <CategoryCard key={cat.$id} category={cat} />);
```

---

**`useCategory(id: string)`**
```typescript
function useCategory(id: string): UseQueryResult<Category>
```
Fetch single category by ID.

**Parameters:**
- `id`: Category document ID

**Returns:** Query result with category data

---

**`useCategorySubjects(categoryId: string)`**
```typescript
function useCategorySubjects(categoryId: string): UseQueryResult<Subject[]>
```
Fetch subjects for a category.

**Parameters:**
- `categoryId`: Parent category ID

**Returns:** Query result with subjects array

---

**`useSubject(id: string)`**
```typescript
function useSubject(id: string): UseQueryResult<Subject>
```
Fetch single subject with category data.

**Parameters:**
- `id`: Subject document ID

**Returns:** Query result with subject data

---

**`useMaterials(subjectId: string, purposeId?: string)`**
```typescript
function useMaterials(
  subjectId: string,
  purposeId?: string
): UseQueryResult<Material[]>
```
Fetch materials for subject with optional purpose filter.

**Parameters:**
- `subjectId`: Subject document ID
- `purposeId`: Optional purpose filter

**Returns:** Query result with materials array

**Example:**
```javascript
const [selectedPurpose, setSelectedPurpose] = useState(null);
const { data: materials } = useMaterials(subjectId, selectedPurpose);
```

---

**`usePurposes()`**
```typescript
function usePurposes(): UseQueryResult<EducationalPurpose[]>
```
Fetch all educational purposes.

**Returns:** Query result with purposes array for tabs

---

**`useGlobalSearch(query: string)`**
```typescript
function useGlobalSearch(query: string): UseQueryResult<SearchResults>
```
Perform global search with debouncing.

**Parameters:**
- `query`: Search string

**Returns:** Query result with categorized search results

**Debounce:** 300ms

**Example:**
```javascript
const [searchQuery, setSearchQuery] = useState('');
const { data: results } = useGlobalSearch(searchQuery);
```

---

**`usePrefetchCategory()`**
```typescript
function usePrefetchCategory(): (id: string) => void
```
Prefetch category data on hover for instant navigation.

**Returns:** Prefetch function

**Example:**
```javascript
const prefetchCategory = usePrefetchCategory();

<CategoryCard
  category={category}
  onMouseEnter={() => prefetchCategory(category.$id)}
/>
```

---

### Authentication Hooks (`src/hooks/useAuth.jsx`)

**`useAuth()`**
```typescript
function useAuth(): AuthContextValue
```
Access authentication state and methods.

**Returns:**
- `user`: Current user object or null
- `isLoading`: Authentication check in progress
- `isAuthenticated`: Boolean if user logged in
- `isAdmin`: Boolean if user has admin role
- `login(email, password)`: Login function
- `signup(email, password, name)`: Signup function
- `logout()`: Logout function

**Example:**
```javascript
const { user, isAuthenticated, login, logout } = useAuth();

if (!isAuthenticated) {
  return <LoginForm onSubmit={login} />;
}

return (
  <div>
    <p>Welcome, {user.name}!</p>
    <button onClick={logout}>Logout</button>
  </div>
);
```

---

## Appwrite Functions

### onDownloadCreate Function

**Endpoint:** Triggered automatically on download document creation

**Event:** `databases.downloads.documents.*.create`

**Purpose:** Increment `downloadscounter` field in materials collection

**Input:** Appwrite event object with new download document

**Process:**
1. Extract `materialId` from download document
2. Fetch current material document
3. Increment `downloadscounter` by 1
4. Update material document

**Output:** Updated material document

**Error Handling:**
- Logs error if material not found
- Retries up to 3 times on network errors
- Returns success even if counter update fails (non-blocking)

---

### onBookmarkToggle Function

**Endpoint:** Triggered on bookmark create/delete

**Events:**
- `databases.bookmarks.documents.*.create`
- `databases.bookmarks.documents.*.delete`

**Purpose:** Increment or decrement `bookmarkscounter` in materials collection

**Input:** Appwrite event object with bookmark document

**Process:**
1. Determine event type (create or delete)
2. Extract `materialId` from bookmark document
3. Fetch current material document
4. Increment counter (create) or decrement (delete)
5. Update material document

**Output:** Updated material document

**Error Handling:**
- Prevents counter from going below 0
- Logs warnings for inconsistent data

---

### validate-link Function

**Endpoint:** `POST /validate-link`

**Purpose:** Validate URL and extract metadata for link previews

**Input:**
```json
{
  "url": "https://example.com"
}
```

**Process:**
1. Validate URL format
2. Call LinkPreview API
3. Extract title, description, image
4. Return formatted metadata

**Output:**
```json
{
  "success": true,
  "data": {
    "title": "Page Title",
    "description": "Page description",
    "image": "https://example.com/image.jpg",
    "url": "https://example.com"
  }
}
```

**Error Handling:**
- Returns default metadata if API fails
- Validates URL format before API call
- Sanitizes extracted content

---

### delete-user Function

**Endpoint:** `POST /delete-user`

**Purpose:** Permanently delete user account and all associated data

**Input:**
```json
{
  "userId": "user123"
}
```

**Process:**
1. Verify user session matches userId
2. Delete all user bookmarks
3. Delete all user downloads
4. Delete materials uploaded by user
5. Delete user profile document
6. Delete user account from Auth

**Output:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

**Error Handling:**
- Rolls back changes if any step fails
- Requires user authentication
- Admin cannot delete their own account

**Security:**
- Only user can delete their own account
- Requires valid session token
- Logs deletion for audit trail

---

### minio-presign Function

**Endpoint:** `POST /minio-presign`

**Purpose:** Generate pre-signed URL for MinIO file access

**Input:**
```json
{
  "fileName": "lecture-01.pdf",
  "expiryDays": 7
}
```

**Process:**
1. Validate user session
2. Connect to MinIO server
3. Generate pre-signed URL with expiry
4. Return URL to frontend

**Output:**
```json
{
  "success": true,
  "url": "https://minio.example.com/bucket/file?signature=..."
}
```

**Configuration:**
- Default expiry: 7 days
- Maximum expiry: 30 days
- HTTPS only for production

**Error Handling:**
- Returns 401 if user not authenticated
- Returns 404 if file not found
- Logs errors for debugging

---

## External APIs

### LinkPreview API

**Provider:** linkpreview.net

**Purpose:** Extract metadata from URLs for link previews

**Endpoint:** `https://api.linkpreview.net/`

**Authentication:** API key in query parameter

**Rate Limits:** 60 requests per hour (free tier)

**Request:**
```
GET https://api.linkpreview.net/?key=API_KEY&q=URL
```

**Response:**
```json
{
  "title": "Page Title",
  "description": "Page description",
  "image": "https://example.com/image.jpg",
  "url": "https://example.com"
}
```

---

### MinIO API

**Provider:** Self-hosted MinIO server

**Purpose:** Object storage for large files

**SDK:** `minio` npm package

**Authentication:** Access key and secret key

**Operations:**
- `putObject`: Upload file
- `getObject`: Download file
- `presignedGetObject`: Generate pre-signed URL
- `removeObject`: Delete file

**Example:**
```javascript
const presignedUrl = await minioClient.presignedGetObject(
  'fyleo-files',
  'lecture-01.pdf',
  7 * 24 * 60 * 60 // 7 days
);
```

---

## Error Codes

### Appwrite Error Codes

- `401`: Unauthorized (user not authenticated)
- `404`: Document not found
- `409`: Document with ID already exists
- `429`: Rate limit exceeded
- `500`: Server error

### Application Error Codes

- `AUTH_001`: Invalid credentials
- `AUTH_002`: Email not verified
- `AUTH_003`: Session expired
- `FILE_001`: File too large (max 50MB Appwrite, unlimited MinIO)
- `FILE_002`: Invalid file type
- `PERM_001`: Insufficient permissions
- `PERM_002`: Admin access required

---

## Rate Limits

### Appwrite Cloud Limits

- Database operations: 60 requests/minute per IP
- Storage uploads: 10 requests/minute per IP
- Function executions: 100 requests/minute per project

### MinIO Limits

- No rate limits (self-hosted)
- Bandwidth limited by server capacity

---

This API reference covers all major endpoints and services used in Fyleo. For detailed implementation examples, refer to the source code in the respective service files.
