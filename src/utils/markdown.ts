import { DocumentMetadata } from '@/types/DocumentMetadata';
import { bundleMDX } from 'mdx-bundler';
import imageSize, { Options } from 'rehype-img-size';
import recursiveRead from 'recursive-readdir';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import type { Plugin } from 'unified';
import type { Root } from 'hast';

/**
 * Get all markdown files recursively from a directory.
 * All paths are cleaned up into a form that resembles a url for getStaticProps
 * @param directoryPath Child directory to scan
 * @param baseDir The base content directory
 * @returns Array of URLs that correspond to the markdown file structure
 */
export const recursivelyGetMarkdownFiles = async (
  directoryPath: string,
  baseDir = 'content'
) => {
  const filePaths = await recursiveRead([baseDir, directoryPath].join('/'));
  const cleanPaths = filePaths.map((x) =>
    x.replace('.md', '').replace(baseDir, '').replaceAll('\\', '/')
  );

  return cleanPaths;
};

/** We have to override the type so mdx-bundler can make use of this plugin */
const imageSizeWrapper = imageSize as Plugin<[Options] | void[], Root, string>;

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
    esbuildOptions(options, frontmatter) {
      options.minify = true;
      options.target = ['es2020'];
      return options;
    },
  });

  return { metadata: frontmatter, pageContent: code };
};
