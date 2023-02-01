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
