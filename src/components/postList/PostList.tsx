import { DocumentMetadata } from '@/types/DocumentMetadata';
import Link from 'next/link';

type PostListProps = {
  metadata?: DocumentMetadata[];
};

const PostList = ({ metadata }: PostListProps) => (
  <div className="space-y-2 flex flex-col items-center">
    {metadata?.map(({ headerImage, title, metaDesc, currentUrl }) => (
      <div key={title} className="w-full lg:w-2/3 flex shadow-lg rounded-lg">
        <div
          className="h-auto w-48 bg-cover rounded-l-lg text-center overflow-hidden"
          style={{ backgroundImage: `url('${headerImage}')` }}
          title="Woman holding a mug"
        />
        <div className="border-r border-b border-l-0 border-t w-full border-gray-400 bg-white rounded-b-none rounded-r-lg p-4 flex flex-col justify-between leading-normal">
          <div className="mb-8">
            <div className="text-gray-900 font-bold text-xl mb-2">
              <Link href={currentUrl}>{title}</Link>
            </div>
            <p className="text-gray-700 text-base">{metaDesc}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default PostList;
