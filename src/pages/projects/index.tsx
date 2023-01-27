import { GetStaticProps, NextPage } from 'next';
import { ListItemProps } from '@/components/itemList/Item';
import { getRepos } from '@/utils/repoFetcher';
import ItemList from '@/components/itemList/ItemList';

type ProjectsPageProps = {
  posts?: ListItemProps[];
};

const ProjectsPage: NextPage<ProjectsPageProps> = ({ posts }) => (
  <ItemList items={posts || []} />
);

export const getStaticProps: GetStaticProps = async () => {
  const postMetadata = await getRepos();
  return {
    props: {
      posts: postMetadata.map<ListItemProps>((x) => ({
        title: x.full_name,
        imageSrc: '/assets/github_logo.png',
        description: x.description,
        url: x.html_url,
      })),
    },
  };
};

export default ProjectsPage;
