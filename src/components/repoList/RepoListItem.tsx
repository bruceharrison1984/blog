import { RepoMetadata } from '@/types/RepoMetadata';
import { StarIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

export const RepoListItem = ({
  full_name,
  html_url,
  stargazers_count,
  description,
}: RepoMetadata) => {
  return (
    <div key={full_name} className="w-full lg:w-2/3 flex shadow-lg rounded-lg">
      <div
        className="bg-cover rounded-l-lg flex-shrink-0"
        style={{
          borderTop: 'solid 1px rgb(156 163 175 / 1)',
          borderBottom: 'solid 1px rgb(156 163 175 / 1)',
          borderLeft: 'solid 1px rgb(156 163 175 / 1)',
        }}
      >
        <div className="flex h-full">
          <Image
            alt={'github_logo'}
            src={'/assets/github_logo.png'}
            height={48}
            width={48}
            quality={100}
            className="object-none object-center"
          />
        </div>
      </div>
      <div className="border-r border-b border-t w-full border-gray-400 bg-white rounded-b-none rounded-r-lg p-2 justify-between leading-normal flex-shrink overflow-hidden space-y-2">
        <div className="text-gray-900 font-bold md:text-xl truncate">
          <Link href={html_url}>{full_name}</Link>
        </div>

        <p className="text-gray-700 text-base justify-center">{description}</p>

        <span className="flex items-center text-gray-700">
          <StarIcon className="h-4 w-4 mr-1 inline-block" aria-hidden="true" />
          {stargazers_count}
        </span>
      </div>
    </div>
  );
};
