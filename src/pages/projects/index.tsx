import { GetStaticProps, NextPage } from 'next';
import { RepoMetadata } from '@/types/RepoMetadata';
import { getRepos } from '@/utils/repoFetcher';
import RepoList from '@/components/repoList/RepoList';

type ProjectsPageProps = {
  repos?: RepoMetadata[];
};

const ProjectsPage: NextPage<ProjectsPageProps> = ({ repos }) => (
  <>
    <h2 className="w-full lg:w-2/3 inline-block sm:hidden font-bold mb-2">
      Projects
    </h2>
    <RepoList repos={repos || []} />
  </>
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
