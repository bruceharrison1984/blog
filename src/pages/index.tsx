import { GetStaticProps, NextPage } from 'next';
import { ListItemProps } from '@/components/itemList/Item';
import { recursivelyGetMetadata } from '@/utils/markdown';
import ItemList from '@/components/itemList/ItemList';

type HomePageProps = {
  posts?: ListItemProps[];
};

const Home: NextPage<HomePageProps> = ({ posts }) => {
  return (
    <div>
      <ItemList items={posts || []} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const postMetadata = await recursivelyGetMetadata('posts', 'content', 3);
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

export default Home;
