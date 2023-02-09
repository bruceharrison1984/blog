import { GetStaticProps, NextPage } from 'next';
import { PostListItemProps } from '@/components/postList/PostListItem';
import { getPosts } from '@/utils/markdownCompiler';
import Head from 'next/head';
import PostList from '@/components/postList/PostList';

type PostsPageProps = {
  posts?: PostListItemProps[];
};

const PostsPage: NextPage<PostsPageProps> = ({ posts }) => (
  <>
    <Head>
      <title>posts | bruce lee harrison</title>
    </Head>
    <div className="mb-10">
      <PostList items={posts || []} />
    </div>
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  const postMetadata = await getPosts();
  return {
    props: {
      posts: postMetadata.map<PostListItemProps>((x) => ({
        title: x.metadata.title,
        imageSrc: x.metadata.headerImage!,
        description: x.metadata.metaDesc,
        url: x.url,
        tags: x.metadata.tags,
        publishDate: new Date(x.metadata.date),
      })),
    },
  };
};

export default PostsPage;
