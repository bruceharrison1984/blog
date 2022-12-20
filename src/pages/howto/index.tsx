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
        <div
          key={data.title}
          className="card card-bordered bg-base-100 shadow-xl mx-auto w-full md:w-2/3 xl:w-2/5"
        >
          <Link href={data.currentUrl}>
            <div className="card-body">
              <h2 className="card-title">{data.title}</h2>
              <p>{data.metaDesc}</p>
              <time>{data.date}</time>
            </div>
          </Link>
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
