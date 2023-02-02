import Image from 'next/image';
import Link from 'next/link';

export type PostListItemProps = {
  imageSrc: string;
  title: string;
  description: string;
  url: string;
  tags?: string[];
};

export const PostListItem = ({
  imageSrc,
  title,
  description,
  url,
  tags,
}: PostListItemProps) => {
  return (
    <div
      key={title}
      className="w-full lg:w-2/3 flex shadow-lg rounded-lg bg-white bg-opacity-25"
    >
      <div
        className="h-auto w-48 bg-cover rounded-l-lg text-center overflow-hidden relative"
        style={{
          borderTop: 'solid 1px rgb(156 163 175 / 1)',
          borderBottom: 'solid 1px rgb(156 163 175 / 1)',
          borderLeft: 'solid 1px rgb(156 163 175 / 1)',
        }}
      >
        <Image
          alt={title}
          title={title}
          src={imageSrc}
          fill
          quality={100}
          className="object-cover z-0"
          sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
        />
      </div>
      <div className="border-r border-b border-l border-t w-full border-gray-400 rounded-b-none rounded-r-lg p-2 flex flex-col justify-between leading-normal space-y-2 overflow-hidden">
        <div className="text-gray-900 font-bold md:text-xl truncate">
          <Link href={url}>{title}</Link>
        </div>

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
