import { GetStaticProps, NextPage } from 'next';
import { PostListItemProps } from '@/components/postList/PostListItem';
import { RepoMetadata } from '@/types/RepoMetadata';
import { getRepos } from '@/utils/repoFetcher';
import { recursivelyGetMetadata } from '@/utils/markdown';
import PostList from '@/components/postList/PostList';
import RepoList from '@/components/repoList/RepoList';

type HomePageProps = {
  posts?: PostListItemProps[];
  repos?: RepoMetadata[];
};

const Home: NextPage<HomePageProps> = ({ posts, repos }) => {
  return (
    <div>
      <PostList items={posts || []} />
      <RepoList repos={repos || []} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const postMetadata = await recursivelyGetMetadata('posts', 'content', 3);
  const repoMetadata = await getRepos(3);

  return {
    props: {
      posts: postMetadata.map<PostListItemProps>((x) => ({
        title: x.title,
        imageSrc: x.headerImage!,
        description: x.metaDesc,
        url: x.currentUrl,
        tags: x.tags,
      })),
      repos: repoMetadata,
    },
  };
};

export default Home;
