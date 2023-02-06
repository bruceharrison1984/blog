import { PostHeading } from '@/types/PostHeading';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export const TableOfContents = () => {
  const [headings, setHeadings] = useState<PostHeading[]>([]);
  const [nestedHeadings, setNestedHeadings] = useState<PostHeading[][]>([]);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('h2, h3, h4')).map(
      (elem) => ({
        id: elem.id,
        text: elem.textContent!,
        level: Number(elem.nodeName.charAt(1)) - 2,
      })
    );
    const nestedElements: PostHeading[][] = [];
    for (let index = 0; index < elements.length; index++) {
      const element = elements[index];
      if (element.level === 0) {
        nestedElements.push([element]);
        continue;
      }
      nestedElements[nestedElements.length - 1].push(element);
    }
    setNestedHeadings(nestedElements);
    setHeadings(elements);
  }, []);

  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element)
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const makeNestedListItem = (headings: PostHeading[]) => {
    return (
      <li key={headings[0].id}>
        <Link
          href={`#${headings[0].id}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToElement(headings[0].id);
          }}
        >
          <span>{headings[0].text}</span>
        </Link>
        {headings.slice(1).map((x) => makeListItem(x))}
      </li>
    );
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
        <span className="ml-3">{heading.text}</span>
      </Link>
    </li>
  );

  return (
    <nav className="invisible md:visible flex-1">
      {headings.length ? (
        <div className="absolute shadow-lg rounded-lg bg-white bg-opacity-25 p-5 w-fit border-black border border-opacity-10">
          <ol>
            {nestedHeadings.map((headings) => makeNestedListItem(headings))}
          </ol>
        </div>
      ) : undefined}
    </nav>
  );
};
