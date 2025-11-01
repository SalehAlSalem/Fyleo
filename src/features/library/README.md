# 📚 Library Feature - FSD Architecture

**Complete rebuild using Feature-Sliced Design (FSD) methodology for clean, maintainable, and scalable code.**

---

## 🎯 Overview

The Library feature is the core of Fyleo's educational content system. It provides a three-level progressive experience for browsing and accessing educational materials.

### Philosophy
**"The platform should understand the student's intent."**

---

## 🏗️ Architecture (FSD)

```
src/features/library/
├── api/                    # API Layer
│   ├── libraryApi.ts      # Centralized Appwrite calls
│   └── index.ts           # API exports
├── hooks/                  # Hooks Layer
│   ├── useLibraryData.ts  # React Query hooks
│   └── index.ts           # Hooks exports
├── components/             # Components Layer (Dumb Components)
│   ├── CategoryCard.tsx   # Category display card
│   ├── SubjectCard.tsx    # Subject display card
│   ├── MaterialCard.tsx   # Material display card
│   ├── SearchBar.tsx      # Spotlight-style search
│   ├── PurposeTabs.tsx    # Data-driven tabs
│   ├── LoaderSkeleton.tsx # Loading skeletons
│   ├── Breadcrumb.tsx     # Navigation breadcrumb
│   ├── EmptyState.tsx     # Empty state display
│   ├── ErrorState.tsx     # Error state display
│   └── index.ts           # Components exports
├── pages/                  # Pages Layer
│   ├── LibraryPage.tsx    # Main page (3 levels)
│   └── index.ts           # Pages exports
├── index.ts               # Feature public API
└── README.md              # This file
```

---

## 🎨 Three Progressive Levels

### **Level 1: Smart Explorer** 🔍
**Route**: `/library`

**Features:**
- Spotlight-style global search bar
- Visual category grid with icons and colors from DB
- Prefetching on hover
- Responsive grid (1-4 columns)

**Components Used:**
- `SearchBar` - Global search with dropdown results
- `CategoryCard` - Rich category cards

---

### **Level 2: Category View** 📖
**Route**: `/library/:categoryId`

**Features:**
- Smooth in-place transition
- Subject grid with rich metadata
- Breadcrumb navigation
- Category header with stats

**Components Used:**
- `Breadcrumb` - Navigation trail
- `SubjectCard` - Subject cards with creditHours & level

---

### **Level 3: Subject Page** 📄
**Route**: `/library/:categoryId/:subjectId`

**Features:**
- Data-driven Smart Tabs (from `educationalPurpose`)
- Unified content feed (Materials + Posts)
- Tab switching with animations
- Content filtering by purpose

**Components Used:**
- `Breadcrumb` - Navigation trail
- `PurposeTabs` - Dynamic tabs from DB
- `MaterialCard` - Material display cards

---

## 🔌 API Layer

### Centralized Service (`libraryApi.ts`)

All Appwrite database calls are centralized in one file:

```typescript
// Categories
categoriesApi.getAll()
categoriesApi.getById(id)
categoriesApi.getSubjects(categoryId)

// Subjects
subjectsApi.getById(id)
subjectsApi.getAll()

// Educational Purposes
purposesApi.getAll()

// Materials
materialsApi.getBySubject(subjectId, purposeId?)
materialsApi.getById(id)
materialsApi.search(query)

// Posts
postsApi.getBySubject(subjectId, purposeId?)
postsApi.getById(id)

// Global Search
searchApi.globalSearch(query)
```

---

## 🎣 Hooks Layer

### React Query Hooks (`useLibraryData.ts`)

All server state management uses React Query:

```typescript
// Categories
useCategories()
useCategory(id)
useCategorySubjects(categoryId)
usePrefetchCategory()

// Subjects
useSubject(id)
useSubjects()
usePrefetchSubject()

// Educational Purposes
usePurposes()

// Materials
useMaterials(subjectId, purposeId?)
useMaterial(id)

// Posts
usePosts(subjectId, purposeId?)

// Search
useGlobalSearch(query, enabled)

// Combined
useSubjectContent(subjectId, purposeId?)
```

### Caching Strategy

```typescript
Categories:  10 minutes stale time
Subjects:     5 minutes stale time
Purposes:    15 minutes stale time (rarely changes)
Materials:    3 minutes stale time
Posts:        2 minutes stale time (more dynamic)
Search:       2 minutes stale time
```

---

## 🎨 Components Layer

### Dumb Components Philosophy

All components are **"dumb"** - they receive all data via props and have no business logic:

```typescript
// Example: CategoryCard
<CategoryCard
  category={category}
  onClick={handleClick}
  onHover={handleHover}
  nameKey="nameAr"
  descriptionKey="descriptionAr"
/>
```

### Component List

1. **CategoryCard** - Display category with icon, name, description
2. **SubjectCard** - Display subject with metadata (creditHours, level)
3. **MaterialCard** - Display material with file info and actions
4. **SearchBar** - Spotlight-style search with dropdown
5. **PurposeTabs** - Data-driven tabs with keyboard navigation
6. **LoaderSkeleton** - Accessible loading states
7. **Breadcrumb** - Navigation trail
8. **EmptyState** - Empty content display
9. **ErrorState** - Error handling display

---

## 📄 Pages Layer

### LibraryPage.tsx

The main page component that:
- Determines current level (1, 2, or 3)
- Fetches data using hooks
- Assembles components
- Handles navigation
- Manages state

**Key Features:**
- Level-based rendering
- Smooth transitions (Framer Motion)
- Breadcrumb navigation
- Loading states
- Error handling
- Empty states
- Responsive design
- Dark mode support
- Localization (Arabic/English)

---

## 🌐 Localization

### Bilingual Support

The feature fully supports Arabic and English:

```typescript
const isArabic = i18n.language === 'ar';
const nameKey = isArabic ? 'nameAr' : 'nameEn';
const descriptionKey = isArabic ? 'descriptionAr' : 'descriptionEn';
```

All components receive `nameKey` and `descriptionKey` as props.

---

## ♿ Accessibility

### WCAG AA Compliant

- ✅ Keyboard navigation
- ✅ ARIA attributes
- ✅ Screen reader support
- ✅ Focus indicators
- ✅ Semantic HTML
- ✅ Color contrast

### Keyboard Shortcuts

- **Search Dropdown**: Arrow keys, Enter, Escape
- **Tabs**: Arrow Left/Right, Home, End
- **Cards**: Tab, Enter, Space

---

## 📱 Responsive Design

### Breakpoints

```css
Mobile:        1 column  (< 768px)
Tablet:        2 columns (768px - 1024px)
Desktop:       3 columns (1024px - 1280px)
Large Desktop: 4 columns (> 1280px)
```

### Mobile Optimizations

- Touch-friendly buttons (min 44x44px)
- Swipe gestures
- Responsive typography
- Optimized images

---

## 🎭 Animations

### Framer Motion

All animations use Framer Motion:

```typescript
// Card hover
whileHover={{ scale: 1.02, y: -4 }}

// Page transitions
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}

// Tab indicator
<motion.div layoutId="activeTab" />
```

---

## 🚀 Performance

### Optimizations

1. **React Query Caching** - Automatic cache management
2. **Prefetching** - Prefetch on hover
3. **Code Splitting** - Lazy loading
4. **Skeleton Loaders** - Better perceived performance
5. **Debounced Search** - 300ms debounce

### Metrics

```
Initial Load:    < 2s
Search Results:  < 300ms
Animations:      60fps
Lighthouse:      > 90
```

---

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

Components to test:
- LoaderSkeleton
- SearchBar
- CategoryCard
- SubjectCard
- MaterialCard
- PurposeTabs

---

## 📦 Usage

### Import the Feature

```typescript
import { LibraryPage } from './features/library';
```

### Add Routes

```jsx
<Route path="/library" element={<LibraryPage />} />
<Route path="/library/:categoryId" element={<LibraryPage />} />
<Route path="/library/:categoryId/:subjectId" element={<LibraryPage />} />
```

---

## 🔧 Configuration

### Environment Variables

```env
VITE_APPWRITE_URL
VITE_APPWRITE_PROJECT_ID
VITE_APPWRITE_DATABASE_ID
VITE_APPWRITE_CATEGORIES_COLLECTION_ID
VITE_APPWRITE_SUBJECTS_COLLECTION_ID
VITE_APPWRITE_MATERIALS_COLLECTION_ID
VITE_APPWRITE_POSTS_COLLECTION_ID
VITE_APPWRITE_EDUCATIONAL_PURPOSES_COLLECTION_ID
```

---

## 🎯 Design Principles

### Feature-Sliced Design (FSD)

1. **Separation of Concerns** - Each layer has a single responsibility
2. **Dumb Components** - UI components have no business logic
3. **Centralized API** - All API calls in one place
4. **Custom Hooks** - Reusable data fetching logic
5. **Public API** - Only export what's needed

### Benefits

- ✅ Easy to test
- ✅ Easy to maintain
- ✅ Easy to scale
- ✅ Easy to understand
- ✅ Easy to refactor

---

## 🔮 Future Enhancements

- [ ] Infinite scroll
- [ ] Advanced filtering
- [ ] Sorting options
- [ ] Bulk actions
- [ ] Export functionality
- [ ] Offline support (PWA)
- [ ] Real-time updates

---

## 📝 Notes

### Database Collections

The feature uses these Appwrite collections:
- `categories` - Subject categories
- `subjects` - Academic subjects
- `materials` - Educational files
- `posts` - User posts
- `educationalPurposes` - Purpose types (Lectures, Practice, etc.)

### Data Flow

```
User Action → Component → Hook → API → Appwrite → Cache → Component → UI
```

---

## 🤝 Contributing

### Code Style

- Use TypeScript strict mode
- Follow FSD principles
- Write dumb components
- Add prop types
- Document complex logic

### Pull Requests

1. Create feature branch
2. Write tests
3. Update documentation
4. Submit PR

---

**Built with ❤️ using Feature-Sliced Design, React, TypeScript, and modern web technologies.**
