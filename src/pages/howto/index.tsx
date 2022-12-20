import { DocumentMetadata } from '@/types/DocumentMetadata';
import { GetStaticProps, NextPage } from 'next';
import { recursivelyGetMetadata } from '@/utils/markdown';
import Link from 'next/link';

type HowToPageProps = {
  metadata?: DocumentMetadata[];
};

const HowToPage: NextPage<HowToPageProps> = ({ metadata }) => {
  return (
    <div className="space-y-2">
      {metadata?.map((data) => (
        <div key={data.title} className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <Link href={data.currentUrl}>{data.title}</Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: { metadata: await recursivelyGetMetadata('howto') },
  };
};

export default HowToPage;
