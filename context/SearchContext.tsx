'use client';

import {
  GitHubRepository,
  GitHubSearchResponse,
  GitHubUser,
  SearchType,
} from '@/types/common';
import { createContext, useContext, useMemo, useState } from 'react';

export const SearchContext = createContext<{
  searchQuery: string;
  searchType: 'repositories' | 'users';
  searchResults?: GitHubSearchResponse<GitHubUser | GitHubRepository>[];
  setSearchQuery: (query: string) => void;
  setSearchType: (type: SearchType) => void;
}>({
  searchQuery: '',
  searchType: 'repositories',
  searchResults: [],
  setSearchQuery: () => {},
  setSearchType: () => {},
});

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchType>('repositories');
  const value = useMemo(
    () => ({
      searchQuery,
      searchType,
      setSearchQuery,
      setSearchType,
    }),
    [searchQuery, searchType]
  );
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};
