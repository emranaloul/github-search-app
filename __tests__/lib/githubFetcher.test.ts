import { githubFetch } from '@/lib/githubFetcher';

// Mock fetch globally
global.fetch = jest.fn();

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('githubFetch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.GITHUB_TOKEN;
    process.env.GITHUB_TOKEN = 'test-token-123';
  });

  it('should call fetch with correct URL and headers', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ data: 'test' }),
    };
    mockFetch.mockResolvedValueOnce(mockResponse as Response);

    await githubFetch('https://api.github.com/search/users?q=test');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/search/users?q=test',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token-123',
          Accept: 'application/vnd.github.v3+json',
        }),
      })
    );
  });

  it('should merge custom headers with default headers', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ data: 'test' }),
    };
    mockFetch.mockResolvedValueOnce(mockResponse as Response);

    await githubFetch('https://api.github.com/search/users?q=test', {
      headers: { 'X-Custom': 'custom-value' },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token-123',
          'X-Custom': 'custom-value',
        }),
      })
    );
  });

  it('should return parsed JSON response', async () => {
    const responseData = { items: [{ id: 1, name: 'test' }] };
    const mockResponse = {
      ok: true,
      json: async () => responseData,
    };
    mockFetch.mockResolvedValueOnce(mockResponse as Response);

    const result = await githubFetch(
      'https://api.github.com/search/users?q=test'
    );

    expect(result).toEqual(responseData);
  });

  it('should throw error on non-ok response', async () => {
    const mockResponse = {
      ok: false,
      status: 403,
      statusText: 'Forbidden',
    };
    mockFetch.mockResolvedValueOnce(mockResponse as Response);

    await expect(
      githubFetch('https://api.github.com/search/users?q=test')
    ).rejects.toThrow('GitHub API error: 403 Forbidden');
  });

  it('should handle 404 errors', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found',
    };
    mockFetch.mockResolvedValueOnce(mockResponse as Response);

    await expect(
      githubFetch('https://api.github.com/search/nonexistent')
    ).rejects.toThrow('GitHub API error: 404 Not Found');
  });

  it('should handle 401 Unauthorized', async () => {
    const mockResponse = {
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    };
    mockFetch.mockResolvedValueOnce(mockResponse as Response);

    await expect(
      githubFetch('https://api.github.com/search/users?q=test')
    ).rejects.toThrow('GitHub API error: 401 Unauthorized');
  });

  it('should include custom options in fetch call', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ data: 'test' }),
    };
    mockFetch.mockResolvedValueOnce(mockResponse as Response);

    await githubFetch('https://api.github.com/search/users?q=test', {
      method: 'POST',
      body: 'test body',
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: 'test body',
      })
    );
  });
});
