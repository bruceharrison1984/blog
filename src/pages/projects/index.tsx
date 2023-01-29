import { GetStaticProps, NextPage } from 'next';
import { RepoMetadata } from '@/types/RepoMetadata';
import { getRepos } from '@/utils/repoFetcher';
import RepoList from '@/components/repoList/RepoList';

type ProjectsPageProps = {
  repos?: RepoMetadata[];
};

const ProjectsPage: NextPage<ProjectsPageProps> = ({ repos }) => (
  <RepoList repos={repos || []} />
);

export const getStaticProps: GetStaticProps = async () => {
  const repoMetadata = await getRepos();
  return {
    props: {
      repos: repoMetadata,
    },
  };
};

export default ProjectsPage;
