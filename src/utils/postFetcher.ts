import { DocumentMetadata } from '@/types/DocumentMetadata';
import { recursivelyGetMarkdownFiles } from './markdown';
import fs from 'fs';
import matter from 'gray-matter';

export const getPosts = async (
  directoryPath: string,
  baseDir = 'content',
  limit?: number
) => {
  const files = await recursivelyGetMarkdownFiles(directoryPath, baseDir);
  const metadata = await Promise.all(
    files.map((file, i) => {
      const markdownFile = fs.readFileSync(`${[baseDir, file].join('/')}.md`);
      const { data } = matter(markdownFile);

      const metadata = data as DocumentMetadata;
      metadata.currentUrl = file;
      return metadata;
    })
  );
  const sortedMetadata = metadata.sort(
    (x, y) => y.date.valueOf() - x.date.valueOf()
  );
  const hydratedMetadata = sortedMetadata.map((x, i) => {
    x.previousPost = sortedMetadata[i + 1];
    x.nextPost = sortedMetadata[i - 1];
    return x;
  });
  return hydratedMetadata.slice(0, limit || sortedMetadata.length);
};
