import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import {
  createPageFromMarkdown,
  recursivelyGetMarkdownFiles,
} from '@/utils/markdown';
import Head from 'next/head';

type HowToPageProps = {
  metadata: Record<string, string>;
  pageContent: string;
  toc: string;
};

const HowToPage: NextPage<HowToPageProps> = ({
  metadata,
  pageContent,
  toc,
}) => (
  <>
    <Head>
      <title>{metadata.title}</title>
    </Head>
    <div className="flex">
      <nav
        className="prose-sm pr-2 hidden md:flex"
        dangerouslySetInnerHTML={{ __html: toc }}
      />
      <article
        className="flex-1 prose max-w-[100] text-sm"
        dangerouslySetInnerHTML={{ __html: pageContent }}
      />
    </div>
  </>
);

export const getStaticProps: GetStaticProps<
  any,
  { slug: string; year: string }
> = async ({ params }) => {
  return {
    props: createPageFromMarkdown('howto', params!.year, params!.slug),
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: await recursivelyGetMarkdownFiles('howto'),
  fallback: false,
});

export default HowToPage;
