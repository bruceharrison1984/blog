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
    <div className="flex justify-center">
      <article
        className="prose-sm md:prose"
        dangerouslySetInnerHTML={{ __html: pageContent }}
      />
      <nav
        className="prose pr-5 hidden lg:flex text-sm"
        dangerouslySetInnerHTML={{ __html: toc }}
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
