import { RepoMetadata } from '@/types/RepoMetadata';

export const getRepos = async (limit?: number) => {
  const getGithubRepos = await fetch(
    'https://api.github.com/users/bruceharrison1984/repos?affiliation=owner&direction=asc'
  );

  const githubRepos = (await getGithubRepos.json()) as RepoMetadata[];
  const repoResults = githubRepos.sort(
    (x, y) => y.stargazers_count - x.stargazers_count
  );

  return repoResults.slice(0, limit || repoResults.length);
};
