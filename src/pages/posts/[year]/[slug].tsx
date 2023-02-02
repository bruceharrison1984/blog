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
        <div className="flex-1">{/* empty div for layout */}</div>
        <article className="flex-1 prose-sm md:prose md:mr-5">
          <Component components={{ img: MarkdownNextImage }} />
        </article>
        <TableOfContents />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<any, any> = async (props) => {
  const { params } = props;

  return {
    props: await createPageFromMarkdown('posts', params!.year, params!.slug),
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: await recursivelyGetMarkdownFiles('posts'),
  fallback: false,
});

export default HowToPage;
