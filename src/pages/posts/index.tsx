import { GetStaticProps, NextPage } from 'next';
import { PostListItemProps } from '@/components/postList/PostListItem';
import { getPosts } from '@/utils/postFetcher';
import PostList from '@/components/postList/PostList';

type PostsPageProps = {
  posts?: PostListItemProps[];
};

const PostsPage: NextPage<PostsPageProps> = ({ posts }) => (
  <div className="mb-10">
    <PostList items={posts || []} />
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const postMetadata = await getPosts('posts', 'content');
  return {
    props: {
      posts: postMetadata.map<PostListItemProps>((x) => ({
        title: x.title,
        imageSrc: x.headerImage!,
        description: x.metaDesc,
        url: x.currentUrl,
        tags: x.tags,
        publishDate: x.date,
      })),
    },
  };
};

export default PostsPage;
