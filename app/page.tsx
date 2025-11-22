import SearchForm from '@/components/SearchForm';
import SearchResult from '@/components/SearchResult';

export default function Home() {
  return (
    <main className='flex  h-full justify-center bg-zinc-50 font-sans dark:bg-black py-4 flex-1'>
      <div className='flex gap-10 w-full h-full max-w-3xl flex-col items-center justify-between  bg-white dark:bg-black sm:items-start'>
        <div className=' max-w-4xl space-y-4'>
          <div className='space-y-2'>
            <h2 className='text-3xl font-bold'>Search Github</h2>
            <p className='text-muted-foreground'>
              Search for GitHub users and repositories using the search bar
            </p>
          </div>
        </div>
        <SearchForm />
        <SearchResult />
      </div>
    </main>
  );
}
