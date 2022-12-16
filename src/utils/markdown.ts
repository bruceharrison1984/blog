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

export const recursivelyGetMarkdownFiles = async (
  directoryPath: string,
  baseDir = 'content',
) =>
  (await recursiveRead([baseDir, directoryPath].join('/'))).map((x) =>
    x.replace('.md', '').replace(baseDir, '').replaceAll('\\', '/'),
  );

export const createPageFromMarkdown = (
  directoryPath: string,
  year: string,
  slug: string,
  baseDir = 'content',
) => {
  const markdownFile = fs.readFileSync(
    `${[baseDir, directoryPath, year, slug].join('/')}.md`,
  );
  const { data, content } = matter(markdownFile);

  const pageContent = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeToc)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .processSync(content)
    .toString();

  return { metadata: data, pageContent: pageContent };
};
