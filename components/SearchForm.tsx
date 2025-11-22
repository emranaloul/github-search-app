'use client';

import { Search } from 'lucide-react';
import SearchTypeSelect from './SearchTypeSelect';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useSearchContext } from '@/context/SearchContext';

const SearchForm = () => {
  const { setSearchQuery } = useSearchContext();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (!query.trim()) return;
    setSearchQuery(query);
  };
  return (
    <div className='space-y-6 w-full'>
      <SearchTypeSelect />
      <form className='flex w-full space-x-2' onSubmit={onSubmit}>
        <Input
          type='text'
          name='search'
          placeholder='Search GitHub...'
          className='grow w-1/2  rounded-md border border-zinc-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50'
          required
        />
        <Button
          type='submit'
          className='rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none'
        >
          <Search className='h-5 w-5' />
        </Button>
      </form>
    </div>
  );
};

export default SearchForm;
