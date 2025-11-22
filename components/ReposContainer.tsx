import { GitHubRepository } from '@/types/common';
import RepoCard from './RepoCard';

const ReposContainer = ({ data }: { data: GitHubRepository[] }) => {
  return (
    <div className='grid gap-4 md:grid-cols-1 w-full'>
      {data?.map((repo) => (
        <RepoCard repo={repo} key={repo.id} />
      ))}
    </div>
  );
};

export default ReposContainer;
