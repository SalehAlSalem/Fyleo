# Contributing to Fyleo

Thank you for your interest in contributing to Fyleo. This document provides guidelines and best practices for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive criticism
- Respect differing viewpoints and experiences
- Accept responsibility for mistakes

### Unacceptable Behavior

- Harassment or discriminatory language
- Personal attacks or trolling
- Publishing private information
- Unprofessional conduct

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Git
- Code editor (VS Code recommended)
- Basic knowledge of React, JavaScript/TypeScript

### Setup Development Environment

1. Fork the repository on GitHub

2. Clone your fork:
```bash
git clone https://github.com/your-username/fyleo.git
cd fyleo
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/original-owner/fyleo.git
```

4. Install dependencies:
```bash
npm install
```

5. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

6. Update `.env` with your Appwrite credentials

7. Start development server:
```bash
npm run dev
```

## Development Workflow

### Branch Strategy

We use the following branch structure:

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Urgent production fixes

### Creating a Feature Branch

```bash
# Update develop branch
git checkout develop
git pull upstream develop

# Create feature branch
git checkout -b feature/your-feature-name
```

### Branch Naming Convention

- Feature: `feature/add-search-filter`
- Bug fix: `bugfix/fix-download-counter`
- Hotfix: `hotfix/security-patch`
- Documentation: `docs/update-readme`

### Keeping Your Branch Updated

```bash
# Fetch upstream changes
git fetch upstream

# Rebase your branch
git rebase upstream/develop
```

## Coding Standards

### JavaScript/TypeScript Style

We follow these style guidelines:

**Naming Conventions:**
- Components: PascalCase (`MaterialCard.jsx`)
- Functions: camelCase (`getUserData()`)
- Constants: UPPER_SNAKE_CASE (`API_URL`)
- Files: kebab-case or PascalCase depending on content

**Component Structure:**
```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/shared/ui';

// 2. Constants
const DEFAULT_LIMIT = 25;

// 3. Types/Interfaces (for TypeScript)
interface MaterialCardProps {
  material: Material;
  onDownload: (id: string) => void;
}

// 4. Component
const MaterialCard: React.FC<MaterialCardProps> = ({ material, onDownload }) => {
  // 4a. Hooks
  const [isHovered, setIsHovered] = useState(false);
  const { data } = useQuery(['material', material.$id]);
  
  // 4b. Event handlers
  const handleClick = () => {
    onDownload(material.$id);
  };
  
  // 4c. Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // 4d. Render
  return (
    <div onMouseEnter={() => setIsHovered(true)}>
      {/* JSX */}
    </div>
  );
};

// 5. Exports
export default MaterialCard;
```

**Code Quality:**

- Maximum line length: 100 characters
- Maximum function length: 50 lines
- Maximum file length: 300 lines
- Prefer functional components over class components
- Use custom hooks for reusable logic
- Keep components focused on single responsibility

**Comments:**

```javascript
// Good: Explain WHY, not WHAT
// Increment counter to track engagement metrics
const incrementCounter = async (materialId) => {
  // ... implementation
};

// Bad: Obvious comments
// Set loading to true
setLoading(true);
```

### React Best Practices

**1. Use Functional Components:**
```javascript
// Good
const MyComponent = ({ prop1, prop2 }) => {
  return <div>{prop1}</div>;
};

// Avoid
class MyComponent extends React.Component {
  render() {
    return <div>{this.props.prop1}</div>;
  }
}
```

**2. Extract Custom Hooks:**
```javascript
// Good: Reusable logic in custom hook
const useAuth = () => {
  const [user, setUser] = useState(null);
  // ... authentication logic
  return { user, login, logout };
};

const Component = () => {
  const { user, login } = useAuth();
  // Use authentication state
};
```

**3. Memoization for Performance:**
```javascript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Expensive rendering logic
  return <div>{/* ... */}</div>;
});

// Use useMemo for expensive calculations
const Component = () => {
  const expensiveValue = useMemo(() => {
    return computeExpensiveValue(data);
  }, [data]);
};
```

**4. Proper Dependency Arrays:**
```javascript
// Good: All dependencies included
useEffect(() => {
  fetchData(userId, query);
}, [userId, query]);

// Bad: Missing dependencies
useEffect(() => {
  fetchData(userId, query);
}, []); // ESLint will warn
```

### Feature-Sliced Design Architecture

When adding new features, follow FSD structure:

```
src/features/your-feature/
├── api/
│   ├── yourFeatureApi.ts      # API calls
│   └── index.ts
├── hooks/
│   ├── useYourFeatureData.ts  # React Query hooks
│   └── index.ts
├── components/
│   ├── YourComponent.tsx      # UI components
│   └── index.ts
├── pages/
│   ├── YourFeaturePage.tsx    # Page component
│   └── index.ts
└── index.ts                    # Public API
```

**API Layer Example:**
```typescript
// api/yourFeatureApi.ts
export const yourFeatureApi = {
  getAll: async () => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID
    );
    return response.documents;
  },
  
  getById: async (id: string) => {
    return await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      id
    );
  }
};
```

**Hooks Layer Example:**
```typescript
// hooks/useYourFeatureData.ts
export const useYourFeatureData = () => {
  return useQuery({
    queryKey: ['yourFeature'],
    queryFn: yourFeatureApi.getAll,
    staleTime: 5 * 60 * 1000
  });
};
```

### CSS/TailwindCSS Guidelines

**Prefer Tailwind utility classes:**
```javascript
// Good
<div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
  {/* content */}
</div>

// Acceptable for complex/reusable styles
<div className="custom-card">
  {/* content */}
</div>
```

**Use CSS modules for component-specific styles:**
```javascript
// MaterialCard.module.css
.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-4px);
}

// MaterialCard.jsx
import styles from './MaterialCard.module.css';

<div className={styles.card}>
  {/* content */}
</div>
```

**Responsive design:**
```javascript
// Mobile-first approach
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```

### Internationalization

**Always use translation keys:**
```javascript
// Good
import { useTranslation } from 'react-i18next';

const Component = () => {
  const { t } = useTranslation();
  return <h1>{t('welcome.title')}</h1>;
};

// Bad
const Component = () => {
  return <h1>Welcome to Fyleo</h1>;
};
```

**Add translations to both language files:**
```json
// public/locales/en/translation.json
{
  "welcome": {
    "title": "Welcome to Fyleo"
  }
}

// public/locales/ar/translation.json
{
  "welcome": {
    "title": "مرحباً بك في فايليو"
  }
}
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat(library): add search filter by file type

Added dropdown to filter materials by file type (PDF, DOCX, etc.)
in the library page. Integrated with existing search functionality.

Closes #123
```

```bash
fix(auth): resolve OAuth redirect issue on Safari

Fixed issue where OAuth callback would fail on Safari due to
cookie restrictions. Updated redirect flow to use URL parameters.

Fixes #456
```

```bash
docs(readme): update installation instructions

Added MinIO configuration steps and updated environment variable
descriptions for clarity.
```

### Commit Best Practices

- Write clear, concise commit messages
- Keep commits atomic (one logical change per commit)
- Reference issue numbers when applicable
- Use present tense ("add feature" not "added feature")
- Limit subject line to 50 characters
- Wrap body at 72 characters

## Pull Request Process

### Before Submitting PR

1. **Update your branch:**
```bash
git fetch upstream
git rebase upstream/develop
```

2. **Run tests:**
```bash
npm run test
```

3. **Lint your code:**
```bash
npm run lint
```

4. **Build successfully:**
```bash
npm run build
```

5. **Test locally:**
```bash
npm run preview
```

### Creating Pull Request

1. Push your branch:
```bash
git push origin feature/your-feature-name
```

2. Go to GitHub and create Pull Request

3. Use this template:

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Closes #123

## Changes Made
- Change 1
- Change 2
- Change 3

## Screenshots (if applicable)
[Add screenshots here]

## Testing
Describe how you tested your changes.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed my code
- [ ] Commented complex code sections
- [ ] Updated documentation
- [ ] Added tests (if applicable)
- [ ] All tests pass
- [ ] No console errors
- [ ] Works on mobile devices
- [ ] RTL layout works correctly (for UI changes)
```

### PR Review Process

1. At least one maintainer must review
2. All CI checks must pass
3. No merge conflicts
4. Code coverage maintained or improved
5. Documentation updated if needed

### Addressing Review Comments

1. Make requested changes
2. Commit with descriptive message
3. Push changes to same branch
4. Reply to review comments
5. Request re-review

### After PR is Merged

1. Delete your branch:
```bash
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

2. Update your local repository:
```bash
git checkout develop
git pull upstream develop
```

## Testing Guidelines

### Unit Tests

Test utility functions and hooks:

```javascript
// Example: utils.test.js
import { formatDate } from './utils';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('January 15, 2024');
  });
  
  it('should handle invalid dates', () => {
    expect(formatDate(null)).toBe('Invalid Date');
  });
});
```

### Component Tests

Use React Testing Library:

```javascript
// Example: MaterialCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import MaterialCard from './MaterialCard';

describe('MaterialCard', () => {
  const mockMaterial = {
    $id: '1',
    title: 'Test Material',
    fileType: 'pdf'
  };
  
  it('renders material title', () => {
    render(<MaterialCard material={mockMaterial} />);
    expect(screen.getByText('Test Material')).toBeInTheDocument();
  });
  
  it('calls onDownload when download button clicked', () => {
    const handleDownload = jest.fn();
    render(<MaterialCard material={mockMaterial} onDownload={handleDownload} />);
    
    fireEvent.click(screen.getByRole('button', { name: /download/i }));
    expect(handleDownload).toHaveBeenCalledWith('1');
  });
});
```

### Integration Tests

Test feature workflows end-to-end:

```javascript
describe('Library Feature', () => {
  it('should display materials when subject is selected', async () => {
    // Setup
    render(<LibraryPage />);
    
    // Select category
    await userEvent.click(screen.getByText('Computer Science'));
    
    // Select subject
    await userEvent.click(screen.getByText('Database Systems'));
    
    // Verify materials displayed
    expect(await screen.findByText('Lecture 01')).toBeInTheDocument();
  });
});
```

## Documentation

### Code Documentation

Use JSDoc for functions:

```javascript
/**
 * Fetches materials for a specific subject with optional filtering.
 *
 * @param {string} subjectId - The ID of the subject
 * @param {Object} options - Optional filters
 * @param {string} options.purposeId - Filter by educational purpose
 * @param {number} options.limit - Maximum number of results
 * @returns {Promise<Material[]>} Array of material documents
 * @throws {Error} If subject not found
 *
 * @example
 * const materials = await getMaterials('subject123', { purposeId: 'lectures' });
 */
const getMaterials = async (subjectId, { purposeId, limit = 25 } = {}) => {
  // Implementation
};
```

### README Documentation

Update README.md when:
- Adding new features
- Changing installation steps
- Updating dependencies
- Modifying configuration

### API Documentation

Update API.md when:
- Adding new API endpoints
- Changing request/response formats
- Adding new hooks
- Modifying function signatures

### Architecture Documentation

Update ARCHITECTURE.md when:
- Changing folder structure
- Introducing new patterns
- Modifying state management
- Updating routing structure

---

## Questions?

If you have questions about contributing:

1. Check existing documentation
2. Search closed issues for similar questions
3. Open a new issue with "Question" label
4. Join our community chat (if available)

Thank you for contributing to Fyleo!
