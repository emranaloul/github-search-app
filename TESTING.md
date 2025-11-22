# Testing Guide

This project includes comprehensive unit tests using Jest and React Testing Library.

## Test Setup

Tests are configured with:
- **Jest**: Test runner and framework
- **React Testing Library**: Component and hook testing utilities
- **@types/jest**: TypeScript type definitions for Jest
- **@swc/jest**: Fast TypeScript/JavaScript transpilation for tests

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Files

Test files are located in the `__tests__` directory and follow the naming convention `*.test.ts` or `*.test.tsx`.

### Current Tests

#### **Hooks** (`__tests__/hooks/`)
- **useGithubSearch.test.ts** - Tests for the `useGithubSearch` hook
  - Loading state initialization
  - Fetching users and repositories
  - Empty query handling
  - API error handling
  - End of results detection
  - Item visibility control
  - URL parameter construction

#### **Utilities** (`__tests__/lib/`)
- **utils.test.ts** - Tests for the `cn` className utility
  - Class name merging
  - Conditional classes
  - Falsy value removal
  - Tailwind conflict resolution
  - Complex combinations

- **githubFetcher.test.ts** - Tests for the GitHub API fetcher
  - Request header construction
  - Custom header merging
  - JSON response parsing
  - Error handling (403, 404, 401)
  - Custom fetch options

#### **Components** (`__tests__/components/`)
- **SearchForm.test.tsx** - SearchForm component tests
- **RepoCard.test.tsx** - RepoCard component tests

## Configuration Files

- **jest.config.js** - Jest configuration with Next.js support
- **jest.setup.js** - Global test setup and mocks

## Writing Tests

### Mocking

Tests include mocks for:
- `@/lib/githubFetcher` - GitHub API calls
- `query-string` - URL query string builder
- `next/navigation` - Next.js navigation (in jest.setup.js)

### Example Hook Test

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useGithubSearch } from '@/hooks/useGithubSearch';

describe('useGithubSearch', () => {
  it('should fetch when query is provided', async () => {
    const { result } = renderHook(() => useGithubSearch('test', 'users'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });
});
```

## Coverage

Test coverage is tracked for:
- All hooks in `hooks/**`
- All utilities in `lib/**`
- All components in `components/**`

View coverage reports with:
```bash
npm run test:coverage
```

## Troubleshooting

### Module Transform Issues
If you encounter "Cannot use import statement outside a module" errors, ensure `jest.config.js` has proper transformIgnorePatterns configuration for ES modules.

### React Hook Testing
Use `renderHook` from `@testing-library/react` for testing custom hooks in isolation. Wrap hook calls in `waitFor` when expecting async operations.

### Mocking Best Practices
- Mock dependencies at the top level of test files
- Clear mocks between tests using `jest.clearAllMocks()` in `beforeEach`
- Use `mockResolvedValue` for successful operations and `mockRejectedValue` for errors
