import Image from 'next/image';
import Link from 'next/link';

export type PostListItemProps = {
  imageSrc: string;
  title: string;
  description: string;
  url: string;
  tags?: string[];
  publishDate: Date;
  priorityImage?: boolean;
};

export const PostListItem = ({
  imageSrc,
  title,
  description,
  url,
  tags,
  publishDate,
  priorityImage,
}: PostListItemProps) => {
  const serverSafeDate = `${publishDate.getUTCMonth() + 1}/${
    publishDate.getUTCDate() + 1
  }/${publishDate.getUTCFullYear()}`;
  return (
    <div
      key={title}
      className="w-full lg:w-2/3 flex flex-col md:flex-row shadow-lg rounded-lg bg-white bg-opacity-25 relative"
    >
      <div
        className="h-24 md:h-auto md:w-48 bg-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none text-center overflow-hidden relative"
        style={{
          borderTop: 'solid 1px rgb(0 0 0 / .1)',
          borderBottom: 'solid 1px rgb(0 0 0 / .1)',
          borderLeft: 'solid 1px rgb(0 0 0 / .1)',
        }}
      >
        <Image
          alt={title}
          title={title}
          src={imageSrc}
          fill
          quality={100}
          className="object-cover z-0"
          sizes="(max-width: 768px) 25vw,
                 (max-width: 1200px) 50vw, 
                 75vw"
          priority={priorityImage}
        />
      </div>
      <div className="md:border-r md:border-b md:border-l md:border-t w-full border-black border-opacity-10 rounded-b-none rounded-r-lg p-2 flex flex-col justify-between leading-normal space-y-2 overflow-hidden">
        <div className="text-gray-900  md:text-xl truncate">
          <Link href={url} className="underline font-bold">
            {title}
          </Link>
        </div>
        <div className="text-xs no-underline">{serverSafeDate}</div>

        <p className="text-gray-700 text-base">{description}</p>

        <div>
          {tags?.map((tag) => (
            <span
              key={tag}
              className="bg-blue-300 rounded-full px-3 text-sm font-semibold text-gray-700 mr-2 hidden md:inline-block"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
