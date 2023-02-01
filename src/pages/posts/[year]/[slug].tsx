import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { MarkdownNextImage } from '@/utils/MarkdownNextImage';
import { TableOfContents } from '@/components/tableOfContents/TableOfContents';
import {
  createPageFromMarkdown,
  recursivelyGetMarkdownFiles,
} from '@/utils/markdown';
import { getMDXComponent } from 'mdx-bundler/client';
import { useMemo } from 'react';
import Head from 'next/head';

type HowToPageProps = {
  metadata: Record<string, string>;
  pageContent: string;
};

const HowToPage: NextPage<HowToPageProps> = ({ metadata, pageContent }) => {
  const Component = useMemo(() => getMDXComponent(pageContent), [pageContent]);
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
      </Head>
      <div className="md:flex justify-center">
        <article className="prose-sm md:prose flex-1 md:mr-5">
          <Component components={{ img: MarkdownNextImage }} />
        </article>
        <TableOfContents />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<
  any,
  { slug: string; year: string }
> = async ({ params }) => {
  return {
    props: await createPageFromMarkdown('posts', params!.year, params!.slug),
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: await recursivelyGetMarkdownFiles('posts'),
  fallback: false,
});

export default HowToPage;
