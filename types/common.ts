export type SearchType = 'users' | 'repositories';

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  [key: string]: unknown;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: GitHubUser;
  html_url: string;
  description: string;
  languages_url?: string | null;
  forks_url?: string | null;
  [key: string]: unknown;
}
export interface GitHubSearchResponse<T> {
  total_count: number;
  incomplete_results: boolean;
  items: T[];
}

export interface Fork {
  id: number;
  name: string;
  full_name: string;
  owner: GitHubUser;
  html_url: string;
  description: string;
  [key: string]: unknown;
}
