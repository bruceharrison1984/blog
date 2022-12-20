import { DocumentMetadata } from '@/types/DocumentMetadata';
import { GetStaticProps, NextPage } from 'next';
import { recursivelyGetMetadata } from '@/utils/markdown';

type HowToPageProps = {
  metadata?: DocumentMetadata[];
};

const HowToPage: NextPage<HowToPageProps> = ({ metadata }) => {
  return <div>{JSON.stringify(metadata)}</div>;
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: { metadata: await recursivelyGetMetadata('howto') },
  };
};

export default HowToPage;
