import { githubFetch } from '@/lib/githubFetcher';
import {
  GitHubRepository,
  GitHubSearchResponse,
  GitHubUser,
  SearchType,
} from '@/types/common';
import queryString from 'query-string';
import useSWRInfinite from 'swr/infinite';
import { useState } from 'react';

const ITEMS_PER_PAGE = 10;

export const useGithubSearch = (query: string, searchType: SearchType) => {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

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

  // Flatten all pages into a single array of items
  const mergedItems = data ? data.flatMap((p) => p.items ?? []) : [];

  // Whether the last fetched page is shorter than the page size
  const hasReachedEnd = (data?.at(-1)?.items?.length ?? 0) < ITEMS_PER_PAGE;

  // Items that caller should render (internal item-level control)
  const visibleItems = mergedItems.slice(0, visibleCount);

  // Helper to increase the visible item count. This will fetch pages as needed
  // until we have enough items or the API indicates there are no more pages.
  const loadMoreItems = async (count = ITEMS_PER_PAGE) => {
    const target = visibleCount + count;

    // If we already have enough items in memory, just increase the visible count
    if (mergedItems.length >= target) {
      setVisibleCount(target);
      return;
    }

    // Otherwise fetch more pages until we reach target or reach the end
    let currentMerged = mergedItems;
    let nextSize = size;
    while (currentMerged.length < target) {
      // request next page
      nextSize += 1;
      const newData = (await setSize(nextSize)) as
        | GitHubSearchResponse<GitHubUser | GitHubRepository>[]
        | undefined;
      currentMerged = newData
        ? newData.flatMap((p) => p.items ?? [])
        : currentMerged;

      // stop if last page is short (no more items on server)
      if ((newData?.at(-1)?.items?.length ?? 0) < ITEMS_PER_PAGE) break;
      // defensive bail-out to avoid infinite loops
      if (nextSize > size + 10) break;
    }

    setVisibleCount(Math.min(target, currentMerged.length));
  };

  return {
    data,
    error,
    size,
    setSize,
    isValidating,
    isLoading,
    hasReachedEnd,
    // new: item-level control
    mergedItems,
    visibleItems,
    visibleCount,
    setVisibleCount,
    loadMoreItems,
  };
};
