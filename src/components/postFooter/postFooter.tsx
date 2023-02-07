import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';
import { DocumentMetadata } from '@/types/DocumentMetadata';
import Link from 'next/link';

type PostFooterProps = {
  nextPost?: DocumentMetadata;
  previousPost?: DocumentMetadata;
};

export const PostFooter = ({ nextPost, previousPost }: PostFooterProps) => (
  <div className="flex w-full mt-20 pb-10">
    <div className="flex-1 ">
      {previousPost && (
        <Link
          href={previousPost.currentUrl}
          className="shadow-lg rounded-lg bg-white bg-opacity-25 p-3 w-fit border-black border border-opacity-10 whitespace-nowrap prose-sm"
          title={previousPost.title}
        >
          <ChevronDoubleLeftIcon className="h-4 w-4 mr-2 inline-block" />
          Previous
        </Link>
      )}
    </div>
    <div className="flex-0">
      {nextPost && (
        <Link
          href={nextPost?.currentUrl}
          className="shadow-lg rounded-lg bg-white bg-opacity-25 p-3 w-fit border-black border border-opacity-10 whitespace-nowrap prose-sm"
          title={nextPost.title}
        >
          Next
          <ChevronDoubleRightIcon className="h-4 w-4 ml-2 inline-block" />
        </Link>
      )}
    </div>
  </div>
);
