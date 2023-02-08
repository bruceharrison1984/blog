import { DocumentMetadata } from '@/types/DocumentMetadata';
import { HashElementNode, hashElement } from 'folder-hash';
import { bundleMDX } from 'mdx-bundler';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import imageSize, { Options } from 'rehype-img-size';
import recursiveRead from 'recursive-readdir';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import type { Plugin } from 'unified';
import type { Root } from 'hast';

const CONTENT_DIR = 'content';

type MarkdownFile = {
  filepath: string;
  url: string;
  year: number;
  slug: string;
  hash: string;
  pageContent: string;
  metadata: DocumentMetadata;
};

/** We have to override the type so mdx-bundler can make use of this plugin */
const imageSizeWrapper = imageSize as Plugin<[Options] | void[], Root, string>;

const pathRegex = new RegExp(/\\(.*)\\(\d{4})\\(.*).md$/);

/**
 * Retrieve a page out of the build cache
 * @param slug Name of the slug to match
 * @param year Name of the year to match
 * @returns MarkdownFile object
 */
export const getCachedPage = async (slug: string, year: number) => {
  const contentHash = await getFileHashes();
  const cacheFilename = `markdown-cache.${contentHash[0].hash}`;

  if (!existsSync(cacheFilename))
    throw new Error('Page cache could not be located!');

  const cacheFile = readFileSync(cacheFilename);
  const existingCacheData = JSON.parse(cacheFile.toString()) as MarkdownFile[];
  return existingCacheData.find((x) => x.slug === slug && x.year === year);
};

export const compileAndCacheMarkdown = async () => {
  const contentHash = await getFileHashes();
  const cacheFilename = `markdown-cache.${contentHash[0].hash}`;

  if (existsSync(cacheFilename)) {
    console.info("\n-= Files haven't changed, using cache =-");
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
      console.log(x);

      const regexResult = pathRegex.exec(x);
      if (!regexResult) throw new Error('Regex path parsing failed!');

      const [_, section, year, slug] = regexResult;
      const fileHash = contentHash.find((x) => x.name.includes(slug));
      const processedFile = await createPageFromMarkdown(section, year, slug);

      return {
        filepath: x,
        url: `/${[section, year, slug].join('/')}`,
        year: Number.parseInt(year),
        slug: slug,
        hash: fileHash?.hash,
        pageContent: processedFile.code,
        metadata: processedFile.frontmatter,
      } as MarkdownFile;
    })
  );

  console.log('4');

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

  return { code, frontmatter };
};

/**
 * Gets a list of all files and their hashes from the content directory
 * @returns
 */
const getFileHashes = async () => {
  const contentHash = await hashElement('./content', {
    files: { include: ['*.md'] },
  });

  const flattenNodes: (hashNode: HashElementNode) => HashElementNode[] = (
    hashNode: HashElementNode
  ) => {
    const hashes: HashElementNode[] = [hashNode];
    for (let index = 0; index < hashNode?.children?.length; index++) {
      hashes.push(...flattenNodes(hashNode.children[index]));
    }

    return hashes;
  };

  return flattenNodes(contentHash);
};
