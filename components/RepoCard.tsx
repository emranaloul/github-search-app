'use client';

import { ExternalLinkIcon, GitFork, Star } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from './ui/card';
import { GitHubRepository } from '@/types/common';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { useEffect, useState } from 'react';
import { githubFetch } from '@/lib/githubFetcher';
import queryString from 'query-string';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';

const RepoCard = ({ repo }: { repo: GitHubRepository }) => {
  const [languages, setLanguages] = useState<string[]>([]);
  const [forks, setForks] = useState<GitHubRepository[]>([]);
  useEffect(() => {
    const fetchLanguages = async () => {
      if (!repo.languages_url) {
        setLanguages([]);
        return;
      }
      const data = await githubFetch(repo.languages_url);
      const languages = Object.keys(data);
      setLanguages(languages);
    };
    const fetchForks = async () => {
      if (!repo.forks_url) {
        return;
      }
      const query = queryString.stringify({
        per_page: 3,
        sort: 'newest',
      });
      const data = await githubFetch(`${repo.forks_url}?${query}`);
      setForks(data);
    };
    Promise.all([fetchLanguages(), fetchForks()]);
  }, [repo.languages_url, repo.forks_url]);
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-3'>
          <Link
            href={repo.html_url}
            target='_blank'
            className='flex items-center gap-2 truncate hover:underline'
          >
            <span className='truncate overflow-hidden max-w-full text-ellipsis'>
              {repo.full_name}
            </span>
            <ExternalLinkIcon size={14} />
          </Link>
        </CardTitle>
        <div className='flex flex-wrap items-center gap-4 my-2'>
          <div className='flex items-center gap-1 text-sm text-muted-foreground'>
            <Star className='h-4 w-4' />
            {repo.stargazers_count as number}
          </div>
          <div className='flex items-center gap-1 text-sm text-muted-foreground'>
            <GitFork className='h-4 w-4' />
            {repo.forks_count as number}
          </div>
        </div>
      </CardHeader>
      {(repo.description || !!languages?.length) && (
        <CardContent>
          {repo.description && (
            <CardDescription className='space-y-4'>
              <p className='text-sm text-muted-foreground'>
                {repo.description}
              </p>
            </CardDescription>
          )}
          <div
            className={cn('flex gap-2 flex-wrap ', {
              'mt-2': !!repo.description,
            })}
          >
            {languages?.map((lan) => (
              <Badge key={lan}>{lan}</Badge>
            ))}
          </div>
        </CardContent>
      )}
      {!!repo.forks_count && (
        <>
          <hr className='w-[95%] mx-auto' />
          <CardFooter className='flex flex-col w-fit gap-2'>
            <p className='text-muted-foreground'>
              {(repo.forks_count as number) > 3
                ? `Last 3 forks of ${repo.forks_count as number}`
                : `${repo.forks_count as number} forks`}
            </p>
            <div className='flex gap-4'>
              {forks.map((fork) => (
                <Tooltip key={fork.id}>
                  <TooltipTrigger asChild>
                    <Link href={fork.html_url} target='_blank'>
                      <Avatar>
                        <AvatarImage src={fork.owner.avatar_url} />
                        <AvatarFallback>{fork.owner.login}</AvatarFallback>
                      </Avatar>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent> Forked by {fork.owner.login}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default RepoCard;
