'use client';

import { useEffect } from 'react';
import { useSearchContext } from '@/context/SearchContext';
import { useGithubSearch } from '@/hooks/useGithubSearch';
import { GitHubRepository, GitHubUser } from '@/types/common';
import ReposContainer from './ReposContainer';
import UsersContainer from './UsersContainer';
import NoResultsFound from './NoResultsFound';
import Loader from './Loader';

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
    return <Loader />;
  }
  if (!data) {
    return null;
  }

  const allItems = data.flatMap((page) => page.items);

  if (allItems.length === 0) {
    return <NoResultsFound searchType={searchType} />;
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
      {isValidating && <Loader text='loading more...' />}
    </>
  );
};

export default SearchResult;
