import { SearchType } from '@/types/common';
import { SearchX } from 'lucide-react';

const NoResultsFound = ({ searchType }: { searchType: SearchType }) => {
  return (
    <div className='flex flex-col items-center justify-center mt-4 mx-auto'>
      <SearchX className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
      <p className='text-muted-foreground'>No {searchType} results found.</p>
    </div>
  );
};

export default NoResultsFound;
