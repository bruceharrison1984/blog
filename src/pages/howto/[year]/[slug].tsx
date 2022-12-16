import {
  GetStaticPaths,
  GetStaticPathsResult,
  GetStaticProps,
  NextPage,
} from 'next';
import { unified } from 'unified';
import fs from 'fs';
import matter from 'gray-matter';
import recursiveRead from 'recursive-readdir';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import rehypeToc from '@jsdevtools/rehype-toc';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
// import md from 'markdown-it';

type HowToPageProps = {
  metadata: Record<string, string>;
  pageContent: string;
};

const HowToPage: NextPage<HowToPageProps> = ({ pageContent }) => {
  return (
    <div className="">
      <article dangerouslySetInnerHTML={{ __html: pageContent }} />
    </div>
  );
};

export const getStaticProps: GetStaticProps<
  any,
  { slug: string; year: string }
> = async ({ params }) => {
  console.log(params!.slug);
  return {
    props: createPageFromMarkdown(params!.year, params!.slug),
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = (await recursiveRead('content/howto')).map((x) =>
    x.replace('.md', '').replace('content', '').replaceAll('\\', '/'),
  );

  const staticPaths: GetStaticPathsResult = {
    paths,
    fallback: false,
  };
  return staticPaths;
};

const createPageFromMarkdown = (year: string, slug: string) => {
  const markdownFile = fs.readFileSync(
    `content/howto/${year}/${slug}.md`,
    'utf-8',
  );
  const { data, content } = matter(markdownFile);
  // md().render(content);
  const pageContent = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypeToc)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .processSync(content)
    .toString();

  return { metadata: data, pageContent: pageContent };
};

export default HowToPage;
