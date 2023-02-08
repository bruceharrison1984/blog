import { GetStaticProps, NextPage } from 'next';
import { RepoMetadata } from '@/types/RepoMetadata';
import { getRepos } from '@/utils/repoFetcher';
import Head from 'next/head';
import RepoList from '@/components/repoList/RepoList';

type ProjectsPageProps = {
  repos?: RepoMetadata[];
};

const ProjectsPage: NextPage<ProjectsPageProps> = ({ repos }) => (
  <>
    <Head>
      <title>projects | bruce lee harrison</title>
    </Head>
    <div className="mb-10">
      <RepoList repos={repos || []} />
    </div>
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
