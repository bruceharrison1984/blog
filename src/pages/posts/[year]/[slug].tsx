import { DocumentMetadata } from '@/types/DocumentMetadata';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { MarkdownNextImage } from '@/utils/MarkdownNextImage';
import { PostFooter } from '@/components/postFooter/postFooter';
import { TableOfContents } from '@/components/tableOfContents/TableOfContents';
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
  const posts = await getPosts('posts');
  const pageContent = await createPageFromMarkdown(
    'posts',
    params!.year,
    params!.slug
  );

  return {
    props: {
      pageContent,
      postMetadata: posts.find((x) => x.currentUrl.includes(params!.slug)),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: await recursivelyGetMarkdownFiles('posts'),
  fallback: false,
});

export default HowToPage;
