# GitHub Search App

A modern Next.js application for searching GitHub users and repositories with infinite pagination and real-time filtering.

## Features

- 🔍 Search GitHub users and repositories
- ∞ Infinite pagination with smooth loading
- 📊 Real-time item count control
- 🎨 Beautiful UI with Shadcn components
- ✅ Comprehensive unit tests with Jest
- 🚀 Built with Next.js 16 and React 19
- 📱 Responsive design with Tailwind CSS

## Prerequisites

- Node.js 18+ 
- npm or yarn
- GitHub API token (optional, for higher rate limits)

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd github-search-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
GITHUB_TOKEN=your_github_personal_access_token_here
```

To get a GitHub token:
1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Create a new token with `public_repo` scope
3. Copy the token and add it to `.env.local`

## Running the Application

### Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

The app auto-reloads as you edit files.

### Production Build

```bash
npm run build
npm run start
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Watch Mode (For Development)

```bash
npm run test:watch
```

Tests automatically re-run when files change.

### Coverage Report

```bash
npm run test:coverage
```

Generates a coverage report showing test coverage for hooks, utilities, and components.

## Usage Examples

### Searching for Users

1. Navigate to the app homepage
2. Select **"Users"** from the search type dropdown
3. Type a username or search term (e.g., "torvalds", "linus")
4. Press Enter or click the Search button
5. Scroll down to load more results

### Searching for Repositories

1. Select **"Repositories"** from the search type dropdown
2. Type a repository name or topic (e.g., "react", "vue")
3. Press Enter to search
4. View repository details including owner, description, and links

### Controlling Visible Items

The app allows you to control how many items are displayed:

```typescript
// Using the hook directly
const { visibleItems, visibleCount, setVisibleCount, loadMoreItems } = 
  useGithubSearch('react', 'repositories');

// Show only 5 items
setVisibleCount(5);

// Load 10 more items
await loadMoreItems(10);
```

## Project Structure

```
github-search-app/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Main page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── SearchForm.tsx       # Search input form
│   ├── SearchResult.tsx     # Results display
│   ├── RepoCard.tsx         # Repository card
│   ├── SearchTypeSelect.tsx # Type selector
│   ├── ReposContainer.tsx   # Results container
│   └── ui/                  # Shadcn UI components
├── hooks/                   # Custom React hooks
│   └── useGithubSearch.ts   # GitHub search hook
├── context/                 # React context
│   └── SearchContext.tsx    # Search state context
├── lib/                     # Utilities and helpers
│   ├── githubFetcher.ts     # GitHub API client
│   └── utils.ts             # Class name utilities
├── types/                   # TypeScript types
│   └── common.ts            # Shared type definitions
├── __tests__/               # Unit tests
│   ├── hooks/
│   ├── lib/
│   └── components/
└── public/                  # Static assets
```

## API Integration

The app uses the GitHub REST API v3 for searching:

- **Users endpoint**: `https://api.github.com/search/users`
- **Repositories endpoint**: `https://api.github.com/search/repositories`

### Search Query Parameters

- `q` - Search query string
- `per_page` - Items per page (default: 10)
- `page` - Page number (default: 1)

Example API call:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.github.com/search/users?q=torvalds&per_page=10&page=1"
```

## Testing

### Test Structure

Tests are organized by feature:

```
__tests__/
├── hooks/
│   └── useGithubSearch.test.ts      # 12 tests
├── lib/
│   ├── utils.test.ts                # 7 tests
│   └── githubFetcher.test.ts        # 7 tests
└── components/
    ├── SearchForm.test.tsx          # Component tests
    └── RepoCard.test.tsx            # Component tests
```

### Test Coverage

Currently testing:
- ✅ Hook logic and state management (useGithubSearch)
- ✅ API fetching and error handling (githubFetcher)
- ✅ Utility functions (className merging)
- ✅ Component rendering and interaction

Run tests with:
```bash
npm test                 # Run once
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage
```

For detailed testing information, see [TESTING.md](./TESTING.md).

## Key Components

### useGithubSearch Hook

Custom hook for managing GitHub search with pagination:

```typescript
const { 
  data,              // Paginated raw data
  mergedItems,       // Flattened items array
  visibleItems,      // Items to display
  visibleCount,      // Number of visible items
  setVisibleCount,   // Control visible items
  loadMoreItems,     // Load more items function
  isLoading,         // Loading state
  error,             // Error state
  hasReachedEnd,     // End of results indicator
} = useGithubSearch(query, searchType);
```

### SearchContext

Global state management for search:

```typescript
const { 
  query,           // Current search query
  setQuery,        // Update query
  searchType,      // 'users' | 'repositories'
  setSearchType,   // Change search type
  handleSearch,    // Trigger search
} = useSearchContext();
```

## Technologies Used

- **Framework**: Next.js 16.0.3
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4 + PostCSS
- **UI Components**: Shadcn/ui
- **Data Fetching**: SWR (Stale-While-Revalidate)
- **Testing**: Jest + React Testing Library
- **Build Tool**: SWC (JavaScript/TypeScript compiler)

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run lint             # Run ESLint
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features
- [React Documentation](https://react.dev) - React 19 docs
- [GitHub API Documentation](https://docs.github.com/en/rest) - GitHub REST API
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS
- [Jest Documentation](https://jestjs.io/docs/getting-started) - Testing framework

## Troubleshooting

### Rate Limiting

If you encounter GitHub API rate limit errors:
1. Add a `GITHUB_TOKEN` to `.env.local`
2. Authenticated requests have higher limits (60 requests/hour vs 10 for unauthenticated)

### Tests Failing

If tests fail after changes:
1. Clear Jest cache: `npm test -- --clearCache`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Run tests in watch mode: `npm run test:watch`

### Build Issues

For build-related issues:
1. Delete `.next` folder: `rm -rf .next`
2. Rebuild: `npm run build`
3. Check for TypeScript errors: `npx tsc --noEmit`

## Performance Tips

- **Pagination**: The app uses SWR's infinite pagination for optimal performance
- **Item Control**: Use `setVisibleCount` to render only visible items
- **Code Splitting**: Next.js automatically code-splits routes
- **Image Optimization**: Avatar images are optimized by Next.js

## Contributing

Contributions are welcome! Please:

1. Create a feature branch
2. Make your changes
3. Add or update tests
4. Run `npm test` to ensure tests pass
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the [GitHub API Documentation](https://docs.github.com/en/rest)
2. Review test files in `__tests__/` for usage examples
3. Check [TESTING.md](./TESTING.md) for testing guidance
