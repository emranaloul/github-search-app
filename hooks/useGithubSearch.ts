import { githubFetch } from '@/lib/githubFetcher';
import {
  GitHubRepository,
  GitHubSearchResponse,
  GitHubUser,
  SearchType,
} from '@/types/common';
import queryString from 'query-string';
import useSWRInfinite from 'swr/infinite';

const ITEMS_PER_PAGE = 10;

export const useGithubSearch = (query: string, searchType: SearchType) => {
  const getKey = (
    pageIndex: number,
    previousPageData: GitHubSearchResponse<unknown> | null
  ) => {
    if ((previousPageData && !previousPageData.items?.length) || !query.trim())
      return null;
    const urlQuery = queryString.stringify(
      {
        q: query,
        per_page: ITEMS_PER_PAGE,
        page: pageIndex + 1,
      },
      { skipNull: true }
    );

    return `https://api.github.com/search/${searchType}?${urlQuery}`;
  };
  const { data, error, size, setSize, isValidating } = useSWRInfinite<
    GitHubSearchResponse<GitHubUser | GitHubRepository>
  >(getKey, githubFetch, {
    revalidateAll: false,
    persistSize: true,
  });

  const isLoading = !data && !error;

  // Whether the last fetched page is shorter than the page size
  const hasReachedEnd = (data?.at(-1)?.items?.length ?? 0) < ITEMS_PER_PAGE;

  return {
    data,
    error,
    size,
    setSize,
    isValidating,
    isLoading,
    hasReachedEnd,
  };
};
