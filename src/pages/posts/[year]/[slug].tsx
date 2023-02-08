import { DocumentMetadata } from '@/types/DocumentMetadata';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { MarkdownNextImage } from '@/components/markdownNextImage/MarkdownNextImage';
import { PostFooter } from '@/components/postFooter/postFooter';
import { TableOfContents } from '@/components/tableOfContents/TableOfContents';
import {
  compileAndCacheMarkdown,
  getCachedPage,
} from '@/utils/markdownCompiler';
import {
  createPageFromMarkdown,
  recursivelyGetMarkdownFiles,
} from '@/utils/markdown';
import { getMDXComponent } from 'mdx-bundler/client';
import { getPosts } from '@/utils/postFetcher';
import { useMemo } from 'react';
import Head from 'next/head';

type HowToPageProps = {
  pageContent: string;
  postMetadata: DocumentMetadata;
};

const HowToPage: NextPage<HowToPageProps> = ({ pageContent, postMetadata }) => {
  const Component = useMemo(() => getMDXComponent(pageContent), [pageContent]);
  const pageTitle = `${postMetadata.title} | bruce lee harrison`;
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className="md:flex justify-center">
        <div className="flex-1">{/* empty div for layout */}</div>
        <article className="flex-1 prose-sm md:prose md:mr-5">
          <Component components={{ img: MarkdownNextImage }} />
          <PostFooter
            nextPost={postMetadata.nextPost}
            previousPost={postMetadata.previousPost}
          />
        </article>
        <TableOfContents />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<
  any,
  { year: string; slug: string }
> = async (props) => {
  const { params } = props;
  const pageContent = await getCachedPage(
    params!.slug,
    Number.parseInt(params!.year)
  );

  return {
    props: {
      pageContent: pageContent?.pageContent,
      postMetadata: pageContent?.metadata,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const processedMarkdown = await compileAndCacheMarkdown();

  return {
    paths: processedMarkdown.map((x) => x.url),
    fallback: false,
  };
};

export default HowToPage;
