import {
  GetStaticPaths,
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from 'next';

type HowToPageProps = {
  title: string;
};

const HowToPage: NextPage<HowToPageProps> = ({ title }) => {
  return <>{title}</>;
};

export const getStaticProps: GetStaticProps<any, { slug: string }> = async ({
  params,
}) => {
  return {
    props: { title: params?.slug },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const staticPaths: GetStaticPathsResult = {
    paths: ['/howto/1', '/howto/2', '/howto/3'],
    fallback: false,
  };
  return staticPaths;
};

export default HowToPage;
