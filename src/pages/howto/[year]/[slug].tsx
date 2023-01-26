import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { TableOfContents } from '@/components/tableOfContents/TableOfContents';
import {
  createPageFromMarkdown,
  recursivelyGetMarkdownFiles,
} from '@/utils/markdown';
import { getMDXComponent } from 'mdx-bundler/client';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

type HowToPageProps = {
  metadata: Record<string, string>;
  pageContent: string;
};

export type Heading = {
  id: string;
  text: string;
  level: number;
};

const HowToPage: NextPage<HowToPageProps> = ({ metadata, pageContent }) => {
  const Component = React.useMemo(
    () => getMDXComponent(pageContent),
    [pageContent]
  );

  const [headings, setHeadings] = useState<Heading[]>([]);

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

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
      </Head>
      <div className="flex justify-center">
        <article className="prose-sm md:prose">
          <Component />
        </article>
        <TableOfContents headings={headings} />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<
  any,
  { slug: string; year: string }
> = async ({ params }) => {
  return {
    props: await createPageFromMarkdown('howto', params!.year, params!.slug),
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: await recursivelyGetMarkdownFiles('howto'),
  fallback: false,
});

export default HowToPage;
