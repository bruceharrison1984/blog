import { DocumentMetadata } from '@/types/DocumentMetadata';
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

export const recursivelyGetMetadata = async (
  directoryPath: string,
  baseDir = 'content',
) => {
  const files = await recursivelyGetMarkdownFiles(directoryPath, baseDir);
  const metadata = await Promise.all(
    files.map((file) => {
      const markdownFile = fs.readFileSync(`${[baseDir, file].join('/')}.md`);
      const { data } = matter(markdownFile);
      return data as DocumentMetadata;
    }),
  );
  return metadata;
};

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

  let pageContent = unified()
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

  const match = pageContent.match('(<nav class="toc">.*</nav>)');
  pageContent = pageContent.replace(match![0], '');

  return { metadata: data, pageContent: pageContent, toc: match![0] };
};
