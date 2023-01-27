import { GetStaticProps, NextPage } from 'next';
import { ListItemProps } from '@/components/itemList/Item';
import { recursivelyGetMetadata } from '@/utils/markdown';
import ItemList from '@/components/itemList/ItemList';

type PostsPageProps = {
  posts?: ListItemProps[];
};

const PostsPage: NextPage<PostsPageProps> = ({ posts }) => (
  <ItemList items={posts || []} />
);

export const getStaticProps: GetStaticProps = async () => {
  const postMetadata = await recursivelyGetMetadata('posts', 'content');
  return {
    props: {
      posts: postMetadata.map<ListItemProps>((x) => ({
        title: x.title,
        imageSrc: x.headerImage!,
        description: x.metaDesc,
        url: x.currentUrl,
      })),
    },
  };
};

export default PostsPage;
