import Image from 'next/image';
import Link from 'next/link';

export type ListItemProps = {
  imageSrc: string;
  title: string;
  description: string;
  url: string;
  tags?: string[];
};

export const ListItem = ({
  imageSrc,
  title,
  description,
  url,
  tags,
}: ListItemProps) => {
  return (
    <div key={title} className="w-full lg:w-2/3 flex shadow-lg rounded-lg">
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
          src={imageSrc}
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
        />
      </div>
      <div className="border-r border-b border-l-0 border-t w-full border-gray-400 bg-white rounded-b-none rounded-r-lg p-4 flex flex-col justify-between leading-normal">
        <div className="mb-4">
          <div className="text-gray-900 font-bold text-xl mb-2">
            <Link href={url}>{title}</Link>
          </div>
          <p className="text-gray-700 text-base">{description}</p>
        </div>
        <div>
          {tags?.map((tag) => (
            <span
              key={tag}
              className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
