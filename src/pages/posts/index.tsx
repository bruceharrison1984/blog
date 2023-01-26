import { DocumentMetadata } from '@/types/DocumentMetadata';
import { GetStaticProps, NextPage } from 'next';
import { recursivelyGetMetadata } from '@/utils/markdown';
import Image from 'next/image';
import Link from 'next/link';

type PostsPageProps = {
  metadata?: DocumentMetadata[];
};

const PostsPage: NextPage<PostsPageProps> = ({ metadata }) => {
  return (
    <div className="space-y-2">
      {metadata?.map(({ title, headerImage, currentUrl, date, metaDesc }) => (
        <div
          key={title}
          className="card card-bordered lg:card-side bg-base-100 shadow-xl mx-auto w-full md:w-2/3 xl:w-3/5"
        >
          {headerImage && (
            <figure className="p-3">
              <Image
                src={headerImage}
                alt="post_image"
                width={100}
                height={100}
              />
            </figure>
          )}
          <Link href={currentUrl}>
            <div className="card-body">
              <h2 className="card-title">{title}</h2>
              <time className="text-sm">{`${
                date.getUTCMonth() + 1
              }/${date.getUTCDate()}/${date.getUTCFullYear()}`}</time>
              <p className="prose">{metaDesc}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { metadata: await recursivelyGetMetadata('posts') },
  };
};

export default PostsPage;
