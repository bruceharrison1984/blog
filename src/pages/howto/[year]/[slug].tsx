import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import {
  createPageFromMarkdown,
  recursivelyGetMarkdownFiles,
} from '@/utils/markdown';
import Head from 'next/head';

type HowToPageProps = {
  metadata: Record<string, string>;
  pageContent: string;
};

const HowToPage: NextPage<HowToPageProps> = ({ metadata, pageContent }) => (
  <>
    <Head>
      <title>{metadata.title}</title>
    </Head>
    <article dangerouslySetInnerHTML={{ __html: pageContent }} />
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
