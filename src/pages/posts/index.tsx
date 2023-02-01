import { GetStaticProps, NextPage } from 'next';
import { PostListItemProps } from '@/components/postList/PostListItem';
import { recursivelyGetMetadata } from '@/utils/markdown';
import PostList from '@/components/postList/PostList';

type PostsPageProps = {
  posts?: PostListItemProps[];
};

const PostsPage: NextPage<PostsPageProps> = ({ posts }) => (
  <PostList items={posts || []} />
);

export const getStaticProps: GetStaticProps = async () => {
  const postMetadata = await recursivelyGetMetadata('posts', 'content');
  return {
    props: {
      posts: postMetadata.map<PostListItemProps>((x) => ({
        title: x.title,
        imageSrc: x.headerImage!,
        description: x.metaDesc,
        url: x.currentUrl,
        tags: x.tags,
      })),
    },
  };
};

export default PostsPage;
