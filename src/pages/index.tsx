import { DocumentMetadata } from '@/types/DocumentMetadata';
import { GetStaticProps, NextPage } from 'next';
import { recursivelyGetMetadata } from '@/utils/markdown';
import PostList from '@/components/postList/PostList';

type HomePageProps = {
  posts?: DocumentMetadata[];
};

const Home: NextPage<HomePageProps> = ({ posts }) => {
  return (
    <div>
      <PostList posts={posts} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { posts: await recursivelyGetMetadata('posts', 'content', 3) },
  };
};

export default Home;
