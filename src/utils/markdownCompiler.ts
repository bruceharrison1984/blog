import { DocumentMetadata } from '@/types/DocumentMetadata';
import { MarkdownFile } from '@/types/MarkdownFile';
import { bundleMDX } from 'mdx-bundler';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { getCache, getFileHashes } from './markdownCache';
import imageSize, { Options } from 'rehype-img-size';
import recursiveRead from 'recursive-readdir';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import type { Plugin } from 'unified';
import type { Root } from 'hast';

const CONTENT_DIR = 'content';

/** We have to override the type so mdx-bundler can make use of this plugin */
const imageSizeWrapper = imageSize as Plugin<[Options] | void[], Root, string>;

const pathRegex = new RegExp(/\\(.*)\\(\d{4})\\(.*).md$/);

/**
 * Get a list of posts from the cache
 * @param limit Max number of posts to return
 * @returns Array of Markdown Files
 */
export const getPosts = async (limit?: number) => {
  const existingCacheData = await getCache();
  return existingCacheData.slice(0, limit || existingCacheData.length);
};

/**
 * Retrieve a page out of the build cache
 * @param slug Name of the slug to match
 * @param year Name of the year to match
 * @returns MarkdownFile object
 */
export const getCachedPage = async (slug: string, year: number) => {
  const existingCacheData = await getCache();
  return existingCacheData.find((x) => x.slug === slug && x.year === year);
};

/**
 * Build all markdown pages and store them in a file cache. This greatly speeds up subsequent builds.
 * @returns
 */
export const compileAndCacheMarkdown = async () => {
  const contentHash = await getFileHashes();
  const cacheFilename = `markdown-cache.${contentHash[0].hash.slice(0, 6)}`;

  if (existsSync(cacheFilename)) {
    const cacheFile = readFileSync(cacheFilename);
    const existingCacheData = JSON.parse(
      cacheFile.toString()
    ) as MarkdownFile[];
    return existingCacheData;
  }

  const filePaths = await (
    await recursiveRead(CONTENT_DIR)
  ).map((x) => x.replaceAll('/', '\\')); // make paths cross-platform

  const processedFiles = await Promise.all(
    filePaths.map(async (x) => {
      const regexResult = pathRegex.exec(x);

      if (!regexResult) throw new Error('Regex path parsing failed!');

      const [_, section, year, slug] = regexResult;
      const { hash } = contentHash.find((x) => x.name.includes(slug))!;
      const { pageContent, metadata } = await createPageFromMarkdown(
        section,
        year,
        slug
      );

      return {
        filepath: x,
        url: `/${[section, year, slug].join('/')}`,
        section,
        year: Number.parseInt(year),
        slug,
        hash,
        pageContent,
        metadata,
      } as MarkdownFile;
    })
  );

  const sortedProcessedFiles = processedFiles.sort(
    (x, y) => y.metadata.date.valueOf() - x.metadata.date.valueOf()
  );

  const processedFilesWithSiblings = sortedProcessedFiles.map((x, i) => {
    const previousPost = sortedProcessedFiles[i + 1];
    const nextPost = sortedProcessedFiles[i - 1];

    if (previousPost)
      x.metadata.previousPost = {
        title: previousPost.metadata.title,
        url: previousPost.url,
      };

    if (nextPost)
      x.metadata.nextPost = {
        title: nextPost.metadata.title,
        url: nextPost.url,
      };

    return x;
  });

  writeFileSync(
    cacheFilename,
    JSON.stringify(processedFilesWithSiblings, null, 2)
  );
  return processedFilesWithSiblings;
};

export const createPageFromMarkdown = async (
  directoryPath: string,
  year: string,
  slug: string,
  baseDir = 'content'
) => {
  const { code, frontmatter } = await bundleMDX<DocumentMetadata>({
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
    esbuildOptions(options) {
      options.minify = true;
      options.target = ['es2020'];
      return options;
    },
  });

  return { pageContent: code, metadata: frontmatter };
};
