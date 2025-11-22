import UserCard from './UserCard';
import { GitHubUser } from '@/types/common';

const UsersContainer = ({ data }: { data: GitHubUser[] }) => {
  return (
    <div className='grid gap-4 md:grid-cols-2 w-full'>
      {data?.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UsersContainer;
