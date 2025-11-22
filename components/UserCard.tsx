import { ExternalLinkIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { GitHubUser } from '@/types/common';

const UserCard = ({ user }: { user: GitHubUser }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-3'>
          <Image
            src={user.avatar_url}
            width={50}
            height={50}
            alt={user.login}
            className='rounded-full'
          />
          <Link
            href={user.html_url}
            target='_blank'
            className='flex items-center gap-2 truncate hover:underline'
          >
            <span className='truncate overflow-hidden max-w-[170px] text-ellipsis'>
              {user.login}
            </span>
            <ExternalLinkIcon size={14} />
          </Link>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default UserCard;
