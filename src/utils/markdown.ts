import { DocumentMetadata } from '@/types/DocumentMetadata';
import { bundleMDX } from 'mdx-bundler';
import fs from 'fs';
import imageSize, { Options } from 'rehype-img-size';
import matter from 'gray-matter';
import recursiveRead from 'recursive-readdir';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import type { Plugin } from 'unified';
import type { Root } from 'hast';

export const recursivelyGetMarkdownFiles = async (
  directoryPath: string,
  baseDir = 'content'
) =>
  (await recursiveRead([baseDir, directoryPath].join('/'))).map((x) =>
    x.replace('.md', '').replace(baseDir, '').replaceAll('\\', '/')
  );

export const recursivelyGetMetadata = async (
  directoryPath: string,
  baseDir = 'content',
  limit?: number
) => {
  const files = await recursivelyGetMarkdownFiles(directoryPath, baseDir);
  const metadata = await Promise.all(
    files.map((file) => {
      const markdownFile = fs.readFileSync(`${[baseDir, file].join('/')}.md`);
      const { data } = matter(markdownFile);
      data.currentUrl = file;
      return data as DocumentMetadata;
    })
  );
  const sortedMetadata = metadata
    .sort((x, y) => x.date.valueOf() - y.date.valueOf())
    .reverse();
  return sortedMetadata.slice(0, limit || sortedMetadata.length);
};

/** We have to override the type so mdx-bundler can make use of this plugin */
const imageSizeWrapper = imageSize as Plugin<[Options] | void[], Root, string>;

export const createPageFromMarkdown = async (
  directoryPath: string,
  year: string,
  slug: string,
  baseDir = 'content'
) => {
  const { code, frontmatter } = await bundleMDX({
    file: `${[baseDir, directoryPath, year, slug].join('/')}.md`,
    cwd: process.cwd(),
    mdxOptions: (o) => {
      o.remarkPlugins = [...(o.remarkPlugins ?? []), remarkGfm];
      o.rehypePlugins = [
        ...(o.rehypePlugins ?? []),
        rehypeAutolinkHeadings,
        rehypeSlug,
        rehypePrettyCode,
        [imageSizeWrapper, { dir: 'public' }],
      ];
      return o;
    },
    esbuildOptions(options, frontmatter) {
      options.minify = true;
      options.target = ['es2020'];
      return options;
    },
  });

  return { metadata: frontmatter, pageContent: code };
};
