import { Heading } from '@/pages/howto/[year]/[slug]';
import Link from 'next/link';

export const TableOfContents = ({ headings }: { headings: Heading[] }) => {
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const makeListItem = (heading: Heading) => (
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
    <nav className="flex-none invisible md:visible">
      <span className="underline ">Table Of Contents</span>
      <ol>{headings.map((heading) => makeListItem(heading))}</ol>
    </nav>
  );
};
