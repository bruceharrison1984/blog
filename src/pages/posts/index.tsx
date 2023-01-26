import { DocumentMetadata } from '@/types/DocumentMetadata';
import { GetStaticProps, NextPage } from 'next';
import { recursivelyGetMetadata } from '@/utils/markdown';
import Image from 'next/image';
import Link from 'next/link';

type PostsPageProps = {
  metadata?: DocumentMetadata[];
};

const PostsPage: NextPage<PostsPageProps> = ({ metadata }) => (
  <div className="space-y-2 flex flex-col items-center">
    {metadata?.map(({ headerImage, title, metaDesc }) => (
      <div key={title} className="w-full lg:w-2/3 flex">
        <div
          className="h-auto w-48 bg-cover rounded-l text-center overflow-hidden"
          style={{ backgroundImage: `url('${headerImage}')` }}
          title="Woman holding a mug"
        />
        <div className="border-r border-b border-l-0 border-t border-gray-400 bg-white rounded-b-none rounded-r p-4 flex flex-col justify-between leading-normal">
          <div className="mb-8">
            <div className="text-gray-900 font-bold text-xl mb-2">{title}</div>
            <p className="text-gray-700 text-base">{metaDesc}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { metadata: await recursivelyGetMetadata('posts') },
  };
};

export default PostsPage;
