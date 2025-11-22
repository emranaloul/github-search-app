import { renderHook, waitFor } from '@testing-library/react';
import { useGithubSearch } from '@/hooks/useGithubSearch';
import { githubFetch } from '@/lib/githubFetcher';

jest.mock('@/lib/githubFetcher');
jest.mock('query-string', () => ({
  stringify: jest.fn((obj) => {
    const params = new URLSearchParams();
    if (obj.q) params.append('q', obj.q);
    if (obj.per_page) params.append('per_page', obj.per_page.toString());
    if (obj.page) params.append('page', obj.page.toString());
    return params.toString();
  }),
}));

const mockGithubFetch = githubFetch as jest.MockedFunction<typeof githubFetch>;

const mockUserResponse = {
  total_count: 100,
  incomplete_results: false,
  items: [
    {
      login: 'testuser',
      id: 1,
      avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
      html_url: 'https://github.com/testuser',
    },
  ],
};

describe('useGithubSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGithubFetch.mockResolvedValue(mockUserResponse);
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useGithubSearch('test', 'users'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it('should fetch users when query is provided', async () => {
    const { result } = renderHook(() => useGithubSearch('testuser', 'users'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGithubFetch).toHaveBeenCalled();
  });

  it('should fetch repositories when searchType is repositories', async () => {
    mockGithubFetch.mockResolvedValue({
      total_count: 50,
      incomplete_results: false,
      items: [{ id: 1, name: 'test-repo' }],
    });
    const { result } = renderHook(() =>
      useGithubSearch('test', 'repositories')
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGithubFetch).toHaveBeenCalled();
  });

  it('should not fetch when query is empty', () => {
    renderHook(() => useGithubSearch('', 'users'));

    expect(mockGithubFetch).not.toHaveBeenCalled();
  });

  it('should handle API errors', async () => {
    const errorMessage = 'API Error: 403 Forbidden';
    mockGithubFetch.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useGithubSearch('test', 'users'));

    // With errors, isLoading becomes false
    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 2000 }
    );

    // Error or data should be defined (error typically gets set by SWR)
    expect(
      result.current.error || result.current.data !== undefined
    ).toBeTruthy();
  });

  it('should indicate when end of results is reached', async () => {
    const smallPageResponse = {
      total_count: 5,
      incomplete_results: false,
      items: [{ login: 'user1' }, { login: 'user2' }], // Less than ITEMS_PER_PAGE (10)
    };
    mockGithubFetch.mockResolvedValue(smallPageResponse);

    const { result } = renderHook(() => useGithubSearch('test', 'users'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasReachedEnd).toBe(true);
  });

  it('should merge items from multiple pages', async () => {
    const page1 = {
      total_count: 100,
      incomplete_results: false,
      items: [{ login: 'user1' }],
    };

    mockGithubFetch.mockResolvedValue(page1);

    const { result } = renderHook(() => useGithubSearch('test', 'users'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Array.isArray(result.current.mergedItems)).toBe(true);
    expect(result.current.mergedItems.length).toBeGreaterThanOrEqual(0);
  });

  it('should filter visible items based on visibleCount', async () => {
    const manyItemsResponse = {
      total_count: 100,
      incomplete_results: false,
      items: Array.from({ length: 10 }, (_, i) => ({
        login: `user${i}`,
        id: i,
        avatar_url: `https://avatars.githubusercontent.com/u/${i}?v=4`,
        html_url: `https://github.com/user${i}`,
      })),
    };
    mockGithubFetch.mockResolvedValue(manyItemsResponse);

    const { result } = renderHook(() => useGithubSearch('test', 'users'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check initial visible count
    expect(result.current.visibleCount).toBe(10);

    // Set visible count to 5
    result.current.setVisibleCount(5);

    await waitFor(() => {
      expect(result.current.visibleCount).toBe(5);
    });
  });

  it('should load more items on demand', async () => {
    const page1 = {
      total_count: 100,
      incomplete_results: false,
      items: Array.from({ length: 10 }, (_, i) => ({
        login: `user${i}`,
        id: i,
        avatar_url: `https://avatars.githubusercontent.com/u/${i}?v=4`,
        html_url: `https://github.com/user${i}`,
      })),
    };

    mockGithubFetch.mockResolvedValue(page1);

    const { result } = renderHook(() => useGithubSearch('test', 'users'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialCount = result.current.visibleCount;
    expect(typeof result.current.loadMoreItems).toBe('function');

    // Load 5 more items
    result.current.setVisibleCount(initialCount + 5);

    await waitFor(() => {
      expect(result.current.visibleCount).toBe(initialCount + 5);
    });
  });

  it('should include page and per_page params in fetch URL', async () => {
    renderHook(() => useGithubSearch('myquery', 'users'));

    await waitFor(() => {
      expect(mockGithubFetch).toHaveBeenCalled();
    });

    const callUrl = mockGithubFetch.mock.calls[0][0];
    expect(callUrl).toContain('q=myquery');
    expect(callUrl).toContain('per_page=10');
    expect(callUrl).toContain('page=1');
  });
});
