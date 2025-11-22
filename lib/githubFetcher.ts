'use server';
export async function githubFetch(url: string, options: RequestInit = {}) {
  console.log('🚀 ~ githubFetch ~ url:', url);
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
