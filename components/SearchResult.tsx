'use client';

import { useEffect } from 'react';
import { useSearchContext } from '@/context/SearchContext';
import { useGithubSearch } from '@/hooks/useGithubSearch';
import { GitHubRepository, GitHubUser } from '@/types/common';
import { Loader2, SearchX } from 'lucide-react';
import ReposContainer from './ReposContainer';
import UsersContainer from './UsersContainer';

const SearchResult = () => {
  const { searchQuery, searchType } = useSearchContext();
  const { data, hasReachedEnd, size, setSize, isValidating } = useGithubSearch(
    searchQuery,
    searchType
  );

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 220
      ) {
        if (!isValidating && !hasReachedEnd) {
          setSize(size + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isValidating, hasReachedEnd, size, setSize]);

  if (isValidating && !data) {
    return (
      <div className='flex items-center justify-center h-full w-full'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    );
  }
  if (!data) {
    return null;
  }

  const allItems = data.flatMap((page) => page.items);

  if (allItems.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center mt-4 mx-auto'>
        <SearchX className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
        <p className='text-muted-foreground'>No {searchType} results found.</p>
      </div>
    );
  }
  return (
    <>
      <h6 className='text-2xl font-semibold'>
        {data.at(-1)?.total_count?.toLocaleString()}&nbsp;
        {searchType === 'users' ? 'Users' : 'Repositories'} found
      </h6>
      {searchType === 'users' ? (
        <UsersContainer data={allItems as GitHubUser[]} />
      ) : (
        <ReposContainer data={allItems as GitHubRepository[]} />
      )}
      {isValidating && (
        <div className='flex items-center justify-center mt-4 w-full'>
          <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
          &nbsp; loading more...
        </div>
      )}
    </>
  );
};

export default SearchResult;
