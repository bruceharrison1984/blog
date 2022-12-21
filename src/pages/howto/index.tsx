import { DocumentMetadata } from '@/types/DocumentMetadata';
import { GetStaticProps, NextPage } from 'next';
import { recursivelyGetMetadata } from '@/utils/markdown';
import Image from 'next/image';
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
          className="card card-bordered lg:card-side bg-base-100 shadow-xl mx-auto w-full md:w-2/3 xl:w-3/5"
        >
          <figure className="p-3">
            <Image
              src="/images/azure_functions.png"
              alt="azure function logo"
              width={100}
              height={100}
            />
          </figure>
          <Link href={data.currentUrl}>
            <div className="card-body">
              <h2 className="card-title">{data.title}</h2>
              <time className="text-sm">{data.date}</time>
              <p className="prose">{data.metaDesc}</p>
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
