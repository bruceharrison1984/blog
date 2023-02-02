import { PostHeading } from '@/types/PostHeading';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export const TableOfContents = () => {
  const [headings, setHeadings] = useState<PostHeading[]>([]);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('h2, h3, h4')).map(
      (elem) => ({
        id: elem.id,
        text: elem.textContent!,
        level: Number(elem.nodeName.charAt(1)) - 2,
      })
    );
    setHeadings(elements);
  }, []);

  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element)
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const makeListItem = (heading: PostHeading) => (
    <li key={heading.id}>
      <Link
        href={`#${heading.id}`}
        onClick={(e) => {
          e.preventDefault();
          scrollToElement(heading.id);
        }}
      >
        <span>{heading.text}</span>
      </Link>
    </li>
  );

  return (
    <>
      {headings.length ? (
        <nav className="invisible md:visible">
          <div className="shadow-lg rounded-lg bg-white bg-opacity-25 p-5">
            <ol>{headings.map((heading) => makeListItem(heading))}</ol>
          </div>
        </nav>
      ) : undefined}
    </>
  );
};
