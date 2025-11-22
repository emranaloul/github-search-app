import { Button } from './ui/button';
import { useSearchContext } from '@/context/SearchContext';

const SearchTypeSelect = () => {
  const { searchType, setSearchType } = useSearchContext();
  return (
    <div className='flex gap-3'>
      <Button
        type='button'
        variant={searchType === 'repositories' ? 'default' : 'outline'}
        onClick={() => setSearchType('repositories')}
      >
        Repositories
      </Button>
      <Button
        type='button'
        variant={searchType === 'users' ? 'default' : 'outline'}
        onClick={() => setSearchType('users')}
      >
        Users
      </Button>
    </div>
  );
};

export default SearchTypeSelect;
