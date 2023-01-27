import { DocumentMetadata } from '@/types/DocumentMetadata';
import { GetStaticProps, NextPage } from 'next';
import { recursivelyGetMetadata } from '@/utils/markdown';
import PostList from '@/components/postList/PostList';

type PostsPageProps = {
  metadata?: DocumentMetadata[];
};

const PostsPage: NextPage<PostsPageProps> = ({ metadata }) => (
  <PostList posts={metadata} />
);

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { metadata: await recursivelyGetMetadata('posts') },
  };
};

export default PostsPage;
